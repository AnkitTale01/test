const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    key_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'keyTypes'
    },
    is_active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const keyModel = mongoose.model('key', keySchema);

module.exports = keyModel