/**
 * @file Allows Backbone / Marionette to be used in a Browserify application.
 */

/*jshint node: true */

var Backbone = require('backbone');

Backbone.$ = require('jquery');
Backbone.Marionette = require('backbone.marionette');
Backbone.Wreqr = require('backbone.wreqr');

require('backbone.touch');

module.exports = Backbone;
