var socket = io.connect('http://localhost:5000');

socket.on('pong', function (data) {
    console.log("pong");
});



$(function() {

	$("#home-page").on("change", "[name='radio-choice-h-2']", function (event) {

     socket.emit('ping', { duration: $(this).attr("desc") });		

	});
  
});  