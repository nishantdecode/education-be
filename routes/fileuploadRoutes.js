const cloudinary = require('cloudinary').v2;
const router = require("express").Router();


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECREAT,
  });

router.post("/single",async (req,res)=>{
    const file = req.files.file
    console.log({file})
    const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "edmertion" });
    res.send({fileUrl:result.url})
})
module.exports.FileUploadRouter = router