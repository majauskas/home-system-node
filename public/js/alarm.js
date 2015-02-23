

var socket = io.connect();

socket.on('change-alarm-state', function (data) {
	
	$( "#controlgroup-allarme input[type='radio']" ).prop( "checked", false ).checkboxradio( "refresh" );
	$( "#controlgroup-allarme input[value='"+data.state+"']").prop( "checked", true ).checkboxradio( "refresh" );
	
});



$(document).on("pageshow","#home-page", function(){
	
	$.ajax({
		type : 'GET',
		url : "/AlarmState",
		success: function(response) {
        	$( "#controlgroup-allarme input[type='radio']" ).prop( "checked", false ).checkboxradio( "refresh" );
        	$( "#controlgroup-allarme input[value='"+response.state+"']").prop( "checked", true ).checkboxradio( "refresh" );
        }
	});	
	
});	


$(function() {
	

$("#home-page").on("change", "[name='radio-choice-h-2']", function (event) {
	$.ajax({
		type : 'POST',
		url : "/AlarmState",
		dataType : "json",
		data : {
			"state" : $(this).val(),
			"provider" : "W",
			"date" : new Date()
		},
		success: function(data) {
			socket.emit('change-alarm-state', data);
        }
	});		
});

});