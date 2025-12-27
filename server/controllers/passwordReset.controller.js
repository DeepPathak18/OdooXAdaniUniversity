const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer transporter setup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("FATAL ERROR: EMAIL_USER and EMAIL_PASS environment variables are not set.");
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User with that email does not exist.' });
        }

        // Generate a 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Code',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n\
                   Your password reset code is: ${resetCode}\n\n\
                   This code will expire in one hour.\n\n\
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'A password reset code has been sent to ' + user.email + '.' });
        } catch (emailError) {
            console.error('Nodemailer Error:', emailError);
            return res.status(500).json({ message: 'Failed to send email. Please check server logs for details.', error: emailError.message });
        }

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).send('Error in sending email');
    }
};

const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordToken: code,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset code is invalid or has expired.' });
        }

        res.status(200).json({ message: 'Code verified. You can now reset your password.' });

    } catch (error) {
        console.error('Verify Code Error:', error);
        res.status(500).send('Server error');
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordToken: code,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset code is invalid or has expired.' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    forgotPassword,
    verifyCode,
    resetPassword,
};