const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

const postAddUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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