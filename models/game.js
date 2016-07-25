var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
	slug: {type: String, required: true},
	name: {type: String, required: true},
	release_date: {type: Date, required: true},
	main_image: {type:{
		public_id: {type: String, required: true},
	  	version: {type: Number, required: true},
	  	width: {type: Number, required: true},
	  	height: {type: Number, required: true},
	  	format: {type: String, required: true, enum: ['jpg', 'jpeg', 'png']},
	  	bytes: {type: Number, required: true},
	  	url: {type: String, required: true},
	  	secure_url: {type: String, required: true}
	}, default: {}, require: true},
	background_image: {type:{
		public_id: {type: String, required: true},
	  	version: {type: Number, required: true},
	  	width: {type: Number, required: true},
	  	height: {type: Number, required: true},
	  	format: {type: String, required: true, enum: ['jpg', 'jpeg', 'png']},
	  	bytes: {type: Number, required: true},
	  	url: {type: String, required: true},
	  	secure_url: {type: String, required: true}
	}, default: {}, require: true},
	publisher: {type: String, required: true},
	developers: {type: [], required: true},
	genre: {type: String, required: true},
	platforms: {type: [String], required: true},
	esrb: {type: String, required: true}
})

GameSchema.index({
	name: 'text',
	publish: 'text',
	genre: 'text',
})

module.exports = GameSchema;