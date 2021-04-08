module.exports.homePage = (req, res) => {
    res.render('home.ejs')
}

module.exports.adminPage = (req, res) => {
    res.render('admin.ejs')
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Successfully Logged Out, By!')
    res.redirect('/home');
}

module.exports.comingSoon = (req, res) => {
    res.render('comingSoon.ejs')
}