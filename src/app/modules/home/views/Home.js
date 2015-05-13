/**
 * New node file
 */
var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var _ = require('lodash');
var tpl = require('../templates/home.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  template: tpl
});