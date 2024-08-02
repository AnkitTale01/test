const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const FcmTokenModel = new mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId, ref: 'users'
    },
    fcm_token: {
        type: String,
        default:""
    },
    platform: {
        type: String,
        default: "android"
    },
    provider: {
        type: String,
        default: "firebase"
    }

}, { timestamps: true })

module.exports = mongoose.model('fcm_token', FcmTokenModel)