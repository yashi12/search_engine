const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    description:{
        type: String,
        required: true,
        minlength: 50
    },
    media:{
        type: String
    },
    likeCount:{
        type: Number,
        default: 0
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerLike'
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerComment'
    },
    date: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Answer',AnswerSchema);