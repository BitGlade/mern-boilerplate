'use strict'

/*
 * Session functionality
 */

var session = require('express-session')
var connectMongo = require('connect-mongo')
var mongoose = require('mongoose')

var logger = require('../logger')
var util = require('../util')

var isDef = util.isDef
var backHome = util.backHome
var MongoStore = connectMongo(session)

var User = require('../model/User')


// session initialize middleware
var init = session({
    name: 'server-session-cookie-id',
    secret: 'boiler-secret',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
})
/*
 * User session/login checks
 */

function isLoggedIn(req) {
    return (isDef(req.session) && isDef(req.session.userId))
}

// middleware: moves next() if user logged in, else redirects to home
function requiresLogin(req, res, next) {
    if (isLoggedIn(req)) {
        return next()
    } else {
        return backHome(res)
    }
}

/*
 * Login attempt logic.  Responds to client with JSON.
 * Response to client: {err: bool, message: String}
 */
function attemptLogin(email, password, req, res) {
    if (isDef(email) && isDef(password)) {
        // validating email & password
        User.authenticate(email, password, function(err, user) {
            if(err) {
                return res.json({err: true, message: err.message})
            } else if (!user) {
                return res.json({err: true, message: "User not found."})
            } else {
                // Valid login.  Linking user ID to session
                req.session.userId = user._id
                return res.json({err: false, message: "Login success."})
            }
        })
    } else {
        return res.json({err: true, message: "Need email and password."})
    }
}

// middleware: destroys the user session
function logOut(req, res, next) {
    if (isLoggedIn(req)) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err)
            }
            return backHome(res)
        })
    } else {
        return backHome(res)
    }
}

/*
 * Admin checks
 */

function isAdmin(user) {
    return (user.admin === true)
}

// middleware: moves next() if user is admin, else redirects to home
function requiresAdmin(req, res, next) {
    if (isLoggedIn(req)) {
        User.findById(req.session.userId, function(err, user) {
            if (err) {
                return next(err)
            }
            if (isAdmin(user)) {
                return next()
            } else {
                return backHome(res)
            }
        })
    } else {
        return backHome(res)
    }

}

/*
 * Register attempt logic.  Responds to client with JSON if fail, else redirects home
 * Response to client: {err: bool, message: String}
 */
function attemptRegister(email, password, firstName, lastName, req, res) {
    User.register(email, password, firstName, lastName, function(err, user) {
        if (err) {
            return res.json({err: true, message: err.message})
        } else {
            req.session.userId = user._id
            return backHome(res)
        }
    })
}

/*
 * Form Operations
 */

// middleware: login via form-/req.body-based submission
function formLogin(req, res, next) {
    return attemptLogin(req.body.email, req.body.password, req, res)
}

// middleware: register via form-/req.body-based submission
function formRegister(req, res, next) {
    var rb = req.body
    if (rb.password && rb.confirmPassword) {
        if (rb.password === rb.confirmPassword) {
            return attemptRegister(rb.email, rb.password, rb.firstName, rb.lastName, req, res)
        } else {
            return res.json({err:true, message: "Passwords must match."})
        }
    } else {
        return res.json({err:true, message: "Enter password & confirm password"})
    }
}


module.exports = {
    init: init,
    logOut: logOut,
    isLoggedIn: isLoggedIn,
    requiresLogin: requiresLogin,
    attemptLogin: attemptLogin,
    isAdmin: isAdmin,
    requiresAdmin: requiresAdmin,
    attemptRegister: attemptRegister,
    formLogin: formLogin,
    formRegister: formRegister
}