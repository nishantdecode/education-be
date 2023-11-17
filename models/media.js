const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    media_title:{
        type:String
       },
    media_desc:{
        type:String
       },    
    media_image_url:{
    type:String
   }
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;