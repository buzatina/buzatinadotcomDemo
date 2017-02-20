var mongoose = require('mongoose');

// Made Unique Changes Here
var uniqueValidator = require('mongoose-unique-validator');
// Finish Made Unique Changes Here

var QuestionSchema = mongoose.Schema({
	userid:{
		type: String,
	},
	postType:{
		type: String, default: 'Q'
	},
	name:{
		type: String
	},
	email:{
		type: String
	},
	username:{
		type: String
	},
	question:{
		type: String
	},
	picQuestion:{
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
		type: {type:String, default: 'Point'},
		coordinates: [Number]
	},	
	comments: [{ author: String, authorId: String, userComment: String, userEmail: String, picComment: String, date: { type: Date, default: Date.now }}]
});

QuestionSchema.index({location:'2dsphere', question: 'text'});

/*QuestionSchema.index({ name: 'text', question: 'text', location:'2dsphere'});*/

var Question = module.exports = mongoose.model('question', QuestionSchema);

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