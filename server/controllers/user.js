const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const User = require('../models/User');

const sendMail = async (userId,userEmail,task)=>{
    try {
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
        oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
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
        const url = `http://localhost:3000/${task}/${userId}`;
        const mailOptions = {
            // from: 'CONNECT DEV  <yashiagarwal1812@gmail.com>',
            from: "yashiagarwal1812@gmail.com",
            to: userEmail,
            subject: "Verify your mail",
            text: 'Confirm Your Email!',
            html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
        };
        return await transport.sendMail(mailOptions, (error, response) => {
                if(error){
                    console.log(error) ;
                }
                transport.close();
            });
    }catch (err) {
        console.log("error in sending email", err.message);
        return err;
    }
};

const postAddUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;

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
                    return user.save();
                })
                .then(user => {
                    let task = "emailConfirmation";
                    // sendMail(user._id,user.email,task)
                    //     .then(result=> console.log('Email sent...'))
                    //     .catch(err=>console.log(err.message));

                    const payload = {
                        user: {
                            id: user._id
                        }
                    };
                    jwt.sign(payload, config.get('SECRET_KEY'), {expiresIn: process.env.TOKEN_EXPIRE_TIME}, (err,token)=>{
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
    postAddUser: postAddUser,
}