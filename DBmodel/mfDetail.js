var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mutualFund = new Schema({
amcName: String,
amcNumber: Number,
schemes:  [
{
schemeName: 	  Number,
schemeBenchmarkIndex:String,
schemeRiskRating:Number,
schemeCrisilRating:Number,
schemeExpenseRatioRegular:Number,
schemeExpenseDatioDirect:Number,
schemeInceptionDate:Date,
schemeCategory:String,
schemeType:String,
schemeMinInvestment:Number,
schemeLoad:String,
schemeNav:[
{
	navCode:Number,
	navName:String,
	navPlan:String,
	navOption:String
}]
	}]
});

var mfdetail = mongoose.model('mfdetail',mutualFund);
module.exports = mfdetail;