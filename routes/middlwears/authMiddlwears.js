const Feedback = require("../../public/Modals/feedbacks");
const Signup = require("../../public/Modals/signup");





module.exports.isLoggedIn = (req, res, next) => {

    // use the passport methods to see if the user is logged in
    if (!req.isAuthenticated()) {
        req.session.previousUrl = req.originalUrl;
        req.flash('danger', 'You Must Be Logged In !');
        res.redirect('/login');
    } else {
        next()
    }
}

module.exports.isAuthor = async(req, res, next) => {

    // get the feedback id from the params
    const { id } = req.params;

    // get the feedback data
    const feedback = await Feedback.findById(id);

    // if the feedback is created by the currently active user, then proceed
    // otherwise inform the user & redirect
    if (feedback && !feedback.author.equals(req.user._id)) {
        req.flash('danger', 'Permission Denied, You Are Not The Owner Of This Feedback')
        res.redirect(`/feedbacks/${id}`);
    } else {
        next();
    }

}

// same as isAuthor, but uses username instead
module.exports.isOwner = async(req, res, next) => {

    // get the username from the params
    const { username } = req.params;

    // fetch the user data by username
    const foundUser = await Signup.findByUsername(username);


    // if the feedback is created by the currently active user, then proceed
    // otherwise inform the user & redirect
    if (foundUser && !foundUser._id.equals(req.user._id)) {
        req.flash('danger', 'Permission Denied , You Are Not the Owner of This Profile')
        return res.redirect(`/user/${username}`)
    } else {
        next()
    }
}