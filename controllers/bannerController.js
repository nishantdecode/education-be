const { Banner } = require('../models/index');
const s3 = require('../middlewares/s3');
// const { populate } = require('../models/user');

exports.createBanner = async (req, res, next) => {
    try {
        const banner = new Banner({
            banner_title: req.body.banner_title,
            banner_desc: req.body.banner_desc
        });
        await banner.save();
        const key = `banners/${banner._id}/${req.file.originalname}`;
        const s3UploadResponse = await s3.uploadFile(process.env.AWS_BUCKET_NAME, key, req.file.buffer);
        banner.banner_image_url = s3UploadResponse.Location;
        await banner.save();
        res.status(200).json(banner);
    } catch (error) {
        next(error);
    }
};


exports.getBanner = async (req, res, next) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner)
            res.json(banner);
        else
            res.status(404).json({ error: 'Banner not found' });
    } catch (error) {
        next(error);
    }
};


exports.updateBanner = async (req, res, next) => {
    try {
        const existingbanner = await Banner.findById(req.params.id);
        if (existingbanner) {
            let imageS3URL = existingbanner.banner_image_url;
            if (req.file) {
                // Generate a unique file name for the image
                const key = `banners/${existingbanner._id}/${req.file.originalname}`;

                // Store the new image on S3 and get the updated URL
                const s3UploadResponse = await s3.uploadFile(process.env.AWS_BUCKET_NAME, key, req.file.buffer);
                existingbanner.banner_image_url = s3UploadResponse.Location;
                const imagename = imageS3URL.split('/').pop();
                const keydel = `banners/${existingbanner._id}/${imagename}`;
                await s3.deleteFile(process.env.AWS_BUCKET_NAME, keydel);
            }
            existingbanner.banner_title = req.body.banner_title || existingbanner.banner_title;
            existingbanner.banner_desc = req.body.banner_desc || existingbanner.banner_desc;
            await existingbanner.save();

            res.json({ message: 'Banner updated successfully', existingbanner });
        }
        else {
            res.status(404).json({ error: 'Banner not found' });
        }
    } catch (error) {
        next(error);
    }
};



exports.deleteBanner = async (req, res, next) => {
    try {
        const existingbanner = await Banner.findById(req.params.id);
        if (existingbanner) {
            const imagename = existingbanner.banner_image_url.split('/').pop();
            const key = `banners/${existingbanner._id}/${imagename}`;
            const s3UploadResponse = await s3.deleteFile(process.env.AWS_BUCKET_NAME, key);
            await Banner.findByIdAndDelete(req.params.id);
            res.json({ message: 'Banner deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Banner not found' });
        }
    } catch (error) {
        next(error);
    }
};

