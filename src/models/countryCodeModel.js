const mongoose = require('mongoose');

const countryCodeSchema = new mongoose.Schema({
    // name: {
    //     type: String
    // },
    country_Code:{
        type: String
    }
    
}, { timestamps: true })

const countryCodeModel = mongoose.model('country_code',countryCodeSchema );

module.exports = countryCodeModel;