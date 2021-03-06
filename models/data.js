var mongoose = require('mongoose');

// Made Unique Changes Here
var uniqueValidator = require('mongoose-unique-validator');
// Finish Made Unique Changes Here

var DataSchema = mongoose.Schema({
	
	userid:{
		type: String,
	},

	name:{
		type: String
	},

	query:{
		type: String
	},

	email:{
		type: String
	},

	username:{
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
	}	

});

//SiteSchema.index({location:'2dsphere', site: 'text'});

/*QuestionSchema.index({ name: 'text', question: 'text', location:'2dsphere'});*/

var Data = module.exports = mongoose.model('data', DataSchema);

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