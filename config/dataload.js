module.exports=function (app) {

	var mongoose = require('mongoose');
	//var history = require('../DBmodel/tables.js');
	var http = require('http');
	var request = require('request');

	var db = mongoose.connection;
	db.on('error', console.error);
	db.once('open', function() {
		var history = mongoose.model('history');
	});

		app.post('/addhistory',function(req,res,done){
			var historic = req.body;
			// console.log(req.body.Date);
			// console.log(historic);

			history.findOne({symbol:historic[0].symbol},function(err,recordfound){
				if (recordfound){

					console.log("already exist");
				}
				else{
			var record = new history();
				
				
				record.values = [];
				for (var i = 0; i < historic.length; i++) {
					record.symbol = historic[i].Symbol;
					// .substring(0,historic[row].symbol.indexOf("."));
					var valueobj = {
					date : Date.parse(historic[i].Date),
					open : historic[i].Open,
					close :historic[i].Close,
					high : historic[i].High,
					low :historic[i].Low,
					volume : historic[i].Volume
									};
					record.values.push(valueobj);
				}

				record.save(function(err){
				if(err){
				return done(err);
				}
				else{
					// return done(null,record);
					console.log("Insertion done");
				// return done(null,record);
				}	
				});	
		}		
			});
});


// app.get('/stock/:tickersymbol',function(req,res,done){
// 	var ticker = req.params.tickersymbol;
// 	console.log("'"+ticker+'.NS'+"'");
// 	history.findOne({symbol:ticker+'.NS'},function(err,graphdata){
// 		if (err) {			
// 				return done(err);
// 			}
// 		else{
			
// 			res.send(graphdata);
// 	}
// 	});
// });


};