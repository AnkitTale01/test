const mongoose = require('mongoose');

const adminSchema= new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    image:{
        type:String,
        default:''
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    token:{
        type: String,
        default: '',
    },
    role:{
        type:Array
    },
    is_blocked:{
        type: Boolean,
        default:false
    },
    type:{
        type: String,
        default:'subadmin'
    }
    
},{timestamps: true})

const adminModel= mongoose.model('admin',adminSchema);

module.exports= adminModel