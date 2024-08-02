const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userReportSchema = new mongoose.Schema({
    senderId: {
        type: Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    reason: {
        type: Schema.Types.ObjectId, ref: 'report',
        require: true
    },
    image: {
        type: String
    },
    description:{
        type: String
    },
    status:{
        type:Boolean,
        default:false
    }

},{ timestamps: true })


const userReportModel = mongoose.model('userReport', userReportSchema);

module.exports = userReportModel