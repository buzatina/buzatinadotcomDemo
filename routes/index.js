var express = require('express');
var router = express.Router();
var user;
var ObjectID = require('mongodb').ObjectID;

router.get('/', function(req, res){

	    // Connect To a Database
		var MongoClient = require('mongodb').MongoClient
		 , assert = require('assert');

		// Connection URL
		var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
		// Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db){
		  assert.equal(null, err);

          // Full text search
		  db.collection('experiences').find({}).limit(5).toArray(function(err, experiences){

								if (err) {

									res.render('index');

								} else {

								    res.render('index', {experiences: experiences});

								}

						    });

		  // End insert single document

	    });

});

router.get('/experiences', function(req, res){

	    // Connect To a Database
		var MongoClient = require('mongodb').MongoClient
		 , assert = require('assert');

		// Connection URL
		var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
		// Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db){
		  assert.equal(null, err);

          // Full text search
		  db.collection('experiences').find({}).limit(30).toArray(function(err, experiences){

								if (err) {

									console.log(err);

									res.end();

								} else {

								    res.render('experiences', {experiences: experiences});

								}

						    });

		  // End insert single document

	    });

});

router.get('/search', function(req, res){

	    // Connect To a Database
		var MongoClient = require('mongodb').MongoClient
		 , assert = require('assert');

		// Connection URL
		var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
		// Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db){
		  assert.equal(null, err);

          // Full text search
		  db.collection('experiences').find({}).limit(30).toArray(function(err, experiences){

								if (err) {

									console.log(err);

									res.end();

								} else {

								    res.render('experiences', {experiences: experiences});

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
				var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
				// Use connect method to connect to the Server
				MongoClient.connect(url, function(err, db){
				  assert.equal(null, err);

		          // Full text search
				  db.collection('experiences').find({
								    "$text": {"$search": "" + req.body.query +""}},
									{"score": { "$meta": "textScore" }}).sort({date: -1}).limit(30).toArray(function(err, experiences){

										if (err) {

											console.log(err);

											res.end();
											// Handle error somehow - Show could not get search results error

										} else { 

										    res.render('experiences', {experiences: experiences});

										}

								    });

				  // End insert single document

			    });

});

// End Search

module.exports = router;