var express = require('express');
var router = express.Router();
var Site = require('../models/questions');
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

		var newSite = new Site({title: 'copy from site title', content: 'copy from home-page', site: req.body.site, urlSource: req.body.urlSource, latitude: Number(req.body.latitudeModal), longitude: Number(req.body.longitudeModal), location: {coordinates: locationArray}});
			newSite.save(function (err) {
			  if (err) {

			    console.log(err);

			  } else {
			  	
			    res.redirect('/');

			  };

			});
			/// end main upload		

});

//Search Around
router.post('/', function(req, res){
	
	console.log(' A post request was made .... someone is looking for information');
	
	console.log(req.body);
	
	var site = ""+req.body.site+"";
 
	if (req.body.longitude){

                                console.log('entered geo algo');
				var userLatitude = Number(req.body.latitude);
				var userLongitude = Number(req.body.longitude);


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
			                        
			                        console.log('got results');

						if (ads.length > 0) {
					        
							console.log('This shit got results');

				        	var objQ = {site: ads};

				                  res.render('search', objQ);
							
						} else{
							console.log('No results');

							res.render('noresults');
						};


					});

	} else {
		
		console.log('only running a text search');
 
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
