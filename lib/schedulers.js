
var CronJob = require('cron').CronJob;
var _later = require('later');
_later.date.localTime();

var cronAllJobs = [];
module.exports.execute = function (database, LightsController) {

	cronAllJobs.forEach(function(jobs) {
		jobs.cronJob.stop();
	});	
	cronAllJobs = [];	
	
	database.SCHEDULERS.find({isEnabled:true}).exec(function(err, schedulers) {
		
		schedulers.forEach(function(scheduler) {
				
				var cronJob = new CronJob(scheduler.cronExpression, function(){
					console.log("CronJob Scheduler", this, new Date());
					
					if(this.commands){
						this.commands.forEach(function(command) {
							var code = command.code;
							console.log("command scheduler: ", command.type, code, command.action, new Date() );
						
							var address = parseInt(code.substring(0, 4), 16);
							var port = code.substring(7, 8);
							var pin = code.substring(8);
							var isOn = (command.action === "on") ? true : false;
							
							var currentState = LightsController.writePin(address, port, pin, ((isOn) ? 1:0 ));
							
							if(currentState === isOn || currentState === undefined){return;}
							
							console.log(code, "On: ", isOn );
							database.LIGHTS.update({code : code}, {isOn: isOn, date: new Date()}, function (err, arg) {});
							if(isOn === true){
								database.LIGHT_HISTORY.findOneAndUpdate({code : code, date_on : new Date()}, {}, {upsert : true}, function (err, res) {});		
							}else {
								database.LIGHT_HISTORY.findOneAndUpdate({code : code, date_off : null}, {date_off : new Date(), watt:60 }, function (err, res) {
									if(!res) {return;}
									var date = new Date();
									var firstMonthDay = new Date(date.getFullYear(), date.getMonth(), 1);
									database.LIGHT_HISTORY.find({code : res.code, date_off: {"$gte": firstMonthDay, $ne: null}}).exec(function(err, records){
										var kWh = 0;
										records.forEach(function(record) {
											var duration = Number(record.date_off - record.date_on); 
											duration = (duration / 3600000); //ore
											kWh += (record.watt / 1000) * duration;
										});
										var cost = kWh * 0.16;
										console.log({kWh: kWh, cost:cost});
										database.LIGHTS.update({code : res.code}, {kWh: kWh, cost:cost}, function (err, arg) {});	
									});
								});
							}
							
						});	
					}
					
					var s = _later.parse.cron(this.cronExpression);
					setTimeout(function(s, id) {
						database.SCHEDULERS.update({_id : id}, {
							lastOccurrence: _later.schedule(s).prev(1),
							nextOccurrence: _later.schedule(s).next(1),
						}, function (err, data){});	
					}, 2000, s, this._id);
					
				},null, true, null, scheduler);				
				
				cronAllJobs.push({id:scheduler._id, cronJob: cronJob});
						
		});		
		
		
	});			
	
};


