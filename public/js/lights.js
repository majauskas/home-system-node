
$(function() {


});


//function renderLights(response, isHomePage){
//	
//	APPLICATION.lights = response;
//
//	var activePage = $.mobile.activePage.attr("id");
//	
//	
//	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
//	
//
//	$("#HOME-PAGE #controlgroup-lights").empty();
//	$("#HOME-PAGE #template-lights").tmpl( response ).appendTo("#controlgroup-lights");
//	
//	if(isHomePage){
//		console.log("#HOME-PAGE");
//
//	} else {
//		console.log("#LIGHTS-PAGE");
//		$("#LIGHTS-PAGE #controlgroup-lights-2").empty();
//		$("#LIGHTS-PAGE #template-lights-2").tmpl( response ).appendTo("#controlgroup-lights-2");
//		$("#LIGHTS-PAGE").trigger("create");
//
//	}
//	
//
//
//	$("#LIGHTS-PAGE [data-role='flipswitch']").unbind("change").on("change", function (){
//		var data = jQuery.parseJSON($(this).attr("data"));
//		console.log(data);
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
//		$("#HOME-PAGE #controlgroup-lights").empty();
//		$("#HOME-PAGE #template-lights").tmpl( response ).appendTo("#controlgroup-lights");
//
////		$("#HOME-PAGE").trigger("create");
//		$("#HOME-PAGE").page('destroy').page();
//	}); 
//
//	
//	$("#HOME-PAGE [data-role='flipswitch']").unbind("change").on("change", function (){
//		var data = jQuery.parseJSON($(this).attr("data"));
//		console.log(data);
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
//		
//	}); 
//	
//}



//$(document).on("pagecreate","#LIGHTS-PAGE", function(){
//	renderLights(APPLICATION.lights);
//});
//
//$(document).on("pageshow","#LIGHTS-PAGE", function(){
//	socket.on('socket-lights', renderLights);	
//});
//
//$(document).on("pagehide","#LIGHTS-PAGE", function(){
//	socket.removeListener('socket-lights');	
//});









function renderLights(response){

	$("#controlgroup-lights").empty();
	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
	$("#template-lights").tmpl( response ).appendTo("#controlgroup-lights");
	
	$("#HOME-PAGE").trigger("create");
	
	$("#fsIlluminazione [data-role='flipswitch']").flipswitch( "refresh" );
	
	
	$("#fsIlluminazione [data-role='flipswitch']").unbind("change").on("change", function (){
		var data = jQuery.parseJSON($(this).attr("data"));
		if($(this).prop("checked")){
			data.isOn = true;
			$(this).parent().parent().parent().find('img').attr("src","images/Light-Bulb-on.png");
		}else{
			data.isOn = false;
			$(this).parent().parent().parent().find('img').attr("src","images/Light-Bulb-off.png");
		}
		
		socket.emit('SOCKET-SWITHC-LIGHT', data);
		
	}); 
	
}


$(document).on("pageshow","#HOME-PAGE", function(){
	socket.on('socket-lights', renderLights);	
});

$(document).on("pagehide","#HOME-PAGE", function(){
	socket.removeListener('socket-lights');	
});


$(document).on("pagecreate","#HOME-PAGE", function(){
	$.ajax({
		type : 'GET',
		url : "/lights",
		success: function(response) {
			APPLICATION.lights = response;
			renderLights(response);
        }
	});	
});

