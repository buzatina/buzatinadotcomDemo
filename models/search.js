var mongoose = require('mongoose');

// Made Unique Changes Here
var uniqueValidator = require('mongoose-unique-validator');
// Finish Made Unique Changes Here

var UserSchema = mongoose.Schema({
	userid:{
		type: String,
	},
	name:{
		type: String
	},
	username:{
		type: String
	},
	question:{
		type: String
	},
	location: {
		type: {type:String}, 
		coordinates: [Number]
	}
});

UserSchema.index({location:'2dsphere'});

var Question = module.exports = mongoose.model('search', UserSchema);

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