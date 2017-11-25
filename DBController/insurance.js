var Insurance = require('../DBmodel/insuranceScheme');
module.exports = function(app) {

	// app.post('/govt',function(req,res,done){
	// 	var insurance = new Insurance({createdDate: Date.now()});
	// 	insurance.save(function(err){
	// 		if (err) {
 //                return done(err);
 //            }
 //            else{
 //            	res.send("Table created");
 //            }
	// 	});
	// });

	app.get('/govt/listInsurance', function(req, res) {
		Insurance.find(function(err,saving){
			if(err){
				res.send(err);
			}
			res.json(saving);
		});
		});


	
};