const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, changePassword, otpRequestLimiter, otpVerifyLimiter } = require('../controllers/otp.controller');

router.post('/request-otp', otpRequestLimiter, requestOtp);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);
router.post('/change-password', changePassword);

module.exports = router;