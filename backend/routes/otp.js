const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const User = require('../models/User');
const Otp = require('../models/Otp');

// --- Nodemailer Configuration ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- Rate Limiting ---
const otpRequestLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1, // Limit each IP to 1 OTP request per windowMs
    message: { success: false, message: 'Too many OTP requests. Please try again in a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 verification attempts per windowMs
    message: { success: false, message: 'Too many verification attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});


// --- Routes ---

/**
 * @route   POST /api/otp/request-otp
 * @desc    Request a password reset OTP
 * @access  Public
 */
router.post('/request-otp', otpRequestLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Still send a success-like response to prevent user enumeration
            return res.status(200).json({ success: true, message: 'If an account with this email exists, an OTP has been sent.' });
        }

        // Generate a secure 6-digit OTP
        const otpCode = crypto.randomInt(100000, 999999).toString();

        // Save the hashed OTP to the database
        const newOtp = new Otp({
            email,
            otp: otpCode, // The 'pre-save' hook in the model will hash this
        });
        await newOtp.save();

        // Send email
        const mailOptions = {
            from: `"UISOCIAL Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Password Reset Code',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Password Reset Request</h2>
                    <p>Hello ${user.firstName || ''},</p>
                    <p>You requested a password reset. Please use the following One-Time Password (OTP) to proceed.</p>
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #ff6b6b;">${otpCode}</p>
                    <p>This code is valid for <strong>10 minutes</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Thanks,<br>The UISOCIAL Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'An OTP has been sent to your email.' });

    } catch (error) {
        console.error('Error in /request-otp:', error);
        res.status(500).json({ success: false, message: 'Server error. Could not send OTP.' });
    }
});

/**
 * @route   POST /api/otp/verify-otp
 * @desc    Verify the OTP
 * @access  Public
 */
router.post('/verify-otp', otpVerifyLimiter, async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    try {
        // Find the most recent OTP for this email that is not verified
        const otpRecord = await Otp.findOne({ email, isVerified: false }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid OTP or no pending request found.' });
        }

        const isMatch = await otpRecord.compareOtp(otp);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        // Mark OTP as verified to allow password change
        otpRecord.isVerified = true;
        await otpRecord.save({ timestamps: false }); // Prevent createdAt from updating

        res.status(200).json({ success: true, message: 'OTP verified successfully. You can now change your password.' });

    } catch (error) {
        console.error('Error in /verify-otp:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});


/**
 * @route   POST /api/otp/change-password
 * @desc    Change the user's password after OTP verification
 * @access  Public
 */
router.post('/change-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    try {
        // Find a recently verified OTP for this email
        const verifiedOtp = await Otp.findOne({ email, isVerified: true });

        if (!verifiedOtp) {
            return res.status(400).json({ success: false, message: 'Password change not authorized. Please verify OTP first.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // This should not happen if OTP was issued, but as a safeguard
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Hash and update the password
        user.password = newPassword; // The pre-save hook in User model will hash it
        await user.save();

        // Delete the used OTP record
        await Otp.deleteOne({ _id: verifiedOtp._id });

        res.status(200).json({ success: true, message: 'Password changed successfully.' });

    } catch (error) {
        console.error('Error in /change-password:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});


module.exports = router;
