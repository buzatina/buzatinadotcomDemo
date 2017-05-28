var express = require('express');

var router = express.Router();

var Site = require('../models/questions');

var Data = require('../models/data');

var user;

//Get Homepage
router.get('/', function(req, res){

	console.log('A request has been made for the homepage');
     res.render('index');
});

// Add Site;
router.post('/askQuestion', function(req, res){

		/// start main upload
		var locationArray = [];

		console.log('We are adding a new site');

		locationArray.push(Number(req.body.longitudeModal));
		locationArray.push(Number(req.body.latitudeModal));

		var newSite = new Site({title: req.body.title, content: req.body.content, site: req.body.site, urlSource: req.body.urlSource, latitude: Number(req.body.latitudeModal), longitude: Number(req.body.longitudeModal), location: {coordinates: locationArray}});
			newSite.save(function (err) {

			  if (err) {

			    console.log(err);
			    res.redirect('/');

			  } else {
			  	
			    res.redirect('/');

			  };

			});

			/// end main upload		

});

//Search Around
router.post('/', function(req, res){

	console.log(req.body);
	
	var site = ""+req.body.site+"";
 
	if (req.body.longitudeModal){

		        // Confirmation
		        console.log('Finding information around you {' + req.body.latitudeModal +', ' +req.body.longitudeModal+'}');

                // Get Location
				var userLatitude = Number(req.body.latitudeModal);
				var userLongitude = Number(req.body.longitudeModal);


				var locationArray = [];

				locationArray.push(Number(req.body.longitudeModal));
				locationArray.push(Number(req.body.latitudeModal));

                // Save Data - Search Query
				var newData = new Data({query: site, latitude: Number(req.body.latitudeModal), longitude: Number(req.body.longitudeModal), location: {coordinates: locationArray}});
					newData.save(function (err) {

						  if (err) {

						  } else {

						  };

					});


                // Execute search query
	            Site.find({
						    "$text": { "$search": site},
						    "location": {
						        "$geoWithin": {
						            "$centerSphere": [[
						               userLongitude,
						               userLatitude
						            ], 20/6378 ]
						        }
						    }
						}, function(err, ads){

						if(err){

							console.log("***Error****"+err)

						}

						if (ads.length > 0) {

				        	var objQ = {site: ads};

				            res.render('search', objQ);
							
						} else{

							res.render('noresults');
						};


					});

	} else {


            // Executing text search only
            console.log('Executing only a text search');

		    // run only a text search
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