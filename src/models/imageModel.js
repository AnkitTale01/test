const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  imageSchema= new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId, ref: 'user',
        require:true
    },
    image:{
        type: String,
        trim:true
    },
    

},{ timestamps: true })

const imageModel =mongoose.model('image',imageSchema)
module.exports=imageModel;