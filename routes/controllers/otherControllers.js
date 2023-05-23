module.exports.homePage = (req, res) => {
    res.render('home.ejs')
}

module.exports.adminPage = (req, res) => {
    res.render('admin.ejs')
}

module.exports.logout = (req, res) => {

    // use the passport logout method to pause the current session
    req.logOut(err => {
        if (err) {
            req.flash("error", "Something went wrong on logout ! We will work on it soon.");
            return res.redirect("/home");
        }
        req.flash("success", "Successfully Logged Out. Bye!")
        res.redirect('/home');
    });
  
}

module.exports.comingSoon = (req, res) => {
    res.render('comingSoon.ejs')
}