var APPLICATION = {};
var isActiveSearchWifiSensors = false;
var isActiveSearchRemoteControls = false;

$(function() {

	
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
			global: false,
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
	
	
	$("#AREAS-PAGE").on("click", "#btAddNewArea", function (event) {
		$("#NEW-AREA-PAGE").find('#name, #description').val("");
		$("#NEW-AREA-PAGE").removeAttr("data");
		$.mobile.changePage("#NEW-AREA-PAGE");
	});	
	
	
	$("#NEW-AREA-PAGE").on("click", "#btConferma", function (event) {

		$.ajax({
			global: false,
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
			global: false,
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

	$("#EDIT-AREA-PAGE").on("click", "#btDeleteArea", function (event) {

		UTILITY.areYouSure("Elimina la zona?", function() {
			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
			
			$.ajax({
				global: false,
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
		$('#EDIT-AREA-PAGE #name').val(data.name);
		$('#EDIT-AREA-PAGE #description').val(data.description);
		$("#EDIT-AREA-PAGE").attr("data", $(this).attr("data"));
		
		
		data.pirsensors = APPLICATION.pirsensors;
		data.wifisensors = APPLICATION.wifisensors;

		$("#controlgroup-pirsensors").empty();
		$.each(data.pirsensors, function (i, obj) { obj.checked = data.activeSensors.contains(obj.code); });
		$("#template-controlgroup-pirsensors").tmpl( data.pirsensors ).appendTo("#controlgroup-pirsensors");
		
		$("#controlgroup-wifisensors").empty();
		$.each(data.wifisensors, function (i, obj) { obj.checked = data.activeSensors.contains((obj.code)); });
		$("#template-controlgroup-wifisensors").tmpl( data.wifisensors ).appendTo("#controlgroup-wifisensors");		
		
		$.mobile.changePage("#EDIT-AREA-PAGE");
		$("#EDIT-AREA-PAGE").trigger("create");
		
		$("#EDIT-AREA-PAGE [data-role='flipswitch']").unbind("change").on("change", function (){
			
			var code =  $(this).attr("code"); 
			if($(this).prop("checked")){
				data.activeSensors.push(code);
			}else{
				data.activeSensors.splice(data.activeSensors.indexOf(code), 1);
			}
			
			$.ajax({
				global: false,
				type: "PUT", url: "Area/activeSensors/"+data._id,
				dataType : "json",
				data : { activeSensors : data.activeSensors },
				error: UTILITY.httpError
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
	
	
	
	
	$("#EDIT-REMOTE-CONTROL-PAGE").on("click", "#btIndietro", function (event) {

		console.log("isUpdatedRemoteControlArea: ",isUpdatedRemoteControlArea);
		if(isUpdatedRemoteControlArea){
			$("#REMOTE-CONTROL-PAGE").page('destroy').page();
		}
		$.mobile.changePage("#REMOTE-CONTROL-PAGE");		
		
	});	
	
	
	$("#listview-remote-controls").on("click", "li", function (event) {
		isUpdatedRemoteControlArea = false;
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-REMOTE-CONTROL-PAGE #code').html(data.code);	
		$('#EDIT-REMOTE-CONTROL-PAGE #name').val(data.name);
		
		$("#EDIT-REMOTE-CONTROL-PAGE").attr("data", $(this).attr("data"));
		
		data.areas = APPLICATION.areas;

		$("#controlgroup-areas").empty();
		$.each(data.areas, function (i, obj) { obj.checked = (data.activeArea === obj._id) ? true: false;});
		$("#template-controlgroup-areas").tmpl( data.areas ).appendTo("#controlgroup-areas");
		
		$.mobile.changePage("#EDIT-REMOTE-CONTROL-PAGE");
		$("#EDIT-REMOTE-CONTROL-PAGE").trigger("create");
		$("#EDIT-REMOTE-CONTROL-PAGE [data-role='flipswitch']").unbind("change").on("change", OnOffRemoteAreas);
		
		
	});	
	


	


	
	
	
	
	
	$("#EDIT-REMOTE-CONTROL-PAGE").on("click", "#btConfirm", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		
		var area = null;
		$.ajax({
			global: false,
			type: "PUT", 
			url: "/RemoteControl/"+data._id,
			dataType : "json",
			data : {
				name :  $.mobile.activePage.find('#name').val()
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
				global: false,
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
	
	
//-------------------------------------------------------------------------	
	
});

var isUpdatedRemoteControlArea;
function OnOffRemoteAreas(){
	isUpdatedRemoteControlArea = true;
	var data = jQuery.parseJSON($("#EDIT-REMOTE-CONTROL-PAGE").attr("data"));
	
	$("#EDIT-REMOTE-CONTROL-PAGE [data-role='flipswitch']").off("change");
	var id =  $(this).attr("id"); 

	$("#EDIT-REMOTE-CONTROL-PAGE [data-role='flipswitch']").each(function( index, obj ) {
		if($(this).attr("id") !== id){
			$(this).prop('checked', false).flipswitch('refresh');
		}
	});	
	
	var activeArea;
	var id =  $(this).attr("id"); 
	if($(this).prop("checked")){
		activeArea = id;
	}else{
		activeArea = null;
	}
	
	$.ajax({
		global: false,
		type: "PUT", url: "RemoteControl/activeArea/"+data._id,
		dataType : "json",
		data : { activeArea : activeArea },
		error: UTILITY.httpError
	});	
	
	setTimeout(function() { $("#EDIT-REMOTE-CONTROL-PAGE [data-role='flipswitch']").unbind("change").on("change",OnOffRemoteAreas); },10);	
	
}	


var socket = io.connect();

socket.on('SOCKET-CHANGE-ALARM-STATE', function (data) {
	
	UTILITY.areYouSurePopup();
	
	$("#"+data._id).prop('checked', data.isActivated).flipswitch('refresh');
	
});

socket.on('433MHZ', function (device) {
	
	
	if(isActiveSearchWifiSensors){
		isActiveSearchWifiSensors = false;
		
		$.ajax({
			global: false,
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
					UTILITY.alertPopup("", "Sensore: "+device.name+" ("+device.code+") � gia registrato..");	
				}
	        },
	        error: UTILITY.httpError
		});			
	} else if(isActiveSearchRemoteControls){
		isActiveSearchRemoteControls = false;
		$.ajax({
			global: false,
			type:'GET', url:"/RemoteControl/"+device.code+"/"+device.binCode,
			success: function(response) {
				
				var data = response.data;
				if(response.existing){
					UTILITY.alertPopup("", "Telecomando: "+data.name+" ("+data.code+") � gia registrato.."); 
				}else{
					isUpdatedRemoteControlArea = true;
					
					$('#EDIT-REMOTE-CONTROL-PAGE #code').html(data.code);
					$('#EDIT-REMOTE-CONTROL-PAGE #name').val("");
					$("#EDIT-REMOTE-CONTROL-PAGE").attr("data",JSON.stringify(data));
					
					data.areas = APPLICATION.areas;

					$("#controlgroup-areas").empty();
					$.each(data.areas, function (i, obj) { obj.checked = (data.activeArea === obj._id) ? true: false;});
					$("#template-controlgroup-areas").tmpl( data.areas ).appendTo("#controlgroup-areas");
					
					$.mobile.changePage("#EDIT-REMOTE-CONTROL-PAGE");
					$("#EDIT-REMOTE-CONTROL-PAGE").trigger("create");
					$("#EDIT-REMOTE-CONTROL-PAGE [data-role='flipswitch']").unbind("change").on("change", OnOffRemoteAreas);
					
				}
	        },
	        error: UTILITY.httpError
		});	
	}
	
});

socket.on('ALARM_DETECTION', function (device, areaId) {

	UTILITY.areYouSure("Sicurezza violata!<br>"+ device.name+"<br>Disattiva allarme?", function() {
		socket.emit('disarm', areaId);
	}, null,"Atenzione");
	
});


$(document).on("pagecreate","#HOME-PAGE", function(){
 
	$.ajax({
		type : 'GET',
		url : "/Area",
		success: function(response) {

			APPLICATION.areas = response; 
			
			if(response.length > 0){
				$("#fsSecurity").show();
			}
			
			$("#controlgroup-alarm").html("");
			$("#template-controlgroup-alarm").tmpl( response ).appendTo( "#controlgroup-alarm" );	
			$("#HOME-PAGE").trigger("create");
			
        	$("#SENSORI-WIFI-PAGE").page();	
        	$("#SENSORI-PIR-PAGE").page();	
        	$("#AREAS-PAGE").page();
			
			
			
			$("#HOME-PAGE [data-role='flipswitch']").unbind("change").on("change", OnOffZone);
			
			
        }
	});	
	

	
});	

function OnOffZone(){
	
	$("#HOME-PAGE [data-role='flipswitch']").off("change");

	var id =  $(this).attr("id"); 

	$("#HOME-PAGE [data-role='flipswitch']").each(function( index, obj ) {
		if($(this).attr("id") !== id){
			$(this).prop('checked', false).flipswitch('refresh');
		}
	});	
	
	$.ajax({
		global: false,
		type: "PUT", url: "Area/isActivated/"+id,
		dataType : "json",
		data : { isActivated :  $(this).prop("checked")},
		error: UTILITY.httpError
	});					
	
	setTimeout(function() { $("#HOME-PAGE [data-role='flipswitch']").unbind("change").on("change",OnOffZone); },10);	
	
}



function loadSensoriWiFi(callback){
	
	
	var st = Date.now();
	$.ajax({
		type : 'GET',
		url : "/WifiSensor",
		success: function(response) {
			var dur = Date.now() - st; 
			$("#SENSORI-WIFI-PAGE h1 font").html(dur+" ms");
			
			$("#listview-wifi-sensors").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-wifi-sensors").tmpl( response ).appendTo( "#listview-wifi-sensors" );		
			$("#listview-wifi-sensors").listview("refresh");
			
			APPLICATION.wifisensors = response;
			
			if(callback){ callback();}
        }
	});		
	
}


$(document).on("pagecreate","#SENSORI-WIFI-PAGE", function(){

	
	  $(this).find('.wrapper').bind( {
		    iscroll_onpulldown : function(event, data){
		    	loadSensoriWiFi(function(){
		    		data.iscrollview.refresh();
		    	});
		    }
	  });
	  
	  loadSensoriWiFi();
		  
});	









function loadAreas(callback){

	var st = Date.now();
	$.ajax({
		type : 'GET',
		url : "/Area",
		success: function(response) {
			
			var dur = Date.now() - st; 
			$("#AREAS-PAGE h1 font").html(dur+" ms");
			
			$("#listview-areas").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-areas").tmpl( response ).appendTo( "#listview-areas" );		
			$("#listview-areas").listview("refresh");
			
			APPLICATION.areas = response;
        }
	});	
	
}

$(document).on("pagecreate","#AREAS-PAGE", function(){

	  $(this).find('.wrapper').bind( {
		    iscroll_onpulldown : function(event, data){
		    	loadAreas(function(){
		    		data.iscrollview.refresh();
		    	});
		    }
	  });
	
	loadAreas();
});	




function loadEvents(callback){

	
	
	
	var st = Date.now();
	$.ajax({
		type : 'GET',
		url : "/Event",
		success: function(response) {
			var dur = Date.now() - st; 
			
			$("#EVENTS-PAGE h1 font").html(dur+" ms");
			
			$("#listview-events").empty();
			$("#template-events").tmpl( response ).appendTo( "#listview-events" );		
			$("#listview-events").listview("refresh");
			
			
			$('#listview-events li .delete-btn').on('touchend', function(e) {
			    e.preventDefault();
			    var _id = $(this).parents('li').attr("id");
			    $(this).parents('li').slideUp('fast', function() {
				    $(this).remove();
				    setTimeout(function() {
						$.ajax({
							global: false,
							type : 'DELETE',
							url : "/Event/"+_id,
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

		$(this).find('.wrapper').bind( {
		    iscroll_onpulldown : function(event, data){
		    	loadEvents(function(){
		    		data.iscrollview.refresh();
		    	});
		    }
	  });
	  
	loadEvents();
	
		
});


function loadRemoteControls(callback){
	var st = Date.now();
	$.ajax({
		type : 'GET',
		url : "/RemoteControl",
		success: function(response) {
			var dur = Date.now() - st; 
			$("#REMOTE-CONTROL-PAGE h1 font").html(dur+" ms");
			
			$("#listview-remote-controls").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-remote-controls").tmpl( response ).appendTo( "#listview-remote-controls" );		
			$("#listview-remote-controls").listview("refresh");
        },
        error: UTILITY.httpError
	});		
}

$(document).on("pagecreate","#REMOTE-CONTROL-PAGE", function(){

	$(this).find('.wrapper').bind( {
	    iscroll_onpulldown : function(event, data){
	    	loadRemoteControls(function(){
	    		data.iscrollview.refresh();
	    	});
	    }
  });
	
	loadRemoteControls();
});

