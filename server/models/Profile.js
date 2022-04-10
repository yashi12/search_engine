const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    skills:{
        type: [String],
        required:true
    },
    bio:{
        type:String
    },
    social:{
        linkedIn:{
            type:String
        },
        twitter:{
            type:String
        },
        githubusername:{
            type:String
        }
    },
    blockchainAddress:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    experience:[
        {
            title:{
                type:String,
                required: true,
                maxlength: 50
            },
            company: {
                type: String,
                required: true
            },
            from:{
                type:Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String,
                maxlength: 150
            }
        }
    ]
});

module.exports = mongoose.model('Profile',ProfileSchema);