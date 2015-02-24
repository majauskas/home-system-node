var isActiveSearchWifiSensors = false;

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
				//socket.emit('change-alarm-state', data);
	        }
		});		
	});
	
	
	$("#security-page").on("click", "#btSearchWifiSensors", function (event) {
		
		UTILITY.alertPopup("", "Ricerca Dispositivi attivata.<br>Premi un tasto del telecomando o attiva un sensore", function (event) {
			UTILITY.hideAlertPopup();
			isActiveSearchWifiSensors = false;
		});
		isActiveSearchWifiSensors = true;
		
	});	
	
	$("#security-page").on("click", "#btWiFiSensorAdd", function (event) {

		var data = jQuery.parseJSON($("#popupWifiSensor").attr("data"));
		
		$.ajax({
			type:'PUT', url:"/WifiSensor",
			dataType : "json",
			data : {
				bits : data.bits,
				binCode :  data.binCode,
				decCode :  data.decCode,
				name :  $('#popupWifiSensor #name').val(),
				description :  $('#popupWifiSensor #description').val(),
				sensorState : "1",
				batteryState : "1",
				date : new Date()
			},			
			success: function(response) {
//				console.log(response);
//				setTimeout(function() {
					$('#popupWifiSensor').popup("close");
//				}, 100);
				 
	        }
		});		
		
			
		
		
	});	

	$("#security-page").on("click", "#btWiFiSensorClose", function (event) {
		
		
		$('#popupWifiSensor').popup("close");
		
	});
	
	
	

});


var socket = io.connect();

socket.on('change-alarm-state', function (data) {
	
	$( "#controlgroup-allarme input[type='radio']" ).prop( "checked", false ).checkboxradio( "refresh" );
	$( "#controlgroup-allarme input[value='"+data.state+"']").prop( "checked", true ).checkboxradio( "refresh" );
	
});

socket.on('433mhz', function (device) {
	
	
	if(isActiveSearchWifiSensors){
		isActiveSearchWifiSensors = false;
		
		
		$.ajax({
			type:'GET', url:"/WifiSensor/"+device.binCode,		
			success: function(response) {
				UTILITY.hideAlertPopup();
				if(response.lenght === 0){
					$('#popupWifiSensor #binCode').val(device.binCode);
					$('#popupWifiSensor #decCode').val(device.decCode);
//					$('#popupWifiSensor #name').val(device.name);
//					$('#popupWifiSensor #description').val(device.description);
					
					$("#popupWifiSensor").attr("data",JSON.stringify(device));
					

//					UTILITY.hideAlertPopup();

					setTimeout(function() {
						$('#popupWifiSensor').popup("open");
					}, 100);						
				}else{
//					setTimeout(function() {
						UTILITY.alertPopup("", "Sensore: "+device.binCode+" è gia registrato..");	
//					}, 100);	
									
				}
				 
	        }
		});			
		
		
	}
	
});

//socket.on('getDevices', function (data) {
//	
//	console.log("getDevices "+ data);
//	
//});


var isHomePageCreated = false;

$(document).on("pagecreate","#home-page", function(){

	$.ajax({
		type : 'GET',
		url : "/AlarmState",
		success: function(response) {
        	$( "#controlgroup-allarme input[type='radio']" ).prop( "checked", false ).checkboxradio( "refresh" );
        	$( "#controlgroup-allarme input[value='"+response.state+"']").prop( "checked", true ).checkboxradio( "refresh" );
        }
	});	
	
	$("#thead-wifi-sensors").html("");
	$("#tbody-wifi-sensors").html("");
	
	$.ajax({
		type : 'GET',
		url : "/WifiSensor",
		success: function(response) {
//			console.log(response);
			$("#thead-wifi-sensors").append("<tr class='ui-bar-c' style='font-size: 14px; font-weight: normal; color: black; text-align: center;'><th>binCode</th><th>decCode</th><th>name</th><th>description</th><th>batteryState</th><th></th> </tr>");
			
			$("#tbody-wifi-sensors").empty();
			$("#template-wifi-sensors").tmpl( response ).appendTo( "#tbody-wifi-sensors" );
			
//			 $("#security-page").trigger("create");
			 
        }
	});		
	
});	



$(document).on("pagecreate","#security-page", function(){

//	if(!isHomePageCreated){
//
//
//		
//		isHomePageCreated = true;
//	}
	
//	$("#thead-wifi-sensors").html("");
//	$("#tbody-wifi-sensors").html("");
//	
//	$.ajax({
//		type : 'GET',
//		url : "/WifiSensor",
//		success: function(response) {
//			console.log(response);
//			$("#thead-wifi-sensors").append("<tr class='ui-bar-c' style='font-size: 14px; font-weight: normal; color: black; text-align: center;'><th>binCode</th><th>decCode</th><th>name</th><th>description</th><th>batteryState</th><th></th> </tr>");
//			
//			$("#tbody-wifi-sensors").empty();
//			$("#template-wifi-sensors").tmpl( response ).appendTo( "#tbody-wifi-sensors" );
//			
////			 $("#security-page").trigger("create");
//			 
//        }
//	});	
	
//	socket.emit('getWifiSensors', '','', function (data) {
//		console.log(data); 
//	});
});



