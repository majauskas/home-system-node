
$(function() {


});


function renderLights(response){
	

	$("#controlgroup-lights").empty();
	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
	$("#template-lights").tmpl( response ).appendTo("#controlgroup-lights");


	$("#LIGHTS-PAGE").trigger("create");


	$("#LIGHTS-PAGE [data-role='flipswitch']").unbind("change").on("change", function (){
		console.log($(this).attr("data"));
		var data = jQuery.parseJSON($(this).attr("data"));
		console.log(data);
		if($(this).prop("checked")){
			data.isOn = true;
		}else{
			data.isOn = false;
		}
		socket.emit('SOCKET-SWITHC-LIGHT', data);
	}); 
	
}



$(document).on("pagecreate","#LIGHTS-PAGE", function(){
	renderLights(APPLICATION.lights);
});

$(document).on("pageshow","#LIGHTS-PAGE", function(){
//	$.ajax({
//		type : 'GET',
//		url : "/lights",
//		success: function(response) {
//			APPLICATION.lights = response;
//			renderLights(response);
//	    }
//	});
	socket.on('socket-lights', renderLights);	
});
$(document).on("pagehide","#LIGHTS-PAGE", function(){
	socket.removeListener('socket-lights');	
});


$(document).on("pagecreate","#HOME-PAGE", function(){
	$.ajax({
		type : 'GET',
		url : "/lights",
		success: function(response) {
			APPLICATION.lights = response;
        }
	});	
});

