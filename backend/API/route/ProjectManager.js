// 52_Masanabo
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const Project = require('../models/Project');
const auth = require('../middleware/Auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const projectId = req.params.projectId;
    const uploadDir = path.join(__dirname, '../../uploads/projects', projectId);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Preserve original filename
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Accept all file types for now, add restrictions if needed
    cb(null, true);
  }
});

// Middleware to check project access
async function checkProjectAccess(req, res, next) {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some(m => m.toString() === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Access denied. You must be a project member or owner.' });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error('Access check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// 1. Upload file(s) to project
router.post('/:projectId/upload', auth, checkProjectAccess, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      name: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    }));

    // Update project with new files
    req.project.files = [...(req.project.files || []), ...uploadedFiles];
    await req.project.save();

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// 2. Get all files in a project
router.get('/:projectId/files', auth, checkProjectAccess, async (req, res) => {
  try {
    const projectDir = path.join(__dirname, '../../uploads/projects', req.params.projectId);
    
    if (!fs.existsSync(projectDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(projectDir).map(filename => {
      const filePath = path.join(projectDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        name: filename,
        size: stats.size,
        modifiedAt: stats.mtime,
        isDirectory: stats.isDirectory()
      };
    });

    res.json({ files });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ message: 'Failed to read files' });
  }
});

// 3. View/Read a specific file
router.get('/:projectId/files/:filename', auth, checkProjectAccess, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads/projects', req.params.projectId, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    const stats = fs.statSync(filePath);
    
    // Check if it's a text file
    const textExtensions = ['.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md', '.xml', '.svg', '.py', '.java', '.c', '.cpp', '.h','.json'];
    const ext = path.extname(filename).toLowerCase();
    
    if (textExtensions.includes(ext)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.json({
        name: filename,
        content,
        size: stats.size,
        modifiedAt: stats.mtime,
        isText: true
      });
    } else {
      // For binary files, send file info only
      res.json({
        name: filename,
        size: stats.size,
        modifiedAt: stats.mtime,
        isText: false,
        message: 'Binary file - use download endpoint'
      });
    }
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ message: 'Failed to read file' });
  }
});

// 4. Edit/Update a file
router.put('/:projectId/files/:filename', auth, checkProjectAccess, async (req, res) => {
  try {
    const { filename } = req.params;
    const { content } = req.body;

    if (!content && content !== '') {
      return res.status(400).json({ message: 'No content provided' });
    }

    const filePath = path.join(__dirname, '../../uploads/projects', req.params.projectId, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Write updated content
    await fs.promises.writeFile(filePath, content, 'utf8');

    // Update project's updatedAt
    req.project.updatedAt = new Date();
    await req.project.save();

    res.json({
      success: true,
      message: 'File updated successfully',
      filename
    });
  } catch (error) {
    console.error('File update error:', error);
    res.status(500).json({ message: 'Failed to update file', error: error.message });
  }
});

// 5. Download a specific file
router.get('/:projectId/download/:filename', auth, checkProjectAccess, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads/projects', req.params.projectId, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, filename);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
});

// 6. Download entire project as ZIP
router.get('/:projectId/download-all', auth, checkProjectAccess, async (req, res) => {
  try {
    const projectDir = path.join(__dirname, '../../uploads/projects', req.params.projectId);

    if (!fs.existsSync(projectDir)) {
      return res.status(404).json({ message: 'No files found' });
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.attachment(`${req.project.name}-${Date.now()}.zip`);
    archive.pipe(res);

    archive.directory(projectDir, false);
    await archive.finalize();
  } catch (error) {
    console.error('Download all error:', error);
    res.status(500).json({ message: 'Failed to create archive' });
  }
});

// 7. Delete a file
router.delete('/:projectId/files/:filename', auth, checkProjectAccess, async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = req.user._id.toString();
    const isOwner = req.project.owner.toString() === userId;

    if (!isOwner) {
      return res.status(403).json({ message: 'Only project owner can delete files' });
    }

    const filePath = path.join(__dirname, '../../uploads/projects', req.params.projectId, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    fs.unlinkSync(filePath);

    // Remove from project files array
    req.project.files = req.project.files.filter(f => f.name !== filename);
    await req.project.save();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

// 8. Create new file in project
router.post('/:projectId/files/create', auth, checkProjectAccess, async (req, res) => {
  try {
    const { filename, content = '' } = req.body;

    if (!filename) {
      return res.status(400).json({ message: 'Filename is required' });
    }

    const projectDir = path.join(__dirname, '../../uploads/projects', req.params.projectId);
    
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    const filePath = path.join(projectDir, filename);

    if (fs.existsSync(filePath)) {
      return res.status(400).json({ message: 'File already exists' });
    }

    await fs.promises.writeFile(filePath, content, 'utf8');

    res.status(201).json({
      success: true,
      message: 'File created successfully',
      filename
    });
  } catch (error) {
    console.error('File creation error:', error);
    res.status(500).json({ message: 'Failed to create file', error: error.message });
  }
});

module.exports = router;