var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser'),

myTwilioNumber = '+18305496287',
myCellNumber = '+15128203772',
twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN); 

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
	
	socket.on('webclient message', function(msg,username){
		var messageBody = username + ': ' + msg;
		twilio.sendMessage({
			to: myCellNumber, 
			from: myTwilioNumber,
			body: messageBody
		});
	});

	app
	 	.use(bodyParser.urlencoded({extended: true}))
		.post('/incoming', function(req, res) {
			var smsMessage = req.body.Body;
			console.log(smsMessage);
			io.emit('sms message', smsMessage);
		});

});

http.listen(8080, function(){
	console.log('listening on *:8080');
});