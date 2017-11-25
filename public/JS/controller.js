var lifeController = angular.module('lifeController', ['ngOrderObjectBy', 'ui.bootstrap', 'highcharts-ng']);
lifeController.controller('loginCtrl', ['$scope', '$http', '$route', '$rootScope', '$routeParams', 'sortable', 'mfsearch', '$location', '$uibModal', function($scope, $http, $route, $rootScope, $routeParams, sortable, mfsearch, $location, $uibModal) {
    $scope.class = "banner-width";
    $scope.logindisplay = false;
    $scope.parseFloat = parseFloat;
    $scope.changesigninClass = function() {
        if ($scope.class === 'banner-width') {
            $scope.class = 'banner-signin-click';
            $scope.logindisplay = true;
        }
    };
    $scope.login = function(loginUser) {
        if (loginUser != '') {
            console.log(loginUser);
            $http.post('/signin', loginUser).success(function(data) {
                $location.url('/dashboard');
                console.log(data);
                $rootScope.currentuser = data.userName;
                $rootScope.currentUserEmail = data.email;
            }).error(function() {
                $scope.alert = 'User ID or Password is Incorrect, Try again.';
            });
        }
    }
    $scope.signup = function(signupUser) {
        $scope.signupUser = signupUser;
        $scope.alert = '';
        if (signupUser != '') {
            $http.post('/signup', signupUser).success(function(data) {
                console.log(data);
                $location.path('/dashboard');
                $rootScope.loggeduser = data;
                $route.reload();
            }).error(function() {
                $scope.alert = 'User Already Registered, Please try again.';
            });
        }
    }
    $http.get('/investment/list').success(function(data) {
        $scope.investedAmount = 0;
        $scope.MFInvestment = 0;
        $scope.allInvestments = data;
        $scope.stockInvestment = 0;
        for (var k = 0; k < data.length; k++) {
            $scope.investedAmount += data[k].investment.totalAmount;
            if (data[k].investment.category == 'Mutual Fund') {
                $scope.MFInvestment += data[k].investment.totalAmount;
            } else if (data[k].investment.category == 'Stocks') {
                $scope.stockInvestment += data[k].investment.totalAmount;
            }
        }
    });
    // $scope.signin = function() {
    //     $scope.loginUser  = {username:'',password:''};
    //     $scope.signupUser  = {username:'',password:'',firstName:'',lastName:''};
    //     $scope.alert = '';
    //     var modal = $uibModal.open({
    //         animation: $scope.animationsEnabled,
    //         templateUrl: "signin.html",
    //         backdrop: true,
    //         controller: function($scope, $uibModalInstance,loginUser,signupUser,alert) {
    //             //$uibModalInstance.dismiss('cancel');
    //             $scope.loginUser = loginUser;
    //             // $scope.alert = '';
    //             $scope.login = function(loginUser){
    //                 if(loginUser != ''){
    //                     $http.post('/signin', loginUser).success(function(data) {
    //                         $location.path('/dashboard');
    //                         $rootScope.loggeduser = data;
    //                         $uibModalInstance.dismiss('cancel');
    //                         $route.reload();
    //                     }).error(function() {
    //                     $scope.alert = alert;
    //                 });;
    //                 }
    //             },
    //             $scope.signup = function(signupUser) {
    //                 $scope.signupUser = signupUser;
    //                 $scope.alert = '';
    //                 if(signupUser != ''){
    //                     $http.post('/signup', signupUser).success(function(data) {
    //                         console.log(data);
    //                         $location.path('/govt');
    //                         $rootScope.loggeduser = data;
    //                         $uibModalInstance.dismiss('cancel');
    //                         $route.reload();
    //                     }).error(function() {
    //                     $scope.alert = 'User Already Registered, Please try again.';
    //                     });
    //                 }
    //             },
    //             $scope.exit = function() {
    //                 $uibModalInstance.dismiss('cancel');
    //             };
    //         },
    //         resolve: {
    //             loginUser: function() {
    //                 return $scope.loginUser;
    //             },
    //             signupUser: function() {
    //                 return $scope.signupUser;
    //             },
    //             alert:function(){
    //                 return $scope.alert;
    //             },
    //             params : function(){ 
    //             return {
    //                 signin : function(){
    //                     $scope.signin();
    //                 },
    //                 signup:function () {
    //                     $scope.signup();
    //                 }
    //             };
    //         }
    //         }
    //     });
    // };
}]);
//MF controller to display info regarding mutual funds
lifeController.controller('mfctrl', ['$scope', '$http', '$route', '$rootScope', '$routeParams', 'sortable', 'mfsearch', '$location', '$uibModal', function($scope, $http, $route, $rootScope, $routeParams, sortable, mfsearch, $location, $uibModal) {
    //$scope.rating = 4;
    $scope.loading = true;
    $scope.content = 'scheme';
    $scope.parseFloat = parseFloat;
    $scope.getSelectedRating = function(rating) {
        console.log(rating);
    };
    var typeDescription = ["Do you want to save tax on your income? We have selected list of mutual funds which can help you to save tax.Choose one and invest in your future.", "Do you want to invest your money but not sure about the safest options? Leave it on us, we have put together funds with lowest risk.", "Do you want to invest your money to get high returns and not afraid of taking risk? We have selected some funds which provides high returns but have risk factor is also high for not performing upto the expectations.Choose wisely.", "We have selected few top performing funds based on the rating given by CRISIL.If you think you can bet your money on experience of CRISIL then select one of these funds to earn.", "Many users like you voting and buying funds here and we are keeping track of everything just for you.We have selected the best selling funds from our platform.If you think it's not good idea to walk alone then Invest in funds where majority is investing"];
    $scope.mftypes = ['Open Ended', 'Close Ended'];
    $scope.mfoption = [
        ['Tax Saving Funds', 'ELSS', 'tax-benefit', typeDescription[0]],
        ['Low Risk Funds', 'lowRisk', 'low-risk', typeDescription[1]],
        ['High Risk Funds', 'highRisk', 'high-risk', typeDescription[2]],
        ['Top performer(Rating given by Crisil)', 'topperform', 'top-perform', typeDescription[3]],
        ['Best Seller', 'best', 'best-seller', typeDescription[4]]
    ];
    //$scope.mfcategory = ['Equity Funds','Debt Funds','Balanced Funds','Liquid Funds','Equity - Tax Saving Funds','Gold Funds','Hybrid-Multiple Assets Funds','International Funds'];
    $scope.mfcategory = [{
        'type': 'open Ended',
        'categ': 'Income'
    }, {
        'type': 'open Ended',
        'categ': 'Balanced'
    }, {
        'type': 'open Ended',
        'categ': 'Growth'
    }, {
        'type': 'open Ended',
        'categ': 'ELSS'
    }, {
        'type': 'open Ended',
        'categ': 'Money Market'
    }, {
        'type': 'open Ended',
        'categ': 'Fund of Funds - Domestic'
    }, {
        'type': 'open Ended',
        'categ': 'Fund of Funds - Overseas'
    }, {
        'type': 'open Ended',
        'categ': 'Gold ETFs'
    }, {
        'type': 'open Ended',
        'categ': 'Gilt'
    }, {
        'type': 'open Ended',
        'categ': 'Other ETFs'
    }, {
        'type': 'Close Ended',
        'categ': 'Income'
    }, {
        'type': 'Close Ended',
        'categ': 'Growth'
    }];
    $scope.crisilrating = ['1', '2', '3', '4', '5'];
    $scope.managerexp = ['0-5 years', '5-10 years', '10-15 years', '15-20 years', 'more than 20 years']
    // $scope.benchmark = ['Nifty50','Nifty100'];
    $scope.familyunit = [{
        "id": 53,
        "name": "Axis Mutual Fund"
    }, {
        "id": 4,
        "name": "Baroda Pioneer Mutual Fund"
    }, {
        "id": 3,
        "name": "Birla Sun Life Mutual Fund"
    }, {
        "id": 59,
        "name": "BNP Paribas Mutual Fund"
    }, {
        "id": 46,
        "name": "BOI AXA Mutual Fund"
    }, {
        "id": 32,
        "name": "Canara Robeco Mutual Fund"
    }, {
        "id": 58,
        "name": "DHFL Pramerica Mutual Fund"
    }, {
        "id": 6,
        "name": "DSP BlackRock Mutual Fund"
    }, {
        id: "47",
        "name": "Edelweiss Mutual Fund"
    }, {
        "id": 13,
        "name": "Escorts Mutual Fund"
    }, {
        "id": 27,
        "name": "Franklin Templeton Mutual Fund"
    }, {
        "id": 49,
        "name": "Goldman Sachs Mutual Fund"
    }, {
        "id": 9,
        "name": "HDFC Mutual Fund"
    }, {
        "id": 37,
        "name": "HSBC Mutual Fund"
    }, {
        "id": 20,
        "name": "ICICI Prudential Mutual Fund"
    }, {
        "id": 57,
        "name": "IDBI Mutual Fund"
    }, {
        "id": 48,
        "name": "IDFC Mutual Fund"
    }, {
        "id": 68,
        "name": "IIFCL Mutual Fund (IDF)"
    }, {
        "id": 62,
        "name": "IIFL Mutual Fund"
    }, {
        "id": 65,
        "name": "IL&FS Mutual Fund (IDF)"
    }, {
        "id": 63,
        "name": "Indiabulls Mutual Fund"
    }, {
        "id": 16,
        "name": "JM Financial Mutual Fund"
    }, {
        "id": 43,
        "name": "JPMorgan Mutual Fund"
    }, {
        "id": 17,
        "name": "Kotak Mahindra Mutual Fund"
    }, {
        "id": 56,
        "name": "L&T Mutual Fund"
    }, {
        "id": 18,
        "name": "LIC NOMURA Mutual Fund"
    }, {
        "id": 69,
        "name": "Mahindra Mutual Fund"
    }, {
        "id": 45,
        "name": "Mirae Asset Mutual Fund"
    }, {
        "id": 55,
        "name": "Motilal Oswal Mutual Fund"
    }, {
        "id": 54,
        "name": "Peerless Mutual Fund"
    }, {
        "id": 64,
        "name": "PPFAS Mutual Fund"
    }, {
        "id": 10,
        "name": "PRINCIPAL Mutual Fund"
    }, {
        "id": 41,
        "name": "Quantum Mutual Fund"
    }, {
        "id": 21,
        "name": "Reliance Mutual Fund"
    }, {
        "id": 42,
        "name": "Religare Invesco Mutual Fund"
    }, {
        "id": 35,
        "name": "Sahara Mutual Fund"
    }, {
        "id": 22,
        "name": "SBI Mutual Fund"
    }, {
        "id": 67,
        "name": "Shriram Mutual Fund"
    }, {
        "id": 66,
        "name": "SREI Mutual Fund (IDF)"
    }, {
        "id": 33,
        "name": "Sundaram Mutual Fund"
    }, {
        "id": 25,
        "name": "Tata Mutual Fund"
    }, {
        "id": 26,
        "name": "Taurus Mutual Fund"
    }, {
        "id": 61,
        "name": "Union KBC Mutual Fund"
    }, {
        "id": 28,
        "name": "UTI Mutual Fund"
    }];
    $scope.collapse = true;
    $scope.search = {};
    $scope.IncludedFund = [];
    $scope.includeFund = function(id) {
        var i = $.inArray(id, $scope.IncludedFund);
        if (i > -1) {
            $scope.IncludedFund.splice(i, 1);
        } else {
            $scope.IncludedFund.push(id);
        }
    };
    $scope.lowRiskFilter = function(item) {
        if (item.risk_rating == "1" || item.risk_rating == "2") {
            return item;
        }
    };
    $scope.highRiskFilter = function(item) {
        if (item.risk_rating == "4" || item.risk_rating == "5") {
            return item;
        }
    };
    $scope.fundFilter = function(fund) {
        if ($scope.IncludedFund.length > 0) {
            if ($.inArray(fund.amc_number, $scope.IncludedFund) < 0) return;
        }
        return fund;
    };
    // =================================toggle the list===============================    
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    // =============================Function for graph ================================
    $scope.chartconfig = function(price) {
        $scope.chartmf = {
            options: {
                rangeSelector: {
                    enabled: true
                },
                chart: {
                    height: 350,
                    width: 600
                },
                navigator: {
                    enabled: true
                }
            },
            title: {
                text: "Mutual Fund Charts"
            },
            xAxis: {
                type: 'datetime',
                ordinal: true
            },
            useHighStocks: true,
            series: [{
                name: 'Mutual Fund',
                data: price,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        }
        return $scope.chartmf;
    }
    // ===============================================================================
    $rootScope.mftype = $routeParams.mftype;
    $rootScope.fundName = $routeParams.fundName;
    $scope.percentagechange_1day = function(today, yester) {
        $scope.changevalue = (today - yester).toFixed(3);
        $scope.percentsavings = (((today - yester) / yester) * 100).toFixed(2);
        return [$scope.changevalue, $scope.percentsavings];
    }
    // $http.get('/mf/'+$rootScope.amcId+'/'+$rootScope.categ).success(function(data) {
    //     $scope.searchMfResult = data;
    //     console.log($scope.searchMfResult);
    // }).finally(function() {
    //     $scope.loading = false;
    // });
    $http.get('/mf/' + $rootScope.mftype).success(function(data) {
        $scope.mfList = data;
    }).finally(function() {
        $scope.loading = false;
    });
    $http.get('/mf/mflist/' + $rootScope.mftype).success(function(data) {
        $scope.mfList_type = data;
    }).finally(function() {
        $scope.loading = false;
    });
    $scope.limitmf = 3;
    $scope.search = {
        exp_min: '0',
        exp_max: '50'
    };

    function differenceFromTodayInDays(FromDate) {
        var currentDate = new Date();
        var previousDate = new Date(FromDate);
        var difference = Math.floor(currentDate.getTime() - previousDate.getTime());
        var secs = Math.floor(difference / 1000);
        var mins = Math.floor(secs / 60);
        var hours = Math.floor(mins / 60);
        var days = Math.floor(hours / 24);
        return days;
    }
    $http.get('/mFund/' + $rootScope.fundName).success(function(data) {
        if (data != '') {
            $scope.schemeDetail = data.fundNameList;
            $scope.fundHistoryDetail = [];
            if (data.fundDetail.length > 0) {
                for (var k = 0; k < data.fundDetail.length; k++) {
                    $scope.mfdata = data.fundDetail[k].values;
                    $scope.reported_date = $scope.mfdata[0].date;
                    var diffOfDays = differenceFromTodayInDays($scope.reported_date);
                    if (diffOfDays <= 7) {
                        $scope.fundHistoryDetail.push(data.fundDetail[k]);
                    }
                }
            }
            if ($scope.fundHistoryDetail.length > 0) {
                $scope.allmfValues = [];
                $scope.allPercentChange = [];
                $scope.chartItem = [];
                for (var k = 0; k < $scope.fundHistoryDetail.length; k++) {
                    $scope.price = [];
                    $scope.mfdata = $scope.fundHistoryDetail[k].values;
                    $scope.today_nav = $scope.mfdata[0].NAV;
                    $scope.reported_date = $scope.mfdata[0].date;
                    if ($scope.mfdata[1] != undefined) {
                        $scope.yesterday_nav = $scope.mfdata[1].NAV;
                    } else {}
                    for (var i = 0; i < $scope.mfdata.length; i++) {
                        $scope.price[i] = [];
                        $scope.price[i].push(Date.parse($scope.mfdata[i].date));
                        $scope.price[i].push($scope.mfdata[i].NAV);
                    }
                    $scope.allPercentChange.push($scope.percentagechange_1day($scope.today_nav, $scope.yesterday_nav));
                    $scope.chartItem.push({
                        "chart": $scope.chartconfig($scope.price.sort())
                    });
                    $scope.allmfValues.push($scope.price);
                }
            }
        }
    }).finally(function() {
        $scope.loading = false;
    });
    // =======================Group by logic of funds ================================
    var indexedFunds = [];
    $scope.fundToFilter = function() {
        indexedFunds = [];
        return $scope.mfList;
    }
    $scope.filterFunds = function(fund) {
        var fundIsNew = indexedFunds.indexOf(fund.schemeName) == -1;
        if (fundIsNew) {
            indexedFunds.push(fund.schemeName);
        }
        return fundIsNew;
    }
    // ================================================================
    $scope.buyThisMf = function(name, amc) {
        $scope.fundName = name;
        $scope.lead = {};
        $scope.vendorName = [{
            "vendor": amc
        }, {
            "vendor": "Bluechip Corporate Investment Centre"
        }, {
            "vendor": "Profit Matter"
        }];
        var modal = $uibModal.open({
            templateUrl: "modalBuyConsole.html",
            windowClass: 'consoleModal',
            closeByDocument: true,
            controller: function($scope, $uibModalInstance, lead, fundName, vendorName, mfList_type) {
                $scope.lead = lead;
                $scope.fundName = fundName;
                $scope.vendorName = vendorName;
                $scope.mfList_type = mfList_type;
                $http.get('/mfAvailable/' + $scope.fundName).success(function(data) {
                    // console.log(data);
                    $scope.availableScheme = data;
                });
                $scope.exit = function() {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.confirm_buy = function(name, vendor, prod, type) {
                    $scope.vendor1 = vendor;
                    $scope.schemeName = name;
                    $scope.product = prod;
                    $scope.type = type;
                    console.log($scope.schemeName);
                    var data = JSON.stringify({
                        customerName: $scope.lead.name,
                        mobile: $scope.lead.mobile,
                        email: $scope.lead.email,
                        schemeName: $scope.schemeName,
                        vendor: $scope.vendor1,
                        product: $scope.product,
                        type: $scope.type
                    });
                    $http.post("/mfBuy/addLead", data).success(function(response) {
                        alert("Details Submitted Successfully.Thanks!\nWe will contact you in 24hrs.");
                    }).error(function() {
                        alert("Details not submitted.Please try again after sometime.");
                    });
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                lead: function() {
                    return $scope.lead;
                },
                fundName: function() {
                    return $scope.fundName;
                },
                availableScheme: function() {
                    return $scope.availableScheme;
                },
                vendorName: function() {
                    return $scope.vendorName;
                },
                mfList_type: function() {
                    return $scope.mfList_type;
                }
            }
        });
        // return modal;
    };
    $scope.callbackThisMf = function(name, amc) {
        $scope.fundName = name;
        $scope.lead = {};
        var modal = $uibModal.open({
            templateUrl: "modalCallbackConsole.html",
            windowClass: 'consoleModal',
            closeByDocument: true,
            controller: function($scope, $uibModalInstance, lead, fundName) {
                $scope.lead = lead;
                $scope.fundName = fundName;
                $scope.exit = function() {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.confirm_callback = function(name, prod, type) {
                    $scope.schemeName = name;
                    $scope.product = prod;
                    $scope.type = type;
                    var data = JSON.stringify({
                        customerName: $scope.lead.name,
                        mobile: $scope.lead.mobile,
                        email: $scope.lead.email,
                        schemeName: $scope.schemeName,
                        product: $scope.product,
                        type: $scope.type,
                        comment: $scope.lead.comment
                    });
                    $http.post("/mfBuy/addLead", data).success(function(response) {
                        alert("Details Submitted Successfully.Thanks!\nWe will contact you in 24hrs.");
                    }).error(function() {
                        alert("Details not submitted.Please try again after sometime.");
                    });
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                lead: function() {
                    return $scope.lead;
                },
                fundName: function() {
                    return $scope.fundName;
                }
            }
        });
        // return modal;
    };
    $scope.relatedFunds = function(category) {
        $http.get('/mf/mflist/' + category).success(function(data) {
            $scope.mfList = data;
        }).finally(function() {
            $scope.loading = false;
        });
    };
    $scope.mfSearchResult = function(type, categ, Id) {
        $scope.schemeType = type;
        $scope.category = categ;
        $scope.amcId = Id;
        var modal = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "mfSearchResult1.html",
            backdrop: true,
            controller: function($scope, $uibModalInstance, category, amcId, schemeType) {
                $scope.category = category;
                $scope.amcId = amcId;
                $scope.schemeType = schemeType;
                $http.get('/mfsearch/' + $scope.amcId + '/' + $scope.category + '/' + $scope.schemeType).success(function(data) {
                    $scope.searchMfResult = data;
                }).finally(function() {
                    $scope.loading = false;
                });
                $scope.exit = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                searchMfResult: function() {
                    return $scope.searchMfResult;
                },
                category: function() {
                    return $scope.category;
                },
                amcId: function() {
                    return $scope.amcId;
                },
                schemeType: function() {
                    return $scope.schemeType;
                }
            }
        });
    };
    // ==================================================================
    $rootScope.nav_number = $routeParams.nav;
    //industry search for the ticker symbol obtained from route param
    $scope.getmfdetail = function(nav) {
        $rootScope.mfrecord = '';
        mfsearch.searchmf(nav).then(function(results) {
            $rootScope.mfrecord = results;
            //$scope.selected_nav = $rootScope.mfrecord[0]._source.scheme_nav[0].nav_code;
        });
    }
    // function to show mf data from database
    $scope.showmfdata = function(code) {
        $http.post('/mf/' + $rootScope.nav_number + '/' + code).success(function(data) {
            $scope.mfdata = data[0].values;
            $scope.today_nav = $scope.mfdata[$scope.mfdata.length - 1].open;
            $scope.reported_date = $scope.mfdata[$scope.mfdata.length - 1].date;
            $scope.yesterday_nav = $scope.mfdata[$scope.mfdata.length - 2].open;
            if ($scope.today_nav == undefined) {
                $scope.today_nav = $scope.yesterday_nav;
                $scope.yesterday_nav = $scope.mfdata[$scope.mfdata.length - 3].open;
                $scope.reported_date = $scope.mfdata[$scope.mfdata.length - 2].date;
            }
            $scope.price = [];
            for (var i = 0; i < $scope.mfdata.length - 2; i++) {
                $scope.price[i] = [];
                $scope.price[i].push(Date.parse($scope.mfdata[i].date));
                $scope.price[i].push($scope.mfdata[i].open);
            }
            $scope.percentagechange_1day($scope.today_nav, $scope.yesterday_nav);
            $scope.chartItem = {
                "chart": $scope.chartconfig($scope.price)
            }
        }).error(function() {
            console.log("Data retrieval failed");
        });
    }
    $scope.loading = false;
    $scope.days30 = [];
    $scope.days90 = [];
    $scope.days180 = [];
    $scope.days270 = [];
    $scope.days365 = [];
    $scope.timeDiffInDays = function(index, otherDate) {
        var differenceInDays = differenceFromTodayInDays(otherDate);
        if (differenceInDays == 30 || differenceInDays == 31 || differenceInDays == 32) {
            $scope.days30.push(index);
        } else if (differenceInDays == 90 || differenceInDays == 91) {
            $scope.days90.push(index);
        } else if (differenceInDays == 180 || differenceInDays == 181) {
            $scope.days180.push(index);
        } else if (differenceInDays == 270 || differenceInDays == 271) {
            $scope.days270.push(index);
        } else if (differenceInDays == 365 || differenceInDays == 366) {
            $scope.days365.push(index);
        }
    };
}]);
//firm controller to display info regarding brokerage firms
lifeController.controller('firmctrl', ['$scope', '$http', '$route', '$rootScope', 'sortable', '$location', '$uibModal', function($scope, $http, $route, $rootScope, sortable, $location, $uibModal) {
    $scope.loading = true;
    $scope.firmType = ['Full Service Broker', 'Discount Broker'];
    $scope.investment_type = [{
        "label": "Stocks",
        "value": "stocks"
    }, {
        "label": "Options",
        "value": "options"
    }, {
        "label": "Futures",
        "value": "futures"
    }, {
        "label": "Commodity",
        "value": "commodity"
    }, {
        "label": "Mutual Funds",
        "value": "mutualFunds"
    }, {
        "label": "Bonds",
        "value": "bonds"
    }, {
        "label": "ETF",
        "value": "etf"
    }];
    $scope.product_feature = [{
        "label": "3 in 1 Account",
        "value": "threeinOneAccount"
    }, {
        "label": "Automated Trading",
        "value": "automatedTrading"
    }, {
        "label": "SMS Alerts",
        "value": "smsAlerts"
    }, {
        "label": "Online Platform",
        "value": "onlinePlatform"
    }, {
        "label": "Broker Assistance",
        "value": "brokerAssistance"
    }, {
        "label": "Mobile App",
        "value": "mobileApp"
    }, {
        "label": "Research Reports",
        "value": "researchReports"
    }];
    // $scope.rating = 0;
    $scope.rating = 4;
    $scope.getSelectedRating = function(rating) {
        console.log(rating);
    }
    // ================================================================
    $scope.IncludedFund = [];
    $scope.includeType = function(type) {
        var i = $.inArray(type, $scope.IncludedFund);
        if (i > -1) {
            $scope.IncludedFund.splice(i, 1);
        } else {
            $scope.IncludedFund.push(type);
        }
    };
    $scope.IncludedFeature = [];
    $scope.includeFeature = function(feature) {
        var i = $.inArray(feature, $scope.IncludedFeature);
        if (i > -1) {
            $scope.IncludedFeature.splice(i, 1);
        } else {
            $scope.IncludedFeature.push(feature);
        }
        // console.log($scope.IncludedFeature);
    };
    $scope.brokerFilter = function(broker) {
        var ret = [];
        if ($scope.IncludedFund.length > 0) {
            for (i = 0; i < $scope.IncludedFund.length; i++) {
                var query = ($scope.IncludedFund[i]);
                if (broker.investmentOption[query] == true) {
                    ret.push(broker);
                } else {
                    return;
                }
            }
        }
        return ret;
    };
    $scope.featureFilter = function(feature) {
        var ret = [];
        if ($scope.IncludedFeature.length > 0) {
            for (i = 0; i < $scope.IncludedFeature.length; i++) {
                var query = ($scope.IncludedFeature[i]);
                if (feature.firmFeature[query] == true) {
                    ret.push(feature);
                } else {
                    return;
                }
            }
        }
        return ret;
    };
    //===============================Get call to display all firms data==========================
    $http.get('/firms/list').success(function(data) {
        $scope.firms = data;
        sortable($scope, $scope.firms, 40, 'updated_at');
    }).finally(function() {
        $scope.loading = false;
    });
    // =============================Modal config================================================
    $scope.animationsEnabled = true;
    $scope.lead = {};
    $scope.brokerName = '';
    $scope.leadType = '';
    $scope.open = function(name, prod, type) {
        $scope.brokerName = name;
        $scope.leadType = type;
        $scope.product = prod;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newAccount.html',
            backdrop: true,
            controller: function($scope, $uibModalInstance, lead, brokerName, leadType, product) {
                $scope.lead = lead;
                $scope.brokerName = brokerName;
                $scope.leadType = leadType;
                $scope.product = product;
                $scope.openNewAccount = function() {
                    var data = JSON.stringify({
                        customerName: $scope.lead.name,
                        mobile: $scope.lead.mobile,
                        email: $scope.lead.email,
                        comment: $scope.lead.comment,
                        brokerName: $scope.brokerName,
                        type: $scope.leadType,
                        product: $scope.product
                    });
                    $http.post("/firms/addLead", data).success(function(response) {
                        alert("Details Submitted Successfully.Thanks!");
                    }).error(function() {
                        alert("Details not submitted.Please try again after sometime.");
                    });
                    $uibModalInstance.dismiss('cancel');
                }
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                lead: function() {
                    return $scope.lead;
                },
                brokerName: function() {
                    return $scope.brokerName;
                },
                leadType: function() {
                    return $scope.leadType;
                },
                product: function() {
                    return $scope.product;
                }
            }
        });
    };
    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    // ===========================================================================
}]);
lifeController.controller('newsctrl', ['$scope', '$http', '$route', 'stockSocket', '$rootScope', function($scope, $http, $route, stockSocket, $rootScope) {
    //socket code for global news feeds
    stockSocket.emit('globalfeed');
    stockSocket.on('globalnewsfeed', function(data) {
        $scope.globalnewsfeed = data;
    })
    // stockSocket.emit('nationlfeed');
    stockSocket.on('nationalnewsfeed', function(data1) {
        $rootScope.nationalnewsfeed = data1;
        // console.log($scope.nationalnewsfeed);
    });
    // $scope.newsSymbol = ['ACC','ADANIPORTS','AMBUJACEM','APOLLOHOSP','ASHOKLEY','ASIANPAINT','AUROPHARMA','AXISBANK','BAJAJ-AUTO','BAJAJFINSV','BAJAJHLDNG','BANKBARODA','BANKINDIA','BHARATFORG','BHEL','BPCL','BHARTIARTL','INFRATEL','BOSCHLTD','BRITANNIA','CAIRN','CANBK','CIPLA','COALINDIA','COLPAL','CONCOR','CUMMINSIND','DABUR','DIVISLAB','DRREDDY','EICHERMOT','EXIDEIND','FEDERALBNK','GAIL','GSKCONS','GLAXO','GLENMARK','GODREJCP','GRASIM','HCLTECH','HDFCBANK','HEROMOTOCO','HINDALCO','HINDPETRO','HINDUNILVR','HDFC','ITC','ICICIBANK','IDEA','IBULHSGFIN','IOC','INDUSINDBK','INFY','JSWSTEEL','KOTAKBANK','LICHSGFIN','LT','LUPIN','MRF','M%26M','M%26MFIN','MARICO','MARUTI','MOTHERSUMI','NMDC','NTPC','ONGC','OIL','OFSS','PETRONET','PFC','POWERGRID','PNB','RELCAPITAL','RCOM','RELIANCE','RELINFRA','RECLTD','SRTRANSFIN','SIEMENS','SBIN','SAIL','SUNPHARMA','SUNDARMFIN','TATACHEM','TCS','TATAGLOBAL','TATAMOTORS','TATAPOWER','TATASTEEL','TECHM','TITAN','UPL','ULTRACEMCO','UBL','MCDOWELL-N','VEDL','WIPRO','YESBANK','ZEEL'];
    $scope.newsSymbol = [{
        "symbol": 'ACC',
        "name": "ACC"
    }, {
        "symbol": 'ADANIPORTS',
        "name": "Adani Ports"
    }, {
        "symbol": 'AMBUJACEM',
        "name": "Ambuja Cement"
    }, {
        "symbol": 'APOLLOHOSP',
        "name": "Apollo hospitals"
    }, {
        "symbol": 'ASHOKLEY',
        "name": "Ashok Leyland"
    }, {
        "symbol": 'ASIANPAINT',
        "name": "Asian Paints"
    }, {
        "symbol": 'AUROPHARMA',
        "name": "Aurobindo Pharma"
    }, {
        "symbol": 'AXISBANK',
        "name": "Axis Bank"
    }, {
        "symbol": 'BAJAJ-AUTO',
        "name": "Bajaj Bank"
    }, {
        "symbol": 'BAJAJFINSV',
        "name": "Bajaj Financial Services"
    }, {
        "symbol": 'BAJAJHLDNG',
        "name": "Bajaj Holdings"
    }, {
        "symbol": 'BANKBARODA',
        "name": "Bank of Baroda"
    }, {
        "symbol": 'BANKINDIA',
        "name": "Bank of India"
    }, {
        "symbol": 'BHARATFORG',
        "name": "Bharat Forge"
    }, {
        "symbol": 'BHEL',
        "name": "Bhel"
    }, {
        "symbol": 'BPCL',
        "name": "Bharat Petrolium"
    }, {
        "symbol": 'BHARTIARTL',
        "name": "Bharti Airtel"
    }, {
        "symbol": 'INFRATEL',
        "name": "Bharti Infratel"
    }, {
        "symbol": 'BOSCHLTD',
        "name": "Bosch"
    }, {
        "symbol": 'BRITANNIA',
        "name": "BRITANNIA"
    }, {
        "symbol": 'CAIRN',
        "name": "CAIRN"
    }, {
        "symbol": 'CANBK',
        "name": "Canara Bank"
    }, {
        "symbol": 'CIPLA',
        "name": "CIPLA"
    }, {
        "symbol": 'COALINDIA',
        "name": "Coal India"
    }, {
        "symbol": 'COLPAL',
        "name": "Colgate Palmolive"
    }, {
        "symbol": 'CONCOR',
        "name": "Container Corporation of India"
    }, {
        "symbol": 'CUMMINSIND',
        "name": "Cummins India"
    }, {
        "symbol": 'DABUR',
        "name": "Dabur"
    }, {
        "symbol": 'DIVISLAB',
        "name": "DIVISLAB"
    }, {
        "symbol": 'DRREDDY',
        "name": "Dr. Reddy's Laboratories"
    }, {
        "symbol": 'EICHERMOT',
        "name": "Eicher Motors"
    }, {
        "symbol": 'EXIDEIND',
        "name": "Exide India"
    }, {
        "symbol": 'FEDERALBNK',
        "name": "Federal Bank"
    }, {
        "symbol": 'GAIL',
        "name": "GAIL India"
    }, {
        "symbol": 'GSKCONS',
        "name": "GlaxoSmithKline Consumer Healthcare"
    }, {
        "symbol": 'GLAXO',
        "name": "GlaxoSmithKline Pharmaceuticals"
    }, {
        "symbol": 'GLENMARK',
        "name": "Glenmark Pharmaceuticals"
    }, {
        "symbol": 'GODREJCP',
        "name": "Godrej Consumer Products"
    }, {
        "symbol": 'GRASIM',
        "name": "Grasim"
    }, {
        "symbol": 'HCLTECH',
        "name": "HCL technologies"
    }, {
        "symbol": 'HDFCBANK',
        "name": "HDFC Bank"
    }, {
        "symbol": 'HEROMOTOCO',
        "name": "Hero Motors"
    }, {
        "symbol": 'HINDALCO',
        "name": "Hindalco"
    }, {
        "symbol": 'HINDPETRO',
        "name": "Hindustan Petrolium"
    }, {
        "symbol": 'HINDUNILVR',
        "name": "Hindustan Unilever"
    }, {
        "symbol": 'HDFC',
        "name": "HDFC"
    }, {
        "symbol": 'ITC',
        "name": "ITC"
    }, {
        "symbol": 'ICICIBANK',
        "name": "ICICI BANK"
    }, {
        "symbol": 'IDEA',
        "name": "IDEA"
    }, {
        "symbol": 'IBULHSGFIN',
        "name": "Indiabulls Housing Finance"
    }, {
        "symbol": 'IOC',
        "name": "Indian Oil corporation"
    }, {
        "symbol": 'INDUSINDBK',
        "name": "IndusInd Bank"
    }, {
        "symbol": 'INFY',
        "name": "Infosys Ltd"
    }, {
        "symbol": 'JSWSTEEL',
        "name": "JSW Steel Limited"
    }, {
        "symbol": 'KOTAKBANK',
        "name": "Kotak Mahindra Bank"
    }, {
        "symbol": 'LICHSGFIN',
        "name": "LIC Housing Finance"
    }, {
        "symbol": 'LT',
        "name": "Larsen & Toubro Limited"
    }, {
        "symbol": 'LUPIN',
        "name": "Lupin"
    }, {
        "symbol": 'MRF',
        "name": "MRF"
    }, {
        "symbol": 'M%26M',
        "name": "Mahindra & Mahindra"
    }, {
        "symbol": 'M%26MFIN',
        "name": "Mahindra & Mahindra Finance"
    }, {
        "symbol": 'MARICO',
        "name": "Marico"
    }, {
        "symbol": 'MARUTI',
        "name": "Maruti"
    }, {
        "symbol": 'MOTHERSUMI',
        "name": "Motherson Sumi Systems"
    }, {
        "symbol": 'NMDC',
        "name": "National Mineral Development Corporation"
    }, {
        "symbol": 'NTPC',
        "name": "NTPC"
    }, {
        "symbol": 'ONGC',
        "name": "Oil & Natural Gas Corporation"
    }, {
        "symbol": 'OIL',
        "name": "Oil India"
    }, {
        "symbol": 'OFSS',
        "name": "Oracle Financial Services Software"
    }, {
        "symbol": 'PETRONET',
        "name": "Petronet LNG"
    }, {
        "symbol": 'PFC',
        "name": "Power Finance Corporation"
    }, {
        "symbol": 'POWERGRID',
        "name": "Power Grid Corporation of India"
    }, {
        "symbol": 'PNB',
        "name": "Punjab National Bank"
    }, {
        "symbol": 'RELCAPITAL',
        "name": "Reliance Capital"
    }, {
        "symbol": 'RCOM',
        "name": "Reliance Communication"
    }, {
        "symbol": 'RELIANCE',
        "name": "Reliance Industries"
    }, {
        "symbol": 'RELINFRA',
        "name": "Reliance Infra"
    }, {
        "symbol": 'RECLTD',
        "name": "Rural Electrification Corporation"
    }, {
        "symbol": 'SRTRANSFIN',
        "name": "Shriram Transport Finance Company"
    }, {
        "symbol": 'SIEMENS',
        "name": "SIEMENS"
    }, {
        "symbol": 'SBIN',
        "name": "State Bank of India"
    }, {
        "symbol": 'SAIL',
        "name": "Steel Authority of India Limited"
    }, {
        "symbol": 'SUNPHARMA',
        "name": "Sun Pharma"
    }, {
        "symbol": 'SUNDARMFIN',
        "name": "Sundaram Finance"
    }, {
        "symbol": 'TATACHEM',
        "name": "Tata Chemicals"
    }, {
        "symbol": 'TCS',
        "name": "Tata Consultancy Service"
    }, {
        "symbol": 'TATAGLOBAL',
        "name": "Tata Global Beverages"
    }, {
        "symbol": 'TATAMOTORS',
        "name": "Tata Motors"
    }, {
        "symbol": 'TATAPOWER',
        "name": "Tata Power"
    }, {
        "symbol": 'TATASTEEL',
        "name": "Tata Steel"
    }, {
        "symbol": 'TECHM',
        "name": "Tech Mahindra"
    }, {
        "symbol": 'TITAN',
        "name": "Titan Industries"
    }, {
        "symbol": 'UPL',
        "name": "United Phosphorus"
    }, {
        "symbol": 'ULTRACEMCO',
        "name": "Ultra Tech cement"
    }, {
        "symbol": 'UBL',
        "name": "United Brewries"
    }, {
        "symbol": 'MCDOWELL-N',
        "name": "United Spirits"
    }, {
        "symbol": 'VEDL',
        "name": "Vedanta Limited"
    }, {
        "symbol": 'WIPRO',
        "name": "Wipro"
    }, {
        "symbol": 'YESBANK',
        "name": "Yes Bank"
    }, {
        "symbol": 'ZEEL',
        "name": "Zee Entertainment"
    }];
}]);
lifeController.controller('stockdisplayctrl', ['$scope', '$filter', '$http', '$location', '$route', '$rootScope', '$routeParams', 'sortable', 'stocksearch', 'stockSocket', 'instantSearch', '$uibModal', function($scope, $filter, $http, $location, $route, $rootScope, $routeParams, sortable, stocksearch, stockSocket, instantSearch, $uibModal) {
    //     // ===================== Modal for console ===================================
    $scope.showConsole = function() {
        $scope.option = [
            ['Top Gainers', 'console1', 'fa-level-up'],
            ['Top Losers', 'console1', 'fa-level-down'],
            ['Volume Toppers', 'console1', 'fa-bar-chart'],
            ['Indian Indices', 'console2', 'fa-inr'],
            ['Global Indices', 'console2', 'fa-usd'],
            ['Exchange Rate', 'console2', 'fa-exchange'],
            ['Heat Map', 'heatmap', 'fa-th']
        ];
        $scope.consoleTitle = "Stock market console.Please select one of the below options.";
        var modal = $uibModal.open({
            templateUrl: "modalConsole.html",
            controller: function($scope, $uibModalInstance, option, consoleTitle) {
                $scope.option = option;
                $scope.consoleTitle = consoleTitle;
                $scope.exit = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                option: function() {
                    return $scope.option;
                },
                consoleTitle: function() {
                    return $scope.consoleTitle;
                }
            }
        });
        // return modal;
    };
    $scope.showIndustries = function() {
        $scope.option = [
            ['Banking', 'industry/bank', 'fa-university'],
            ['Automobile', 'industry/auto', 'fa-truck'],
            ['IT', 'industry/IT', 'fa-laptop'],
            ['Telecom', 'industry/telecom', 'fa-phone-square'],
            ['Energy & Power', 'industry/energy', 'fa-industry'],
            ['Health Care', 'industry/health', 'fa-heartbeat'],
            ['FMCG', 'industry/fmcg', 'fa-shopping-cart']
        ];
        $scope.consoleTitle = "Please select industry from below options :";
        var modal = $uibModal.open({
            templateUrl: "modalConsole.html",
            windowClass: 'consoleModal',
            class4modal: "demo",
            closeByDocument: true,
            controller: function($scope, $uibModalInstance, option, consoleTitle) {
                $scope.option = option;
                $scope.consoleTitle = consoleTitle;
                $scope.exit = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                option: function() {
                    return $scope.option;
                },
                consoleTitle: function() {
                    return $scope.consoleTitle;
                }
            }
        });
        return modal;
    };
    $scope.showThemes = function() {
        $scope.option = [
            [],
            ['Coming Soon']
        ];
        $scope.consoleTitle = "Please select theme from below options :";
        var modal = $uibModal.open({
            templateUrl: "modalConsole.html",
            windowClass: 'consoleModal',
            class4modal: "demo",
            closeByDocument: true,
            controller: function($scope, $uibModalInstance, option, consoleTitle) {
                $scope.option = option;
                $scope.consoleTitle = consoleTitle;
                $scope.exit = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                option: function() {
                    return $scope.option;
                },
                consoleTitle: function() {
                    return $scope.consoleTitle;
                }
            }
        });
        return modal;
    };
}]);


lifeController.controller('stockdatactrl', ['$scope', '$filter', '$http', '$location', '$route', '$rootScope', '$routeParams', 'sortable', 'stocksearch', 'stockSocket', 'instantSearch', '$uibModal', function($scope, $filter, $http, $location, $route, $rootScope, $routeParams, sortable, stocksearch, stockSocket, instantSearch, $uibModal) {


    var Nifty50 = '714985,6613325,10538352,5362129,3261730,10882080,3626083,16529291,10360734,5391783,16134436,3578659,11778864,10984042,10627180,787381,13082940,60272,6153279,3563195,267163,56328892808487,16345036,12976119,255437299298490,675530,12588850,4153787,678082,2042500,10555516,6565540,7152373,6709566,674868,3061589,4674509,13564339,677258,9708440,11539104,784961,16255299,1694733,5674106,5968245,5955635,13135144,9055815,12485388';

    // var indices = 'NSE:NIFTY,INDEXBOM:SENSEX,NSE:CNX100,INDEXBOM:BSE-100,NSE:CNX500,INDEXBOM:BSE-500,NSE:CNXMIDCAP,INDEXBOM:BSE-MIDCAP,INDEXNASDAQ:.IXIC,INDEXDJX:DJI,INDEXSP:INX,SHA:000001,INDEXNIKKEI:NI225,INDEXHANGSENG:HSI,INDEXFTSE:UKX,INDEXDB:DAX,INDEXSTOXX:SX5E,INDEXBOM:BSE-SMLCAP';

    var indicesId = '207437,15173681,10460783,2047876,15932900,3573979,11904494,7639460,5245668,382443,10662683,8596506,5081857,13756934,983582,626307,7521596,15513676,13414271,12590587,14199910,7354851,1947573';

    var sectors = 'NSE:CNXBANK,NSE:CNXIT,NSE:CNXPHARMA,NSE:CNXENERGY,NSE:CNXPSUBANK';

    var Nifty100 = '714985,11787956,6613325,15510678,7147553,10538352,5362129,3261730,10882080,1361072,12050351,8677390,237202,9974936,3626083,15274130,16529291,10360734,15279585,6038818,6775936,5391783,16134436,12883614,12410892,605761,829919,4017916,3578659,11778864,8835592,5904015,10984042,13313409,6346721,14547540,2765899,8955381,10627180,787381,13082940,60272,6153279,3563195,267163,56328892808487,16345036,11758968,12976119,255437299298490,675530,12588850,4153787,2903146,678082,1477704,2042500,10555516,6565540,11784956,1826071,7152373,16118513,13309952,5885777,9863867,6709566,5538683,10639382,674868,13131186,16384607,333651,3061589,9075590,718921,374785,4674509,8331198,4777716,13564339,6204336,11940538,6950297,677258,5500303,4839971,9708440,5301348,11539104,784961,5955635,129447555669492,4768675,16255299,13135144,1694733,9055815,5674106,5968245';

    $scope.parseFloat = parseFloat; //initializing parsefloat to be used in html
    $scope.parseInt = parseInt; //initializing parseInt to be used in html
    $scope.options = ['Top Gainers', 'Top Losers', 'Volume'];
    $scope.gridToggle = true; // By default grid blocks will be displayed.
    $scope.content = 'Fundamentals'; //By default radio button of news will be selected on ticker page

    $scope.MACD_Text = 'Moving average convergence divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of prices. The MACD is calculated by subtracting the 26-day exponential moving average (EMA) from the 12-day EMA. A nine-day EMA of the MACD, called the "signal line", is then plotted on top of the MACD, functioning as a trigger for buy and sell signals.';
    $scope.MA_Text = 'A moving average (MA) is a trend-following or lagging indicator because it is based on past prices. The two basic and commonly used MAs are the simple moving average (SMA), which is the simple average of a security over a defined number of time periods, and the exponential moving average (EMA), which gives bigger weight to more recent prices. The most common applications of MAs are to identify the trend direction and to determine support and resistance levels.';
    $scope.PE_Text = ['The price-earnings ratio (P/E Ratio) is the ratio for valuing a company that measures its current share price relative to its per-share earnings.', 'The price-earnings ratio can be calculated as:', 'Market Value per Share / Earnings per Share', 'So, the lower the P/E ratio, the less expensive the stock']
    // ===============================  Generic code that must be active  =================================
    //code to get real time data of 100 stocks with socket.io
    $scope.predicate = 'values[3]';
    $scope.niftystocks = [];
    stockSocket.emit('ticker', Nifty50);
    stockSocket.on('quote', function(data) {
        if (angular.equals({}, data)) {
            console.log("Empty String");
        } else {
            var stockJSONObj = JSON.parse(data);
            $scope.niftystocks = stockJSONObj.company.related.rows;
            $scope.niftystocks.map(function(stock) {
                stock.values[9] = parseFloat(stock.values[9]);
            });
            if ($rootScope.industryPeers != undefined) {
                if ($scope.niftystocks.length == 50 && $rootScope.industryPeers.length > 0) {
                    $scope.peers = [];
                    angular.forEach($rootScope.industryPeers, function(value, index) {
                        angular.forEach($scope.niftystocks, function(object, index1) {
                            if (value._source.symbol == object.values[3]) {
                                $scope.peers.push(object);
                            }
                        })
                    });
                    sortable($scope, $scope.niftystocks, 50, 'updated_at');
                }
            }
        }
    });
    //function to show real time data of all indices
    $scope.showIndex = function() {
        stockSocket.emit('index', indicesId);
        stockSocket.on('Index', function(data) {
            if (angular.equals({}, data)) {
                console.log("Empty String");
            } else {
                // var index = data.indexOf('rows');
                // var data1 = data.substring(index);
                // data1 = data1.replace(/rows:/g, '{"rows":').replace(/id:/g, '"id":').replace(/values:/g, '"values":');
                // var index1 = data1.indexOf(',visible_cols');
                // var indexJSONObj = JSON.parse(data1.substring(0, index1) + '}');
                var indexJSONObj = JSON.parse(data);
                $scope.allIndices = indexJSONObj.company.related.rows;
                //$scope.allIndices = indexJSONObj.rows;
                //$rootScope.allIndices = angular.fromJson(data.substring(3));
        
            }
        });
    }

// $scope.shownews = function(e){
//     $scope.todayDate = new Date();
//     var dd = $scope.todayDate .getDate() - 1;
//     var mm = $scope.todayDate .getMonth()+1; //January is 0!

//     var yyyy = $scope.todayDate .getFullYear();
//     if(dd<10){
//         dd='0'+dd;
//     } 
//     if(mm<10){
//         mm='0'+mm;
//     } 
//     $scope.todayDate = dd+'/'+mm+'/'+yyyy;
//     if(e.date.substring(0,10) >= $scope.todayDate){
//         return true;
//     }
// }

    //function to show data based on sectors
    // $scope.showSector = function() {
    //     stockSocket.emit('sector', sectors);
    //     stockSocket.on('Sector', function(data) {
    //         if (angular.equals({}, data)) {
    //             console.log("Empty String");
    //         } else {
    //             console.log("3 is " + data);
    //             $rootScope.allSectors = angular.fromJson(data.substring(3));
    //         }
    //     });
    // }
    //function to show currency exchange value
    $scope.showCurrency = function() {
        stockSocket.emit('currency');
        stockSocket.on('Currency', function(data) {
            $rootScope.currencies = angular.fromJson(data).query.results.rate;
        });
    }
    //function to filter our national indices
    $scope.getnationalindex = function(e) {
        if (e.values[4] == 'NSE' || e.values[4] == 'INDEXBOM') {
            return e;
        }
    }
    //function to flter out global indices
    $scope.getglobalindex = function(e) {
        if (e.values[4] != 'NSE' && e.values[4] != 'INDEXBOM') {
            return e;
        }
    }
    //funtion to provide color to heat map
    $scope.getmapclass = function(e) {
        if (e >= 5.0) {
            return 'map-card-bg-abv5';
        } else if (e >= 3.0 && e < 5.0) {
            return 'map-card-bg-30to5';
        } else if (e >= 1.5 && e < 3.0) {
            return 'map-card-bg-2to30';
        } else if (e > 0 && e < 1.5) {
            return 'map-card-bg-0to15';
        } else if (e <= -5.0) {
            return 'map-card-bg-neg-abv5';
        } else if (e <= -3.0 && e > -5.0) {
            return 'map-card-bg-neg-30to5';
        } else if (e <= -1.5 && e > -3.0) {
            return 'map-card-bg-neg-2to30';
        } else if (e < 0 && e > -1.5) {
            return 'map-card-bg-neg-0to15';
        } else {
            return 'map-card-bg-at0';
        }
    }
    //function to get money in String format e.g. Rs 1.5M
    $scope.getformatmoney = function(num) {
        if (num != undefined) {
            var abs = Math.abs(num);
            if (abs >= Math.pow(10, 12)) {
                // # trillion
                num = (num / Math.pow(10, 12)).toFixed(1) + "T";
                return num;
            } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
                // # billion
                num = (num / Math.pow(10, 9)).toFixed(1) + "B";
                return num;
            } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
                // # million
                num = (num / Math.pow(10, 6)).toFixed(1) + "M";
                return num;
            } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
                // # thousand
                num = (num / Math.pow(10, 3)).toFixed(1) + "K";
                return num;
            } else {
                return num;
            }
        } else {
            return num;
        }
    };
    //function to convert volume to integer format
    $scope.strtonum = function(e) {
        $scope.item = e.vo;
        var test = '"' + $scope.item + '"';
        var testval = 0;
        if (test.indexOf('M') > -1) {
            test = test.replace("M", "");
            test = test.replace(/\"/g, '');
            testval = parseFloat(test);
            e.vo = testval * 1000000;
            return e;
        } else {
            test = test.replace(/\,/g, '');
            test = test.replace(/\"/g, '');
            e.vo = parseFloat(test);
            return e;
        }
        return e;
    };
    //function to convert any numeric value in string format to Integer format
    $scope.strtoint = function(price) {
        price = price.replace(/\,/g, '');
        price = price.replace(/\"/g, '');
        return parseFloat(price);
    }
    // getting ticker symbol from url
    $scope.tickersymbol = $filter('uppercase')($routeParams.tickersymbol);
    //http call to get currently active stock data
    if ($scope.tickersymbol != undefined && $scope.tickersymbol != '') {
        $http.get('/stockData/' + $scope.tickersymbol).success(function(data) {
            $scope.activeTickerInfo = JSON.parse(data.replace(/\/\//g, '').replace(/\\x([0-9a-fA-F]{2})/g, "\\u00$1"));
        });
    }

    $scope.getNiftyValues = function(){
        $http.get('/stockData/' + 'NIFTY').success(function(data) {
            $scope.niftyVal = JSON.parse(data.replace(/\/\//g, '').replace(/\\x([0-9a-fA-F]{2})/g, "\\u00$1"));
        });

    }
 
    // =====================   Code to Get the industry stocks   ===================================
    // industry search for the ticker symbol obtained from route param
    $scope.searchindustry = function(tickerSymbol) {
        $scope.industrystock = '';
        $rootScope.industryPeers = [];
        $scope.loading = true;
        $http.get("/industry/" + tickerSymbol).then(function(results) {
            $scope.industrystock = results.data[0];
            $rootScope.industryinuse = $scope.industrystock._source.industry;
            $scope.nameinuse = $scope.industrystock._source.name;
            $rootScope.tweethandle = $scope.industrystock._source.tweet;
            stockSocket.emit('tweet', $rootScope.tweethandle);
            // http call to get news feed of currently active stock symbol
            if ($scope.nameinuse != undefined || $scope.nameinuse != '') {
                $http.get("/newsfeed/" + $scope.nameinuse + "/" + $scope.tickersymbol).then(function(newsfeed) {
                    $scope.googlenewsfeed = newsfeed.data;
                });
            }
            stockSocket.on('newTweet', function(data) {
                $rootScope.tweets = data['statuses'];
            });
            $rootScope.industryPeers = [];
            $http.get("/industry/peers/" + $rootScope.industryinuse).then(function(results1) {
                for (var number_stocks = 0; number_stocks < results1.data.length; number_stocks++) {
                    $rootScope.industryPeers.push(results1.data[number_stocks]);
                }
                sortable($scope, $rootScope.industryPeers, 25, 'updated_at');
            }).finally(function() {
                $scope.loading = false;
            });
        }).finally(function() {
            $scope.loading = false;
        });
    }
    $scope.callIndustry = function() {
        $scope.industryName = $filter('uppercase')($routeParams.industryName);
        if ($scope.industryName == 'BANK') {
            $rootScope.industryTicker = 'ICICIBANK';
        } else if ($scope.industryName == 'AUTO') {
            $rootScope.industryTicker = 'MARUTI';
        } else if ($scope.industryName == 'IT') {
            $rootScope.industryTicker = 'INFY';
        } else if ($scope.industryName == 'TELECOM') {
            $rootScope.industryTicker = 'BHARTIARTL';
        } else if ($scope.industryName == 'ENERGY') {
            $rootScope.industryTicker = 'RELIANCE';
        } else if ($scope.industryName == 'FMCG') {
            $rootScope.industryTicker = 'ITC';
        } else if ($scope.industryName == 'HEALTH') {
            $rootScope.industryTicker = 'CIPLA';
        }
        if (typeof($scope.tickersymbol) == 'undefined') {
            $scope.searchindustry($rootScope.industryTicker);
        } else {
            $scope.searchindustry($scope.tickersymbol);
        }
    }
    $scope.returnDifference = function() {
        var date1 = new Date($scope.price[$scope.price["length"] - 1][0]);
        $scope.currPrice = $scope.price[$scope.price["length"] - 1][1];
        $scope.perDiffArr = [];
        var epochDate_30 = date1.getTime() - 30 * 24 * 60 * 60 * 1000;
        var Date_30 = new Date(epochDate_30);
        var epochDate_90 = date1.getTime() - 92 * 24 * 60 * 60 * 1000;
        var Date_90 = new Date(epochDate_90);
        var epochDate_180 = date1.getTime() - 184 * 24 * 60 * 60 * 1000;
        var Date_180 = new Date(epochDate_180);
        var epochDate_365 = date1.getTime() - 365 * 24 * 60 * 60 * 1000;
        var Date_365 = new Date(epochDate_365);
        var epochDate_730 = date1.getTime() - 730 * 24 * 60 * 60 * 1000;
        var Date_730 = new Date(epochDate_730);
        if (Date_30.getDay() == 0) {
            epochDate_30 = date1.getTime() - 32 * 24 * 60 * 60 * 1000;
        } else if (Date_30.getDay() == 6) {
            epochDate_30 = date1.getTime() - 31 * 24 * 60 * 60 * 1000;
        }
        if (Date_90.getDay() == 0) {
            epochDate_90 = date1.getTime() - 94 * 24 * 60 * 60 * 1000;
        } else if (Date_90.getDay() == 6) {
            epochDate_90 = date1.getTime() - 93 * 24 * 60 * 60 * 1000;
        }
        if (Date_180.getDay() == 0) {
            epochDate_180 = date1.getTime() - 186 * 24 * 60 * 60 * 1000;
        } else if (Date_180.getDay() == 6) {
            epochDate_180 = date1.getTime() - 185 * 24 * 60 * 60 * 1000;
        }
        if (Date_365.getDay() == 0) {
            epochDate_365 = date1.getTime() - 367 * 24 * 60 * 60 * 1000;
        } else if (Date_365.getDay() == 6) {
            epochDate_365 = date1.getTime() - 366 * 24 * 60 * 60 * 1000;
        }
        if (Date_730.getDay() == 0) {
            epochDate_730 = date1.getTime() - 732 * 24 * 60 * 60 * 1000;
        } else if (Date_730.getDay() == 6) {
            epochDate_730 = date1.getTime() - 731 * 24 * 60 * 60 * 1000;
        }
        angular.forEach($scope.price, function(price, index1) {
            if (price[0] == epochDate_30) {
                $scope.priceDiff_30 = price[1];
                $scope.perDiff_30 = ((($scope.currPrice - $scope.priceDiff_30) / $scope.currPrice) * 100).toFixed(2);
                $scope.perDiffArr.push(parseFloat($scope.perDiff_30));
            }
            if (price[0] == epochDate_90) {
                $scope.priceDiff_90 = price[1];
                $scope.perDiff_90 = ((($scope.currPrice - $scope.priceDiff_90) / $scope.currPrice) * 100).toFixed(2);
                $scope.perDiffArr.push(parseFloat($scope.perDiff_90));
            }
            if (price[0] == epochDate_180) {
                $scope.priceDiff_180 = price[1];
                $scope.perDiff_180 = ((($scope.currPrice - $scope.priceDiff_180) / $scope.currPrice) * 100).toFixed(2);
                $scope.perDiffArr.push(parseFloat($scope.perDiff_180));
            }
            if (price[0] == epochDate_365) {
                $scope.priceDiff_365 = price[1];
                $scope.perDiff_365 = ((($scope.currPrice - $scope.priceDiff_365) / $scope.currPrice) * 100).toFixed(2);
                $scope.perDiffArr.push(parseFloat($scope.perDiff_365));
            }
            if (price[0] == epochDate_730) {
                $scope.priceDiff_730 = price[1];
                $scope.perDiff_730 = ((($scope.currPrice - $scope.priceDiff_730) / $scope.currPrice) * 100).toFixed(2);
                $scope.perDiffArr.push(parseFloat($scope.perDiff_730));
            }
        });
        $scope.chartItemReturn = {
            "chart": $scope.chartconfigReturn($scope.perDiffArr.reverse())
        }
    }
    $scope.chartconfigReturn = function(pricediff) {
        var categories = ['1 Month', '3 Months', '6 Months', '1 Year', '2 Years'];
        $scope.chartReturn = {
            options: {
                chart: {
                    type: 'bar',
                    height: 250,
                    width: 500
                }
            },
            title: {
                text: 'Return % in last 2 year'
            },
            xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function() {
                        return (this.value) + '%';
                    }
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            tooltip: {
                formatter: function() {
                    return 'Return is ' + Highcharts.numberFormat(this.point.y, 0);
                }
            },
            series: [{
                name: 'Return',
                data: pricediff
            }]
        }
        return $scope.chartReturn;
    }
    // ==================  Code to show ticker performance using graph  =============================
    function custom_sort(a, b) {
        return new Date(a.Date).getTime() - new Date(b.Date).getTime();
    }
    //function for graph plot
    $scope.getStockData = function(stockcode) {
        $scope.loading = true;
        $scope.price = [];
        $scope.candlePrice = [];
        $scope.Volume = [];
        // Get stock data
        $http.get("/stock/list/" + stockcode).then(function(graphdata) {
            $(".error").hide();
            $(".loading").hide();
            $scope.stockData = graphdata.data[0].values;
            $scope.stockData = $scope.stockData.sort(custom_sort);
            $scope.organizationName = graphdata.data[0].symbol;
            if ($scope.stockData != undefined && $scope.stockData != '') {
                for (var i = 0; i < $scope.stockData.length; i++) {
                    $scope.price[i] = [];
                    $scope.candlePrice[i] = [];
                    $scope.Volume[i] = [];
                    $scope.price[i].push(Date.parse($scope.stockData[i].Date));
                    $scope.price[i].push($scope.stockData[i].Close);
                    $scope.candlePrice[i].push(Date.parse($scope.stockData[i].Date));
                    $scope.candlePrice[i].push($scope.stockData[i].Open);
                    $scope.candlePrice[i].push($scope.stockData[i].High);
                    $scope.candlePrice[i].push($scope.stockData[i].Low);
                    $scope.candlePrice[i].push($scope.stockData[i].Close);
                    $scope.Volume[i].push(Date.parse($scope.stockData[i].Date));
                    $scope.Volume[i].push(parseInt($scope.stockData[i].Volume));
                }
            }
            $scope.returnDifference();
            $scope.chartItemLineGraph = {
                "chart": $scope.chartconfig($scope.price, $scope.tickersymbol)
            }
            $scope.chartItemCandlestickGraph = {
                "chart": $scope.chartconfigCandle($scope.candlePrice, $scope.tickersymbol)
            }
            $scope.chartItemMA = {
                "chart": $scope.chartconfigMA($scope.price, $scope.tickersymbol)
            }
            $scope.chartItemMACD = {
                "chart": $scope.chartconfigMACD($scope.price, $scope.tickersymbol)
            }
        }).finally(function() {
            $scope.loading = false;
        });
    };
    $scope.chartconfig = function(price, symbol) {
        $scope.chartsector = {
            options: {
                rangeSelector: {
                    selected: 1
                },
                chart: {
                    height: 350,
                },
                navigator: {
                    enabled: true
                }
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: 2000
                    }
                }
            },
            title: {
                text: symbol
            },
            xAxis: {
                type: 'datetime',
                ordinal: true
            },
            useHighStocks: true,
            series: [{
                name: symbol,
                id: 'primary',
                color: '#E77F32',
                data: price,
                tooltip: {
                    valueDecimals: 2,
                    valuePrefix: '<i class="fa fa-inr"></i>'
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: $scope.Volume,
                yAxis: 1
            }]
        }
        return $scope.chartsector;
    }
    $scope.chartconfigCandle = function(price, symbol) {
        $scope.chartsector = {
            options: {
                rangeSelector: {
                    selected: 1
                },
                chart: {
                    height: 350
                },
                navigator: {
                    enabled: true
                }
            },
            title: {
                text: symbol
            },
            plotOptions: {
                candlestick: {
                    color: '#62a551',
                    upColor: 'red'
                }
            },
            useHighStocks: true,
            series: [{
                type: 'candlestick',
                name: symbol,
                data: price,
                dataGrouping: {
                    units: [
                        ['day', // unit name
                            [1] // allowed multiples
                        ],
                        ['month', [1, 2, 3, 4, 6]]
                    ]
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: $scope.Volume,
                yAxis: 1
            }]
        }
        return $scope.chartsector;
    }
    // ============================= Graph for PE ratio ===========================
    $scope.chartPERatioconfig = function(calculatedPERatio, symbol) {
        $scope.peRatio = {
            options: {
                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 25,
                        depth: 70
                    },
                    colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                    backgroundColor: null
                }
            },
            title: {
                text: 'P/E ratio as compare to peers'
            },
            plotOptions: {
                column: {
                    depth: 25
                }
            },
            xAxis: {
                categories: symbol
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            series: [{
                name: 'PE Ratio',
                data: calculatedPERatio
            }]
        }
        return $scope.peRatio;
    }
    // ========================= Graph for SMA/EMA  ===============================================
    $scope.chartconfigMA = function(price, symbol) {
        $scope.chartMA = {
            options: {
                colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                chart: {
                    height: 300,
                    zoomType: 'x',
                    style: {
                        fontFamily: 'Dosis, sans-serif'
                    }
                },
                rangeSelector: {
                    allButtonsEnabled: true,
                    selected: 1,
                    enabled: true
                },
                navigator: {
                    enabled: true
                }
            },
            title: {
                text: "Simple moving and Exponential moving avaerage",
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineWidth: 2,
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            yAxis: {
                minorTickInterval: 'auto',
                title: {
                    style: {
                        textTransform: 'uppercase'
                    }
                },
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            useHighStocks: true,
            series: [{
                name: symbol,
                id: 'primary1',
                data: price,
                tooltip: {
                    valueDecimals: 2,
                    valuePrefix: '<i class="fa fa-inr"></i>'
                }
            }, {
                name: '50-day SMA',
                linkedTo: 'primary1',
                showInLegend: true,
                type: 'trendline',
                algorithm: 'SMA',
                periods: 50
            }, {
                name: '50-day EMA',
                linkedTo: 'primary1',
                showInLegend: true,
                type: 'trendline',
                algorithm: 'EMA',
                periods: 50
            }]
        }
        return $scope.chartMA;
    }
    //  =======================  Graph for MACD  ==================================================
    $scope.chartconfigMACD = function(price, symbol) {
        $scope.chartMACD = {
            options: {
                colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                rangeSelector: {
                    selected: 0
                },
                chart: {
                    height: 400,
                    style: {
                        fontFamily: 'Dosis, sans-serif'
                    }
                },
                navigator: {
                    enabled: true
                }
            },
            title: {
                text: "MACD",
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                type: 'datetime',
                ordinal: true,
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            yAxis: [{
                title: {
                    text: 'Price'
                },
                height: 175,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            }, {
                title: {
                    text: 'MACD'
                },
                top: 250,
                height: 150,
                offset: 0,
                lineWidth: 2
            }],
            useHighStocks: true,
            series: [{
                name: symbol,
                id: 'primary2',
                data: price,
                tooltip: {
                    valueDecimals: 2,
                    valuePrefix: '<i class="fa fa-inr"></i>'
                }
            }, {
                name: 'MACD',
                linkedTo: 'primary2',
                yAxis: 1,
                showInLegend: true,
                type: 'trendline',
                algorithm: 'MACD'
            }, {
                name: 'Signal line',
                linkedTo: 'primary2',
                yAxis: 1,
                showInLegend: true,
                type: 'trendline',
                algorithm: 'signalLine'
            }, {
                name: 'Histogram',
                linkedTo: 'primary2',
                yAxis: 1,
                showInLegend: true,
                type: 'histogram'
            }]
        }
        return $scope.chartMACD;
    }
    //     //  ==========================================================================================
    $scope.getPERatioData = function() {
        $scope.peerPERatio = [];
        $scope.PESymbol = [];
        if ($scope.peers != null || $scope.peers != '') {
            angular.forEach($scope.peers, function(peer, index1) {
                if (peer.values[12] == '') {
                    $scope.peerPERatio.push(0);
                    $scope.PESymbol.push(peer.values[3]);
                } else {
                    $scope.peerPERatio.push(parseFloat(peer.values[12]));
                    $scope.PESymbol.push(peer.values[3]);
                }
            });
            $scope.PESymbol.push('INDUSTRY AVERAGE');
            var sum = 0;
            for (var i = $scope.peerPERatio.length - 1; i >= 0; i--) {
                sum += parseInt($scope.peerPERatio[i]);
            }
            $scope.peerPERatio.push(parseFloat((sum / $scope.peerPERatio.length).toFixed(2)));
            $scope.chartPERatioItem = {
                "chart": $scope.chartPERatioconfig($scope.peerPERatio, $scope.PESymbol)
            }
        }
    };
    $scope.instantSearch = instantSearch;
    $scope.stockPage = function(code) {
        $location.path('/stock/' + code);
    }
    $scope.buyStock = function(name, price) {
        $scope.stockName = name;
        $scope.stockPrice = price;
        $scope.curPrice = 'Yes';
        var modal = $uibModal.open({
            templateUrl: "buyStockConsole.html",
            windowClass: 'consoleModal',
            closeByDocument: true,
            controller: function($scope, $uibModalInstance, stockName, stockPrice, curPrice) {
                $scope.stockName = name;
                $scope.stockPrice = price;
                $scope.curPrice = curPrice;
                $scope.parseFloat = parseFloat;
                $scope.exit = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                stockName: function() {
                    return $scope.stockName;
                },
                stockPrice: function() {
                    return $scope.stockPrice;
                },
                curPrice: function() {
                    return $scope.curPrice;
                },
                parseFloat: function() {
                    return $scope.parseFloat;
                }
            }
        });
    }



 $scope.cards = [
    {
    title: 'title',
        sub: 'sub title',
        date: '09/10/16',
        id: 1231234123
  }, 
    {
    title: 'title goes here',
        sub: 'sub title',
        date: '09/10/16',
        id: 1231234123
  }, 
    {
    title: 'title goes here',
        sub: 'sub title',
        date: '09/10/16',
        id: 1231234123
     
  }, 
    {
    title: 'title goes here',
        sub: 'sub title',
        date: '09/10/16',
        id: 1231234123
  }
    ];
    
    $scope.cardView = true;
    $scope.listView = false;
    
    
    
    
    // $scope.cardViewClick =  function() {
    //     $timeout(function() {
    //         $scope.cardView = true;
    //     }, 500);
    //         $scope.listView = false;
    // }
    // $scope.listViewClick =  function() {
    //         $scope.cardView = false;
    // $timeout(function() {
    //         $scope.listView = true;     
    //     }, 500);
    // }
    
    $scope.viewMore = function() {
        $('.card-view-info').addClass('active');
    }
    
    $scope.close = function() {
        $('.card-view-info').removeClass('active');
    }
    
}]);
lifeController.controller('govtctrl', ['$scope', '$http', '$route', '$rootScope', 'sortable', '$location', function($scope, $http, $route, $rootScope, sortable, $location) {
    $scope.loading = true;
    // console.log($scope.loading);
    // console.log(new Date());
    // ===============================================================================================
    $http.get('/govt/listSaving').success(function(data) {
        $scope.saving = data;
    }).finally(function() {
        $scope.loading = false;
        // console.log($scope.loading);
    });
    $http.get('/govt/listInsurance').success(function(data) {
        $scope.insurance = data;
    }).finally(function() {
        $scope.loading = false;
        // console.log($scope.loading);
    });
    // $scope.loading = false;
    // console.log($scope.loading);
    // $http.post('/govt').success(function(data) {
    //     $scope.sav = data;
    //     console.log("123");
    // });
}]);
//Code for filters used in the application
lifeController.filter('exp_Range', function() {
    return function(items, lessthan, greaterthan) {
        var filteredAmount = [];
        angular.forEach(items, function(item) {
            // console.log(lessthan);
            if (item.experience >= lessthan && item.experience <= greaterthan) {
                //console.log("here for :"+item.name+"and "+item.experience);
                filteredAmount.push(item);
            }
        });
        return filteredAmount.length > 0 ? filteredAmount : items
    };
});
lifeController.filter('risk_Range', function() {
    return function(items, lessthan, greaterthan) {
        var filteredAmount = [];
        angular.forEach(items, function(item) {
            // console.log(lessthan);
            if (item.riskindex >= lessthan && item.riskindex <= greaterthan) {
                //console.log("here for :"+item.name+"and "+item.experience);
                filteredAmount.push(item);
            }
        });
        return filteredAmount.length > 0 ? filteredAmount : items
    };
});
// lifeController.filter('exp_Range', function() {
//     return function(items, lessthan,greaterthan) {
//        items = items.filter(function(item){
//          return item.experience >= lessthan && item.experience <=  greaterthan;
//         //console.log("here for :"+item.name+"and "+item.experience);
//       });
//       return items;
//     };
//   });
lifeController.filter('inception_Range', function() {
    return function(items, lessthan, greaterthan) {
        var filteredAmount = [];
        angular.forEach(items, function(item) {
            if (item.inception >= lessthan && item.inception <= greaterthan) {
                //console.log("here for :"+item.name+"and "+item.experience);
                filteredAmount.push(item);
            }
        });
        return filteredAmount.length > 0 ? filteredAmount : items
    };
});
lifeController.filter('tonumber', function() {
    return function(input) {
        var a = input.replace(/\,/g, '');
        return parseInt(a, 10);
    };
});
lifeController.controller('bankctrl', ['$scope', '$filter', '$http', '$location', '$route', '$rootScope', '$routeParams', 'sortable', '$uibModal','$window','$interval','$timeout', function($scope, $filter, $http, $location, $route, $rootScope, $routeParams, sortable, $uibModal,$window,$interval,$timeout) {
    $scope.isNaN = isNaN;
    $scope.rating = 4;
    $scope.limitRecords = 2;
    $scope.$timeout = $timeout;
    var oldLimit=0;
    var isOpen = false;

    $scope.getSelectedRating = function(rating) {
        console.log(rating);
    }

    $scope.toggleRec = function(item) {
        if (item.limitRecords === $scope.limitRecords) 
            item.limitRecords = item.type.length;
        else {
            // oldLimit = item.limitRecords;
            item.limitRecords = $scope.limitRecords;
        }
        isOpen = !isOpen;
    }

    $scope.visitbankaccount = function(bankName,accntType,accntURL) {
        $scope.bkName = bankName;
        $scope.acName = accntType;
        $scope.acURL = accntURL;
        $scope.redirecttopage(accntURL);
        var modal = $uibModal.open({
            templateUrl: "bankaccounttype.html",
            controller: function($scope, $uibModalInstance,$timeout,bkName, acName, acURL) {
                $scope.$timeout = $timeout;
                $scope.bkName = bkName;
                $scope.acName = acName;
                $scope.acURL = acURL;
               
                $timeout(function() {
                    $uibModalInstance.close();
                }, 5000)
            },
            resolve: {
                acURL: function() {
                    return $scope.acURL;
                },
                acName: function() {
                    return $scope.acName;
                },
                bkName: function() {
                    return $scope.bkName;
                }
            }
        });
        
    }

    $scope.redirecttopage = function(pageurl){
        setTimeout(function() {
                $window.open(pageurl,"_blank");
        },5000);
    }
    //$scope.payoutPeriod = ['Monthly','Quarterly','Half Yearly','Annually'];
    $scope.bankingServices = [{
        "name": "Fixed Deposit",
        "icon": "FD",
        "url": "fd"
    }, {
        "name": "Saving Account",
        "icon": "bank-icon",
        "url": "saving"
    }, {
        "name": "Other Services",
        "icon": "other-services",
        "url": ""
    }]

    
    $scope.bankNames = [{
        "Id": "1",
        "Name": "Allahabad Bank",
        "icon": "Allahabad-BANK",
        "InterestRate": "upto 4.0%",
        "website": "www.allahabadbank.in",
        "twitter": "",
        "facebook": "",
        "type":[
            {"Name":"AllBank Shakti Saving Bank Account","link":"https://www.allahabadbank.in/pdf/allbank-shakti-16.9.17.pdf"},
            {"Name":"Normal Savings Bank","link":"https://www.allahabadbank.in/english/Normal_Savings_Bank.aspx"},
            {"Name":"All Bank Premium SB","link":"https://www.allahabadbank.in/english/Bank_Premium_SB.aspx"},
            {"Name":"All Bank Advantage Salary Premium Account","link":"https://www.allahabadbank.in/english/Advantage_Salary_Premium_Account.aspx"},
            {"Name":"All Bank Mahila Sanchay Account","link":"https://www.allahabadbank.in/english/Mahila_Sanchay_Account.aspx"},
            {"Name":"All Bank 3-in-1 Account","link":"https://www.allahabadbank.in/english/Bank_3_1_Account.aspx"},
            {"Name":"All Bank Vikash SB Account","link":"https://www.allahabadbank.in/english/Vikash_SB_Account.aspx"},
            {"Name":"All Bank Saral Savings Account (Basic Savings Bank Account).","link":"https://www.allahabadbank.in/english/Saral_Savings_Bank_Account.aspx"},
            {"Name":"All Bank Saral Savings Bank Account – Small Account","link":"https://www.allahabadbank.in/english/Saral_Savings_Bank_Small_Account.aspx"},
            {"Name":"All Bank Savi Fix Account","link":"https://www.allahabadbank.in/english/Savi_Fix_Account.aspx"}
        ],
        limitRecords: 2
    }, {
        "Id": "2",
        "Name": "Andhra Bank",
        "icon": "andhra-BANK",
        "InterestRate": "3.5% - 4.0%",
        "website": "www.andhrabank.in",
        "twitter": "",
        "facebook": "",
        "type":[
            {"Name":"AB Kiddy Bank","link":"https://www.andhrabank.in/English/ABKiddyBank.aspx"},
            {"Name":"AB Abhaya Plus","link":"https://www.andhrabank.in/English/ABAbhayaPlus.aspx"},
            {"Name":"AB Easy Savings","link":"https://www.andhrabank.in/English/ABEasySavings.aspx"},
            {"Name":"AB Abhaya SB A/c","link":"https://www.andhrabank.in/English/AbhayaSBAccount.aspx"},
            {"Name":"AB Abhaya Gold SB A/c","link":"https://www.andhrabank.in/English/AbGoldAccount.aspx"},
            {"Name":"AB Jeevan Abhaya Scheme","link":"https://www.andhrabank.in/English/ABJeevanAbhaya.aspx"},
            {"Name":"AB Super Salary SB Account","link":"https://www.andhrabank.in/English/PrivilegeSBDeposit.aspx"},
            {"Name":"AB Platinum SB AC","link":"https://www.andhrabank.in/English/ab_platinum_sb.aspx"},
            {"Name":"AB Diamond SB AC","link":"https://www.andhrabank.in/English/ab_diamond_sb.aspx"},
            {"Name":"AB Jeevan Abhaya Double Plus","link":"https://www.andhrabank.in/English/ABJEEVANABHAYADOUBLEPLUS.aspx"},
            {"Name":"AB Jeevan Abhaya Triple Plus","link":"https://www.andhrabank.in/English/ABJEEVANABHAYATRIPLEPLUS.aspx"},
            {"Name":"AB Little Stars And AB Teens","link":"https://www.andhrabank.in/English/ABLITTLESTARSANDABTEENS.aspx"}
        ],
        limitRecords: 2   
    }, {
        "Id": "3",
        "Name": "Axis Bank",
        "icon": "Axis-BANK",
        "InterestRate": "3.5% - 4.0%",
        "website": "www.axisbank.com",
        "twitter": "",
        "facebook": "",
        "type": [{
            "Name": "Easy Access Savings Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/easyaccess-savings-account"
        }, {
            "Name": "Prime Savings Account",
            "link" : "https://www.axisbank.com/retail/accounts/savings-account/prime-savings-account"
        }, {
            "Name": "Prime Plus Savings Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/prime-plus-savings-account"
        }, {
            "Name": "Future Stars Savings Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/future-stars-savings-account"
        }, {
            "Name": "Senior Privilege Savings Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/senior-privilege-savings-account"
        }, {
            "Name": "Women’s Savings Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/womens-savings-account"
        }, {
            "Name": "Basic Savings Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/basic-savings-account"
        }, {
            "Name": "Small Basic Savings Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/small-basic-savings-account"
        }, {
            "Name": "Pension Savings Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/pension-savings-account"
        }, {
            "Name": "YOUth Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/youth-account"
        }, {
            "Name": "Trust/NGO Saving Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/trust-ngo-savings-account"
        },{
            "Name": "Insurance Agent Account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/insurance-agent-account"
        },{
            "Name": "Inaam Personal account",
            "link": "https://www.axisbank.com/retail/accounts/savings-account/inaam-personal-account"
        }

        ],
        limitRecords: 2
    }, {
        "Id": "4",
        "Name": "Bandhan Bank",
        "icon": "Bandhan-BANK",
        "InterestRate": "3.5% - 4.0%",
        "website": "www.bandhanbank.com",
        "twitter": "",
        "facebook": "",
        "type":[
            {"Name":"Premium Savings Account","link":"https://www.bandhanbank.com/savings-accounts.aspx"},
            {"Name":"Advantage Savings Account","link":"https://www.bandhanbank.com/advantage-savings-accounts.aspx"},
            {"Name":"Standard Savings Account","link":"https://www.bandhanbank.com/standard-savings-accounts.aspx"},
            {"Name":"Sanchay Savings Account","link":"https://www.bandhanbank.com/sanchay-savings-accounts.aspx"},
            {"Name":"Special Savings Account","link":"https://www.bandhanbank.com/special-savings-accounts.aspx"},
            {"Name":"Others (GOS,TASC,BSBDA)","link":"https://www.bandhanbank.com/other-savings-bank-accounts.aspx"}
        ],
        limitRecords: 2
    }, {
        "Id": "5",
        "Name": "Bank of Baroda",
        "icon": "bank-of-baroda"
    }, {
        "Id": "6",
        "Name": "Bank of India",
        "icon": "bank-of-India"
    }, {
        "Id": "7",
        "Name": "Bank of Maharashtra",
        "icon": "bank-of-maharashtra"
    }, {
        "Id": "8",
        "Name": "Canara Bank",
        "icon": "Canara-bank"
    }, {
        "Id": "9",
        "Name": "Corporation Bank",
        "icon": "Corporation-bank"
    }, {
        "Id": "10",
        "Name": "Central Bank of India",
        "icon": "Central-Bank-of-india"
    }, {
        "Id": "11",
        "Name": "DCB Bank",
        "icon": "DCB-bank"
    }, {
        "Id": "12",
        "Name": "Dena Bank",
        "icon": "Dena-bank"
    }, {
        "Id": "13",
        "Name": "Federal Bank",
        "icon": "Federal-bank"
    }, {
        "Id": "14",
        "Name": "HDFC Bank",
        "icon": "HDFC-bank"
    }, {
        "Id": "15",
        "Name": "ICICI Bank",
        "icon": "ICICI-BANK"
    }, {
        "Id": "16",
        "Name": "IDBI Bank",
        "icon": "IDBI-BANK"
    }, {
        "Id": "17",
        "Name": "IDFC Bank",
        "icon": "IDFC-bank"
    }, {
        "Id": "18",
        "Name": "Indian Bank",
        "icon": "Indian-Bank"
    }, {
        "Id": "19",
        "Name": "Indian Overseas Bank",
        "icon": "Indian-overseas-bank"
    }, {
        "Id": "20",
        "Name": "IndusInd Bank",
        "icon": "IndusInd-bank"
    }, {
        "Id": "21",
        "Name": "J&K Bank",
        "icon": "JK-bank"
    }, {
        "Id": "22",
        "Name": "Karnataka Bank",
        "icon": "Karnataka-bank"
    }, {
        "Id": "23",
        "Name": "Kotak Bank",
        "icon": "Kotak-bank"
    }, {
        "Id": "24",
        "Name": "Oriental Bank of Commerce",
        "icon": "oriental-bank-commerce"
    }, {
        "Id": "25",
        "Name": "Punjab National Bank",
        "icon": "punjab-national-bank"
    }, {
        "Id": "26",
        "Name": "State Bank of India",
        "icon": "SBI-bank"
    }, {
        "Id": "27",
        "Name": "Syndicate Bank",
        "icon": "Syndicate-bank"
    }, {
        "Id": "28",
        "Name": "RBL Bank",
        "icon": "RBL-bank"
    }, {
        "Id": "29",
        "Name": "UCO Bank",
        "icon": "UCO-bank"
    }, {
        "Id": "30",
        "Name": "Union Bank of India",
        "icon": "union-bank-india"
    }, {
        "Id": "31",
        "Name": "Yes Bank",
        "icon": "Yes-bank"
    }, {
        "Id": "32",
        "Name": "Vijaya Bank",
        "icon": "Vijaya-bank"
    }, {
        "Id": "33",
        "Name": "South Indian Bank",
        "icon": "South-Indian-bank"
    }]
    $scope.fdDetail_General = [{
        "bankId": "1",
        "value": [{
            "duration": "7 - 14 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 - 29 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 - 45 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 - 60 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 - 90 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 - 179 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 - 269 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 days to less than 1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year to less than 2 years",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.07",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years to less than 3 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0675",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to less than 5 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years to 10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "2",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 45 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.0475",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 179 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "6 months to < 9 months",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "8",
            "days": "29"
        }, {
            "duration": "9 months to < 1 year",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year to 2 years",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0575",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Above 2 years to 3 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0575",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": " Above 3 years to 5 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0575",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Above 5 years to 10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0575",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "3",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.035",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 29 days",
            "interestRate_0_1": "0.035",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 days to 45 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 60 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 days < 3 months",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "2",
            "days": "29"
        }, {
            "duration": "3 months < 4 months",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "3",
            "days": "29"
        }, {
            "duration": "4 months < 5 months",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "4",
            "days": "29"
        }, {
            "duration": "5 months < 6 months",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "5",
            "days": "29"
        }, {
            "duration": "6 months < 7 months",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "6",
            "days": "29"
        }, {
            "duration": "7 months < 8 months",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "7",
            "days": "29"
        }, {
            "duration": "8 months < 9 months",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "8",
            "days": "29"
        }, {
            "duration": "9 months < 10 months",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "9",
            "days": "29"
        }, {
            "duration": "10 months < 11 months",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "10",
            "days": "29"
        }, {
            "duration": "11 months < 1 year",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "11",
            "days": "29"
        }, {
            "duration": "1 year < 13 months",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "0",
            "days": "29"
        }, {
            "duration": "13 months < 14 months",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "1",
            "days": "29"
        }, {
            "duration": "14 months < 15 months",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "2",
            "days": "29"
        }, {
            "duration": "15 months < 16 months",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "3",
            "days": "29"
        }, {
            "duration": "16 months < 17 months",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "4",
            "days": "29"
        }, {
            "duration": "17 months < 18 months",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "5",
            "days": "29"
        }, {
            "duration": "18 Months < 2 years",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years < 30 months",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0625",
            "year": "2",
            "month": "5",
            "days": "29"
        }, {
            "duration": "30 months < 3 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0625",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years < 5 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0625",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years to 10 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0625",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "4",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.035",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 30 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 days to Less than 2 months",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "1",
            "days": "29"
        }, {
            "duration": "2 months to less than 3 months",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "2",
            "days": "29"
        }, {
            "duration": "3 months to less than 6 months",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "5",
            "days": "29"
        }, {
            "duration": "6 months to less than 1 Year",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.075",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 Year",
            "interestRate_0_1": "0.075",
            "interestRate_0_1_snr": "0.08",
            "year": "1",
            "month": "0",
            "days": "365"
        }, {
            "duration": "Above 1Year to less than 3 years",
            "interestRate_0_1": "0.0725",
            "interestRate_0_1_snr": "0.0775",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to less than 5 years",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.074",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years to less than 7 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "6",
            "month": "0",
            "days": "364"
        }, {
            "duration": "7 years to up to 10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "5",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 45 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 180 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 days to 270 days",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 days & above and less than 1 year",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "365"
        }, {
            "duration": "Above 1 year and upto 2 Years",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.45",
            "year": "2",
            "month": "0",
            "days": "0"
        }, {
            "duration": "Above 2 Years and upto 3 Years",
            "interestRate_0_1": "0.0685",
            "interestRate_0_1_snr": "0.45",
            "year": "3",
            "month": "0",
            "days": "0"
        }, {
            "duration": "Above 3 Years and upto 5 Years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.45",
            "year": "5",
            "month": "0",
            "days": "0"
        }, {
            "duration": "Above 5 Years and upto 10 Years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.45",
            "year": "10",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "6",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 30 days",
            "interestRate_0_1": "0.0425",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 days to 45 days",
            "interestRate_0_1": "0.0425",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "3",
            "days": "0"
        }, {
            "duration": "91 days to 120 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "4",
            "days": "0"
        }, {
            "duration": "121 days to 179 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days to 269 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 days to less than 1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 Year & above to less than 2 Yrs",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.045",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years & above to less than 3 years",
            "interestRate_0_1": "0.068",
            "interestRate_0_1_snr": "0.045",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years & above to less than 5 years",
            "interestRate_0_1": "0.067",
            "interestRate_0_1_snr": "0.045",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years & above to less than 8 years",
            "interestRate_0_1": "0.067",
            "interestRate_0_1_snr": "0.045",
            "year": "7",
            "month": "0",
            "days": "364"
        }, {
            "duration": "8 years & above to 10 years",
            "interestRate_0_1": "0.067",
            "interestRate_0_1_snr": "0.045",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "7",
        "value": [{
            "duration": "7-45 days",
            "interestRate_0_1": "0.0425",
            "interestRate_0_1_snr": "0.035",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46-90 days",
            "interestRate_0_1": "0.0525",
            "interestRate_0_1_snr": "0.0375",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91-364 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "365 Days/one year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0425",
            "year": "1",
            "month": "0",
            "days": ""
        }, {
            "duration": "Over 1 year to 3 years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0425",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years /Mahalaxmi Term Deposit",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0425",
            "year": "3",
            "month": "0",
            "days": ""
        }, {
            "duration": "Above3 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.0425",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "8",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.042",
            "interestRate_0_1_snr": "0.047",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 30 days",
            "interestRate_0_1": "0.042",
            "interestRate_0_1_snr": "0.047",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 days to 45 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 60 days",
            "interestRate_0_1": "0.0475",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 days to 90 days",
            "interestRate_0_1": "0.0475",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 120 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 days to 179 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days to 269 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 days to less than 1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year only",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.074",
            "year": "1",
            "month": "0",
            "days": "0"
        }, {
            "duration": "Above 1 year to less than 2 years",
            "interestRate_0_1": "0.068",
            "interestRate_0_1_snr": "0.073",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years & above to less than 3 years",
            "interestRate_0_1": "0.068",
            "interestRate_0_1_snr": "0.073",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years & above to less than 5 years",
            "interestRate_0_1": "0.067",
            "interestRate_0_1_snr": "0.072",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years & above to less than 8 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "7",
            "month": "0",
            "days": "364"
        }, {
            "duration": "8 years & above to 10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "10",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "9",
        "value": [{
            "duration": "7 to 14 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 to 45 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 to 60 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 to 90 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 to 120 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 to 180 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 to 270 days",
            "interestRate_0_1": "0.0635",
            "interestRate_0_1_snr": "0.0685",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 days to less than 1 year",
            "interestRate_0_1": "0.0635",
            "interestRate_0_1_snr": "0.0685",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year to less than 3 years",
            "interestRate_0_1": "0.066",
            "interestRate_0_1_snr": "0.071",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years & Above",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "3",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "10",
        "value": [{
            "duration": "7 -14 days",
            "interestRate_0_1": "0.0475",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 - 30 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 - 45 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 - 59 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "59"
        }, {
            "duration": "60 - 90 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 - 179 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 - 270 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 - 364 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 yr to less than 2 yrs",
            "interestRate_0_1": "0.066",
            "interestRate_0_1_snr": "0.071",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 yr to less than 3 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 yr to less than 5 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years & above upto 10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "9",
            "month": "0",
            "days": "364"
        }, {
            "duration": "555 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "555"
        }, {
            "duration": "777 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "777"
        }, {
            "duration": "Cent Double",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "1000"
        }]
    }, {
        "bankId": "11",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 45 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to less than 6 months",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "6 months to less than 12 months",
            "interestRate_0_1": "0.068",
            "interestRate_0_1_snr": "0.063",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "12 months to less than 18 months",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.064",
            "year": "1",
            "month": "0",
            "days": "180"
        }, {
            "duration": "18 months to less than 24 months",
            "interestRate_0_1": "0.071",
            "interestRate_0_1_snr": "0.066",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "24 months to less than 36 months",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.068",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "36 months to 60 months",
            "interestRate_0_1": "0.0725",
            "interestRate_0_1_snr": "0.068",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "More than 60 months to 120 months",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.068",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "12",
        "value": [{
            "duration": "07 days to 14 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 29 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 days to 45 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 60 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 days to 90 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 120 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 days to 179 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days to 270 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 days to 364 days",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.074",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "365 days / 1 year",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.074",
            "year": "1",
            "month": "0",
            "days": "0"
        }, {
            "duration": "More than 1 yr to less than 2 years",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.074",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years to less than 3 years",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.074",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to less than 5 years",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.074",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years to less than 8 years",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.075",
            "year": "7",
            "month": "0",
            "days": "364"
        }, {
            "duration": "8 years to 10 years",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.075",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "13",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.035",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 29 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 days to 60 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 days to 90 days",
            "interestRate_0_1": "0.057",
            "interestRate_0_1_snr": "0.062",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 119 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "119"
        }, {
            "duration": "120 days to 270 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 days to less than 1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year",
            "interestRate_0_1": "0.067",
            "interestRate_0_1_snr": "0.072",
            "year": "1",
            "month": "0",
            "days": "0"
        }, {
            "duration": "Above 1 year to 2 years",
            "interestRate_0_1": "0.068",
            "interestRate_0_1_snr": "0.073",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Above 2 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "2",
            "month": "0",
            "days": "1"
        }]
    }, {
        "bankId": "14",
        "value": [{
            "duration": "7 - 14 days",
            "interestRate_0_1": "0.035",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 - 29 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 - 45 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 - 60 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 - 90 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days - 6 months",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "6 months 1 day - 6 months 15 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "6",
            "days": "15"
        }, {
            "duration": "6 months 16 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "6",
            "days": "16"
        }, {
            "duration": "6 months 17 days - 9 months 15 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "9",
            "days": "15"
        }, {
            "duration": "9 months 16 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "9",
            "days": "16"
        }, {
            "duration": "9 months 17 days < 1 Year",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "11",
            "days": "29"
        }, {
            "duration": "1 Year",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "0",
            "days": "0"
        }, {
            "duration": "1 year 1 day - 1 year 3 days",
            "interestRate_0_1": "0.0695",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "0",
            "days": "3"
        }, {
            "duration": "1 year 4 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "0",
            "days": "4"
        }, {
            "duration": "1 year 5 days - 1 Year 15 Days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "0",
            "days": "15"
        }, {
            "duration": "1 Year 16 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "0",
            "days": "16"
        }, {
            "duration": "1 year 17 days - 2 Years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years 1day - 2 Years 15 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "2",
            "month": "0",
            "days": "15"
        }, {
            "duration": "2 Years 16 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "2",
            "month": "0",
            "days": "16"
        }, {
            "duration": "2 years 17 days - 3 Years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years 1day - 5 years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 Years 1 Day - 8 Years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "7",
            "month": "0",
            "days": "364"
        }, {
            "duration": "8 Years 1 Day - 10 Years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "15",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.0525",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 29 days",
            "interestRate_0_1": "0.0525",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 days to 45 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 60 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 days to 90 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 120 days",
            "interestRate_0_1": "0.0605",
            "interestRate_0_1_snr": "0.0605",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 days to 150 days",
            "interestRate_0_1": "0.0605",
            "interestRate_0_1_snr": "0.0605",
            "year": "0",
            "month": "0",
            "days": "150"
        }, {
            "duration": "151 days to 184 days",
            "interestRate_0_1": "0.0605",
            "interestRate_0_1_snr": "0.0605",
            "year": "0",
            "month": "0",
            "days": "184"
        }, {
            "duration": "185 days to 210 days",
            "interestRate_0_1": "0.063",
            "interestRate_0_1_snr": "0.063",
            "year": "0",
            "month": "0",
            "days": "210"
        }, {
            "duration": "211 days to 240 days",
            "interestRate_0_1": "0.063",
            "interestRate_0_1_snr": "0.063",
            "year": "0",
            "month": "0",
            "days": "240"
        }, {
            "duration": "241 days to 270 days",
            "interestRate_0_1": "0.063",
            "interestRate_0_1_snr": "0.063",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 days to 300 days",
            "interestRate_0_1": "0.063",
            "interestRate_0_1_snr": "0.063",
            "year": "0",
            "month": "0",
            "days": "300"
        }, {
            "duration": "301 days to 330 days",
            "interestRate_0_1": "0.063",
            "interestRate_0_1_snr": "0.063",
            "year": "0",
            "month": "0",
            "days": "330"
        }, {
            "duration": "331 days to 364 days",
            "interestRate_0_1": "0.063",
            "interestRate_0_1_snr": "0.063",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year to 389 days",
            "interestRate_0_1": "0.0655",
            "interestRate_0_1_snr": "0.0655",
            "year": "0",
            "month": "0",
            "days": "389"
        }, {
            "duration": "390 days to less than 15 months",
            "interestRate_0_1": "0.0655",
            "interestRate_0_1_snr": "0.0655",
            "year": "1",
            "month": "0",
            "days": "90"
        }, {
            "duration": "15 months to less than 18 months",
            "interestRate_0_1": "0.0655",
            "interestRate_0_1_snr": "0.0655",
            "year": "1",
            "month": "0",
            "days": "180"
        }, {
            "duration": "18 months to 2 years",
            "interestRate_0_1": "0.0655",
            "interestRate_0_1_snr": "0.0655",
            "year": "2",
            "month": "0",
            "days": "0"
        }, {
            "duration": "2 years 1 day to 3 years",
            "interestRate_0_1": "0.0655",
            "interestRate_0_1_snr": "0.0655",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years 1 day to 5 years",
            "interestRate_0_1": "0.0655",
            "interestRate_0_1_snr": "0.0655",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years 1 day to 7 years",
            "interestRate_0_1": "0.0655",
            "interestRate_0_1_snr": "0.0655",
            "year": "6",
            "month": "0",
            "days": "364"
        }, {
            "duration": "7 years 1 day to 10 years",
            "interestRate_0_1": "0.0655",
            "interestRate_0_1_snr": "0.0655",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "16",
        "value": [{
            "duration": "07 – 14 days",
            "interestRate_0_1": "0.0425",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 – 30 days",
            "interestRate_0_1": "0.0425",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31– 45 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 –60 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.0475",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61-90 days",
            "interestRate_0_1": "0.0525",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91-6 months",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "6 months 1 day to 270 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 days to < 1 year",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year",
            "interestRate_0_1": "0.064",
            "interestRate_0_1_snr": "0.061",
            "year": "1",
            "month": "0",
            "days": "0"
        }, {
            "duration": ">1 year - 2 years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0595",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": ">2 years to < 3 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.055",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to < 5 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.055",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.055",
            "year": "5",
            "month": "0",
            "days": "0"
        }, {
            "duration": ">5 years - 7 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.055",
            "year": "6",
            "month": "0",
            "days": "364"
        }, {
            "duration": ">7 years - 10 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.055",
            "year": "9",
            "month": "0",
            "days": "364"
        }, {
            "duration": ">10 years - 20 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.055",
            "year": "19",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "17",
        "value": [{
            "duration": "7 - 14 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 - 29 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 - 45 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 - 60 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 - 90 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 - 180 days",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 - 270 days",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.075",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 - 365 days",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.075",
            "year": "0",
            "month": "0",
            "days": "365"
        }, {
            "duration": "366 days",
            "interestRate_0_1": "0.075",
            "interestRate_0_1_snr": "0.08",
            "year": "0",
            "month": "0",
            "days": "366"
        }, {
            "duration": "367 - 400 days",
            "interestRate_0_1": "0.0725",
            "interestRate_0_1_snr": "0.0775",
            "year": "0",
            "month": "0",
            "days": "400"
        }, {
            "duration": "401 - 540 days",
            "interestRate_0_1": "0.0725",
            "interestRate_0_1_snr": "0.0775",
            "year": "0",
            "month": "0",
            "days": "540"
        }, {
            "duration": "541 - 731 days",
            "interestRate_0_1": "0.0725",
            "interestRate_0_1_snr": "0.0775",
            "year": "0",
            "month": "0",
            "days": "731"
        }, {
            "duration": "732 - 1095 days",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.077",
            "year": "0",
            "month": "0",
            "days": "1095"
        }, {
            "duration": "3 years 1days - 5 years",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.077",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 Year 1 Day - 8 Years",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.077",
            "year": "7",
            "month": "0",
            "days": "364"
        }, {
            "duration": "8 Year 1 Day - 10 Years",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.077",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "18",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 29 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 days to 45 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 120 days",
            "interestRate_0_1": "0.0525",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 days to 180 days",
            "interestRate_0_1": "0.0525",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 days to 269 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "9 months to 364 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0475",
            "year": "1",
            "month": "0",
            "days": "0"
        }, {
            "duration": "1 year 1 day to 1 year 364 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.045",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years to 2 years 364 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.045",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to 10 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.045",
            "year": "3",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "19",
        "value": [{
            "duration": "7 days - 14 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days - 29 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 days - 45 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days - 60 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 days - 90 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days - 120 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 days - 179 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days - 269 days",
            "interestRate_0_1": "0.0575",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 days -< 1 year",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 yr only",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "1",
            "month": "0",
            "days": "0"
        }, {
            "duration": ">1 yr - < 2 yrs   ",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 yrs to 3 yrs",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "> 3 Yrs - < 5 Yrs",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.065",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 Yrs & above",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.065",
            "year": "5",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "20",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.035",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 30 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 days to 45 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 60 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 days to 90 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 120 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 days to 180 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 days to 210 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "210"
        }, {
            "duration": "211 days to 269 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 days or below 1 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 Years to below 1 Years 2 Months",
            "interestRate_0_1": "0.0715",
            "interestRate_0_1_snr": "0.065",
            "year": "1",
            "month": "0",
            "days": "29"
        }, {
            "duration": "1 Years 2 Months to below 2 Years",
            "interestRate_0_1": "0.0705",
            "interestRate_0_1_snr": "0.0635",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years to below 2 years 6 Months",
            "interestRate_0_1": "0.0715",
            "interestRate_0_1_snr": "0.0635",
            "year": "2",
            "month": "0",
            "days": "180"
        }, {
            "duration": "2 years 6 Months to below 2 years 9 Months",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0635",
            "year": "2",
            "month": "0",
            "days": "270"
        }, {
            "duration": "2 years 9 Months to below 3 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0635",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to below 61 month",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0635",
            "year": "5",
            "month": "0",
            "days": "29"
        }, {
            "duration": "61 month and above",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0635",
            "year": "9",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Indus Tax Saver Scheme (5 years)",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "N.A.",
            "year": "5",
            "month": "0",
            "days": ""
        }]
    }, {
        "bankId": "21",
        "value": [{
            "duration": "7 days to 30 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 days to 45 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 180 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0475",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 days to 270 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0475",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 days to less than 1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year to less than 3 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0525",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to less than 5 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0525",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years to 10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.05",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "22",
        "value": [{
            "duration": "7 days to 45 days",
            "interestRate_0_1": "0.035",
            "interestRate_0_1_snr": "0.035",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 179 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days",
            "interestRate_0_1": "0.071",
            "interestRate_0_1_snr": "0.071",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 days to 364 days",
            "interestRate_0_1": "0.067",
            "interestRate_0_1_snr": "0.067",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year to 2 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0675",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Above 2 Years to 10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "2",
            "month": "1",
            "days": "0"
        }]
    }, {
        "bankId": "23",
        "value": [{
            "duration": "7 - 14 Days",
            "interestRate_0_1": "0.035",
            "interestRate_0_1_snr": "0.035",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 - 30 Days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 - 45 Days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 - 90 Days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 - 120 Days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 - 179 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 Days",
            "interestRate_0_1": "0.066",
            "interestRate_0_1_snr": "0.066",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 Days to 269 Days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 Days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 Days to 363 Days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "363"
        }, {
            "duration": "364 Days",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "365 Days to 389 Days",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "389"
        }, {
            "duration": "390 Days (12 months 25 days)",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "390"
        }, {
            "duration": "391 Days - Less than 23 Months",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "22",
            "days": "29"
        }, {
            "duration": "23 Months",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "23",
            "days": "0"
        }, {
            "duration": "23 months 1 Day- less than 2 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years- less than 3 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years and above but less than 4 years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "3",
            "month": "0",
            "days": "364"
        }, {
            "duration": "4 years and above but less than 5 years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years and above upto and inclusive of 10 years",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "10",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "24",
        "value": [{
            "duration": "7 days to 14 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 30 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 days to 45 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 179 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.0531",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days to 269 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0531",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 days to 364 days",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0531",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year to 1 year 364 days",
            "interestRate_0_1": "0.0685",
            "interestRate_0_1_snr": "0.0531",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years to 2 years 364 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0531",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to 4 years 364 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0531",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years to 10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0531",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "25",
        "value": [{
            "duration": "7 to 14 days",
            "interestRate_0_1": "0.0425",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 to 29days",
            "interestRate_0_1": "0.0425",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 to 45 days",
            "interestRate_0_1": "0.0475",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 to 90 days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 to 179 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.04",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days to 270 Days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "270"
        }, {
            "duration": "271 days to less than 1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.0425",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year",
            "interestRate_0_1": "0.069",
            "interestRate_0_1_snr": "0.045",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "above 1 year & upto 2 years",
            "interestRate_0_1": "0.068",
            "interestRate_0_1_snr": "0.045",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "above 2 year & upto 5 years",
            "interestRate_0_1": "0.068",
            "interestRate_0_1_snr": "0.045",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "above 5 years & upto 10 years",
            "interestRate_0_1": "0.067",
            "interestRate_0_1_snr": "0.045",
            "year": "5",
            "month": "1",
            "days": "0"
        }]
    }, {
        "bankId": "26",
        "value": [{
            "duration": "7 days to 45 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 179 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days to 210 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "210"
        }, {
            "duration": "211 days to less than 1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "0",
            "month": "0",
            "days": "365"
        }, {
            "duration": "Above 1 year to 455 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "455"
        }, {
            "duration": "456 days to less than 2 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 years to less than 3 years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to less than 5 years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "5 years and up to 10 years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "10",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "27",
        "value": [{
            "duration": "7 to 14 days",
            "interestRate_0_1": "0.0475",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 to 30 days",
            "interestRate_0_1": "0.0475",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 to 45 days",
            "interestRate_0_1": "0.0475",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 to 60 days",
            "interestRate_0_1": "0.0475",
            "interestRate_0_1_snr": "0.0525",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 to 90 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 to 120 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 to 179 days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 to 269 days",
            "interestRate_0_1": "0.0615",
            "interestRate_0_1_snr": "0.0665",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 to less than 1 year",
            "interestRate_0_1": "0.0615",
            "interestRate_0_1_snr": "0.0665",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year exact",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "365"
        }, {
            "duration": "Above 1 year to 2 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "1",
            "month": "0",
            "days": "365"
        }, {
            "duration": "Above 2 to less than 5 yrs",
            "interestRate_0_1": "0.066",
            "interestRate_0_1_snr": "0.071",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Exact 5 yrs",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "5",
            "month": "0",
            "days": "0"
        }, {
            "duration": "Above 5 to 10 yrs",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "10",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "28",
        "value": [{
            "duration": "7 days to 14 days ",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 days to 45 days",
            "interestRate_0_1": "0.0525",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 180 days",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 days to 240 days ",
            "interestRate_0_1": "0.07",
            "interestRate_0_1_snr": "0.0762",
            "year": "0",
            "month": "0",
            "days": "240"
        }, {
            "duration": "241 days to 364 days",
            "interestRate_0_1": "0.071",
            "interestRate_0_1_snr": "0.0782",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "12 months to less than 24 months ",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.0793",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "24 months to less than 36 months",
            "interestRate_0_1": "0.073",
            "interestRate_0_1_snr": "0.0803",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "36 months to less than 60 months",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.0793",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "60 months to less than 120 months",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.0793",
            "year": "9",
            "month": "0",
            "days": "364"
        }, {
            "duration": "120 months to 240 months",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.0793",
            "year": "19",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Tax Savings Fixed Deposit (60 months to less than 120 months) ",
            "interestRate_0_1": "0.072",
            "interestRate_0_1_snr": "0.0793",
            "year": "9",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "29",
        "value": [{
            "duration": "7 - 14 Days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 - 29 Days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 - 45 Days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 - 60 Days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 - 90 Days",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 - 120 Days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 - 150 Days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "150"
        }, {
            "duration": "151-180  Days",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.06",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 to 364 days",
            "interestRate_0_1": "0.0635",
            "interestRate_0_1_snr": "0.0635",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "365"
        }, {
            "duration": "More than 1 year upto 2 Years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "1",
            "month": "0",
            "days": "365"
        }, {
            "duration": "Above 2 Years upto 3 Years",
            "interestRate_0_1": "0.064",
            "interestRate_0_1_snr": "0.064",
            "year": "2",
            "month": "0",
            "days": "365"
        }, {
            "duration": "Above 3 Years and less than 5 Years",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "4",
            "month": "0",
            "days": "365"
        }, {
            "duration": "5 years and above",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "5",
            "month": "0",
            "days": "1"
        }]
    }, {
        "bankId": "30",
        "value": [{
            "duration": "7 day – 14 day",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "14"
        }, {
            "duration": "15 day – 30 day",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "30"
        }, {
            "duration": "31 day – 45 day",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 day – 90 day",
            "interestRate_0_1": "0.055",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 day- 120 day",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "120"
        }, {
            "duration": "121 day to - 179 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "180 days",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 day to <10 Month",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "9",
            "days": "30"
        }, {
            "duration": "10 Month to 14 Month",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "14",
            "days": "0"
        }, {
            "duration": ">14 Month to 3 Year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "3",
            "month": "0",
            "days": "0"
        }, {
            "duration": ">3 year - 5 Year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "5",
            "month": "0",
            "days": "0"
        }, {
            "duration": "> 5 year - 10 Year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.065",
            "year": "10",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "31",
        "value": [{
            "duration": "7 to 45 days",
            "interestRate_0_1": "0.05",
            "interestRate_0_1_snr": "0.055",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 to 90 days",
            "interestRate_0_1": "0.067",
            "interestRate_0_1_snr": "0.072",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "3 months to < 6 months",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "0",
            "month": "0",
            "days": "179"
        }, {
            "duration": "6 months to < 9 months",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "0",
            "month": "8",
            "days": "30"
        }, {
            "duration": "9 months to < 1 Year",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 Years to <= 10 years*",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "10",
            "month": "0",
            "days": "0"
        }]
    }, {
        "bankId": "32",
        "value": [{
            "duration": "7 days to 29 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "29"
        }, {
            "duration": "30 days to 45 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 60 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "60"
        }, {
            "duration": "61 days to 90 days",
            "interestRate_0_1": "0.045",
            "interestRate_0_1_snr": "0.05",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to 180 days",
            "interestRate_0_1": "0.0525",
            "interestRate_0_1_snr": "0.0575",
            "year": "0",
            "month": "0",
            "days": "180"
        }, {
            "duration": "181 days to 269 days",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "269"
        }, {
            "duration": "270 days to less than 1 Yr",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0675",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1Year",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "365"
        }, {
            "duration": "More than 1 Yr to less than 2 Yrs",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "2 Yrs",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "2",
            "month": "0",
            "days": "0"
        }, {
            "duration": "More than 2 Yrs to less than 3 Yrs",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "2",
            "month": "0",
            "days": "364"
        }, {
            "duration": "3 years to 5 Yrs",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "4",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Above 5 Yrs",
            "interestRate_0_1": "0.0625",
            "interestRate_0_1_snr": "0.0625",
            "year": "5",
            "month": "0",
            "days": "364"
        }]
    }, {
        "bankId": "33",
        "value": [{
            "duration": "7 days to 45 days",
            "interestRate_0_1": "0.04",
            "interestRate_0_1_snr": "0.045",
            "year": "0",
            "month": "0",
            "days": "45"
        }, {
            "duration": "46 days to 90 days",
            "interestRate_0_1": "0.0565",
            "interestRate_0_1_snr": "0.0615",
            "year": "0",
            "month": "0",
            "days": "90"
        }, {
            "duration": "91 days to less than 1 year",
            "interestRate_0_1": "0.06",
            "interestRate_0_1_snr": "0.065",
            "year": "0",
            "month": "0",
            "days": "364"
        }, {
            "duration": "1 year to 2 years",
            "interestRate_0_1": "0.0675",
            "interestRate_0_1_snr": "0.0725",
            "year": "1",
            "month": "0",
            "days": "364"
        }, {
            "duration": "Above 2 years to up to and incl.10 years",
            "interestRate_0_1": "0.065",
            "interestRate_0_1_snr": "0.07",
            "year": "10",
            "month": "0",
            "days": "0"
        }]
    }]
    // $scope.savingAccountDetails1 = [{
    //     "bankId": "3",
    //     "InterestRate":"3.5% - 4%",
    //     "type":[
    //         {
    //             "Name":"Easy Access Savings Account"
    //         },{
    //             "Name":"Prime Savings Account"
    //         },{
    //             "Name": "Prime Plus Savings Account"
    //         },{
    //             "Name": "Future Stars Savings Account"
    //         },{
    //             "Name": "Senior Privilege Savings Account"
    //         },{
    //             "Name": "Women’s Savings Account"
    //         },{
    //             "Name": "Basic Savings Account"
    //         },{
    //             "Name": "Small Basic Savings Account"
    //         }, {
    //             "Name": "Pension Savings Account"
    //         }, {
    //             "Name": "YOUth Account"
    //         }, {
    //             "Name": "Trust/NGO Saving Account"
    //         }
    //     ]
    // }];
    $scope.savingAccountDetails = [{
        "bankId": "1",
        "type": [{
            "Name": "Normal Savings Bank",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Premium SB",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Advantage Salary Premium Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Mahila Sanchay Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank 3-in-1 Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Vikash SB Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Saral Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Savi Fix Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }]
    }, {
        "bankId": "3",
        "type": [{
            "Name": "Easy Access Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Prime Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Prime Plus Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Future Stars Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Senior Privilege Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Women’s Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Basic Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Small Basic Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Pension Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "YOUth Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "Trust/NGO Saving Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }]
    }, {
        "bankId": "2",
        "type": [{
            "Name": "Normal Savings Bank",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Premium SB",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Advantage Salary Premium Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Mahila Sanchay Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank 3-in-1 Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Vikash SB Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Saral Savings Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }, {
            "Name": "All Bank Savi Fix Account",
            "features": [],
            "eligibility": [],
            "fees": ""
        }]
    }]
    $scope.bankName_route = $filter('uppercase')($routeParams.bankName);
    $scope.bankId_route = $routeParams.bankId;
    if ($scope.bankName_route != undefined) {
        $scope.bankName = ($scope.bankName_route).replace('-FIXED-DEPOSIT-INTEREST-RATE', '');
        $scope.bankName = ($scope.bankName).replace('-SAVING-ACCOUNT', '');
        $scope.selectedBankId = ($scope.bankId_route.toString());
    }
    $scope.calculateFD_modal = function(fdval) {
        $scope.fixedDepositObj = fdval;
        $scope.payoutPeriods = ['Monthly', 'Quarterly', 'Half Yearly', 'Annually'];
        // $scope.Interest_Rate_1_5 = fd.interestRate_0_1_snr;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'fdOpen_modal.html',
            backdrop: true,
            controller: function($scope, $uibModalInstance, interest, finalAmount, fixedDepositAmount, fixedDepositObj, payoutPeriods) {
                // $scope.FDtimeframe=[1,2,3,4,5,6,7,8,9,10];
                $scope.fixedDepositObj = fixedDepositObj;
                $scope.Interest_Rate_0_1 = $scope.fixedDepositObj.interestRate_0_1;
                $scope.Interest_Rate_0_1_Snr = $scope.fixedDepositObj.interestRate_0_1_snr;
                $scope.payoutPeriods = payoutPeriods;
                // $scope.year = $scope.fixedDepositObj.year;
                // $scope.month = $scope.fixedDepositObj.month;
                // $scope.days = $scope.fixedDepositObj.days;
                //$scope.period = $scope.fixedDepositObj.period;
                $scope.calculateInterest = function(Amount) {
                    if (Amount < 10000000) {
                        $scope.interestRate = $scope.Interest_Rate_0_1;
                    } else {
                        $scope.interestRate = $scope.Interest_Rate_0_1_Snr;
                    }
                    // console.log(parseFloat(($scope.month/12).toFixed(2)),parseFloat(($scope.days/365).toFixed(2)));
                    $scope.time = parseFloat($scope.fixedDepositObj.year) + parseFloat((($scope.fixedDepositObj.month * 30) / 365).toFixed(4)) + parseFloat(($scope.fixedDepositObj.days / 365).toFixed(4));
                    // console.log($scope.fixedDepositObj.month);
                    // console.log($scope.fixedDepositObj.days);
                    if ($scope.payoutPeriod == "Quarterly") {
                        $scope.finalAmount = (Amount * Math.pow((1 + ($scope.interestRate) / 4), 4 * $scope.time)).toFixed(2);
                    } else if ($scope.payoutPeriod == "Half Yearly") {
                        $scope.finalAmount = (Amount * Math.pow((1 + ($scope.interestRate) / 2), 2 * $scope.time)).toFixed(2);
                    } else if ($scope.payoutPeriod == "Monthly") {
                        $scope.finalAmount = (Amount * Math.pow((1 + ($scope.interestRate) / 12), 12 * $scope.time)).toFixed(2);
                    } else if ($scope.payoutPeriod == "Annually") {
                        $scope.finalAmount = (Amount * Math.pow((1 + ($scope.interestRate) / 1), 1 * $scope.time)).toFixed(2);
                    }
                    $scope.interest = ($scope.finalAmount - Amount).toFixed(2);
                }
                $scope.buyFD_modal = function() {
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'fdBuy_modal.html',
                        backdrop: true,
                        controller: function($scope, $uibModalInstance) {
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    });
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                interest: function() {
                    return $scope.interest;
                },
                finalAmount: function() {
                    return $scope.finalAmount;
                },
                fixedDepositAmount: function() {
                    return $scope.fixedDepositAmount;
                },
                fixedDepositObj: function() {
                    return $scope.fixedDepositObj;
                },
                payoutPeriods: function() {
                    return $scope.payoutPeriods;
                }
            }
        });
    };
}]);