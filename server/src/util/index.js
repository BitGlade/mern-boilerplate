'use strict'

// Utilites

module.exports.isDef = function(item) {
    return (typeof item !== 'undefined')
}

/*
 * Redirect to home page (common operation for requires** function)
 */

module.exports.backHome = function(res) {
    return res.redirect('/')
}
