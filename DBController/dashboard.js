var Invest = require('../DBmodel/investment');

module.exports = function(app) {
	app.get('/investment/list', function(req, res) {
		Invest.find({ "userId": 'jiteshanand7@gmail.com' },function(err,investment){
			if(err){
				res.send(err);
			}
			res.json(investment);
		});
	});

};
