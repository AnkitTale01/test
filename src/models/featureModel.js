const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    feature: {
        type: String,
        trim: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'plan'
    },
    is_active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const featureModel = mongoose.model('feature', featureSchema);

module.exports = featureModel