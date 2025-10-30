// 52_Masanabo
const express = require('express');
const Activity = require('../models/Activity');
const User = require('../models/User');
const auth = require('../middleware/Auth');

const router = express.Router();

// Get activities with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { filter, projectId, type } = req.query;
    const userId = req.user._id;
    let query = {};

    // Filter by scope (Local = user + friends)
    if (filter === 'Local') {
      const user = await User.findById(userId).populate('friends');
      const friendIds = user.friends.map(f => f._id);
      friendIds.push(userId);
      
      query.userId = { $in: friendIds };
    }

    // Filter by project
    if (projectId) {
      query.projectId = projectId;
    }

    if (type) {
      query.type = type;
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

// Get activities for specific user
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

// Get activities for specific project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name username avatar')
      .limit(50);

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity statistics
router.get('/stats/user/:userId', auth, async (req, res) => {
  try {
    const stats = await Activity.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;