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
    	setTimeout(function() {

    		$('#alert-popup').remove();
    		var page = $.mobile.activePage;
    		var 
    		    popup = $('<div id="alert-popup" data-role="popup" data-dismissible="false" style="width: 400px" data-theme="c" data-shadow="true" data-overlay-theme="a"></div>').appendTo( page )
    		  , header = $('<div data-role="header" data-theme="e"><a data-rel="back" data-role="button" data-icon="alert" data-iconpos="notext" class="ui-btn-left"></a> <h1 class="alert-popup-header">'+headerMsg+'</h1> </div>').appendTo( popup )
    		  , content = $('<div data-role="content" class="ui-content" style="text-align: center;"><p>'+text+'</p><a href="#" id="alert-popup-button" data-role="button" data-inline="true" data-theme="c">Chiudi</a></div>').appendTo( popup );
    		popup.popup();
    		page.page('destroy').page();	
    		$('#alert-popup').popup("open");
    		$('#alert-popup-button').focus();

        	$("#alert-popup #alert-popup-button").unbind("click").on("click", function() {
        		
        		if(callback){
        			callback(true);
        		}else{
        			$('#alert-popup').remove();
        		}
        		$(this).off("click");
//        		setTimeout(function() {
//        			
//        			
//        			callback(true);
//        		}, 100);
//        		$(this).off("click");
        	});	    		
    		
    	}, 100);	
    };
    
    this.hideAlertPopup = function() {
    	$('#alert-popup').remove();
    };     

    
    this.blockErrorPopup = function(error) {	
    	setTimeout(function() {
    		
    		$('#block-error-popup').remove();
    		var page = $.mobile.activePage;
    		var 
    		    popup = $('<div id="block-error-popup" data-role="popup" data-dismissible="false" data-theme="c" data-shadow="true" data-overlay-theme="a"></div>').appendTo( page )
    		  , header = $('<div data-role="header" data-theme="e"><a data-role="button" data-icon="info2" data-iconpos="notext" class="ui-btn-left"></a> <h1 class="alert-popup-header">'+error.exception.code+'</h1> </div>').appendTo( popup )
    		  , content = $('<div data-role="content" class="ui-content" style="text-align: center;"><h4 style="margin:.5em 0">'+error.exception.message+'</h4><p>'+error.exception.detailedMessage+'</p></div>').appendTo( popup );
    		popup.popup();
    		page.page('destroy').page();		
    		$('#block-error-popup').popup("open");
    		
    	}, 100);	
    	

    };  
    
    this.areYouSure = function(text, callbackSI, callbackNO) {	

    	$('#conferma-popup').remove();
    	var page = $.mobile.activePage;
    	var 
    	    popup = $('<div id="conferma-popup" data-dismissible="false" data-role="popup" data-theme="f" data-shadow="true" data-overlay-theme="a" style="width: 400px"></div>').appendTo( page )
    	  , header = $('<div data-role="header" data-theme="e"><a  data-icon="question" data-iconpos="notext" class="ui-btn-left"></a> <h1>Conferma</h1> </div>').appendTo( popup )
    	  , content = $('<div data-role="content" class="ui-corner-bottom ui-content" data-theme="b"> 	<h4 style="font-size: small; text-align: center;">'+text+'</h4> 	<div class="ui-content" style="text-align: center;"> 	<div style="margin:0 auto;"> 	<a ref="#"  class="conferma-popup-si" data-role="button" data-rel="back" data-inline="true" data-theme="c" data-icon="check" data-mini="true">&nbsp; Si &nbsp;&nbsp;</a> 	<a  class="conferma-popup-no" data-role="button" data-inline="true" data-rel="back" data-theme="c" data-icon="delete" data-mini="true">&nbsp; No &nbsp;&nbsp;</a> 	</div> 	</div> </div>').appendTo( popup );
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

    };    
    
    
}



window.onload = function() {
	var what_to_do = document.location.hash;
	
	if (what_to_do != "")
		window.location = "";
};








