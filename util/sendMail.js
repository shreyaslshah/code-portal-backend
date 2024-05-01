const nodemailer = require("nodemailer");
require('dotenv').config();
const emailjs = import('emailjs');
const axios = require('axios');
const sgMail = require('@sendgrid/mail')

module.exports.sendMail = async (email, otp) => {
  // var transporter = nodemailer.createTransport({
  //   host: "smtp-mail.outlook.com",
  //   secureConnection: false,
  //   port: 587, 
  //   auth: {
  //     user: process.env.EMAIL,
  //     pass: process.env.PASSWORD
  //   },
  //   tls: {
  //     ciphers: 'SSLv3'
  //   }
  // });

  // const options = {
  //   from: process.env.EMAIL,
  //   to: email,
  //   subject: "Email Verification",
  //   text: `Your otp is - ${otp}`,
  // };

  // transporter.sendMail(options, function (err, info) {
  //   if (err) {
  //     console.log(err);
  //   }
  // });

  // const options = {
  //   method: 'POST',
  //   url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
  //   headers: {
  //     'content-type': 'application/json',
  //     // 'X-RapidAPI-Key': process.env.RAPID_API_KEY,
  //     // 'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com'
  //     'X-RapidAPI-Key': '98856dfd81mshd6eae81aca742c8p15bef5jsn0a1feffd60ec',
  //     'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com'
  //   },
  //   data: {
  //     personalizations: [
  //       {
  //         to: [
  //           {
  //             email: email
  //           }
  //         ],
  //         subject: "OTP for Code Portal"
  //       }
  //     ],
  //     from: {
  //       email: process.env.EMAIL
  //     },
  //     content: [
  //       {
  //         type: 'text/plain',
  //         value: `OTP - ${otp}`
  //       }
  //     ]
  //   }
  // };

  // try {
  //   const response = await axios.request(options);
  //   console.log(response.data);
  // } catch (error) {
  //   console.error(error);
  // }

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: email, 
  from: process.env.EMAIL,
  subject: 'OTP for Code Portal',
  text: `OTP - ${otp}`
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}