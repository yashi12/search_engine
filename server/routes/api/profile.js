const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');

const profileController = require('../../controllers/profile');
const auth = require('../../middleware/auth');

// @route GET api/profile/me
// @desc GET login user profile
// @access Private
router.get('/me',auth,profileController.getProfile);

// @route GET api/profile/
// @desc Create and update user profile
// @access Private
router.post('/',[auth,[
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
]],profileController.addProfile);

// @route GET api/profile/
// @desc Get all profiles
// @access Public
router.get('/',profileController.getAllProfiles);

// @route GET api/profile/user/:user_id
// @desc Get profile by user id
// @access Public
router.get('/user/:user_id',profileController.getUserProfile);

// @route DELETE api/profile
// @desc Delete profile, user and post
// @access Private
router.delete('/',auth,profileController.deleteProfile);

module.exports = router;