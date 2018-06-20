// service for dashboard of user
posApp.service('validatorService',function($http) {
    
    var main = this;

    this.baseUrl = 'http://localhost:3000/users/';

    this.showValidator = function(address) {
       

        return $http.get(main.baseUrl + 'showAllValidators');
    }

    this.forge = function(address,privatekey) {
       
    	var data = {
            address: address,
            privatekey: privatekey
        }
        return $http.post(main.baseUrl + 'forgeBlock',data);
    }

    this.getValidatorAdd = function(address) {
       
        return $http.get(main.baseUrl + 'getCurrentValidator');
    }


    
});//end service