const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    tags:{
        type: [String],
        ref: 'Tag'
    },
    questions:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Question'
    },
    numTags:{
        type: Number,
        default:0
    },
    numQuestions:{
        type: Number,
        default:0
    }
});

module.exports = mongoose.model('Category',CategorySchema);