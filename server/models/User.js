const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        trim: true,
        unique: true,
        sparse: true,
    },
    firstName: {
        type: String,
        required: false, // Make optional for OAuth users
        trim: true,
    },
    lastName: {
        type: String,
        required: false, // Make optional for OAuth users
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: false, // Make optional for OAuth users
        minlength: 6,
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true,
    },
    gender: {
        type: String,
        required: false,
        trim: true,
    },
    appwriteId: {
        type: String,
        unique: true,
        sparse: true, // Allow multiple null values
    },
    avatar: {
        type: String,
        required: false,
        default: '',
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true,
    },
    // Password reset fields
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// 🔒 Hash password before saving (only if password exists)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 🔑 Method to compare entered password with hashed one
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function() {
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

module.exports = mongoose.model('DETAIL', UserSchema);