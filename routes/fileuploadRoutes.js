const multer = require("multer");
const router = require("express").Router();
const { uploadFile } = require("../helper/cloudinaryHelper");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/single", upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await uploadFile(req.file);

    res.json({ fileUrl: result.url });
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

module.exports.FileUploadRouter = router;
