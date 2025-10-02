const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const multer = require('multer');
const puppeteer = require('puppeteer');

// Function to introduce a delay (kept for general utility, though replaced in PDF for networkidle0)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const xsltProcessor = require('xslt-processor');
const xsltProcess = xsltProcessor.xsltProcess;
const xmlParse = xsltProcessor.xmlParse;
const { validateXML } = require('xsd-schema-validator');
// jsPDF is not used for PDF generation with Puppeteer, so it can be removed if not used elsewhere.
// const { jsPDF } = require('jspdf');

// --- DIAGNOSTIC START ---
console.log('Checking xslt-processor exports:');
console.log('Type of xsltProcess:', typeof xsltProcess);
console.log('Type of xmlParse:', typeof xmlParse);
// --- DIAGNOSTIC END ---

const app = express();
const PORT = process.env.PORT || 3013;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type || req.path.split('/')[2];
    const dir = path.join(__dirname, 'uploads', type);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const filename = req.headers['x-file-name'] || file.originalname;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const validTypes = ['xml', 'xsd', 'xsl'];
    const type = req.params.type || req.path.split('/')[2];

    if (!validTypes.includes(type)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-file-name'],
  credentials: true
}));

app.use(express.json()); // Essential for parsing JSON request bodies
app.use(express.text({ type: 'application/xml' })); // For handling XML text bodies on PUT requests

// Routes

// File Upload Endpoint
app.post('/api/:type', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('Upload error: No file uploaded for /api/:type');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      fileName: req.file.filename,
      type: req.params.type
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// File Update Endpoint
app.put('/api/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;

    if (!['xml', 'xsd', 'xsl'].includes(type)) {
      console.log(`Update error: Invalid file type "${type}" for /api/:type/:filename`);
      return res.status(400).json({ error: 'Invalid file type' });
    }

    if (!req.body || typeof req.body !== 'string') {
      console.log(`Update error: No content provided or invalid content type for ${filename}`);
      return res.status(400).json({ error: 'No content provided or content is not text' });
    }

    const uploadDir = path.join(__dirname, 'uploads', type);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, req.body, 'utf8');

    res.json({
      success: true,
      message: 'File updated successfully',
      path: filePath
    });
  } catch (error) {
    console.error('File update error:', error);
    res.status(500).json({
      error: 'Failed to update file',
      details: error.message
    });
  }
});

// Get List of Files Endpoint
app.get('/api/:type', (req, res) => {
  try {
    const { type } = req.params;
    const dirPath = path.join(__dirname, 'uploads', type);

    if (!fs.existsSync(dirPath)) {
      return res.json([]);
    }

    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith(`.${type}`))
      .map(file => ({
        name: file,
        path: `${type}/${file}`,
        size: fs.statSync(path.join(dirPath, file)).size,
        modified: fs.statSync(path.join(dirPath, file)).mtime
      }));

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error listing files' });
  }
});

// Get File Content Endpoint
app.get('/api/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Determine content type based on file extension
    let contentType;
    if (filename.endsWith('.xml')) contentType = 'application/xml';
    else if (filename.endsWith('.xsd')) contentType = 'application/xml'; // XSDs are also XML
    else if (filename.endsWith('.xsl')) contentType = 'application/xml'; // XSLTs are also XML
    else contentType = 'application/octet-stream'; // Default for unknown types

    res.type(contentType).send(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ error: 'Error retrieving file' });
  }
});

// Delete File Endpoint
app.delete('/api/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

// Transform XML to HTML Endpoint
app.post('/api/transform/html', async (req, res) => {
  try {
    const { xml, xslt } = req.body;
    console.log(`[HTML Transform] Request received for XML: ${xml}, XSLT: ${xslt}`);

    if (!xml || !xslt) {
      console.log('[HTML Transform] Missing xml or xslt parameters in body. Sending 400.');
      return res.status(400).json({ error: 'Both xml and xslt parameters are required' });
    }

    const xmlPath = path.join(__dirname, 'uploads', 'xml', xml);
    const xsltPath = path.join(__dirname, 'uploads', 'xsl', xslt);

    console.log(`[HTML Transform] Looking for XML at: ${xmlPath}`);
    console.log(`[HTML Transform] Looking for XSLT at: ${xsltPath}`);

    if (!fs.existsSync(xmlPath)) {
      console.log(`[HTML Transform] XML file not found: ${xmlPath}. Sending 404.`);
      return res.status(404).json({ error: 'XML file not found' });
    }
    if (!fs.existsSync(xsltPath)) {
      console.log(`[HTML Transform] XSLT file not found: ${xsltPath}. Sending 404.`);
      return res.status(404).json({ error: 'XSLT file not found' });
    }

    console.log('[HTML Transform] Reading XML and XSLT file contents...');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    const xsltContent = fs.readFileSync(xsltPath, 'utf8');
    console.log('[HTML Transform] File contents read successfully.');

    console.log('[HTML Transform] Starting XSLT transformation...');
    const xmlDoc = xmlParse(xmlContent);
    const xsltDoc = xmlParse(xsltContent);
    const result = xsltProcess(xmlDoc, xsltDoc);
    console.log('[HTML Transform] XSLT transformation completed.');

    // Ensure the HTML is well-formed and self-contained for client-side rendering
    res.type('text/html').send(result);
    console.log('[HTML Transform] Response sent successfully.');
  } catch (error) {
    console.error('[HTML Transform] Transformation error:', error);
    res.status(500).json({ error: 'Transformation failed', details: error.message });
  }
});

// Transform XML to PDF Endpoint
app.post('/api/transform/pdf', async (req, res) => {
  let browser = null; // Initialize browser to null for proper cleanup
  try {
    const { xml, xslt } = req.body;
    console.log(`[PDF Transform] Request received for XML: ${xml}, XSLT: ${xslt}`);

    const xmlPath = path.join(__dirname, 'uploads', 'xml', xml);
    const xsltPath = path.join(__dirname, 'uploads', 'xsl', xslt);

    console.log(`[PDF Transform] Looking for XML at: ${xmlPath}`);
    console.log(`[PDF Transform] Looking for XSLT at: ${xsltPath}`);

    if (!fs.existsSync(xmlPath) || !fs.existsSync(xsltPath)) {
      console.log(`[PDF Transform] XML or XSLT file not found. XML exists: ${fs.existsSync(xmlPath)}, XSLT exists: ${fs.existsSync(xsltPath)}. Sending 404.`);
      return res.status(404).json({ error: 'XML or XSLT file not found' });
    }

    console.log('[PDF Transform] Reading XML and XSLT file contents...');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    const xsltContent = fs.readFileSync(xsltPath, 'utf8');
    console.log('[PDF Transform] File contents read successfully.');

    console.log('[PDF Transform] Starting XSLT transformation to HTML...');
    const xmlDoc = xmlParse(xmlContent);
    const xsltDoc = xmlParse(xsltContent);
    const html = xsltProcess(xmlDoc, xsltDoc);
    console.log('[PDF Transform] XSLT transformation to HTML completed.');

    // For debugging: Write the generated HTML to a file to inspect its content
    const previewHtmlPath = path.join(__dirname, 'preview.html');
    fs.writeFileSync(previewHtmlPath, html);
    console.log(`[PDF Transform] Transformed HTML preview written to ${previewHtmlPath}`);

    console.log('[PDF Transform] Launching Puppeteer browser...');
    browser = await puppeteer.launch({
      headless: true, // Use 'new' for new headless mode, or true/false
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Recommended for Docker/CI environments
    });
    const page = await browser.newPage();
    console.log('[PDF Transform] Puppeteer page created.');

    console.log('[PDF Transform] Setting HTML content and waiting for network idle...');
    // Use 'networkidle0' to ensure all network requests have settled before PDF generation
    await page.setContent(html, { waitUntil: 'networkidle0' });
    console.log('[PDF Transform] Page content set and network idle.');

    console.log('[PDF Transform] Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Ensure background colors/images are printed
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    console.log('[PDF Transform] PDF generated successfully.');

    res.type('application/pdf').send(pdfBuffer);
    console.log('[PDF Transform] PDF response sent.');
  } catch (error) {
    console.error('[PDF Transform] PDF generation error:', error);
    res.status(500).json({ error: 'PDF generation failed', details: error.message });
  } finally {
    if (browser) {
      await browser.close();
      console.log('[PDF Transform] Puppeteer browser closed.');
    }
  }
});

// XML Validation Endpoint
app.post('/validate', async (req, res) => {
    console.log("validating in a server");

  try {
    const { xml, xsd } = req.body;
      console.log("Received validation request for:", req.body);
      console.log(`Validation check: xml="${xml}", xsd="${xsd}"`);

    if (!xml || !xsd) {
        console.log('Validation error: Missing xml or xsd parameter. Sending 400.');
        return res.status(400).json({ error: 'Both xml and xsd parameters are required' });
    }
    const xmlPath = path.join(__dirname, 'uploads', 'xml', xml);
    const xsdPath = path.join(__dirname, 'uploads', 'xsd', xsd);

      console.log("Looking for XML at:", xmlPath);
      console.log("Looking for XSD at:", xsdPath);
        console.log("File exists?", {
    xml: fs.existsSync(xmlPath),
    xsd: fs.existsSync(xsdPath)
  });

    if (!fs.existsSync(xmlPath)) {
      return res.status(404).json({ error: 'XML file not found' });
    }
    if (!fs.existsSync(xsdPath)) {
      return res.status(404).json({ error: 'XSD file not found' });
    }
    try{
    const result = await validateXML({ file: xmlPath }, xsdPath);
    console.log('Validation result:', result);
    res.json({
    valid: result.valid,
    errors: result.errors || [],
    message: result.valid ? 'Validation successful' : 'Validation failed due to schema errors.'
    });
    }catch{
      return res.status(200).json({ error: 'XML validation failed' });
    }
    



  } catch (error) {
    console.error('An unexpected server-side validation error occurred:', error);

    let userMessage = 'An unexpected error occurred during validation. Please check server logs for details.';
    if (error.message) {
        if (error.messages && Array.isArray(error.messages) && error.messages.length > 0) {
            userMessage = `Validation processing error: ${error.messages.join('; ')}`;
        } else {
            userMessage = `Validation processing error: ${error.message}`;
        }
    }

    res.status(200).json({
      error: 'invalid xml',
      details: userMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST   /api/:type          - Upload file');
  console.log('  GET    /api/:type          - List files');
  console.log('  GET    /api/:type/:file    - Get file content');j
  console.log('  PUT    /api/:type/:file    - Update file content');
  console.log('  DELETE /api/:type/:file    - Delete file');
  console.log('  POST   /api/transform/html - Transform XML to HTML');
  console.log('  POST   /api/transform/pdf  - Transform XML to PDF');
  console.log('  POST   /validate           - Validate XML against XSD');
  console.log('  GET    /api/health         - Server health check');
});
