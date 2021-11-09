const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const multer = require('multer')

const answerController = require('../../controllers/answers');
const auth = require('../../middleware/auth');

const upload = multer();

// @route DELETE api/answer/delete/:ans_id
// @desc Delete a answer by Id
// @access Private
router.put('/delete/:ans_id', auth, answerController.deleteAnswer);


// @route POST api/answer/:ques_id
// @desc Answer a Question
// @access Private
router.post('/:ques_id', [upload.single("media"),auth,  [
    check('description', 'Description is required at least 25 char').not().isEmpty().isLength({min:25}),
]], answerController.addAnswer);

// @route PUT api/answer/:ans_id
// @desc Update answer
// @access Private
router.put('/:ans_id',[upload.single("media"),auth,  [
    check('description', 'Description is required at least 25 char').not().isEmpty().isLength({min:25}),
]], answerController.updateAnswer);

// @route GET api/answer/:ans_id
// @desc Get answer by ID
// @access Private
router.get('/:ans_id', auth, answerController.getAnswerById);

// @route GET api/discussion/
// @desc Get all Questions
// @access Private
// @todo New Collection if number of questions increases
// @todo Recommend questions
// @todo Store Likes and comments separately for answers
// router.get('/', auth, discussionController.getAllQuestions);


// @route GET api/answer/:ans_id
// @desc Get post by ID
// @access Private
router.post('/comment/:ans_id', [auth, 
    [check('text', 'Text is required at least 5 char').not().isEmpty()]
], answerController.addCommentToAnswer);

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, answerController.likeAnswer);




// @route POST api/posts/comment/:id
// @desc Comment a post
// @access Private
// router.post('/comment/:id', [auth, [
//         check('text', 'Text is required').not().isEmpty()]]
//     , postsController.addComment);

// @route DELETE api/discussion/ques/:id
// @desc Delete a question
// @access Private
// router.delete('/ques/:id', auth, discussionController.deleteQuestion);

module.exports = router;