const mongoose = require('mongoose');
const passportLM = require('passport-local-mongoose')
const Feedback = require('./feedbacks')

const signupSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    imgSrc: {
        type: String,
    },
    postedFeedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback',
    }, ],
});

signupSchema.plugin(passportLM);


// no need to await, nodejs will do it after that the task queue is empty
// (performance gain)
signupSchema.post('findOneAndDelete', async(doc) => {
    if (doc.postedFeedbacks.length > 0) {
        Feedback.deleteMany({
            _id: {
                $in: doc.postedFeedbacks,
            }
        })
    }
})

let Signup = mongoose.model('Signup', signupSchema);



module.exports = Signup