

$(document).on("pageshow","#HOME-PAGE", function(){
	socket.on('socket-lights', renderLights);	
});

$(document).on("pagehide","#HOME-PAGE", function(){
	socket.removeListener('socket-lights');	
});



var intervalBlink = null;
$(document).on("pagecreate","#HOME-PAGE", function(){

	
	$.ajax({
		type : 'GET',
		url : "/home-page",
		success: function(response) {

			var areas = response.areas;
			APPLICATION.areas = areas; 
			
			$("#controlgroup-alarm").html("");
			$("#template-controlgroup-alarm").tmpl( areas ).appendTo( "#controlgroup-alarm" );	
			$("#HOME-PAGE").trigger("create");
			
			
			renderLights(response.lights);
			
			
			$("#fsSecurity, #fsTemperatura, #fsIlluminazione").show();
			
			
			
        	$("#SENSORI-WIFI-PAGE").page();	
        	$("#SENSORI-PIR-PAGE").page();	
        	$("#AREAS-PAGE").page();

			
			
			$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").unbind("change").on("change", OnOffZone);
			
			var area = $.grep(areas, function(target, i) {	
				 return (target.alarmActivate.state);
			})[0];	
			if(area){
				
				 var obj = $("#HOME-PAGE h1 font");
				 intervalBlink = setInterval(function() {
		                if ($(obj).css("visibility") === "visible") {
		                    $(obj).css('visibility', 'hidden');
		                }
		                else {
		                    $(obj).css('visibility', 'visible');
		                    $(obj).css('color', 'red');
		                }
		            }, 800);					
			}				
			
        }
	});	
	
});	

function OnOffZone(){
	
	var id =  $(this).attr("id"); 
	var checked = $(this).prop("checked");
	var name = $(this).prop("name");
	
	if(UTILITY.iPhone || !checked || name !== "Allarme Totale"){
		internalFuntion(id,checked);
	}else {
		if(checked){
			UTILITY.countdown("Attivazione Allarme", 60, function() {
				internalFuntion(id,checked);
			});
		}
	}
	
	
	function internalFuntion(id,checked){
		
		$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").off("change");


		$("#HOME-PAGE #fsSecurity [data-role='flipswitch']").each(function( index, obj ) {
			if($(this).attr("id") !== id){
				$(this).prop('checked', false).flipswitch('refresh');
			}
		});	
		
		$.ajax({
			global: false,
			type: "PUT", url: "Area/isActivated/"+id,
			dataType : "json",
			data : { isActivated :  checked},
			success: function(response) {
				setTimeout(function() { $("#HOME-PAGE #fsSecurity [data-role='flipswitch']").unbind("change").on("change",OnOffZone); },10);	
				clearInterval(intervalBlink);
				$("#HOME-PAGE h1 font").css('visibility', 'hidden');
			},
			error: UTILITY.httpErrors
		});		
		
		

	}
	
	

	
}



function renderLights(response){

	var kWh=0;
	var cost=0; 
	
	$("#controlgroup-lights").empty();
	$.each(response, function (i, obj) { 
		obj.target = JSON.stringify(obj);
		kWh += obj.kWh;
		cost += obj.cost;
	});
	$("#template-lights").tmpl( response ).appendTo("#controlgroup-lights");
	

	$("#HOME-PAGE").trigger("create");
	
	$("#fsIlluminazione [data-role='flipswitch']").flipswitch( "refresh" );
	
	$("#HOME-PAGE h1 font").html(kWh.toFixed(2)+"kWh "+cost.toFixed(2)+"&euro;");
	$("#HOME-PAGE h1 font").css('visibility', 'visible');
	$("#HOME-PAGE h1 font").css('color', 'grey');
	
	$("#fsIlluminazione [data-role='flipswitch']").unbind("change").on("change", function (){
		var data = jQuery.parseJSON($(this).attr("data"));
		if($(this).prop("checked")){
			data.isOn = true;
			$(this).parent().parent().parent().find('img').attr("src","images/light_on.png");
		}else{
			data.isOn = false;
			$(this).parent().parent().parent().find('img').attr("src","images/light_off.png");
		}
		
		socket.emit('SOCKET-SWITHC-LIGHT', data);
		
	}); 
	
	
	
	
	
	//for tablet big img click
	$("#fsIlluminazione li").unbind("click").on("click", function (){
		var data = jQuery.parseJSON($(this).attr("data"));
		if(data.isOn === true){
			data.isOn = false;
			$(this).find('img').attr("src","images/light_off.png");
		}else{
			data.isOn = true;
			$(this).find('img').attr("src","images/light_on.png");
		}
		$(this).attr("data",JSON.stringify(data));
		
		socket.emit('SOCKET-SWITHC-LIGHT', data);
		
	}); 
	
	
	
	
}
