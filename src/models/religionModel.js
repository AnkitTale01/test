const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const religionSchema = new mongoose.Schema({
    name: {
        type: String,
        required :true
    },

}, { timestamps: true })

const religionModel = mongoose.model('religion', religionSchema);

module.exports = religionModel