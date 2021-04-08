const express = require('express')
const router = express.Router();
const catchAsync = require('../tools/catchAsync');
const { isLoggedIn, isOwner } = require('./middlwears/authMiddlwears');
const usersControllers = require('./controllers/usersControllers')






router.get('/:username', catchAsync(usersControllers.userPage))


router.get('/:username/edit', isLoggedIn, isOwner, catchAsync(usersControllers.renderEditForm))


router.put('/:username', isLoggedIn, isOwner, catchAsync(usersControllers.editUser))



module.exports = router;