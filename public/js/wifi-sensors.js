
$(function() {
	
	$("#listview-wifi-sensors").on("click", "li", function (event) {
		isAddedNewWifiSensors = false;
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-WIFI-SENSOR-PAGE #code').html(data.code);	
		$('#EDIT-WIFI-SENSOR-PAGE #name').val(data.name);
		$("#EDIT-WIFI-SENSOR-PAGE").attr("data", $(this).attr("data"));
		
		$.mobile.changePage("#EDIT-WIFI-SENSOR-PAGE");
	});	


	
	
	$("#EDIT-WIFI-SENSOR-PAGE").on("click", "#btWiFiSensorConferma", function (event) {

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
	
	
	
	
	
	var isAddedNewWifiSensors = false;
	$("#EDIT-WIFI-SENSOR-PAGE").on("click", "#btIndietro", function (event) {

		if(isAddedNewWifiSensors){
			$("#SENSORI-WIFI-PAGE").page('destroy').page();	
		}
		$.mobile.changePage("#SENSORI-WIFI-PAGE");		
		
	});	
	
	
});





