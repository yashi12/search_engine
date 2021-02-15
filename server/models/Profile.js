const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    location:{
        type:String
    },
    status:{
        type: String,
        required:true
    },
    skills:{
        type: [String],
        required:true
    },
    bio:{
        type:String
    },
    githubusername:{
        type:String
    },
    social:{
        linkedIn:{
            type:String
        },
        twitter:{
            type:String
        }
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Profile',ProfileSchema);