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

const confirmMentor = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;
        Booking.findOneAndUpdate(
            {$and:[{_id:bookingId},
                { userId: userId }    
            ]},
            {$set: {status:"accepted"}},
            {new:true}
        ) .then(booking => {
            console.log(booking);
            res.json(booking);
        })
        .catch(err => {
            res.status(500).send(err.message);
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error...');
    }
};

const bookedDoubtSolved = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;
        Booking.findOneAndUpdate(
            {$and:[{_id:bookingId},
                { userId: userId }    
            ]},
            {$set: {status:"solved"}},
            {new:true}
        ) .then(booking => {
            console.log(booking);
            res.json(booking);
        })
        .catch(err => {
            res.status(500).send(err.message);
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error...');
    }
};



module.exports = {
    bookMentor: bookMentor,
    confirmMentor: confirmMentor,
    bookedDoubtSolved: bookedDoubtSolved
}
