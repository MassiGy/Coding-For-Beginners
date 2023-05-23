const Feedback = require('../../public/Modals/feedbacks')
const Signup = require('../../public/Modals/signup')
const { validationFn, feedbackValidators } = require('../../tools/validators');

// declare some in-memory global variables
let theFeedback = {};
let feedbackToEdit = {};
const userSatisfiedOptions = ['Yes', 'No', 'Nutral']
const websiteProblemOptions = [
    'The content was general',
    'The content was not enough',
    'the look of the page was not great'
]



module.exports.allFeedbacks = async (req, res) => {

    // get the satisfaction flag on the url querystring
    let { userSatisfied } = req.query;

    if (userSatisfied) {

        // if the satisfaction flag is set, filter the fetched data with it
        let feedbacks = await Feedback
            .find({ userSatisfied })
            .limit(10)                  // limit to 10 for perforance improvements
            .populate({ path: 'author', select: 'username' });

        res.render('feedbacks.ejs', { feedbacks })
    } else {

        // otherwise, get all the feedbacks
        let feedbacks = await Feedback
            .find({})
            .limit(10)                // limit to 10 for perforance improvements
            .populate({ path: 'author', select: 'username' });


        res.render('feedbacks.ejs', { feedbacks })
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render('createFeedback.ejs', { userSatisfiedOptions, websiteProblemOptions })
}


module.exports.showFeedbackDetails = async (req, res, next) => {

    // get the feedback id from the req.params
    let { id } = req.params;

    // get the feedback by id, and the needed author data
    theFeedback = await Feedback
        .findById(id)
        .populate({ path: 'author', select: ['_id', 'username', 'email'] })


    if (theFeedback) {
        // if any, send the feedback to the client
        res.render('theFeedback.ejs', { theFeedback })

    } else {
        // otherwise, inform that there is nothing
        req.flash('danger', 'The Searched Feedback is Not Found');
        res.redirect('/feedbacks')
    }
}




module.exports.renderEditForm = async (req, res, next) => {

    // get the feedback id from the req params
    const { id } = req.params;

    // fetch the feedback & its author data
    const theFeedback = await Feedback
        .findById(id)
        .populate({ path: "author", select: ['email', 'username'] })

    if (!theFeedback) {

        // if nothing found, informe the user so
        req.flash('Searched Feedback Not Found');
        return res.redirect('/feedbacks')
    }

    // otherwise, send the data to the user
    feedbackToEdit = theFeedback;
    res.render('editFeedback.ejs', { feedbackToEdit, userSatisfiedOptions, websiteProblemOptions })
}




module.exports.postFeedback = async (req, res, next) => {

    // valide the data
    validationFn(req.body, feedbackValidators);

    // create a new feedback instance
    const feedback = new Feedback(req.body);

    // link the feedback to its author
    feedback.author = req.user._id;


    // concurrently save the feedback & update the author
    await Promise.allSettled([
        feedback.save(),
        Signup.updateOne(
            { username: req.body.username },
            { $push: { postedFeedbacks: feedback._id } }
        )
    ])

    // redirect
    res.redirect('/feedbacks')
}




module.exports.editFeedback = async (req, res, next) => {

    // get the feedback id from the params
    let { id } = req.params;

    // first check if the credentials are saved 
    const user = await Signup.findByUsername(req.body.username)
    if (!user) {
        req.flash('danger', 'Missing Creadientials ! , Login In & try  again! ');
        return res.redirect(`/Login`)
    }

    try {
        // if the edit is valid, infrom the user & redirect to the feedback page
        const newFeedback = await Feedback
            .findByIdAndUpdate(id, req.body, { runValidators: true, useFindAndModify: false })

        req.flash('success', 'Successfuly Updated Feedback');
        res.redirect(`/feedbacks/${newFeedback._id}`)

    } catch (error) {
        // otherwise, if the feedback is not valid, inform the user & redirect
        req.flash('The Searched Feedback is Not Found or Not Valid')
        res.redirect('/feedbacks')
    }

}




module.exports.deleteFeedback = async (req, res, next) => {

    // get the feedback id from the params
    let { id } = req.params;

    // await the feedback deletion process
    await Feedback
        .findByIdAndDelete(id)
        .populate({ path: 'author', select: '_id' })

        // then asynchronuosly update the user, (do not await it for performance reasons)
        .then(deletedFeedback => {
            Signup.updateOne(
                { _id: deletedFeedback.author._id },
                { $pull: { postedFeedbacks: id } }
            )
        })


    // inform the user & redirect
    req.flash('success', 'Successfully Deleted Feedback')
    res.redirect('/feedbacks')

}