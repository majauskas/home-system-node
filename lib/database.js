

var mongoose = require('mongoose');
var os = require('os');
var moment = require('moment');


var url = "mongodb://ajauskas.dyndns.org/home-system";
if(os.hostname().toLowerCase() === "raspberrypi"){
	url = "mongodb://localhost/home-system";
}
mongoose.connect(url);

mongoose.connection.on("connected", function(ref) {
  console.log("Connected to " + url);
});
mongoose.connection.on("error", function(err) {
  console.error('Failed to connect to DB on startup ', err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB disconnected');
});

//If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});
var Schema = mongoose.Schema;




//-----------LIGHTS---------------------------------------------
var LightsSchema = new Schema({
  code: String,
  name: String,
  isOn: {type : Boolean, 'default': false},
  watt: {type : Number, 'default': 0},
  kWh: Number,
  cost: Number,
  date: Date
},{toJSON:{virtuals: true}});

LightsSchema.methods.toJSON = function() {
	  var obj = this.toObject();
	  var date = moment(obj.date), formatted = date.format('DD/MM/YYYY HH:mm:ss');
	  obj.date = formatted;
	  return obj;
};

module.exports.LIGHTS = mongoose.model('LIGHTS', LightsSchema);








//-----------LIGHT_HISTORY---------------------------------------------
var LightHistorySchema = new Schema({
  code: String,
//  isOn: {type : Boolean, 'default': false},
  time: Number,
  watt: Number,
  date_on: Date,
  date_off: Date
},{toJSON:{virtuals: true}});

//LightHistorySchema.methods.toJSON = function() {
//	  var obj = this.toObject();
//	  var date = moment(obj.date), formatted = date.format('DD/MM/YYYY HH:mm:ss');
//	  obj.date = formatted;
//	  return obj;
//};

module.exports.LIGHT_HISTORY = mongoose.model('LIGHT_HISTORY', LightHistorySchema);







//-----------LIGHT_CONTROLLERS---------------------------------------------
var LightControllersSchema = new Schema({
    code: String,
    name: String,
    lights: [],
    date: Date
},{toJSON:{virtuals: true}});

LightControllersSchema.methods.toJSON = function() {
	  var obj = this.toObject();
	  var date = moment(obj.date), formatted = date.format('DD/MM/YYYY HH:mm:ss');
	  obj.date = formatted;
	  return obj;
};

module.exports.LIGHT_CONTROLLERS = mongoose.model('LIGHT_CONTROLLERS', LightControllersSchema);



//-----------PIR_SENSOR---------------------------------------------
var PirSensorSchema = new Schema({
    code: String,
    name: String,
    state: String,
    date: Date
},{toJSON:{virtuals: true}});

PirSensorSchema.methods.toJSON = function() {
	  var obj = this.toObject();
	  var date = moment(obj.date), formatted = date.format('DD/MM/YYYY HH:mm:ss');
	  obj.date = formatted;
	  return obj;
};

module.exports.PIR_SENSOR = mongoose.model('PIR_SENSOR', PirSensorSchema);










//-----------WifiSensor---------------------------------------------
var WifiSensorSchema = new Schema({
	code: Number,
	binCode: String,	
	name: String,
	isOpen: {type : Boolean, 'default': null},
	isBatteryLow: {type : Boolean, 'default': null},
	date: Date	
});
WifiSensorSchema.methods.toJSON = function() {
	  var obj = this.toObject();
	  var date = moment(obj.date), formatted = date.format('DD/MM/YYYY HH:mm:ss');
	  obj.date = formatted;
	  return obj;
}; 
module.exports.WIFISENSOR = mongoose.model('WifiSensor', WifiSensorSchema);









//----------- CONFIGURATION ---------------------------------------------
var ConfigurationSchema = new Schema({
	audio: {
		volumeSirena: String,
		volumeVoce: String
	}
});
mongoose.model('CONFIGURATION', ConfigurationSchema); 
module.exports.CONFIGURATION = mongoose.model('CONFIGURATION');







//----------- LAN_DEVICE ---------------------------------------------
var LanDeviceschema = new Schema({
	ip: String,
	mac: String,
	name: String,
	nmapname: String,
	manufacturer: String,
	exists: {type : Boolean, 'default': true},
	lastLogin: Date
});

LanDeviceschema.methods.toJSON = function() {
	  var obj = this.toObject();
	  var lastLogin = moment(obj.lastLogin), formatted = lastLogin.format('DD/MM/YYYY HH:mm:ss');
	  obj.lastLogin = formatted;
	  return obj;
}; 
module.exports.LAN_DEVICE = mongoose.model('LAN_DEVICE', LanDeviceschema); 







//-----------AREA---------------------------------------------
var AreaSchema = new Schema({
	name : {type : String, required : true, unique: true, trim: true},
	activeSensors: [],
	alarmActivate: {
		state: {type : Boolean, 'default': false},
		sensor: {
			name: String
		}
	},
	isActivated: {type : Boolean, 'default': false},	
	schedulers: [],
	auto_on_off: {
//		isActivated: {type : Boolean, 'default': false},
		scheduler: {},
		lan_devices : []
	},
	date: {type : Date, 'default': Date.now()}	
	
});


module.exports.AREA = mongoose.model('Area', AreaSchema); 











//----------- EVENTS ---------------------------------------------
var EventSchema = new Schema({
	code : {type : Number},
	binCode : {type : String},
	date: {type : Date},
	device : { 
		provider : String,
		name : String,
		isLock : Boolean,
		isOpen : Boolean,
		isBatteryLow : Boolean,
		isOn : Boolean
	}
},{toJSON:{virtuals: true}});


EventSchema.methods.toJSON = function() {
	  var obj = this.toObject();
	  var date = moment(obj.date), formatted = date.format('DD/MM/YYYY HH:mm:ss');
	  obj.date = formatted;
	  return obj;
};

module.exports.EVENT = mongoose.model('Event', EventSchema); 
//mongoose.model('Event', EventSchema); 
//var Event = mongoose.model('Event');










//-----------REMOTECONTROL---------------------------------------------
var RemoteControlSchema = new Schema({
	code: Number,
	binCode: String,	
	name: String,
	activeArea: String,
	isLock: {type : Boolean, 'default': null},
	isBatteryLow: {type : Boolean, 'default': null},
	date: Date
});
//mongoose.model('RemoteControl', RemoteControlSchema); 
//var RemoteControl = mongoose.model('RemoteControl');
module.exports.REMOTE_CONTROL = mongoose.model('RemoteControl', RemoteControlSchema); 






module.exports.scan = function (callBack) {
};

