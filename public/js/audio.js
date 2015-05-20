

socket.emit('SOCKET-GET-CONFIGURATION', function(data){
	console.log("SOCKET-GET-CONFIGURATION", data.audio);
	CONFIGURATION = data;
});


$(function() {
	$("#AUDIO-PAGE").on("slidestop", "#slider-siren-volume", function (event) {
		  socket.emit('SOCKET-CHANGE-SIREN-VOLUME', $(this).val());
	});
	$("#AUDIO-PAGE").on("slidestop", "#slider-voice-volume", function (event) {
		socket.emit('SOCKET-CHANGE-VOICE-VOLUME', $(this).val());
	});
	
});






$(document).on("pagecreate","#AUDIO-PAGE", function(){

	
	$("#slider-siren-volume").val(CONFIGURATION.audio.volumeSirena);
	$("#slider-siren-volume").slider("refresh");
	$("#slider-voice-volume").val(CONFIGURATION.audio.volumeVoce);
	$("#slider-voice-volume").slider("refresh");

});

