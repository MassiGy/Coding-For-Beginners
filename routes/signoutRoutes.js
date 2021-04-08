const express = require('express')
const router = express.Router();
const catchAsync = require('../tools/catchAsync');
const signOutControllers = require('./controllers/signoutsControllers')








router.get('/', signOutControllers.renderSignoutForm)








router.post('/', catchAsync(signOutControllers.signOut))



module.exports = router;