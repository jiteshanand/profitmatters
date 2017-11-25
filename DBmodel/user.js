
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userschema = new Schema({
userId:String,
username:String,
name:{firstName:String,lastName:String},
gender:String,
email:String,
password:String,
type:String,
city:String,
state:String,
country:String,
pincode:Number,
followers:Number,
connections:Number
});

var User = mongoose.model('User',userschema);
module.exports = User;