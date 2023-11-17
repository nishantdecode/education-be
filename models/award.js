const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
    award_title:{
        type:String
       },
    award_desc:{
        type:String
       },    
    award_image_url:{
    type:String
   }
});

const Award = mongoose.model('Award', awardSchema);

module.exports = Award;