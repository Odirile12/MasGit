// 52_Masanabo
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/Auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all users (for search)
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'name username avatar')
      .populate('projects');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reject-friend/:id', auth, async (req, res) => {
  try {
    const friendId = req.params.id;
    const currentUserId = req.user._id;

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { 'friendRequests.received': friendId }
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { 'friendRequests.sent': currentUserId }
    });

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile with avatar upload
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
  try {
    const { name, bio, username } = req.body;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const updateData = { name, bio, username };

    // Handle avatar upload
    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update any user profile
router.put('/:id/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, bio, email, username } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, email, username },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete any user account
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send friend request
router.post('/friend-request/:id', auth, async (req, res) => {
  console.log(req.params.id)
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        console.log(targetUser)
      return res.status(400).json({ message: 'all ready sent' });
    }



    if (req.user.friends.includes(targetUserId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    if (req.user.friendRequests.sent.includes(targetUserId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $push: { 'friendRequests.sent': targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $push: { 'friendRequests.received': currentUserId }
    });

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept friend request
router.post('/accept-friend/:id', auth, async (req, res) => {
  try {
    const friendId = req.params.id;
    const currentUserId = req.user._id;

    // Add to friends list for both users
    await User.findByIdAndUpdate(currentUserId, {
      $push: { friends: friendId },
      $pull: { 'friendRequests.received': friendId }
    });

    await User.findByIdAndUpdate(friendId, {
      $push: { friends: currentUserId },
      $pull: { 'friendRequests.sent': currentUserId }
    });

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend
router.delete('/friend/:id', auth, async (req, res) => {
  try {
    const friendId = req.params.id;
    const currentUserId = req.user._id;

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friends: friendId }
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: currentUserId }
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    console.log("I was called")
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('friends', 'name username avatar')
      .populate('projects', 'name title');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
