require('dotenv').config();
const jwt = require('jsonwebtoken');

// make sure the user is logged in - Authentication
exports.loginRequired = function(req, res, next) {
    try {
        // starts with 'Bearer fjsdlfjsld' so split with a space and get [1] to get the section after 'Bearer'
        const token = req.headers.authorization.split(" ")[1]     // Bearer
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            if(decoded){
                return next();
            } else {
                return next({
                    status: 401,
                    message: "Please log in first"
                })
            }
        })
    } catch (err) {
        return next({
            status: 401,
            message: "Please log in first"
        })
    }
}

// make sure we get the correct user - Authorization
// /api/user/:id/messages
exports.ensureCorrectUser = function(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]     // Bearer
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            // decoded.id is the id in the payload
            // req.params.id is the id in the url
            if(decoded && decoded.id === req.params.id) {
                return next();
            } else {
                return next({
                    status: 401,
                    message: "Unauthorized"
                })
            }
        })
    } catch (err) {
        return next({
            status: 401,
            message: "Unauthorized"
        })
    }
}