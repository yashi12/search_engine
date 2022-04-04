const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const multer = require('multer')

const bookController = require('../../controllers/doubts/booking');
const auth = require('../../middleware/auth');

const upload = multer();


// @route POST api/discussion/ques
// @desc Create a Question
// @access Private
router.post('/initiate/:doubt_id/mentor/:id' ,auth ,bookController.bookMentor);

router.post('/confirm/:id' ,auth ,bookController.confirmMentor);

router.post('/solved/:id' ,auth ,bookController.bookedDoubtSolved);


module.exports = router;
