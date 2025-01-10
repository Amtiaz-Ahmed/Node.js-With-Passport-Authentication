const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/users')
const passport = require('passport')

// login page
router.get('/login',(req,res)=>{
    res.render('login', { errors: [], email: '', password: ''});
});

// register page
router.get('/register',(req,res)=>{
    res.render('register', { errors: [], name: '', email: '', password: '', password2: '' });
});

// register handle
router.post('/register' , (req,res)=>{
  
    const {name,email,password,password2} = req.body;

    const errors = [];

    if(!name || !email || !password || !password2){
        errors.push({msg:"Please fill in all fields"})
    }

    if(password != password2){
        errors.push({msg:"Passwords do not match"});
    }

    if(password.length < 6){
        errors.push({msg:"Password Should be 6 characters long"})
    }

    if(errors.length>0){
        res.render('register' , {
            errors,
            name,
            email,
            password,
            password2,
        })
    }else{
    
    User.findOne({ email : email })
        .then((user)=>{
          if(user){
            errors.push({msg : 'Email already exist'})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2, 
            });
        }else{
            const newUser = new User({
                name,
                email,
                password
            });
           
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password,salt, (err,hash)=>{
                    if(err) throw err;
                    
                    // set password to hash 
                    newUser.password = hash;

                    newUser.save()
                        .then(user=>{
                            req.flash('success_msg','You are now registered and can log in ' )
                           res.redirect('/users/login')
                        })
                        .catch(err=> console.log(err))
                })
            })
        }
    })


        // res.send('pass')
    }
   


    // res.send('hello')
})


// login handle
router.post('/login' , (req,res,next)=>{
    passport.authenticate('local' , {
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next)
});

// logout handle

router.get('/logout' , (req,res)=>{
    req.logout((err) => {
        if (err) {
            return next(err); // Pass the error to the error-handling middleware
        }
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
    });
});


module.exports = router;