// first we have to declare the module. note that [] is where we will declare the dependecies later. Right now we are leaving it blank
var posApp = angular.module('posApp', ['ui.router','ngMaterial','ngMessages','ngStorage']);

posApp.run(function($rootScope, $location,$http,$localStorage) {

    $rootScope.location = $location;
 
});