const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const subscriptionSchema = new mongoose.Schema({
    planId: {
        type: Schema.Types.ObjectId, ref: 'plan',
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId, ref: 'user',
        require: true
    },
    // transectionId: {
    //     type: String
    // },
    amount: {
        type: Number
    },
    validity:{
      type : Date
    }
}, { timestamps: true })
const subscriptionModel = mongoose.model('subscription', subscriptionSchema);
module.exports = subscriptionModel;
