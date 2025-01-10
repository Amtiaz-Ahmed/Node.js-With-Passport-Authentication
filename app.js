const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const session  = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');

require('./config/passport')(passport)

app.use(expressLayouts);
app.set('view engine' , 'ejs');
app.use(express.urlencoded({ extended : false}))



// express session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// passport midleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash 
app.use(flash());

// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

mongoose.connect('mongodb://localhost:27017/passauth')
.then(()=> console.log("database connected"))
.catch((err)=> console.log(err))

// routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(3000)