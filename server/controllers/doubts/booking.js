const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
    check,
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const request = require('request');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const Doubt = require('../../models/discussion/Doubt');
const Answer = require('../../models/discussion/Answer');
// const Tag = require('../models/discussion/Tag');
const Category = require('../../models/discussion/Category');
const User = require('../../models/User');
const Booking = require('../../models/discussion/Booking');
const ContentMiddleware = require('../../middleware/content');
const {
    paginatedResults
} = require('../helper/pagenation');
const {raw} = require("config/raw");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

let FormData = require('form-data');

const bookMentor = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    try {
        const doubtId = req.params.doubt_id;
        const mentorDoubtId = req.params.id;
        const doubt = await Doubt.findOne(
            {$and:[{_id:doubtId},
                { mentor: { $elemMatch: {_id: mentorDoubtId } } }    
            ]}
        );
        if (!doubt) {
            return res.status(404).json({
                msg: 'No such doubt found'
            });
        }else{
            let tempObj={};
            for(var i = 0; i < doubt.mentor.length; i++){
                if(doubt.mentor[i]._id == mentorDoubtId){
                    tempObj= {amount:doubt.mentor[i].amount,mentorId: doubt.mentor[i].mentorId};
                }
            }
            const tempBooking = {};
            tempBooking.doubtId = doubtId;
            tempBooking.userId = req.user.id;
            tempBooking.mentorId = tempObj.mentorId;
            tempBooking.amount = tempObj.amount;
            tempBooking.status = "initiated";
            tempBooking.meetLink = "https://meet.google.com/frs-uzpg-fgv";
            const newBooking = new Booking(tempBooking);
                newBooking.save()
                    .then(booking => {
                        res.json(booking);
                    })
                    .catch(err => {
                        res.status(500).send(err.message);
                    })
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error...');
    }
};


const getAllDoubts = async(req, res, next) => {
    let pageNumber = req.query.page;
    let nPerPage = 15; // Number of questions per page
    
    await Doubt.find().select({tags:1,_id:1,title:1,description:1,user:1,media:1,raisedAmount:1})
    .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
    .limit( nPerPage )
    .populate('user','id name').sort({
            date: -1
        })
        .then(questions => {
            res.json(questions);
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const mentorDoubt = async(req,res,next)=>{
    console.log("hi")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    const doubtId = req.params.id;
    const mentorId = req.user.id;
    console.log(mentorId);
    const amount = req.body.amount;
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
        return res.status(404).json({
            msg: 'No such doubt found'
        });
    }
    const mentor = await Doubt.findOne({mentor:{$elemMatch:{mentorId:mentorId}}});
    if (mentor) {
        return res.status(404).json({
            msg: 'Amount already raised'
        });
    }
    Doubt.findByIdAndUpdate(
        doubtId,
        {$push:{mentor:{mentorId:mentorId,amount:amount}}},
        {new:true}
    ).then(doubt => {
        return res.json(doubt);
    })
    .catch(err => {
        res.status(500).send(err.message);
    })
}

const changePrice = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    const doubtId = req.params.doubt_id;
    const mentorDoubtId = req.params.id;
    const amount = req.body.amount;
    
    console.log("amount",amount);
    console.log("mentorDoubtId",mentorDoubtId);
    Doubt.findOneAndUpdate(
        {$and:[{_id:doubtId},
            { mentor: { $elemMatch: {_id: mentorDoubtId } } }    
        ]},
        {
            $set:{"mentor.$.amount": amount } 
        },
        {new:true}
    ).then(doubt => {
        return res.json(doubt);
    })
    .catch(err => {
        res.status(500).send(err.message);
    })
    
  
}




module.exports = {
    bookMentor: bookMentor
}
