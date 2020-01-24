const db = require('../models');
const jwt = require('jsonwebtoken');

exports.signin = async function(req, res, next){
    // find a user
    try {
        let user = await db.User.findOne({
            email: req.body.email
        });
        let {id, username, profileImageUrl } = user
        // check if their password matches what was sent to server
        let isMatch = await user.comparePassword(req.body.password)
        // if it all matches
        if (isMatch){
            // log them in and send back data including token
            let token = jwt.sign({
                id,
                username,
                profileImageUrl
            }, process.env.SECRET_KEY)
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            })
        } else {
            next({
                status: 400,
                message: "Invalid Email/Password"
            })
        }
    } catch (err) {
        next({
            status: 400,
            message: "Invalid Email/Password"
        })
        // are we sure this message will always be correct?
    }


}

exports.signup = async function(req, res, next){
    try {
        // create a user
        let user = await db.User.create(req.body);
        // destructure values from user object
        let {id, username, profileImageUrl} = user;
        // create a token (signing a token)
            // used to create token:
            // header, payload, signature
            // process.env.SECRET_KEY
        let token = jwt.sign({
            id,
            username,
            profileImageUrl
        }, process.env.SECRET_KEY
        );
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        })
    } catch (err) {
        // see what kind of error
        // if it is a certain error
        // response with username/email already taken
        // otherwise just send back a generic 400

        // if a validation fails:
        if(err.code === 11000){
            err.message = "Sorry, that username and/or email is already taken."
        }
        return next({
            status: 400,
            message: err.message
        })
    }
}