const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const request = require('request');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');


const addPost = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    User.findById(req.user.id)
        .then(user=>{
            if(!user)
                res.status(400).send('Profile not found');
            else{
                const newPost = new Post({
                    text : req.body.text,
                    title: req.body.title,
                    user: req.user.id
                });
                return newPost.save();
            }
        })
        .then(post=>{
            res.json(post);
        })
        .catch(err=>{
            console.log(err.message);
            res.status(500).send('Server Error...');
        })
};

module.exports = {
    addPost:addPost
}