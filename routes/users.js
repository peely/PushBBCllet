var express = require('express');
var router = express.Router();

router.post('/register', function(req, res, next) {
	//console.log('register');

	//Get new users details
	var uname = req.body['username'];
	var AT = req.body['accessToken'];

	var responseObj = null;

	if(uname && AT){
		//Get Current users
		var allUsers = req.app.get('allUsers');

		//Have we seen this username already?
		var existingUser = allUsers.filter(x => x.username == uname)[0];
		if(existingUser){
			 //error - username already exists
			 //responseObj.state = 1;
		}
		else
		{//user does not exist, so create and add to array

			responseObj = {
				username:uname, 
				accessToken:AT,
				creationTime:new Date(),
				numOfNotificationsPushed:0
			}

			allUsers.push(responseObj);
		}
	}

	if(responseObj != null){
		res.send(responseObj);
	}
	else
	{
		res.sendStatus(403);
	}
});



router.get('/list', function(req, res, next) {
  //Get Current users
  var allUsers = req.app.get('allUsers');
  res.send(allUsers);
});



router.post('/push', function(req, res, next) {
  	//console.log('push');

	var title = req.body["title"];
	var message = req.body['message'];
	var uname = req.body['username'];

	//console.log(message, uname);

	//Get Current users
	var allUsers = req.app.get('allUsers');

	//Have we seen this username already?
	var existingUser = allUsers.filter(x => x.username == uname)[0];

	var responseObj = {};
	responseObj.status = 0;

	if(existingUser)
	{
  		var querystring = require('querystring');
		var data = querystring.stringify({
			'active':'true',
			'type':'note',
			'title':title,
			'body': message,
			'direction':'self',
			'dismissed':'false'
	    });

		var options = {
		    host: 'api.pushbullet.com',
		    port: 443,
		    path: '/v2/pushes',
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/x-www-form-urlencoded',
		        'Content-Length': Buffer.byteLength(data),
		        'Access-Token': existingUser.accessToken
	    	}
		};

		var https = require('https');
		var pushbulletRequest = https.request(options, function(pushbulletRes) 
		{
		    //var chunkCount = 0
		    var result = '';
		    pushbulletRes.on('data', function (chunk) {
		    	//chunkCount++;
		        //console.log('Got a Chunk: ' + chunkCount);
		        result += chunk;
		    });

		    pushbulletRes.on('end', function() {
	            var obj = JSON.parse(result);
	            //console.log(pushbulletRes.statusCode)//, obj);
	            responseObj.pushbulletResponse = obj;
	            existingUser.numOfNotificationsPushed++;
	            res.send(responseObj);
	        });
		});

		pushbulletRequest.on('error', function(e){
			res.send(e);
		})

		pushbulletRequest.write(data);
		pushbulletRequest.end();
	}
	else{
		responseObj.status = 1;
		res.status(403).send(responseObj);
	}
});

module.exports = router;