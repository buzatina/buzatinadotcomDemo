var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

//Register Render Page
router.get('/login', function(req, res){
	res.render('login');
});

//Register Render Page
router.get('/register', function(req, res){
	res.render('register');
});

//Register POST - register a user
router.post('/register', function(req, res){
    
    var hashpass = '';

	bcrypt.genSalt(10, function(err, salt){

		bcrypt.hash(req.body.password, salt, function(err, hash){
			
			hashpass = hash;

		});

	});

    // Connect To a Database
	var MongoClient = require('mongodb').MongoClient
	 , assert = require('assert');

		// Connection URL
		var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
		// Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);
		  console.log("Connected correctly to server");

	      // Add User to users collection
		  db.collection('users').insertOne({
		  	              name: req.body.name,
					      username: req.body.username,
					      email: req.body.username,
					      aboutLacatee: 'Tell us more more about yourself',
					      password: hashpass
						}, function(err, result){
							if (err) {

								console.log(err);

							} else {
 
								res.redirect('/users/login');

							};
							
						});

		  // End insert single document

	    });

});

module.exports = router;