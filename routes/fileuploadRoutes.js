const cloudinary = require('cloudinary').v2;
const router = require("express").Router();
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'dqoymwcc5', 
  api_key: '656782736376434', 
  api_secret: "uRxSwQ9Vpm1eAmpSUHdYcO63D3s" 
});

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

router.post("/single", upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.buffer, { resource_type: 'raw',folder: "edmertion" });
  
    // Send the file URL in the response
    res.json({ fileUrl: result.url });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

module.exports.FileUploadRouter = router;
