/* eslint-disable prettier/prettier */
const admin = require('firebase-admin');
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

var serviceAccount = require('./serviceAccount.json');
app.use(express.json());
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: 'smtp.gmail.com',
  auth: {
    user: 'mehdim93514@gmail.com',
    pass: 'duzgebxzrjimnqbe',
  },
  secure: true,
});

app.get('/', (req, res) => {
  res.send('Hello World! , Pakverse !');
});
app.post('/send-noti', (req, res) => {
  console.log(req.body);
  const {tokens, pickUpAddress, dropAddress} = req.body;
  const message = {
    notification: {
      title: 'Driver has planned a Route ❤',
      body: `Pickup: ${pickUpAddress}, |
            Drop: ${dropAddress}`,
    },
    tokens: tokens,
    data: {
      navigationId: 'notification',
    },
  };

  admin
    .messaging()
    .sendEachForMulticast(message)
    .then(response => {
      console.log('Send SuccessFully', response);
    })
    .catch(err => {
      console.log('Unable to Send', err);
    });
});

app.post('/change-route', (req, res) => {
  console.log('Change Route Endpoint body ----- > ', req.body);
  const {tokens, pickUpAddress, dropAddress} = req.body;
  const message = {
    notification: {
      title: 'Driver has changed a Route ❤',
      body: `Pickup: ${pickUpAddress}, |
            Drop: ${dropAddress}`,
    },
    tokens: tokens,
    data: {
      navigationId: 'notification',
    },
  };

  admin
    .messaging()
    .sendEachForMulticast(message)
    .then(response => {
      console.log(' Change Route  Send SuccessFully', response);
    })
    .catch(err => {
      console.log('Unable to Send', err);
    });
});

app.post('/driver-arrive', (req, res) => {
  console.log('driver arrive Endpoint body ----- > ', req.body);
  const {token} = req.body;

  const message = {
    notification: {
      title: 'Driver is at your location',
      body: 'driver is at your location!',
    },
    token: token,
    data: {
      navigationId: 'notification',
    },
  };

  admin
    .messaging()
    .send(message)
    .then(response => {
      console.log('Driver Arrive Notification Sent Successfully', response);
      res.status(200).send({success: true, messageId: response});
    })
    .catch(err => {
      console.error('Unable to Send Notification', err);
      res.status(500).send({success: false, error: err});
    });
});

app.post('/send-email', (req, res) => {
  console.log('Send Email body --->', req.body);
  const {email} = req.body;
  const mailData = {
    from: `${email}`,
    to: 'pakverseorg@gmail.com',
    subject: 'New Driver Registered in your Whippy Bois App!',
    text: 'New Driver Registered in your Whippy Bois App!',
    html: '<h2> New Driver Approval , please check the Whippy Bois Admin Panel !</h2>',
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).send({
      message: 'Mail Send',
      message_id: info.messageId,
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running');
});
