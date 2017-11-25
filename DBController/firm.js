var Firm = require('../DBmodel/firms');
module.exports = function(app) {
	app.get('/firms/list', function(req, res) {
		Firm.find(function(err,firm){
			if(err){
				res.send(err);
			}
			res.json(firm);
		});
		});
};