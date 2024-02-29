const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
	service: process.env.SERVICE,
	auth: {
		user: process.env.USER,
		pass: process.env.PASS,
	},
});

app.get('/index', (req, res) => {
	res.send('Waiting for request...');
})

app.post('/send-email', (req, res) => {
	const {name, email, message} = req.body;
	const subject = `New message from ${name} <${email}>`;
	const mailOptions = {
		from: process.env.USER,
		to: 'hello@geda.dev',
		subject,
		text: message,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.status(500).send('Error sending email');
		} else {
			console.log(`Email sent: ${info.response}`);
			res.send('Email sent successfully');
		}
	});
});

app.listen(3000, () => {
	console.log('Server running on port 3000');
});
