var UTILITY = new initutil();function initutil() {

    this.showLoading = function(msg) {
    	$('#block-popup').remove();
    	var page = $.mobile.activePage;
    	var popup = $('<div id="block-popup" data-role="popup" data-dismissible="false" data-theme="c" data-shadow="true" data-overlay-theme="a"></div>').appendTo( page );
    	popup.popup();
    	page.page('destroy').page();		
    	$('#block-popup').popup("open");
    	
    	$.mobile.loading( 'show', {text: msg,textVisible: true});
    };
    
    this.hideLoading = function() {
    	$('#block-popup').remove();
    	$.mobile.loading( 'hide'); 
    };  
    
    
    this.alertPopup = function(headerMsg, text, callback) {
    	
    	$('#alert-popup').remove();
    	setTimeout(function() {
    		
//    		$('#alert-popup').remove();
    		var page = $.mobile.activePage;
    		var popup = $('<div class="customPopup" id="alert-popup" data-transition="pop" data-role="popup" data-dismissible="false" style="max-width: 400px" data-theme="b" data-shadow="true" data-overlay-theme="a"></div>').appendTo( page );
    		
    		if(headerMsg){
    			$('<div data-role="header"><a data-rel="back" data-role="button" data-icon="alert" data-iconpos="notext" class="ui-btn-left"></a> <h1 class="alert-popup-header">'+headerMsg+'</h1> </div>').appendTo( popup );	
    		}
    		
    		var content = $('<div data-role="content" class="ui-content"  data-theme="b" style="text-align: center;"><p>'+text+'</p><a href="#" id="alert-popup-button" data-role="button" data-inline="true" data-theme="c">Chiudi</a></div>').appendTo( popup );
    		popup.popup();
    		
    		page.trigger("create");
    		
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
    		
    	}, 200);	
    };
    
    this.hideAlertPopup = function() {
    	$('#alert-popup').remove();
    };     

    this.areYouSurePopup = function() {
    	$('#conferma-popup').remove();
    }; 
    
    
    this.errorPopup = function(error) {	
    	setTimeout(function() {
    		
    		if(error.message === undefined) {
    			error.message= error.err;
    		}
    		
    		$('#error-popup').remove();
    		var page = $.mobile.activePage;
    		var 
    		    popup = $('<div class="customPopup" id="error-popup" data-role="popup" data-dismissible="false" data-theme="b" data-shadow="true" data-overlay-theme="a"></div>').appendTo( page )
    		  , header = $('<div data-role="header" data-theme="e"><img style="top:7px;" src="../images/Warning-Message-24-F50000.png" width="24px" height="24px" class="ui-btn-left" /> <h1 class="alert-popup-header">'+error.name+'</h1> </div>').appendTo( popup )
    		  , content = $('<div data-role="content" class="ui-content"  data-theme="b" style="text-align: center;"><h4 style="margin:.5em 0">'+error.message+'</h4><a href="#" data-rel="back" data-role="button" data-inline="true" data-theme="c">Chiudi</a></div>').appendTo( popup );
    		popup.popup();
    		page.trigger("create");
    		$('#error-popup').popup("open");
    		
    	}, 100);	
    	

    };  
    
    this.areYouSure = function(text, callbackSI, callbackNO, headerMsg) {	

	    	var page = $.mobile.activePage;
	    	var popup = $('<div class="customPopup" id="conferma-popup" data-dismissible="false" data-role="popup" data-theme="f" data-shadow="true" data-overlay-theme="a" style="max-width: 400px"></div>').appendTo( page );
			if(headerMsg){
				$('<div data-role="header"><a data-rel="back" class="ui-btn ui-btn-left ui-alt-icon ui-nodisc-icon ui-corner-all ui-btn-icon-notext ui-icon-alert"></a><h1 class="alert-popup-header">'+headerMsg+'</h1> </div>').appendTo( popup );	
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
    };    
    
 
    this.httpError = function(error) {	
    	
    	if(error.responseJSON === undefined ){
    		error = {message:error.responseText};
    	}else{
    		error = error.responseJSON;
    	}
    	
    	UTILITY.errorPopup(error);

    };        
    
}



window.onload = function() {
	var what_to_do = document.location.hash;
	
	if (what_to_do != "")
		window.location = "";
};





Array.prototype.pushUnique = function (item){
	if(! new RegExp(JSON.stringify( item )).test(JSON.stringify( this )) ){
		 this.push(item);
	}
};

Array.prototype.contains = function (item){
	if(new RegExp(JSON.stringify( item )).test(JSON.stringify( this )) ){
		 return true;
	}
	return false;
};

$(document).bind("ajaxSend", function(){
	setTimeout(function() {$.mobile.loading( "show");}, 0); 
}).bind("ajaxComplete", function(){
	setTimeout(function() { $.mobile.loading("hide");}, 0);    
});



//***************** Swipe to delete *************************
$(function() {
	var x;
	$(".swipe-delete").on("touchstart", "li > a", function (e) {
		
		$('.behind a.ui-btn').css('height', ($(e.currentTarget).height()+2)+"px");
		
	    $('.swipe-delete li > a.open').css('left', '0px').removeClass('open'); // close em all
	    $(e.currentTarget).addClass('open');
	    x = e.originalEvent.targetTouches[0].pageX;		
	});
	$(".swipe-delete").on("touchmove", "li > a", function (e) {
	    var change = e.originalEvent.targetTouches[0].pageX - x;
	    change = Math.min(Math.max(-100, change), 100); // restrict to -100px left, 0px right
	    if(change>0)return;
	    if(e.originalEvent.targetTouches[0].pageX < 180) return;
	    e.currentTarget.style.left = change + 'px';
	    if (change < -10) {disable_scroll();} // disable scroll once we hit 10px horizontal slide	
	});	
	$(".swipe-delete").on("touchend", "li > a", function (e) {
	    var left = parseInt(e.currentTarget.style.left);
	    var new_left;
	    if (left < -35) {
	        new_left = '-100px';
	    } else if (left > 35) {
	        new_left = '100px';
	    } else {
	        new_left = '0px';
	    }
	    $(e.currentTarget).animate({left: new_left}, 200);
	    enable_scroll();
	});
	
	function prevent_default(e) {
	    e.preventDefault();
	}
	
	function disable_scroll() {
	    $(document).on('touchmove', prevent_default);
	}
	function enable_scroll() {
	    $(document).unbind('touchmove', prevent_default);
	}
	
	

	
});










