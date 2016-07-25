var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var async = require('async');
var thegamesdb = require('thegamesdb');

router.get('/gamesapi/search', function(req, res){
	thegamesdb.getGamesList({ name: req.query.name }).then(function(gameList){
		console.log(gameList)
		res.status(201).json(gameList)
	}).catch(function(err){
		console.log(err)
	});
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
