const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question:{
        type: String,
        require:true
    },
    answer:{
        type:String,
        require:true
    }

},{timestamps:true})

const FaqModel =mongoose.model('faq',faqSchema);

module.exports=FaqModel;