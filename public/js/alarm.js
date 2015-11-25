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
	


	
	
	
	
	$("#AREAS-PAGE").on("click", "#btAddNewArea", function (event) {
		$("#NEW-AREA-PAGE").find('#name').val("");
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
				name :  $.mobile.activePage.find('#name').val()
			},
			error: UTILITY.httpError,
			success: function(response) {

				$("#AREAS-PAGE").page('destroy').page();
				$("#HOME-PAGE").page('destroy').page();
				$.mobile.changePage("#AREAS-PAGE");
	        }
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
	
	UTILITY.hideAreYouSurePopup();
	
	$("#"+data._id).prop('checked', data.isActivated).flipswitch('refresh');
	
});



socket.on('LIGHTS', function (data) {
	
	$("#chLightStudio").prop('checked', data[0].isOn).flipswitch('refresh');
	
});


socket.on('SOCKET-WARNING-MSG', function (msg) {
	UTILITY.alertPopup("Attenzione", msg);	
});

socket.on('433MHZ', function (device) {
	
	
	if(isActiveSearchWifiSensors){
		isActiveSearchWifiSensors = false;
		isAddedNewWifiSensors = false;
		
		$.ajax({
			global: false,
			type:'GET', url:"/WifiSensor/"+device.code+"/"+device.binCode,		
			success: function(response) {

				var data = response.data;
				if(response.existing){
					UTILITY.alertPopup("", "Sensore: "+device.name+" ("+device.code+") � gia registrato..");
				}else{
					isAddedNewWifiSensors = true;
					$('#EDIT-WIFI-SENSOR-PAGE #code').html(data.code);
					$('#EDIT-WIFI-SENSOR-PAGE #name').val("");
					$("#EDIT-WIFI-SENSOR-PAGE").attr("data",JSON.stringify(data));
					$.mobile.changePage("#EDIT-WIFI-SENSOR-PAGE");
					
					setTimeout(function() {
						$("#SENSORI-WIFI-PAGE").page('destroy').page();	
					}, 1000);
				
					
				}				
	        },
	        error: UTILITY.httpError
		});			
		
		
	} else if(isActiveSearchRemoteControls){
		isActiveSearchRemoteControls = false;
		isUpdatedRemoteControlArea = false;
		$.ajax({
			global: false,
			type:'GET', url:"/RemoteControl/"+device.code+"/"+device.binCode,
			success: function(response) {
				
				var data = response.data;
				if(response.existing){
					UTILITY.alertPopup("", "Telecomando: "+data.name+" ("+data.code+") è gia registrato"); 
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

function AlarmDetection (device, areaId){
	UTILITY.areYouSure("Sicurezza violata!<br>"+ device.name+"<br>Disattiva allarme?", function() {
		socket.emit('disarm', areaId);
	}, null,"Atenzione");
}


socket.on('ALARM_DETECTION', AlarmDetection);

//var intervalBlink = null;
//$(document).on("pagecreate","#HOME-PAGE", function(){
//
//	
//	$.ajax({
//		type : 'GET',
//		url : "/home-page",
//		success: function(response) {
//
//			var areas = response.areas;
//			APPLICATION.areas = areas; 
//			
//			if(areas.length > 0){
//				$("#fsSecurity, #fsTemperatura").show();
//			}
//			
//			$("#controlgroup-alarm").html("");
//			$("#template-controlgroup-alarm").tmpl( areas ).appendTo( "#controlgroup-alarm" );	
//			$("#HOME-PAGE").trigger("create");
//			
//        	$("#SENSORI-WIFI-PAGE").page();	
//        	$("#SENSORI-PIR-PAGE").page();	
//        	$("#AREAS-PAGE").page();
//
//			
//			
//			$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").unbind("change").on("change", OnOffZone);
//			
//				var area = $.grep(areas, function(target, i) {	
//					 return (target.alarmActivate.state);
//				})[0];	
//				if(area){
//					
//					 var obj = $("#HOME-PAGE h1 font");
//					 intervalBlink = setInterval(function() {
//			                if ($(obj).css("visibility") === "visible") {
//			                    $(obj).css('visibility', 'hidden');
//			                }
//			                else {
//			                    $(obj).css('visibility', 'visible');
//			                    $(obj).css('color', 'red');
//			                }
//			            }, 800);					
//					
//				}				
//
//			
//        }
//	});	
//	
//});	
//
//function OnOffZone(){
//	
//	$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").off("change");
//
//	var id =  $(this).attr("id"); 
//
//	$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").each(function( index, obj ) {
//		if($(this).attr("id") !== id){
//			$(this).prop('checked', false).flipswitch('refresh');
//		}
//	});	
//	
//	$.ajax({
//		global: false,
//		type: "PUT", url: "Area/isActivated/"+id,
//		dataType : "json",
//		data : { isActivated :  $(this).prop("checked")},
//		error: UTILITY.httpError
//	});					
//	
//	setTimeout(function() { $("#HOME-PAGE #fsSecurity [data-role='flipswitch']").unbind("change").on("change",OnOffZone); },10);	
//	clearInterval(intervalBlink);
//	$("#HOME-PAGE h1 font").css('visibility', 'hidden');
//	
//}
//
//





function renderAreasPage(response){
	
	$("#listview-areas").empty();
	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
	$("#template-areas").tmpl( response ).appendTo( "#listview-areas" );		
	$("#listview-areas").listview("refresh");
	
}

$(document).on("pagecreate","#AREAS-PAGE", function(){
	
	if($.mobile.activePage.attr("id") === "EDIT-AREA-PAGE"){

		$.ajax({
			type : 'GET',
			url : "/Area",
			success: renderAreasPage
		});
		
	}else{
		renderAreasPage(APPLICATION.areas);
	}
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





