const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String
    },
    countryCode:{
        type: String
    },
    phoneCode:{
        type :String 
    }
    
}, { timestamps: true })

const countryModel = mongoose.model('country',countrySchema );

module.exports = countryModel;