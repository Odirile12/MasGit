// const express = require('express');
// const multer = require('multer');
// const upload = require('../middleware/MulterConfig')
// const Project = require('../models/Project');
// const User = require('../models/User');
// const Activity = require('../models/Activity');
// const Checkin = require('../models/CheckIn');
// const auth = require('../middleware/Auth');

// const router = express.Router();

// router.get('/', auth, async (req, res) => {
//   try {
//     const { search, filter, sortBy, type, language } = req.query;
//     const userId = req.user._id;
    
//     let query = {};
    
//     if (filter === 'Local') {
//       const user = await User.findById(userId).populate('friends');
//       const friendIds = user.friends.map(f => f._id);
//       query = {
//         $or: [
//           { owner: userId },
//           { owner: { $in: friendIds }, isPrivate: false },
//           { members: userId }
//         ]
//       };
//     } else {
//       query = { isPrivate: false };
//     }

//     if (search) {
//       query.$and = query.$and || [];
//       query.$and.push({
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { description: { $regex: search, $options: 'i' } },
//           { hashtags: { $in: [new RegExp(search, 'i')] } },
//           { type: { $regex: search, $options: 'i' } }
//         ]
//       });
//     }

//     if (type) query.type = type;
//     if (language) query.language = language;

//     // Fetch projects first
//     let projects = await Project.find(query)
//       .populate('owner', 'name username avatar')
//       .populate('members', 'name username avatar')
//       .limit(100); // Get more projects before sorting

//     // Sort in JavaScript for complex sorting
//     if (sortBy === 'Popular') {
//       // Sort by number of members (popularity), then by recent
//       projects.sort((a, b) => {
//         const membersCompare = (b.members?.length || 0) - (a.members?.length || 0);
//         if (membersCompare !== 0) return membersCompare;
//         return new Date(b.updatedAt) - new Date(a.updatedAt);
//       });
//     } else {
//       // Default to Recent (newest first)
//       projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//     }

//     // Limit to 50 after sorting
//     projects = projects.slice(0, 50);

//     const formattedProjects = projects.map(project => ({
//       id: project._id,
//       name: project.name,
//       title: project.title,
//       description: project.description,
//       owner: project.owner,
//       ownerName: project.ownerName,
//       language: project.language,
//       type: project.type,
//       hashtags: project.hashtags,
//       status: project.status,
//       isPrivate: project.isPrivate,
//       avatar: project.avatar,
//       image: project.image,
//       updatedAt: project.updatedAt,
//       members: project.members,
//       membersCount: project.members?.length || 0, // Add this for debugging
//       checkedOutBy: project.checkedOutBy
//     }));

//     res.json(formattedProjects);
//   } catch (error) {
//     console.error('Error in projects route:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get project by ID
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id)
//       .populate('owner', 'name username avatar')
//       .populate('members', 'name username avatar')
//       .populate('checkedOutBy', 'name username avatar');

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     // Ensure req.user exists (auth middleware should set this)
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: 'Unauthorized: user not found' });
//     }

//     const userId = req.user._id.toString();
//     const isMember = project.members.some(m => m._id.toString() === userId);
//     const isOwner = project.owner._id.toString() === userId;

//     if (project.isPrivate && !isMember && !isOwner) {
//       return res.status(403).json({ message: 'Access denied to private project' });
//     }

//     return res.json(project);
//   } catch (error) {
//     console.error('Error fetching project:', error.message);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });


// // Create new project
// router.post('/', upload.fields([
//   { name: 'files', maxCount: 10 },
//   { name: 'image', maxCount: 1 }
// ]), auth, async (req, res) => {
//   console.log(req.body)
//   try {
//     if(req.body==undefined){
//         return res.status(400).json({ message: 'Filename is required for file creation' });

//     }
//     const { 
//       name, 
//       title, 
//       description, 
//       language, 
//       type, 
//       hashtags, 
//       isPrivate, 
//       image,
//       // File creation fields (optional)
//       filename,
//       content,
//       action // 'create_project', 'create_file', or both
//     } = req.body;

//     let project;
//     let activity;

//     // Handle project creation (if action includes project creation or is undefined for backward compatibility)
//     if (!action || action === 'create_project' || action === 'both') {
//       project = new Project({
//         name: name || title,
//         title,
//         description,
//         owner: req.user._id,
//         ownerName: req.user.username,
//         members: [req.user._id],
//         language,
//         type,
//         hashtags: hashtags || [],
//         isPrivate: isPrivate || false,
//         image,
//         files: []
//       });

//       await project.save();

//       // Add to user's projects
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { projects: project._id }
//       });

//       // Create activity for project creation
//       activity = new Activity({
//         userId: req.user._id,
//         username: req.user.username,
//         userAvatar: req.user.avatar,
//         type: 'project_created',
//         description: 'created a new project',
//         projectId: project._id,
//         projectName: project.name,
//         metadata: {
//           projectType: type,
//           language
//         }
//       });
//       await activity.save();
//     }

//     // Handle file creation (if action includes file creation or both)
//     if ((action === 'create_file' || action === 'both') && filename) {
//       // If creating file only (without project), we need to get project from somewhere
//       if (!project) {
//         // You might want to get project from user's recent project or require projectId in body
//         // For now, let's assume we're creating file in the newly created project
//         return res.status(400).json({ 
//           message: 'Cannot create file without a project. Include project creation data or specify existing projectId.' 
//         });
//       }

//       if (!filename) {
//         return res.status(400).json({ message: 'Filename is required for file creation' });
//       }

//       const projectId = project._id.toString();
//       const projectDir = path.join(__dirname, '../../uploads/projects', projectId);
      
//       if (!fs.existsSync(projectDir)) {
//         fs.mkdirSync(projectDir, { recursive: true });
//       }

//       const filePath = path.join(projectDir, filename);

//       if (fs.existsSync(filePath)) {
//         return res.status(400).json({ message: 'File already exists' });
//       }

//       await fs.promises.writeFile(filePath, content || '', 'utf8');

//       // Add file to project's files array
//       project.files.push({
//         filename,
//         path: filePath,
//         createdAt: new Date()
//       });
//       await project.save();

//       // Create activity for file creation if project was also created
//       if (action === 'both') {
//         const fileActivity = new Activity({
//           userId: req.user._id,
//           username: req.user.username,
//           userAvatar: req.user.avatar,
//           type: 'file_created',
//           description: `created file ${filename} in project`,
//           projectId: project._id,
//           projectName: project.name,
//           metadata: {
//             filename,
//             projectType: type,
//             language
//           }
//         });
//         await fileActivity.save();
//       }
//     }

//     // Prepare response based on what was created
//     let response = { success: true };
    
//     if (project) {
//       await project.populate('owner', 'name username avatar');
//       response.project = project;
//     }
    
//     if (filename && project) {
//       response.file = {
//         filename,
//         message: 'File created successfully'
//       };
//     }

//     res.status(201).json(response);

//   } catch (error) {
//     console.error('Combined endpoint error:', error);
//     res.status(500).json({ 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// });

// // Update project
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
    
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     // Check if user is owner
//     if (project.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to update this project' });
//     }

//     const updatedProject = await Project.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     ).populate('owner', 'name username avatar')
//      .populate('members', 'name username avatar');

//     res.json(updatedProject);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete project
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
    
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (project.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to delete this project' });
//     }

//     await Project.findByIdAndDelete(req.params.id);
    
//     // Remove from user's projects
//     await User.findByIdAndUpdate(req.user._id, {
//       $pull: { projects: req.params.id }
//     });

//     res.json({ message: 'Project deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Check out project
// router.post('/:id/checkout', auth, async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
    
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (project.checkedOutBy && project.checkedOutBy.toString() !== req.user._id.toString()) {
//       return res.status(400).json({ message: 'Project is already checked out by another user' });
//     }

//     project.checkedOutBy = req.user._id;
//     project.checkedOutAt = new Date();
//     await project.save();

//     res.json({ message: 'Project checked out successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Check in project
// router.post('/:id/checkin', auth, async (req, res) => {
//   try {
//     const { message, files } = req.body;
//     const project = await Project.findById(req.params.id);
    
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (!project.checkedOutBy || project.checkedOutBy.toString() !== req.user._id.toString()) {
//       return res.status(400).json({ message: 'Project is not checked out by you' });
//     }

//     // Update project files if provided
//     if (files && files.length > 0) {
//       project.files = [...project.files, ...files.map(file => ({
//         ...file,
//         lastModified: new Date()
//       }))];
//     }

//     project.checkedOutBy = null;
//     project.checkedOutAt = null;
//     await project.save();

   
//     const checkin = new Checkin({
//       projectId: project._id,
//       projectName: project.name,
//       userId: req.user._id,
//       username: req.user.username,
//       userAvatar: req.user.avatar,
//       message,
//       type: 'check-in',
//       files: files || [],
//       hashtags: project.hashtags
//     });
//     await checkin.save();

//     // Create activity
//     const activity = new Activity({
//       userId: req.user._id,
//       username: req.user.username,
//       userAvatar: req.user.avatar,
//       type: 'project_contributed',
//       description: 'contributed to',
//       projectId: project._id,
//       projectName: project.name,
//       metadata: {
//         checkinMessage: message
//       }
//     });
//     await activity.save();

//     res.json({ message: 'Project checked in successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Add member to project
// router.post('/:id/members', auth, async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const project = await Project.findById(req.params.id);
    
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (project.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only project owner can add members' });
//     }

//     if (project.members.includes(userId)) {
//       return res.status(400).json({ message: 'User is already a member' });
//     }

//     project.members.push(userId);
//     await project.save();

//     await project.populate('members', 'name username avatar');
//     res.json(project);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// router.post('/', upload.array('files', 10), auth, async (req, res) => {

//     console.log('=== ROUTE START ===');
//     console.log('Request body keys:', Object.keys(req.body));
//     console.log('Request body values:', req.body);
//     console.log('Files received:', req.files?.length || 0);
//     console.log('User:', req.user?.username);
//   try {



//     // Handle case where body might be empty or undefined
//     const body = req.body || {};
    
//     // Extract fields with safe defaults
//     const { 
//       name = '', 
//       title = '', 
//       description = '', 
//       language = 'javascript', 
//       type = 'web', 
//       hashtags = '', 
//       isPrivate = 'false', 
//       image = '',
//       filename = '',
//       content = '',
//       action = 'create_project'
//     } = body;

//     console.log('Parsed fields:', {
//       name, title, description, language, type, hashtags, isPrivate, action
//     });

//     let project;
//     let activities = [];

//     // Handle project creation
//     if (action === 'create_project' || action === 'both' || action === 'all') {
//       // Validate required fields
//       if (!title && !name) {
//         return res.status(400).json({ 
//           message: 'Project title or name is required' 
//         });
//       }

//       project = new Project({
//         name: name || title,
//         title: title || name,
//         description: description || '',
//         owner: req.user._id,
//         ownerName: req.user.username,
//         members: [req.user._id],
//         language: language || 'javascript',
//         type: type || 'web',
//         hashtags: typeof hashtags === 'string' ? 
//           hashtags.split(',').map(tag => tag.trim()).filter(tag => tag) : 
//           [],
//         isPrivate: isPrivate === 'true' || isPrivate === true,
//         image: req.files && req.files.find(f => f.fieldname === 'image') ? 
//                req.files.find(f => f.fieldname === 'image').filename : (image || ''),
//         files: []
//       });

//       await project.save();

//       // Add to user's projects
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { projects: project._id }
//       });

//       // Create activity for project creation
//       const projectActivity = new Activity({
//         userId: req.user._id,
//         username: req.user.username,
//         userAvatar: req.user.avatar,
//         type: 'project_created',
//         description: 'created a new project',
//         projectId: project._id,
//         projectName: project.name,
//         metadata: {
//           projectType: type,
//           language
//         }
//       });
//       await projectActivity.save();
//       activities.push(projectActivity);
//     }

//     // Handle file uploads
//     if ((action === 'upload_files' || action === 'both' || action === 'all') && req.files && req.files.length > 0) {
//       // Filter out the image file if it was uploaded
//       const uploadedFiles = req.files.filter(file => file.fieldname !== 'image');
      
//       if (uploadedFiles.length > 0) {
//         if (!project) {
//           // If no project was created, try to use existing project from projectId
//           const { projectId } = body;
//           if (projectId) {
//             project = await Project.findById(projectId);
//             if (!project) {
//               return res.status(400).json({ 
//                 message: 'Project not found' 
//               });
//             }
//           } else {
//             return res.status(400).json({ 
//               message: 'Cannot upload files without a project' 
//             });
//           }
//         }

//         const fileDataArray = uploadedFiles.map(file => ({
//           name: file.originalname,
//           path: file.path,
//           size: file.size,
//           mimetype: file.mimetype,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date(),
//           isUploaded: true
//         }));

//         // Update project with uploaded files
//         project.files = [...(project.files || []), ...fileDataArray];
//         await project.save();

//         // Create activity for file uploads
//         const uploadActivity = new Activity({
//           userId: req.user._id,
//           username: req.user.username,
//           userAvatar: req.user.avatar,
//           type: 'files_uploaded',
//           description: `uploaded ${uploadedFiles.length} file(s)`,
//           projectId: project._id,
//           projectName: project.name,
//           metadata: {
//             fileCount: uploadedFiles.length,
//             filenames: uploadedFiles.map(f => f.originalname),
//             projectType: project.type,
//             language: project.language
//           }
//         });
//         await uploadActivity.save();
//         activities.push(uploadActivity);
//       }
//     }

//     // Handle file creation from content
//     if ((action === 'create_file' || action === 'both' || action === 'all') && filename) {
//       if (!project) {
//         return res.status(400).json({ 
//           message: 'Cannot create file without a project' 
//         });
//       }

//       const projectId = project._id.toString();
//       const projectDir = path.join(__dirname, '../uploads/projects', projectId);
      
//       if (!fs.existsSync(projectDir)) {
//         fs.mkdirSync(projectDir, { recursive: true });
//       }

//       const filePath = path.join(projectDir, filename);

//       if (fs.existsSync(filePath)) {
//         return res.status(400).json({ message: 'File already exists' });
//       }

//       await fs.promises.writeFile(filePath, content || '', 'utf8');

//       // Add file to project's files array
//       const fileData = {
//         name: filename,
//         path: filePath,
//         size: Buffer.from(content || '').length,
//         mimetype: 'text/plain',
//         uploadedBy: req.user._id,
//         uploadedAt: new Date(),
//         isCreated: true
//       };

//       project.files.push(fileData);
//       await project.save();

//       // Create activity for file creation
//       const fileActivity = new Activity({
//         userId: req.user._id,
//         username: req.user.username,
//         userAvatar: req.user.avatar,
//         type: 'file_created',
//         description: `created file ${filename}`,
//         projectId: project._id,
//         projectName: project.name,
//         metadata: {
//           filename,
//           projectType: project.type,
//           language: project.language
//         }
//       });
//       await fileActivity.save();
//       activities.push(fileActivity);
//     }

//     // Prepare response
//     let response = { success: true };
    
//     if (project) {
//       await project.populate('owner', 'name username avatar');
//       response.project = project;
//     }
    
//     if (filename && project) {
//       response.createdFile = {
//         filename,
//         message: 'File created successfully'
//       };
//     }

//     if (req.files && req.files.filter(f => f.fieldname !== 'image').length > 0 && project) {
//       response.uploadedFiles = {
//         count: req.files.filter(f => f.fieldname !== 'image').length,
//         files: req.files.filter(f => f.fieldname !== 'image').map(f => f.originalname),
//         message: 'Files uploaded successfully'
//       };
//     }

//     console.log('=== ROUTE SUCCESS ===');
//     res.status(201).json(response);

//   } catch (error) {
//     console.error('=== ROUTE ERROR ===', error);
    
//     // Clean up uploaded files if error occurred
//     if (req.files) {
//       req.files.forEach(file => {
//         if (fs.existsSync(file.path)) {
//           fs.unlinkSync(file.path);
//         }
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// });



// module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Checkin = require('../models/CheckIn');
const auth = require('../middleware/Auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/projects');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all projects with filters
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

    let projects = await Project.find(query)
      .populate('owner', 'name username avatar')
      .populate('members', 'name username avatar')
      .limit(100);

    if (sortBy === 'Popular') {
      projects.sort((a, b) => {
        const membersCompare = (b.members?.length || 0) - (a.members?.length || 0);
        if (membersCompare !== 0) return membersCompare;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    } else {
      projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

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
      membersCount: project.members?.length || 0,
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
router.post('/', upload.single('image'), auth, async (req, res) => {
  try {
    const { 
      name, 
      title, 
      description, 
      language, 
      type, 
      hashtags, 
      isPrivate
    } = req.body;

    if (!title && !name) {
      return res.status(400).json({ message: 'Project title or name is required' });
    }

    const project = new Project({
      name: name || title,
      title: title || name,
      description: description || '',
      owner: req.user._id,
      ownerName: req.user.username,
      members: [req.user._id],
      language: language || 'javascript',
      type: type || 'web',
      hashtags: typeof hashtags === 'string' ? 
        hashtags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      isPrivate: isPrivate === 'true' || isPrivate === true,
      image: req.file ? req.file.filename : '',
      files: []
    });

    await project.save();

    // Create project directory
    const projectDir = path.join(__dirname, '../../projects', project._id.toString());
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

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
    res.status(201).json({ success: true, project });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

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

    // Delete project directory
    const projectDir = path.join(__dirname, '../../projects', req.params.id);
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }

    await Project.findByIdAndDelete(req.params.id);
    
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { projects: req.params.id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// FILE MANAGEMENT ROUTES

// Get file content
router.get('/:id/files/:filename', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const isMember = project.members.some(m => m._id.toString() === userId);
    const isOwner = project.owner.toString() === userId;

    if (project.isPrivate && !isMember && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const projectDir = path.join(__dirname, '../../projects', req.params.id);
    const filePath = path.join(projectDir, req.params.filename);

    // Security: prevent path traversal
    if (!filePath.startsWith(projectDir)) {
      return res.status(403).json({ message: 'Invalid file path' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    const content = await fs.promises.readFile(filePath, 'utf8');
    res.json({ content });

  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new file
// Create new file - FIXED VERSION
router.post('/:id/files', auth, async (req, res) => {
  try {
    const { filename, content } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const isMember = project.members.some(m => m._id.toString() === userId);
    const isOwner = project.owner.toString() === userId;

    if (!isMember && !isOwner) {
      return res.status(403).json({ message: 'Only members and owner can create files' });
    }

    if (!filename) {
      return res.status(400).json({ message: 'Filename is required' });
    }

    const projectDir = path.join(__dirname, '../../projects', req.params.id);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    const filePath = path.join(projectDir, filename);

    if (fs.existsSync(filePath)) {
      return res.status(400).json({ message: 'File already exists' });
    }

    await fs.promises.writeFile(filePath, content || '', 'utf8');

    // Get file extension and determine type
    const getFileType = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      const typeMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'css': 'css',
        'html': 'html',
        'json': 'json',
        'md': 'markdown',
        'txt': 'text',
        'xml': 'xml',
        'sql': 'sql',
        'sh': 'shell',
        'yml': 'yaml',
        'yaml': 'yaml'
      };
      return typeMap[ext] || 'text';
    };

    // Add file to project with all required fields
    project.files.push({
      name: filename,
      path: filePath,
      type: getFileType(filename), // FIXED: Added type field
      size: Buffer.from(content || '').length,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    });
    await project.save();

    // Create activity
const activity = new Activity({
  userId: req.user._id,
  username: req.user.username,
  userAvatar: req.user.avatar,
  type: 'file_created', // This is now valid
  description: `created file ${filename}`,
  projectId: project._id,
  projectName: project.name,
  metadata: { filename }
});
    await activity.save();

    res.status(201).json({ message: 'File created successfully', filename });

  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update file content
router.post('/:id/files/upload', upload.array('files', 10), auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const isMember = project.members.some(m => m._id.toString() === userId);
    const isOwner = project.owner.toString() === userId;

    if (!isMember && !isOwner) {
      return res.status(403).json({ message: 'Only members and owner can upload files' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const projectDir = path.join(__dirname, '../../projects', req.params.id);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    // Helper function to determine file type from filename
    const getFileType = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      const typeMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'css': 'css',
        'html': 'html',
        'json': 'json',
        'md': 'markdown',
        'txt': 'text',
        'xml': 'xml',
        'sql': 'sql',
        'sh': 'shell',
        'yml': 'yaml',
        'yaml': 'yaml',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'r': 'r'
      };
      return typeMap[ext] || 'text';
    };

    const uploadedFiles = [];

    for (const file of req.files) {
      const targetPath = path.join(projectDir, file.originalname);
      await fs.promises.rename(file.path, targetPath);

      // FIXED: Include type field based on file extension
      project.files.push({
        name: file.originalname,
        path: targetPath,
        type: getFileType(file.originalname), // FIXED: Added type field
        size: file.size,
        mimetype: file.mimetype,
        uploadedBy: req.user._id,
        uploadedAt: new Date()
      });

      uploadedFiles.push(file.originalname);
    }

    await project.save();

    // Create activity
    const activity = new Activity({
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.avatar,
      type: 'files_uploaded',
      description: `uploaded ${uploadedFiles.length} file(s)`,
      projectId: project._id,
      projectName: project.name,
      metadata: { filenames: uploadedFiles }
    });
    await activity.save();

    res.json({ 
      message: 'Files uploaded successfully', 
      files: uploadedFiles 
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download file
router.get('/:id/files/:filename/download', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const isMember = project.members.some(m => m._id.toString() === userId);
    const isOwner = project.owner.toString() === userId;

    if (project.isPrivate && !isMember && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const projectDir = path.join(__dirname, '../../projects', req.params.id);
    const filePath = path.join(projectDir, req.params.filename);

    if (!filePath.startsWith(projectDir)) {
      return res.status(403).json({ message: 'Invalid file path' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, req.params.filename);

  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete file
router.delete('/:id/files/:filename', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const isMember = project.members.some(m => m._id.toString() === userId);
    const isOwner = project.owner.toString() === userId;

    if (!isMember && !isOwner) {
      return res.status(403).json({ message: 'Only members and owner can delete files' });
    }

    const projectDir = path.join(__dirname, '../../projects', req.params.id);
    const filePath = path.join(projectDir, req.params.filename);

    if (!filePath.startsWith(projectDir)) {
      return res.status(403).json({ message: 'Invalid file path' });
    }

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    project.files = project.files.filter(f => f.name !== req.params.filename);
    await project.save();

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error);
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

    const activity = new Activity({
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.avatar,
      type: 'project_contributed',
      description: 'contributed to',
      projectId: project._id,
      projectName: project.name,
      metadata: { checkinMessage: message }
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