const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerCommentSchema = new Schema({
    answer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('AnswerComment',AnswerCommentSchema);