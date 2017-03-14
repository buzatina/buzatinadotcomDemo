var express = require('express');
var router = express.Router();
var UserSettings = require('../models/user');
var bodyParser = require('body-parser');

var user;

var toObject = function(arr) {
	  var rv = {};
	  for (var i = 0; i < arr.length; ++i)
	    rv['message'] = arr[i];
	  return rv;	  
};

//Get Homepage
router.get('/settings', function(req, res){

	if (req.user) {

		if (req.user) {
			user = req.user;
		};

		res.render('settings', user);

	} else {

		res.redirect('/');
		
	};
});

//I want to upload an image here
router.post('/imageUpload', function(req, res){
  console.log('Save Picture API Invoked');
 
});

//Check In will be done here
router.post('/checkIn', function(req, res){
	console.log('Check In Method Invoked');
    // Get GPS Location
	 var locationArray = [];

	 console.log('Did it convert to a number?'+req.body.latitude + ' and longitude is '+ req.body.longitude); 

	 locationArray.push(Number(req.body.latitude));
	 locationArray.push(Number(req.body.longitude));

    // Actual Update Method Comes Here
	UserSettings.update({_id: user._id}, { $set: { location: locationArray, latitude: Number(req.body.latitude), longitude: Number(req.body.longitude)}}, function (err, user) {
	  
    if (err){

	  	console.log(err);

	  } else {

	    console.log('Location is updated');
	    res.render('settings', user);

	  };
	 
	});

});

//Check In will be done here
router.post('/aspiringEntreprener', function(req, res){
	console.log('aspiring method invoked');
 
    // Actual Update Method Comes Here
	UserSettings.update({_id: user._id}, { $set: { ambition: req.body.ambition, partnership: req.body.partnership}}, function (err, user) {
	  
    if (err){

	  	console.log(err);

	  } else {

	    console.log('aspiring updated');
	    res.render('settings', user);

	  };
	 
	});

});

//Check In will be done here
router.post('/startupBusiness', function(req, res){
	console.log('startup method invoked');

    // Actual Update Method Comes Here
	UserSettings.update({_id: user._id}, { $set: { bizName: req.body.bizName, aboutUs: req.body.aboutUs, contactEmail: req.body.contactEmail, website: req.body.website}}, function (err, user) {
	  
    if (err){

	  	console.log(err);

	  } else {

	    console.log('startupBusiness updated');
	    res.render('settings', user);

	  };
	 
	});

});

module.exports = router;