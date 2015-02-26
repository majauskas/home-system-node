var isActiveSearchWifiSensors = false;

$(function() {
	

	$("#home-page").on("change", "[name='radio-choice-alarm-state']", function (event) {
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
				binCode :  data.binCode,
				code :  data.code,
				name :  $.mobile.activePage.find('#name').val(),
				description :  $.mobile.activePage.find('#description').val(),
				state : "1",
				battery : "1",
				date : new Date()
			},			
			success: function(response) {

			
				$("#security-page").page('destroy').page();	
				$.mobile.changePage("#security-page");
	
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
					code :  data.code
				},			
				success: function(response) {

					$("#security-page").page('destroy').page();	
					$("#home-page").page('destroy').page();
					$.mobile.changePage("#security-page");
										
					
					
		        }
			});				
			
		});
		
	

	});		
	
	
	$("#PAGE-AREAS").on("click", "#btAddNewArea", function (event) {
		$("#PAGE-NEW-AREA").find('#name, #description').val("");
		$("#PAGE-NEW-AREA").removeAttr("data");
		$.mobile.changePage("#PAGE-NEW-AREA");
	});	
	
	
	$("#PAGE-NEW-AREA, #PAGE-EDIT-AREA").on("click", "#btConferma, #btDelete", function (event) {

		var url = "/Area";
		var type = "POST";
		var data = $.mobile.activePage.attr("data");
		if(data) {
			type = "PUT";
			data = jQuery.parseJSON(data);
			url += "/"+data._id;
		}
		
		if($(this).attr("id") === "btDelete"){
			UTILITY.areYouSure("Elimina la zona?", function() {
				goTo("DELETE",url);
			});
		}else{
			goTo(type,url);
		}
		
		function goTo(type,url) {

			$.ajax({
				type: type, url: url,
				dataType : "json",
				data : {
					name :  $.mobile.activePage.find('#name').val(),
					description :  $.mobile.activePage.find('#description').val()
				},
				error: UTILITY.httpError,
				success: function(response) {

					$("#PAGE-AREAS").page('destroy').page();
					$("#home-page").page('destroy').page();
					$.mobile.changePage("#PAGE-AREAS");
		        }
			});				
		}
	});
	
	

	
	$("#listview-wifi-sensors").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#edit-sensor-page #binCode').val(data.binCode);
		$('#edit-sensor-page #code').val(data.code);	
		$('#edit-sensor-page #name').val(data.name);
		$('#edit-sensor-page #description').val(data.description);
		$("#edit-sensor-page").attr("data", $(this).attr("data"));
		
		$.mobile.changePage("#edit-sensor-page");
	});
	

	
	$("#listview-areas").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#PAGE-EDIT-AREA #name').val(data.name);
		$('#PAGE-EDIT-AREA #description').val(data.description);
		$("#PAGE-EDIT-AREA").attr("data", $(this).attr("data"));
		
		$.mobile.changePage("#PAGE-EDIT-AREA");
	});	
	
	
});


var socket = io.connect();

socket.on('change-alarm-state', function (data) {
	
	$( "#controlgroup-alarm input[type='radio']" ).prop( "checked", false ).checkboxradio( "refresh" );
	$( "#controlgroup-alarm input[value='"+data.state+"']").prop( "checked", true ).checkboxradio( "refresh" );
	
});

socket.on('433mhz', function (device) {
	
	
	if(isActiveSearchWifiSensors){
		isActiveSearchWifiSensors = false;
		
		$.ajax({
			type:'GET', url:"/WifiSensor/"+device.code,		
			success: function(response) {
				if(response.length === 0){
					$('#new-sensor-page #binCode').val(device.binCode);
					$('#new-sensor-page #code').val(device.code);
					$('#new-sensor-page #name').val("");
					$('#new-sensor-page #description').val("");
					$("#new-sensor-page").attr("data",JSON.stringify(device));
					$.mobile.changePage("#new-sensor-page");
					
				}else{
					UTILITY.alertPopup("", "Sensore: "+device.name+" ("+device.code+") è gia registrato..");	
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
		url : "/Area",
		success: function(response) {
			var areas = [{_id:0000000001,name:"OFF"}];
			
			response.forEach(function(elt, i) {
				areas.push(elt);
			});
			
			$("#controlgroup-alarm").html("");
			$("#template-controlgroup-alarm").tmpl( areas ).appendTo( "#controlgroup-alarm" );	
			$("#home-page").trigger("create");
			
			$.ajax({
				type : 'GET',
				url : "/AlarmState",
				success: function(response) {
					if(!response){response = {state :"OFF"};}
		        	$( "#controlgroup-alarm input[type='radio']" ).prop( "checked", false ).checkboxradio( "refresh" );
		        	$( "#controlgroup-alarm input[value='"+response.state+"']").prop( "checked", true ).checkboxradio( "refresh" );
		        }
			});				
        }
	});	

	
});	

$(document).on("pagecreate","#security-page", function(){


	
	$.ajax({
		type : 'GET',
		url : "/WifiSensor",
		success: function(response) {
			$("#listview-wifi-sensors").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-wifi-sensors").tmpl( response ).appendTo( "#listview-wifi-sensors" );		
			$("#listview-wifi-sensors").listview("refresh");
        }
	});		
});	


$(document).on("pagecreate","#PAGE-AREAS", function(){

	$.ajax({
		type : 'GET',
		url : "/Area",
		success: function(response) {
			$("#listview-areas").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-areas").tmpl( response ).appendTo( "#listview-areas" );		
			$("#listview-areas").listview("refresh");
        }
	});		
});	
