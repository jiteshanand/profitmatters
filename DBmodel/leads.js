var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leads = new Schema({
	product:String,
	type:String,
	brokerName:String,
	schemeName:String,
	customerName:String,
	mobile:String,
	email:String,
	comment:String,
	createdDate:Date
});

var leads = mongoose.model('leads',leads);
module.exports = leads;