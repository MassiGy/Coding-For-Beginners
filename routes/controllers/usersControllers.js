const Signup = require('../../public/Modals/signup');
const { validationFn, signUpValidators } = require('../../tools/validators');

module.exports.userPage = async(req, res) => {

    // get the username from the paramas
    const { username } = req.params;

    // get the user data & his feedbacks
    let user = await Signup.findOne({ username }).populate('postedFeedbacks');
   
    // if user render the data, if not inform the client
    if (!user) {
        req.flash('danger', 'User Not Sign In')
        res.redirect(`/feedbacks`)
    } else {
        return res.render('userPage.ejs', { user })
    }
}


module.exports.renderEditForm = async(req, res) => {

    // get the username from the edit
    const { username } = req.params;

    // fetch the user by username
    let user = await Signup.findOne({ username });


    // if user then render the page, else inform the client
    if (!user) {
        req.flash('danger', 'User Not Sign In')
        res.redirect(`/feedbacks`)
    } else {
        res.render('editUser.ejs', { user })
    }
}


module.exports.editUser = async(req, res) => {

    // validate the data
    validationFn(req.body, signUpValidators);

    // get the username from the params
    const { username } = req.params;

    // update hte user;
    let updatedUser = await Signup.findOneAndUpdate(username, req.body, { runValidators: true });

    // inform & redirect to the updated user page
    req.flash('success', 'Successfuly Updated User ! ');
    res.redirect(`/user/${updatedUser.username}`)
}