const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

router.put('/avatar', protect, profileController.updateAvatar);
router.get('/me', protect, profileController.getProfile);
router.put('/me', protect, profileController.updateProfile);
router.get('/activity', protect, profileController.getActivity);

module.exports = router;