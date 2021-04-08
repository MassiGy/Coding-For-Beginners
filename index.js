if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

/// Packages & Modals requirments
const express = require('express')
const app = express()
const path = require('path')
const methodOverRide = require("method-override");
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('passport-local');
const helmet = require('helmet')
const Signup = require('./public/Modals/signup')
const feedbackRoutes = require('./routes/feedbackRoutes');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const signoutRoutes = require('./routes/signoutRoutes');
const userRoutes = require('./routes/userRoutes')
const otherRoutes = require('./routes/otherRoutes');
const dbUrl = process.env.db_Url || 'mongodb://localhost:27017/mydb'
const sessionSecret = process.env.sessionSecret || '*thisIsTheProductionSessionSecret*';
const sessionName = process.env.sessionName || '%Tmp%';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60,
})
store.on('error', (err) => {
    console.log('session error...', err)
})

const sessionConfig = {
    store: store,
    name: sessionName,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
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

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverRide('_methode'))
app.use(express.static('partials'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(mongoSanitize({ replaceWith: '_' }))
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({ contentSecurityPolicy: false }))
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(Signup.authenticate()))
passport.serializeUser(Signup.serializeUser())
passport.deserializeUser(Signup.deserializeUser())

/// Res . Locals Middelwear 
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
app.listen(3000, (req, res) => console.log('SERVER CREATED! /PORT : 3000'))