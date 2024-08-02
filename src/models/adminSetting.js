const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    likeLimitForFreeUser: {
        type: Number
    },
    superLikeLimitForFreeUser: {
        type: Number
    },
    matchLimitForFreeUser: {
        type: Number
    },
    userAccessLimit:{
        type:Number
    }
}, { timestamps: true }) 

const settingModel = mongoose.model('adminSetting', settingSchema);
module.exports = settingModel;