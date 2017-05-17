var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var user;

//Get New Products
router.get('/', function(req, res){

	console.log('A request to get all the documents which was uploaded by the logged-in user was made');

    Product.find({}).exec(function(err, Products){

        if(err) {

          console.log(err);

        } else {

        	res.render('products', {Products: Products});

        }

    });

	if (req.user) {
		user = req.user;
	};

});

//Get Deleted Products
router.get('/books', function(req, res){

	console.log('A request to get all the deleted Products was made to this endpoint boss!!');
 
    Product.find({}).where('category').equals('books').exec(function(err, Products){
        if(err){

          console.log(err);

        } else {

        	res.render('products', {Products: Products});

        }

    });

	if (req.user) {
		user = req.user;
	};

});

//Get Deleted Products
router.get('/laptops', function(req, res){

	console.log('A request to get all the deleted Products was made to this endpoint boss!!');
 
    Product.find({}).where('category').equals('laptops').exec(function(err, Products){
        if(err){

          console.log(err);

        } else {

        	res.render('products', {Products: Products});
        	
        }

    });

	if (req.user) {
		user = req.user;
	};

});

//Get Deleted Products
router.get('/mobile', function(req, res){

	console.log('A request to get all the deleted Products was made to this endpoint boss!!');
 
    Product.find({}).where('category').equals('mobile').exec(function(err, Products){
        if (err){

          console.log(err);

        } else {

        	res.render('products', {Products: Products});
        	
        }

    });

	if (req.user) {
		user = req.user;
	};

});

//Get Deleted Products
router.get('/others', function(req, res){

	console.log('A request to get all the deleted Products was made to this endpoint boss!!');
 
    Product.find({}).where('category').equals('others').exec(function(err, Products){
        if (err) {

          console.log(err);

        } else {

        	res.render('products', {Products: Products});
        	
        }

    });

	if (req.user) {
		user = req.user;
	};

});

//Get A Product
router.get('/product/:Productid', function(req, res){

	console.log('A request to get a detailed product was made!!');
 
    var idProfile = req.params.Productid;

	Product.findById(idProfile, function (err, Product) {
		if (err) {

			console.log(err);

		} else {

			res.render('product', {Product: Product});
		};
		
	});

		if (req.user) {
			user = req.user;
		};

});

//Delete A Product
router.get('/deleteProduct/:Productid', function(req, res){

	console.log('A request to get a detailed view was made!!');
 
    var id_delete = req.params.Productid;

	Product.findByIdAndUpdate( id_delete,
	        {status: 'deleted' },
	        function(err, deleted) {
	            if (err) {
	            	console.log(err);
	            } else {

	            	res.redirect('/Products');

	            };
	        }
	    );
 
});

module.exports = router;