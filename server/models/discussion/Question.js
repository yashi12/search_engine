const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    answers:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Answer'
    },
    category:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
        minlength: 20
    },
    tags:{
        type: [String]
    },
    media:{
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question',QuestionSchema);