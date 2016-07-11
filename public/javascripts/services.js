app.factory('AppService', function($q, $rootScope, $http){
	return {
		getLatestPosts: function(){
			return $http.get('http://beta.json-generator.com/api/json/get/4yzFlpaXb')
			.then(function(result){
				if(result){
					return $q.resolve(result.data);
				}else{
					return $q.reject('Error')
				}
			})
		}
	}
})