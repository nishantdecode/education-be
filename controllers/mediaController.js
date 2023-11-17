const { Media } = require('../models/index');
const s3 = require('../middlewares/s3');
const multer = require('multer');

exports.createMedia = async (req, res, next) => {
  try {
    const media = new Media({
      media_title: req.body.media_title,
      media_desc: req.body.media_desc
    });
    await media.save();
    const key = `media/${media._id}/${req.file.originalname}`;
    const s3UploadResponse = await s3.uploadFile(process.env.AWS_BUCKET_NAME, key, req.file.buffer);
    media.media_image_url = s3UploadResponse.Location;
    await media.save();
    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
};


exports.getMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (media)
      res.json(media);
    else
      res.status(404).json({ error: 'Media not found' });
  } catch (error) {
    next(error);
  }
};


exports.updateMedia = async (req, res, next) => {
  try {
    const existingmedia = await Media.findById(req.params.id);
    if (existingmedia) {
      let imageS3URL = existingmedia.media_image_url;
      if (req.file) {
        // Generate a unique file name for the image
        const key = `media/${existingmedia._id}/${req.file.originalname}`;

        // Store the new image on S3 and get the updated URL and Deleting the previous image on S3
        const s3UploadResponse = await s3.uploadFile(process.env.AWS_BUCKET_NAME, key, req.file.buffer);
        existingmedia.media_image_url = s3UploadResponse.Location;
        const imagename = imageS3URL.split('/').pop();
        const keydel = `media/${existingmedia._id}/${imagename}`;
        await s3.deleteFile(process.env.AWS_BUCKET_NAME, keydel);
      }
      existingmedia.media_title = req.body.media_title || existingmedia.media_title;
      existingmedia.media_desc = req.body.media_desc || existingmedia.media_desc;
      await existingmedia.save();
      res.json({ message: 'Media updated successfully', existingmedia });
    }
    else {
      res.status(404).json({ error: 'Media not found' });
    }
  } catch (error) {
    next(error);
  }
};



exports.deleteMedia = async (req, res, next) => {
  try {
    const existingmedia = await Media.findById(req.params.id);
    if (existingmedia) {
      const imagename = existingmedia.media_image_url.split('/').pop();
      const key = `media/${existingmedia._id}/${imagename}`;
      const s3UploadResponse = await s3.deleteFile(process.env.AWS_BUCKET_NAME, key);
      await Media.findByIdAndDelete(req.params.id);
      res.json({ message: 'Media deleted successfully' });
    }
    else {
      res.status(404).json({ error: 'Media not found' });
    }
  } catch (error) {
    next(error);
  }
};

