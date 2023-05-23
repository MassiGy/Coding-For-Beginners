const Signup = require('../../public/Modals/signup')
const { validationFn, signOutValidators } = require('../../tools/validators');

module.exports.renderSignoutForm = (req, res) => {
    res.render('signout.ejs')
}

module.exports.signOut = async(req, res, next) => {

    // validate the data
    validationFn(req.body, signOutValidators);

    // find one & delete
    let signoutuser = await Signup.findOneAndDelete(req.body);
   
    if (signoutuser) {
        
        // if the deletion is done, logout the user & inform him
        req.session.isSignedIn = null;
        req.logOut()
        req.flash('success', 'Successfully Signed Out, Good By!')
        res.redirect('/home');
    
    } else {
        // otherwise, inform that the credentials are invalid
        req.flash('danger', 'This account credientials are not in the data base ( or the user is already signed out!)')
        res.redirect('/SignOut')
    }
}