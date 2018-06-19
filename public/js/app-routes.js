posApp.config(['$transitionsProvider','$stateProvider','$locationProvider','$urlRouterProvider','$httpProvider', function($transitionsProvider,$stateProvider,$locationProvider,$urlRouterProvider,$httpProvider){
    
    $stateProvider
        // HOME STATE
        .state('home', {
            url: '/users',
            templateUrl: 'views/front-page.html'
        })
        .state('instructions', {
            url: '/users/instructions',
            templateUrl: 'views/instructions.html',
            controller: 'dashboardController',
            controllerAs: 'dashboard'
        })
        .state('validator', {
            url: '/users/validators',
            templateUrl: 'views/validators.html',
            controller: 'validatorController',
            controllerAs: 'validator'
        })
        .state('dashboard', {
            url: '/users/dashboard',
            templateUrl: 'views/dashboard.html',
            controller: 'dashboardController',
            controllerAs: 'dashboard'
        })

       
        $urlRouterProvider.otherwise('/users');

        $transitionsProvider.onBefore( {to:'base'}, 
           function($transition$, $state) {
         console.log($state.current.data);   
            $rootScope.preloader = true;             
          }
        );

}]);

