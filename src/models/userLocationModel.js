const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserLocationModel = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    location: {
        type: Object
    }

}, { timestamps: true })

module.exports = mongoose.model('userlocation', UserLocationModel)