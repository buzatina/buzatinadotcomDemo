var mongoose = require('mongoose');

// Made Unique Changes Here
var uniqueValidator = require('mongoose-unique-validator');
// Finish Made Unique Changes Here

var SiteSchema = mongoose.Schema({
	userid:{
		type: String,
	},
	postType:{
		type: String, default: 'Q'
	},
	name:{
		type: String
	},
	urlSource:{
		type: String
	},
	title:{
		type: String
	},
	email:{
		type: String
	},
	username:{
		type: String
	},
	site:{
		type: String
	},
	picSite:{
		type: String
	},
	date: { type: Date, default: Date.now },
	latitude: {
		type: Number
	},
	longitude: {
		type: Number
	},
	location: {
		type: {type:String, default: "Point"},
		coordinates: [Number]
	},	
	comments: [{ author: String, authorId: String, userComment: String, userEmail: String, picComment: String, date: { type: Date, default: Date.now }}]
});

//SiteSchema.index({location:'2dsphere', site: 'text'});

/*QuestionSchema.index({ name: 'text', question: 'text', location:'2dsphere'});*/

var Site = module.exports = mongoose.model('site', SiteSchema);

module.exports.createQ = function(newUser, callback){
	newUser.save(callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}