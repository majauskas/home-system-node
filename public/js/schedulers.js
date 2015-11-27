
$(function() {

	$("#SCHEDULER-PAGE").on("click", "#btAddScheduler", function (event) {
		$("#EDIT-SCHEDULER-PAGE").removeAttr("data");
		$.mobile.changePage("#EDIT-SCHEDULER-PAGE");
	});	
	
	
	$("#EDIT-SCHEDULER-PAGE").on("click", "#btIndietro", function (event) {
		$.mobile.changePage("#SCHEDULER-PAGE");		
	});	
	
	
	$("#EDIT-SCHEDULER-PAGE").on("click", "#btAddCommands", function (event) {
		$.mobile.changePage("#SCHEDULER-COMMAND");	
	});	
	

	$("#SCHEDULER-COMMAND").on("click", "#btConferma", function (event) {
		
//		var name =  $.mobile.activePage.find('#type').val();
		
		var type = $('#SCHEDULER-COMMAND #cmbDeviceType option:selected').val();
		var device = $('#SCHEDULER-COMMAND #cmbDevice option:selected').val();
		var cronMinute = $('#SCHEDULER-COMMAND #cmbCronMinute option:selected').val();
		var cronHour = $('#SCHEDULER-COMMAND #cmbCronHour option:selected').val();
		var cronDay = $('#SCHEDULER-COMMAND #cmbCronDay option:selected').val();
		var cronMonth = $('#SCHEDULER-COMMAND #cmbCronMonth option:selected').val();
		var cronWeekDay = $('#SCHEDULER-COMMAND #cmbCronWeekDay option:selected').val();
		var action = $('#SCHEDULER-COMMAND #cmbAction option:selected').val();

		var scheduler = {commands:[]};
		
//		
//		var code =  $(this).attr("code"); 
//		if($(this).prop("checked")){
//			data.lights.push(code);
//		}else{
//			data.lights.splice(data.lights.indexOf(code), 1);
//		}
//		
//		$.ajax({
//			global: false,
//			type: "PUT", url: "schedulers/commands/"+data._id,
//			dataType : "json",
//			data : { commands : data.commands },
//			success: function(response) {
//
//				$("#AREAS-PAGE").page('destroy').page();
//				$("#HOME-PAGE").page('destroy').page();
//				$.mobile.changePage("#AREAS-PAGE");
//	        },
//			error: UTILITY.httpError
//		});		
		
		
	});
	

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



