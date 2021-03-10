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
    const topic = req.body.topic;
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }


    let newSkill = new Skill({
        topic: topic,
    })

    const days = 15;
    // Skill.findOneAndUpdate(
    //     {topic:topic, date:{ $gt: new Date().getTime() - (days * 24 * 60 * 60 * 1000) }})
    //     .then(res=>{
    //         console.log(res);
    //     })
    Skill.findOne({topic:topic})
        .then(skill=>{
            if(skill){
                let currDate = Date.now();
                let actualDate = skill.date;
                let numDays = parseInt(currDate-actualDate)/(1000*60*60*24);
                // console.log("date",numDays);
                if(numDays <= days)
                    return res.send(skill);
                else{
                    const apiUrl = `http://localhost:5000/result?query=${topic}` ;
                    fetch(apiUrl)
                        .then(data=>{
                            return data.json()
                        })
                        .then(dataval=>{
                            newSkill.udemy = dataval.data.udemy;
                            newSkill.coursera = dataval.data.coursera;
                            newSkill.youtube = dataval.data.youtube;
                            newSkill.blogs = dataval.data.blogs;
                            newSkill.likes = skill.likes;
                            newSkill.comments = skill.comments;
                            // newSkill.date = Date.now();
                            Skill.deleteOne({topic:topic})
                                .then(res=>{
                                    newSkill.save();
                                })
                                .catch(err=>{
                                    console.log(err.message);
                                })
                        })
                        .catch(err=>{
                            console.log(err.message);
                        })
                    return res.send(skill);
                }
            }
            else{
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
            }
        });
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
    const apiUrl = 'http://localhost:5000/result';
    const fetchResp= await fetch(apiUrl);
    const json = await fetchResp.json();
    return res.json(json);
}

module.exports = {
    addSkill: addSkill,
    fetchDataFromApi:fetchDataFromApi
}