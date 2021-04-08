const express = require('express')
const router = express.Router();
const catchAsync = require('../tools/catchAsync');
const signupsControllers = require('./controllers/singupsControllers')





router.get('/', signupsControllers.renderSignupForm)

router.post('/', catchAsync(signupsControllers.postSignup));




module.exports = router;