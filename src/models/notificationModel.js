const mongoose =require('mongoose')
const Schema = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({

    title: {
        type: String,
        require:true
    },
    body: {
        type: String,
        require:true
    },
    image: {
        type: String,
        default:''
    },
    sendTo: {
        type: String,
        enum : ['all',"freeUser","goldUser","premiumUser","vipUser"],
        
    },
    type: {
        type: String,
        enum : ['in-app',"push","both"],
        
    },
    // sendToIds: {
    //     type: Array,
    //     default: null
    // },
    // action: {
    //     type: String,
    //     enum : ['user','event', 'swipe', 'complete_profile', 'none'],
    //     default: 'none'
    // },
    // actionId : {
    //     type: String,
    //     default: null
    // },
    // status:{
    //     type: String,
    //     enum : ['pending','sent','sending', 'cancelled'],
    //     default: 'pending'
    // }

}, { timestamps: true })

const notificationModel = mongoose.model('notifications', NotificationSchema);
module.exports=notificationModel;