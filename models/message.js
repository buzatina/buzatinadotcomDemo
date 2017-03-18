var mongoose = require('mongoose');

// Made Unique Changes Here
var uniqueValidator = require('mongoose-unique-validator');
// Finish Made Unique Changes Here

var MessageSchema = mongoose.Schema({
	typeMessage:{
		type: String, default: 'message'
	},
	fromUser:{
		type: String
	},
	fromName:{
		type: String
	},
	toUser:{
		type: String
	},
	toPic:{
		type: String
	},
	toName:{
		type: String
	},	
	date: { type: Date, default: Date.now },
	messages: [{ message: String, name: String, picMessage: String, date: { type: Date, default: Date.now }, me: Boolean}]
});

var Message = module.exports = mongoose.model('message', MessageSchema);

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