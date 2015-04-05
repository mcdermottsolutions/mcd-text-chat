var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser'),

myTwilioNumber = '+18305496287',
myCellNumber = '+15128203772',
twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),
socketIds = [];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
	
	var sessionId = Math.floor(Math.random() * 10000000000);
	console.log('new session: ' + sessionId);

	// process client message
	socket.on('user msg - from client', function(msg,username){

		// send sms
		var messageBody = username + ': ' + msg;
		twilio.sendMessage({
			to: myCellNumber, 
			from: myTwilioNumber,
			body: messageBody
		});

		// send to all webclients
		io.emit('user msg - from server',msg,username);

	});

	// process incoming text
	app
	 	.use(bodyParser.urlencoded({extended: true}))
		.post('/incoming', function(req, res) {
			var smsMessage = req.body.Body;
			io.emit('sms message', smsMessage);
		});

});

http.listen(8080, function(){
	console.log('listening on *:8080');
});