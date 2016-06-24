

$(document).on("pageshow","#HOME-PAGE", function(){
	
	socket.on('SOCKET-HOME-INFO', function (data) { 
		 var obj = $("#HOME-PAGE h1");
		 $(obj).text(data.msg);
		 var intervalBlink = setInterval(function() {
                if ($(obj).css("visibility") === "visible") {
                    $(obj).css('visibility', 'hidden');
                }
                else {
                    $(obj).css('visibility', 'visible');
                    $(obj).css('color', 'red');
                }
            }, 800);
		 
			$("#HOME-PAGE h1").unbind("click").on("click", function (){
				clearInterval(intervalBlink);
				var obj = $("#HOME-PAGE h1");
				$(obj).text("Home");
				$(obj).css('color', 'white');
			}); 
	});	
});


