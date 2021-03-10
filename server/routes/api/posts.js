const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');

const postsController = require('../../controllers/posts');
const auth = require('../../middleware/auth');

// @route POST api/posts
// @desc Create a post
// @access Private
router.post('/',[auth,[
    check('text','Text is required').not().isEmpty(),
    check('title','Title is required').not().isEmpty(),
]],postsController.addPost);

module.exports = router;