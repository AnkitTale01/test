const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
    text: {
        type: String
    }
}, { timestamps: true })

const privacyModel = mongoose.model('privacy', privacySchema);
module.exports = privacyModel;