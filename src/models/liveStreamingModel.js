const mongoose = require('mongoose');

const liveStreamingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId, ref: 'user',
        required: true
    },
    isLive: {
        type: Boolean,
        default: false
    },
    token : {
        type : String,
        default : ""
    },
    channelName : {
        type : String,
        default : ""
    },
}, { timestamps: true })

module.exports = mongoose.model('liveStreaming', liveStreamingSchema)