const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');



//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "277899109442-d1kmht9vn2u3kqv6a3pohnvo81c00mch.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
}, 

function(accessToken, refreshToken, profile, done){
    // find user
    User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        if(err){
            console.log('error in google strategy-passport', err);
            return;
        }
        console.log(accessToken, refreshToken);
        console.log(profile);

        if(user){
            // if found, set this user as req.user
            return done(null, user);
        }else{
            // if not found, create the user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user){
                if(err){
                    console.log('error in google strategy-passport', err);
                    return;
                }

                return done(null, user);
            })
        }
    });
}


))
