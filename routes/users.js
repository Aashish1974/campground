const express = require('express');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res) => {
    try {

        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return (err);
            req.flash('success', "Welcome to Yelp camp!");
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    // console.log(req.session);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    console.log("===================================")
    console.log(redirectUrl);
    console.log("===================================")
    console.log(req.session.returnTo);
    console.log("===================================")
    console.log("===================================")
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "logged Out!!");
        res.redirect('/campgrounds');
    });
})

module.exports = router;