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
router.post('/login', session.formLogin)
router.post('/logout', session.logOut)
router.post('/register', printCheck, session.formRegister)

/* 5 - Error Handling : 404 */
router.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  return next(err)
});

/* 6 - Error Handling (Master) */
router.use(function(req, res, next, err) {
    if (err.status === 404) {
        return res.redirect('/')
    } else {
        console.error('UNHANDLED ERROR:')
        return console.error(err.message)
    }
})

function printCheck(req,res,next) {
    //console.log(req)
    return next()
}






// export
module.exports = router