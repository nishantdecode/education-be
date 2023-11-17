const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    banner_title:{
        type:String
       },
    banner_desc:{
        type:String
       },    
    banner_image_url:{
    type:String
   }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;