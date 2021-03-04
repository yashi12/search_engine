const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const request = require('request');
const fetch = require('node-fetch');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Skill = require('../models/cources/Skill');


const addSkill = (req, res, next) => {
    const errors = validationResult(req);
    // const topic = req.params.topic;
    const topic = req.body.topic;
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }


    const newSkill = new Skill({
        topic: topic,
    })

    newSkill.save()
        .then(skill => {
            // const apiUrl='http://localhost:3000/api/skill/data';
            const apiUrl = `http://localhost:5000/result?query=${topic}` ;
            fetch(apiUrl)
                .then(data=>{
                    return data.json()
                })
                .then(dataval=>{
                    skill.udemy = dataval.data.udemy;
                    skill.coursera = dataval.data.coursera;
                    skill.youtube = dataval.data.youtube;
                    skill.blogs = dataval.data.blogs;
                    skill.save();
                })
                .catch(err=>{
                    console.log(err.message);
                })
            return res.send(skill);
        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).send({msg: 'Server error...'});
        })

};

/* Fetch data using promise*/
// const fetchDataFromApi= (req,res,next)=>{
//     const apiUrl = 'http://localhost:5000/result' ;
//     fetch(apiUrl)
//         .then(data=>{
//             return data.json()
//         })
//         .then(dataval =>{
//             console.log("dataval",dataval);
//             return res.json(dataval);
//         })
//         .catch(err=>{
//             console.log(err.message);
//             return res.status(500).send({msg: 'Api error...'});
//         })
// }

/* Fetch data using async-await*/
const fetchDataFromApi=async (req,res,next)=>{
    const apiUrl = 'http://localhost:5000/result' ;
    const fetchResp= await fetch(apiUrl);
    const json = await fetchResp.json();
    return res.json(json);
}

module.exports = {
    addSkill: addSkill,
    fetchDataFromApi:fetchDataFromApi
}