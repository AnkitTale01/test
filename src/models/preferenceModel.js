const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        trim: true,
        default: ''
    },
    is_active: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
}, { timestamps: true })

const preferenceModel = mongoose.model('preference', preferenceSchema);

module.exports = preferenceModel