module.exports=function (app) {
var http = require('http');

var request = require('request');
var feed = require("feed-read");
var Twit = require("Twit");

// var configTweet = require('./config/tweet');



function tracktweet(socket,name,symbol) {

	//Run the first time immediately
	// gettweet(socket,name,symbol);

	// //Every N seconds
	// var timer = setInterval(function() {
	// 	gettweet(socket,name,symbol)
	// }, FETCH_INTERVAL);

	// socket.on('disconnect', function () {
	// 	clearInterval(timer);
	// });
}

//this function will call getticker at specified interval of time
function track_ticker(socket, ticker) {

	//Run the first time immediately
	getticker(socket, ticker);

	//Every N seconds
	var timer = setInterval(function() {
		getticker(socket, ticker)
	}, FETCH_INTERVAL);

	socket.on('disconnect', function () {
		clearInterval(timer);
	});
}

//this function will get ticker current values and emit values from socket to controller
function getticker(socket,sname) {

	var options = {
		host: 'www.google.com',
		port: 80,
		path: '/finance/info?client=ig&infotype=infoquoteall&q=NSE:'+sname
	};
	// var options = {
	// 	host: 'finance.yahoo.com',
	// 	port: 80,
	// 	path: '/webservice/v1/symbols/'+sname+'/quote?format=json&view=detail'
	// };
	http.get(options,function(response){
		response.setEncoding('utf8');
		var data = "";
	response.on('data', function(chunk) {
			data += chunk;
	}).on('end', function() {
			var quote = data;
	 		socket.emit('quote',quote); 	
	}).on("error",function(e){
		console.log("Error in fetching Stock data")
	});
	});
}


function Glass(name, ceo, title, logo, homePage) {
	this.name = name;
	this.ceo = ceo;
	this.title=title;
	this.logo = logo;
	this.homePage = homePage;
}


//function to fetch glassdoor data
function getGDData(socket,search) {
	var query = "http://api.glassdoor.com/api/api.htm?t.p=26106&t.k=g3q6WWopG8O&userip=0.0.0.0&useragent=&format=json&v=1&action=employers&q=" + search;
	request(query, function(error, response, data) {
		if (error) {
			throw error;
		}

		if (JSON.parse(data).response.totalRecordCount == 0){

			console.log("No Company found with this name");
			var company = new Glass("NA","NA","NA","NA","NA");
		}

		else {

		var name = JSON.parse(data).response.employers[0].name;
		try{
		var ceo = JSON.parse(data).response.employers[0].ceo.name;
		var title = JSON.parse(data).response.employers[0].ceo.title;
	}
	catch (e){

		var ceo = "NA";
		var title="NA";
	}
		var logo = JSON.parse(data).response.employers[0].squareLogo;
		var homePage = JSON.parse(data).response.employers[0].website;
		var company = new Glass(name, ceo, title, logo, homePage);
		}
socket.emit('company',company);

	});
}

//function to initiate the fields
 function Article(title, date, description, url) {
	this.title = title;
	this.date = date;
	this.description = description;
	this.url = url;
}

//function to fetch all the news feed and clean them to send the result for display
function getnewsfeed(socket,searchname,searchsymbol){

var query = "https://news.google.com/news?pz=0&cf=all&ned=in&hl=en&scoring=r&q="+searchname+"&as_qdr=w&cf=all&output=rss&num=30";
	feed(query, function(err, articles) {
		if (err) {
			throw err;
		}
		var results = [];
		for (var i = 0; i < articles.length; i++) {
			var title = articles[i].title.replace(/<(?:.|\n)*?>/g, '');
			var date = articles[i].published;
			 var description = articles[i].content.replace(/<(?:.|\n\')*?>/g, '');
			 var description = description.replace(/&#39;/g,"\'");
			 var description = description.replace(/&nbsp;/g,"");
			 var description = description.replace(/&raquo;/g,"");
			 var fullurl = articles[i].link;
			 var url = fullurl.substring(fullurl.indexOf("url=")+4,fullurl.Length);
			results.push(new Article(title, date, description, url));
		}
		socket.emit('newsfeed',results);
});



}

//function to fetch all the news feed and clean them to show with graph
function getgraphnews(socket,searchname,searchdate){

var query = "https://news.google.com/news?pz=0&cf=all&ned=in&hl=en&scoring=n&q="+searchname+"&as_qdr=w&cf=all&output=rss&num=30";
	feed(query, function(err, articles) {
		if (err) {
			throw err;
		}
		var results = [];
		for (var i = 0; i < articles.length; i++) {
			var title = articles[i].title.replace(/<(?:.|\n)*?>/g, '');
			var date = articles[i].published;
			 var description = articles[i].content.replace(/<(?:.|\n\')*?>/g, '');
			 var description = description.replace(/&#39;/g,"\'");
			 var description = description.replace(/&nbsp;/g,"");
			 var description = description.replace(/&raquo;/g,"");
			 var fullurl = articles[i].link;
			 var url = fullurl.substring(fullurl.indexOf("url=")+4,fullurl.Length);
			results.push(new Article(title, date, description, url));
		}
		socket.emit('newsfeed',results);
});

}


//creating new twit instance and giving all configuration params
// var T = new Twit({
//   consumer_key: configTweet.twitter.consumerKey,
//   consumer_secret: configTweet.twitter.consumerSecret,
//   access_token: configTweet.twitter.accessToken,
//   access_token_secret: configTweet.twitter.accessTokenSecret
// })

// socket.io on and emit to get tweets

// T.stream('statuses/filter', {track: ''}, function(stream) {
//   stream.on('data', function(tweet) {
//     socket.emit('newTweet', tweet);
//   });
//   stream.on('error', function(error) {
//     throw error;
//   });
// });

};