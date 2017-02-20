var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Made Unique Changes Here
var uniqueValidator = require('mongoose-unique-validator');
// Finish Made Unique Changes Here

var UserSchema = mongoose.Schema({
	username:{
		type: String,
		index: true,
		unique: true
	},
	password:{
		type: String
	},
	email:{
		type: String
	},
	name:{
		type: String
	},

	picUrl: {
		type: String
	},	

	latitude: {
		type: Number
	},

	longitude: {
		type: Number
	},

	location: {
		type: {type:String}, 
		coordinates: [Number]
	},
	
	followers: [{ fan: String, fanId: String, fanEmail: String, date: { type: Date, default: Date.now }}]
});

// Made Unique Changes Here
UserSchema.plugin(uniqueValidator);
// Finish Made Unique Changes Here

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			newUser.password = hash;
			newUser.save(callback);
		});
	});
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