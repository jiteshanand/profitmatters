var investdia = angular.module('investdia', ['ngRoute','lifeController','services','ui.bootstrap','ngAnimate','elasticsearch']);

investdia.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
	$locationProvider.html5Mode(true);
	$routeProvider

	.when('/',{
		templateUrl:"partials/home",
		controller:"loginCtrl"
	})

	.when('/home',{
		templateUrl:"partials/home",
		controller:"loginCtrl"
	})

	.when('/signup',{
		templateUrl:"partials/signup",
		controller:"loginCtrl"
	})

	.when('/dashboard',{
		templateUrl:"partials/dashboard",
		controller:"loginCtrl"
	})
	.when('/bank & mutual fund',{
		templateUrl:"partials/bank_mf",
		controller:'bankctrl'
	})

	.when('/banking/fd',{
		templateUrl:"partials/fixedDeposit",
		controller:'bankctrl'
	})

	.when('/banking/saving',{
		templateUrl:"partials/savingAccount",
		controller:'bankctrl'
	})

	.when('/blog',{
		templateUrl:"/blog",	
	})

	.when('/firms',{
		templateUrl:"partials/firms",
		controller:'firmctrl'
	})

	.when('/addLead',{
		templateUrl:"partials/response",
		controller:'firmctrl'
	})

	.when('/govt',{
		templateUrl:"partials/govt",
		controller:'govtctrl'
	})

	.when('/mutualfunds',{
		templateUrl:"partials/mf",
		controller:'mfctrl'
	})

	.when('/mf/list/:mftype',{
		templateUrl:"partials/mfList",
		controller:'mfctrl'
	})

	.when('/mf/:amcId/:categ/:type',{
		templateUrl:"partials/searchmf",
		controller:'mfctrl'
	})	

	.when('/mFund/:fundName',{
		templateUrl:"partials/fundDetail",
		controller:'mfctrl'
	})

	.when('/fund/:mfhistoricaldata',{
		templateUrl:"partials/fundDetail",
		controller:'mfctrl'
	})
	
	// .when('/stocks',{
	// 	templateUrl:"partials/stocks",
	// 	controller:'newsctrl'
	// })
	
	.when('/news',{
		templateUrl:"partials/news",
		controller:'newsctrl'
	})
	
	.when('/stocks',{
		templateUrl:"partials/stocks",
		controller:'stockdatactrl'
	})

	.when('/search',{
		templateUrl:"partials/search",
		controller:'stockdatactrl'
	})

	.when('/stocks/console1',{
		templateUrl:"partials/console1",
		controller:'stockdatactrl'
	})

	.when('/stocks/nifty50',{
		templateUrl:"partials/nifty50",
		controller:'stockdatactrl'
	})

	.when('/stocks/themes',{
		templateUrl:"partials/themes",
		controller:'stockdatactrl'
	})

	.when('/stocks/console2',{
		templateUrl:"partials/console2",
		controller:'stockdatactrl'
	})

	.when('/stocks/sector',{
		templateUrl:"partials/sector",
		controller:'stockdatactrl'
	})

	.when('/stocks/industry/:industryName',{
		templateUrl:"partials/industry",
		controller:'stockdatactrl'
	})

	.when('/bank/fd/:bankId/:bankName',{
		templateUrl:"partials/bank_fd",
		controller:'bankctrl'
	})

	.when('/bank/saving/:bankId/:bankName',{
		templateUrl:"partials/savingDetail",
		controller:'bankctrl'
	})

	.when('/stocks/heatmap',{
		templateUrl:"partials/console_heat",
		controller:'stockdatactrl'
	})
	
	.when('/stock/:tickersymbol',{
		templateUrl:"partials/ticker",
		controller:'stockdatactrl'
	})

	.when('/stock/:tickersymbol/newsdetail',{
		templateUrl:"partials/newsdetail",
		controller:'stockdatactrl'
	})

	.otherwise({
		redirectTo:'/'
	});
	
}
]);
