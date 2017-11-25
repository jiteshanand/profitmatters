var Saving = require('../DBmodel/savingScheme');
module.exports = function(app) {

	// app.post('/govt',function(req,res,done){
	// 	var saving = new Saving({createdDate: Date.now()});
	// 	saving.save(function(err){
	// 		if (err) {
 //                return done(err);
 //            }
 //            else{
 //            	res.send("Table created");
 //            }
	// 	});
	// });

	app.get('/govt/listSaving', function(req, res) {
		Saving.find(function(err,saving){
			if(err){
				res.send(err);
			}
			res.json(saving);
		});
		});


	
};