const mongoose = require('mongoose');

const subAdminSchema= new mongoose.Schema({
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
    role:{
        type:Array,
       // enum:["orderManager","planManager","userManager","emailManager","reportManager","preferenceManager",]
    },
    token:{
        type: String,
        default: '',
    },
    is_blocked:{
        type: Boolean,
        default:false
    }
},{timestamps: true})

const subAdminModel= mongoose.model('subadmin',subAdminSchema);

module.exports= subAdminModel