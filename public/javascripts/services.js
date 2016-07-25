app.factory('AppService', function($q, $rootScope, $http){
	return {
		getLatestPosts: function(){
			return $http.get('/api/article')
			.then(function(result){
				if(result){
					return $q.resolve(result.data);
				}else{
					return $q.reject('Error')
				}
			})
		},
		createPost: function(obj){
			return $http.post('/api/article', obj)
			.then(function(result){
				console.log(result)
				return result.data;
			});
		},
		deletePost: function(obj){
			return $http.delete('/api/article/' + obj._id)
			.then(function(result){
				console.log(result)
			}, function(err){
				console.log(err)
			})
		}
	}
})

app.factory('Games', function($rootScope, $http){
	return {
		addGame: function(obj){
			return $http.post('/api/games', obj)
			.then(function(result){
				return result.data;
			});
		},
		findGames: function(obj){
			return $http.get('/api/games?search=' + obj)
			.then(function(result){
				return result.data;
			});
		}
	}
})

app.factory('httpInterceptor', ['$q', '$rootScope',
    function ($q, $rootScope) {
        var loadingCount = 0;

        return {
            request: function (config) {
                if(++loadingCount === 1) $rootScope.$broadcast('loading:progress');
                return config || $q.when(config);
            },

            response: function (response) {
                if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                return response || $q.when(response);
            },

            responseError: function (response) {
                if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                return $q.reject(response);
            }
        };
    }
]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);