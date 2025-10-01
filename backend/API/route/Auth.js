const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/Auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    if(!req.body){
      return res.status(400).json({message:"Request body is missing"})
    }
    const { username, email, password, name } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    const user = new User({ username, email, password, name });
    await user.save();

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
        success: true,
    message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      $or: [{ email }, { username: email }] 
    });

    if (!user) {
      
      return res.status(400).json({ message: 'Invalid credentials',
        email: email,
        password: password

      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
       let pass=await bcrypt.hash(password, 10)
      return res.status(400).json({ message: 'Invalid credentials',
          email: email,
        password: pass
       });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
          success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      name: req.user.name,
      bio: req.user.bio,
      avatar: req.user.avatar
    }
  });
});

module.exports = router;