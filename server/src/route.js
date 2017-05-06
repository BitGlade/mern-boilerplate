'use strict'

/*
 * route.js: Main Routing File
 */


// imports
var express = require('express')
var path = require('path')

// modules
var api = require('./api')
var session = require('./middleware/session')
var logger = require('./logger')

// config
var cfg = require('./config.json')
var public_dir = path.resolve(cfg.public_dir)

// main router
var router = express.Router()


/*
 *  MAIN ROUTING CONFIG
 */

/* 1 - session */
router.use(session.init)


/* 2 - static assets */
router.use('/', express.static(public_dir))


/* 3 - API */
router.use('/api', api)

/* 4 - Other routes */
router.post('/login', formLogin)
router.post('/register', formRegister)

/* 5 - Error Handling : 404 */
router.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  return next(err)
});

/* 6 - Error Handling (Master) */
router.use(function(req, res, next, err) {
    if (err.status === 404) {
        res.redirect('/')
    } else {
        logger.error(err.message)
    }
})

// middleware: login via form-/req.body-based submission
function formLogin(req, res, next) {
    session.attemptLogin(req.body.email, req.body.password, req, res)
}

// middleware: register via form-/req.body-based submission
function formRegister(req, res, next) {
    var rb = req.body
    if (rb.password && rb.confirmPassword) {
        if (rb.password === rb.confirmPassword) {
            session.attemptRegister(rb.email, rb.password, rb.firstName, rb.lastName, req, res)
        } else {
            res.json({err:true, message: "Passwords must match."})
        }
    } else {
        res.json({err:true, message: "Enter password & confirm password"})
    }
}








// export
module.exports = router