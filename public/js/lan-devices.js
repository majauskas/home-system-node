
$(function() {
	
	
});




$(document).on("pagecreate","#LAN-DEVICE-PAGE", function(){
	
	$.ajax({
		global: false,
		type : 'GET',
		url : "/LAN_DEVICE",
		success: function(response) {

			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj);});
			$("#listview-lan-devices").empty();
			$("#template-lan-devices").tmpl( response ).appendTo( "#listview-lan-devices" );		
			$("#listview-lan-devices").listview("refresh");
			
			
			
        }
	});	
	  
});

