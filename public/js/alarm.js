var APPLICATION = {};
var isActiveSearchWifiSensors = false;
var isActiveSearchRemoteControls = false;

$(function() {


	$("#HOME-PAGE").on("change", "[name='radio-choice-alarm-state']", function (event) {
		
		
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
		
		if($(this).val() === "OFF"){
			socket.emit('switchOffSiren', {});
		}
		
	});
	
	
	$("#SENSORI-WIFI-PAGE").on("click", "#btSearchWifiSensors", function (event) {
		
		UTILITY.alertPopup(null, "Ricerca Dispositivi attivata.<br>Premi un tasto del telecomando o attiva un sensore", function (event) {
			UTILITY.hideAlertPopup();
			isActiveSearchWifiSensors = false;
		});
		isActiveSearchWifiSensors = true;
		
	});	
	
	$("#NEW-WIFI-SENSOR-PAGE, #EDIT-WIFI-SENSOR-PAGE").on("click", "#btWiFiSensorConferma", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		
		$.ajax({
			type:'PUT', url:"/WifiSensor",
			dataType : "json",
			data : {
				binCode :  data.binCode,
				code :  data.code,
				name :  $.mobile.activePage.find('#name').val(),
				description :  $.mobile.activePage.find('#description').val(),
				date : new Date()
			},			
			success: function(response) {

			
				$("#SENSORI-WIFI-PAGE").page('destroy').page();	
				$.mobile.changePage("#SENSORI-WIFI-PAGE");
	
	        }
		});		

	});	

	
	$("#EDIT-WIFI-SENSOR-PAGE").on("click", "#btWiFiSensorDelete", function (event) {

		UTILITY.areYouSure("Elimina il sensore?", function() {

			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
			
			$.ajax({
				type:'DELETE', url:"/WifiSensor",
				dataType : "json",
				data : {
					code :  data.code
				},			
				success: function(response) {

					$("#SENSORI-WIFI-PAGE").page('destroy').page();	
					$("#HOME-PAGE").page('destroy').page();
					$.mobile.changePage("#SENSORI-WIFI-PAGE");
										
					
					
		        }
			});				
			
		});
		
	

	});		
	
	
	$("#AREAS-PAGE").on("click", "#btAddNewArea", function (event) {
		$("#NEW-AREA-PAGE").find('#name, #description').val("");
		$("#NEW-AREA-PAGE").removeAttr("data");
		$.mobile.changePage("#NEW-AREA-PAGE");
	});	
	
	
	$("#NEW-AREA-PAGE").on("click", "#btConferma", function (event) {

		$.ajax({
			type: "POST", 
			url: "/Area",
			dataType : "json",
			data : {
				name :  $.mobile.activePage.find('#name').val(),
				description :  $.mobile.activePage.find('#description').val()
			},
			error: UTILITY.httpError,
			success: function(response) {

				$("#AREAS-PAGE").page('destroy').page();
				$("#HOME-PAGE").page('destroy').page();
				$.mobile.changePage("#AREAS-PAGE");
	        }
		});
		
	});

	
	
	$("#EDIT-AREA-PAGE").on("click", "#btConferma", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		$.ajax({
			type: "PUT", 
			url: "/Area/"+data._id,
			dataType : "json",
			data : {
				name :  $.mobile.activePage.find('#name').val(),
				description :  $.mobile.activePage.find('#description').val()
			},
			error: UTILITY.httpError,
			success: function(response) {

				$("#AREAS-PAGE").page('destroy').page();
				$("#HOME-PAGE").page('destroy').page();
				$.mobile.changePage("#AREAS-PAGE");
	        }
		});				
	
	});	

	$("#EDIT-AREA-PAGE").on("click", "#btDelete", function (event) {

		UTILITY.areYouSure("Elimina la zona?", function() {
			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
			
			$.ajax({
				type: "DELETE", 
				url: "/Area/"+data._id,
				error: UTILITY.httpError,
				success: function(response) {

					$("#AREAS-PAGE").page('destroy').page();
					$("#HOME-PAGE").page('destroy').page();
					$.mobile.changePage("#AREAS-PAGE");
		        }
			});	
		});
		

	});
	


	
	$("#listview-wifi-sensors").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-WIFI-SENSOR-PAGE #binCode').val(data.binCode);
		$('#EDIT-WIFI-SENSOR-PAGE #code').val(data.code);	
		$('#EDIT-WIFI-SENSOR-PAGE #name').val(data.name);
		$('#EDIT-WIFI-SENSOR-PAGE #description').val(data.description);
		$("#EDIT-WIFI-SENSOR-PAGE").attr("data", $(this).attr("data"));
		
		$.mobile.changePage("#EDIT-WIFI-SENSOR-PAGE");
	});
	

	
	$("#listview-areas").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		console.log($(this).attr("data"));
		$('#EDIT-AREA-PAGE #name').val(data.name);
		$('#EDIT-AREA-PAGE #description').val(data.description);
		$("#EDIT-AREA-PAGE").attr("data", $(this).attr("data"));
		
		$("#listview-area-sensors").empty();
		$.each(data.wifisensors, function (i, obj) { obj.target = JSON.stringify(obj); });
		$("#template-area-sensors").tmpl( data.wifisensors ).appendTo( "#listview-area-sensors" );		
				
		
		
		$.mobile.changePage("#EDIT-AREA-PAGE");
		$("#listview-area-sensors").listview("refresh");
	});	
	
//---------------------------------------------------------------------	
	$("#EDIT-AREA-PAGE").on("click", "#btAddSensorToArea", function (event) {
		var area = jQuery.parseJSON($("#EDIT-AREA-PAGE").attr("data"));

		
		var wifisensors = $.grep(APPLICATION.wifisensors, function(target, i) {	
			 return (!area.wifisensors.contains(target._id));
		});
		$("#add-remove-sensors-panel").panel("open");
		$("#listview-sensors-for-area").empty();
		$.each(wifisensors, function (i, obj) { obj.target = JSON.stringify(obj); });
		$("#template-sensors-for-area").tmpl( wifisensors  ).appendTo( "#listview-sensors-for-area" );		
		$("#listview-sensors-for-area").listview("refresh");		
		
	});
	
	$("#listview-sensors-for-area").on("click", "li", function (event) {
		
		var area = jQuery.parseJSON($("#EDIT-AREA-PAGE").attr("data"));
		var sensor = jQuery.parseJSON($(this).attr("data"));		
			
		area.wifisensors.pushUnique(sensor);
	
		$("#EDIT-AREA-PAGE").attr("data",JSON.stringify( area ));
		
		$("#listview-area-sensors").empty();
		$.each(area.wifisensors, function (i, obj) { obj.target = JSON.stringify(obj); });
		$("#template-area-sensors").tmpl( area.wifisensors  ).appendTo( "#listview-area-sensors" );		
		$("#listview-area-sensors").listview("refresh");			
		
		
		
		
		$.ajax({
			type: "PUT", url: "Area/wifisensors/"+area._id,
			dataType : "json",
			data : {
				wifisensors :  area.wifisensors
			},
			error: UTILITY.httpError,
			success: function(response) {
				$("#AREAS-PAGE").page('destroy').page();
	        }
		});			
		
		$("#add-remove-sensors-panel").panel("close");
	});	
	
	$("#listview-area-sensors").on("click", "li", function (event) {

		var area = jQuery.parseJSON($("#EDIT-AREA-PAGE").attr("data"));
		var sensor = jQuery.parseJSON($(this).attr("data"));		
			
		
		
		UTILITY.areYouSure("Elimina il sensore dalla zona?",function() {

			area.wifisensors = $.grep(area.wifisensors, function(target) {
				  return target._id !== sensor._id;
			});
			

		
			$("#EDIT-AREA-PAGE").attr("data",JSON.stringify( area ));
			
			$("#listview-area-sensors").empty();
			$.each(area.wifisensors, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-area-sensors").tmpl( area.wifisensors  ).appendTo( "#listview-area-sensors" );		
			$("#listview-area-sensors").listview("refresh");	

			
			if(area.wifisensors === null){
				area.wifisensors = [];
			}
			console.log(JSON.stringify(area));
			$.ajax({
				type: "PUT", url: "Area/wifisensors/"+area._id,
				dataType : "json",
				data : area,
				error: UTILITY.httpError,
				success: function(response) {
					$("#AREAS-PAGE").page('destroy').page();
		        }
			});			
			
		});			
			
		
	});	
	
	

	
	
	
	
	
	
	
		
	
	
	
	
	$("#REMOTE-CONTROL-PAGE").on("click", "#btSearchRemoteControls", function (event) {
		UTILITY.alertPopup(null, "Ricerca Telecomandi attivata.<br>Premi un tasto qualsiasi", function (event) {
			UTILITY.hideAlertPopup();
			isActiveSearchRemoteControls = false;
		});
		isActiveSearchRemoteControls = true;
	});	
	
	$("#NEW-REMOTE-CONTROL-PAGE").on("click", "#btConferma", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		
		$.ajax({
			type:'POST', url:"/RemoteControl",
			dataType : "json",
			data : {
				binCode :  data.binCode,
				code :  data.code,
				name :  $.mobile.activePage.find('#name').val(),
				description :  $.mobile.activePage.find('#description').val(),
				date : new Date()
			},			
			success: function(response) {
				$("#REMOTE-CONTROL-PAGE").page('destroy').page();	
				$.mobile.changePage("#REMOTE-CONTROL-PAGE");
	        },
	        error: UTILITY.httpError
		});		

	});	
	
	
	
	
	
	$("#listview-remote-controls").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-REMOTE-CONTROL-PAGE #binCode').val(data.binCode);
		$('#EDIT-REMOTE-CONTROL-PAGE #code').val(data.code);	
		$('#EDIT-REMOTE-CONTROL-PAGE #name').val(data.name);
		$('#EDIT-REMOTE-CONTROL-PAGE #description').val(data.description);
		
		if(data.area){
			$('#EDIT-REMOTE-CONTROL-PAGE #area').val(data.area.name);
		}
		
		
		$("#EDIT-REMOTE-CONTROL-PAGE").attr("data", $(this).attr("data"));
		$.mobile.changePage("#EDIT-REMOTE-CONTROL-PAGE");
	});	
	

	
	
	$("#EDIT-REMOTE-CONTROL-PAGE").on("click", "#btAddZoneToRemoteControl", function (event) {
		var remotecontrol = jQuery.parseJSON($("#EDIT-REMOTE-CONTROL-PAGE").attr("data"));

		var areas = APPLICATION.areas;
		if(remotecontrol.area){
			areas = $.grep(APPLICATION.areas, function(target, i) {	
				return (target._id !== remotecontrol.area._id);
			});
		}
		
//		var areas = $.grep(APPLICATION.areas, function(target, i) {	
//			return (remotecontrol.area === null || target._id !== remotecontrol.area._id);
//		});
		
		$("#add-remove-areas-panel").panel("open");
		$("#listview-areas-for-remote-control").empty();
		$.each(areas, function (i, obj) { obj.target = JSON.stringify(obj); });
		$("#template-areas-for-remote-control").tmpl( areas  ).appendTo( "#listview-areas-for-remote-control" );		
		$("#listview-areas-for-remote-control").listview("refresh");		
		
	});
	
	$("#listview-areas-for-remote-control").on("click", "li", function (event) {
		
		var remotecontrol = jQuery.parseJSON($("#EDIT-REMOTE-CONTROL-PAGE").attr("data"));
		var area = jQuery.parseJSON($(this).attr("data"));		
		
		remotecontrol.area = area;
		
		$('#EDIT-REMOTE-CONTROL-PAGE #area').val(area.name);	
		
		$("#EDIT-REMOTE-CONTROL-PAGE").attr("data",JSON.stringify( remotecontrol ));
		
		$("#add-remove-areas-panel").panel("close");
	});
	
	
	
	
	
	$("#EDIT-REMOTE-CONTROL-PAGE").on("click", "#btConfirm", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		
		var area = null;
		if(data.area !== undefined){
			area = {_id:data.area._id, name:data.area.name};
		}
		$.ajax({
			type: "PUT", 
			url: "/RemoteControl/"+data._id,
			dataType : "json",
			data : {
				name :  $.mobile.activePage.find('#name').val(),
				description :  $.mobile.activePage.find('#description').val(),
				area : area
			},
			error: UTILITY.httpError,
			success: function(response) {
				$("#REMOTE-CONTROL-PAGE").page('destroy').page();
				$.mobile.changePage("#REMOTE-CONTROL-PAGE");
	        }
		});				
	});	

	$("#EDIT-REMOTE-CONTROL-PAGE").on("click", "#btDelete", function (event) {

		UTILITY.areYouSure("Elimina il telecomando?", function() {
			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
			
			$.ajax({
				type: "DELETE", 
				url: "/RemoteControl/"+data._id,
				error: UTILITY.httpError,
				success: function(response) {
					$("#REMOTE-CONTROL-PAGE").page('destroy').page();
					$.mobile.changePage("#REMOTE-CONTROL-PAGE");
		        }
			});	
		});
	});	
	
	
//	minde
//-------------------------------------------------------------------------	
	
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
					$('#NEW-WIFI-SENSOR-PAGE #binCode').val(device.binCode);
					$('#NEW-WIFI-SENSOR-PAGE #code').val(device.code);
					$('#NEW-WIFI-SENSOR-PAGE #name').val("");
					$('#NEW-WIFI-SENSOR-PAGE #description').val("");
					$("#NEW-WIFI-SENSOR-PAGE").attr("data",JSON.stringify(device));
					$.mobile.changePage("#NEW-WIFI-SENSOR-PAGE");
					
				}else{
					UTILITY.alertPopup("", "Sensore: "+device.name+" ("+device.code+") Ã¨ gia registrato..");	
				}
	        },
	        error: UTILITY.httpError
		});			
	} else if(isActiveSearchRemoteControls){
		isActiveSearchRemoteControls = false;
		
		$.ajax({
			type:'GET', url:"/RemoteControl/"+device.code,		
			success: function(response) {
				if(response.length === 0){
					$('#NEW-REMOTE-CONTROL-PAGE #binCode').val(device.binCode);
					$('#NEW-REMOTE-CONTROL-PAGE #code').val(device.code);
					$('#NEW-REMOTE-CONTROL-PAGE #name').val("");
					$('#NEW-REMOTE-CONTROL-PAGE #description').val("");
					$("#NEW-REMOTE-CONTROL-PAGE").attr("data",JSON.stringify(device));
					$.mobile.changePage("#NEW-REMOTE-CONTROL-PAGE");
				}else{
					UTILITY.alertPopup("", "Telecomando: "+device.name+" ("+device.code+") è gia registrato..");	
				}
	        },
	        error: UTILITY.httpError
		});	
//		minde
	}
	
});

socket.on('ALARM_DETECTION', function (device) {

	UTILITY.areYouSure("Sicurezza violata!<br>"+ device.name+" - "+device.description+"<br>Disattiva allarme?", function() {
		socket.emit('switchOffSiren', {});
	}, null,"Atenzione");
	
});


$(document).on("pagecreate","#HOME-PAGE", function(){
 
	$.ajax({
		type : 'GET',
		url : "/Area",
		success: function(response) {
			var areas = [{_id:1000000001,name:"OFF"}];
			
			response.forEach(function(elt, i) {
				areas.push(elt);
			});
			
			$("#controlgroup-alarm").html("");
			$("#template-controlgroup-alarm").tmpl( areas ).appendTo( "#controlgroup-alarm" );	
			$("#HOME-PAGE").trigger("create");
			
			
			
			$.ajax({
				type : 'GET',
				url : "/AlarmState",
				success: function(response) {
					if(!response){response = {state :"OFF"};}
		        	$( "#controlgroup-alarm input[type='radio']" ).prop( "checked", false ).checkboxradio( "refresh" );
		        	$( "#controlgroup-alarm input[value='"+response.state+"']").prop( "checked", true ).checkboxradio( "refresh" );
		        	
		        	
		        	$("#SENSORI-WIFI-PAGE").page();	
		        	$("#AREAS-PAGE").page();	
		        	
		        }
			});				
        }
	});	
	
});	


$(document).on("pagecreate","#SENSORI-WIFI-PAGE", function(){

	$.ajax({
		type : 'GET',
		url : "/WifiSensor",
		success: function(response) {
			
			$("#listview-wifi-sensors").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-wifi-sensors").tmpl( response ).appendTo( "#listview-wifi-sensors" );		
			$("#listview-wifi-sensors").listview("refresh");
			
			APPLICATION.wifisensors = response;
        }
	});		
});	


$(document).on("pagecreate","#AREAS-PAGE", function(){
	$.ajax({
		type : 'GET',
		url : "/Area",
		success: function(response) {
			$("#listview-areas").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-areas").tmpl( response ).appendTo( "#listview-areas" );		
			$("#listview-areas").listview("refresh");
			
			APPLICATION.areas = response;
        }
	});		
});	




function loadEvents(callback){

	$.ajax({
		type : 'GET',
		url : "/Event",
		success: function(response) {
			
			
			$("#listview-events").empty();
			$("#template-events").tmpl( response ).appendTo( "#listview-events" );		
			$("#listview-events").listview("refresh");
			
			if(callback){
    			callback();
			}
			
			$('#listview-events li .delete-btn').on('touchend', function(e) {
			    e.preventDefault();
			    var _id = $(this).parents('li').attr("id");
			    $(this).parents('li').slideUp('fast', function() {
				    $(this).remove();
				    setTimeout(function() {
						$.ajax({
							type : 'DELETE',
							url : "/Event/"+_id,
							global: false,
					        error: UTILITY.httpError
						});
				    }, 0);
			    });
			});
			
        },
        error: UTILITY.httpError
	});	
} 



$(document).on("pagecreate","#EVENTS-PAGE", function(){

	  $(".events-wrapper").bind( {
		    iscroll_onpulldown : function(event, data){
		    	loadEvents(function(){
		    		data.iscrollview.refresh();
		    	});
		    }
		  });
	  
	loadEvents();
	
		
});




$(document).on("pagecreate","#REMOTE-CONTROL-PAGE", function(){

	$.ajax({
		type : 'GET',
		url : "/RemoteControl",
		success: function(response) {
			$("#listview-remote-controls").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-remote-controls").tmpl( response ).appendTo( "#listview-remote-controls" );		
			$("#listview-remote-controls").listview("refresh");
        },
        error: UTILITY.httpError
	});		
});

$(document).on("pagecreate","#EVENTS-PAGE", function(){
	


});