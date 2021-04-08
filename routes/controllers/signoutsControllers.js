const Signup = require('../../public/Modals/signup')
const { validationFn, signOutValidators } = require('../../tools/validators');

module.exports.renderSignoutForm = (req, res) => {
    res.render('signout.ejs')
}

module.exports.signOut = async(req, res, next) => {
    validationFn(req.body, signOutValidators)
    let signoutuser = await Signup.find(req.body);
    if (signoutuser.length > 0) {
        await Signup.findOneAndDelete(signoutuser);
        req.session.isSignedIn = null;
        req.logOut()
        req.flash('success', 'Successfully Signed Out, Good By!')
        res.redirect('/home');
    } else {
        req.flash('danger', 'This account credientials are not in the data base ( or the user is already signed out!)')
        res.redirect('/SignOut')
    }
}