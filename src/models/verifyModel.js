const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verifySchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    image: {
        type: String
    },
    status :{
        type : Number
    }


}, { timestamps: true })

const verifyModel = mongoose.model('verify', verifySchema);

module.exports = verifyModel