const Signup = require('../../public/Modals/signup');
const { validationFn, signUpValidators } = require('../../tools/validators');

module.exports.userPage = async(req, res) => {
    const { username } = req.params;
    let user = await Signup.findOne({ username: username }).populate('postedFeedbacks');
    if (!user) {
        req.flash('danger', 'User Not Sign In')
        res.redirect(`/feedbacks`)
    } else {
        return res.render('userPage.ejs', { user })
    }
}


module.exports.renderEditForm = async(req, res) => {
    const { username } = req.params;
    let user = await Signup.findOne({ username: username });
    if (!user) {
        req.flash('danger', 'User Not Sign In')
        res.redirect(`/feedbacks`)
    } else {
        res.render('editUser.ejs', { user })
    }
}


module.exports.editUser = async(req, res) => {
    validationFn(req.body, signUpValidators)
    const { username } = req.params;
    let newUser = await Signup.findOneAndUpdate(username, req.body, { runValidators: true })
    req.flash('success', 'Successfuly Updated User ! ');
    res.redirect(`/user/${newUser.username}`)
}