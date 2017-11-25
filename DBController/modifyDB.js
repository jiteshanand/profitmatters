var yahooFinance = require('yahoo-finance'),
    googleFinance = require('google-finance'),
    http = require('http'),
    History = require('../DBmodel/stockHistory'),
    schedule = require('node-schedule');
    // dateFormat = require('date-format-lite');
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

    function tonumber(input) {
        var a = input.replace(/\,/g, '');
        return parseFloat(a, 10);
    }

    function strtonum(vo) {
        var item = vo;
        // console.log("inval:" + $scope.item);
        var test = '"' + item + '"';
        var testval = 0;
        if (test.indexOf('M') > -1) {
            test = test.replace("M", "");
            test = test.replace(/\"/g, '');
            testval = parseFloat(test);
            vo = testval * 1000000;
            return vo;
        } else {
            test = test.replace(/\,/g, '');
            test = test.replace(/\"/g, '');
            vo = parseFloat(test);
            return vo;
        }
        return vo;
    }

    function oneDayData(symbol) {
        symbol = symbol.replace('&', '%26');
        var options = {
            host: 'www.google.com',
            port: 80,
            path: '/finance/info?client=ig&infotype=infoquoteall&q=' + 'NSE:' + symbol
        };
        var insertObj;
        http.get(options, function(response) {
            response.setEncoding('utf8');
            var data = "";
            response.on('data', function(chunk) {
                data += chunk;
            }).on('end', function() {
                var quote = data.substring(3);
                var obj = JSON.parse(quote);
                insertObj = {
                    'Date': getTodayDate(),
                    'Open': tonumber(obj[0].op),
                    'Close': tonumber(obj[0].l),
                    'High': tonumber(obj[0].hi),
                    'Low': tonumber(obj[0].lo),
                    'AdjClose': tonumber(obj[0].l_fix),
                    'Volume': strtonum(obj[0].vo)
                };
                //console.log(insertObj);
                  History.findOneAndUpdate({ symbol: symbol.replace('%26','&') }, { $push: { values: insertObj } }, { safe: true, upsert: true },
                                    function(err, model) {
                                        if (err) {
                                            console.log(err);
                                        } else {

                                            console.log("Record inserted for " +symbol)
                                        }
                                    }
                                );         
            }).on("error", function(e) {
                console.log("Error in fetching single stock data")
            });
            
        });

        
    }

    function custom_sort(a, b) {
        if(a != null && b != null && a != '' && b != ''){
           return new Date(a.Date.date("YYYY-MM-DD")).getTime() - new Date(b.Date.date("YYYY-MM-DD")).getTime();
        }
    }

    // function checkGoogle(){

    //     var symbol = ['NASDAQ:AAPL', 'NSE:ICICIBANK','NSE:INFY'];
    //      symbol.forEach(function(sname,res) {
    //         googleFinance.historical({
    //                     symbol: sname,
    //                     from: '2017-05-15',
    //                     to: getTodayDate()
    //                 }, function(err, quotes) {
    //                     if (err) {
    //                         console.log("Error in fetching data");
    //                     }
    //                     if (quotes == '') {
    //                         console.log('no quote');
    //                     }
    //                     else
    //                     {
    //                         console.log(quotes);
    //                     }
    //                 });
    //      });
    // }

    function modifyStockPrice() {
        //var symbol = ['NSE:ACC', 'NSE:ADANIPORTS', 'NSE:AMBUJACEM', 'NSE:APOLLOHOSP', 'NSE:ASHOKLEY', 'NSE:ASIANPAINT', 'NSE:AUROPHARMA', 'NSE:AXISBANK', 'NSE:BAJAJFINSV', 'NSE:BAJAJHLDNG', 'NSE:BANKBARODA', 'NSE:BANKINDIA', 'NSE:BHARATFORG', 'NSE:BHEL', 'NSE:BPCL', 'NSE:BHARTIARTL', 'NSE:INFRATEL', 'NSE:BOSCHLTD', 'NSE:BRITANNIA', 'NSE:CAIRN', 'NSE:CANBK', 'NSE:CIPLA', 'NSE:COALINDIA', 'NSE:COLPAL', 'NSE:CONCOR', 'NSE:CUMMINSIND', 'NSE:DABUR', 'NSE:DIVISLAB', 'NSE:DRREDDY', 'NSE:EICHERMOT', 'NSE:EXIDEIND', 'NSE:FEDERALBNK', 'NSE:GAIL', 'NSE:GSKCONS', 'NSE:GLAXO', 'NSE:GLENMARK', 'NSE:GODREJCP', 'NSE:GRASIM', 'NSE:HCLTECH', 'NSE:HDFCBANK', 'NSE:HEROMOTOCO', 'NSE:HINDALCO', 'NSE:HINDPETRO', 'NSE:HINDUNILVR', 'NSE:HDFC', 'NSE:ITC', 'NSE:ICICIBANK', 'NSE:IDEA', 'NSE:IBULHSGFIN', 'NSE:IOC', 'NSE:INDUSINDBK', 'NSE:INFY', 'NSE:JSWSTEEL', 'NSE:KOTAKBANK', 'NSE:LICHSGFIN', 'NSE:LT', 'NSE:LUPIN', 'NSE:MRF', 'NSE:MARICO', 'NSE:MARUTI', 'NSE:MOTHERSUMI', 'NSE:NMDC', 'NSE:NTPC', 'NSE:ONGC', 'NSE:OIL', 'NSE:OFSS', 'NSE:PETRONET', 'NSE:PFC', 'NSE:POWERGRID', 'NSE:PNB', 'NSE:RELCAPITAL', 'NSE:RCOM', 'NSE:RELIANCE', 'NSE:RELINFRA', 'NSE:RECLTD', 'NSE:SRTRANSFIN', 'NSE:SIEMENS', 'NSE:SBIN', 'NSE:SAIL', 'NSE:SUNPHARMA', 'NSE:SUNDARMFIN', 'NSE:TATACHEM', 'NSE:TCS', 'NSE:TATAGLOBAL', 'NSE:TATAMOTORS', 'NSE:TATAPOWER', 'NSE:TATASTEEL', 'NSE:TECHM', 'NSE:TITAN', 'NSE:UPL', 'NSE:ULTRACEMCO', 'NSE:UBL', 'NSE:VEDL', 'NSE:WIPRO', 'NSE:YESBANK', 'NSE:ZEEL'];
        var symbol = ['NSE:ACC', 'NSE:ADANIPORTS', 'NSE:ASHOKLEY', 'NSE:ASIANPAINT', 'NSE:AUROPHARMA', 'NSE:BAJAJHLDNG']
        var now = new Date();
        symbol.forEach(function(sname,res) {
            sname = sname.substring(4).replace("%26", '&');
            // sname1 = sname.replace("%26", '&');
            History.find({ "symbol": sname }, function(err, stock,next) {
                if (err) {
                    res.send(err);
                }
                // console.log(stock);
                if (stock != '') {
                    console.log(sname);
                    var objStr = stock[0].values.sort(custom_sort).reverse();
                    objStr = JSON.stringify(objStr[0]);
                    var jsonObj = JSON.parse(objStr);
                    var date = new Date(jsonObj.Date);
                    //date = date.getTime() + 24 * 60 * 60 * 1000;
                    var fromDate = date.date("YYYY-MM-DD");

                    yahooFinance.historical({
                        symbol: sname + '.NS',
                        from: fromDate,
                        to: getTodayDate()
                    }, function(err, quotes) {
                        if (err) {
                            console.log("Error in fetching data");
                        }
                        if (quotes == '') {
                            console.log('no quote');
                            if (fromDate == getTodayDate()) {
                                console.log("No latest records found to insert for "+symbol);
                            }
                            // } else {
                            //     var insertObj = oneDayData(sname);
                            // }
                        } else {
                            for (var objCounter in quotes) {
                                var insertObj = {
                                    'Date': quotes[objCounter].date.date("YYYY-MM-DD"),
                                    'Open': quotes[objCounter].open,
                                    'Close': quotes[objCounter].close,
                                    'High': quotes[objCounter].high,
                                    'Low': quotes[objCounter].low,
                                    'AdjClose': quotes[objCounter].adjClose,
                                    'Volume': quotes[objCounter].volume
                                };
                                History.findOneAndUpdate({ symbol: sname }, { $push: { values: insertObj } }, { safe: true, upsert: true },
                                    function(err, model) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log("Record inserted for " + sname)
                                        }
                                    }
                                );
                            }
                        }
                    });
                } else {
                    console.log("Not Found");
                }
            });
        });
    }
    //checkGoogle();
    //modifyStockPrice();
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [1, 2, 3, 4, 5];
    rule.hour = 08;
    rule.minute =30 ;
    schedule.scheduleJob(rule, function() {
        console.log('job chalao');
        modifyStockPrice();
    });

};




// var options = {
//     host: 'www.google.com',
//     port: 80,
//     path: '/finance/info?client=ig&infotype=infoquoteall&q=' + 'NSE:' + sname
// };
// http.get(options, function(response) {
//     response.setEncoding('utf8');
//     var data = "";
//     response.on('data', function(chunk) {
//         data += chunk;
//     }).on('end', function() {
//         var quote = data.substring(3);
//         var obj = JSON.parse(quote);
//         var insertObj = {
//             'Date': today,
//             'Open': tonumber(obj[0].op),
//             'Close': tonumber(obj[0].l),
//             'High': tonumber(obj[0].hi),
//             'Low': tonumber(obj[0].lo),
//             'AdjClose': tonumber(obj[0].l_fix),
//             'Volume': strtonum(obj[0].vo)
//         };
//         // if (jsonObj.Date != today) {
//             History.findOneAndUpdate({ symbol: sname }, { $push: { values: insertObj } }, { safe: true, upsert: true },
//                 function(err, model) {
//                     console.log(err);
//                 }
//             );
//         // }
//     }).on("error", function(e) {
//         console.log("Error in fetching Stock data")
//     });
// });
