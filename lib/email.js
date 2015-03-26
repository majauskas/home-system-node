
'use strict'

var transporter = null;
try {
	var config = require('../../config.json');
	var nodemailer = require('nodemailer');
	
	var transporter = nodemailer.createTransport({
		 service: 'Gmail',
		 auth: {
		     user: config.gmail.user,
		     pass: config.gmail.pass
		 }
		});
} catch (e) {
	console.error(e);
}

module.exports =
function email(subject, text) {
	if(transporter === null){return;}
	var mailOptions = {
		    from: config.gmail.from, 
		    to: config.gmail.to,
		    subject: subject, 
		    text: text, 
		    html: '' 
		};

		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		    }else{
		        console.log('Message sent: ' + info.response);
		    }
		});
		
};