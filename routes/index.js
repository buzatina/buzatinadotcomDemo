var express = require('express');
var router = express.Router();
var Question = require('../models/questions');
var user;

//Get Homepage
router.get('/', function(req, res){

    Question.find({}, function(err, questions){
        if(err){
          console.log(err);
        } else {

        	var objQ = {question: questions.reverse()}
        	//console.log(JSON.stringify(objQ));
            res.render('index', objQ);
        }

    });

	if (req.user) {
		user = req.user;
	};

});

//Get Detailed Question
router.get('/question/:questionid', function(req, res){

	    var idQuestion = req.params.questionid;
		Question.findById(idQuestion, function (err, question) {
			if (err) {} else{

				res.render('question', {questionDetailed: question});

			};
		});

	});

//Search Questions Database
router.post('/', function(req, res){
	
	var question = ""+req.body.question+"";

	console.log('The text search is '+question);

	Question.find(
	    {$text: {$search: ""+question+""}},
	    {score: {$meta: "textScore"}})
	    .sort({score:{$meta:"textScore"}}
	)
	.exec(function(err, results) {
	    if(!err){
        	var objQ = {question: results}
 
            res.render('index', objQ);

		}

		else
			{
			    console.log(err);
			}

		});

});

// Ask a question
router.post('/askQuestion', function(req, res){

	var question = ""+req.body.question+"";

	var newQuestion = new Question({userid: req.user._id, question: question, name: req.user.name, email: req.user.email, username: req.user.username, picQuestion: req.user.picUrl});
	newQuestion.save(function (err) {
	  if (err) {

	    console.log(err);
	    res.redirect('/');

	  } else {

	    console.log('Asked question buzaCloud');
	    res.redirect('/');
	  };
	});
});

// Ask a question
router.post('/comment', function(req, res){
	
	Question.findByIdAndUpdate(
		
	        req.body.idComment,
	        {$push: {"comments": {author: req.user.name, authorId: req.user._id, userComment: req.body.comment, userEmail: req.user.email, picComment: req.user.picUrl}}},
	        {safe: true, upsert: true, new : true},
	        function(err, objecUpdated) {
	            if (err) {
	            	console.log(err);
	            } else {
	            	console.log('Comment Posted Successfully');

	            	if (req.body.useridQuestion == req.user._id) {
	            		res.redirect('back');
	            	} else {
		            	//sendNotificationComment(req.user, req.body.idEmail, req.body.comment);
		            	res.redirect('back');
	            	};
	            };
	        }
	    );

	//// Send a notification method;
	sendNotificationComment = function(user, idEmail, comment){

	   console.log('Sendgrid event fired');
	   console.log('Sending email to: '+idEmail);

	   var helper = require('sendgrid').mail;

	   var from_email = '';
	   var to_email = ''; 
	   from_email = new helper.Email('notifications@buzatina.com');
	   to_email = new helper.Email(idEmail);
	   subject = "buzatina.com: You got an answer on your question...";

	   var htmlView = "<!DOCTYPE html>"+
	    "<html>"+
	    "<head>"+
	      "<title> Some Title </title>"+
	    "</head>"+
	    "<body>"+
	         "<h3>"+user.name+"</h3>"+

	         "<img "+ "src='"+user.picUrl+"'" +" style='height: 65px;' >"+

	         "<h4>"+ "Answered on your question:" + comment +"</h4>"+
	         /*"<a href='http://127.0.0.1:3000/question/"+data.uniqueID+'/'+data.userId+"'>view</a>"+*/
	    "</body>"+
	    "</html>";
	    content = new helper.Content("text/html", htmlView);

	//  content = new helper.Content("text/plain", data[i].advisor + " shared new advice");        
	    mail = new helper.Mail(from_email, subject, to_email, content);

	    var sg = require('sendgrid')(process.env.SENDGRIDKEY);
	    var request = sg.emptyRequest({
	      method: 'POST',
	      path: '/v3/mail/send',
	      body: mail.toJSON()
	    });

	    sg.API(request, function(error, response){
	      console.log(response.statusCode)
	      console.log(response.body)
	      console.log(response.headers)
	    })

	  };

	});

module.exports = router;