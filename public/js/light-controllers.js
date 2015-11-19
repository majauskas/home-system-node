
$(function() {

	$("#listview-light-controllers").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		
		$('#EDIT-LIGHT-CONTROLLERS-PAGE #code').html(data.code);
		$('#EDIT-LIGHT-CONTROLLERS-PAGE #name').val(data.name);
		$("#EDIT-LIGHT-CONTROLLERS-PAGE").attr("data",JSON.stringify(data));
		
		var allLights = APPLICATION.lights;

		$("#controlgroup-controller-lights").empty();
		$.each(allLights, function (i, obj) { obj.checked = data.lights.contains(obj.code); });
		$("#template-controller-lights").tmpl( allLights ).appendTo("#controlgroup-controller-lights");
    
    
		$.mobile.changePage("#EDIT-LIGHT-CONTROLLERS-PAGE");
		$("#EDIT-LIGHT-CONTROLLERS-PAGE").trigger("create");
    
    
    
		$("#EDIT-LIGHT-CONTROLLERS-PAGE [data-role='flipswitch']").unbind("change").on("change", function (){
			
			var code =  $(this).attr("code"); 
			if($(this).prop("checked")){
				data.lights.push(code);
			}else{
				data.lights.splice(data.lights.indexOf(code), 1);
			}
			
			$.ajax({
				global: false,
				type: "PUT", url: "light-controllers/lights/"+data._id,
				dataType : "json",
				data : { lights : data.lights },
				error: UTILITY.httpError
			});					
			
			
		}); 
		
	});	


	$("#EDIT-LIGHT-CONTROLLERS-PAGE").on("click", "#btConfirm", function (event) {

		var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
		
		var area = null;
		$.ajax({
			global: false,
			type: "PUT", 
			url: "/light-controllers/"+data._id,
			dataType : "json",
			data : {
				name :  $.mobile.activePage.find('#name').val()
			},
			error: UTILITY.httpError,
			success: function(response) {
				$("#LIGHT-CONTROLLERS-PAGE").page('destroy').page();
				$.mobile.changePage("#LIGHT-CONTROLLERS-PAGE");
	        }
		});				
	});	

	$("#EDIT-LIGHT-CONTROLLERS-PAGE").on("click", "#btDelete", function (event) {

		UTILITY.areYouSure("Are You Sure?", function() {
			var data = jQuery.parseJSON($.mobile.activePage.attr("data"));
			
			$.ajax({
				global: false,
				type: "DELETE", 
				url: "/light-controllers/"+data._id,
				error: UTILITY.httpError,
				success: function(response) {
					$("#LIGHT-CONTROLLERS-PAGE").page('destroy').page();
					$.mobile.changePage("#LIGHT-CONTROLLERS-PAGE");
		        }
			});	
		});
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

$(document).on("pageshow","#LIGHT-CONTROLLERS-PAGE", function(){
	socket.on('socket-add-light-controller', renderLightControlls);	
});
$(document).on("pagehide","#LIGHT-CONTROLLERS-PAGE", function(){
	socket.removeListener('socket-add-light-controller');	
});


