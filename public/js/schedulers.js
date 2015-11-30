
$(function() {

	$("#SCHEDULER-PAGE").on("click", "#btAddScheduler", function (event) {
		$("#EDIT-SCHEDULER-PAGE").removeAttr("data");
		$.mobile.changePage("#EDIT-SCHEDULER-PAGE");
	});	
	
	
	$("#EDIT-SCHEDULER-PAGE").on("click", "#btIndietro", function (event) {
		$.mobile.changePage("#SCHEDULER-PAGE");		
	});	
	
	
	$("#listview-schedulers").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-SCHEDULER-PAGE #name').val(data.name);
		$("#EDIT-SCHEDULER-PAGE").attr("data", $(this).attr("data"));
		
		try {$("#EDIT-SCHEDULER-PAGE").page('destroy').page();} catch (e) {}
		$.mobile.changePage("#EDIT-SCHEDULER-PAGE");
		
	});
	
	
	$("#EDIT-SCHEDULER-PAGE").on("click", "#btConferma", function (event) {
		
		var scheduler = jQuery.parseJSON($("#EDIT-SCHEDULER-PAGE").attr("data"));
		
		var name = $('#EDIT-SCHEDULER-PAGE #name').val();
		var cronMinute = $('#EDIT-SCHEDULER-PAGE #cmbCronMinute option:selected').val();
		var cronHour = $('#EDIT-SCHEDULER-PAGE #cmbCronHour option:selected').val();
		var cronDay = $('#EDIT-SCHEDULER-PAGE #cmbCronDay option:selected').val();
		var cronMonth = $('#EDIT-SCHEDULER-PAGE #cmbCronMonth option:selected').val();
		var cronWeekDay = $('#EDIT-SCHEDULER-PAGE #cmbCronWeekDay option:selected').val();
		var isEnabled = ($("#EDIT-SCHEDULER-PAGE [data-role='flipswitch']").prop("checked"))?true:false;

		
		scheduler.name = name;
		scheduler.cronExpression = cronMinute +" "+ cronHour +" "+ cronDay +" "+ cronMonth +" "+ cronWeekDay;
		scheduler.isEnabled = isEnabled;

		scheduler.commands = $.grep(scheduler.commands, function(obj, i) {
			 return (obj.code !== "" && obj.action !== "");
		});
		
		$.ajax({
			global: false,
			type: "PUT", url: "schedulers/"+scheduler._id,
			dataType : "json",
			data : scheduler,
			success: function(response) {

				$("#SCHEDULER-PAGE").page('destroy').page();
				$.mobile.changePage("#SCHEDULER-PAGE");
	        },
			error: UTILITY.httpError
		});		
		
		
	});
	

});



$(document).on("pagecreate","#SCHEDULER-PAGE", function(){
	$.ajax({
		type : 'GET',
		url : "/schedulers",
		success: function(response) {
			APPLICATION.schedulers = response;
			
			$("#listview-schedulers").empty();
			$.each(response, function (i, obj) { obj.target = JSON.stringify(obj); });
			$("#template-schedulers").tmpl( response ).appendTo( "#listview-schedulers" );		
			$("#listview-schedulers").listview("refresh");
			
        }
	});	
});

$(document).on("pagecreate","#EDIT-SCHEDULER-PAGE", function(){

	var data = $("#EDIT-SCHEDULER-PAGE").attr("data");
	if(data){
		data=jQuery.parseJSON(data);
		
		var cronExpression = data.cronExpression.split(" ");
		var cronMinute = cronExpression[0];
		var cronHour = cronExpression[1];
		var cronDay = cronExpression[2];
		var cronMonth = cronExpression[3];
		var cronWeekDay = cronExpression[4];
		
		
		$("#EDIT-SCHEDULER-PAGE [data-role='flipswitch']").prop('checked', data.isEnabled).flipswitch('refresh');
		$("#EDIT-SCHEDULER-PAGE #cmbCronMinute option[value='"+cronMinute+"']").attr("selected", "selected");
		$("#EDIT-SCHEDULER-PAGE #cmbCronHour option[value='"+cronHour+"']").attr("selected", "selected");
		$("#EDIT-SCHEDULER-PAGE #cmbCronDay option[value='"+cronDay+"']").attr("selected", "selected");
		$("#EDIT-SCHEDULER-PAGE #cmbCronMonth option[value='"+cronMonth+"']").attr("selected", "selected");
		$("#EDIT-SCHEDULER-PAGE #cmbCronWeekDay option[value='"+cronWeekDay+"']").attr("selected", "selected");
		
		$("#EDIT-SCHEDULER-PAGE select").selectmenu('refresh');		
		
		
	}else{
		data={commands:[]};
		
		
	}
	


	
	
	data.commands.push({type:"light", id: data.commands.length, code:"", action:""});
	
	$("#EDIT-SCHEDULER-PAGE").attr("data", JSON.stringify(data));
	
	$.ajax({
		type : 'GET',
		url : "/lights",
		success: function(lights) {
			APPLICATION.schedulerLights = lights;
		
			renderSchedulerCommands(data);

        }
	});		
});


function renderSchedulerCommands(data){
	
	var lights = APPLICATION.schedulerLights;
	
	$("#scheduler-device").empty();
	$("#template-scheduler-device").tmpl( data.commands ).appendTo( "#scheduler-device" );		

	$.each(data.commands, function (i, command) { 
		$.each(lights, function (i, light) { 
			$("#cmbDevice"+command.id).append('<option value="' + light.code + '">' +  light.name + '</option>');
		});
		$("#cmbDevice"+command.id+" option[value='"+command.code+"']").attr("selected", "selected");
		$("#cmbAction"+command.id+" option[value='"+command.action+"']").attr("selected", "selected");
				
		$("#imgCommand"+command.id).attr("src","images/light_"+((command.action==="on")?"on":"off")+".png");
		
	});	
	
	$("#EDIT-SCHEDULER-PAGE").trigger("create");
}


$(document).on("change","#EDIT-SCHEDULER-PAGE .cmbAction", function(){

	var data = jQuery.parseJSON($("#EDIT-SCHEDULER-PAGE").attr("data"));

	
	var value = $(this).val();
	var id = parseInt($(this).attr("index"));
	var deviceValue = $("#EDIT-SCHEDULER-PAGE #cmbDevice"+id).val();
	
	data.commands[id].action = value;

	
	if(!value && !deviceValue){
			data.commands = $.grep(data.commands, function(obj, i) {
				return (parseInt(obj.id) !== id);
			});	
			$.each(data.commands, function (i, obj) { obj.id = i; });
	}
	
	if(value && deviceValue){
		if(!data.commands[id+1]){
			data.commands.push({type:"light", id: id+1, code:"", action:""});
		}
	}
	renderSchedulerCommands(data);
	$("#EDIT-SCHEDULER-PAGE").attr("data", JSON.stringify(data));

});


$(document).on("change","#EDIT-SCHEDULER-PAGE .cmbDevice", function(){
	
	var data = jQuery.parseJSON($("#EDIT-SCHEDULER-PAGE").attr("data"));
	
	var value = $(this).val();
	var id = parseInt($(this).attr("index"));
	var actionValue = $("#EDIT-SCHEDULER-PAGE #cmbAction"+id).val();
	data.commands[id].code = value;
	

	if(!value && !actionValue){
		data.commands = $.grep(data.commands, function(obj, i) {
			return (parseInt(obj.id) !== id);
		});	
		$.each(data.commands, function (i, obj) { obj.id = i; });
	}

	if(value && actionValue){
		if(!data.commands[id+1]){
			data.commands.push({type:"light", id: id+1, code:"", action:""});
		}
	}
	
	
	renderSchedulerCommands(data);
	$("#EDIT-SCHEDULER-PAGE").attr("data", JSON.stringify(data));
	
});
