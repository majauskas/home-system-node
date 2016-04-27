var cheerio = require('cheerio');
var http = require('http');



module.exports.readContent = function (callBack) {

	
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
			    	console.log("---------------------------------------------------------------------------------------");
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
			
			
	}, 1000 * 60);
	
	
	
	
	


	
};

