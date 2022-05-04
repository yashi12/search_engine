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
const Doubt = require('../models/discussion/Doubt');
const Booking = require('../models/discussion/Booking');
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


const API = "http://2048-35-224-82-144.ngrok.io/ ";


let FormData = require('form-data');

const loadAPI = async (req,res)=>{
    let response = await fetch(API + "load-api");
    let data = await response.json();
    if(data["status"] === 200){
        return res.status(200).json({"message" : "Successfully Loaded API."});
    }
    return res.status(500).json({"error" : "Error in Loading API."});
}


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
            return await Question.findById(question._id,{id:1,title:1,description:1,tags:1,category:1})
                .then(ques => {
                    console.log("*",ques)
                    if(ques)
                        return ques;
                })
        }));
        console.log(similarQuesArray)
        return res.status(200).json({similarQuesArray});
}

const addDoubt = async (req, res, next) => {
    console.log("add doubt:");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    try {
        const {
            user,
            title,
            description,
            tags,
            media,
            date,
            raisedAmount
        } = req.body;
        const tempDoubt = {};
        tempDoubt.title = req.body.title;
        tempDoubt.description = req.body.description;
        tempDoubt.user = req.user.id;
        tempDoubt.raisedAmount=req.body.raisedAmount;
        // tempDoubt.predictions = {'sentence_embedding_bert' : [],'sentence_embedding_electra' : [],'sentence_embedding_use': [] };

        // let formData = new FormData();
        // formData.append("title" , req.body.title);
        // let response = await fetch(API + "generate-predictions",{
        //     method : "POST",
        //     body : formData
        // });
        // let data = await response.json();
        // if (data["status"] === 201){
        //     let predictions = data['predictions'];
        //     tempQuestion.predictions['sentence_embedding_bert'] = predictions["sentence_embedding_bert"];
        //     tempQuestion.predictions['sentence_embedding_electra'] = predictions["sentence_embedding_electra"];
        //     tempQuestion.predictions['sentence_embedding_use'] = predictions["sentence_embedding_use"];
        // }
        // console.log(data["status"]);

        if (tags) {
            tempDoubt.tags = tags.split(',').map(tag => tag.trim().toLowerCase());
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
                tempDoubt.media = data.Location;
                const newDoubt = new Doubt(tempDoubt);
                newDoubt.save()
                    .then(doubt => {
                        res.json(doubt);
                    })
                    .catch(err => {
                        res.status(500).send(err.message);
                    })
            });
        } else {
            const newDoubt = new Doubt(tempDoubt);
            const doubt = await newDoubt.save();
            res.json(doubt);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error...');
    }
};

const getAllDoubts = async(req, res, next) => {
    let pageNumber = req.query.page;
    let nPerPage = 15; // Number of questions per page
    
    await Doubt.find({user:{$ne:req.user.id}}).select({tags:1,_id:1,title:1,description:1,user:1,media:1,raisedAmount:1})
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

// const getMyDoubts = async(req, res, next) => {
//     let pageNumber = req.query.page;
//     let nPerPage = 15; // Number of questions per page
    
//     await Doubt.find({user:req.user.id}).select({tags:1,_id:1,title:1,description:1,user:1,media:1,raisedAmount:1})
//     .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
//     .limit( nPerPage )
//     .populate('user','id name').sort({
//             date: -1
//         })
//         .then(questions => {
//             res.json(questions);
//         })
//         .catch(err => {
//             console.log(err.message);
//             res.status(500).send('Server Error...');
//         });
// };

const getMyDoubts = async(req, res, next) => {
    let pageNumber = req.query.page;
    let nPerPage = 15; // Number of questions per page

    let doubts =  await Doubt.find({user:req.user.id}).select({tags:1,_id:1,title:1,description:1,user:1,media:1,raisedAmount:1})
    .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
    .limit( nPerPage )
    .populate('user','id name').sort({
            date: -1
        }).lean();
        
    // for(let i=0;i<doubts.length;i++) {
    //     console.log(doubts[i]._id)
    //     let status = await Booking.findOne({doubtId:doubts[i]._id});
    //     console.log(status);
    //     if(status){
    //         doubts[i].status = status;
    //         console.log("status is ",doubts[i]);
    //     }
    // }

    if(doubts){
        console.log(doubts, "\n sad\n");
        res.json(doubts);
    }
    else
    res.status(500).send('Server Error...');
};

const getToMentorDoubts = async(req, res, next) => {
    let pageNumber = req.query.page;
    let nPerPage = 15; // Number of questions per page
    
    const doubts = await Booking.find({mentorId:req.user.id}).select({doubtId:1,_id:0,amount:1,meetLink:1})
    .populate('doubtId','title description tags media raisedAmount');
    // for(i in doubts){
    //     doubts[i]=doubts[i].doubtId;
    // } lookup unwind $project
    // const finalDoubts = await Doubt.find({_id:{$in:doubts}}).select({user:1,title:1,description:1,tags:1,media:1,date:1});
    // const finalDoubts = await Booking.aggregate([
    //     {
    //         $lookup:
    //         {
    //             from: "doubts",
    //             localField:"doubtId",
    //             foreignField: "_id",
    //             as:"Doubt"
    //         }
    //     }
    // ])
    res.status(200).send(doubts);
    // res.status(200).send(finalDoubts);
    if(!doubts) {
        console.log(err.message);
        res.status(500).send('Server Error...')
    }
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
    let pageNumber = req.query.page;
    let nPerPage = 2; // Number of questions per page
    console.log("category", category);
    Question.find({
        category: category
    })
    .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
    .limit( nPerPage )
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

const updateQuestion = async(req, res, next) => {
    //@todo - remove media option
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    const id = req.params.id;
    const question = await Question.findById(id);
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
    let description;
    if(req.body.description)
        description = req.body.description;
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
        return res.status(404).json({
            msg: 'No such doubt found'
        });
    }
    const booking = await Booking.findOne({doubtId:doubtId,mentorId:mentorId});
    if (booking) {
        if(!description)
            description = booking.description;
        Booking.findOneAndUpdate({doubtId:doubtId,mentorId:mentorId},{$set:{amount:amount, description:description}},{new:true})
        .then(booking => {
            return res.json(booking);
        }).catch(err => {
            res.status(500).send(err.message);
        })
    }else{
        let newBooking = {};
        newBooking.doubtId = doubtId;
        newBooking.mentorId = mentorId;
        newBooking.userId = doubt.user;
        newBooking.amount=amount;
        newBooking.description = description;
    
        const newBookingIs = new Booking(newBooking);
        newBookingIs.save()
                        .then(booking => {
                            res.json(booking);
                        })
                        .catch(err => {
                            res.status(500).send(err.message);
                        })
    }
   

    // const mentor = await Doubt.findOne({_id:doubtId,mentor:{$elemMatch:{mentorId:mentorId}}});
    // if (mentor) {
    //     return res.status(404).json({
    //         msg: 'Amount already raised'
    //     });
    // }
    // Doubt.findByIdAndUpdate(
    //     doubtId,
    //     {$push:{mentor:{mentorId:mentorId,amount:amount}}},
    //     {new:true}
    // ).then(doubt => {
    //     return res.json(doubt);
    // })
    // .catch(err => {
    //     res.status(500).send(err.message);
    // })
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
    addDoubt: addDoubt,
    getAllDoubts: getAllDoubts,
    getMyDoubts:getMyDoubts,
    getToMentorDoubts:getToMentorDoubts,
    mentorDoubt: mentorDoubt,
    changePrice: changePrice
    // getAllQuestionsByCategory: getAllQuestionsByCategory,
    // updateQuestion: updateQuestion,
    // deleteQuestion: deleteQuestion,
    // getQuestionById: getQuestionById,
    // getAllPredictions : getAllPredictions,
    // loadAPI : loadAPI,
    // findSimilarQuestion:findSimilarQuestion
    // getQuestionsBy3Tag: getQuestionsByTag,
}
