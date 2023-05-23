module.exports.renderLoginForm = (req, res) => {
    res.render('Login.ejs')
}

module.exports.login = async(req, res, next) => {
    req.flash('success', 'Successfully Logged In')
    
    // redirect the user to the previous page
    req.session.isSignedIn = req.body.username;
    const returnTo = previousUrl || '/home';
    delete req.session.previousUrl;
    res.redirect(returnTo)
}