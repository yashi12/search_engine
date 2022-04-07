const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const multer = require('multer')

const doubtController = require('../../controllers/doubt');
const auth = require('../../middleware/auth');

const upload = multer();


// @route POST api/discussion/ques
// @desc Create a Question
// @access Private
router.post('/doubt', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required at least 20 char').not().isEmpty().isLength({min:20})
]], doubtController.addDoubt);

// @route GET api/discussion/
// @desc Get all Questions
// @access Private
// @todo New Collection if number of questions increases
// @todo Recommend questions
// @todo Store Likes and comments separately for answers
router.get('/', auth, doubtController.getAllDoubts);

router.get('/own', auth, doubtController.getMyDoubts);

router.get('/final', auth, doubtController.getToMentorDoubts);

router.post('/doubt/:id',[auth, [
    check('amount', 'Amount is required').not().isEmpty(),
]],doubtController.mentorDoubt);

router.post('/doubt/:doubt_id/mentor/:id',[auth, [
    check('amount', 'Amount is required').not().isEmpty(),
]],doubtController.changePrice);

module.exports = router;
