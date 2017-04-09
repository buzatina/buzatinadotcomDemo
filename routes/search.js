var express = require('express');
var router = express.Router();
var Question = require('../models/questions');
var user;



var toObject = function(arr) {

	  var rv = {};
	  for (var i = 0; i < arr.length; ++i)
	    rv['message'] = arr[i];
	  return rv;	  
};



//Get Homepage
router.get('/search', function(req, res){

	console.log('Does the user object have a location attribute?');

	if (req.user) {

		if (req.user.latitude) {

			var userLatitude = req.user.latitude;
			var userLongitude = req.user.longitude;
			console.log(userLatitude);


            Question.find({
					    "$text": { "$search": "braamfontein funding to start johannesburg" },
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

		        	var objQ = {question: ads};

					console.log(objQ);

		            res.render('search', objQ);

				});

			if (req.user) {
				user = req.user;
			};

		} else{

			res.render('search', {buzaLocalErr: 'No latitude'});
		};

	} else {

		res.redirect('/');

	};

});


//Register POST - register a user
router.post('/search', function(req, res){
	
	var question = ""+req.body.question+"";
	console.log(question);

	Question.find(
	    {$text: {$search: ""+question+""}},
	    {score: {$meta: "textScore"}})
	    .sort({score:{$meta:"textScore"}}
	)
	.exec(function(err, results) {
	    if(!err){
	    console.log('results ' + results);
        	var objQ = {question: results}
        	//console.log(JSON.stringify(objQ));
            res.render('search', objQ);

	}
	else
		{
		    console.log(err);
		}
	});
});

module.exports = router;
