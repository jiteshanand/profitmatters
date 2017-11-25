var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mutualFund = new Schema({
amcName: String,
amcId: Number,
schemeCode:Number,
schemeName:String,
schemeBenchmarkIndex:String,
schemeRiskRating:Number,
schemeCrisilRating:Number,
schemeExpenseRatioRegular:Number,
schemeExpenseDatioDirect:Number,
schemeCategory:String,
schemeType:String,
schemeEntryLoad:String,
schemeExitLoad:String,
schemeMinInvestmentAmount:String,
additionalPurchaseAmount:String,
sipAmount:String,
schemeManager:String
});

var mfund = mongoose.model('mfund',mutualFund);
module.exports = mfund;