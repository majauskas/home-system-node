var UTILITY = new initutil();function initutil() {

    this.showLoading = function(msg) {
    	$('#block-popup').remove();
    	var page = $.mobile.activePage;
    	var popup = $('<div id="block-popup" data-role="popup" data-dismissible="false" data-theme="c" data-shadow="true" data-overlay-theme="a"></div>').appendTo( page );
    	popup.popup();
    	page.page('destroy').page();		
    	$('#block-popup').popup("open");
    	
    	$.mobile.loading( 'show', {text: msg,textVisible: true});
    	//setTimeout(function() {$.mobile.loading( 'show', {text: msg,textVisible: true});},100);	
    };
    
    this.hideLoading = function() {
    	$('#block-popup').remove();
    	$.mobile.loading( 'hide'); 
    };  
    
    
    this.alertPopup = function(headerMsg, text, callback) {
    	
    	$('#alert-popup').remove();
    	setTimeout(function() {
    		
    		$('#alert-popup').remove();
    		var page = $.mobile.activePage;
    		var popup = $('<div id="alert-popup" data-role="popup" data-dismissible="false" style="max-width: 400px" data-theme="b" data-shadow="true" data-overlay-theme="a"></div>').appendTo( page );
    		
    		if(headerMsg){
    			$('<div data-role="header" data-theme="e"><a data-rel="back" data-role="button" data-icon="alert" data-iconpos="notext" class="ui-btn-left"></a> <h1 class="alert-popup-header">'+headerMsg+'</h1> </div>').appendTo( popup );	
    		}
    		
    		var content = $('<div data-role="content" class="ui-content"  data-theme="b" style="text-align: center;"><p>'+text+'</p><a href="#" id="alert-popup-button" data-role="button" data-inline="true" data-theme="c">Chiudi</a></div>').appendTo( popup );
    		popup.popup();
//    		page.page('destroy').page();	
    		
    		page.trigger("create");
//    		$.mobile.changePage("#security-page");
    		
    		$('#alert-popup').popup("open");
    		$('#alert-popup-button').focus();

        	$("#alert-popup #alert-popup-button").unbind("click").on("click", function() {
        		
        		if(callback){
        			callback(true);
        		}else{
        			$('#alert-popup').remove();
        		}
        		$(this).off("click");
        	});	    		
    		
    	}, 100);	
    };
    
    this.hideAlertPopup = function() {
    	$('#alert-popup').remove();
    };     

    
    this.errorPopup = function(error) {	
    	setTimeout(function() {
    		
    		if(error.message == undefined) error.message= error.err;
    		
    		$('#error-popup').remove();
    		var page = $.mobile.activePage;
    		var 
    		    popup = $('<div id="error-popup" data-role="popup" data-dismissible="false" data-theme="b" data-shadow="true" data-overlay-theme="a"></div>').appendTo( page )
    		  , header = $('<div data-role="header" data-theme="e"><img style="top:7px;" src="../images/Warning-Message-24-F50000.png" width="24px" height="24px" class="ui-btn-left" /> <h1 class="alert-popup-header">'+error.name+'</h1> </div>').appendTo( popup )
    		  , content = $('<div data-role="content" class="ui-content"  data-theme="b" style="text-align: center;"><h4 style="margin:.5em 0">'+error.message+'</h4><a href="#" data-rel="back" data-role="button" data-inline="true" data-theme="c">Chiudi</a></div>').appendTo( popup );
    		popup.popup();
    		page.page('destroy').page();		
    		$('#error-popup').popup("open");
    		
    	}, 100);	
    	

    };  
    
    this.areYouSure = function(text, callbackSI, callbackNO, headerMsg) {	

//    	$('#conferma-popup').remove();
    	
//    	setTimeout(function() {
    	
	    	var page = $.mobile.activePage;
	    	var popup = $('<div id="conferma-popup" data-dismissible="false" data-role="popup" data-theme="f" data-shadow="true" data-overlay-theme="a" style="max-width: 400px"></div>').appendTo( page );
			if(headerMsg){
				$('<div data-role="header" data-theme="e"><a data-rel="back" data-role="button" data-icon="alert" data-iconpos="notext" class="ui-btn-left"></a> <h1 class="alert-popup-header">'+headerMsg+'</h1> </div>').appendTo( popup );	
			}    	
	    	var content = $('<div data-role="content" class="ui-corner-bottom ui-content" data-theme="b"> 	<h4 style="font-size: small; text-align: center;">'+text+'</h4> 	<div class="ui-content" style="text-align: center;"> 	<div style="margin:0 auto;"> 	<a ref="#"  class="conferma-popup-si" data-role="button" data-rel="back" data-inline="true" data-theme="c" data-icon="check" data-mini="true">&nbsp; Si &nbsp;&nbsp;</a> 	<a  class="conferma-popup-no" data-role="button" data-inline="true" data-rel="back" data-theme="c" data-icon="delete" data-mini="true">&nbsp; No &nbsp;&nbsp;</a> 	</div> 	</div> </div>').appendTo( popup );
	    	popup.popup();
	    	page.page('destroy').page();		
	    	$('#conferma-popup').popup("open");
	    	
	    	$("#conferma-popup .conferma-popup-si").unbind("click").on("click", function() {
	    		setTimeout(function() {
	    			callbackSI(true);
	    		}, 300);
	    		$(this).off("click");
	    	});	
	
	    	
	    	$("#conferma-popup .conferma-popup-no").unbind("click").on("click", function() {
	    		setTimeout(function() {
	    			if(callbackNO) callbackNO(true);
	    		}, 300);
	    		$(this).off("click");
	    	});
//    	}, 0);
    };    
    
 
    this.httpError = function(error) {	
//    	console.log(JSON.stringify(error));
    	UTILITY.errorPopup(error.responseJSON);

    };        
    
}



window.onload = function() {
	var what_to_do = document.location.hash;
	
	if (what_to_do != "")
		window.location = "";
};







