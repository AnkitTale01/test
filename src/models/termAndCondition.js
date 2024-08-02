const mongoose = require('mongoose');

const termandconditionSchema = new mongoose.Schema({
    text: {
        type: String
    }
}, { timestamps: true })

const termAndconditionModel = mongoose.model('termandcondition', termandconditionSchema);
module.exports = termAndconditionModel;