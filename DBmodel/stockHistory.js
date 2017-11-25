var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockhistory = new Schema({

symbol:   String,
values:   [{
Date:     String,
Open: 	  Number,
Close:    Number,
High:     Number,
Low:      Number,
AdjClose:Number,
Volume:   Number
	}]
});

var History = mongoose.model('History',stockhistory);
module.exports = History;