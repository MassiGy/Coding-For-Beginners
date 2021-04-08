const express = require('express')
const router = express.Router();
const catchAsync = require('../tools/catchAsync');
const { isLoggedIn, isAuthor } = require('./middlwears/authMiddlwears')
const feedbacksControllers = require('./controllers/feedbacksControllers')


router.get('/', catchAsync(feedbacksControllers.allFeedbacks));

router.get('/new', isLoggedIn, feedbacksControllers.renderNewForm)

router.get('/:id', catchAsync(feedbacksControllers.showFeedbackDetails));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(feedbacksControllers.renderEditForm))




router.post('/', isLoggedIn, catchAsync(feedbacksControllers.postFeedback))

router.put('/:id', isLoggedIn, isAuthor, catchAsync(feedbacksControllers.editFeedback))




router.delete('/:id', isLoggedIn, isAuthor, catchAsync(feedbacksControllers.deleteFeedback))


module.exports = router;