var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var saving = new Schema({
	schemeType:String,
	schemeNumber:Number,
	name:String,
	logo:String,
	interestRate:[{
		rate:Number,
		rateLabel:String
	}],
	maturityPeriod :String,
	minInvestment:String,
	maxInvestment:String,
	minBalance:String,
	minor:Boolean,
	online:Boolean,
	jointAccount:Boolean,
	nomination:Boolean,
	prematureClosure:Boolean,
	depositTaxFree:Boolean,
	interestTaxFree:Boolean,
	transfer:String,
	eligibility:[{
		eligibility:String,
	}],
	others:[{
		note:String
	}]
});

var Saving = mongoose.model('Saving',saving);
module.exports = Saving;