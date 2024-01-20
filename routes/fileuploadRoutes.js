const { singleFileUploadMiddleware, multipleFileUploadMiddleware } = require("../middlewares/file-upload.middlewares");
const { uploadFile } = require("../setup/s3.setup");


const router = require("express").Router();

router.post("/single",async (req,res)=>{
    const file = req.files
    console.log({file})
    // const result = await cloudinary.uploader.upload(imageFile.tempFilePath, { folder: "edmertion" });
    res.send({fileUrl:file})
})
module.exports.FileUploadRouter = router