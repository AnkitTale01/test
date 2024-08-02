const mongoose = require('mongoose');

const keyTypeSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const keyTypeModel = mongoose.model('keyType', keyTypeSchema);

module.exports = keyTypeModel