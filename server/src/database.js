'use strict'

var mongoose = require('mongoose'),
    chalk    = require('chalk')
var args     = require('./args'),
    logger   = require('./logger')

var db = args.db

mongoose.connect(db, connect_check)

function connect_check(err) {
    if (err) {
        //var failed_msg = '%s to Mongo! [db: %s]' % chalk.red('Failed to connect'), db
        console.error('%s to Mongo! [db: %s]', chalk.red('Failed to connect'), db)
    } else {
        //var success_msg = '%s to Mongo! [db: %s]' % chalk.green('Successfully connected'), db
        console.log('%s to Mongo! [db: %s]', chalk.green('Successfully connected'), db)
    }
}