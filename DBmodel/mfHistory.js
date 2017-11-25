var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mfHistory = new Schema({
	navCode: Number,
	schemeCode:Number,
	schemeName:String,
	ISINCode:String,
	values:   [{
		date: Date,
		NAV: Number,
	}]
});

var mfHistory = mongoose.model('mfHistory',mfHistory);
module.exports = mfHistory;