var History = require('../DBmodel/stockHistory');
module.exports = function(app) {
	
	app.get('/stock/list/:code', function(req, res) {
		var code = req.params.code;
		//console.log(code);
		History.find({"symbol":code},function(err,history){
			if(err){
				res.send(err);
			}
			res.json(history);
		});
		});
};