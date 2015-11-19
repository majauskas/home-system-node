
$(function() {
	

	$("#LIGHT-CONTROLLERS-PAGE").on("click", "#btSearchLightControllers", function (event) {
		UTILITY.alertPopup(null, "Ricerca interruttori attivata.<br>Premi un tasto", function (event) {
			UTILITY.hideAlertPopup();
			socket.removeListener('SOCKET-ADD-LIGHT-CONTROLLER');	
		});
		socket.on('SOCKET-ADD-LIGHT-CONTROLLER', addLightController);	
	});		

	
	$("#EDIT-LIGHT-CONTROLLERS-PAGE").on("click", "#btIndietro", function (event) {
		$.mobile.changePage("#LIGHT-CONTROLLERS-PAGE");			
	});	
	
	
	
});



function renderLightControlls(response){
	

	$("#listview-light-controllers").empty();
	$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
	$("#template-light-controllers").tmpl( response ).appendTo( "#listview-light-controllers" );		
	$("#listview-light-controllers").listview("refresh");
	
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
});



function addLightController(data, updatedExisting){
	
	socket.removeListener('SOCKET-ADD-LIGHT-CONTROLLER');	
	
	if(updatedExisting){
		UTILITY.alertPopup("", "Interruttore: "+data.code+" è gia registrato"); 
		return;
	}
	
	console.log("new Controller: ", data);
	
	
	$('#EDIT-LIGHT-CONTROLLERS-PAGE #code').html(data.code);
	$('#EDIT-LIGHT-CONTROLLERS-PAGE #name').val(data.name);
	$("#EDIT-LIGHT-CONTROLLERS-PAGE").attr("data",JSON.stringify(data));
	
	$.mobile.changePage("#EDIT-LIGHT-CONTROLLERS-PAGE");
	
	
//	data.areas = APPLICATION.areas;
//
//	$("#controlgroup-areas").empty();
//	$.each(data.areas, function (i, obj) { obj.checked = (data.activeArea === obj._id) ? true: false;});
//	$("#template-controlgroup-areas").tmpl( data.areas ).appendTo("#controlgroup-areas");
//	
	
//	$("#EDIT-LIGHT-CONTROLLERS-PAGE").trigger("create");
//	$("#EDIT-LIGHT-CONTROLLERS-PAGE [data-role='flipswitch']").unbind("change").on("change", OnOffRemoteAreas);
	
	
}







