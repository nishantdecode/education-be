const cloudinary = require('cloudinary').v2;
const router = require("express").Router();


// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'dqoymwcc5', 
  api_key: '656782736376434', 
  api_secret: "uRxSwQ9Vpm1eAmpSUHdYcO63D3s" 
});

router.post("/single",async (req,res)=>{
    const file = req.files.file
    console.log({file})
    const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "edmertion" });
    res.send({fileUrl:result.url})
})
module.exports.FileUploadRouter = router