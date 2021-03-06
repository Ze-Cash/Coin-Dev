// service for dashboard of user
posApp.service('dashboardService',function($http) {
    
    var main = this;

    this.baseUrl = 'http://ec2-18-217-151-133.us-east-2.compute.amazonaws.com:3000/users/';
//http://ec2-18-217-151-133.us-east-2.compute.amazonaws.com
    this.getListed = function() {

        return $http.post(main.baseUrl + 'getListedAsValidator');

    }

    this.getZecash = function(address, amount, privatekey) {

    	var data = {
    		address: address,
    		amount: amount,
            privatekey: privatekey
    	}
    	return $http.post(main.baseUrl + 'getZecash',data);
    }

     this.getEthers = function(address) {
        var data = {
            address: address
        }
        return $http.post(main.baseUrl + 'getTestEthers',data);
     }

    this.removeVal = function(address) {
        var data = {
            address: address
        }

        return $http.post(main.baseUrl + 'removeValidator', data);
    }

    this.getValidator = function(address) {
        var data = {
            address: address
        }

        return $http.post(main.baseUrl + 'getValidatorForIndex', data);
    }

});//end service