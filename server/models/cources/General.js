const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeneralCourseSchema = new Schema({
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
});

module.exports = mongoose.model('GeneralCourseSchema',GeneralCourseSchema);