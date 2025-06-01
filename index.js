if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

/// Packages & Modals requirments

// import express
const express = require('express')
const app = express()
const path = require('path')

// import our forms config & mongo orm
const methodOverRide = require("method-override");
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize');

// import our sessions
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('passport-local');

// import helmet for security
const helmet = require('helmet')


// import our modals
const Signup = require('./public/Modals/signup');

// import our routes
const feedbackRoutes = require('./routes/feedbackRoutes');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const signoutRoutes = require('./routes/signoutRoutes');
const userRoutes = require('./routes/userRoutes')
const otherRoutes = require('./routes/otherRoutes');

// import our envs
const port = process.env.PORT || 3000;
const dbUrl = process.env.db_Url || 'mongodb://localhost:27017/mydb';
const sessionSecret = process.env.sessionSecret || '*thisIsTheProductionSessionSecret*';
const sessionName = process.env.sessionName || '%Tmp%';


// create our session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: sessionSecret,
    touchAfter: 7 * 24 * 60 * 60,
})
// append an event listner for the error on the session store
store.on('error', (err) => {
    console.log('session error...', err)
})


// create our session config object
const sessionConfig = {
    store: store,
    name: sessionName,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



/// Connecting to the data base
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log('Connection enabled at port 27017')
    })
    .catch((ERROR) => {
        console.log('Error occured!')
        console.log(ERROR)
    })




/// APP Config And MiddelWears


// setup our http requests & views/templates
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverRide('_methode'))
app.use(express.static('partials'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static('extras'));

// setup our mongo sanitization
app.use(mongoSanitize({ replaceWith: '_' }));

// setup our sessions then flash & passport
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(Signup.authenticate()))
passport.serializeUser(Signup.serializeUser())
passport.deserializeUser(Signup.deserializeUser())

// setup our helmet
app.use(helmet({ contentSecurityPolicy: false }))


// setup our locals to access them from the views
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.danger = req.flash('danger')
    res.locals.passport = req.flash('error')
    res.locals.activeUser = req.user;
    previousUrl = req.session.previousUrl;
    isSignedIn = req.session.isSignedIn;
    next();
})


/// Routes hundlers
app.use('/Signup', signupRoutes)
app.use('/feedbacks', feedbackRoutes)
app.use('/Login', loginRoutes)
app.use('/SignOut', signoutRoutes)
app.use('/user', userRoutes)
app.use('/', otherRoutes)






///error Hundelrs 
app.use((err, req, res, next) => {
    if (err.status === undefined) {
        err.status = 500;
    }
    res.render('errorPage.ejs', { err })
})




/// START SERVER 
app.listen(port, (req, res) => console.log(`SERVER CREATED! /PORT : ${port}`))
