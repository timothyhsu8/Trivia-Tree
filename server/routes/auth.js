const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/failure' }),
    (req, res) => {
        let creationDate = new Date(req.user.createdAt).getTime();
        let time_diff_ms= Math.abs(new Date() - creationDate)
        
        if(time_diff_ms < 10000){
            res.redirect(`${process.env.CLIENT_URL}/signuppage`)
        }
        else{
            res.redirect(`${process.env.CLIENT_URL}`);
        }
    }
);

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.redirect(`${process.env.CLIENT_URL}`);
    }
});

module.exports = router;