const express = require('express');
const router = express.Router();
const {check, validationResult} =require('express-validator')

const User = require('../../models/User');
const userController = require('../../controllers/user');

// @route POST api/users
// @desc Register user
// @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
    check('password', 'Password should have 6 or more characters').isLength({min: 6}).bail().isAlphanumeric().trim()
], userController.postAddUser);

// @route GET api/users
// @desc Confirm email
// @access Public
// router.get("/emailConfirmation/:userId", function(req, res) {
//     User.findByIdAndUpdate(req.params.userId, { $set: {confirmed : true}},function(err, user){
//         if(err){
//             console.log(err.message)
//         }
//         user.confirmed=true;
//         res.render("confirm_login",{userConfirmed: user.confirmed});
//     });
//
// });

module.exports = router;