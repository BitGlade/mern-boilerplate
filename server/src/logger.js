'use strict'

var winston = require('winston'),
    MongoDB = require('winston-mongodb').MongoDB

var args = require('./args')

var db = args.db

winston.configure({
    transports: [
        new (winston.transports.MongoDB) ({
            level: 'error',
            name: 'error-mongo',
            db: db,
            collection: 'errorLog'
        }),
        new (winston.transports.MongoDB) ({
            level: 'info',
            name: 'info-mongo',
            db: db,
            collection: 'infoLog'
        })
    ]
})

if (!args.env === 'production') {
    winston.add(winston.transports.Console, {level: 'error'})
}

module.exports = winston



