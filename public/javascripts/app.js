var app = angular.module('EGAP', ['ui.router', 'ngDropdowns', 'angular-quill', 'ngTagsInput', 'naif.base64', 'wu.masonry', 'ui.sortable', 'checklist-model']);

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
	}).state('new game', {
		url: '/newgame',
		templateUrl: '/partials/games/newgame.html',
		controller: 'NewGameController'
	})
	$locationProvider.html5Mode(true).hashPrefix('*');
})

app.run(function($rootScope, $state){
	$rootScope.state = $state;
	// $scope.isLoading = function () {
	//    return $http.pendingRequests.length !== 0;
	// };
	$rootScope.$on('loading:progress', function (){
		$rootScope.isLoading = true;
    // show loading gif
	});

	$rootScope.$on('loading:finish', function (){
		$rootScope.isLoading = false;
	    // hide loading gif
	});
})

app.controller('MainController', function($rootScope, $scope, $state){
	$scope.sort = 'Newest First';
	// $scope.$watch('sort')
	$scope.menuOpen = false;

	$scope.navigation = [
		{
			title: 'Games', 
			open: false, 
			icon: 'fa-gamepad', 
			sub: [
				{title: 'All Games', state: 'games'},
				{title: 'New Game', state: 'new game'}
			]
		},
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

	$scope.deleteArticle = function(index){
		AppService.deletePost($scope.posts[index])
		.then(function(response){
			$scope.posts.splice(index, 1);
		}, function(err){

		})
	};
});

app.controller('NewPostController', function($scope, $state, AppService, Games, $http){
	$scope.games = [];
	$scope.game_search = '';
	$scope.post = {title: '', featured: false, description: 'Default Test', content: '', type: '', tags: [], hero_image: null, gallery: [], author: 'Isaiah Hunter'}
	$scope.categories = [
        {
            text: 'News',
            value: 'news'
        },
        {
            text: 'Deal',
            value: 'deal'
        },
        {
            text: 'Video',
            value: 'video'
        },
        {
            text: 'Podcasts',
            value: 'podcasts',
        },
        {
            text: 'Reviews',
            value: 'reviews',
        }
    ];

    if(localStorage.getItem('pickle') != null){
		$scope.post = localStorage.getItem('draft');	
	}

	$scope.post.type = $scope.categories[0];

	$scope.search_games = function(){
		Games.findGames($scope.game_search)
		.then(function(result){
			$scope.games = result;
			console.log($scope.games)
		})
	};
	$scope.publishArticle = function(){
		AppService.createPost($scope.post)
		.then(function(result){
			if(result.success == true){
				$state.go('posts')
			}else{
				alert(result.msg)
			}
		});
	}

	$scope.saveAsDraft = function(){
		localStorage.setItem('draft', JSON.stringify($scope.post));
	}

    $scope.addToGallery = function(file, base64_encode){
       $scope.post.gallery.push(base64_encode);
    };

    $scope.removeFromGallery = function(index){
        $scope.post.gallery.splice(index, 1);
    };
    
    $scope.getNumber = function(num) {
    	return new Array(num);   
	}

});

app.controller('NewGameController', function($scope, Games){
	$scope.genres = [
		'2D Shooter',
		'First-Person-Shooter',
		'Third-Person-Shooter',
		'Adventure',
		'Platformer',
		'Role-Playing Game',
		'Puzzle',
		'Simulation',
		'Strategy/Tactics',
		'Dance/Rhythm',
		'Survival Horror',
		'Massive Multiplayer Online',
		'Multiplayer Online Battle Arena',
		'Other'
	];

	$scope.esrb = [
		'Early Childhood',
		'Everyone',
		'Everyone 10+',
		'Teen',
		'Mature 17+',
		'Adults Only 18+', 
		'Rating Pending'
	];

	$scope.platforms = [
		'Arcade',
		'Super Nintendo Entertainment System',
		'Nintendo 64',
		'Nintendo Gamecube',
		'Nintendo DS', 
		'Nintendo 3DS',
		'Nintendo Wii',
		'Nintendo Wii U',
		'Nintendo Gameboy',
		'Nintendo Gameboy Color',
		'Nintendo Gameboy Advance',
		'Nintendo Gameboy Advance SP',
		'Atari',
		'Sega Dreamcast',
		'Sega Saturn',
		'Sega Genesis',
		'Playstation 1',
		'Playstation 2',
		'Playstation 3',
		'Playstation 4',
		'Playstation Portable',
		'Playstation VITA',
		'Xbox',
		'Xbox 360',
		'Xbox One',
		'Windows',
		'Linux',
		'MAC'
	];

	$scope.game = {name: '', main_image: null, background_image: null, publisher: '', developers: [], genre: '', platforms: [], esrb: ''};
	// $scope.game = {name: 'The Division', main_image: null, background_image: null, publisher: 'Ubisoft', developers: [], genre: 'Third-Person-Shooter', platforms: ['Playstation 4', 'Xbox One', 'Windows'], esrb: 'Mature 17+'};

	$scope.addGame = function(){
		Games.addGame($scope.game)
		.then(function(result){
			if(result.success){
				alert(result.msg)
			}else{
				alert(result.msg)
			}
		})
	};
});