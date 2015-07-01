
$(function() {

	$("#listview-lan-devices").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-LAN-DEVICE-PAGE #mac').html(data.mac);	
		$('#EDIT-LAN-DEVICE-PAGE #manufacturer').html(data.manufacturer);	
		$('#EDIT-LAN-DEVICE-PAGE #name').val(data.name);
		$('#EDIT-LAN-DEVICE-PAGE #nmapname').val(data.nmapname);
		$("#EDIT-LAN-DEVICE-PAGE").attr("data", $(this).attr("data"));

		
		var areas  = APPLICATION.areas;

		$("#autoonoff-area").empty();
		$.each(areas, function (i, obj) { obj.checked = obj.autoOnOff.lanDevices.contains(data.mac) });
		$("#template-autoonoff-area").tmpl( areas ).appendTo("#autoonoff-area");		
		
		$("#EDIT-LAN-DEVICE-PAGE").trigger("create");	
		
		
		$("#EDIT-LAN-DEVICE-PAGE [data-role='flipswitch']").unbind("change").on("change", function (){
			
			
			var id =  $(this).attr("id"); 
			
			var area = $.grep(areas, function(target, i) {	
				 return (target._id === id);
			})[0]
			
			if($(this).prop("checked")){
				area.autoOnOff.lanDevices.push(data.mac);
			}else{
				area.autoOnOff.lanDevices.splice(areas.autoOnOff.lanDevices.indexOf(data.mac), 1);
			}
			
			$.ajax({
				global: false,
				type: "PUT", url: "Area/autoOnOff/"+id,
				dataType : "json",
				data : { autoOnOff : area.autoOnOff },
				error: UTILITY.httpError
			});					
			
			
		});		
		
		
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
	
	
	$("#EDIT-LAN-DEVICE-PAGE").on("click", "#btIndietro", function (event) {
		$.mobile.changePage("#LAN-DEVICE-PAGE");		
	});		
	
});


function renderListViewLanDevices(response){
	$.each(response, function (i, obj) { 
		obj.target = JSON.stringify(obj);
		try {
			if(response[i+1] && response[i+1].exists === false && obj.exists === true){
				obj.divider = true;
			}			
		} catch (e) {}
	});
	
	$("#listview-lan-devices").empty();
	$("#template-lan-devices").tmpl( response ).appendTo( "#listview-lan-devices" );		
	$("#listview-lan-devices").listview("refresh");
	
	
}

$(document).on("pagecreate","#LAN-DEVICE-PAGE", function(){
	
	$.ajax({
		global: false,
		type : 'GET',
		url : "/LAN_DEVICE",
		success: function(response){
			renderListViewLanDevices(response);
			socket.on('SOCKET-LAN-DEVICES', renderListViewLanDevices);	
		}
	});	
	
	
	  
});

