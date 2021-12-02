const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        // required:true
        unique: true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmedEmail:{
        type:Boolean,
        default:false
    },
    rating:{
        score:{
            type: Number,
            default: 0
        },    
        numAnswers:{
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model('User',UserSchema);