const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    userName:{
        type: String,
        default: "Anonymous"
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 2']
    },
    image:{
        type: String
    },
    likeCount:{
        type: Number,
        default: 0
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
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
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

function arrayLimit(val) {
    return val.length <= 2;
}

module.exports = mongoose.model('Post',PostSchema);