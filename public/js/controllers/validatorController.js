//Controller for Validator
posApp.controller('validatorController',['$window','validatorService','$state','$sessionStorage', function($window,validatorService,$state,$sessionStorage) {

	var main = this;

	this.address = ($sessionStorage.address !== undefined)?$sessionStorage.address:'';

	this.totalBalance = ($sessionStorage.totalBalance !== undefined)?$sessionStorage.totalBalance:0;
	
	this.stakedPercent = ($sessionStorage.stakedPercent !== undefined)?$sessionStorage.stakedPercent:0;

	this.blocksForged = ($sessionStorage.blocksForged !== undefined)?$sessionStorage.blocksForged:0;

	this.errormsg = '';

	this.isUpdated=false;
	
	this.isVisible=true;

	this.otherValidators = [];

	this.currentVal = ($sessionStorage.currentVal !== undefined)?$sessionStorage.currentVal:'';

	this.isDisabled = false;

	this.showValidators = function() {
		validatorService.showValidator().
		then(function successCallback(response) {
			main.otherValidators = [];
			angular.forEach(response.data.data, function(value) {
				
			if (value[3] == main.address) {
				main.totalBalance = value[0];
				main.stakedPercent = value[1]/10;
				main.blocksForged = value[5];
				main.isDisabled = false;	
			}
			else{
				main.otherValidators.push(value);
			}
		});
	},function errorCallback(response) {
		console.log(response);
		console.log("some error occurred. Check the console.");
	});
	}

	this.forgeBlock = function() {
		main.isDisabled = true;
		validatorService.forge(main.address).
		then(function successCallback(response) {
				main.isVisible=false;
				setInterval(function(){
					 main.isVisible=true;
				}, 60000);
				main.isDisabled = false;
				main.isUpdated = true;
				setTimeout(function(){main.isUpdated = false; }, 20000);
				//main.isDisabled = false;
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
		})
	}

	this.getValidator = function() {
		validatorService.getValidatorAdd().
		then(function successCallback(response) {
				main.currentVal = response.data.data;
				$sessionStorage.currentVal = response.data.data;
			},function errorCallback(response) {

				console.log(response);
				console.log("some error occurred. Check the console.");
		});
	}

	setInterval(function(){
		  main.getValidator();
		  main.showValidators();
	}, 30000);
	
}]);