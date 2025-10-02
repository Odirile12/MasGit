const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false, 
    default: '',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  language: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  hashtags: [String],
  status: {
    type: String,
    enum: ['Active', 'On Hold', 'Completed'],
    default: 'Active'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
avatar: {
  type: String,
  default: function () {
    return typeof this.name === 'string'
      ? this.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : '';
  }
},
  image: String,
  files: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 0
    },
    lastModified: {
      type: Date,
      default: Date.now
    }
  }],
  checkedOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  checkedOutAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);

