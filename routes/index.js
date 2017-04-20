var express = require('express');
var router = express.Router();
var Site = require('../models/questions');
var user;

//Get Homepage
router.get('/', function(req, res){
     res.render('index');
});

// Basically Pin Something
router.post('/askQuestion', function(req, res){

	if (req.user.uploader) {

		/// start main upload
		var locationArray = [];

		locationArray.push(Number(req.user.longitude));
		locationArray.push(Number(req.user.latitude));

		var newSite = new Site({userid: req.user._id, title: req.body.title, content: req.body.content, site: req.body.site, urlSource: req.body.urlSource, latitude: req.user.latitude, longitude: req.user.longitude, name: req.user.name, email: req.user.email, username: req.user.username, picSite: req.user.picUrl, location: {coordinates: locationArray}});
		newSite.save(function (err) {
		  if (err) {

		    console.log(err);

		  } else {
		  	
		    res.redirect('/');

		  };

		});
		/// end main upload		
	};

});

//Search Questions Database
router.post('/', function(req, res){
	
	var site = ""+req.body.site+"";
 
	if (req.user) {

		if (req.user.latitude) {

			var userLatitude = req.user.latitude;
			var userLongitude = req.user.longitude;
			console.log(userLatitude);


            Site.find({
					    "$text": { "$search": site},
					    "location": {
					        "$geoWithin": {
					            "$centerSphere": [[
					               userLongitude,
					               userLatitude
					            ], 30/6378 ]
					        }
					    }
					}, function(err, ads){

					if(err){
						console.log("***Error****"+err)
					}

		        	var objQ = {site: ads};

					console.log(objQ);

		            res.render('search', objQ);

				});

			if (req.user) {
				user = req.user;
			};

		} else{

			    /// run only a text search
				Site.find(
				    {$text: {$search: site}},
				    {score: {$meta: "textScore"}})
				    .sort({score:{$meta:"textScore"}}
				)
				.exec(function(err, results) {
				    if(!err){
			        	var objQ = {site: results, promptCheckIn: 'please register to get a personal experience'};
			 
			            res.render('search', objQ);

					}

					else
						{
						    console.log(err);
						}

					});
				/// End Text Search

		};

	} else {

		    /// run only a text search
			Site.find(
			    {$text: {$search: site}},
			    {score: {$meta: "textScore"}})
			    .sort({score:{$meta:"textScore"}}
			)
			.exec(function(err, results) {
			    if(!err){

			    	var objQ;

		        	if (results.length > 0) {
		        		objQ = {site: results};
		        		res.render('search', objQ);
		        	} else{
		        		res.render('noresults');
		        	};
		 
		            

				}

				else
					{
					    console.log(err);
					}

				});
			/// End Text Search

	};

   /// The following ends the POST method

});

module.exports = router;