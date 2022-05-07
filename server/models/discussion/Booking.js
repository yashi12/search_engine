const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  doubtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doubt",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    // required: true,
    minlength: 20,
    maxlength: 100,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  meetLink: {
    type: String,
    // required: true
  },
  amount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "pending",
  },
  userMetamassAddress: {
    type: String,
    // required:true
  },
  mentorMetamassAddress: {
    type: String,
    // required:true
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
