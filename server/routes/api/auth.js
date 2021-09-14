const express = require('express');
const router = express.Router();
const {check, validationResult} =require('express-validator')


const auth = require('../../middleware/auth');
const authController = require('../../controllers/auth');

// @route GET api/auth
// @desc Verify token provides User details
// @access Public
router.get('/',auth,authController.getAuthUser);

// @route POST api/auth
// @desc Validate user and get token
// @access Public
router.post('/', [
    check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
], authController.validateUser);

// @route GET api/auth/googlelogin
// @desc Verify token provides User details
// @access Public
// router.post('/googlelogin',authController.googlelogin);

module.exports = router;
