const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const matchSchema = new mongoose.Schema({
    type: {
        type: String,
        enum:['like','superLike','disLike'],
        default:'like'
    },
    sender: {
        type: Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    receiver: {
        type: Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    matched: {
        type: Boolean,
        default: false
    }

},{timestamps:true})

const matchModel = mongoose.model('match', matchSchema);

module.exports = matchModel;