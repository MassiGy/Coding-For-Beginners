const Feedback = require('../../public/Modals/feedbacks')
const Signup = require('../../public/Modals/signup')
const { validationFn, feedbackValidators } = require('../../tools/validators');


let theFeedback = {};
let feedbackToEdit = {};
const userSatisfiedOptions = ['Yes', 'No', 'Nutral']
const websiteProblemOptions = ['The content was general', 'The content was not enough', 'the look of the page was not great']



module.exports.allFeedbacks = async(req, res) => {
    let { userSatisfied } = req.query;
    if (userSatisfied) {
        let feedbacks = await Feedback.find({ userSatisfied }).populate('author');
        res.render('feedbacks.ejs', { feedbacks })
    } else {
        let feedbacks = await Feedback.find({}).populate('author');
        res.render('feedbacks.ejs', { feedbacks })
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render('createFeedback.ejs', { userSatisfiedOptions, websiteProblemOptions })
}


module.exports.showFeedbackDetails = async(req, res, next) => {
    let { id } = req.params;
    theFeedback = await Feedback.findById(id).populate('author')
    if (theFeedback) {
        res.render('theFeedback.ejs', { theFeedback })
    } else {
        req.flash('danger', 'The Searched Feedback is Not Found');
        res.redirect('/feedbacks')
    }
}




module.exports.renderEditForm = async(req, res, next) => {
    const { id } = req.params;
    const theFeedback = await Feedback.findById(id);
    if (!theFeedback) {
        req.flash('Searched Feedback Not Found');
        return res.redirect('/feedbacks')
    }
    feedbackToEdit = theFeedback;
    res.render('editFeedback.ejs', { feedbackToEdit, userSatisfiedOptions, websiteProblemOptions })
}




module.exports.postFeedback = async(req, res, next) => {
    validationFn(req.body, feedbackValidators)
    const user = await Signup.findByUsername(req.body.username)
    const feedback = new Feedback(req.body)
    feedback.author = req.user._id; /// BE AWARE THAT THE ORDER OF THE INSTRUCTIONS SET IS VERY IMPORTANT
    await user.postedFeedbacks.push(feedback);
    await feedback.save()
    await user.save()
    res.redirect('/feedbacks')
}




module.exports.editFeedback = async(req, res, next) => {
    let { id } = req.params;
    const user = await Signup.findByUsername(req.body.username)
    if (!user) {
        req.flash('danger', 'Missing Creadientials ! , Login In & try  again! ');
        return res.redirect(`/Login`)
    }
    const newFeedback = await Feedback.findByIdAndUpdate(id, req.body, { runValidators: true, useFindAndModify: false })
        .then(() => {
            req.flash('success', 'Successfuly Updated Feedback');
            res.redirect(`/feedbacks/${newFeedback._id}`)
        })
        .catch(e => {
            req.flash('The Searched Feedback is Not Found or Not Valid')
            res.redirect('/feedbacks')
        })
}




module.exports.deleteFeedback = async(req, res, next) => {
    let { id } = req.params;
    const feedbackToDelete = await Feedback.findById(id).populate('author')
    const userWithFeedbackToDelete = await Signup.findById(feedbackToDelete.author._id)
    const indexOfFeedbackToDelete = userWithFeedbackToDelete.postedFeedbacks.indexOf(id);
    userWithFeedbackToDelete.postedFeedbacks.splice(indexOfFeedbackToDelete, 1)
    await userWithFeedbackToDelete.save()
    await Feedback.findByIdAndDelete(id, { runValidators: true })
        .then(() => {
            req.flash('success', 'Successfully Deleted Feedback')
            res.redirect('/feedbacks')
        })
        .catch((err) => {
            req.flash('danger', 'This Feedbacks is not Valid, or Already Deleted!')
            res.redirect('/feedbacks')
        })

}