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
const Question = require('../models/discussion/Question');
const Answer = require('../models/discussion/Answer');
// const Tag = require('../models/discussion/Tag');
const Category = require('../models/discussion/Category');
const User = require('../models/User');
const ContentMiddleware = require('../middleware/content');
const {
    paginatedResults
} = require('./helper/pagenation');
const {raw} = require("config/raw");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

const API = "http://f034-34-73-20-73.ngrok.io/";

let FormData = require('form-data');

const loadAPI = async (req,res)=>{
    let response = await fetch(API + "load-api");
    let data = await response.json();
    if(data["status"] === 200){
        return res.status(200).json({"message" : "Successfully Loaded API."});
    }
    return res.status(500).json({"error" : "Error in Loading API."});
}
const addQuestionToCategory = (categoryName, ques) => {
    Category.findOne({
            name: categoryName
        })
        .then(category => {
            if (category) {
                let tagArray = [];
                if (ques.tags) {
                    ques.tags.map(tag => {
                        let flag = 0;
                        category.tags.map(presentTag => {
                            if (tag.toString() == presentTag.toString()) {
                                flag = 1;
                                return;
                            }
                        });
                        if (flag == 0) {
                            tagArray.push(tag);
                        }
                    })
                }
                Category.findByIdAndUpdate(category._id, {
                        numQuestions: category.numQuestions + 1,
                        $addToSet: {
                            questions: ques
                        },
                        $push: {
                            tags: {
                                $each: tagArray
                            }
                        }
                    })
                    .catch(err => {
                        console.error("Fail add question to category:", err.message);
                    })

            } else {
                const category = {};
                if (ques.tags) {
                    category.tags = ques.tags;
                }
                category.name = categoryName;
                category.questions = ques;
                category.numQuestions = 1;
                new Category(category).save()
                    .catch(err => {
                        console.error("Fail add question to category:", err.message);
                    })
            }
        })
        .catch(err => {
            console.error("Fail add question to category:", err.message);
        });
};

const findSimilarQuestion = async (req,res,next) => {
    console.log("body",req.body.title);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    const title = req.body.title;
    console.log("enter",title)
    const tempPredictions = {'sentence_embedding_bert' : [],'sentence_embedding_electra' : [],'sentence_embedding_use': [] };
    let formData = new FormData();
        formData.append("title" , title);
        let response = await fetch(API + "generate-predictions",{
            method : "POST",
            body : formData
        });
        let data = await response.json();
        if (data["status"] === 201){
            let predictions = data['predictions'];
            tempPredictions['sentence_embedding_bert'] = predictions["sentence_embedding_bert"];
            tempPredictions['sentence_embedding_electra'] = predictions["sentence_embedding_electra"];
            tempPredictions['sentence_embedding_use'] = predictions["sentence_embedding_use"];
        }
        console.log(data["status"]);
        let formData2 = new FormData();
        formData2.append("predictions" , JSON.stringify(tempPredictions));

        let response2 = await fetch(API + "get-similar-questions",{
            method : "POST",
            body : formData2
        });
        let data2 = await response2.json();

        let similarQuestions = {};
        if (data2['status'] === 201){
            similarQuestions = data2['similarQuestions'];
        }
        console.log("similarQuestions",similarQuestions);
        let similarQuesArray = await Promise.all( similarQuestions.map(async (question)=>{
            return await Question.findById(question._id,{id:1,title:1,description:1})
                .then(ques => {
                    console.log("*",ques)
                    if(ques)
                        return ques;
                })
        }));
        console.log(similarQuesArray)
        return res.status(200).json({similarQuesArray});
}

const addQues = async (req, res, next) => {
    console.log("add ques:");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    try {
        const {
            user,
            answer,
            title,
            description,
            media,
            category,
            tags,
            date
        } = req.body;
        const tempQuestion = {};
        tempQuestion.category = req.body.category;
        tempQuestion.title = req.body.title;
        tempQuestion.description = req.body.description;
        tempQuestion.user = req.user.id;
        tempQuestion.predictions = {'sentence_embedding_bert' : [],'sentence_embedding_electra' : [],'sentence_embedding_use': [] };

        let formData = new FormData();
        formData.append("title" , req.body.title);
        let response = await fetch(API + "generate-predictions",{
            method : "POST",
            body : formData
        });
        let data = await response.json();
        if (data["status"] === 201){
            let predictions = data['predictions'];
            tempQuestion.predictions['sentence_embedding_bert'] = predictions["sentence_embedding_bert"];
            tempQuestion.predictions['sentence_embedding_electra'] = predictions["sentence_embedding_electra"];
            tempQuestion.predictions['sentence_embedding_use'] = predictions["sentence_embedding_use"];
        }
        console.log(data["status"]);
        let formData2 = new FormData();
        formData2.append("predictions" , JSON.stringify(tempQuestion.predictions));

        // let response2 = await fetch(API + "get-similar-questions",{
        //     method : "POST",
        //     body : formData2
        // });
        // let data2 = await response2.json();

        // let similarQuestions = {};
        // if (data2['status'] === 201){
        //     similarQuestions = data2['similarQuestions'];
        // }
        // console.log(similarQuestions);

        if (tags) {
            tempQuestion.tags = tags.split(',').map(tag => tag.trim().toLowerCase());
        }

        if (req.file) {
            const file = req.file.originalname.split(".");
            const fileType = file[file.length - 1];
            const currDate = new Date().toISOString();
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${currDate}.${fileType}`,
                Body: req.file.buffer,
                ContentType: 'file'
            };
            console.log("s3");
            s3.upload(params, (error, data) => {
                if (error) {
                    res.status(500).send(error);
                }
                tempQuestion.media = data.Location;
                const newQuestion = new Question(tempQuestion);
                newQuestion.save()
                    .then(ques => {
                        addQuestionToCategory(req.body.category, ques);
                        res.json(ques);
                    })
                    .catch(err => {
                        res.status(500).send(err.message);
                    })
            });
        } else {
            const newQuestion = new Question(tempQuestion);
            const ques = await newQuestion.save();
            addQuestionToCategory(req.body.category, ques);
            res.json(ques);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error...');
    }
};

const getAllQuestions = (req, res, next) => {
    Question.find().populate('user','id name').populate('answers', 'id', {deleted: false}).sort({
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

const getAllPredictions = (req,res,next) => {
    console.log('entered')
  Question.find({},'predictions',{},(error,predictions)=>{
      if(error){
          return res.status(500).json({err : error ,status : 500});
      }
      console.log(predictions);
      return res.status(200).json({predictions : predictions,status : 200});
  })
//   Question.find({}).select('predictions')
//   .then(predictions=>{
//         console.log(predictions);
//         return res.status(200).json({predictions : predictions,status : 200});
//     })
}

const getAllQuestionsByCategory = (req, res, next) => {
    const category = req.params.category;
    console.log("category", category);
    Question.find({
        category: category
    })
    .then(ques => {
        res.json(ques);
    }).catch(err => {
                console.log(err.message);
                res.status(500).send('Server Error...');
            });

    // Category.findOne({
    //         name: category
    //     })
    //     .then(category => {
    //         Question.find({
    //                 _id: {
    //                     $in: category.questions
    //                 }
    //             })
    //             .then(ques => {
    //                 res.json(ques);
    //             })
    //     })
    //     .catch(err => {
    //         console.log(err.message);
    //         res.status(500).send('Server Error...');
    //     });
};

const getQuestionsByTag = (req, res, next) => {
    Question.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    msg: 'No such post found'
                });
            } else {
                res.json(post);
            }
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    msg: 'No such post found'
                });
            }
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const updateQuestion = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    const id = req.params.id;
    Question.findById(id)
        .then(question => {
            if (!question) {
                res.status(404).json({
                    msg: 'No such question found'
                });
            }
            //Check on user if question belongs to him
            if (question.user.toString() !== req.user.id) {
                return res.status(401).json({
                    msg: 'User not authorized to update the question'
                });
            }
            const {
                user,
                answer,
                title,
                description,
                media,
                category,
                tags,
                date
            } = req.body;
            const tempQuestion = {};

            tempQuestion.category = req.body.category;
            tempQuestion.title = req.body.title;
            tempQuestion.description = req.body.description;

            if (tags) {
                tempQuestion.tags = tags.split(',').map(tag => tag.trim().toLowerCase());
            }

            if (req.file) {
                ContentMiddleware.removeMedia(question);
                const file = req.file.originalname.split(".");
                const fileType = file[file.length - 1];
                const currDate = new Date().toISOString();
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `${currDate}.${fileType}`,
                    Body: req.file.buffer,
                    ContentType: 'file'
                };
                s3.upload(params, (error, data) => {
                    if (error) {
                        res.status(500).send(error);
                    }
                    tempQuestion.media = data.Location;
                    Question.findByIdAndUpdate(id, {
                            $set: tempQuestion
                        }, {
                            new: true
                        }).then(ques => {
                            // @todo check if to maintain category wise question and update
                            // addQuestionToCategory(req.body.category, ques);
                            return res.json(ques);
                        })
                        .catch(err => {
                            res.status(500).send(err.message);
                        })
                });
            } else {
                Question.findByIdAndUpdate(id, {
                    $set: tempQuestion
                }, {
                    new: true
                }).then(ques => {
                    // @todo check if to maintain category wise question and update
                    // addQuestionToCategory(req.body.category, ques);
                    res.json(ques);
                }).catch(err => {
                    res.status(500).send(err.message);
                })
            }
        })
};

const deleteQuestion = (req, res, next) => {
    const id = req.params.id;
    Question.findOneAndDelete({
            $and: [{
                _id: id,
                user: req.user.id
            }]
        })
        .then(question => {
            ContentMiddleware.removeMedia(question);
            res.json(question);
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send(err.message);
        })
};

const getQuestionById = (req, res, next) => {
    console.log("question enetered");
    const ques_id = req.params.ques_id;
    Question.findById(ques_id).populate('user','id name email')
        .then(question => {
            const result = {};
            result.result = question;
            if (!question)
                res.json({
                    data: "No question present"
                });
            else {
                if (question.answers) {
                    const answers = question.answers;
                    const length = answers.length;

                    let pagenation = paginatedResults(length, req.query.page);
                    if (!pagenation.indexes)
                        res.status(500).json(pagenation);
                    result.previous = pagenation.previous;
                    result.next = pagenation.next;
                    result.indexes = pagenation.indexes;
                    try {
                        console.log(result)
                        let requiredAnswers = answers.slice(result.indexes.startIndex, result.indexes.endIndex);
                        Answer.find({
                            _id: {
                                $in: requiredAnswers
                            },
                            deleted:false
                            // $or:[
                            // {$and:[ {user:{$eq:req.user.id}},{deleted:{$exists:true}}]}, // show deleted ans if user has deleted it
                            // {$and:[ {user:{$ne:req.user.id}},{deleted:false}]} // do not show deleted answer if user has not given it
                            // ]
                        })
                        .populate('user','id name email')
                        .then(fetchedAnswers => {
                            console.log(fetchedAnswers)
                            result.answers = fetchedAnswers;
                            res.json(result);
                        })
                    } catch (e) {
                        res.status(500).json({
                            message: e.message
                        })
                    }
                } else {
                    console.log("res:")
                    res.json(result);
                }
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};



module.exports = {
    addQues: addQues,
    getAllQuestions: getAllQuestions,
    getAllQuestionsByCategory: getAllQuestionsByCategory,
    updateQuestion: updateQuestion,
    deleteQuestion: deleteQuestion,
    getQuestionById: getQuestionById,
    getAllPredictions : getAllPredictions,
    loadAPI : loadAPI,
    findSimilarQuestion:findSimilarQuestion
    // getQuestionsByTag: getQuestionsByTag,
}
