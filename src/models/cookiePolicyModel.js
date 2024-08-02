const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
    text: {
        type: String
    }
}, { timestamps: true })

const cookieModel = mongoose.model('cookie', cookieSchema);
module.exports = cookieModel;