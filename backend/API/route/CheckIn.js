const express = require('express');
const Checkin = require('../models/CheckIn');
const auth = require('../middleware/Auth');

const router = express.Router();

router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const checkins = await Checkin.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name username avatar');

    res.json(checkins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const { search, type, hashtags } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { message: { $regex: search, $options: 'i' } },
        { projectName: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) query.type = type;
    if (hashtags) {
      const hashtagArray = hashtags.split(',');
      query.hashtags = { $in: hashtagArray };
    }

    const checkins = await Checkin.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name username avatar')
      .limit(50);

    res.json(checkins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
