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
        return res.status(404).json({errors: errors.array()});
    }

    User.findById(req.user.id)
        .then(user=>{
            if(!user)
                res.status(404).send('Profile not found');
            else if (req.body.title.length > 5)
                res.status(404).send('Max 5 titles...');
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

const getAllPosts = (req,res,next)=>{
    Post.find().sort({likeCount: -1, date: -1})
        .then(posts=>{
            res.json(posts);
        })
        .catch(err=>{
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const getPostsByTitleFilter = (req,res,next)=>{
    const title = req.body.title;
    Post.find({title: { $in: title }}).sort({likeCount: -1,date:-1})
        .then(posts=>{
            res.json(posts);
        })
        .catch(err=>{
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const getPostByID = (req,res,next)=>{
    Post.findById(req.params.id)
        .then(post=>{
            if(!post){
                res.status(404).json({msg:'No such post found'});
            }
            else{
                res.json(post);
            }
        })
        .catch(err=>{
            if(err.kind === 'ObjectId'){
                res.status(404).json({msg:'No such post found'});
            }
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const deletePostById = (req,res,next )=>{
    Post.findById(req.params.id)
        .then(post=>{
            if(!post){
                res.status(404).json({msg:'No such post found'});
            }
            //Check on user if post belongs to him
            if(post.user.toString() !== req.user.id){
                return res.status(401).json({msg: 'User not authorized to delete the post'});
            }
            else{
                return post.remove();
            }
        })
        .then(result=>{
            res.json({msg:'Post removed'});
        })
        .catch(err=>{
            if(err.kind === 'ObjectId'){
                res.status(404).json({msg:'No such post found'});
            }
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const likePost = (req,res,next)=>{
    Post.findById(req.params.id)
        .then(post=>{
            if(!post){
                res.status(404).json({msg:'No such post found'});
            }
            //Check if post already liked by user
            if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){
                const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
                post.likes.splice(removeIndex,1);
                post.likeCount = post.likeCount-1;
                // return res.status(400).json({msg: 'Post already liked'});
            }
            else{
                post.likes.unshift({user:req.user.id});
                post.likeCount = post.likeCount+1;
            }
            return post.save();
        })
        .then(post=>{
            res.json(post.likes);
        })
        .catch(err=>{
            if(err.kind === 'ObjectId'){
                res.status(404).json({msg:'No such post found'});
            }
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const addComment = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({errors: errors.array()});
    }

    User.findById(req.user.id)
        .then(user=>{
            if(!user)
                res.status(404).send('Profile not found');
            else{
                Post.findById(req.params.id)
                    .then(post=>{
                        const newComment ={
                            text : req.body.text,
                            user: req.user.id
                        };
                        post.comments.unshift(newComment);
                        return post.save();
                    })
                    .then(post=>{
                        res.json(post.comments);
                    })
                    .catch(err=>{
                        console.log(err.message);
                        res.status(500).send('Server Error...');
                    })
            }
        })
        .catch(err=>{
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

const deleteComment = (req,res,next)=>{
    Post.findById(req.params.id)
        .then(post=>{
            const comment = post.comments.find(comment => comment.id === req.params.comment_id);

            if(!comment){
                return res.status(404).json({msg: 'Comment does not exist'});
            }
            else {
                if(comment.user.toString() !== req.user.id){
                    return res.status(401).json({msg: 'User not authorized'});
                }
                else{
                    const removeIndex = post.comments.map(comment => comment._id.toString())
                        .indexOf(req.params.comment_id);
                    post.comments.splice(removeIndex,1);
                    post.save()
                        .then(post=>{
                            res.json(post.comments);
                        })
                        .catch(err=>{
                            if(err.kind === 'ObjectId'){
                                res.status(404).json({msg:'No such post found'});
                            }
                            console.log(err.message);
                            res.status(500).send('Server Error...');
                        })
                }
            }
        })
        .catch(err=>{
            if(err.kind === 'ObjectId'){
                res.status(404).json({msg:'No such comment found'});
            }
            console.log(err.message);
            res.status(500).send('Server Error...');
        });
};

module.exports = {
    addPost:addPost,
    getAllPosts:getAllPosts,
    getPostsByTitleFilter:getPostsByTitleFilter,
    getPostByID:getPostByID,
    deletePostById:deletePostById,
    likePost:likePost,
    addComment:addComment,
    deleteComment:deleteComment
}