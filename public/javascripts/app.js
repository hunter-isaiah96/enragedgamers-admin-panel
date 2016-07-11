var app = angular.module('EGAP', ['ui.router', 'ngDropdowns']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$stateProvider
	.state('posts', {
		url: '/',
		templateUrl: '/partials/posts/posts.html',
		controller: 'PostsController'
	}).state('new post', {
		url: '/newpost',
		templateUrl: '/partials/posts/newpost.html',
		controller: 'NewPostController'
	})
	$locationProvider.html5Mode(true).hashPrefix('*');
})

app.run(function($rootScope, $state){
	$rootScope.state = $state;
})

app.controller('MainController', function($rootScope, $scope, $state){
	$scope.sort = 'Newest First'
	$scope.$watch('sort')
	$scope.menuOpen = false;

	$scope.navigation = [
		{
			title: 'Posts', 
			open: false,
			icon: 'fa-pencil', 
			sub: [
				{title: 'All Posts', state: 'posts'},
				{title: 'Create New', state: 'new post'},
				{title: 'Archives', state: 'archives'}
			]
		},
		{
			title: 'Users', 
			open: false, 
			icon: 'fa-user', 
			sub: [
				{title: 'All Users', state: 'users'},
				{title: 'Create New', state: 'new user'}
			]
		}
	];

	$scope.inState = function(value, array) {
		var newArray = [];
		angular.forEach(array, function(value, key){
			newArray.push(value.state);
		})
	  	return newArray.indexOf(value) > -1;
	}

	$scope.goToState = function(state){
		$rootScope.state.go(state);
		$scope.menuOpen = false;
	}

	$scope.closeMenu = function(){
		if($scope.menuOpen == true) $scope.menuOpen = false;
	}
})

app.controller('PostsController', function($rootScope, $scope, $state, AppService){
	$scope.posts = [];
	$scope.ddSelectOptions = [
        {
            text: 'Newest First',
            value: 'new'
        },
        {
            text: 'Oldest First',
            value: 'old',
        }
    ];
    $scope.ddSelectSelected = $scope.ddSelectOptions[0];
	AppService.getLatestPosts()
	.then(function(response){
		$scope.posts = response;
	}, function(err){

	})
});

app.controller('NewPostController', function($scope){
	$scope.text = 'hello';
});

app.controller('ArchivesController', function($scope){
	$scope.text = 'hello';
});
