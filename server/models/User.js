const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    fromID : {
        type : String,
        required : true
    },
    content : [{
        messenger : String,
        message : String
    }]
});

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
        meanLikes:{
            type: Number,
            default: 0
        },   
        numAnswers:{
            type: Number,
            default: 0
        },
        rating:{
            type: Number,
            default: 0
        }
    },
    messages :{
        type : [messageSchema],
        default : []
    },
    latestMessageNotifications : {
        type : [String],
        default : []
    },
});

module.exports = mongoose.model('User',UserSchema);
mongoose.model("Message",messageSchema);
