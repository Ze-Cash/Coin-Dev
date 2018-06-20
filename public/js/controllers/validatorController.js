//Controller for Validator
posApp.controller('validatorController',['$filter','$rootScope','$scope','$timeout','$window','validatorService','$state','$sessionStorage', function($filter,$rootScope,$scope,$timeout,$window,validatorService,$state,$sessionStorage) {

	var main = this;

	this.address = ($sessionStorage.address !== undefined)?$sessionStorage.address:'';

	this.privatekey = ($sessionStorage.privatekey !== undefined)?$sessionStorage.privatekey:'';
	
	this.totalBalance = ($sessionStorage.totalBalance !== undefined)?$sessionStorage.totalBalance:0;
	
	this.stakedPercent = ($sessionStorage.stakedPercent !== undefined)?$sessionStorage.stakedPercent:0;

	this.blocksForged = ($sessionStorage.blocksForged !== undefined)?$sessionStorage.blocksForged:0;

	this.errormsg = '';

	this.isUpdated=false;
	
	this.isVisible=true;

	this.otherValidators = [];

	this.currentVal = ($sessionStorage.currentVal !== undefined)?$sessionStorage.currentVal:'';

	this.isDisabled = false;

	this.prevCurrVal = ($sessionStorage.prevCurrVal !== undefined)?$sessionStorage.prevCurrVal:'';

	this.showMsg = false;

	this.blockIndex = 0;

	this.currentValName = ($sessionStorage.currentValName !== undefined)?$sessionStorage.currentValName:'';
	//$scope.counter = ($sessionStorage.counter !== undefined)?$sessionStorage.counter:60;
	/*$scope.counter = 5;
    var mytimeout = null; // the current timeoutID
    // actual timer method, counts down every second, stops on zero
    $scope.onTimeout = function() {
        if($scope.counter ===  0) {
            $scope.$broadcast('timer-stopped', 0);
            $timeout.cancel(mytimeout);

            return;
        }
        // $sessionStorage.counter = $scope.counter - 1;
        $scope.counter = $scope.counter - 1;
       
        mytimeout = $timeout($scope.onTimeout, 1000);
    };
    $scope.startTimer = function() {
    	if (mytimeout === null){
        mytimeout = $timeout($scope.onTimeout, 1000);
    }};
    // stops and resets the current timer
    $scope.stopTimer = function() {
        $scope.$broadcast('timer-stopped', $scope.counter);
        main.showLoader = false;
        mytimeout = null;
        $timeout.cancel(mytimeout);
        $scope.counter = 5;
       // $sessionStorage.counter = 60;

    };
    // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
    $scope.$on('timer-stopped', function(event, remaining) {
        if(remaining === 0) {
            console.log('your time ran out!');
        }
    });*/

	this.showValidators = function() {
		validatorService.showValidator().
		then(function successCallback(response) {
			main.otherValidators = [];
			angular.forEach(response.data.data, function(value) {
			//console.log(value);
			if (value[3] == main.address) {
				main.totalBalance = value[0];
				main.stakedPercent = value[1]/10;
				main.blocksForged = value[5];
				main.isDisabled = false;
				main.blockIndex = value[6];	
			}
			else{
				main.otherValidators.push(value);
				//main.otherValidators = $filter('orderBy')(main.otherValidators, '1*6');
				//console.log(main.otherValidators);	
			}

			/*if (main.currentVal == value[3]) {
				main.currentValName = 'Validator ' + value[7];
				$sessionStorage.currentValName = 'Validator ' + value[7];
			}*/
		});
	},function errorCallback(response) {
		console.log(response);
		console.log("some error occurred. Check the console.");
	});
	}

	this.forgeBlock = function() {
		main.isDisabled = true;
		$rootScope.loading = true;
		validatorService.forge(main.address,main.privatekey).
		then(function successCallback(response) {
				main.isVisible=false;
				setInterval(function(){
					 main.isVisible=true;
				}, 60000);
				main.isDisabled = false;
				main.isUpdated = true;
				setTimeout(function(){main.isUpdated = false; }, 10000);
				$rootScope.loading = false;
				//main.isDisabled = false;
			},function errorCallback(response) {
				console.log(response);
				console.log("some error occurred. Check the console.");
		})
	}

	this.getValidator = function() {
		//main.showMsg = false;
		validatorService.getValidatorAdd().
		then(function successCallback(response) {
				main.currentVal = response.data.data;
				$sessionStorage.currentVal = response.data.data;
				main.currentValName = response.data.dataname;
				$sessionStorage.currentValName = response.data.dataname;
			/*if (main.currentVal == main.prevCurrVal) {
					
						 
						  setTimeout(function () {
						         main.showMsg = true;
						    }, 10000);
					
					
				}*/
				$rootScope.address = ($sessionStorage.address !== undefined)?($sessionStorage.address):'';
				$rootScope.enableButton = false;
				main.prevCurrVal = response.data.data;
				$sessionStorage.prevCurrVal = response.data.data;
			},function errorCallback(response) {

				console.log(response);
				console.log("some error occurred. Check the console.");
		});
	}

	/*this.validatorName = function() {
		validatorService.showValidator().
		then(function successCallback(response) {
			
			angular.forEach(response.data.data, function(value1) {
				//console.log(value1);
				if (main.currentVal == value1[3]) {
					main.currentValName = 'Validator ' + value1[7];
					$sessionStorage.currentValName = 'Validator ' + value1[7];
				}

			});
		},function errorCallback(response) {
			console.log(response);
			console.log("some error occurred. Check the console.");
		});
	}*/

	setInterval(function(){
		  main.getValidator();
		  main.showValidators();
		  
	}, 30000);

	/*setInterval(function(){
		  main.validatorName();
		  
	}, 60000);*/

	
}]);