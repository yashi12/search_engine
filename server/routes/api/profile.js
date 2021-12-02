const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');

const profileController = require('../../controllers/profile');
const profileRatingService = require('../../scripts/profile_rating');
const auth = require('../../middleware/auth');

// @route GET api/profile/me
// @desc GET login user profile
// @access Private
router.get('/me',auth,profileController.getProfile);

// @route GET api/profile/
// @desc Create and update user profile
// @access Private
router.post('/',[auth,[
    check('skills','Skill is required').not().isEmpty(),
]],profileController.addProfile);

// @route GET api/profile/
// @desc Get all profiles
// @access Public
router.get('/',profileController.getAllProfiles);

// @route GET api/profile/filter
// @desc Get all profiles
// @access Public
router.get('/filter/:skill',profileController.getProfilesBySkill);

// @route GET api/profile/user/:user_id
// @desc Get profile by user id
// @access Public
router.get('/user/:user_id',profileController.getUserProfile);

// @route DELETE api/profile
// @desc Delete profile, user and post
// @access Private
router.delete('/',auth,profileController.deleteProfile);

// @route PUT api/profile/experience
// @desc Add profile experience
// @access Private
router.put('/experience',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty(),
]],profileController.addExperience);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access Private
router.delete('/experience/:exp_id',auth,profileController.deleteExperience);

//service
router.get('/rating',profileRatingService.updateProfileRating);

module.exports = router;