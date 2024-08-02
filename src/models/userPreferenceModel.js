const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userPreferenceSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'user',
        require:true
    },
    preferenceId: {
        type: Schema.Types.ObjectId, ref: 'preference',
    },

}, { timestamps: true })

const userPreferenceModel = mongoose.model('userPreference', userPreferenceSchema);

module.exports = userPreferenceModel