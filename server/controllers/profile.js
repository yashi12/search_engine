const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const request = require('request');

const Profile = require('../models/Profile');
const User = require('../models/User');

const getProfile = (req, res) => {
    Profile.findOne({user: req.user.id})
        .populate('user', ['name','rating'])
        .then(profile => {
            if (!profile) {
                return res.json({msg: 'There is no profile for this User'});
            }
            res.json(profile);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({msg: 'Server error...'});
        });
};

const addProfile = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const { bio, skills, githubusername, linkedIn, twitter, blockchainAddress} = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (bio) profileFields.bio = bio;
    if (blockchainAddress) profileFields.blockchainAddress = blockchainAddress;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim().toLowerCase());
    }
    //Build social object
    profileFields.social = {};
    if (githubusername) profileFields.social.githubusername = githubusername;
    if (linkedIn) profileFields.social.linkedIn = linkedIn;
    if (twitter) profileFields.social.twitter = twitter;

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                //Update
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true})
                    .then(profile => {
                        return res.json(profile);
                    })
                    .catch(err => {
                        console.log(err.message);
                        return res.status(500).send('Server err..');
                    })
            } else {
                //Create
                profile = new Profile(profileFields);
                profile.save();
                res.json(profile);
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const getAllProfiles = (req, res) => {
    Profile.find().populate('user', ['name','rating'])
        .then(profiles => {
            res.json(profiles);
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).send('Server Error...');
        });

};

const getProfilesBySkill = (req, res) =>{

    // const skill = req.body.skills;
    const skill = req.params.skill;
    let newSkill=[];
    const title = skill.split(',');
    title.map(tag=>{
        tag=tag.toString().trim();
        tag=tag.toString().toLowerCase();
        newSkill.push(tag);
    });
    Profile.find({skills:{ $in: newSkill }}).populate('user', ['name','rating'])
        .then(profiles => {
            res.json(profiles);
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).send('Server Error...');
        });

};

const getUserProfile = (req, res) => {
    Profile.findOne({user: req.params.user_id}).populate('user', ['name','rating'])
        .then(profile => {
            if (!profile) {
                return res.status(400).json({msg: 'Profile not found'});
            }
            res.json(profile);
        })
        .catch(err => {
            console.log(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({msg: 'Profile not found'});
            }
            return res.status(500).send('Server Error...');
        })
};

const deleteProfile = (req, res) => {

    // @todo - remove users posts

    // Remove Profile
    Profile.findOneAndRemove({user: req.user.id})
        .then(result => {
            // Remove User
            User.findOneAndRemove({_id: req.user.id})
                .then(result => {
                    res.json({msg: 'User deleted'});
                });
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).send('Server error...');
        });
};

const addExperience = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {title, company, from, to, current, description} = req.body;

    const newExp = {
        title:title,
        company:company,
        from:from,
        to:to,
        current:current,
        description:description
    };

    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile)
                res.status(400).send('Profile not found');
            else{
                profile.experience.unshift(newExp);
                return profile.save();
            }
        })
        .then(profile=>{
            res.json(profile);
        })
        .catch(err=>{
            console.log(err.message);
            res.status(500).send('Server Error');
        })
};

const deleteExperience = (req,res,next)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile)
                res.status(400).send('Profile not found');
            else{
                const removeIndex = profile.experience.map(item => item._id)
                    .indexOf(req.params.exp_id);

                profile.experience.splice(removeIndex , 1);
                return profile.save();
            }
        })
        .then(profile=>{
            res.json(profile);
        })
        .catch(err=>{
            console.log(err.message);
            res.status(500).send('Server Error');
        });
}

module.exports = {
    getProfile: getProfile,
    addProfile: addProfile,
    getAllProfiles: getAllProfiles,
    getProfilesBySkill:getProfilesBySkill,
    getUserProfile: getUserProfile,
    deleteProfile: deleteProfile,
    addExperience: addExperience,
    deleteExperience:deleteExperience
}