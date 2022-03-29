const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoubtSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    },
    predictions :{
            sentence_embedding_bert:[{
            type : Number
            }],
            sentence_embedding_electra:[{
                type : Number
            }],
            sentence_embedding_use:[{
                type : Number
            }]
    },
    raisedAmount:{
        type: Number,
        required:true
    },
    mentor:[{
        mentorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount:{
            type:Number,
            required:true
        }
    }]
    
});


module.exports = mongoose.model('Doubt',DoubtSchema);
