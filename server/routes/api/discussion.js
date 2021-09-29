const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const multer = require('multer')

const discussionController = require('../../controllers/discussion');
const auth = require('../../middleware/auth');

const upload = multer();


// @route POST api/discussion/ques
// @desc Create a Question
// @access Private
router.post('/ques', [upload.single("media"),auth,  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required at least 20 char').not().isEmpty().isLength({min:20}),
    check('category', 'Category is required').not().isEmpty(),
]], discussionController.addQues);

// @route GET api/discussion/
// @desc Get all Questions
// @access Private
// @todo New Collection if number of questions increases
// @todo Recommend questions
// @todo Store Likes and comments separately for answers
router.get('/', auth, discussionController.getAllQuestions);

// @route GET api/posts/category
// @desc Get all questions by category filter
// @access Private
router.get('/category/:category', auth, discussionController.getAllQuestionsByCategory);


// @route PUT api/discussion/ques/id
// @desc Like a post
// @access Private
router.put('/ques/:id',[upload.single("media"),auth,[
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required at least 20 char').not().isEmpty().isLength({min:20}),
    check('category', 'Category is required').not().isEmpty(),
]], discussionController.updateQuestion);

// // @route POST api/posts/comment/:id
// // @desc Comment a post
// // @access Private
// // router.post('/comment/:id', [auth, [
// //         check('text', 'Text is required').not().isEmpty()]]
// //     , postsController.addComment);

// @route DELETE api/discussion/ques/:id
// @desc Delete a question
// @access Private
// router.delete('/ques/:id', auth, discussionController.deleteQuestion);

// // @route GET api/discussion/ques/:id
// // @desc Delete a question
// // @access Private
// router.get('/ques/:ques_id', auth, discussionController.getQuestionById);

module.exports = router;