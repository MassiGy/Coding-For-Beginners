const Feedback = require("../../public/Modals/feedbacks");
const Signup = require("../../public/Modals/signup");





module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.previousUrl = req.originalUrl;
        req.flash('danger', 'You Must Be Logged In !');
        res.redirect('/login');
    } else {
        next()
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    if (feedback && !feedback.author.equals(req.user._id)) {
        req.flash('danger', 'Permission Denied, You Are Not The Owner Of This Feedback')
        res.redirect(`/feedbacks/${id}`);
    } else {
        next();
    }

}

module.exports.isOwner = async(req, res, next) => {
    const { username } = req.params;
    const foundUser = await Signup.findByUsername(username);
    if (foundUser && !foundUser._id.equals(req.user._id)) {
        req.flash('danger', 'Permission Denied , You Are Not the Owner of This Profile')
        return res.redirect(`/user/${username}`)
    } else {
        next()
    }
}