
$(function() {


});





//function renderLights(response){
//
//	var kWh=0;
//	var cost=0; 
//	
//	$("#controlgroup-lights").empty();
//	$.each(response, function (i, obj) { 
//		obj.target = JSON.stringify(obj);
//		kWh += obj.kWh;
//		cost += obj.cost;
//	});
//	$("#template-lights").tmpl( response ).appendTo("#controlgroup-lights");
//	
//
//	$("#HOME-PAGE").trigger("create");
//	
//	$("#fsIlluminazione [data-role='flipswitch']").flipswitch( "refresh" );
//	
//	$("#HOME-PAGE h1 font").html(kWh.toFixed(2)+"kWh "+cost.toFixed(2)+"&euro;");
//	$("#HOME-PAGE h1 font").css('visibility', 'visible');
//	$("#HOME-PAGE h1 font").css('color', 'grey');
//	
//	$("#fsIlluminazione [data-role='flipswitch']").unbind("change").on("change", function (){
//		var data = jQuery.parseJSON($(this).attr("data"));
//		if($(this).prop("checked")){
//			data.isOn = true;
//			$(this).parent().parent().parent().find('img').attr("src","images/Light-Bulb-on.png");
//		}else{
//			data.isOn = false;
//			$(this).parent().parent().parent().find('img').attr("src","images/Light-Bulb-off.png");
//		}
//		
//		socket.emit('SOCKET-SWITHC-LIGHT', data);
//		
//	}); 
//	
//}


//$(document).on("pageshow","#HOME-PAGE", function(){
//	socket.on('socket-lights', renderLights);	
//});
//
//$(document).on("pagehide","#HOME-PAGE", function(){
//	socket.removeListener('socket-lights');	
//});


$(document).on("pagecreate","#SCHEDULER-PAGE", function(){
	$.ajax({
		type : 'GET',
		url : "/schedulers",
		success: function(response) {

			$("#listview-schedulers").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-schedulers").tmpl( response ).appendTo( "#listview-schedulers" );		
			$("#listview-schedulers").listview("refresh");
			
        }
	});	
});



