const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// user model
const User = require('../models/users');

module.exports = function(passport){
    passport.use(
        new localStrategy({ usernameField: 'email'} , (email , password , done)=>{
            // match user
            User.findOne({email: email})
            .then(user => {
                if(!user){
                return done(null, false , { message : 'That email is not registered' });
                }

                // match password
                bcrypt.compare(password  , user.password , (err , isMatch)=>{
                    if(err) throw err;

                    if(isMatch){
                        return done(null , user);
                    }
                    else{
                    return done(null , false , { message : 'Password incorrect' });
                    }
                })
            })
            .catch(err => console.log(err));
        })
    )
    passport.serializeUser((user,done)=>{
        done(null , user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => done(null, user)) // Pass the user to `done`
            .catch((err) => done(err, null)); // Pass the error to `done`
    });
}