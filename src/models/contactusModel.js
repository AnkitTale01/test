const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const contactUsSchema = new mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId, ref: 'user',
        require:true
    },
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    description: {
        type: String
    }

}, { timestamps: true })

const contactUsModel = mongoose.model('contactus', contactUsSchema);

module.exports = contactUsModel;