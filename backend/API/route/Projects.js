const express = require('express');

const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Checkin = require('../models/CheckIn');
const auth = require('../middleware/Auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { search, filter, sortBy, type, language } = req.query;
    const userId = req.user._id;
    
    let query = {};
    
    if (filter === 'Local') {
      const user = await User.findById(userId).populate('friends');
      const friendIds = user.friends.map(f => f._id);
      query = {
        $or: [
          { owner: userId },
          { owner: { $in: friendIds }, isPrivate: false },
          { members: userId }
        ]
      };
    } else {
      query = { isPrivate: false };
    }

    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { hashtags: { $in: [new RegExp(search, 'i')] } },
          { type: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (type) query.type = type;
    if (language) query.language = language;

    // Fetch projects first
    let projects = await Project.find(query)
      .populate('owner', 'name username avatar')
      .populate('members', 'name username avatar')
      .limit(100); // Get more projects before sorting

    // Sort in JavaScript for complex sorting
    if (sortBy === 'Popular') {
      // Sort by number of members (popularity), then by recent
      projects.sort((a, b) => {
        const membersCompare = (b.members?.length || 0) - (a.members?.length || 0);
        if (membersCompare !== 0) return membersCompare;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    } else {
      // Default to Recent (newest first)
      projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    // Limit to 50 after sorting
    projects = projects.slice(0, 50);

    const formattedProjects = projects.map(project => ({
      id: project._id,
      name: project.name,
      title: project.title,
      description: project.description,
      owner: project.owner,
      ownerName: project.ownerName,
      language: project.language,
      type: project.type,
      hashtags: project.hashtags,
      status: project.status,
      isPrivate: project.isPrivate,
      avatar: project.avatar,
      image: project.image,
      updatedAt: project.updatedAt,
      members: project.members,
      membersCount: project.members?.length || 0, // Add this for debugging
      checkedOutBy: project.checkedOutBy
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error('Error in projects route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name username avatar')
      .populate('members', 'name username avatar')
      .populate('checkedOutBy', 'name username avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure req.user exists (auth middleware should set this)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    const userId = req.user._id.toString();
    const isMember = project.members.some(m => m._id.toString() === userId);
    const isOwner = project.owner._id.toString() === userId;

    if (project.isPrivate && !isMember && !isOwner) {
      return res.status(403).json({ message: 'Access denied to private project' });
    }

    return res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Create new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, title, description, language, type, hashtags, isPrivate, image } = req.body;

    const project = new Project({
      name: name || title,
      title,
      description,
      owner: req.user._id,
      ownerName: req.user.username,
      members: [req.user._id],
      language,
      type,
      hashtags: hashtags || [],
      isPrivate: isPrivate || false,
      image,
      files: []
    });

    await project.save();

    // Add to user's projects
    await User.findByIdAndUpdate(req.user._id, {
      $push: { projects: project._id }
    });

    // Create activity
    const activity = new Activity({
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.avatar,
      type: 'project_created',
      description: 'created a new project',
      projectId: project._id,
      projectName: project.name,
      metadata: {
        projectType: type,
        language
      }
    });
    await activity.save();

    await project.populate('owner', 'name username avatar');
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner', 'name username avatar')
     .populate('members', 'name username avatar');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    
    // Remove from user's projects
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { projects: req.params.id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check out project
router.post('/:id/checkout', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.checkedOutBy && project.checkedOutBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Project is already checked out by another user' });
    }

    project.checkedOutBy = req.user._id;
    project.checkedOutAt = new Date();
    await project.save();

    res.json({ message: 'Project checked out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check in project
router.post('/:id/checkin', auth, async (req, res) => {
  try {
    const { message, files } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.checkedOutBy || project.checkedOutBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Project is not checked out by you' });
    }

    // Update project files if provided
    if (files && files.length > 0) {
      project.files = [...project.files, ...files.map(file => ({
        ...file,
        lastModified: new Date()
      }))];
    }

    project.checkedOutBy = null;
    project.checkedOutAt = null;
    await project.save();

   
    const checkin = new Checkin({
      projectId: project._id,
      projectName: project.name,
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.avatar,
      message,
      type: 'check-in',
      files: files || [],
      hashtags: project.hashtags
    });
    await checkin.save();

    // Create activity
    const activity = new Activity({
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.avatar,
      type: 'project_contributed',
      description: 'contributed to',
      projectId: project._id,
      projectName: project.name,
      metadata: {
        checkinMessage: message
      }
    });
    await activity.save();

    res.json({ message: 'Project checked in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add member to project
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can add members' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();

    await project.populate('members', 'name username avatar');
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
