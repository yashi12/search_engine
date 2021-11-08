const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerLikeSchema = new Schema({
    answer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
         
    }]
});

module.exports = mongoose.model('AnswerLike',AnswerLikeSchema);