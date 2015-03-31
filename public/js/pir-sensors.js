var isActiveSearchPirSensors = false;

$(function() {
	
	
//	$("#SENSORI-PIR-PAGE").on("click", "#btSearchPirSensors", function (event) {
//		
//		UTILITY.alertPopup(null, "Ricerca sensori PIR attivata.<br>Accendi o attiva un sensore", function (event) {
//			UTILITY.hideAlertPopup();
//			isActiveSearchPirSensors = false;
////			socket.emit('isActiveSearchPirSensors', false);
//		});
//		isActiveSearchPirSensors = true;
////		socket.emit('isActiveSearchPirSensors', true);
//		
//	});	
	
	
	
	socket.on('PIRSENSOR', function (response) {
		
		
		$("#listview-pir-sensors").empty();
		$.each(response.pins, function (i, obj) { obj.target = JSON.stringify(obj); });
		$("#template-pir-sensors").tmpl( response.pins ).appendTo( "#listview-pir-sensors" );		
		$("#listview-pir-sensors").listview("refresh");
		
		APPLICATION.pirsensors = response.pins;
		
		
//		$("#SENSORI-PIR-PAGE").page('destroy').page();	
		
		
		
		
//		socket.emit('isActiveSearchPirSensors', false);
		
//		if(isActiveSearchPirSensors){
//			isActiveSearchPirSensors = false;
//			
			
//			var wifisensors = $.grep(APPLICATION.wifisensors, function(target, i) {	
//				 return (!area.wifisensors.contains(target._id));
//			});
//			
//			$.ajax({
//				global: false,
//				type:'GET', url:"/WifiSensor/"+device.code,		
//				success: function(response) {
//					if(response.length === 0){
//						$('#NEW-WIFI-SENSOR-PAGE #binCode').val(device.binCode);
//						$('#NEW-WIFI-SENSOR-PAGE #code').val(device.code);
//						$('#NEW-WIFI-SENSOR-PAGE #name').val("");
//						$('#NEW-WIFI-SENSOR-PAGE #description').val("");
//						$("#NEW-WIFI-SENSOR-PAGE").attr("data",JSON.stringify(device));
//						$.mobile.changePage("#NEW-WIFI-SENSOR-PAGE");
//						
//					}else{
//						UTILITY.alertPopup("", "Sensore: "+device.name+" ("+device.code+") è gia registrato..");	
//					}
//		        },
//		        error: UTILITY.httpError
//			});			
//		} 
		
	});	
	
	$("#listview-pir-sensors").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-PIR-SENSOR-PAGE #code').val(data.code);	
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

			
//				$("#SENSORI-WIFI-PAGE").page('destroy').page();	
				$.mobile.changePage("#SENSORI-PIR-PAGE");
	
	        }
		});		

	});	

	
	$("#EDIT-WIFI-SENSOR-PAGE").on("click", "#btWiFiSensorDelete", function (event) {

		UTILITY.areYouSure("Elimina il sensore?", function() {

			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
			
			$.ajax({
				global: false,
				type:'DELETE', url:"/WifiSensor",
				dataType : "json",
				data : {
					code :  data.code
				},			
				success: function(response) {

					$("#SENSORI-WIFI-PAGE").page('destroy').page();	
					$("#HOME-PAGE").page('destroy').page();
					$("#AREAS-PAGE").page('destroy').page();
					$.mobile.changePage("#SENSORI-WIFI-PAGE");
										
					
					
		        }
			});				
			
		});
		
	

	});	
	
	
});





function loadSensoriPIR(){
	
	
	var st = Date.now();
	$.ajax({
		type : 'GET',
		url : "/PirSensor",
		success: function(response) {
			
			$("#listview-pir-sensors").empty();
			$.each(response.pins, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-pir-sensors").tmpl( response.pins ).appendTo( "#listview-pir-sensors" );		
			$("#listview-pir-sensors").listview("refresh");
			console.log(response.pins);
			APPLICATION.pirsensors = response.pins;
			
        }
	});		
	
}






$(document).on("pagecreate","#SENSORI-PIR-PAGE", function(){
	  loadSensoriPIR();
});	
