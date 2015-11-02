

var CronJob = require('cron').CronJob;
	

//new CronJob("00 30 11 * * 1-5", function(){
//		console.log('job cronOnAllarm init at ', new Date(), this.areaId);
//		Area.findByIdAndUpdate(this.areaId, {isActivated: true}, function (err, data) {
//			io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
//		});
//},null, true, null);	


new CronJob({
	  cronTime: '30 08 23 * * 1-5',
	  onTick: function() {
		  console.log('You will see this message every second');

	  },
	  onComplete: function() {
		  console.log('You will see this message every second');

	  },
	  startNow: true,
	  timeZone: null,
	  context: null
	});
//	job.start();

	
//setTimeout(function() {	
//
//             
//}, 10000);	



