
var mongoose = require('mongoose'); 
require('dotenv').config();
    mongoose.connect(process.env.dburl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
     console.log("mongodb database connected");
   });
                
exports.test = function(req,res) {
  res.render('test');
};

