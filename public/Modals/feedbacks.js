const mongoose = require('mongoose')



let feedbackSchema = new mongoose.Schema({
    userJob: {
        type: String,
        required: true,
    },
    feedbackText: {
        type: String,
        required: true,
    },
    userSatisfied: {
        type: String,
    },
    websiteProblem: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signup',
    },
})


let Feedback = mongoose.model('Feedback', feedbackSchema)





module.exports = Feedback;