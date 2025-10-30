// 52_Masanabo
const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userAvatar: String,
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['check-in', 'check-out'],
    required: true
  },
  files: [{
    name: String,
    action: {
      type: String,
      enum: ['added', 'modified', 'deleted']
    }
  }],
  hashtags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Checkin', checkinSchema);