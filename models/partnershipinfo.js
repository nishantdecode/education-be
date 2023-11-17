const mongoose = require('mongoose');

const partnershipSchema = new mongoose.Schema({
    partnership_title: {
        type: String
    },
    partnership_desc: {
        type: String
    },
    partnership_images_url: {
        type: [String]
    }
});

const Partnership = mongoose.model('Partnership', partnershipSchema);

module.exports = Partnership;