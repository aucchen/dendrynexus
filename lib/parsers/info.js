/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function() {
  'use strict';

  var make = require('./make');
  var validators = require('./validators');

  // --------------------------------------------------------------------
  // Schemae
  // --------------------------------------------------------------------

  var infoSchema = {
    id: {
      remove: true
    },
    type: {
      remove: true,
      required: false,
      validate: validators.makeEnsureEqualTo('File type', 'info')
    },
    title: {
      required: true,
      validate: null
    },
    author: {
      required: true,
      validate: null
    },

    firstScene: {
      required: false,
      validate: validators.validateId
    },
    rootScene: {
      required: false,
      validate: validators.validateId
    },

    // true if animate
    animate: {
      required: false,
      validate: validators.validateBoolean,
    },
    sceneSignal: {
      required: false,
      validate: null
    },
    qualitySignal: {
      required: false,
      validate: null
    },
    // true if the sidebar is to be displayed
    // default is false
    // TODO: this doesn't actually do anything right now
    displaySidebar : {
      required: false,
      validate: validators.validateBoolean,
    },
    // true if a stats button link is to be shown.
    // default is false
    // TODO: this doesn't actually do anything right now
    displayStats : {
      required: false,
      validate: validators.validateBoolean,
    },
    // TODO: show the 'options' link - 
    // TODO: this doesn't actually do anything right now
    displayOptions : {
      required: false,
      validate: validators.validateBoolean,
    },
    // TODO: better parsing for this; should be parsing a list of qualities
    sidebarStats: {
      required: false,
      validate: validators.validateTagList,
    },

    content: {
      required: false,
      validate: null
    }
  };

  // --------------------------------------------------------------------

  module.exports = make.makeExports(infoSchema);
}());
