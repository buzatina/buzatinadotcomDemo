var express = require('express');
var router = express.Router();
var Record = require('../models/records');
var user;



var toObject = function(arr) {

	  var rv = {};
	  for (var i = 0; i < arr.length; ++i)
	    rv['message'] = arr[i];
	  return rv;	  
};



//Get New Records
router.get('/', function(req, res){

	console.log('A request to get all the documents which was uploaded by the logged-in user was made');

    Record.find({}).where('userid').equals(req.user._id).where('status').equals('new').exec(function(err, records){
        if(err){

          console.log(err);

        } else {

        	res.render('records', {userid: req.user._id, records: records});

        }

    });

	if (req.user) {
		user = req.user;
	};

});


//Get Deleted Records
router.get('/deleted', function(req, res){

	console.log('A request to get all the deleted records was made to this endpoint boss!!');
 
    Record.find({}).where('userid').equals(req.user._id).where('status').equals('deleted').exec(function(err, records){
        if(err){

          console.log(err);

        } else {

        	res.render('deleted', {userid: req.user._id, records: records});

        }

    });

	if (req.user) {
		user = req.user;
	};

});

//Get A Record
router.get('/detail/:recordid', function(req, res){

	console.log('A request to get a detailed view was made!!');
 
    var idProfile = req.params.recordid;

	Record.findById(idProfile, function (err, record) {
		if (err) {

			console.log(err);

		} else {

			res.render('record', {record: record});

		};

	});

		if (req.user) {
			user = req.user;
		};

});

//Delete A Record
router.get('/deleterecord/:recordid', function(req, res){

	console.log('A request to get a detailed view was made!!');
 
    var id_delete = req.params.recordid;

	Record.findByIdAndUpdate( id_delete,
	        {status: 'deleted' },
	        function(err, deleted) {
	            if (err) {
	            	console.log(err);
	            } else {

	            	res.redirect('/records');

	            };
	        }
	    );
 
});


module.exports = router;
