var isActiveSearchPirSensors = false;

$(function() {
	
	
	

	
	$("#listview-pir-sensors").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-PIR-SENSOR-PAGE #code').html(data.code);	
		$('#EDIT-PIR-SENSOR-PAGE #name').val(data.name);
		$("#EDIT-PIR-SENSOR-PAGE").attr("data", $(this).attr("data"));
		
		$.mobile.changePage("#EDIT-PIR-SENSOR-PAGE");
	});	
	
	
	$("#EDIT-PIR-SENSOR-PAGE").on("click", "#btPirSensorConferma", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		$.ajax({
			global: false,
			type:'PUT', url:"/PirSensor",
			dataType : "json",
			data : {
				_id : data._id,
				name :  $.mobile.activePage.find('#name').val()
			},			
			success: function(response) {
				renderListViewPirSensors(response);
				$.mobile.changePage("#SENSORI-PIR-PAGE");
	
	        }
		});		

	});	

	
});





function loadSensoriPIR(){
	
	
	var st = Date.now();
	$.ajax({
		type : 'GET',
		url : "/PirSensor",
		success: renderListViewPirSensors
	});		
	
}

function renderListViewPirSensors(response){
	
	$("#listview-pir-sensors").empty();
	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
	$("#template-pir-sensors").tmpl( response ).appendTo( "#listview-pir-sensors" );		
	$("#listview-pir-sensors").listview("refresh");
	APPLICATION.pirsensors = response;	
}




$(document).on("pagecreate","#SENSORI-PIR-PAGE", function(){
	  loadSensoriPIR();
	  
		socket.on('PIRSENSOR', function (response) {
			
			console.log("socket PIRSENSOR", response);
			renderListViewPirSensors(response)
			
		});		  
	  
});	
