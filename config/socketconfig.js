// module.exports=function (socket) {
	

// 	var FETCH_INTERVAL = 50000;
// 	var PRETTY_PRINT_JSON = true;
// 	var ticker='ABB';
// 	var http = require('http');
// 	 console.log("Coming here1");
	

// 	function track_ticker(socket,ticker) {
// 		//Run the first time immediately
// 		 console.log("Coming here2");
// 		get_quote(socket, ticker);
// 		//Every N seconds
// 		var timer = setInterval(function() {
// 			get_quote(socket,ticker)
// 		}, FETCH_INTERVAL);

// 		socket.on('disconnect', function () {
// 			clearInterval(timer);
// 		});
// 	}

// 	function get_quote(p_socket,p_ticker) {
// 		http.get({
// 			host: 'www.google.com',
// 			port: 80,
// 			path: '/finance/info?infotype=infoquoteall&q=' + p_ticker
// 		}, function(response) {
// 			response.setEncoding('utf8');
// 			var data = "";
// 			console.log("5");
// 			response.on('data', function(chunk) {
// 				data += chunk;
// 			});
			
// 			response.on('end', function() {
// 				if(data.length > 0) {
// 					try {
// 						var data_object = JSON.parse(data.substring(3));
// 					} catch(e) {
// 						return;
// 					}
// 					p_socket.emit('stocks',data_object);
// 					// console.log(data_object);
// 					// var quote = {};
// 					// quote.ticker = data_object[0].t;
// 					// quote.exchange = data_object[0].e;
// 					// quote.price = data_object[0].l_cur;
// 					// quote.change = data_object[0].c;
// 					// quote.change_percent = data_object[0].cp;
// 					// quote.last_trade_time = data_object[0].lt;
// 					// quote.dividend = data_object[0].div;
// 					// quote.yield = data_object[0].yld;
					
// 					// p_socket.emit('quote', PRETTY_PRINT_JSON ? JSON.stringify(quote, true, '\t') : JSON.stringify(quote));
// 				}
// 			});
// 		});
// 	}

// };