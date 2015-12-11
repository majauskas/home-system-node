

socket.emit('SOCKET-GET-CONFIGURATION', function(data){
	CONFIGURATION = data;
});


$(function() {
	$("#CONFIGURATION-PAGE").on("slidestop", "#slider-siren-volume", function (event) {
		  socket.emit('SOCKET-CHANGE-SIREN-VOLUME', $(this).val());
	});
	$("#CONFIGURATION-PAGE").on("slidestop", "#slider-voice-volume", function (event) {
		socket.emit('SOCKET-CHANGE-VOICE-VOLUME', $(this).val());
	});
	$("#CONFIGURATION-PAGE").on("slidestop", "#slider-siren-timer", function (event) {
		socket.emit('SOCKET-CHANGE-SIREN-TIMER', $(this).val());
	});
	
});






$(document).on("pagecreate","#CONFIGURATION-PAGE", function(){

	
	$("#slider-siren-volume").val(CONFIGURATION.audio.volumeSirena);
	$("#slider-siren-volume").slider("refresh");
	$("#slider-voice-volume").val(CONFIGURATION.audio.volumeVoce);
	$("#slider-voice-volume").slider("refresh");

	$("#slider-siren-timer").val(CONFIGURATION.outsideSiren.auto_off_timer);
	$("#slider-siren-timer").slider("refresh");

});

