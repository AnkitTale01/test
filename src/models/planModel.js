const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    icon: {
        type: String,
        default :""
    },
    name: {
        type: String,
        // enum:["free","advance","premium","vip"],
        default: "free"
    },
    features: {
        type: String,
        default :""
    },
    price: {
        type: Number,
        required :true
    },
    discounted_price: {
        type: Number,
        required :true
    },
    validity: {
        type: String,
        default :""
    },
    is_active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const planModel = mongoose.model('plan', planSchema);

module.exports = planModel;