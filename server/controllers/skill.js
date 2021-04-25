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

async function updateDataInBackground(newSkill,skill,topic){
    try {
        const apiUrl = `http://localhost:5000/result?query=${topic}`;
        const data = await fetch(apiUrl);
        const dataval =await data.json();
        // console.log("dataval",dataval);
        newSkill.udemy = dataval.data.udemy;
        newSkill.coursera = dataval.data.coursera;
        newSkill.youtube = dataval.data.youtube;
        newSkill.blogs = dataval.data.blogs;
        newSkill.likes = skill.likes;
        newSkill.comments = skill.comments;
        Skill.deleteOne({topic: topic})
            .then(res => {
                newSkill.save();
            })
            .catch(err => {
                console.log(err.message);
            });
    }catch (err){
        console.log(err.message);
    }
}

async function fetchPrerequisiteRelatedSkill(topic,finalResult){
    /*Fetch pre-requisites, related skills topic*/
    const apiUrl = `http://localhost:3000/api/skill/prerel/${topic}`;
    const fetchResp = await fetch(apiUrl);
    const json = await fetchResp.json();
    finalResult.prerequisites = json.prerequties;
    finalResult.related = json.related;
}

const addSkill =  async (req, res, next) => {
    const errors = validationResult(req);
    const rawTopic = req.body.topic;
    console.log("topic",rawTopic);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    /*Fetch query topic*/
    const apiUrlQuery = `http://localhost:3000/api/skill/query/${rawTopic}`;
    const fetchRespQuery = await fetch(apiUrlQuery);
    const jsonQuery = await fetchRespQuery.json();
    const topic = jsonQuery.topic;
    console.log("fetch query",topic);
    const finalResult = {
        "data":{},
        "prerequisites":{},
        "related":{}
    };

    await fetchPrerequisiteRelatedSkill(topic,finalResult);


    let newSkill = new Skill({
        topic: topic,
    });


    const days = 15;
    // Skill.findOneAndUpdate(
    //     {topic:topic, date:{ $gt: new Date().getTime() - (days * 24 * 60 * 60 * 1000) }})
    //     .then(res=>{
    //         console.log(res);
    //     })

    try {
        const skill = await Skill.findOne({topic: topic});
        if (skill) {
            let currDate = Date.now();
            let actualDate = skill.date;
            let numDays = parseInt(currDate - actualDate) / (1000 * 60 * 60 * 24);
            //If skill in DB return updated max before 15 days
            if (numDays <= days) {
                finalResult.data = skill;
                return res.send(finalResult);
                // return res.send(skill);
            }
            else {
                updateDataInBackground(newSkill,skill,topic);
                finalResult.data = skill;
                return res.send(finalResult);
            }
        }
        else {
            try {
                const skill = await newSkill.save();
                const apiUrl = `http://localhost:5000/result?query=${topic}`;
                const data = await fetch(apiUrl);
                const dataval =await data.json();
                skill.udemy = dataval.data.udemy;
                skill.coursera = dataval.data.coursera;
                skill.youtube = dataval.data.youtube;
                skill.blogs = dataval.data.blogs;
                await skill.save();
                finalResult.data = skill;
                return res.send(finalResult);
            }catch(err){
                console.log(err.message);
                return res.status(500).send({msg: 'Server error...'});
            }
        }
    }catch (err){
        console.log(err.message);
        return res.status(500).send({msg: 'Server error...'});
    }

    // Skill.findOne({topic: topic})
    //     .then(skill => {
    //         if (skill) {
    //             let currDate = Date.now();
    //             let actualDate = skill.date;
    //             let numDays = parseInt(currDate - actualDate) / (1000 * 60 * 60 * 24);
    //             // console.log("date",numDays);
    //             if (numDays <= days)
    //                 return res.send(skill);
    //             else {
    //                 const apiUrl = `http://localhost:5000/result?query=${topic}`;
    //                 fetch(apiUrl)
    //                     .then(data => {
    //                         return data.json()
    //                     })
    //                     .then(dataval => {
    //                         newSkill.udemy = dataval.data.udemy;
    //                         newSkill.coursera = dataval.data.coursera;
    //                         newSkill.youtube = dataval.data.youtube;
    //                         newSkill.blogs = dataval.data.blogs;
    //                         newSkill.likes = skill.likes;
    //                         newSkill.comments = skill.comments;
    //                         // newSkill.date = Date.now();
    //                         Skill.deleteOne({topic: topic})
    //                             .then(res => {
    //                                 newSkill.save();
    //                             })
    //                             .catch(err => {
    //                                 console.log(err.message);
    //                             })
    //                     })
    //                     .catch(err => {
    //                         console.log(err.message);
    //                     })
    //                 return res.send(skill);
    //             }
    //         } else {
    //             newSkill.save()
    //                 .then(skill => {
    //                     // const apiUrl='http://localhost:3000/api/skill/data';
    //                     const apiUrl = `http://localhost:5000/result?query=${topic}`;
    //                     fetch(apiUrl)
    //                         .then(data => {
    //                             return data.json()
    //                         })
    //                         .then(dataval => {
    //                             skill.udemy = dataval.data.udemy;
    //                             skill.coursera = dataval.data.coursera;
    //                             skill.youtube = dataval.data.youtube;
    //                             skill.blogs = dataval.data.blogs;
    //                             skill.save();
    //                         })
    //                         .catch(err => {
    //                             console.log(err.message);
    //                         })
    //                     return res.send(skill);
    //                 })
    //                 .catch(err => {
    //                     console.log(err.message);
    //                     return res.status(500).send({msg: 'Server error...'});
    //                 })
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err.message);
    //         return res.status(500).send({msg: 'Server error...'});
    //     });
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
const fetchDataFromApi = async (req, res, next) => {
    const apiUrl = 'http://localhost:5000/result';
    const fetchResp = await fetch(apiUrl);
    const json = await fetchResp.json();
    return res.json(json);
}

/* Fetch topic from query*/
const fetchQueryFromApi = async (req, res, next) => {
    const topic = req.params.topic;
    const apiUrl = `http://localhost:5000/query?query=${topic}`;
    const fetchResp = await fetch(apiUrl);
    const json = await fetchResp.json();
    return res.json(json);
}

/* Fetch pre-requisites, related skills*/
const fetchPrerequisiteRelatedSkillFromApi = async (req, res, next) => {
    const topic = req.params.topic;
    const apiUrl = `http://localhost:5000/prerel?query=${topic}`;
    const fetchResp = await fetch(apiUrl);
    const json = await fetchResp.json();
    return res.json(json);
}

module.exports = {
    addSkill: addSkill,
    fetchDataFromApi: fetchDataFromApi,
    fetchQueryFromApi: fetchQueryFromApi,
    fetchPrerequisiteRelatedSkillFromApi:fetchPrerequisiteRelatedSkillFromApi
}