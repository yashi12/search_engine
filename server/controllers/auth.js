const {check, validationResult} =require('express-validator')
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {OAuth2Client} = require('google-auth-library');
const uniqid =require('uniqid');


const User =require('../models/User');

// const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID);

const getAuthUser = (req,res)=> {
    User.findById(req.user.id)
        .select('-password')
        .then(user=>{
            res.json(user);
        })
        .catch(err=>{
            console.log(err.message);
            res.status(500).send('Server err...');
        });
}

const validateUser = (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const { email, password} = req.body;

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
            }

            bcrypt.compare(password,user.password)
                .then(doMatch=>{
                    if(!doMatch)
                        return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
                    const payload = {
                        user: {
                            id: user._id
                        }
                    };
                    jwt.sign(payload, config.get('SECRET_KEY'), {expiresIn: process.env.TOKEN_EXPIRE_TIME}, (err,token)=>{
                        if (err){
                            // throw err;
                            return res.status(500).send('server error...');
                        }
                        res.json({token});
                    });
                })
                .catch(_ =>{
                    return res.status(500).send('Server error...');
                });
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).send('Server error...');
        });
}

const googlelogin = (req,res)=>{
    const {token} = req.body;
    oAuth2Client.verifyIdToken({idToken:token,audience:process.env.CLIENT_ID})
        .then(response=>{
            const {email_verified,name,email} = response.getPayload();
            if(email_verified){
                User.findOne({email})
                    .then(user =>{
                        if(user){
                            // user already exists in db
                            const payload = {
                                user: {
                                    id: user._id
                                }
                            };
                            jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: process.env.TOKEN_EXPIRE_TIME}, (err,token)=>{
                                if (err){
                                    // throw err;
                                    return res.status(500).send('server error...');
                                }
                                res.json({token});
                            });
                        }
                        else{
                            // create user in db
                            let password = email+process.env.SECRET_KEY;
                            bcrypt.hash(password, 12)
                                .then(hashedPassword => {
                                    const user = new User({
                                        name:uniqid(name.split(' ')[0]+'-'), email, password: hashedPassword,confirmedEmail:email_verified
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
                                            // throw err;
                                            return res.status(500).send('server error...');
                                        }
                                        res.json({token});
                                    });
                                })
                                .catch(err => {
                                    console.log(err.message);
                                    return res.status(500).send('Server error...');
                                });
                        }
                    })
                    .catch(err=>{
                        console.log(err.message);
                        return res.status(500).send('Server error...');
                    })
            }
            else{
                return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
            }
        })
}

module.exports = {
    getAuthUser:getAuthUser,
    validateUser:validateUser,
    // googlelogin:googlelogin
}
