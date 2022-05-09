const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const request = require("request");
const AWS = require("aws-sdk");
const fetch = require("node-fetch");
const Doubt = require("../models/discussion/Doubt");
const Booking = require("../models/discussion/Booking");
const Answer = require("../models/discussion/Answer");
const Category = require("../models/discussion/Category");
const User = require("../models/User");
const ContentMiddleware = require("../middleware/content");
const { paginatedResults } = require("./helper/pagenation");
const { raw } = require("config/raw");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

/* To add doubt*/
const addDoubt = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  try {
    const { title, description, tags, raisedAmount } = req.body;

    const tempDoubt = {};
    tempDoubt.user = req.user.id;
    tempDoubt.title = title;
    tempDoubt.description = description;
    tempDoubt.raisedAmount = raisedAmount;

    if (tags) {
      tempDoubt.tags = tags.split(",").map((tag) => tag.trim().toLowerCase());
    }

    if (req.file) {
      const file = req.file.originalname.split(".");
      const fileType = file[file.length - 1];
      const currDate = new Date().toISOString();
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${currDate}.${fileType}`,
        Body: req.file.buffer,
        ContentType: "file",
      };
      s3.upload(params, (error, data) => {
        if (error) {
          res.status(500).send(error);
        }
        tempDoubt.media = data.Location;
        const newDoubt = new Doubt(tempDoubt);
        newDoubt
          .save()
          .then((doubt) => {
            res.json(doubt);
          })
          .catch((err) => {
            res.status(500).send(err.message);
          });
      });
    } else {
      const newDoubt = new Doubt(tempDoubt);
      const doubt = await newDoubt.save();
      res.json(doubt);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error...");
  }
};

const getDoubtById = async (req, res, next) => {
  const doubt_id = req.params.id;

  Booking.find({ doubtId: doubt_id })
    .then((booking) => {
      Doubt.findById(doubt_id)
        .populate("user", "id name email")
        .then((doubt) => {
          let resp = {};
          resp["doubt"] = doubt;
          resp["bookings"] = booking;
          res.json(resp);
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500).send("Server Error...");
        });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send("Server Error...");
    });
};

const getAllDoubts = async (req, res, next) => {
  let pageNumber = req.query.page;
  let nPerPage = 15; // Number of questions per page

  await Doubt.find({ user: { $ne: req.user.id } })
    .select({
      tags: 1,
      _id: 1,
      title: 1,
      description: 1,
      user: 1,
      media: 1,
      raisedAmount: 1,
    })
    .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
    .limit(nPerPage)
    .populate("user", "id name")
    .sort({
      date: -1,
    })
    .then((questions) => {
      console.log(questions);
      res.json(questions);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send("Server Error...");
    });
};

const getMyDoubts = async (req, res, next) => {
  let pageNumber = req.query.page;
  let nPerPage = 15; // Number of questions per page

  let doubts = await Doubt.find({ user: req.user.id })
    .select({
      tags: 1,
      _id: 1,
      title: 1,
      description: 1,
      user: 1,
      media: 1,
      raisedAmount: 1,
    })
    .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
    .limit(nPerPage)
    .populate("user", "id name")
    .sort({
      date: -1,
    })
    .lean();

  // for(let i=0;i<doubts.length;i++) {
  //     console.log(doubts[i]._id)
  //     let status = await Booking.findOne({doubtId:doubts[i]._id});
  //     console.log(status);
  //     if(status){
  //         doubts[i].status = status;
  //         console.log("status is ",doubts[i]);
  //     }
  // }

  if (doubts) {
    console.log(doubts, "\n sad\n");
    res.json(doubts);
  } else res.status(500).send("Server Error...");
};

/* Mentor initiates a price to mentor a doubt 
- raises an amount
- gives his quotaion in form of description
- in it a entery in booking model is formed
- if entry already exists then the amount and desciption gets updated
*/

const mentorDoubt = async (req, res, next) => {
  console.log("hi");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  const doubtId = req.params.id;
  const mentorId = req.user.id;
  const amount = req.body.amount;
  let description, mentorMetamaskAddress;
  if (req.body.description) description = req.body.description;
  if (req.body.mentor_address) mentorMetamaskAddress = req.body.mentor_address;
  const doubt = await Doubt.findById(doubtId);
  if (!doubt) {
    return res.status(404).json({
      msg: "No such doubt found",
    });
  }
  const booking = await Booking.findOne({
    doubtId: doubtId,
    mentorId: mentorId,
  });
  if (booking) {
    if (!description && booking.description) description = booking.description;
    if (!mentorMetamaskAddress && booking.mentorMetamaskAddress)
      mentorMetamaskAddress = booking.mentorMetamaskAddress;
    Booking.findOneAndUpdate(
      { doubtId: doubtId, mentorId: mentorId, status: "pending" },
      {
        $set: {
          amount: amount,
          description: description,
          mentorMetamaskAddress: mentorMetamaskAddress,
        },
      },
      { new: true }
    )
      .then((booking) => {
        if (booking == null) {
          res.status(404).send("booking cannot be updated");
        } else {
          return res.json(booking);
        }
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } else {
    let newBooking = {};
    newBooking.doubtId = doubtId;
    newBooking.mentorId = mentorId;
    newBooking.userId = doubt.user;
    newBooking.amount = amount;
    newBooking.description = description;

    const newBookingIs = new Booking(newBooking);
    newBookingIs
      .save()
      .then((booking) => {
        res.json(booking);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  }

  // const mentor = await Doubt.findOne({_id:doubtId,mentor:{$elemMatch:{mentorId:mentorId}}});
  // if (mentor) {
  //     return res.status(404).json({
  //         msg: 'Amount already raised'
  //     });
  // }
  // Doubt.findByIdAndUpdate(
  //     doubtId,
  //     {$push:{mentor:{mentorId:mentorId,amount:amount}}},
  //     {new:true}
  // ).then(doubt => {
  //     return res.json(doubt);
  // })
  // .catch(err => {
  //     res.status(500).send(err.message);
  // })
};

const getToMentorDoubts = async (req, res, next) => {
  let pageNumber = req.query.page;
  let nPerPage = 15; // Number of questions per page

  const doubts = await Booking.find({ mentorId: req.user.id })
    .select({
      _id: 0,
      doubtId: 1,
      userId: 1,
      description: 1,
      meetLink: 1,
      amount: 1,
      status: 1,
    })
    .populate("doubtId", "title description tags media raisedAmount")
    .populate("userId", "id name email");
  res.status(200).send(doubts);

  if (!doubts) {
    console.log(err.message);
    res.status(500).send("Server Error...");
  }
};

const changePrice = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  const doubtId = req.params.doubt_id;
  const mentorDoubtId = req.params.id;
  const amount = req.body.amount;

  console.log("amount", amount);
  console.log("mentorDoubtId", mentorDoubtId);
  Doubt.findOneAndUpdate(
    {
      $and: [
        { _id: doubtId },
        { mentor: { $elemMatch: { _id: mentorDoubtId } } },
      ],
    },
    {
      $set: { "mentor.$.amount": amount },
    },
    { new: true }
  )
    .then((doubt) => {
      return res.json(doubt);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

const getDoubtsByTags = (req, res) => {
  const tags = req.params.tag;
  let newTags = [];
  const title = tags.split(",");
  title.map((tag) => {
    tag = tag.toString().trim();
    tag = tag.toString().toLowerCase();
    newTags.push(tag);
  });
  Doubt.find({ tags: { $in: newTags } })
    .populate("user", ["name", "rating"])
    .then((profiles) => {
      res.json(profiles);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).send("Server Error...");
    });
};

module.exports = {
  addDoubt: addDoubt,
  getAllDoubts: getAllDoubts,
  getMyDoubts: getMyDoubts,
  getToMentorDoubts: getToMentorDoubts,
  mentorDoubt: mentorDoubt,
  changePrice: changePrice,
  getDoubtById: getDoubtById,
  getDoubtsByTags: getDoubtsByTags,
};
