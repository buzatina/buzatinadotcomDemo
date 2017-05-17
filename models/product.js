var mongoose = require('mongoose');

// Made Unique Changes Here
var uniqueValidator = require('mongoose-unique-validator');
// Finish Made Unique Changes Here

var ProductSchema = mongoose.Schema({
	
	userid:{
		type: String,
	},

	title: {
		type: String,
	},

	varsity:{
		type: String
	},

	campus:{
		type: String
	},

	category: {
		type: String
	},

	date: { type: Date, default: Date.now },

	status: { type: String, default: 'available'},

	about:{
		type: String
	}, 

	askPrice:{
		type: String
	}, 

	productUrl: {
		type: String
	},

	productKey: {
		type: String
	},

	latitude: {
		type: Number
	},

	longitude: {
		type: Number
	},

	location: {
		type: {type:String, default: "Point"},
		coordinates: [Number]
	}

});

//SiteSchema.index({location:'2dsphere', site: 'text'});

/*QuestionSchema.index({ name: 'text', question: 'text', location:'2dsphere'});*/

var Product = module.exports = mongoose.model('product', ProductSchema);