const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: [
      'project_created',
      'file_created',
      'file_modified', 
      'file_deleted',
      'member_added',
      'member_removed',
      'commit',
      'branch_created',
      'merge',
      'files_uploaded',
      'comment_added'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  projectName: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);