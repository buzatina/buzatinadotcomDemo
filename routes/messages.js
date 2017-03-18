var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var user;

var toObject = function(arr) {

	  var rv = {};
	  for (var i = 0; i < arr.length; ++i)
	    rv['message'] = arr[i];
	  return rv;
};

//Get Homepage
router.get('/', function(req, res){

    Message.find({}).where('fromUser').equals(req.user._id).exec(function(err, Messages1){
        if(err){
          console.log(err);
        } else {

          // Query for the second message
			    Message.find({}).where('toUser').equals(req.user._id).exec(function(err, Messages2){
			        if(err){
			          console.log(err);
			        } else {

/*			        	var Messages = Messages1.concat(Messages2);*/

			       	    var objQ1 = {Message1: Messages1.reverse()};
			       	    var objQ2 = {Message2: Messages2.reverse()};

			            res.render('messages', {Message: {objQ1, objQ2}});
			        }

			    });
          //query for the second message done

        }

    });

	if (req.user) {
		user = req.user;
	};

});



//Get Detailed Message
router.get('/:messageid', function(req, res){

	    var idMessage = req.params.messageid;
 
		Message.findById(idMessage, function (err, Message) {
			if (err) {

				console.log(err);

			} else {
 

				for(i=0; i < Message.messages.length; i++){
                    

					if(Message.messages[i].name === req.user.name){
						//Do nothing
					}else{
						Message.messages[i].me = false;
					};
				};

				res.render('messageDetailed', {message: Message});

			};

		});

	});

// Start a Conversation
router.post('/message', function(req, res){



	//// Send a notification method;
	sendNotificationMessage = function(user, idEmail, comment){

	   console.log('Sendgrid event fired');
	   console.log('Sending email to: '+idEmail);

	   var helper = require('sendgrid').mail;

	   var from_email = '';
	   var to_email = ''; 
	   from_email = new helper.Email('notifications@buzatina.com');
	   to_email = new helper.Email(idEmail);
	   subject = "buzatina.com: You got a message";

	   var htmlView = "<!DOCTYPE html>"+
	    "<html>"+
	    "<head>"+
	      "<title> Some Title </title>"+
	    "</head>"+
	    "<body>"+
	         "<h3>"+user.name+"</h3>"+

	         "<img "+ "src='"+user.picUrl+"'" +" style='height: 65px;' >"+

	         "<h4>"+ "Sent you a message</h4>"+
	         "<a class='btn btn-small' href='http://127.0.0.1:3000/users/login'>View</a>"+
	    "</body>"+
	    "</html>";
	    content = new helper.Content("text/html", htmlView);

	    mail = new helper.Mail(from_email, subject, to_email, content);

	    var sg = require('sendgrid')('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');
	    var request = sg.emptyRequest({
	      method: 'POST',
	      path: '/v3/mail/send',
	      body: mail.toJSON()
	    });

	    sg.API(request, function(error, response){
/*	      console.log(response.statusCode)
	      console.log(response.body)
	      console.log(response.headers)*/

	      if (error) {
	      	console.log(error);
	      	res.redirect('back');
	      }

	      res.redirect('back');


	    })

	  };


	//Start a Conversation
	    Message.find({}).where('fromUser').equals(req.user._id).where('toUser').equals(req.body.toUser).exec(function(err, Messages1){
	        if(err){
	          console.log(err);
	        } else {

	        	if (Messages1.length > 0) {

	        		var idUpdate = Messages1[0]._id;

					Message.findByIdAndUpdate(
						
					        idUpdate,
					        {$push: {"messages": {message: req.body.message, name: req.user.name, picMessage: req.user.picUrl, me: true} } },
					        {safe: true, upsert: true, new : true},
					        function(err, objecUpdated) {
					            if (err) {
					            	console.log(err);
					            } else {
					            	console.log('Message sent Maxie');
					            	res.redirect('back');

						            	if (req.body.useridMessage == req.user._id) {
						            		res.redirect('back');
						            	} else {

						            		//sendNotificationMessage(req.user, req.body.toEmail, req.body.message);
						            		res.redirect('back');
						            		
						            	};

					            };
					        }
					    );


	        	}else{

		          // Check if receiver started the message?
					    Message.find({}).where('fromUser').equals(req.body.toUser).where('toUser').equals(req.user._id).exec(function(err, Messages2){
					        if(err){
					          console.log(err);
					        } else {

					        	if (Messages2.length > 0) {

						        		var idUpdate = Messages2[0]._id;

										Message.findByIdAndUpdate(
											
										        idUpdate,
										        {$push: {"messages": {message: req.body.message, name: req.user.name, picMessage: req.user.picUrl, me: true} } },
										        {safe: true, upsert: true, new : true},
										        function(err, objecUpdated) {
										            if (err) {
										            	console.log(err);
										            } else {
										  

										            	if (req.body.useridMessage == req.user._id) {
										            		res.redirect('back');
										            	} else {

										            		//sendNotificationMessage(req.user, req.body.toEmail, req.body.message);
										            		res.redirect('back');

										            	};

										            };
										        }
										    );

					        	} else {

										var newMessage = new Message({fromUser: req.user._id, fromName: req.user.name, toUser: req.body.toUser, toPic: req.body.toPic, toName: req.body.toName, messages: [{ message: req.body.message, name: req.user.name, picMessage: req.user.picUrl, me: true}]});
										newMessage.save(function (err) {
										  if (err) {

										    console.log(err);

										  } else {

								            	if (req.body.useridMessage == req.user._id) {
								            		res.redirect('back');
								            	} else {
								            		
								            		//sendNotificationMessage(req.user, req.body.toEmail, req.body.message);
								            		res.redirect('back');

								            	};

										  };
										});
					        	};
					        };

					    });
		          //query for the second message done


	        	};
	        };

	    });
	// end code that goes inside Start A Conversation

});

// Ask a Message
router.post('/send', function(req, res){
	
	Message.findByIdAndUpdate(
		
	        req.body.idConversation,
	        {$push: {"messages": {message: req.body.message, name: req.user.name, picMessage: req.user.picUrl, me: true} } },
	        {safe: true, upsert: true, new : true},
	        function(err, objecUpdated) {
	            if (err) {
	            	console.log(err);
	            } else {
	            	console.log('Message sent Maxie');

	            	if (req.body.useridMessage == req.user._id) {
	            		res.redirect('back');
	            	} else {
	            		res.redirect('back');
		            	//sendNotificationMessage(req.user, req.body.toEmail, req.body.message);
	            	};
	            };
	        }
	    );

	//// Send a notification on message received;
	sendNotificationMessage = function(user, idEmail, comment){

	   console.log('Sendgrid event fired');
	   console.log('Sending email to: '+idEmail);

	   var helper = require('sendgrid').mail;

	   var from_email = '';
	   var to_email = ''; 
	   from_email = new helper.Email('notifications@buzatina.com');
	   to_email = new helper.Email(idEmail);
	   subject = "buzatina.com: You Got A Message...";

	   var htmlView = "<!DOCTYPE html>"+
	    "<html>"+
	    "<head>"+
	      "<title> Some Title </title>"+
	    "</head>"+
	    "<body>"+
	         "<h3>"+user.name+"</h3>"+

	         "<img "+ "src='"+user.picUrl+"'" +" style='height: 65px;' >"+

	         "<h4>"+ "Sent you a message on buzatina.com: </h4>"+
	         "<a href='http://buzatina/users/login' >Login</a>"+
	    "</body>"+
	    "</html>";
	    content = new helper.Content("text/html", htmlView);

	//  content = new helper.Content("text/plain", data[i].advisor + " shared new advice");        
	    mail = new helper.Mail(from_email, subject, to_email, content);

	    var sg = require('sendgrid')('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');
	    var request = sg.emptyRequest({
	      method: 'POST',
	      path: '/v3/mail/send',
	      body: mail.toJSON()
	    });

	    sg.API(request, function(error, response){

		      if (error) {
		      	console.log(error);
		      	res.redirect('back');
		      }

		      res.redirect('back');

	    })

	  };


	});

module.exports = router;
