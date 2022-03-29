const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    doubtId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doubt'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    mentorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
    meetLink:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        default:0
    },
    status:{
        type: String,
        default: "pending"
    }
});

module.exports = mongoose.model('Booking',BookingSchema);