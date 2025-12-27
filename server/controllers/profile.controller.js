const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('avatar');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// @route   PUT /api/profile/avatar
// @desc    Update user avatar
// @access  Private
const updateAvatar = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (req.file == undefined) {
      return res.status(400).json({ message: 'Error: No File Selected!' });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // The path should be accessible from the frontend
      const avatarPath = `/uploads/${req.file.filename}`;
      user.avatar = avatarPath;
      await user.save();

      res.json({
        message: 'Avatar updated successfully',
        avatar: avatarPath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
};

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // req.user is attached by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/me
// @desc    Update user profile
// @access  Private
const updateProfile = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, gender } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const changes = [];
        if (firstName && user.firstName !== firstName) {
            changes.push(`updated first name`);
        }
        if (lastName && user.lastName !== lastName) {
            changes.push(`updated last name`);
        }
        if (email && user.email !== email) {
            changes.push(`updated email`);
        }
        if (phoneNumber && user.phoneNumber !== phoneNumber) {
            changes.push(`updated phone number`);
        }
        if (gender && user.gender !== gender) {
            changes.push(`updated gender`);
        }

        if (changes.length > 0) {
            const description = `User ${changes.join(', ')}.`;
            const updateActivity = new Activity({
                user: user._id,
                activityType: 'profile_update',
                description: description,
            });
            await updateActivity.save();
        }

        // Build profile object for update
        const profileFields = {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,
            phoneNumber: phoneNumber || user.phoneNumber,
            gender: gender || user.gender,
        };

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        return res.json(updatedUser);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/profile/activity
// @desc    Get user activity
// @access  Private
const getActivity = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { updateAvatar, getProfile, updateProfile, getActivity };