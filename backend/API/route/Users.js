const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/Auth');

const router = express.Router();

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

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true }
    ).select('-password');

    res.json(user);
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