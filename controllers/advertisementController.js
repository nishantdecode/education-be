//this code is with cloudinary intregation currently giving error  "Must supply api_key"

// const cloudinary = require('cloudinary').v2;
// const { Advertisement } = require('../models/advertisement');
// const { createAdvertisement } = require('../models/advertisement');

// const createAdd = async (req, res) => {
//     const { title, description } = req.body;

//     if (!req.files || !req.files.image) {
//         return res.status(400).json({ message: 'No image file provided' });
//     }

//     const imageFile = req.files.image;

//     if (!imageFile.tempFilePath) {
//         return res.status(400).json({ message: 'Image file path is missing' });
//     }

//     try {
//         const result = await cloudinary.uploader.upload(imageFile.tempFilePath, { folder: "socialhive-api" });

//         const advertisement = await createAdvertisement({ title, description, imageUrl: result.url });

//         res.status(201).json({ message: 'Advertisement created successfully', advertisement });
//     } catch (error) {
//         console.error('Error in createAdvertisement:', error);
//         res.status(500).json({
//             message: 'Error creating advertisement',
//             error: error.message,
//             stack: error.stack
//         });
//     }
// };

// const getAllAdvertisements = async (req, res) => {
//     try {
//         const advertisements = await Advertisement.findAll();
//         res.status(200).json({ message: 'All advertisements retrieved successfully', advertisements });
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving advertisements', error: error.message });
//     }
// };

// const getAdvertisementById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const advertisement = await Advertisement.findByPk(id);
//         if (!advertisement) {
//             return res.status(404).json({ message: 'Advertisement not found' });
//         }
//         res.status(200).json({ message: 'Advertisement retrieved successfully', advertisement });
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving advertisement', error: error.message });
//     }
// };

// const updateAdvertisement = async (req, res) => {
//     const { id } = req.params;
//     const { title, description } = req.body;

//     try {
//         const advertisement = await Advertisement.findByPk(id);
//         if (!advertisement) {
//             return res.status(404).json({ message: 'Advertisement not found' });
//         }

//         advertisement.title = title;
//         advertisement.description = description;

//         if (req.files && req.files.image) {
//             const imageFile = req.files.image;
//             if (imageFile.tempFilePath) {
//                 const result = await cloudinary.uploader.upload(imageFile.tempFilePath, { folder: "advertisements" });
//                 advertisement.imageUrl = result.url;
//             }
//         }

//         await advertisement.save();

//         res.status(200).json({ message: 'Advertisement updated successfully', advertisement });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating advertisement', error: error.message });
//     }
// };

// const deleteAdvertisement = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const advertisement = await Advertisement.findByPk(id);
//         if (!advertisement) {
//             return res.status(404).json({ message: 'Advertisement not found' });
//         }

//         await advertisement.destroy();
//         res.status(200).json({ message: 'Advertisement deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting advertisement', error: error.message });
//     }
// };

// module.exports = {
//     createAdd,
//     getAllAdvertisements,
//     getAdvertisementById,
//     updateAdvertisement,
//     deleteAdvertisement,
// };




const { Advertisement } = require('../models/advertisement');
const { createAdvertisement } = require('../models/advertisement');

const createAdd = async (req, res) => {
    const { title, description, imageUrl } = req.body;

    try {
        const advertisement = await createAdvertisement({ title, description, imageUrl });
        res.status(201).json({ message: 'Advertisement created successfully', advertisement });
    } catch (error) {
        res.status(500).json({ message: 'Error creating advertisement', error: error.message });
    }
};

const getAllAdvertisements = async (req, res) => {
    try {
        const advertisements = await Advertisement.findAll();
        res.status(200).json({ message: 'All advertisements retrieved successfully', advertisements });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving advertisements', error: error.message });
    }
};

const getAdvertisementByTitle = async (req, res) => {
    try {
        const { title } = req.body;
        const advertisement = await Advertisement.findOne({ 
            where: { title },
            order: [['createdAt', 'DESC']]
        });

        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        res.status(200).json({ message: 'Advertisement retrieved successfully', advertisement });
    } catch (error) {
        console.error('Error retrieving advertisement:', error);
        res.status(500).json({ message: 'Error retrieving advertisement', error: error.message });
    }
};

const getAdvertisementById = async (req, res) => {
    const { id } = req.params;

    try {
        const advertisement = await Advertisement.findByPk(id);
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }
        res.status(200).json({ message: 'Advertisement retrieved successfully', advertisement });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving advertisement', error: error.message });
    }
};

const updateAdvertisement = async (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    try {
        const advertisement = await Advertisement.findByPk(id);
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        advertisement.title = title;
        advertisement.description = description;
        advertisement.imageUrl = imageUrl;

        await advertisement.save();

        res.status(200).json({ message: 'Advertisement updated successfully', advertisement });
    } catch (error) {
        res.status(500).json({ message: 'Error updating advertisement', error: error.message });
    }
};

const deleteAdvertisement = async (req, res) => {
    const { id } = req.params;

    try {
        const advertisement = await Advertisement.findByPk(id);
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        await advertisement.destroy();

        res.status(200).json({ message: 'Advertisement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting advertisement', error: error.message });
    }
};

module.exports = {
    createAdd,
    getAllAdvertisements,
    getAdvertisementByTitle,
    getAdvertisementById,
    updateAdvertisement,
    deleteAdvertisement,
};