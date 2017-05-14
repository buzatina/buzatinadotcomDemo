var mongoose = require('mongoose');

// Made Unique Changes Here
var uniqueValidator = require('mongoose-unique-validator');
// Finish Made Unique Changes Here

var RecordSchema = mongoose.Schema({
	userid:{
		type: String,
	},
	site:{
		type: String
	},
	date: { type: Date, default: Date.now },
	recordDate:{
		type: String
	},
	status: { type: String, default: 'new' },
	fileType:{
		type: String
	},
	condition:{
		type: String
	},
	description:{
		type: String
	},
	uploader:{
		type: String
	},
	fileUrl:{
		type: String
	},
	fileKey:{
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

var Record = module.exports = mongoose.model('record', RecordSchema);