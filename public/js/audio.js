
$(function() {
	$("#slider-siren-volume").change(function() {
		  var slider_value = $(this).val();
		  console.log(slider_value);
	});
	$("#slider-voice-volume").change(function() {
		  var slider_value = $(this).val();
		  console.log(slider_value);
	});
	
});






$(document).on("pagecreate","#AUDIO-PAGE", function(){

	$("#slider-siren-volume").val(CONFIGURATION.audio.volumeSirena);
	$("#slider-siren-volume").slider("refresh");
	$("#slider-voice-volume").val(CONFIGURATION.audio.volumeVoce);
	$("#slider-voice-volume").slider("refresh");

});

