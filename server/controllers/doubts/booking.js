const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const request = require("request");
const AWS = require("aws-sdk");
const fetch = require("node-fetch");
const Doubt = require("../../models/discussion/Doubt");
const Answer = require("../../models/discussion/Answer");
// const Tag = require('../models/discussion/Tag');
const Category = require("../../models/discussion/Category");
const User = require("../../models/User");
const Booking = require("../../models/discussion/Booking");
const ContentMiddleware = require("../../middleware/content");
const { paginatedResults } = require("../helper/pagenation");
const { fetchMetamassAddress } = require("../helper/services");
const { raw } = require("config/raw");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

let FormData = require("form-data");

/* Here the user initiates a contract where his amount gets deducted but is not sent to the mentor
the amount is held by the the third party application we are using
Booking status
pending-->initiated
*/

const bookMentor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  try {
    const doubtId = req.params.doubt_id;
    const mentorDoubtId = req.params.id;
    const userId = req.user.id;
    const userMetamaskAddress = req.body.user_address;

    const booking = await Booking.findOne({
      doubtId: doubtId,
      mentorId: mentorDoubtId,
      userId: userId,
    });
    if (!booking) {
      return res.status(404).json({
        msg: "No such booking found",
      });
    } else {
      // let user_address = await fetchMetamassAddress(userId);
      // let mentor_address = await fetchMetamassAddress(mentorDoubtId);
      // console.log(user_address);
      // console.log(mentor_address);
      Booking.findOneAndUpdate(
        { doubtId: doubtId, mentorId: mentorDoubtId, userId: userId },
        {
          $set: {
            status: "initiated",
            userMetamaskAddress: userMetamaskAddress,
          },
        },
        { new: true }
      )
        .then((booking) => {
          let resp = {};
          resp["booking"] = booking;
          // resp["userAddres"] = userMetamaskAddress;
          // resp["mentorAddress"] = mentorMetamaskAddress;
          res.json(resp);
        })
        .catch((err) => {
          res.status(500).send(err.message);
        });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error...");
  }
};

/* Mentor confirms a doubt and finally the contact is legal ie. signed by both parties
 */

const confirmMentor = async (req, res, next) => {
  console.log("confirm mentor");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    Booking.findOneAndUpdate(
      { $and: [{ _id: bookingId }, { mentorId: userId }] },
      { $set: { status: "accepted" } },
      { new: true }
    )
      .then((booking) => {
        if (booking == null)
          res.status(404).send("no such booking is initiated by the user");
        else {
          res.json(booking);
          Doubt.findOneAndUpdate(
            { _id: booking.doubtId },
            { $set: { status: "in process" } },
            { new: true }
          ).then((doubt) => {});
        }
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error...");
  }
};

/* Mark doubt finally as solved, many conditions
- user marks as solved (currently fulfilling)
- mentor says solved, user denies
- mentor denies
*/

const markDoubtSolved = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  try {
    const doubtId = req.params.id;
    const userId = req.user.id;
    Doubt.findOneAndUpdate(
      { $and: [{ _id: doubtId }, { user: userId }] },
      { $set: { status: "solved" } },
      { new: true }
    )
      .then((doubt) => {
        if (doubt == null) res.status(404).send("no such doubt found");
        else {
          res.json(doubt);
        }
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error...");
  }
};

const getDoubtsUserInitiateContract = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  try {
    const userId = req.user.id;

    await Booking.find({
      userId: userId,
      status: "initiated",
    })
      .select({ doubtId: 1, _id: 0 })
      .then((bookings) => {
        res.json(bookings);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error...");
  }
};

module.exports = {
  bookMentor: bookMentor,
  confirmMentor: confirmMentor,
  bookedDoubtSolved: markDoubtSolved,
  getDoubtsUserInitiateContract: getDoubtsUserInitiateContract,
};
