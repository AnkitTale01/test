
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    
    sendTo: {
        type:String,
        enum:['all','freeUser','goldUser','premiumUser','vipUser'],
    },
    subject:{
        type:String
    },
    description: {
        type: String
    }
     
}, { timestamps: true })

const emailModel = mongoose.model('email', emailSchema);
module.exports = emailModel;