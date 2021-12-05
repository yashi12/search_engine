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
        let arr=[];
        Answer.find({user:user._id}).select('likeCount')
        .then(answers=>{
            len = answers.length,score=0;
            answers.map(answer=>{
                arr.push(answer.likeCount);
            })
            const mid=Math.floor(arr.length/2);
            arr.sort();
            if(arr.length>0)
                score = arr[mid];
            console.log(mid,score,len);
            resolve({score,len,arr});
        });
    })
}

const updateProfileRating  = async(req,res,next)=>{
    const allUsers = await User.find({},{id:1,rating:1});
    if(allUsers){
        let meanArr=[],meanSumRating=0;
        let updatedUsers=await Promise.all(allUsers.map(async(user)=>{
            return findAnswers(user).then(async(score)=>{
                console.log(user.id,"score",score);
                let meanScore = score.score*score.len;
                meanSumRating += meanScore;
                meanArr.push(meanScore);
                return User.findByIdAndUpdate(user.id,
                    {$set: {rating:{meanLikes:meanScore,numAnswers:score.len}}},
                    {new:true}
                ).select({id:1,rating:1}).then(user=>{
                    console.log(user.id,"score",user.rating);
                    return user;
                })
            })
        }))
        meanArr.sort();
        let mxRating = meanArr[meanArr.length-1];
        let minRating = meanArr[0];
        newUsers = await Promise.all(allUsers.map(async(user)=>{
            let newValue = (((user.rating.meanLikes - minRating) * (5 - 0)) / (mxRating - minRating)) + 0;
            console.log(newValue);
            return User.findByIdAndUpdate(user.id,
                {$set: {rating:{rating:newValue}}},
                {new:true}
            ).select({id:1,rating:1}).then(user=>{
                console.log(user.id,"score",user.rating);
                return user;
            })
        }))
        
        console.log(updatedUsers);
        return res.status(200).json({newUsers});
    }
}


module.exports = {
    updateProfileRating:updateProfileRating
}