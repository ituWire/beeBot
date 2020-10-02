var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ITUDiscordBotu@gmail.com',
    pass: 'botdiscorditu'
  }
});

var mailOptions = {
  from: 'ITUDiscordBotu@gmail.com',
  to: 'kavraz19@itu.edu.tr',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});