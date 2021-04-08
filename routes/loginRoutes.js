const express = require('express')
const router = express.Router();
const catchAsync = require('../tools/catchAsync');
const passport = require('passport');
const passportAuthConfig = { failureFlash: true, failureRedirect: '/login' }
const loginControllers = require('./controllers/loginControllers')




router.get('/', loginControllers.renderLoginForm)



router.post('/', passport.authenticate('local', passportAuthConfig), catchAsync(loginControllers.login))

module.exports = router;