const express = require('express');
const Activity = require('../models/Activity');
const User = require('../models/User');
const auth = require('../middleware/Auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { filter } = req.query;
    const userId = req.user._id;
    let query = {};

    if (filter === 'Local') {
      const user = await User.findById(userId).populate('friends');
      const friendIds = user.friends.map(f => f._id);
      friendIds.push(userId);
      
      query = { userId: { $in: friendIds } };
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name username avatar')
      .populate('projectId', 'name type language')
      .limit(50);

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:userId', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('projectId', 'name type language')
      .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;