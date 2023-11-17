const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    Question:{
        type:String
    },
    Answer:{
        type:String
    }
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;