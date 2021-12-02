const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const request = require('request');

const User = require('../models/User');
const Profile = require('../models/Profile');
const Answer = require('../models/discussion/Answer');

const findAnswers = (user)=>{
    return new Promise((resolve,reject)=>{
        let len=0,score=0;
        Answer.find({user:user._id}).select('likeCount')
        .then(answers=>{
            len = answers.length,score=0;
            answers.map(answer=>{
                score = score+answer.likeCount;
            })
            if(len>0)
                score = score/len;
            resolve({score,len});
        });
    })
}

const updateProfileRating  = async(req,res,next)=>{
    const allUsers = await User.find({}).select('id','rating');
    if(allUsers){
        allusers= allUsers.map(async(user)=>{
            Promise.all([findAnswers(user)]).then((score,len)=>{
                console.log(user.id,"score",score);
                User.findByIdAndUpdate(user.id,
                    {$set: {rating:{score:score[0],numAnswers:len}}},
                    {new:true}
                ).then(user=>{
                    return user;
                })
            })
        })
        // console.log(allUsers);
        return res.status(200).json({allUsers});
    }
}


module.exports = {
    updateProfileRating:updateProfileRating
}