var services = angular.module('services', []);

services.factory('sortable', ['$filter', '$rootScope', function($filter, $rootScope)
{
  return function (scope, data, itemsPerPage, initSortingOrder) {
    scope.sortingOrder = initSortingOrder;
    scope.reverse = false;
    scope.filteredItems = [];
    scope.groupedItems = [];
    scope.itemsPerPage = itemsPerPage;
    scope.pagedItems = [];
    scope.currentPage = 1;
    scope.maxSize = 5;
    scope.members=data;

    var searchMatch = function (haystack, needle) {
          if (!needle) {
              return true;
          }
          return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
      };
      // init the filtered items
      scope.search = function () {
          scope.filteredItems = scope.members;
          // take care of the sorting order
        if (scope.sortingOrder !== '') {
            scope.filteredItems = $filter('orderBy')(scope.filteredItems, scope.sortingOrder, scope.reverse);
        }
          scope.currentPage = 1;
          // now group by pages
          scope.groupToPages();
          // reset the total items for the pagination buttons
          scope.totalItems = scope.filteredItems.length;
      };
      
      // calculate page in place
      scope.groupToPages = function () {
          scope.pagedItems = [];    
          for (var i = 0; i < scope.filteredItems.length; i++) {
              if (i % scope.itemsPerPage === 0) {
                  scope.pagedItems[Math.floor(i / scope.itemsPerPage)] = [ scope.filteredItems[i] ];
              } else {
                  scope.pagedItems[Math.floor(i / scope.itemsPerPage)].push(scope.filteredItems[i]);
              }
          }
      };
      scope.range = function (start, end) {
          var ret = [];
          if (!end) {
              end = start;
              start = 0;
          }
          for (var i = start; i < end; i++) {
              ret.push(i);
          }
          return ret;
      };
      // functions have been described process the data for display
      scope.search();
      // change sorting order
      scope.sort_by = function(newSortingOrder) {
          console.log("Called");
          if (scope.sortingOrder == newSortingOrder)
              scope.reverse = !scope.reverse;

          scope.sortingOrder = newSortingOrder;
          // call search again to make sort affect whole query
          scope.search();
      };

      scope.sort_by(initSortingOrder);
      scope.totalItems = scope.filteredItems.length;
  }

}]);



services.factory('stocksearch',['$q', 'esFactory', '$location','$sce', function($q, elasticsearch, $location,$sce){

return{
   searchstock : function(term){
     var client = elasticsearch({
    // host: $location.host() + ':9200'
    host: 'localhost:9200'
  });
    var deferred = $q.defer();
    client.search({
      "index": 'stocks',
      "type": 'stock',
      "body": {
      "from" : 0, "size" : 20,
        "query": {
          "bool":{
            "should":[
            {
                "match_phrase":{
                      "name": term
                    }
            },
            {   
                "match_phrase":{
                "symbol": term
                }
            },
            {   
                "match":{
                "industry": term
                }
            }
        ]
          }
        
        }
      }
  }).then(function(result) {
var hits = result.hits.hits;
deferred.resolve(hits);
}, 
function (err) {
console.trace(err.message);
}, deferred.reject);

return deferred.promise;
}
};

}]);


services.factory('instantSearch',['$q', 'esFactory', '$location','$sce', function($q, elasticsearch, $location,$sce){

return{
   instantResult : function(term){
     var client = elasticsearch({
    // host: $location.host() + ':9200'
    host: 'localhost:9200'
  });
    var deferred = $q.defer();
    client.search({
      "index": 'stocks',
      "type": 'stock',
        "index_analyzer" : "autocomplete",
        "search_analyzer" : "standard", 
        "body": {
        "from" : 0, "size" : 20,
        "query": {
            "filtered": {
                        "query": {
                            "multi_match": {
                                "fields":["name","symbol"],
                                "query":term
                            }
                        }
                    }
        
        }
      }
  }).then(function(result) {
var hits = result.hits.hits;
deferred.resolve(hits);
}, 
function (err) {
console.trace(err.message);
}, deferred.reject);

return deferred.promise;
},
renderItem: function (item) {
                return {
                    value: item._source.name,
                    label: $sce.trustAsHtml(
                "<table class='auto-complete'>"
                + "<tbody>"
                    + "<tr>"
                    + "<td style='width: 90%'>" + item._source.name + "</td>"
                    + "<td style='width: 10%'>" + item._source.symbol + "</td>"
                    + "</tr>"
                + "</tbody>"
                + "</table>")
                };
            },
};

 }]);




    services.filter('dateDiff', [function() {
        return function dateDiffFilter(dateTo, dateFrom) {
            //TODO: logic of date diff
            return dateTo - dateFrom;
        };
    }]);






// services.factory('industrysearch',['$q', 'esFactory', '$location', function($q, elasticsearch, $location){

// return{
//   searchindustry : function(symbol){
//   var client = elasticsearch({
//   // host: $location.host() + ':9200'
//   host: 'localhost:9200'
//   });
//   var deferred = $q.defer();
//   client.search({
//     "index":'stocks',
//     "type":'stock',
//     "body": {
//       "from" : 0, "size" : 1,
//       "query": {
//         "match_phrase":
//         {
//         "symbol": symbol
//         }
//       }      
//     }
//   }).then(function(result) {
//   var hits = result.hits.hits;
//   deferred.resolve(hits);
//   }, 
//   function (err) {
//   console.trace(err.message);
//   }, deferred.reject);

//   return deferred.promise;
// },


// searchpeers : function(industry){
//      var client = elasticsearch({
//     // host: $location.host() + ':9200'
//     host: 'localhost:9200'
//   });
//     var deferred = $q.defer();
//     client.search({
//       "index": 'stocks',
//       "type": 'stock',
//       "body": {
//       "from" : 0, "size" : 25,
//         "query": {
         
//          "match_phrase":{
//                    "industry": industry
//                  }
//             }      
//       }
//   }).then(function(result) {
// var hits = result.hits.hits;
// deferred.resolve(hits);
// }, 
// function (err) {
// console.trace(err.message);
// }, deferred.reject);

// return deferred.promise;
// }


// }

// }]);


services.factory('mfsearch',['$q', 'esFactory', '$location', function($q, elasticsearch, $location){

return{
   searchmf : function(nav){
     var client = elasticsearch({
    // host: $location.host() + ':9200'
    host: 'localhost:9200'
  });
    var deferred = $q.defer();
  client.search({
    "index":'mutual_funds',
    "type":'funds',
    "body": {
      "from" : 0, "size" : 1,
      "query": {
        "match_phrase":
        {
        "scheme_number": nav
        }
      }      
    }
  }).then(function(result) {
var hits = result.hits.hits;
deferred.resolve(hits);
}, 
function (err) {
console.trace(err.message);
}, deferred.reject);

return deferred.promise;
}
};

}]);


services.factory('stockSocket', function ($rootScope) {
var socket = io.connect('https://localhost');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
    removeAllListeners: function (eventName, callback) {
          socket.removeAllListeners(eventName, function() {
              var args = arguments;
              $rootScope.$apply(function () {
                callback.apply(socket, args);
              });
          }); 
      }
  };
});




services.factory('history', function($q, $http) {
    var fixedEncodeURIComponent = function(str) {
        return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A").replace(/\"/g, "%22");
    };
    var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';

    return {

        // return a promise to controller
        getHistoricalDataWithQ: function(symbol, start, end) {
            var deferred = $q.defer();
            var query = 'select * from yahoo.finance.historicaldata where symbol = "' + symbol +'.NS'+'" and startDate = "' + start + '" and endDate = "' + end + '"';
            var url = 'http://query.yahooapis.com/v1/public/yql?q=' + fixedEncodeURIComponent(query) + format;

            console.log(url);

            $http.jsonp(url).success(function(json) {
                // console.log(JSON.stringify(json));
                var quotes = json.query.results.quote;
                // filter + format quotes here if you want
                deferred.resolve(quotes);
            }).error(function(error) {
                console.log(JSON.stringify(error));
            });
            return deferred.promise;
        }
     };
});


services.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < 5; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});




/* Range Slider
    Input with default values:
    -min=0      // Min slider value
    -max=100    // Max slider value
    -step=1     // Steps

    Output / Input model
    -value-min    // Default value @min
    -value-max    // Default value @max

    example:
    <slider-range min="0" max="100" step="5" value-min="scope.form.slider_value_min" value-max="scope.form.slider_value_max"></slider-range>
*/
services.directive('sliderRange', ['$document',function($document) {

// Move slider handle and range line
  var moveHandle = function(handle, elem, posX) {
    $(elem).find('.handle.'+handle).css("left",posX +'%');
  };
  var moveRange = function(elem,posMin,posMax) {
    $(elem).find('.range').css("left",posMin +'%');
    $(elem).find('.range').css("width",posMax - posMin +'%');
  };

return {
    template: '<div class="slider horizontal">'+
                '<div class="range"></div>'+
                '<a class="handle min" ng-mousedown="mouseDownMin($event)"></a>'+
                '<a class="handle max" ng-mousedown="mouseDownMax($event)"></a>'+
              '</div>',
    replace: true,
    restrict: 'E',
    scope:{
      valueMin:"=",
      valueMax:"="
    },
    link: function postLink(scope, element, attrs) {
        // Initilization
        var dragging = false;
        var startPointXMin = 0;
        var startPointXMax = 0;
        var xPosMin = 0;
        var xPosMax = 0;
        var settings = {
                "min"   : (typeof(attrs.min) !== "undefined"  ? parseInt(attrs.min,10) : 0),
                "max"   : (typeof(attrs.max) !== "undefined"  ? parseInt(attrs.max,10) : 100),
                "step"  : (typeof(attrs.step) !== "undefined" ? parseInt(attrs.step,10) : 1)
            };
        if ( typeof(scope.valueMin) == "undefined" || scope.valueMin === '' ) 
            scope.valueMin = settings.min;
            
        if ( typeof(scope.valueMax) == "undefined" || scope.valueMax === '' ) 
            scope.valueMax = settings.max;
            
        // Track changes only from the outside of the directive
        scope.$watch('valueMin', function() {
          if (dragging) return;
          xPosMin = ( scope.valueMin - settings.min ) / (settings.max - settings.min ) * 100;
          if(xPosMin < 0) {
              xPosMin = 0;
          } else if(xPosMin > 100)  {
              xPosMin = 100;
          }
          moveHandle("min",element,xPosMin);
          moveRange(element,xPosMin,xPosMax);
        });

        scope.$watch('valueMax', function() {
          if (dragging) return;
          xPosMax = ( scope.valueMax - settings.min ) / (settings.max - settings.min ) * 100;
          if(xPosMax < 0) {
              xPosMax = 0;
          } else if(xPosMax > 100)  {
              xPosMax = 100;
          }
          moveHandle("max",element,xPosMax);
          moveRange(element,xPosMin,xPosMax);
        });

        // Real action control is here
        scope.mouseDownMin = function($event) {
            dragging = true;
            startPointXMin = $event.pageX;
        
            // Bind to full document, to make move easiery (not to lose focus on y axis)
            $document.on('mousemove', function($event) {
                if(!dragging) return;

                //Calculate handle position
                var moveDelta = $event.pageX - startPointXMin;

                xPosMin = xPosMin + ( (moveDelta / element.outerWidth()) * 100 );
                if(xPosMin < 0) {
                    xPosMin = 0;
                } else if(xPosMin > xPosMax) {
                  xPosMin = xPosMax;
                } else {
                    // Prevent generating "lag" if moving outside window
                    startPointXMin = $event.pageX;
                }
                scope.valueMin = Math.round((((settings.max - settings.min ) * (xPosMin / 100))+settings.min)/settings.step ) * settings.step;
                scope.$apply();
                
                // Move the Handle
                moveHandle("min", element,xPosMin);
                moveRange(element,xPosMin,xPosMax);
            });
        $document.mouseup(function(){
                dragging = false;
                $document.unbind('mousemove');
                $document.unbind('mousemove');
            });
        };

        scope.mouseDownMax = function($event) {
            dragging = true;
            startPointXMax = $event.pageX;
        
            // Bind to full document, to make move easiery (not to lose focus on y axis)
            $document.on('mousemove', function($event) {
                if(!dragging) return;

                //Calculate handle position
                var moveDelta = $event.pageX - startPointXMax;

                xPosMax = xPosMax + ( (moveDelta / element.outerWidth()) * 100 );
                if(xPosMax > 100)  {
                    xPosMax = 100;
                } else if(xPosMax < xPosMin) {
                  xPosMax = xPosMin;
                } else {
                    // Prevent generating "lag" if moving outside window
                    startPointXMax = $event.pageX;
                }
                scope.valueMax = Math.round((((settings.max - settings.min ) * (xPosMax / 100))+settings.min)/settings.step ) * settings.step;
                scope.$apply();
                
                // Move the Handle
                moveHandle("max", element,xPosMax);
                moveRange(element,xPosMin,xPosMax);
            });

            $document.mouseup(function(){
                dragging = false;
                $document.unbind('mousemove');
                $document.unbind('mousemove');
            });
        };
    }
  };
}]);






