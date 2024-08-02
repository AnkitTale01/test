const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new mongoose.Schema({
    reason: {
        type: String
    },

}, { timestamps: true })

const reportModel = mongoose.model('report', reportSchema);

module.exports = reportModel