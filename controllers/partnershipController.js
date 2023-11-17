const { Partnership } = require('../models/index');
const s3 = require('../middlewares/s3');
// const { populate } = require('../models/user');

exports.createPartnership = async (req, res, next) => {
    try {
        const partnership = new Partnership({
            partnership_title: req.body.partnership_title,
            partnership_desc: req.body.partnership_desc
        });
        await partnership.save();
        for (let i = 0; i < req.files.length; i++) {
            let key = `partnerships/${partnership._id}/${req.files[i].originalname}`;
            let s3UploadResponse = await s3.uploadFile(process.env.AWS_BUCKET_NAME, key, req.files[i].buffer);
            partnership.partnership_images_url.push(s3UploadResponse.Location);
        }
        await partnership.save();
        res.status(200).json(partnership);
    } catch (error) {
        next(error);
    }
};


exports.getPartnership = async (req, res, next) => {
    try {
        const partnership = await Partnership.findById(req.params.id);
        if (partnership)
            res.json(partnership);
        else
            res.status(404).json({ error: 'Partnership not found' });
    } catch (error) {
        next(error);
    }
};


exports.updatePartnership = async (req, res, next) => {
    try {
        const existingpartnership = await Partnership.findById(req.params.id);
        if (existingpartnership) {
            const imageS3URL = existingpartnership.partnership_images_url;
            if (req.files) {
                // Generate a unique file name for the image
                const partnership_images_url = [];
                for (let i = 0; i < imageS3URL.length; i++) {
                    const imagename = imageS3URL[i].split('/').pop();
                    const key = `partnerships/${existingpartnership._id}/${imagename}`;

                    // Delete the previous images on S3.
                    const s3UploadResponse = await s3.deleteFile(process.env.AWS_BUCKET_NAME, key);
                }
                for (let i = 0; i < req.files.length; i++) {
                    const key = `partnerships/${existingpartnership._id}/${req.files[i].originalname}`;

                    // Store the new image on S3 and get the updated URL
                    const s3UploadResponse = await s3.uploadFile(process.env.AWS_BUCKET_NAME, key, req.files[i].buffer);
                    partnership_images_url.push(s3UploadResponse.Location);
                }
                existingpartnership.partnership_images_url = partnership_images_url;
            }
            existingpartnership.partnership_title = req.body.partnership_title || existingpartnership.partnership_title;
            existingpartnership.partnership_desc = req.body.partnership_desc || existingpartnership.partnership_desc;
            await existingpartnership.save();
            res.json({ message: 'Partnership updated successfully', existingpartnership });
        }
        else {
            res.status(404).json({ error: 'Partnership not found' });
        }
    } catch (error) {
        next(error);
    }
};



exports.deletePartnership = async (req, res, next) => {
    try {
        const existingpartnership = await Partnership.findById(req.params.id);
        if (existingpartnership) {
            const imageS3URL = existingpartnership.partnership_images_url;
            for (let i = 0; i < imageS3URL.length; i++) {
                const imagename = imageS3URL[i].split('/').pop();
                const key = `partnerships/${existingpartnership._id}/${imagename}`;

                // Delete the previous images on S3.
                const s3UploadResponse = await s3.deleteFile(process.env.AWS_BUCKET_NAME, key);
            }
            await Partnership.findByIdAndDelete(req.params.id);
            res.json({ message: 'Partnership deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Partnership not found' });
        }
    } catch (error) {
        next(error);
    }
};

