//Controller for Dashboard
posApp.controller('dashboardController',['$scope','$rootScope','$window','dashboardService','$state','$sessionStorage', function($scope,$rootScope,$window,dashboardService,$state,$sessionStorage) {

	var main = this;

	this.address = ($sessionStorage.address !== undefined)?$sessionStorage.address:'';

	this.privatekey = ($sessionStorage.privatekey !== undefined)?$sessionStorage.privatekey:'';
	
	this.totalBalance = ($sessionStorage.totalBalance !== undefined)?$sessionStorage.totalBalance:0;

	this.amount = 1000;

	this.total = parseInt(this.totalBalance) + parseInt(this.amount);

	this.minValue = 1000;

	this.maxValue = 100000;

	this.zchEarned = ($sessionStorage.zchEarned !== undefined)?$sessionStorage.zchEarned:0;

	this.stakedPercent = ($sessionStorage.stakedPercent !== undefined)?$sessionStorage.stakedPercent:0;

	this.blocksForged = ($sessionStorage.blocksForged !== undefined)?$sessionStorage.blocksForged:0;

	this.errormsg = '';

	this.etherBal = ($sessionStorage.etherBal !== undefined)?$sessionStorage.etherBal:0;

	this.removeValidator = function() {
		dashboardService.removeVal(main.address).
		then(function successCallback(response) {
				console.log(response);
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
			});
	}

	this.getListedAsValidator = function() {
		$rootScope.loading = true;
		dashboardService.getListed().
			then(function successCallback(response) {
				//console.log(response);
				delete $sessionStorage.zchEarned;
				delete $sessionStorage.blocksForged;
				delete $sessionStorage.stakedPercent;
				delete $sessionStorage.totalBalance
				$sessionStorage.address = response.data.identityAdd;
				main.privatekey = response.data.privateKey;
				$sessionStorage.privatekey = response.data.privateKey;
				main.address = response.data.identityAdd;
				
				//$scope.loading = false;
				$rootScope.address = ($sessionStorage.address !== undefined)?($sessionStorage.address):(response.data.identityAdd);
				
				//main.getEtherAmount();
				//console.log("validator",response.data);
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
			}).then(function() {
				$rootScope.loading = false;
				$rootScope.enableButton = false;
				$sessionStorage.enableButton = false;
				$state.go('dashboard',{}, {reload: true});

				/*setInterval(function(){
					
					 $window.location.reload();
				}, 500);*/
				
			});
	}

	this.getZecashAmount = function() {
		$rootScope.loading = true;
		dashboardService.getZecash(main.address, main.amount, main.privatekey).
		then(function successCallback(response) {
				//console.log(response);
				$sessionStorage.totalBalance = response.data[0];
				main.totalBalance = response.data[0];
				$sessionStorage.stakedPercent = response.data[1]/10;
				main.stakedPercent = response.data[1]/10;
				$rootScope.loading = false;
				$state.reload();
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
			});
	}

	this.getEtherAmount = function() {
		$rootScope.loading = true;
		dashboardService.getEthers(main.address).
		then(function successCallback(response) {
				//console.log(response);
				$sessionStorage.etherBal = response.data[0];
				main.etherBal = response.data[0];
				$rootScope.loading = false;
				
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
			});
	}

	/*this.getListedAndEthers = function() {
		main.getListedAsValidator().then(function() {
			main.getEtherAmount();
		})
	}*/

	this.getValidatorInfo = function() {
		dashboardService.getValidator(main.address).
		then(function successCallback(response) {
				main.zchEarned = response.data[2];
				$sessionStorage.zchEarned = response.data[2];
				$sessionStorage.blocksForged = response.data[5];
				main.blocksForged = response.data[5];
				$rootScope.address = ($sessionStorage.address !== undefined)?($sessionStorage.address):'';
				$rootScope.enableButton = false;
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
		});
	}

	this.getInstructions = function() {
		$rootScope.address = ($sessionStorage.address !== undefined)?($sessionStorage.address):'';
		$rootScope.enableButton = ($sessionStorage.enableButton != undefined)?($sessionStorage.enableButton):true;
	}
	
}]);