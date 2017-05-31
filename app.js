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
var favicon = require('serve-favicon');

// connect to mongodb
var mongoose = require('mongoose');
var mongo = require('mongodb');
var uri = 'mongodb://tebogo:mokgaga19916@ds155920-a0.mlab.com:55920,ds155920-a1.mlab.com:55920/buzatinalive?replicaSet=rs-ds155920';
 
mongoose.Promise = global.Promise;

// mongoose connection options
mongoose.set('server', {
        socketOptions: {
            keepAlive: 1
        }});

mongoose.connect(uri);
var db = mongoose.connection;

//Try to handle error
db.on('error', function(err){
  console.log('');
});

//...
var User = require('./models/user');

// This is for routing
var routes = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search');
var settings = require('./routes/settings');
var messages = require('./routes/messages');

// Initialize the app
var app = express();

// Set Static Folder
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
 
// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '['+namespace.shift()+']';
		}
			return {
				param: formParam,
				msg: msg,
				value: value
			};
		}
}));

// Connect Flash
app.use(flash());

var userCheck = false;

// Global Vars
app.use(function(req, res, next){

	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
  userCheck = true;
	next();
  
});

// Is this the actual routing?
app.use('/', routes);
app.use('/users', users);
app.use('/search', search);
app.use('/settings', settings);
app.use('/messages', messages);

app.set('port', (process.env.PORT || 3000));

io.on('connection', function(socket){

  console.log('One Socket Connected');

  socket.on('pictureEvent', function(data){
    console.log('Picture Event triggred');
    setPic(data);
  });
});

// Set Actual Picture
var setPic = function(data){
    
    var file = data.file;
    
    console.log('The file is...');
    console.log(file);

    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();

    AWS.config.accessKeyId = 'AKIAJW3BI36IPRMTLBGA';
    AWS.config.secretAccessKey = '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';

    //  Get userid from front side
       var url;
 
       //Upload to S3
       AWS.config.region = 'us-west-2';
       var bucketName = 'buzatina';
       var bucket = new AWS.S3({

         params: {

              Bucket: bucketName
            }
            
          });

        if (file) {

            //Object key will be facebook-USERID#/FILE_NAME

            var objKey = 'ProfilePic/' + data.userId;

            var urlPic = 'https://s3-us-west-2.amazonaws.com/buzatina/ProfilePic/'+data.userId;

            var params = {

                Key: objKey,

                ContentType: file.type,

                Body: file
                
            };

            bucket.putObject(params, function (err, dataObject) {
                if (err) {
                    
                    console.log('Error uploading pic');

                } else {

                	console.log('Picture Uploaded');
 
          				    // Actual Update Method Comes Here
          					User.update({_id: data.userId}, { $set: {picUrl: urlPic}}, function (err, user){

          					  if (err){

          					  	console.log(err);

          					  } else {

          					    console.log('profile picture was updated');

          					  };
          					 
          					});

                }

            });

        } else {

            console.log('No file to upload');

        };
};