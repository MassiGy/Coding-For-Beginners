const express = require('express')
const router = express.Router();
const appError = require('../tools/appError');
const othersControllers = require('./controllers/otherControllers')




router.get('/home', othersControllers.homePage)
router.get('/Admin', othersControllers.adminPage)
router.get('/comingSoon', othersControllers.comingSoon)
router.get('/logout', othersControllers.logout)


router.all('*', (req, res, next) => next(new appError('Not Found', 404)))





module.exports = router;