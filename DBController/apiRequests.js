var elasticsearch = require('elasticsearch');
feed = require("feed-read");
var https = require('https');
var http = require('http');
var client = new elasticsearch.Client({
    host: 'localhost:9200'
});

module.exports = function(app) {
    app.get('/industry/:symbol', function(req, res) {
        var symbol = req.params.symbol;
        client.search({
            "index": 'stocks',
            "type": 'stock',
            "body": {
                "from": 0,
                "size": 1,
                "query": {
                    "match_phrase": {
                        "symbol": symbol.toString()
                    }
                }
            }
        }, function(error, response) {
            if(response != '')
            {
                // console.log(response);
                res.send(response.hits.hits);
            }
        })
    });

    app.get('/industry/peers/:industry', function(req, res) {
        var industry = req.params.industry;
        client.search({
            "index": 'stocks',
            "type": 'stock',
            "body": {
                "from": 0,
                "size": 25,
                "query": {
                    "match_phrase": {
                        "industry": industry
                    }
                }
            }
        }, function(error, response) {
            if(response != '')
            {
                res.send(response.hits.hits);
            }
        })
    });

    //function to initiate the fields
    function Article(title, date, description, url) {
        this.title = title;
        this.date = date;
        this.description = description;
        this.url = url;
        if (url.indexOf("business-standard") > -1)
            this.shortened = "Business Standard";
        else if (url.indexOf("thehindu") > -1)
            this.shortened = "THE HINDU";
          else if (url.indexOf("outlook") > -1)
            this.shortened = "Outlook";
        else if (url.indexOf("economictimes") > -1)
            this.shortened = "Economic Times";
        else if (url.indexOf("indiatoday") > -1)
            this.shortened = "India Today";
        else if (url.indexOf("reuters") > -1)
            this.shortened = "Reuters";
        else if (url.indexOf("timesofindia") > -1)
            this.shortened = "TOI";
        else if (url.indexOf("livemint") > -1)
            this.shortened = "Mint";
        else if (url.indexOf("hindustantimes") > -1)
            this.shortened = "Hindustan Times";
        else if (url.indexOf("ndtv") > -1)
            this.shortened = "NDTV";
        else if (url.indexOf("moneycontrol") > -1)
            this.shortened = "Money Control";
        else if (url.indexOf("news18") > -1)
            this.shortened = "News 18";
        else if (url.indexOf("zeenews") > -1)
            this.shortened = "Z News";
        else if (url.indexOf("businesstoday") > -1)
            this.shortened = "Business Today";
        else if (url.indexOf("ibtimes") > -1)
            this.shortened = "IBTimes";
        else if (url.indexOf("indiainfoline") > -1)
            this.shortened = "India Infoline";
        else if (url.indexOf("marketwatch") > -1)
            this.shortened = "Market Watch";
        else if (url.indexOf("rt.com") > -1)
            this.shortened = "Russia Today";
        else if (url.indexOf("cnbc") > -1)
            this.shortened = "CNBC";
        else if (url.indexOf("bbc") > -1)
            this.shortened = "BBC";
        else if (url.indexOf("telegraph") > -1)
            this.shortened = "Telegraph";
        else if (url.indexOf("cnn") > -1)
            this.shortened = "CNN";
        else if (url.indexOf("ft") > -1)
            this.shortened = "Financial Times";
        else if (url.indexOf("sky") > -1)
            this.shortened = "Sky News";
        else if (url.indexOf("businesstimes") > -1)
            this.shortened = "Business Times";
        else if (url.indexOf("fortune") > -1)
            this.shortened = "Fortune";
        else if (url.indexOf("bloomberg") > -1)
            this.shortened = "Bloomberg";
        else if (url.indexOf("forbes") > -1)
            this.shortened = "Forbes";
        else {
            this.shortened = "Others";
        }
    }


    app.get('/newsfeed/:nameToUse/:symbol', function(req, res, err) {
        // console.log("Hit hua");
        var nameToUse = req.params.nameToUse;
        var symbol = req.params.symbol;
        var searchname = symbol + " or " + nameToUse;
        var shortened = '';
        var query = "https://news.google.com/news?pz=0&cf=all&ned=in&hl=en&scoring=r&q=" + searchname + "&cf=all&output=rss&num=30";
        feed(query, function(err, articles) {
            if (err) {
                throw err;
            }
            var results = [];
            for (var i = 0; i < articles.length; i++) {
                var title = articles[i].title.replace(/<(?:.|\n)*?>/g, '');
                title = title.substr(0, title.lastIndexOf("-"));
                var date = articles[i].published;
                var description = articles[i].content.replace(/<(?:.|\n\')*?>/g, '');
                var description = description.replace(/&#39;/g, "\'");
                var description = description.replace(/&nbsp;/g, "");
                var description = description.replace(/&raquo;/g, "");
                var fullurl = articles[i].link;
                var url = fullurl.substring(fullurl.indexOf("url=") + 4, fullurl.Length);
                if(url.indexOf("outlook") <= -1){
                    results.push(new Article(title, date, description, url, shortened));
                }
            }
            res.send(results);
        });
    });

    // Get Active Ticker symbol data from Google

    app.get('/stockData/:tickersymbol', function(req, res, err) {
        var symbol = req.params.tickersymbol;
        console.log('S is: '+symbol);
        if(symbol != undefined || symbol != ''){
            var options = {
                host: 'finance.google.com',
                port:443,
                path: '/finance?q=NSE:'+symbol+'&output=json'
            };
            //var url = 'https://www.quandl.com/api/v3/datasets/NSE/INFY.json?api_key=btDKk2UxAdXN4wxxxZgi';
            var req1 = https.get(options, function(response) {
                var body = '';
                response.setEncoding('utf8');
                response.on('data', function(chunk) {
                    body += chunk;
                }).on('end', function() {
                    res.send(body);
                }).on("error", function(e) {
                    console.log("Error in fetching Stock data")
                });
            });
            req1.end();
            req1.on('error', (e) => {
                console.error(e);
            });
        }
    });
}