"use strict";

var app = angular.module('app', ['ngResource']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {controller:"IndexController"
					, templateUrl: "/javascripts/app/views/index.html"})
		.when('/new_account', {controller:"NewAccountController"
					, templateUrl: "/javascripts/app/views/account/new_account.html"})
		.when('/show_account', {controller:"ShowAccountController"
					, templateUrl:"/javascripts/app/views/account/show_account.html"})
		.when('/edit_account', {controller:"EditAccountController"
					, templateUrl:"/javascripts/app/views/account/new_account.html"})
		.when('/deposite', {controller:"DepositeController"
					, templateUrl:"/javascripts/app/views/deposite.html"})
		.when('/withdraw', {controller:"WithdrawController"
					, templateUrl:"/javascripts/app/views/withdraw.html"})
		.when('/loan', {controller:"LoanController"
					, templateUrl:"/javascripts/app/views/loan.html"})			
		.otherwise({redirectTo: "/"});
});

//Application API Http Service
app.factory('apiService', function($resource) {
	return $resource('/api/account/:id', {id: '@id'}, {update: { method: 'PUT'}});
});

app.factory('apiLoan', function($resource) {
	return $resource('/api/loan/:id', {id: '@id'}, {update: { method: 'PUT'}});
});

app.factory('Account', function() {
	return {
		id: 0
	};
});

app.factory('CacheData', function() {
	return [];
})


//Application Top most controller
app.controller('AppController', function($scope, $rootScope, $window, $http, $location, Account, CacheData) {
	$scope.show = false;
	$scope.user = { };
	
	//please send me login user's info
	$window.onload = function() {
		$http.get('/api/session').success(function(data) {
			$scope.user = data;
			//console.log($scope.user);				
		});
		
		if (CacheData.length <= 0) {
			$http.get('/api/account').success(function(data) {
				CacheData = data;
			});
		}
	};
	
	$scope.searchAccount = function() {
		if (CacheData.length > 0) {
			for (var i=0; i < CacheData.length; i++) {
				if (CacheData[i].accountid.toString() == $scope.search) {
					scope.$emit('showAccount', CacheData[i]);
					$location.url('/show_account?id=' + CacheData[i].accountid);
				}
			}
		}
	};
	
	
	var scope = $rootScope;
	scope.$on('showAccount', function(evt, data) {
		$scope.show = true;
		$scope.account = data;
		
		//store account number into Account Service
		Account.id = $scope.account.accountid;
		//console.log("Account id: " + Account.id);
		//console.log("Scope Account Id: " + $scope.account.accountid);
		scope.account = $scope.account;
		//console.log(scope.account);
	})
	
});

//Angular Index Page
app.controller('IndexController', function($scope, apiService) {
	$scope.accounts = apiService.query();
});

//Angular New Account Page
app.controller('NewAccountController', function($scope, $location, $http) {
	$scope.account = {};
	
	$scope.save = function() {
		$http.post('/api/account', $scope.account).success(function(data) {
			if (data.success == true) {
				$location.url('/show_account?id=' + data.id);
			}
		});
	};
});

//Angular Show Account Page
app.controller('ShowAccountController', function($scope, $location, $routeParams, $rootScope, $http, apiService, apiLoan) {
	$scope.id = $routeParams.id;
	$scope.account = apiService.get({id: $scope.id});
	
	$http.get('/api/loan/'+ $scope.id).success(function(data) {
		$scope.loans = data;
	})
	
	//console.log($scope.loans.length);
	
	//send a message to AppController
	var scope = $rootScope;
	scope.$emit('showAccount', $scope.account);
});

//Angular Edit Account Page
app.controller('EditAccountController', function($scope) {
	
});

//Angular Loan Wizard Page
app.controller('LoanController', function($scope, $http, $location) {
	
	$http.get('/api/account').success(function(data) {
		$scope.accounts = data;
	});
	
	$scope.save = function() {
		$http.post('/api/loan', $scope.account).success(function(data) {
			if (data.success == true) {
				$location.url('/show_account?id=' + data.id);
			}
		});	
	};
});

//Angular Withdraw Account Page
app.controller('WithdrawController', function($scope, $location, $http, Account) {
	$scope.withdrawDate = new Date().toLocaleDateString();	
	
	$scope.save = function() {
		$http.post('/api/account/withdraw', $scope.account).success(function(data) {
			if (data.success == true) {
				$location.url('/show_account?id=' + $scope.account.accountid);
			}
		});
	};
});

//Angular Deposite Account Page
app.controller('DepositeController', function($scope, $location, $http, Account) {
	$scope.depositeDate = new Date().toLocaleDateString();	
	
	$scope.save = function() {
		$http.post('/api/account/deposite', $scope.account).success(function(data) {
			if (data.success == true) {
				$location.url('/show_account?id=' + $scope.account.accountid);
			}
		});
	};
});
