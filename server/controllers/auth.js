const {check, validationResult} =require('express-validator')
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User =require('../models/User');

const getAuthUser = (req,res,next)=> {
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

const validateUser = (req,res,next)=>{
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
                            throw err;
                            return res.status(500).send('server error...');
                        }
                        res.json({token});
                    });
                })
                .catch(err=>{
                    return res.status(500).send('Server error...');
                });
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).send('Server error...');
        });
}

module.exports = {
    getAuthUser:getAuthUser,
    validateUser:validateUser
}