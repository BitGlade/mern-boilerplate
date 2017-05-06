'use strict'

// //  ///////  // //
// //  IMPORTS  // //
// //  ///////  // //
var express = require('express')
var helmet = require('helmet')
var morgan = require('morgan')
var chalk = require('chalk')
var bodyParser = require('body-parser')
var compression = require('compression')

// config
var cfg = require('./config.json')
var public_dir = cfg.public_dir
var args = require('./args')
process.env.NODE_ENV = args.env

// modules
var api = require('./api')




//  //////////  //
//  MIDDLEWARE  //
//  //////////  //
// EXPRESS APP
var app = express()

// helmet (security)
app.use(helmet())
// compression (performance)
app.use(compression())
// logging
var logging_format = '[' + chalk.yellow(':remote-addr') + '] :method :url :status :response-time ms - :res[content-length]'
app.use(morgan(logging_format))
// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// static public assets
app.use('/', express.static(public_dir))


app.use('/api', api)









app.listen()