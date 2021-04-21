const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const postsController = require('../../controllers/posts');
const auth = require('../../middleware/auth');

// @route POST api/posts
// @desc Create a post
// @access Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty(),
    check('title', 'Minimum 1 & maximum 5 Titles are required').isArray({min: 1, max: 5})
]], postsController.addPost);

// @route GET api/posts
// @desc Get all posts
// @access Private
router.get('/', auth, postsController.getAllPosts);

// @route GET api/posts/filter
// @desc Get all posts by title filter
// @access Private
router.get('/filter', auth, postsController.getPostsByTitleFilter);

// @route GET api/posts/:id
// @desc Get post by ID
// @access Private
router.get('/:id', auth, postsController.getPostByID);

// @route DELETE api/posts/:id
// @desc Delete a post by Id
// @access Private
router.delete('/:id', auth, postsController.deletePostById);

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, postsController.likePost);

// @route POST api/posts/comment/:id
// @desc Comment a post
// @access Private
router.post('/comment/:id', [auth, [
        check('text', 'Text is required').not().isEmpty()]]
    , postsController.addComment);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc Delete a Comment of a post
// @access Private
router.delete('/comment/:id/:comment_id', auth
    , postsController.deleteComment);

module.exports = router;