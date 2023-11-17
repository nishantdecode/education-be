const { Award } = require('../models/index');
const s3 = require('../middlewares/s3');
const multer = require('multer');

exports.createAward = async (req, res, next) => {
  try {
    const award = new Award({
      award_title: req.body.award_title,
      award_desc: req.body.award_desc
    });
    await award.save();
    const key = `awards/${award._id}/${req.file.originalname}`;
    console.log(key);
    const s3UploadResponse = await s3.uploadFile(process.env.AWS_BUCKET_NAME, key, req.file.buffer);
    award.award_image_url = s3UploadResponse.Location;
    await award.save();
    res.status(200).json(award);
  } catch (error) {
    next(error);
  }
};


exports.getAward = async (req, res, next) => {
  try {
    const award = await Award.findById(req.params.id);
    if (award)
      res.json(award);
    else
      res.status(404).json({ error: 'Award not found' });
  } catch (error) {
    next(error);
  }
};


exports.updateAward = async (req, res, next) => {
  try {
    const existingaward = await Award.findById(req.params.id);
    if (existingaward) {
      let imageS3URL = existingaward.award_image_url;
      if (req.file) {
        // Generate a unique file name for the image
        const key = `awards/${existingaward._id}/${req.file.originalname}`;

        // Store the new image on S3 and get the updated URL and Deleting the previous image on S3
        const s3UploadResponse = await s3.uploadFile(process.env.AWS_BUCKET_NAME, key, req.file.buffer);
        existingaward.award_image_url = s3UploadResponse.Location;
        const imagename = imageS3URL.split('/').pop();
        const keydel = `awards/${existingaward._id}/${imagename}`;
        await s3.deleteFile(process.env.AWS_BUCKET_NAME, keydel);
      }
      existingaward.award_title = req.body.award_title || existingaward.award_title;
      existingaward.award_desc = req.body.award_desc || existingaward.award_desc;
      await existingaward.save();
      res.json({ message: 'Award updated successfully', existingaward });
    }
    else {
      res.status(404).json({ error: 'Award not found' });
    }
  } catch (error) {
    next(error);
  }
};



exports.deleteAward = async (req, res, next) => {
  try {
    const existingaward = await Award.findById(req.params.id);
    if (existingaward) {
      const imagename = existingaward.award_image_url.split('/').pop();
      const key = `awards/${existingaward._id}/${imagename}`;
      const s3UploadResponse = await s3.deleteFile(process.env.AWS_BUCKET_NAME, key);
      await Award.findByIdAndDelete(req.params.id);
      res.json({ message: 'Award deleted successfully' });
    }
    else {
      res.status(404).json({ error: 'Award not found' });
    }
  } catch (error) {
    next(error);
  }
};

