const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const GeneralCourseSchema = require('./General');
const GeneralCourseSchema = {
    image:{
        type:String
    },
    instructor:{
        type:String
    },
    link:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    level:{
        type:String,
    },
    rating:{
        type:Number
    }
};

const SkillSchema = new Schema({
    topic:{
        type:String,
        required:true,
        unique:true
    },
    blogs:{
        type: [GeneralCourseSchema]
    },
    udemy:{
        type: [GeneralCourseSchema]
    },
    coursera:{
        type: [GeneralCourseSchema]
    },
    youtube:{
        type: [GeneralCourseSchema]
    },
    likes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'users'
            }
        }
    ],
    comments:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'users'
            },
            text:{
                type:String,
                required:true,
                date:{
                    type:Date,
                    default:Date.now()
                }
            }
        }
    ],
    date:{
        type:Date,
        default:Date.now()
    },
    count:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model('Skill',SkillSchema);