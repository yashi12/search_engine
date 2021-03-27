const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = config.get('CLIENT_ID');
const CLIENT_SECRET = config.get('CLIENT_SECRET');
const REDIRECT_URI = config.get('REDIRECT_URI');
const REFRESH_TOKEN = config.get('REFRESH_TOKEN');

const User = require('../models/User');

const postAddUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        // return res.status(400).json({errors: errors.array()});
    }

    console.log("body",req.body);
    const {name, email, password} = req.body;
    console.log("email",req.body.email);
    console.log("password",req.body.password);

    User.findOne({email: email})
        .then(user => {
            if (user) {
                console.log("user exists");
                return res.status(400).json({errors: [{msg: 'User already exists'}]});
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name, email, password: hashedPassword
                    });
                    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
                    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
                    const sendMail = async ()=>{
                        try {
                            const accessToken = await oAuth2Client.getAccessToken();
                            const transport = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    type: 'OAuth2',
                                    user: 'yashiagarwal1812@gmail.com',
                                    clientId :CLIENT_ID,
                                    clientSecret: CLIENT_SECRET,
                                    refreshToken: REFRESH_TOKEN,
                                    accessToken: accessToken
                                }
                            });
                            console.log("email user",email);
                            const mailOptions = {
                                from: 'CONNECT DEV  <yashiagarwal1812@gmail.com>',
                                to: email,
                                subject: "Verify your mail",
                                text: "In order to continue need to verify email",
                                html: '<h1>In order to continue need to verify email</h1>'
                            };
                            return await transport.sendMail(mailOptions);
                        }catch (err) {
                            return err;
                        }
                    };
                    sendMail()
                        .then(result=> console.log('Email sent...', result))
                        .catch(err=>console.log(err.message));
                    return user.save();
                })
                .then(user => {
                    const payload = {
                        user: {
                            id: user._id
                        }
                    };
                    jwt.sign(payload, config.get('SECRET_KEY'), {expiresIn: config.get('TOKEN_EXPIRE_TIME')}, (err,token)=>{
                        if (err){
                            throw err;
                            return res.status(500).send('server error...');
                        }
                        res.json({token});
                    });
                })
                .catch(err => {
                    console.log(err.message);
                    return res.status(500).send('Server error...');
                });
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).send('Server error...');
        });
    // Return jsonwebtoken
}

module.exports = {
    postAddUser: postAddUser
}