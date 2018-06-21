// first we have to declare the module. note that [] is where we will declare the dependecies later. Right now we are leaving it blank
var posApp = angular.module('posApp', ['ui.router','ngMaterial','ngMessages','ngStorage']);

posApp.run(function($rootScope, $location,$http,$localStorage) {

    $rootScope.location = $location;

     $rootScope.loading = false;
     $rootScope.loading1 = false;
     $rootScope.enableButton = true;
     $rootScope.address = '';
    /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
   $rootScope.preloader = false;
}

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
       $rootScope.preloader = true;
    }
    */
 
});