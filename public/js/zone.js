
$(function() {
	

	
	$("#listview-areas").on("click", "li", function (event) {
		
		var data = jQuery.parseJSON($(this).attr("data"));
		$('#EDIT-AREA-PAGE #name').val(data.name);
		$("#EDIT-AREA-PAGE").attr("data", $(this).attr("data"));
		
		
		data.pirsensors = APPLICATION.pirsensors;
		data.wifisensors = APPLICATION.wifisensors;

		$("#controlgroup-pirsensors").empty();
		$.each(data.pirsensors, function (i, obj) { obj.checked = data.activeSensors.contains(obj.code); });
		$("#template-controlgroup-pirsensors").tmpl( data.pirsensors ).appendTo("#controlgroup-pirsensors");
		
		$("#controlgroup-wifisensors").empty();
		$.each(data.wifisensors, function (i, obj) { obj.checked = data.activeSensors.contains((obj.code)); });
		$("#template-controlgroup-wifisensors").tmpl( data.wifisensors ).appendTo("#controlgroup-wifisensors");		
		
		$.mobile.changePage("#EDIT-AREA-PAGE");
		$("#EDIT-AREA-PAGE").trigger("create");
		
		$("#EDIT-AREA-PAGE [data-role='flipswitch']").unbind("change").on("change", function (){
			
			var code =  $(this).attr("code"); 
			if($(this).prop("checked")){
				data.activeSensors.push(code);
			}else{
				data.activeSensors.splice(data.activeSensors.indexOf(code), 1);
			}
			
			$.ajax({
				global: false,
				type: "PUT", url: "Area/activeSensors/"+data._id,
				dataType : "json",
				data : { activeSensors : data.activeSensors },
				error: UTILITY.httpError
			});					
			
			
		});
		

		
		var data = jQuery.parseJSON($("#EDIT-AREA-PAGE").attr("data"));
		
		data.schedulers.push({id:data.schedulers.length, daysOfWeek:"", from:"", to:""});
		
//		$("#EDIT-AREA-PAGE").attr("data", JSON.stringify(data));
		$("#scheduler-area").empty();
		
		$("#template-scheduler-area").tmpl( data.schedulers ).appendTo( "#scheduler-area" );		
		$.each(data.schedulers, function (i, obj) { 
			$("#cmbScheduler"+obj.id+" option[value='"+obj.daysOfWeek+"']").attr("selected", "selected");
		});	

		
		
		
		//-------------------------- auto On/Off --------------------------------------
		
		data.auto_on_off = data.auto_on_off || {};
		data.auto_on_off.lan_devices = data.auto_on_off.lan_devices || [];
		data.auto_on_off.lan_devices.push({id:data.auto_on_off.lan_devices.length, mac:""});
		
		$("#auto-on-off-area").empty();
		$("#template-auto-on-off-area").tmpl( data.auto_on_off.lan_devices ).appendTo( "#auto-on-off-area" );
		$("#EDIT-AREA-PAGE").trigger("create");	
		
		
		
		$.ajax({
			global: false,
			type : 'GET',
			url : "/LAN_DEVICE",
			success: function(response){
				APPLICATION.lan_devices = response;
				
				$.each(data.auto_on_off.lan_devices, function (i, target) { 
					
					$.each(APPLICATION.lan_devices, function (n, obj) { 
						$("#cmbAutoOnOff"+i).append('<option value="' + obj.mac + '">' +  obj.name + '</option>');
					});	
					$("#cmbAutoOnOff"+i+" option[value='"+target.mac+"']").attr("selected", "selected");
					$("#cmbAutoOnOff"+i).selectmenu('refresh');				
				});	
				
			}
		});		
		
		
		
		
//		$.each(data.auto_on_off.lan_devices, function (i, obj) { 
//			$("#cmbScheduler"+obj.id+" option[value='"+obj.daysOfWeek+"']").attr("selected", "selected");
//		});	
		

		
			
		
		$("#EDIT-AREA-PAGE").attr("data", JSON.stringify(data));
		
			
		
	});	
	
	
});


$(document).on("change","#EDIT-AREA-PAGE .cmbAutoOnOff", function(){
	
	function render(data){
		
		$("#EDIT-AREA-PAGE").attr("data", JSON.stringify(data));
		
		$("#auto-on-off-area").empty();
		$("#template-auto-on-off-area").tmpl( data.auto_on_off.lan_devices ).appendTo( "#auto-on-off-area" );		
		$("#EDIT-AREA-PAGE").trigger("create");
		

		
		$.each(data.auto_on_off.lan_devices, function (i, target) { 
			
			$.each(APPLICATION.lan_devices, function (n, obj) { 
				$("#cmbAutoOnOff"+i).append('<option value="' + obj.mac + '">' +  obj.name + '</option>');
			});	
			$("#cmbAutoOnOff"+i+" option[value='"+target.mac+"']").attr("selected", "selected");
			$("#cmbAutoOnOff"+i).selectmenu('refresh');				
		});		
		
//		$.each(data.auto_on_off.lan_devices, function (i, obj) { 
//			$("#cmbAutoOnOff"+obj.id+" option[value='"+obj.mac+"']").attr("selected", "selected");
//		});	
//		
		
		data.auto_on_off.lan_devices = $.grep(data.auto_on_off.lan_devices, function(obj, i) {
			 return (obj.mac !== "");
		});
		
		
		
		$.ajax({
			global: false,
			type: "PUT", url: "Area/autoOnOff/"+data._id,
			dataType : "json",
			data : { auto_on_off : data.auto_on_off },
			error: UTILITY.httpError
		});			
		
		
	}	
	
	
	
	var data = jQuery.parseJSON($("#EDIT-AREA-PAGE").attr("data"));

//	var parent =  $(this).parent().parent().parent().parent();
	var cmbAutoOnOffValue = $(this).val();
//	var from = parent.find('.inFrom').val();
//	var to = parent.find('.inTo').val();
	var id = parseInt($(this).attr("index"));

	
	if(cmbAutoOnOffValue === "delete"){
		UTILITY.areYouSure("Elimina il dispositivo?", function() {
			data.auto_on_off.lan_devices = $.grep(data.auto_on_off.lan_devices, function(obj, i) {
				 return (parseInt(obj.id) !== id);
			});
			$.each(data.auto_on_off.lan_devices, function (i, obj) { obj.id = i; });
			
			render(data);
		});
		return;
	}
	data.auto_on_off.lan_devices[id] = {id:id, mac:cmbAutoOnOffValue};
	if(!data.auto_on_off.lan_devices[id+1]){
		data.auto_on_off.lan_devices.push({id:id+1, mac:""});
	}
	

	
	render(data);

	
});	