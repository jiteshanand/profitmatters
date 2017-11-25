//set up all the reuirements for project
var express = require('express'),
routes = require('./routes'),
http = require('http'),
https = require('https'),
request = require('request'),
bodyParser = require('body-parser'),
fs = require('graceful-fs'),
csv = require('ya-csv'),
cookieParser = require('cookie-parser'),
compress = require('compression'),
elasticsearch = require('elasticsearch'),    
mongoose = require('mongoose'),
cheerio = require("cheerio"),
FeedParser = require('feedparser'),
router = express.Router(),
feed = require("feed-read"),
async = require('async'),
entities = require('html-entities').AllHtmlEntities,
striptags = require('striptags'),
Twit = require("twit");


var app = express();
var port = 443;
var FETCH_INTERVAL = 30000000000000000;
var FETCH_INTERVAL_NEWS = 300000000;
var FETCH_INTERVAL_TWEET = 300000000;

app.use(compress());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs'); //set ejs view engine

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

var options = {
    key: fs.readFileSync(__dirname + '/ssl/ca.key'),
    cert: fs.readFileSync(__dirname + '/ssl/ca.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

var configDB = require('./config/database');
var configTweet = require('./config/tweet');

//connect with mongo DB here
mongoose.connect(configDB.url);

// Connect to elasticsearch server @ localhost:9200 and use the default settings
var client = new elasticsearch.Client();
var client = elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

//Define controller dependencies here
require('./config/passport')(app);
require('./DBController/lead')(app);
require('./DBController/firm')(app);
require('./DBController/saving')(app);
require('./DBController/historical')(app);
require('./DBController/insurance')(app);
require('./DBController/mfund')(app);
require('./DBController/modifyDB')(app);
require('./DBController/apiRequests')(app);
require('./DBController/dashboard')(app);

//Define routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('*', routes.index);

var server = https.createServer(options, app).listen(port, function() {
    console.log("Application connected on port " + port);
});

var io = require('socket.io').listen(server);

// expose app           
exports = module.exports = app;

//socket connection started
io.sockets.on('connection', function(socket) {

    socket.on('connect', function() {
        console.log('connected');
    });
    socket.on('error', function(err) {
        if (err === 'handshake error') {
            console.log('handshake error', err);
        } else {
            console.log('io error', err);
        }
    });
    //socket onn for ticker event
    socket.on('ticker', function(ticker) {
        console.log("1");
        track_ticker(socket, ticker);
    });
    //socket on for global indices
    socket.on('index', function(indices) {
        getIndices(socket, indices);
    });
    //socket on for global indices
    socket.on('sector', function(sector) {
        getSector(socket, sector);
    });
    //socket on for global indices
    socket.on('currency', function() {
        getcurrency(socket);
    });
    //socket on for google news feed
    socket.on('globalfeed', function() {
        tracknews(socket);
    });
    //socket on for tweets
    socket.on('tweet', function(symbol) {
        tracktweet(socket, symbol);
    });

    socket.on('disconnect', function() {
        console.log('A user disconnected');
    });

    socket.on('connect_failed', function() {
        console.log("Sorry, there seems to be an issue with the connection!");
    });

    socket.on('error', function() {
        console.log("Sorry, there seems to be an issue with the connection!");
    });


});

function tracktweet(socket, symbol) {

    //Run the first time immediately
    gettweet(socket, symbol);
    //Every N seconds
    var timer = setInterval(function() {
        gettweet(socket, symbol)
    }, FETCH_INTERVAL_TWEET);

    socket.on('disconnect', function() {
        clearInterval(timer);
    });
}

function tracknews(socket) {
    //Run the first time immediately
    getnewsfeed(socket);
    //Every N seconds
    var timer = setInterval(function() {
        getnewsfeed(socket)
    }, FETCH_INTERVAL_NEWS);

    socket.on('disconnect', function() {
        clearInterval(timer);
    });
}

//this function will call getticker at specified interval of time
function track_ticker(socket, ticker) {
    //Run the first time immediately
    getticker(socket, ticker);
    //Every N seconds
    // var timer = setInterval(function() {
    //     getticker(socket, ticker)
    // }, FETCH_INTERVAL);

    // socket.on('disconnect', function() {
    //     clearInterval(timer);
    // });
}

//this function will get ticker current values and emit values from socket to controller
function getticker(socket, sId) {
    var data = "";
    // var dataArr = [];
    // var sname=['NSE:INFY'];
    // for (var i = 0; i <= sname.length - 1; i++) {
    //     var options = {
    //         host: 'finance.google.com',
    //         port: 443,
    //         path: '/finance?q='+sname[i]+'&output=json'

    //     };

    //     const req = https.get(options, function(response) {
    //         // response.setEncoding('utf8');
    //         response.on('data', function(chunk) {
    //             data += chunk;
    //         }).on('end', function() {
    //             if(data != ""){
    //                 dataArr.push(data.toString());    
    //             }
    //             else
    //                 dataArr.push(['No Data for this symbol']);
    //             data = "";
    //             var quote = dataArr;
    //             if (dataArr.length == sname.length ) {
    //                 try {
    //                     socket.emit('quote', quote);
    //                 } catch (e) {
    //                     return false;
    //                 }
    //             }
    //         }).on("error", function(e) {
    //             console.log("Error in fetching Stock data")
    //         });
    //     });
    var options = {
        host: 'finance.google.com',
        port: 443,
        path: '/finance/data?dp=mra&output=json&catid=all&cid='+sId
    };
    const req = https.get(options, function(response) {
        response.on('data', function(chunk) {
            data += chunk;
        }).on('end', function() {
            if(data != ""){
                try {
                    socket.emit('quote', data);
                } catch (e) {
                    return false;
                }
            }
        }).on("error", function(e) {
            console.log("Error in fetching Stock data")
        });
    });
    req.end();
    req.on('error', (e) => {
        console.error(e);
    });
}

function getcurrency(socket) {
    var fixedEncodeURIComponent = function(str) {
        return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A").replace(/\"/g, "%22");
    };
    var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    var query = 'select * from yahoo.finance.xchange where pair in ("USDINR","BTCINR", "EURINR","CNYINR","AUDINR", "GBPINR", "CADINR","JPYINR","CHFINR","ZARINR")';
    var url = 'http://query.yahooapis.com/v1/public/yql?q=' + fixedEncodeURIComponent(query) + format;

    const req = http.get(url, function(response) {
        response.setEncoding('utf8');
        var data = "";
        response.on('data', function(chunk) {
            data += chunk;
        }).on('end', function() {
            var currency = data;
            // console.log(currency);
            socket.emit('Currency', currency);
        }).on("error", function(e) {
            console.log("Error in fetching Stock data")
        });
    });
    req.end();
    req.on('error', (e) => {
        console.error(e);
    });
}

//function to initiate the fields
function Article(title, date, description, url, shortened) {
    this.title = title;
    this.date = date;
    this.description = description;
    this.url = url;
    if (url.indexOf("business-standard") > -1)
        this.shortened = "Business Standard";
    else if (url.indexOf("bloombergquint") > -1)
        this.shortened = "Bloomberg Quint";
     else if (url.indexOf("thehindu") > -1)
        this.shortened = "THE HINDU";
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
}

//function to fetch all the news feed and clean them to send the result for display
function getnewsfeed(socket) {
    var queryDomestic = [
        // "http://economictimes.indiatimes.com/rssfeedstopstories.cms",
        "http://www.thehindu.com/businesstimes/?service=rss",
        "https://www.bloombergquint.com/stories.rss",
        "http://www.business-standard.com/rss/home_page_top_stories.rss",
        "http://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
        "http://www.indiainfoline.com/rss/latestnews.xml",
        // "http://www.business-standard.com/rss/markets-106.rss",
        "http://www.livemint.com/rss/companies",
        // "http://indiatoday.intoday.in/rss/article.jsp?sid=34",
        "http://economictimes.indiatimes.com/news/rssfeeds/1715249553.cms",
        "http://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
        "http://www.livemint.com/rss/money",
        "http://zeenews.india.com/rss/business.xml",
        "http://feeds.reuters.com/reuters/INbusinessNews",
        "http://www.hindustantimes.com/rss/business/rssfeed.xml",
        "http://feeds.feedburner.com/ndtvprofit-latest",
        "http://www.news18.com/rss/business.xml",   
        "http://www.businesstoday.in/rss/rssstory.jsp?sid=105",
        "http://www.ibtimes.co.in/rss/economy"
        ];
        var queryGlobal = [
        "https://www.rt.com/rss/business/",
        "http://feeds.marketwatch.com/marketwatch/topstories/",
        "http://feeds.reuters.com/reuters/businessNews",
        "http://www.cnbc.com/id/10001147/device/rss/rss.html",
        "http://feeds.bbci.co.uk/news/world/rss.xml",
        "http://www.businesstimes.com.sg/rss/banking-finance",
        "http://www.telegraph.co.uk/business/rss.xml",
        "http://rss.cnn.com/rss/money_news_international.rss",
        "http://www.ft.com/rss/world",
        "http://feeds.skynews.com/feeds/rss/business.xml"
        ];
        var domesticResults = [];
        var globalResults = [];
        var numberOfArticles;

    //     async.map(queryDomestic, readFeeds, function(err, results) {
    //         if(err) throw err;
    //         console.log('Done with adding feeds');
    //     });

    //     function readFeeds(urlfeed) {
    //         var req = request (urlfeed);
    //         var feedparser = new FeedParser ();
    //         req.on('response', function (res) {
    //             var stream = this;
    //             if (res.statusCode === 200) {
    //                 stream.pipe(feedparser);
    //             } else {
    //                 return stream.emit('error', new Error('Bad status code'));
    //             }
    //         });
            
    //         req.on('error', function (err) {
    //             return callback(err, null);
    //         });

    //         feedparser.on('readable', function() {
    //             var stream = this;
    //             var item;
    //             var title,date,fullurl,description,shortened;
    //             var count = 0;
    //             while (item = stream.read()) {
    //                 count++;
    //                 if (item['title'] && item['date']) {
    //                     title = item['title'];
    //                     title = entities.decode(striptags(title));
    //                     title = title.trim();
    //                     title = title.replace(/[&]/g,'and').replace(/[<>]/g,'');

    //                     date = new Date(item['date']).toUTCString();

    //                     if (item['description']) {
    //                         description = item['description'];
    //                         description = entities.decode(striptags(description));
    //                         description = description.trim();
    //                         description = description.replace(/[&]/g,'and').replace(/[<>]/g,'');
    //                     }

    //                     if (item['link']) {
    //                         fullurl = item['link'];
    //                     }

    //                     shortened = " ";
    //             }
    //                 if(count > 5)
    //                     break;
                    
    //                 domesticResults.push(new Article(title, date, description, fullurl, shortened));

    //             }

    //         feedparser.on ("error", function (res) {
    //             console.log ("readFeed: feedparser error == " +  res);
    //         });
    //     });
    // }
        for (var j = 0; j < queryDomestic.length; j++) {

            feed(queryDomestic[j], function(err, articles) {
                if (err) {
                    console.error(err);
                } else {
                    if(articles.length >=5){
                        numberOfArticles = 5;
                    }
                    else{
                        numberOfArticles = articles.length;
                    }
                    for (var i = 0; i < numberOfArticles; i++) {
                        var title = articles[i].title.replace(/<(?:.|\n)*?>/g, '');
                        var title = title.replace(/&amp;#039;/g, "\'");
                        var title = title.replace(/&nbsp;/g, "");
                        var title = title.replace(/&raquo;/g, "");
                        var date = articles[i].published;
                        var description = articles[i].content.replace(/<(?:.|\n\')*?>/g, '');
                        var description = description.replace(/&#39;/g, "\'");
                        var description = description.replace(/&nbsp;/g, "");
                        var description = description.replace(/&raquo;/g, "");
                        var fullurl = articles[i].link;
                        var shortened = "";
                    //var url = fullurl.substring(fullurl.indexOf("url=") + 4, fullurl.Length);
                    domesticResults.push(new Article(title, date, description, fullurl, shortened));
                }
                socket.emit('nationalnewsfeed', domesticResults);
            }
        });
        }

        for (var j = 0; j < queryGlobal.length; j++) {
            feed(queryGlobal[j], function(err, articles) {
                if (err) {
                    console.error(err);
                } else {
                    if(articles.length >=5){
                        numberOfArticles = 5;
                    }
                    else{
                        numberOfArticles = articles.length;
                    }
                    for (var i = 0; i < numberOfArticles; i++) {
                        var title = articles[i].title.replace(/<(?:.|\n)*?>/g, '');
                        var date = articles[i].published;
                        var description = articles[i].content.replace(/<(?:.|\n\')*?>/g, '');
                        var description = description.replace(/&#39;/g, "\'");
                        var description = description.replace(/&nbsp;/g, "");
                        var description = description.replace(/&raquo;/g, "");
                        var fullurl = articles[i].link;
                        var shortened = "";
                    //var url = fullurl.substring(fullurl.indexOf("url=") + 4, fullurl.Length);
                    globalResults.push(new Article(title, date, description, fullurl));
                }

                socket.emit('globalnewsfeed', globalResults);
            }
        });
        }
    }
// getnewsfeed();

//function to get data for all indices
function getIndices(socket, indices) {
    var options = {
    host: 'finance.google.com',
        port: 443,
        path: '/finance/data?dp=mra&output=json&catid=all&cid='+indices
    };
    const req = https.get(options, function(response) {
        response.setEncoding('utf8');
        var data = "";
        response.on('data', function(chunk) {
            data += chunk;
        }).on('end', function() {
            var index = data;
            socket.emit('Index', index);
        }).on("error", function(e) {
            console.log("Error in fetching Stock data")
        });
    });
    req.end();
    req.on('error', (e) => {
        console.error(e);
    });
}

function getSector(socket, sector) {

    var options = {
        host: 'www.google.com',
        port: 443,
        path: '/finance/info?&infotype=infoquoteall&q=' + sector
    };
    const req = https.get(options, function(response) {
        response.setEncoding('utf8');
        var data = "";
        response.on('data', function(chunk) {
            data += chunk;
        }).on('end', function() {
            var sector = data;
            // console.log(sector);
            socket.emit('Sector', sector);
        }).on("error", function(e) {
            console.log("Error in fetching Stock data")
        });
    });
    req.end();
    req.on('error', (e) => {
        console.error(e);
    });
}
//creating new twit instance and giving all configuration params
var T = new Twit({
    consumer_key: configTweet.twitter.consumerKey,
    consumer_secret: configTweet.twitter.consumerSecret,
    access_token: configTweet.twitter.accessToken,
    access_token_secret: configTweet.twitter.accessTokenSecret
})

// socket.io on and emit to get tweets
function gettweet(socket, symbol) {
    // console.log(symbol);
    var today = new Date();
    // T.get('search/tweets', { q: '' + symbol + ' -filter:retweets lang:en since:' + today.getFullYear() + '-' +
    //(today.getMonth() + 1) + '-' + (today.getDate()-2), count:30}, function(err, data, response) {
    // T.get('search/tweets',{q:symbol,count:50},function(err,data,response){

        T.get('search/tweets', { q: "'" + symbol + ' -filter:retweets lang:en', count: 30 }, function(err, data, response) {
            socket.emit('newTweet', data);
        })
    }
