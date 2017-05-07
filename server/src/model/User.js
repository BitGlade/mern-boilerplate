'use strict'

// password encrypting
var bcrypt = require('bcrypt')

// mongoose imports
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId

/*
 * User Model (Mongoose)
 */


// Model name
var name = 'User'

// Schema build
var schemaJSON = {
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    friends: [{type: ObjectId, ref: 'User'}],
    admin: {
        type: Boolean,
        default: false
    }


}

var Schema = new mongoose.Schema(schemaJSON)


// Schema mods
Schema.pre('save', function(next) {
    var user = this
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            // bcrypt error
            return next(err)
        }
        // stores hashed version of user password
        user.password = hash
        next()
    })
})

/*
 * Authenticates user via email & password
 * callback: function(userError, user)
 */
Schema.statics.authenticate = function(email, password, callback) {

    this.findOne({email: email}, function(err, user) {
        if (err) {
            // mongo find error
            return callback(err)
        } else if (!user) {
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err)
        }

        bcrypt.compare(password, user.password, function(err, isMatching) {
            if (err) {
                // bcrypt error
                return callback(err)
            } else if (!isMatching) {
                // invalid password
                var err = new Error('Invalid email or password')
                err.status = 401;
                return callback(err, null)
            } else {
                // valid password
                return callback(null, user)
            }
        })
    })
}

/*
 * Registers user
 * callback: function(userError, user)
 */
Schema.statics.register = function(email, password, firstName, lastName, callback) {
    var userData = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    }
    console.log('mongoReg')
    this.create(userData, function(err, user) {
        if (err) {
            console.log('mongoError')
            var err = new Error('User already exists')
            err.status = 401
            return callback(err, null)
        }
        console.log('mongoSuccess')
        return callback(null, user)
    })
}


// Model declaration
var Model = mongoose.model(name, Schema)

// export
module.exports = Model