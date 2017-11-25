//var Fund = require('../DBmodel/mfdetail');
var Fund = require('../DBmodel/mfund');
var MHistory = require('../DBmodel/mfHistory');
var Invest = require('../DBmodel/investment');
var feed = require("feed-read");
var schedule = require('node-schedule');
var PythonShell = require('python-shell');
var https = require('https');
var request = require('request');
var async = require("async");
// var sleep = require("sleep");
var counter = 0;

module.exports = function(app) {

    function getTodayDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

    app.get('/mf/mflist/:listType', function(req, res, next) {
        var listType = req.params.listType;
        if (listType == 'ELSS') {
            Fund.find({ "schemeCategory": listType }, function(err, fund) {
                if (err) {
                    return next(err);
                }
                res.json(fund);
            });
        } else if (listType == 'lowRisk') {
            Fund.find({ "riskProfile": 'Low' }, function(err, fund) {
                if (err) {
                    return next(err);
                }
                res.json(fund);
            });
        } else if (listType == 'highRisk') {
            Fund.find({ "riskProfile": 'High' }, function(err, fund) {
                if (err) {
                    return next(err);
                }
                res.json(fund);
            });
        } else if (listType == 'topPerformer') {
            Fund.find({ "Crisil Rating": listType }, function(err, fund) {
                if (err) {
                    return next(err);
                }
                res.json(fund);
            });
        } else if (listType == 'best') {
            Fund.find({ "schemeCategory": listType }, function(err, fund) {
                if (err) {
                    return next(err);
                }
                res.json(fund);
            });
        }

    });

    app.get('/mFund/:name', function(req, res, next) {
        var name = req.params.name;
        Fund.find({ "schemeName": name }, function(err, fundList) {
            if (err) {
                return next(err);
            }
            if(fundList != ''){
                var schemeCode = fundList[0].schemeCode;
                MHistory.find({ "schemeCode": schemeCode }, function(err, funds) {
                    if (err) {
                        return next(err);
                    }
                    var response = {
                        fundNameList:fundList,
                        fundDetail:funds
                    };
                    res.json(response);
                });
            }
        });
    });

    app.get('/mfsearch/:amcId/:categ/:type', function(req, res, next) {
        var amcId = req.params.amcId;
        var categ = req.params.categ;
        var type = req.params.type;
        Fund.find({ "amcId": amcId, "schemeCategory": categ, "schemeType":type }, function(err, fund) {
            if (err) {
                return next(err);
            }
            res.json(fund);
        });
    });

    // app.get('/mFundHistoryDetail/:name', function(req, res, next) {
    //     var name = req.params.name;
    //     MHistory.find({ "schemeName": name }, function(err, fund) {
    //         if (err) {
    //             return next(err);
    //         }
    //         res.json(fund);
    //     });
    // });

    // app.get('/mFundHistoryDetail/:name', function(req, res, next) {
    //     var name = req.params.name;
    //     console.log(name);
    //     Fund.find({ "schemeName": name }, function(err, fundDetail) {
    //         if (err) {
    //             return next(err);
    //         }
    //         // console.log(fundDetail);
    //         if(fundDetail != ''){
    //             var schemeCode = fundDetail[0].schemeCode;
    //             MHistory.find({ "schemeCode": schemeCode }, function(err, funds) {
    //             if (err) {
    //                 return next(err);
    //             }
    //             res.json(funds);
    //         });
    //         }
    //     });
    // });

    // app.get('/getSchemeNavDetail/:name', function(req, res, next) {
    //     var name = req.params.name;
    //     var price;
    //     console.log(req.body.email);
    //     History.find({ "navName": name }, function(err, nav) {
    //         if (err) {
    //             return next(err);
    //         }
    //         if (nav.length > 0) {
    //             if ((nav[0].values.reverse())[0].open == undefined || (nav[0].values.reverse())[0].open == NA || (nav[0].values.reverse())[0].open == '') {
    //                 price = nav[0].values.reverse();
    //                 price = price[0].open;
    //             } else {
    //                 price = nav[0].values.reverse();
    //                 price = price[0].open;
    //             }
    //             console.log('final price ' + nav[0].values[0].open);
    //             console.log('final price1 '+ nav[0].values.reverse()[0].open);
    //         }

    //         var invest = new Invest({ 
    //             createdDate: Date.now(),
    //             userId: req.body.email,
    //             investment:
    //             {
    //                 category:'Mutual Fund',
    //                 name:name,
    //                 amount:price
    //             }
    //         });

    //         invest.save(function(err) {
    //             if (err) {
    //                 return done(err);
    //             } else {
    //                 res.status(200).json(invest);
    //             }
    //     });
    //         });
    // });

    app.get('/mfAvailable/:name', function(req, res, next) {
        var name = req.params.name;
        Fund.find({ "schemeName": name }, function(err, fund) {
            if (err) {
                return next(err);
            }
            res.json(fund);
        });
    });

    //api to insert mutual fund daily values
    function getDailyMFvalues() {
        PythonShell.run('insertMF.py', function(err) {
            if (err) throw err;
            console.log('finished');
        });
    }

    // //api to insert mutual fund historical values
    // var insertbulkMFValues = function(navCode, callback) {
    //     var options = {
    //         host: 'www.quandl.com',
    //         path: '/api/v3/datasets/AMFI/' + navCode + '.json?api_key=btDKk2UxAdXN4wxxxZgi&start_date=2013-08-30',
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }
    //     var req1 = https.request(options, function(response) {
    //         var body = '';
    //         response.setEncoding('utf8');
    //         response.on('data', function(chunk) {
    //             body += chunk;
    //         });
    //         response.on('end', function() {
    //             if (typeof body === "string") {
    //                 var json = JSON.parse(body);
    //             }
    //             var mfData = json.dataset.data;
    //             var schemeId = json.dataset.dataset_code;
    //             var schemeName = json.dataset.name;
    //             var isinCode = json.dataset.description;
    //             var valueData = [];
    //             for (var k = 0; k < mfData.length; k++) {
    //                 var myDate = new Date(mfData[k][0]);
    //                 valueData.push({
    //                     date: myDate,
    //                     NAV: parseFloat(mfData[k][1]).toFixed(2)
    //                 });
    //             }
    //             var query = { "navCode": schemeId };
    //             var newData = {
    //                 createdDate: Date.now(),
    //                 navCode: schemeId,
    //                 schemeName: schemeName,
    //                 ISINCode: isinCode,
    //                 values: valueData
    //             };
    //             MHistory.findOneAndUpdate(query, newData, { upsert: true }, function(err, doc) {
    //                 if (err)
    //                     console.log('Errorr');
    //                 else
    //                     console.log('Success');
    //             });
    //         });
    //     });
    //     req1.on('error', function(e) {
    //         console.log('problem with request: ' + e.message);
    //         callback(true);
    //     });
    //     req1.end();
    // }

    
    // var rule = new schedule.RecurrenceRule();
    // rule.dayOfWeek = [1, 2, 3, 4, 5];
    // rule.hour = 07;
    // rule.minute = 00;
    // schedule.scheduleJob(rule, function() {
    //     console.log('job chalao');
    //     getDailyMFvalues();
    // });
};