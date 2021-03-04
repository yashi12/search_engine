const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');

const skillController = require('../../controllers/skill');

// @route POST api/skill
// @desc Crete a Skill
// @access Public
router.post('/',[
    check('topic','Topic is required').not().isEmpty().bail()
],skillController.addSkill);

router.get('/data',skillController.fetchDataFromApi)

module.exports = router;