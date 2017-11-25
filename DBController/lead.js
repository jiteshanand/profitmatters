var Lead = require('../DBmodel/leads');
var History = require('../DBmodel/mfHistory');
var Invest = require('../DBmodel/investment');

module.exports = function(app) {

app.post('/firms/addLead', function(req, res, done) {

    var lead = new Lead({ createdDate: Date.now() });
    lead.set('type', req.body.type);
    lead.set('product', req.body.product);
    lead.set('brokerName', req.body.brokerName);
    lead.set('customerName', req.body.customerName);
    lead.set('mobile', req.body.mobile);
    lead.set('email', req.body.email);
    lead.set('comment', req.body.comment);

    lead.save(function(err) {
        if (err) {
            return done(err);
        } else {
            //     console.log("Lead created with Id :"+lead._id);
            res.status(200).json(lead);
        }
    });

});

app.post('/mfBuy/addLead', function(req, res, done) {
    var price;
    var lead = new Lead({ createdDate: Date.now() });
    lead.set('type', req.body.type);
    lead.set('product', req.body.product);
    lead.set('brokerName', req.body.vendor);
    lead.set('customerName', req.body.customerName);
    lead.set('mobile', req.body.mobile);
    lead.set('email', req.body.email);
    lead.set('schemeName', req.body.schemeName);
    lead.set('comment', req.body.comment);


    History.find({ "navName": req.body.schemeName }, function(err, nav) {
        if (err) {
            return next(err);
        }
        if (nav.length > 0) {
            var price1 = nav[0].values.reverse();
            if(price1[0].open == undefined)
                price = price1[1].open;
            else
                price = price[0].open;
        }

        var invest = new Invest({
            createdDate: Date.now(),
            userId: req.body.email,
            investment: {
                category: 'Mutual Fund',
                name: req.body.schemeName,
                amount: price
            }
        });
    

    lead.save(function(err) {
        if (err) {
            return done(err);
        }
        else {
            res.status(200);
        }
    });

    invest.save(function(err) {
        if (err) {
            return done(err);
        }
        else {
            res.status(200);
        }
    });

    });
});

}
