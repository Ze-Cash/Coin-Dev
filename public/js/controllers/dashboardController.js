//Controller for Dashboard
posApp.controller('dashboardController',['$window','dashboardService','$state','$sessionStorage', function($window,dashboardService,$state,$sessionStorage) {

	var main = this;

	this.address = ($sessionStorage.address !== undefined)?$sessionStorage.address:'';

	this.totalBalance = ($sessionStorage.totalBalance !== undefined)?$sessionStorage.totalBalance:0;

	this.amount = 1000;

	this.minValue = 1000;

	this.maxValue = 100000;

	this.zchEarned = ($sessionStorage.zchEarned !== undefined)?$sessionStorage.zchEarned:0;

	this.stakedPercent = ($sessionStorage.stakedPercent !== undefined)?$sessionStorage.stakedPercent:0;

	this.blocksForged = ($sessionStorage.blocksForged !== undefined)?$sessionStorage.blocksForged:0;

	this.errormsg = '';

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
		dashboardService.getListed().
			then(function successCallback(response) {
				console.log(response);
				delete $sessionStorage.zchEarned;
				delete $sessionStorage.blocksForged;
				delete $sessionStorage.stakedPercent;
				delete $sessionStorage.totalBalance
				$sessionStorage.address = response.data;
				main.address = response.data;
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
			}).then(function() {
				$state.go('dashboard', {}, { reload: true });
				setInterval(function(){
					 $window.location.reload();
				}, 500);
				
			})
	}

	this.getZecashAmount = function() {
		dashboardService.getZecash(main.address, main.amount).
		then(function successCallback(response) {
				console.log(response);
				$sessionStorage.totalBalance = response.data[0];
				main.totalBalance = response.data[0];
				$sessionStorage.stakedPercent = response.data[1]/10;
				main.stakedPercent = response.data[1]/10;
			
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
			});
	}

	this.getValidatorInfo = function() {
		dashboardService.getValidator(main.address).
		then(function successCallback(response) {
				main.zchEarned = response.data[2];
				$sessionStorage.zchEarned = response.data[2];
				$sessionStorage.blocksForged = response.data[5];
				main.blocksForged = response.data[5];
				
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
		});
	}
	
}]);