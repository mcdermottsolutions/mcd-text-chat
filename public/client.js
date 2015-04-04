var socket = io();

$('form').submit(function(){
  var clientMsg = $('#m').val();
  socket.emit('webclient message', clientMsg);
  $('#messages').append($('<li>').text('you: ' + clientMsg));
  $('#m').val('');
  return false;
});

socket.on('sms message', function(smsMsg){
  $('#messages').append($('<li>mark: ').text('Mark: ' + smsMsg));
});