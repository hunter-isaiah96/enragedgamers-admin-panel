var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('slug');
var val = require('validator');

var ArticleSchema = new Schema({
	author: {type: String, default: '', required: true},
	created_at: {type: Date, default: Date.now()},
	perma_link: {type: String, default: '', unique: true, required: true},
	tags: {type: [], required: true},
	title: {type: String, default: '', required: true},
	views: {type: Number, default: 0},
	featured: {type: Boolean, default: false},
	description: {type: String, default: '', required: true},
	content: {type: String, default: '', required: false},
	type: {type: {
		text: {type: String, required: true},
		value: {type: String, required: true}
	}, default: '', required: true},
	video_type: {type: String, default: '', required: false},
	video_id: {type: String, default: '', required: false},
	score: {type: Number, default: '', required: false},
	hero_image: {type:{
		public_id: {type: String, required: true},
	  	version: {type: Number, required: true},
	  	width: {type: Number, required: true},
	  	height: {type: Number, required: true},
	  	format: {type: String, required: true, enum: ['jpg', 'jpeg', 'png']},
	  	bytes: {type: Number, required: true},
	  	url: {type: String, required: true},
	  	secure_url: {type: String, required: true}
	}, default: {}, require: true},
	gallery: {type: [{
		public_id: {type: String, required: true},
	  	version: {type: Number, required: true},
	  	width: {type: Number, required: true},
	  	height: {type: Number, required: true},
	  	format: {type: String, required: true, enum: ['jpg', 'jpeg', 'png']},
	  	bytes: {type: Number, required: true},
	  	url: {type: String, required: true},
	  	secure_url: {type: String, required: true}
	}], default: [], required: false},
});

ArticleSchema.index({
	author: 'text',
	perma_link: 'text',
	tags: 'text',
	title: 'text',
	description: 'text',
	content: 'text'
})

module.exports = ArticleSchema;