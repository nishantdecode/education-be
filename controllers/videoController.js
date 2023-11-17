// controllers/videoController.js
const { createVideo } = require('../models/video');
const { Video } = require('../models/video'); // Import the Video model

const addVideo = async (req, res) => {
    const { title, thumbnailUrl, videoUrl } = req.body;
    const newVideo = await createVideo({ title, thumbnailUrl, videoUrl });
    res.json({ message: 'Video added successfully', video: newVideo });
}

const updateVideo = async (req, res) => {
    const videoId = parseInt(req.params.id);
    const { title, thumbnailUrl, videoUrl } = req.body;

    try {
        const videoToUpdate = await Video.findByPk(videoId);

        if (!videoToUpdate) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Update the video properties
        videoToUpdate.title = title;
        videoToUpdate.thumbnailUrl = thumbnailUrl;
        videoToUpdate.videoUrl = videoUrl;

        // Save the updated video
        await videoToUpdate.save();

        res.json({ message: 'Video updated successfully', video: videoToUpdate });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ message: 'Error updating video', error: error.message });
    }
}

const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.findAll();
        res.status(200).json({ message: 'All videos retrieved successfully', videos });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving videos', error: error.message });
    }
};

module.exports = {
    addVideo,
    updateVideo,
    getAllVideos
};
