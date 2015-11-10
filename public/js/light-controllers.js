
$(function() {
	

	

	

	
	
	
});



function renderLightControlls(response){
	
	$("#listview-light-controllers").empty();
	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
	$("#template-light-controllers").tmpl( response ).appendTo( "#listview-light-controllers" );		
	$("#listview-light-controllers").listview("refresh");
	APPLICATION.lightControllers = response;	
	
	
	$.mobile.changePage("#LIGHT-CONTROLLERS-PAGE");
	$("#LIGHT-CONTROLLERS-PAGE").trigger("create");
	
	
}



function loadLightControlls(callback){
	$.ajax({
		type : 'GET',
		url : "/light-controllers",
		success: function(response) {
			renderLightControlls(response);
        }
	});		
}

$(document).on("pagecreate","#LIGHT-CONTROLLERS-PAGE", function(){
	
	loadLightControlls();
	socket.on('socket-light-controllers', renderLightControlls);		  
		  
});