const cloudinary = require('cloudinary').v2;
const router = require("express").Router();

router.post("/single",async (req,res)=>{
    const file = req.files.file
    console.log({file})
    const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "edmertion" });
    res.send({fileUrl:result.url})
})
module.exports.FileUploadRouter = router