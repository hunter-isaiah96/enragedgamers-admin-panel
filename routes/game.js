var express = require('express');
var router = express.Router();
var async = require('async');
var slug = require('slug');
var _ = require('underscore');
var rs = require('randomstring');

module.exports = function(app){

	var Game = app.models.Game;
	var Cloudinary = app.cloudinary;

	router.get('/', function(req, res){
		if(_.isEmpty(req.query.search)){
			return res.json([])
		}
		Game.find({name: { $regex: new RegExp("^" + req.query.search.toLowerCase(), "i")}}, function(err, games){
			if(err) throw err;
			res.json(games)
		})
	})
	
	router.post('/', function(req, res){
		var newGame = new Game({
			name: req.body.name,
			publisher: req.body.publisher,
			genre: req.body.genre,
			developers: req.body.developers,
			platforms: req.body.platforms,
			esrb: req.body.esrb,
		}); 
		async.series([
			function(callback){
				if(_.isEmpty(newGame.name)){
					return callback({success: false, msg: 'Please enter a name for this game'})
				}else if(_.isEmpty(req.body.main_image) || _.isEmpty(req.body.background_image)){
					return callback({success: false, msg: 'Please add both a Main Image and a Background Image for this game'})
				}else if(_.isEmpty(newGame.publisher)){
					return callback({success: false, msg: 'Please enter a publisher for this game'})
				}else if(_.isEmpty(newGame.developers)){
					return callback({success: false, msg: 'Please enter at least 1 developer for this game'})
				}else if(_.isEmpty(newGame.platforms)){
					return callback({success: false, msg: 'Please select at least 1 platform for this game'})
				}else if(_.isEmpty(newGame.esrb)){
					return callback({success: false, msg: 'Please select an ESRB rating for this game'})
				}else if(_.isEmpty(newGame.name)){
					return callback({success: false, msg: 'Please enter a name for this game'})
				}else{
					newGame.slug = slug(req.body.name, {lower: true});
					callback(null, null)
				}
			}, function(callback){
				Cloudinary.v2.uploader.upload('data:' + req.body.main_image.filetype + ';base64,' + req.body.main_image.base64, {public_id: 'games/artwork/' + rs.generate(21)}, function(err, cl_res){
					if(err){return calllback({success: false, message: 'There Was An Error Uploading An Image To Gallery'})}
					newGame.main_image = cl_res;
					callback(null, null);
				});
			}, function(callback){
				Cloudinary.v2.uploader.upload('data:' + req.body.background_image.filetype + ';base64,' + req.body.background_image.base64, {public_id: 'games/backgrounds/' + rs.generate(21)}, function(err, cl_res){
					if(err){return calllback({success: false, message: 'There Was An Error Uploading An Image To Gallery'})}
					newGame.background_image = cl_res;
					callback(null, null);
				});
			},
			function(callback){
				newGame.save(function(err, game){
					if(err) throw err;
					if(game){
						callback(null, {success: true, msg: 'Successfully added game'})
					}else{
						callback({success: false, msg: 'There was an error adding this game'})
					}
				})
			}
		], function(err, result){
			if(err){return res.json(err)}
			res.json(result[result.length])
		})
	})

	return router;
};
