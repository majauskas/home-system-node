
$(function() {

	$("#listview-lan-devices").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-LAN-DEVICE-PAGE #mac').html(data.mac);	
		$('#EDIT-LAN-DEVICE-PAGE #manufacturer').html(data.manufacturer);	
		$('#EDIT-LAN-DEVICE-PAGE #name').val(data.name);
		$("#EDIT-LAN-DEVICE-PAGE").attr("data", $(this).attr("data"));
		
		$.mobile.changePage("#EDIT-LAN-DEVICE-PAGE");
	});	
	
	
	
	$("#EDIT-LAN-DEVICE-PAGE").on("click", "#btConferma", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		$.ajax({
			global: false,
			type:'PUT', url:"/LAN_DEVICE",
			dataType : "json",
			data : {
				mac :  data.mac,
				name :  $.mobile.activePage.find('#name').val()
			},			
			success: function(response) {
				$("#LAN-DEVICE-PAGE").page('destroy').page();	
				$.mobile.changePage("#LAN-DEVICE-PAGE");
	        }
		});		

	});	
	
	
	
	$("#EDIT-LAN-DEVICE-PAGE").on("click", "#btDelete", function (event) {

		UTILITY.areYouSure("Elimina il dispositivo?", function() {

			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
			
			$.ajax({
				global: false,
				type:'DELETE', url:"/LAN_DEVICE",
				dataType : "json",
				data : {
					mac :  data.mac
				},			
				success: function(response) {
					$("#LAN-DEVICE-PAGE").page('destroy').page();	
					$.mobile.changePage("#LAN-DEVICE-PAGE");
		        }
			});				
			
		});
	});		
	
	
});


function renderListViewLanDevices(response){
	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj);});
	$("#listview-lan-devices").empty();
	$("#template-lan-devices").tmpl( response ).appendTo( "#listview-lan-devices" );		
	$("#listview-lan-devices").listview("refresh");
}

$(document).on("pagecreate","#LAN-DEVICE-PAGE", function(){
	
	$.ajax({
		global: false,
		type : 'GET',
		url : "/LAN_DEVICE",
		success: renderListViewLanDevices
	});	
	
	socket.on('SOCKET-LAN-DEVICES', renderListViewLanDevices);	
	  
});

