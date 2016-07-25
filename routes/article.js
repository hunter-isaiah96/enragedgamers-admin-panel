var express = require('express');
var router = express.Router();
var async = require('async');
var val = require('validator');
var slug = require('slug');
var youtubeUrl = require('youtube-url');
var vimeoRegex = require('vimeo-regex');

module.exports = function(app){
	var Article = app.models.Article;
	var Cloudinary = app.cloudinary;

	router.get('/deleteall', function(req, res){
		Cloudinary.api.delete_all_resources(function(result){

		}, {});
		Article.remove({}, function(err, resource){
			return res.status(201).json(err)
		})
	})

	router.get('/', function(req, res){

	 	Article.find({}, null, {sort: {'created_at': -1}}, (err, docs) => {
            if (err) return res.status(401).json(err)
            return res.json(docs)
        })

		// var ArticleQuery = Article.find({}).limit(10).sort({created_at: 1});
		// ArticleQuery.exec(function(err, articles){
		// 	if(err){throw err;}
		// 	res.status(201).json(articles);
		// })
	})

	router.post('/search', function(req, res){
		var ArticleQuery = Article.find({$text: {$search: req.body.search}})
		ArticleQuery.exec(function(err, articles){
			if(err){throw err;}
			res.status(201).json(articles);
		})
	})

	router.post('/', function(req, res){
		var newArticle = new Article({
			author: req.body.author,
			tags: req.body.tags,
			title: req.body.title,
			description: req.body.description,
			content: req.body.content,
			type: req.body.type,
			featured: req.body.featured
		});
		async.series([
			function(callback){
				if(val.isNull(req.body.title) || !val.isLength(req.body.title, {min: 10, max: 100})){
					return callback({message: 'Title Must Be Between 15 and 100 Characters Long'})
				}if(val.isNull(req.body.description) || !val.isLength(req.body.description, {min: 5, max: 50})){
					return callback({message: 'Description Must Be Between 5 and 50 Characters Long'})
				}else if(req.body.tags.length == 0 || req.body.tags.length > 5){
					return callback({message: 'Please Choose Up To 5 Tags'})
				}else if(val.isNull(req.body.content)){
					return callback({message: 'Content Cannot Be Empty'});
				}else if(!val.isIn(req.body.type.value, ['news', 'video', 'review', 'podcast'])){
					return callback({message: 'Please Choose A Type (news, video, review, podcast)'});
				}else{
					newArticle.perma_link = slug(newArticle.title, {lower: true});
					callback(null, {})
				}
			},
			function(callback){
				if(req.body.type.value == 'news'){
					callback(null, {})
				}else if(req.body.type.value == 'video'){
					if(youtubeUrl.valid(req.body.video_url)){
						newArticle.video_type = 'youtube';
						newArticle.video_id = youtubeUrl.extractId(req.body.video_url);
						callback(null, {})
					}else if(vimeoRegex().test(req.body.video_url)){
						newArticle.video_type = 'vimeo';
						newArticle.video_id = vimeoRegex().exec(req.body.video_url)[4];
						callback(null, {})
					}else{
						return callback({message: 'Please Enter a Valid Youtube or Vimeo Video URL'})
					}
				}else if(req.body.type.value == 'review'){
					if(req.body.score > 5){
						return callback({message: 'Please Choose a Score Between 0 and 5'});
					}else{
						newArticle.score = req.body.score;
						callback(null, {})
					}
				}
			},
			function(callback){
				if(req.body.hasOwnProperty('gallery') && req.body.gallery.length > 0){
					newArticle.gallery = [];
					async.each(req.body.gallery, function(item, gallery_callback){
						Cloudinary.v2.uploader.upload('data:' + item.filetype + ';base64,' + item.base64, function(err, cl_res){
							if(err){return gallery_callback({message: 'There Was An Error Uploading An Image To Gallery'})}
							newArticle.gallery.push(cl_res);
							gallery_callback(null, {})
						});
					}, function(err, result){
						if(err){return callback(err)}
						callback(null, {});
					});
				}else{
					callback(null, {})
				}
			},
			function(callback){
				Cloudinary.v2.uploader.upload('data:' + req.body.hero_image.filetype + ';base64,' + req.body.hero_image.base64, function(err, cl_res){
					if(err){return callback({message: 'There Was a Problem Saving Hero Image'})}
					newArticle.hero_image = cl_res;
					callback(null, {})
				})
			},
			function(callback){
				newArticle.save(function(err, article){
					if(err) return callback(err);
					callback(null, article)
				})
			}
		], function(err, result){
			console.log(err)
			if(err){return res.json({success: false, msg: err.message})}
			return res.json({success: true, msg: 'Successfully Submitted Article'});
		})
	})

	router.delete('/:id', function(req, res){
		Article.findOneAndRemove({_id: req.params.id}, function(err, article){
			if(err){console.log(err)}
			if(!article){return res.status(500).json({message: 'There Was an Error Removing This Article'})}
			Cloudinary.v2.uploader.destroy(article.hero_image.public_id, function(err, cl_res){
				if(err){return res.status(500).json(err)}
				return res.status(201).json({message: 'Removed Article: ' + article.title});
			})
		})
	});

	return router;
}