
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
function email(subject, text, isMultipleRecipients) {
	if(transporter === null){return;}
	var to = config.gmail.to;
	var multipleRecipients = config.gmail.multipleRecipients;
	if(isMultipleRecipients === true && multipleRecipients){
		to = multipleRecipients;
	} 
	var mailOptions = {
		    from: config.gmail.from, 
		    to: to,
		    subject: subject, 
		    text: text.toString(), 
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