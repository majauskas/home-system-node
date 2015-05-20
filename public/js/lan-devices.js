
$(function() {
	

//	$("#listview-wifi-sensors").on("click", "li", function (event) {
//		isAddedNewWifiSensors = false;
//		var data = jQuery.parseJSON($(this).attr("data"));
//		$('#EDIT-WIFI-SENSOR-PAGE #code').html(data.code);	
//		$('#EDIT-WIFI-SENSOR-PAGE #name').val(data.name);
//		$("#EDIT-WIFI-SENSOR-PAGE").attr("data", $(this).attr("data"));
//		
//		$.mobile.changePage("#EDIT-WIFI-SENSOR-PAGE");
//	});	
//
//	
//	
//	$("#EDIT-WIFI-SENSOR-PAGE").on("click", "#btWiFiSensorConferma", function (event) {
//
//		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
//		
//		
//		$.ajax({
//			global: false,
//			type:'PUT', url:"/WifiSensor",
//			dataType : "json",
//			data : {
//				binCode :  data.binCode,
//				code :  data.code,
//				name :  $.mobile.activePage.find('#name').val(),
//				date : new Date()
//			},			
//			success: function(response) {
//
//			
//				$("#SENSORI-WIFI-PAGE").page('destroy').page();	
//				$.mobile.changePage("#SENSORI-WIFI-PAGE");
//	
//	        }
//		});		
//
//	});	
//	
//	
//	
//	$("#EDIT-WIFI-SENSOR-PAGE").on("click", "#btWiFiSensorDelete", function (event) {
//
//		UTILITY.areYouSure("Elimina il sensore?", function() {
//
//			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
//			
//			$.ajax({
//				global: false,
//				type:'DELETE', url:"/WifiSensor",
//				dataType : "json",
//				data : {
//					code :  data.code
//				},			
//				success: function(response) {
//
//					$("#SENSORI-WIFI-PAGE").page('destroy').page();	
//					$("#HOME-PAGE").page('destroy').page();
//					$("#AREAS-PAGE").page('destroy').page();
//					$.mobile.changePage("#SENSORI-WIFI-PAGE");
//										
//					
//		        }
//			});				
//			
//		});
//	});		
//	
//	var isAddedNewWifiSensors = false;
//	$("#EDIT-WIFI-SENSOR-PAGE").on("click", "#btIndietro", function (event) {
//
//		if(isAddedNewWifiSensors){
//			$("#SENSORI-WIFI-PAGE").page('destroy').page();	
//		}
//		$.mobile.changePage("#SENSORI-WIFI-PAGE");		
//		
//	});	
	
	
});

//function renderListViewWiFiSensors(response){
//	
//	
//	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj);});
//	$("#listview-wifi-sensors").empty();
//	$("#template-wifi-sensors").tmpl( response ).appendTo( "#listview-wifi-sensors" );		
//	$("#listview-wifi-sensors").listview("refresh");
//	
//	APPLICATION.wifisensors = response;
//	
//	
//	
//	
//}



$(document).on("pagecreate","#LAN-DEVICE-PAGE", function(){
	
//	var st = Date.now();
	$.ajax({
		type : 'GET',
		url : "/LAN_DEVICE",
		success: function(response) {

			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj);});
			$("#listview-lan-devices").empty();
			$("#template-lan-devices").tmpl( response ).appendTo( "#listview-lan-devices" );		
			$("#listview-lan-devices").listview("refresh");
			
			
			
			$("#controlgroup-lan").empty();
//			$.each(data.pirsensors, function (i, obj) { obj.checked = data.activeSensors.contains(obj.code); });
			$("#template-controlgroup-lan").tmpl( response ).appendTo("#controlgroup-lan");
//			$("#listview-areas").listview("refresh");
//			$.mobile.changePage("#EDIT-AREA-PAGE");
//			$("#LAN-DEVICE-PAGE").trigger("create");			
			
        }
	});	
	  
});

