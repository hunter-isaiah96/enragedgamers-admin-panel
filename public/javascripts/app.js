var app = angular.module('EGAP', ['ui.router', 'ngDropdowns', 'angular-quill', 'ngTagsInput', 'naif.base64', 
	'wu.masonry', 'ui.sortable', 'checklist-model', '720kb.datepicker', 'angular-flatpickr', 'angular-repeat-n']);

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
	}).state('edit post', {
		url:'/editpost/:id',
		templateUrl: '/partials/posts/editpost.html',
		controller: 'EditPostController'
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
	$scope.post = {title: '', game: null, featured: false, description: 'Default Test', content: '', type: '', 
	tags: [], hero_image: null, gallery: [], author: 'Isaiah Hunter', video_url: '', score: 0};
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
            value: 'podcast',
        },
        {
            text: 'Review',
            value: 'review',
        }
    ];

    $scope.stars = [
    	{selected: false},
    	{selected: false},
    	{selected: false},
    	{selected: false},
    	{selected: false}
    ];

	$scope.post.type = $scope.categories[0];

	$scope.selectGame = function(index){
		$scope.post.game = $scope.games[index];
		$scope.games = [];
		$scope.game_search = '';
	};

	$scope.search_games = function(){
		Games.findGames($scope.game_search)
		.then(function(result){
			$scope.games = result;
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

    $scope.addToGallery = function(file, base64_encode){
       $scope.post.gallery.push(base64_encode);
    };

    $scope.removeFromGallery = function(index){
        $scope.post.gallery.splice(index, 1);
    };

    $scope.getArray = function(number){
    	return new Array(number);
    };

    $scope.setRating = function(rating){
    	for(var i = 0; i < $scope.stars.length; i++){
    		$scope.stars[i].selected = false;
    	};
    	for(var i = 0; i < (rating); i++){
    		$scope.stars[i].selected = true;
    	};
    	$scope.post.score = rating;
    };
});

app.controller('EditPostController', function($scope, Games, AppService, $stateParams){
	$scope.games = [];
	$scope.game_search = '';

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

    $scope.stars = [
    	{selected: false},
    	{selected: false},
    	{selected: false},
    	{selected: false},
    	{selected: false}
    ];

    $scope.selectGame = function(index){
		$scope.post.game = $scope.games[index];
		$scope.games = [];
		$scope.game_search = '';
	};

    $scope.search_games = function(){
		Games.findGames($scope.game_search)
		.then(function(result){
			$scope.games = result;
		})
	};

    AppService.findOnePost($stateParams.id)
    .then(function(result){
    	if(result.success){
    		$scope.post = result.post;
    		$scope.post.new_gallery = [];
    		$scope.post.removed_images = {ids: [], public_ids: []}
    		if(result.post.type.value == 'review'){
    			for(var i = 0; i < result.post.score; i++){
    				$scope.stars[i].selected = true;
    			};
    		}
    		
    	}else{
    		alert(result.msg)
    	}
    })

    $scope.updateArticle = function(){
    	AppService.updatePost($scope.post)
    	.then(function(result){
    		if(result.success){
    			alert('Successfully updated');
    		}else{
				alert(result.msg)
    		}
    	});
    };

    $scope.addToNewGallery = function(file, base64_encode){
      	$scope.post.new_gallery.push(base64_encode);
    };

    $scope.removeFromGallery = function(index){
    	$scope.post.removed_images.public_ids.push($scope.post.gallery[index].public_id)
    	$scope.post.removed_images.ids.push($scope.post.gallery[index]._id);
    	$scope.post.gallery.splice(index, 1);
    };

    $scope.removeFromNewGallery = function(index){
        $scope.post.new_gallery.splice(index, 1);
    };

    $scope.setRating = function(rating){
    	for(var i = 0; i < $scope.stars.length; i++){
    		$scope.stars[i].selected = false;
    	};
    	for(var i = 0; i < (rating); i++){
    		$scope.stars[i].selected = true;
    	};
    	$scope.post.score = rating;
    };

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
		'Survival',
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

	$scope.dateOpts = {
	    dateFormat: 'Y-m-d'
	};
	$scope.datePostSetup = function(fpItem) {
	    console.log('flatpickr', fpItem);
	}
	$scope.game = {name: '', release_date: null, main_image: null, background_image: null, publisher: '', developers: [], genre: '', platforms: [], esrb: ''};

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