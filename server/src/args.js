'use strict'

// argument parser
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2))
var mode = argv.mode

// config
var cfg = require('./config.json')

var args = cfg.run[mode]

module.exports = args

