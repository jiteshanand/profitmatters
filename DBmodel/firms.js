var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var firms = new Schema({
	firmNumber:Number,
	name:String,
	firmType:String,
	logo:String,
	exchange:String,
	investmentOption:{
		stocks:Boolean,
		options:Boolean,
		currency:Boolean,
		futures:Boolean,
		mutualFunds:Boolean,
		bonds:Boolean,
		commodity:Boolean,
		ipo:Boolean,
		etf:Boolean
	},
	firmFeature:{
		threeinOneAccount :Boolean,
		callAndTrade:Boolean,
		automatedTrading:Boolean,
		smsAlerts:Boolean,
		onlinePlatform:Boolean,
		brokerAssistance:Boolean,
		mobileApp:Boolean,
		researchReports:Boolean
	},
	firmFee:{
		tradingAccountOpening:String,
		tradingAndDematAccountOpening:String,
		commodityAccountOpening:String,
		tradingAccountAmc:String,
		dematAccountAmc:String
	},
	firmBrokerage:{
		plan:String,
		equityDelivery:String,
		equityIntraday:String,
		equityFutures:String,
		equityOptions:String,
		currencyFutures:String,
		currencyOptions:String,
		commodity:String,
		minimumBrokerage:String
	}

});

var Firm = mongoose.model('Firm',firms);
module.exports = Firm;