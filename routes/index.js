var express = require('express');
var router = express.Router();
var user;
var ObjectID = require('mongodb').ObjectID;

// UPLOADER ROOT PAGE


/*router.get('/', function(req, res){
	res.render('index');
});*/


// VIIBE.CO.ZA ACTUAL PAGE
router.get('/', function(req, res){

	    // Connect To a Database
		var MongoClient = require('mongodb').MongoClient
		 , assert = require('assert');

		// Connection URL
		var url = 'mongodb://mthunzi:mthunzipassword@ds141464.mlab.com:41464/viibenosql';
		// Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);

	      // biz
		  db.collection('events').find({}).limit(6).toArray(function(err, events){

								if (err) {

									res.end();

								} else {

									console.log(events);

									res.render('indexevents', {events: events});

								}

						    });

		  // End insert single document

	    });

});

// Start Search
router.post('/', function(req,res){

	    // Connect To a Database
		var MongoClient = require('mongodb').MongoClient
		 , assert = require('assert');

		// Connection URL
		var url = 'mongodb://mthunzi:mthunzipassword@ds141464.mlab.com:41464/viibenosql';
		// Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db){
		  assert.equal(null, err);

          // Full text search
		  db.collection('events').find({
						    "$text": {"$search": "" + req.body.query +""}},
							{"score": { "$meta": "textScore" }}).sort({dateUploaded: -1}).toArray(function(err, docs){

								if (err) {

									console.log(err);

									res.end();
									// Handle error somehow

								} else {

								    res.render('indexevents', {events: docs});

								}

						    });

		  // End insert single document

	    });

});

// End Search

// Get Biz
router.get('/event/:eventid', function(req,res){

			    // Connect To a Database
				var MongoClient = require('mongodb').MongoClient
				 , assert = require('assert');

				// Connection URL
				var url = 'mongodb://mthunzi:mthunzipassword@ds141464.mlab.com:41464/viibenosql';

				// Use connect method to connect to the Server
				MongoClient.connect(url, function(err, db) {
				  assert.equal(null, err);

		          // biz
				  db.collection('events').find({_id: ObjectID(req.params.eventid)}).toArray(function(err, events){

										if (err) {

											res.end();

										} else {

											console.log('The detailed event is '+events);

											res.render('eventdetailed',  {event: events});

										}

								    });

				  // End insert single document

			    });
			    
});

// End Get Biz
module.exports = router;