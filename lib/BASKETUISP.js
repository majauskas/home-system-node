var cheerio = require('cheerio');
var http = require('http');



module.exports.readContent = function (database, callBack) {


//	var options = {
//		    host: 'uispbasketvarese.slive.it',
//		    path: '/Page/Default.aspx?C=120'
//		};
//	
//	var request = http.request(options, function (res) {
//		    var data = '';
//		    res.on('data', function (chunk) {
//		        data += chunk;
//		    });
//		    res.on('end', function () {
//		    	var parsedHTML = cheerio.load(data);
//		    	
//		    	var standing = [];
//		        parsedHTML('div[id="ctl00_ucStanding_RadGrid1157"] table tbody tr td[align="left"] font b').map(function(i, link) {
//		        	standing.push({team : cheerio(link).text()});
//		        });
//		        parsedHTML('div[id="ctl00_ucStanding_RadGrid1157"] table tbody tr td[align="center"] font').map(function(i, link) {
//		        	standing[i].points = cheerio(link).text();
//		        	standing[i].zone = "NORD EST";
//		        });	
//		        standing.forEach(function(record) {
//		        	database.UISP_STANDING.findOneAndUpdate({team : record.team, points : record.points, zone : record.zone, date : new Date()}, {}, {upsert : true}, function (err, res) {});
//				});
//		        
//		        
//		    	standing = [];
//		        parsedHTML('div[id="ctl00_ucStanding_RadGrid1158"] table tbody tr td[align="left"] font b').map(function(i, link) {
//		        	standing.push({team : cheerio(link).text()});
//		        });
//		        parsedHTML('div[id="ctl00_ucStanding_RadGrid1158"] table tbody tr td[align="center"] font').map(function(i, link) {
//		        	standing[i].points = cheerio(link).text();
//		        	standing[i].zone = "SUD OVEST";
//		        });	
//		        standing.forEach(function(record) {
//		        	database.UISP_STANDING.findOneAndUpdate({team : record.team, points : record.points, zone : record.zone, date : new Date()}, {}, {upsert : true}, function (err, res) {});
//				});
//		        
//		        
//		        console.log(standing);
//
//		    });
//		});
//		request.on('error', function (e) {
////		    console.log(e.message);
//		});
//		request.end();	
			
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	setInterval(function() {
		var options = {
			    host: 'uispbasketvarese.slive.it',
//			    path: '/Page/GameDetails.aspx?Game=9152'
			    path: '/Page/GameDetails.aspx?Game=9169'
			};
		
		var request = http.request(options, function (res) {
			    var data = '';
			    res.on('data', function (chunk) {
			        data += chunk;
			    });
			    res.on('end', function () {
			        var parsedHTML = cheerio.load(data);
			        
			        var homeTeamName = parsedHTML('span[id="ctl00_cphMain_lblTeamNameHomeFull"] b').text();
			        var homeTeamPoints = parsedHTML('span[id="ctl00_cphMain_lblHomeTeamPoints"] b').text();
			        var visitorsTeamName = parsedHTML('span[id="ctl00_cphMain_lblTeamNameVisitorsFull"] b').text();
			        var visitorsTeamPoints = parsedHTML('span[id="ctl00_cphMain_lblVisitorsTeamPoints"] b').text();
			        
			        
//			        parsedHTML('td[id="ctl00_cphMain_cellHome"] table tbody tr td[align="left"]').map(function(i, link) {
//			        	console.log(i,cheerio(link).text());
//			        });
//			        parsedHTML('td[id="ctl00_cphMain_cellHome"] table tbody tr td[align="center"] b').map(function(i, link) {
//			        	console.log(i, cheerio(link).text());
//			        });
			        
			        
			        var newsletter = parsedHTML('div .divNewsletter p').text();
			        
			        console.log(homeTeamName,homeTeamPoints,visitorsTeamName,visitorsTeamPoints);
			        console.log(newsletter);
			        callBack({newsletter: newsletter});

			    });
			});
			request.on('error', function (e) {
//			    console.log(e.message);
			});
			request.end();	
			
			
	}, 1000 * 60*10);

	
};

