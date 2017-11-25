var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var insurance = new Schema({
	schemeType:String,
	schemeNumber:Number,
	intro:String,
	name:String,
	logo:String,
	entryAge:String,
	coverCeasing :String,
	premium:String,
	sumAssured:String,
	maturityBenefit:String,
	riskPeriod:Boolean,
	deathBenefit:[{
		benefit:String,
		benefitLabel:String
	}],
	eligibility:[{
		eligibility:String,
	}],
	others:[{
		note:String
	}]
});

var Insurance = mongoose.model('Insurance',insurance);
module.exports = Insurance;