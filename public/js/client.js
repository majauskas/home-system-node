var socket = io.connect();

socket.on('pong', function (data) {
    console.log("pong");
});



$(function() {

	$("#home-page").on("change", "[name='radio-choice-h-2']", function (event) {
//		socket.send('hi');
//     socket.emit('ping', { duration: $(this).attr("desc") });	
		
//		socket.emit('ferret', 'tobi','2222', function (data) {
//		      console.log(data); 
//		});
		
		
			// generated a product document with automatically assigned ID, e.g. 4f34734d21289c1c28000007
			  		

$.ajax({type: 'POST',url: "/api/movies",dataType: "json",
	   data: { "method" : "m", "exec-time" : "12312", "timestamp" : "asdasd"}
});
		
		
	
//	jQuery
//	.ajax({
//		url : "/api/products/4f34734d21289c1c28000007",
//	type : "PUT",
//	data : {
//		"title" : "My Awesome T-shirt",
//		"description" : "All about the details. Of course it's black, and longsleeve.",
//		"images" : [ {
//			"kind" : "thumbnail",
//			"url" : "images/products/1234/main.jpg"
//		} ],
//		"categories" : [ {
//			"name" : "Clothes"
//		}, {
//			"name" : "Shirts"
//		} ],
//		"style" : "1234",
//		"variants" : [ {
//			"color" : "Black",
//			"images" : [ {
//				"kind" : "zoom",
//				"url" : "images/products/1234/zoom.jpg"
//			} ],
//			"sizes" : [ {
//				"size" : "L",
//				"available" : 77,
//				"sku" : "CAT-1234-Blk-L",
//				"price" : 99.99
//			} ]
//		} ],
//		"catalogs" : [ {
//			"name" : "Apparel"
//		} ]
//	},
//	success : function(data, textStatus, jqXHR) {
//		console.log("PUT resposne:");
//			console.dir(data);
//			console.log(textStatus);
//			console.dir(jqXHR);
//		}
//	}); 		
		
		
		
	});
  
});  