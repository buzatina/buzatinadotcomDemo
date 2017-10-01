const fs = require('fs');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var ObjectID = require('mongodb').ObjectID;

// Initialize the app
var app = express();

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// create http server
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

// Set the View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

passport.use(new LocalStrategy(
  function(username, password, done) {

    console.log(username);
    console.log(password);

    // Connect To a Database
  var MongoClient = require('mongodb').MongoClient
   , assert = require('assert');

  // Connection URL
  var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    console.log('Max! I am trying to login neh...');
 
    // Process to compare passwords
  db.collection('users').findOne({

              username: username

          }, function(err, user){
            if (err) {

              console.log(err);

            } else {

                bcrypt.compare(password, user.password, function(err, isMatch){
                  if(err){

                    console.log(err);

                  } else {

                    if(isMatch){

                      console.log('login worked Max');

                      return done(null, user);
                      
                    };

                  };

                });

            };

          });

    // End retrieving user and comparing passwords

    });

  }));

  // End local passport login;

// I am guessing this is to create a session?
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

// I am guessing this is to destroy a session?
passport.deserializeUser(function(id, done) {
 
  // Connect To a Database
  var MongoClient = require('mongodb').MongoClient
   , assert = require('assert');

  // Connection URL
  var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
 
    // Get the user and continue to destroy the session
  db.collection('users').findOne({

              username: id

          }, function(err, user){
              if (err) {

                console.log(err);

              } else {

                done(err, user);

              };

          });


    // End user retrieval

    });

});

// Express Session
app.use(session({
	secret: 'secret',
  cookie: { maxAge: 900000000 },
	saveUninitialized: true,
	resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

var userCheck = false;

// Global Vars
app.use(function(req, res, next){

	res.locals.user = req.user || null;
    userCheck = true;
	next();
  
});

// Login using passport.js
app.post('/users/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password.'}),
  function(req, res) {
    res.redirect('/experiences');
});

// Logout using passport.js
app.get('/users/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// This is for routing
var routes = require('./routes/index');
var users = require('./routes/users');

app.use('/', routes);
app.use('/users', users);


// What does this do? Setup routing for what again?
var router = express.Router();

app.set('port', (3000));

//Add a profile picture
/*app.get('/addexperience', function(req, res){
    
    if (req.user) {

      var sendUser = req.user;
      sendUser.password = ''; 

    } else{

      res.redirect('/');

    };

    res.render('addexperience', {user: sendUser});

    var nsp = io.of('/'+req.user._id);

      nsp.on('connection', function(socket){

          console.log('Socket connected successfully');

          socket.on('newExperience', function(newExperienceData){

          console.log('socket - profile picture received via socket');

          addNewExperience(newExperienceData);

          });

      });
  
});*/


//Add a profile picture
app.get('/experience/:experienceid', function(req, res){

    // Connect To a Database
    var MongoClient = require('mongodb').MongoClient
     , assert = require('assert');

    // Connection URL
    var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);

          // biz
      db.collection('experiences').find({_id: ObjectID(req.params.experienceid)}).limit(15).toArray(function(err, experience){

                    if (err) {

                      res.end();

                    } else {

                      res.render('experience', {experience: experience, user: sendUser});

                    }

                });

      // End insert single document

      });
    

      var nsp = io.of('/'+req.user._id);

        nsp.on('connection', function(socket){


            console.log('Socket connected successfully');

            var comment = true;

            if (comment) {

                comment = false;

                socket.on('commentOnExperience', function(data){

                    // Connect To a Database
                    var MongoClient = require('mongodb').MongoClient
                     , assert = require('assert');

                    // Connection URL
                    var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
                    // Use connect method to connect to the Server
                    MongoClient.connect(url, function(err, db){
                      assert.equal(null, err);

                          // Rate Business
                            db.collection('experiences').update({_id: ObjectID(req.params.experienceid)}, {$push:  {comments: {commentUser: sendUser.name, liked: data.liked, disliked: data.disliked, suggested: data.suggested}}}, {upsert: true}, function(err, result){
                                    
                                    if (err) {

                                      console.log(err);
                                      socket.emit('commentedOnExperienceDone', 'profileAboutUpdated information');

                                      comment = true;

                                    } else {

                                      comment = true;

                                      socket.emit('commentedOnExperienceDone', 'profileAboutUpdated information');

                                    };

                                });

                      });

                });

            };

            // Add Comment Method

        });
        
  
});

/// UPLOAD FILE METHOD START
/*var addNewExperience = function(data){
    
    var file = data.file;

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();

    AWS.config.accessKeyId = process.env.ACCESSKEY;
    AWS.config.secretAccessKey = process.env.SECRETKEY;

    //  Get userid from front side
       var url;
 
       //Upload to S3
       AWS.config.region = 'us-west-2';
       var bucketName = 'lacatbucket';
       var bucket = new AWS.S3({

         params: {

              Bucket: bucketName
            }

          });

        if (file) {

            var filenamestring = data.fileName +'';
            var filenameWithOutSpaces = filenamestring.split(' ').join('');

            var objKey = 'IMAGES/' + data.userid+ filenameWithOutSpaces;

            var urlPic = 'https://s3-us-west-2.amazonaws.com/lacatbucket/'+objKey;

            var params = {

                ACL: 'public-read',

                Key: objKey,

                ContentType: data.actualFileType,

                Body: file
                
            };

            bucket.putObject(params, function (err, dataObject) {
                
                if (err){
                    
                    console.log('Error uploading pic');

                    console.log(err);

                } else {

                      // Connect To a Database
                      var MongoClient = require('mongodb').MongoClient
                       , assert = require('assert');

                      // Connection URL
                      var url = 'mongodb://andile:Biglacat1@ds135624.mlab.com:35624/lacat';
                      // Use connect method to connect to the Server
                      MongoClient.connect(url, function(err, db){
                        assert.equal(null, err);

                          // Add event to the database
                        db.collection('experiences').insertOne({userid: data.userid, date: Date.Now(), uploader: data.uploader, title: data.title, description: data.description, comments: [], fileType: data.fileType, experienceDate: data.experienceDate, fileUrl: urlPic, fileKey: objKey}, function(err, experiences){
                                if (err) {

                                  console.log(err);

                                } else {
                                  
                                  socket.emit('Listed',  {experiences: experiences});

                                };

                              });

                        });

                }

            });

        } else {

            console.log('No file to upload');

        };
};*/