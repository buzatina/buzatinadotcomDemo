var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//Register Render Page
router.get('/register', function(req, res){
	res.render('register');
});

//Register POST - register a user
router.post('/register', function(req, res){

	var errBody = req.body;
	
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.email;
	var password = req.body.password;

	//var password2 = req.body.password2;

	//validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	//req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	//req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var locationArray = [Number(-1), Number(1)];

	var errors = req.validationErrors();
	console.log(errors);

	if (errors) {
		res.render('register', {
			errors: errors
		});

	} else {

		var newUser = new User({
			name: req.body.name,
			email: req.body.email,
			username: req.body.email,
			password: req.body.password,
			location: {type: 'Point', coordinates: [Number(1), Number(-1)] }
		});

		User.createUser(newUser, function(err, user){
			if (err) {

				console.log(err);

				res.render('register', {
			     usernameError: 'Username is taken, please select a new one', errBody: errBody
		         });

			} else {
				
				req.flash('success_msg', 'You are registered and can now login');
				setTimeout(function() {
					res.render('login', {errBody: errBody});
				}, 2000);

			};
		});
	};

});

//Get User Profile
router.get('/profile/:userid', function(req, res){

    var idProfile = req.params.userid;
	User.findById(idProfile, function (err, question) {
		if (err) {} else{

			console.log(idProfile);

			console.log(question);

			res.render('profile', {userProfile: question});

		};
	});

		if (req.user) {
			user = req.user;
		};

	});

// Render Login Page
router.get('/login', function(req, res){
	res.render('login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username, function(err, user){
  		if(err) throw err;
  		if(!user){
  			return done(null, false, {message: 'Unknown User'});
  		}

  		User.comparePassword(password, user.password, function(err, isMatch){
  			if (err) throw err;
  			if(isMatch){
  				return done(null, user);
  			} else{
  				return done(null, false, {message: 'Invalide Password'})
  			}
  		});
  	});

  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// Do the actual Login
router.post('/login',
	passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
	function(req, res){
		res.redirect('/');
	});

// Follow a User
router.post('/follow', function(req, res){
	
	User.findByIdAndUpdate(
		
	        req.body.idFollow,
	        {$push: {"followers": {fan: req.user.name, fanId: req.user._id, fanEmail: req.user.email}}},
	        {safe: true, upsert: true, new : true},
	        function(err, objecUpdated) {
	            if (err) {
	            	console.log(err);
	            }else{
	            	console.log('Followed Successfully...');
	            	res.redirect('back');
	            };
	        }
	    );
	});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;