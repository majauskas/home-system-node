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
		
		UTILITY.alertPopup(null, "Ricerca Dispositivi attivata.<br>Premi un tasto del telecomando o attiva un sensore", function (event) {
			UTILITY.hideAlertPopup();
			isActiveSearchWifiSensors = false;
		});
		isActiveSearchWifiSensors = true;
		
	});	
	
	$("#new-sensor-page, #edit-sensor-page").on("click", "#btWiFiSensorConferma", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		
		$.ajax({
			type:'PUT', url:"/WifiSensor",
			dataType : "json",
			data : {
				bits : data.bits,
				binCode :  data.binCode,
				decCode :  data.decCode,
				name :  $.mobile.activePage.find('#name').val(),
				description :  $.mobile.activePage.find('#description').val(),
				sensorState : "1",
				batteryState : "1",
				date : new Date()
			},			
			success: function(response) {

				$.ajax({
					type : 'GET',
					url : "/WifiSensor",
					success: function(response) {
						
						$("#listview-wifi-sensors").empty();
						$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
						$("#template-wifi-sensors").tmpl( response ).appendTo( "#listview-wifi-sensors" );
						
						$.mobile.changePage("#security-page");
						$("#listview-wifi-sensors").listview("refresh");	
						
//						UTILITY.alertPopup(null, "Il sensore è stato aggiunto");
						 
			        }
				});						
				
				
	        }
		});		

	});	

	
	$("#edit-sensor-page").on("click", "#btWiFiSensorDelete", function (event) {

		UTILITY.areYouSure("Elimina il sensore?", function() {

			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
			
			$.ajax({
				type:'DELETE', url:"/WifiSensor",
				dataType : "json",
				data : {
					binCode :  data.binCode
				},			
				success: function(response) {

					$.ajax({
						type : 'GET',
						url : "/WifiSensor",
						success: function(response) {
							
							$("#listview-wifi-sensors").empty();
							$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
							$("#template-wifi-sensors").tmpl( response ).appendTo( "#listview-wifi-sensors" );
							
							$.mobile.changePage("#security-page");
							$("#listview-wifi-sensors").listview("refresh");	
							 
				        }
					});						
					
					
		        }
			});				
			
		});
		
	

	});		
	
	
	$("#listview-wifi-sensors").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#edit-sensor-page #binCode').val(data.binCode);
		$('#edit-sensor-page #decCode').val(data.decCode);	
		$('#edit-sensor-page #name').val(data.name);
		$('#edit-sensor-page #description').val(data.description);
		$("#edit-sensor-page").attr("data", $(this).attr("data"));
		
		$.mobile.changePage("#edit-sensor-page");
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
				if(response.length == 0){
					$('#new-sensor-page #binCode').val(device.binCode);
					$('#new-sensor-page #decCode').val(device.decCode);
					$("#new-sensor-page").attr("data",JSON.stringify(device));
					$.mobile.changePage("#new-sensor-page");
					
				}else{
					UTILITY.alertPopup("", "Sensore: "+device.binCode+" è gia registrato..");	
				}
				 
	        }
		});			
	}
	
});

socket.on('ALARM_DETECTION', function (device) {

	UTILITY.areYouSure("Sicurezza violata!<br>"+ device.name+"<br>Disattiva allarme?", function() {
		
	}, null,"Atenzione");
	
});


$(document).on("pagecreate","#home-page", function(){

	$.ajax({
		type : 'GET',
		url : "/AlarmState",
		success: function(response) {
			if(!response){response = {state :"OFF"};}
        	$( "#controlgroup-allarme input[type='radio']" ).prop( "checked", false ).checkboxradio( "refresh" );
        	$( "#controlgroup-allarme input[value='"+response.state+"']").prop( "checked", true ).checkboxradio( "refresh" );
        }
	});	

	$.ajax({
		type : 'GET',
		url : "/WifiSensor",
		success: function(response) {
			$("#listview-wifi-sensors").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-wifi-sensors").tmpl( response ).appendTo( "#listview-wifi-sensors" );
			
        }
	});		
});	



