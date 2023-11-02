/* eslint-disable no-undef */
require('dotenv').config()
const nodemailer = require('nodemailer');
const LOGGER = require('../logger/logger.util');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD 
    }
});

async function sendOTPMail(email, otp) {
    mailOptions = {
        from: process.env.MAILID,
        to: email,
        subject: 'Micro Blogging Application Password-OTP',
        text: 'The Otp for forgot Password is: ' + otp
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            LOGGER.error('sendOTPMail',error)
        } else {
            LOGGER.info('Email sent: ' + info.response)
        }
    })
}

exports.sendOTPMail = sendOTPMail;