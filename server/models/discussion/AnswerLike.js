const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerLikeSchema = new Schema({
    answer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ]
});

module.exports = mongoose.model('AnswerLike',AnswerLikeSchema);