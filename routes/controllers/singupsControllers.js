const Signup = require('../../public/Modals/signup')
const { validationFn, signUpValidators } = require('../../tools/validators');



module.exports.renderSignupForm = (req, res) => {
    if (req.session.isSignedIn != null) {
        req.flash('danger', 'Your are Aready Signed In')
        res.redirect('/home')
    } else {

        res.render('Signup.ejs')
    }
}


module.exports.postSignup = async(req, res, next) => {
   
    // validate the data
    validationFn(req.body, signUpValidators)
    let { username, email, password, imgSrc } = req.body
    
    // first verify if the username is taken
    let checknewUser = await Signup.findOne({ username: username });
   
    if (!checknewUser) {
        
        // if not, create a new user instance
        const newUsr = new Signup({ email, username, imgSrc });
        const newSignup = await Signup.register(newUsr, password);
       
        // setup a session for this new user
        req.session.isSignedIn = newSignup.username
        
        // log him in
        req.login(newSignup, (e => {
            if (e) return next(e);
            req.flash('success', 'Successfuly Signed In & Logged In')
            res.redirect(`/user/${username}`)
        }));
    
    } else {
        // otherwise, informe the user that the username is taken
        req.flash('danger', 'Username Already Taken !')
        res.redirect('/Signup')
    }
}