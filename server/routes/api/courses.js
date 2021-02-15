const express = require('express');
const router = express.Router();

// @route GET api/courses
// @desc Test Route
// @access Public
router.get('/',(req,res)=> res.send('Courses Route'));

module.exports = router;