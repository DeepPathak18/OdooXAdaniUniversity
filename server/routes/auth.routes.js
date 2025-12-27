const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/verify-otp', authController.verifyOtp);
router.post('/google-signin', authController.googleSignin);
router.get('/github/callback', authController.githubCallback);

module.exports = router;