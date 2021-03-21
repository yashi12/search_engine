const express = require('express');
const router = express.Router();
const {check, validationResult} =require('express-validator')

const User = require('../../models/User');
const userController = require('../../controllers/user');

// @route POST api/users
// @desc Register user
// @access Public
router.post('/', [
    // check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
    check('password', 'Password should have 6 or more characters').isLength({min: 6}).bail().isAlphanumeric().trim()
], userController.postAddUser);

module.exports = router;