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

const Answer = require('../models/discussion/Answer');
const Question = require('../models/discussion/Question');
const AnswerComment = require('../models/discussion/AnswerComment');
const AnswerLike = require('../models/discussion/AnswerLike');
const Category = require('../models/discussion/Category');
const User = require('../models/User');
const ContentMiddleware = require('../middleware/content');


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

// Add answer_id to question
const addAnswerToQuestion = (ques_id, ans_id) => {
    Question.findByIdAndUpdate(ques_id, {
            $push: {
                answers: ans_id
            }
        })
        .catch(error => {
            console.log("err:", error.message);
        });
};

// Post new question
const addAnswer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    try {
        const tempAnswer = {};
        Question.findById(req.params.ques_id)
            .then(question => {
                if (!question)
                    res.status(404).json({
                        msg: 'No such question found'
                    });
            })

        const {
            description,
            media,
            likeCount,
            likes,
            comments
        } = req.body;

        tempAnswer.question = req.params.ques_id;
        tempAnswer.description = req.body.description;
        tempAnswer.user = req.user.id;

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
            s3.upload(params, (error, data) => {
                if (error) {
                    res.status(500).send(error);
                }
                tempAnswer.media = data.Location;
                const newAnswer = new Answer(tempAnswer);
                newAnswer.save()
                    .then(answer => {
                        res.json(answer);
                    })
                    .catch(err => {
                        res.status(500).send(err.message);
                    })
            });
        } else {
            const newAnswer = new Answer(tempAnswer);
            const answer = await newAnswer.save();
            addAnswerToQuestion(req.params.ques_id, answer._id);
            res.json(answer);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error...');
    }
};

const getAllQuestions = (req, res, next) => {
    Question.find().sort({
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

const getAnswerById = (req, res, next) => {
    const ans_id = req.params.ans_id;
    Answer.findById(ans_id)
        .then(answer => {
            if (!answer.deleted)
                res.json(answer);
            else
                res.json({
                    data: "Deleted by User",
                    deleted: true
                });
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};


const updateAnswer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errors: errors.array()
        });
    }
    const id = req.params.ans_id;
    Answer.findById(id)
        .then(answer => {
            if (!answer) {
                res.status(404).json({
                    msg: 'No such answer found'
                });
            }
            //Check on user if answer belongs to user
            if (answer.user.toString() !== req.user.id) {
                return res.status(401).json({
                    msg: 'User not authorized to update the answer'
                });
            }
            const {
                description,
                media
            } = req.body;
            const tempAnswer = {};

            tempAnswer.description = description;

            if (media) {
                tempAnswer.media = media;
            }

            if (req.file) {
                ContentMiddleware.removeMedia(answer);
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
                    tempAnswer.media = data.Location;
                    Answer.findByIdAndUpdate(id, {
                            $set: {
                                description: tempAnswer.description,
                                media: tempAnswer.media,
                            }
                        }, {
                            new: true
                        }).then(ans => {
                            return res.json(ans);
                        })
                        .catch(err => {
                            res.status(500).send(err.message);
                        })
                });
            } else {
                ContentMiddleware.removeMedia(answer);
                Answer.findByIdAndUpdate(id, {
                    $set: {
                        description: tempAnswer.description
                    },
                    $unset: {
                        media: ""
                    }
                }, {
                    new: true
                }).then(ans => {
                    res.json(ans);
                }).catch(err => {
                    res.status(500).send(err.message);
                })
            }
        })
};

const deleteAnswer = (req, res, next) => {
    console.log("delete");
    const id = req.params.ans_id;
    Answer.findOneAndUpdate({
            $and: [{
                _id: id,
                user: req.user.id
            }]
        }, {
            $set: {
                deleted: true
            }
        })
        .then(answer => {
            res.json(answer);
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send(err.message);
        })
};

const addCommentToAnswer = async (req, res, next) => {
    const ansId = req.query.ans_id;
    const answer = await Answer.findById(ansId);
    if (!answer)
        res.status(400).send('no such answer exists');
    const commentSection = await AnswerComment.findOne({
        answer: ansId
    });
    // If answer has no previous comments
    if (!commentSection) {
        const comment = {};
        comment.answer = ansId;
        comment.comments.push({
            user: req.user._id,
            text: req.body.text
        })
        const newComment = new AnswerComment(comment);
        newComment.save();
    } else { // If answer has previous comments
        const comment = {};
        commentSection.comments.push({
            user: req.user._id,
            text: req.body.text
        })

    }

};

const likeanswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) {
            res.status(404).json({
                msg: 'No such answer found'
            });
        }
        let options = {
            upsert: true,
            returnNewDocument: true,
            new: true
        };
        const answerLike = await AnswerLike.findOneAndUpdate({
            answer: req.params.id,
        }, {
            $cond:{
                if: {"likes":{"user":{$in: [ req.user.id ]}}},
                then:{
                    $pull: { likes : { "user":{$in: [ req.user.id ]} }}
                },else:{
                    $push: {
                        "likes": {
                            "user": req.user.id
                        }
                    }
                }
            }
        }, options);
        console.log("answerLike",answerLike);
        const updatedAnswer = await Answer.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                "likes": answerLike.id,
                "likeCount": answerLike.likes.length
            }
        },{returnNewDocument: true});
        res.status(200).send(updatedAnswer);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }

};

module.exports = {
    addAnswer: addAnswer,
    updateAnswer: updateAnswer,
    // getAllQuestions: getAllQuestions,
    getAnswerById: getAnswerById,
    // updateQuestion: updateQuestion,
    deleteAnswer: deleteAnswer,
    addCommentToAnswer: addCommentToAnswer,
    likeAnswer: likeanswer
}