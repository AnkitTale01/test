const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const querySchema = new mongoose.Schema({
    
    qId: {
        type: Schema.Types.ObjectId, ref: 'contactus',
        require:true
    },
    image: {
        type: String,
    },
    description: {
        type: String
    }

}, { timestamps: true })

const queryModel = mongoose.model('query', querySchema);

module.exports = queryModel;