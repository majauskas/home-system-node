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

	
	
	$("#EDIT-AREA-PAGE").on("click", "#btConferma", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		$.ajax({
			global: false,
			type: "PUT", 
			url: "/Area/"+data._id,
			dataType : "json",
			data : {
				name :  $.mobile.activePage.find('#name').val()
			},
			error: UTILITY.httpError,
			success: function(response) {

				data.schedulers = $.grep(data.schedulers, function(obj, i) {
					 return (obj.to !== "");
				});
				$.ajax({
					global: false,
					type: "PUT", url: "Area/schedulers/"+data._id,
					dataType : "json",
					data : { schedulers : data.schedulers },
					error: UTILITY.httpError
				});					
				
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
	


	

	

	
	$("#listview-areas").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-AREA-PAGE #name').val(data.name);
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
		

		
		var data = jQuery.parseJSON($("#EDIT-AREA-PAGE").attr("data"));
		
		data.schedulers.push({id:data.schedulers.length, daysOfWeek:"", from:"", to:""});
		
		$("#EDIT-AREA-PAGE").attr("data", JSON.stringify(data));
		$("#scheduler-area, #autoonoff-area").empty();
		
		$("#template-scheduler-area").tmpl( data.schedulers ).appendTo( "#scheduler-area" );		
		$.each(data.schedulers, function (i, obj) { 
			$("#cmbScheduler"+obj.id+" option[value='"+obj.daysOfWeek+"']").attr("selected", "selected");
		});	

		
		$("#EDIT-AREA-PAGE").trigger("create");		
		
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
	
	UTILITY.hideAreYouSurePopup();
	
	$("#"+data._id).prop('checked', data.isActivated).flipswitch('refresh');
	
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
					UTILITY.alertPopup("", "Sensore: "+device.name+" ("+device.code+") è gia registrato..");
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
					UTILITY.alertPopup("", "Telecomando: "+data.name+" ("+data.code+") ï¿½ gia registrato.."); 
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

//socket.on('ALARM_DETECTION', function (device, areaId) {
//	UTILITY.areYouSure("Sicurezza violata!<br>"+ device.name+"<br>Disattiva allarme?", function() {
//		socket.emit('disarm', areaId);
//	}, null,"Atenzione");
//});

socket.on('ALARM_DETECTION', AlarmDetection);

var intervalBlink = null;
$(document).on("pagecreate","#HOME-PAGE", function(){
 
	
	$.ajax({
		type : 'GET',
		url : "/Area",
		success: function(response) {

			APPLICATION.areas = response; 
			
			if(response.length > 0){
				$("#fsSecurity, #fsIlluminazione, #fsTemperatura").show();
			}
			
			$("#controlgroup-alarm").html("");
			$("#template-controlgroup-alarm").tmpl( response ).appendTo( "#controlgroup-alarm" );	
			$("#HOME-PAGE").trigger("create");
			
        	$("#SENSORI-WIFI-PAGE").page();	
        	$("#SENSORI-PIR-PAGE").page();	
        	$("#AREAS-PAGE").page();
			
			
			
			$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").unbind("change").on("change", OnOffZone);
			
				var area = $.grep(response, function(target, i) {	
					 return (target.alarmActivate.state);
				})[0];	
				if(area){
					
					 var obj = $("#HOME-PAGE h1 font");
					 intervalBlink = setInterval(function() {
			                if ($(obj).css("visibility") === "visible") {
			                    $(obj).css('visibility', 'hidden');
			                }
			                else {
			                    $(obj).css('visibility', 'visible');
			                }
			            }, 800);					
					
				}				
			
			
			$("#HOME-PAGE #fsIlluminazione [data-role='flipswitch']").unbind("change").on("change", function (){
				if($(this).prop("checked")){
					$(this).parent().parent().parent().find('img').attr("src","images/Light-Bulb-on.png");
				}else{
					$(this).parent().parent().parent().find('img').attr("src","images/Light-Bulb-off.png");
				}
			});
			
			
        }
	});	
	

	
});	

function OnOffZone(){
	
	$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").off("change");

	var id =  $(this).attr("id"); 

	$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").each(function( index, obj ) {
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
	
	setTimeout(function() { $("#HOME-PAGE #fsSecurity [data-role='flipswitch']").unbind("change").on("change",OnOffZone); },10);	
	clearInterval(intervalBlink);
	$("#HOME-PAGE h1 font").css('visibility', 'hidden');
	
}







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

$(document).on("change","#EDIT-AREA-PAGE .inFrom, .inTo", function(){

	var data = jQuery.parseJSON($("#EDIT-AREA-PAGE").attr("data"));
	
	var parent =  $(this).parent().parent().parent();
	var daysOfWeek = parent.find('.cmbScheduler option:selected').val();
	var from = parent.find('.inFrom').val();
	var to = parent.find('.inTo').val();
	var id = parseInt($(this).attr("index"));
	
	if(daysOfWeek && from && to){
		data.schedulers[id] = {id:id, daysOfWeek:daysOfWeek, from:from, to:to};
		$("#EDIT-AREA-PAGE").attr("data", JSON.stringify(data));
	}
});

$(document).on("change","#EDIT-AREA-PAGE .cmbScheduler", function(){
	
	function renderscheduler(data){
		
		$("#EDIT-AREA-PAGE").attr("data", JSON.stringify(data));
		$("#scheduler-area").empty();
		$("#template-scheduler-area").tmpl( data.schedulers ).appendTo( "#scheduler-area" );		

		$.each(data.schedulers, function (i, obj) { 
			$("#cmbScheduler"+obj.id+" option[value='"+obj.daysOfWeek+"']").attr("selected", "selected");
		});	
		$("#EDIT-AREA-PAGE").trigger("create");
		
		data.schedulers = $.grep(data.schedulers, function(obj, i) {
			 return (obj.to !== "");
		});
		
		$.ajax({
			global: false,
			type: "PUT", url: "Area/schedulers/"+data._id,
			dataType : "json",
			data : { schedulers : data.schedulers },
			error: UTILITY.httpError
		});		
		
	}	
	
	
	
	var data = jQuery.parseJSON($("#EDIT-AREA-PAGE").attr("data"));

	var parent =  $(this).parent().parent().parent().parent();
	var daysOfWeek = $(this).val();
	var from = parent.find('.inFrom').val();
	var to = parent.find('.inTo').val();
	var id = parseInt($(this).attr("index"));

	
	if(daysOfWeek === "delete"){
		UTILITY.areYouSure("Elimina la schedulazione?", function() {
			data.schedulers = $.grep(data.schedulers, function(obj, i) {
				 return (parseInt(obj.id) !== id);
			});
			$.each(data.schedulers, function (i, obj) { obj.id = i; });
			
			renderscheduler(data);
		});
		return;
	}
	
	data.schedulers[id] = {id:id, daysOfWeek:daysOfWeek, from:from, to:to};
	if(!data.schedulers[id+1]){
		data.schedulers.push({id:id+1, daysOfWeek:"", from:"", to:""});
	}
	
	renderscheduler(data);

	
});	

