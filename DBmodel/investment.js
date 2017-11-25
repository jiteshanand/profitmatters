var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invest = new Schema({
	userId:String,
	investment:{
		category:String,
		name:String,
		unitAmount:Number,
		quantity:Number,
		totalAmount:Number,
		currentValue:Number
	}
});

var Investment = mongoose.model('Investment',invest);
module.exports = Investment;