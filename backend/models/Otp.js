const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // OTP expires in 600 seconds (10 minutes)
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
});

// Create a TTL index on createdAt field for automatic document expiration
otpSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 600 });

// Hash OTP before saving
otpSchema.pre('save', async function (next) {
    if (this.isModified('otp')) {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
    }
    next();
});

// Method to compare OTP
otpSchema.methods.compareOtp = async function (enteredOtp) {
    return await bcrypt.compare(enteredOtp, this.otp);
};


const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
