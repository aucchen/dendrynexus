/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function($) {
  'use strict';

  var contentToHTML = require('./content/html');
  var engine = require('../engine');

  function addFadeIn($content) {
    $content.addClass('content_hidden');
    setTimeout(function() {
        $content.toggleClass('content_hidden');
        $content.toggleClass('content_visible');
    },
    50);
  }

  function addSlowFadeIn($content) {
    $content.addClass('content_hidden');
    setTimeout(function() {
        $content.toggleClass('content_hidden');
        $content.toggleClass('content_fade_in');
    },
    50);
  }

  var BrowserUserInterface = function(game, $content) {
    this.game = game;
    this.$content = $content;
    this._registerEvents();

    this.dendryEngine = new engine.DendryEngine(this, game);
    // TODO: consider displaying a sidebar with various qualities...
    this.hasSidebar = false;
    this.sidebarQualities = [];
  };
  engine.UserInterface.makeParentOf(BrowserUserInterface);

  // ------------------------------------------------------------------------
  // Main API

  BrowserUserInterface.prototype.displayContent = function(paragraphs) {
    var $html = $(contentToHTML.convert(paragraphs));
    if (this.game.animate) addFadeIn($html);
    this.$content.append($html);
    $html.focus();
  };
  BrowserUserInterface.prototype.displayGameOver = function() {
    var $p = $('<p>').text(this.getGameOverMsg()).addClass('game-over');
    if (this.game.animate) addFadeIn($p);
    this.$content.append($p);
    $p.focus();
  };
  BrowserUserInterface.prototype.displayChoices = function(choices) {
    var $ul = $('<ul>').addClass('choices');
    for (var i = 0; i < choices.length; ++i) {
      var choice = choices[i];

      var title = contentToHTML.convertLine(choice.title);
      var subtitle = "";
      if (choice.subtitle !== undefined) {
        subtitle = contentToHTML.convertLine(choice.subtitle);
      }

      var $li = $('<li>');
      var $titleHolder = $li;
      if (choice.canChoose) {
        $titleHolder = $('<a>').attr({href: '#', 'data-choice': i});
        $li.html($titleHolder);
      } else {
        $titleHolder.addClass('unavailable');
      }
      $titleHolder.html(title);
      if (subtitle) {
        $li.append($('<div>').addClass('subtitle').html(subtitle));
      }
      $ul.append($li);
    }
    if (this.game.animate) addFadeIn($ul);
    this.$content.append($ul);
    $ul.focus();
  };
  BrowserUserInterface.prototype.newPage = function() {
    this.$content.empty();
  };
  BrowserUserInterface.prototype.setStyle = function(style) {
    this.$content.removeClass();
    if (style !== undefined) {
      this.$content.addClass(style);
    }
  };
  BrowserUserInterface.prototype.removeChoices = function() {
    $('.choices', this.$content).remove();
    $('.hidden', this.$content).remove();
  };
  BrowserUserInterface.prototype.beginOutput = function() {
    $("#read-marker", this.$content).remove();
    this.$content.append($('<hr>').attr('id', 'read-marker'));
  };
  BrowserUserInterface.prototype.endOutput = function() {
    var $marker = $("#read-marker");
    if (this.game.animate) {
        if ($marker.length > 0) {
          $('html, body').animate({scrollTop: $marker.offset().top}, 500);
        } else {
          $('html, body').animate({scrollTop: 0}, 0);
        }
    }
  };
  BrowserUserInterface.prototype.signal = function(data) {
    // TODO: implement signals - signals contain signal, event, and id
    console.log(data);
    var signal = data.signal;
    // TODO: handle this in the game.js for each specific game
    if (window && window.handleSignal) {
        window.handleSignal(signal);
    }
  };
  BrowserUserInterface.prototype.setBg = function(image_url) {
      if (image_url == 'none' || image_url == 'null') {
          document.body.style.backgroundImage = 'none'; 
      } else if (image_url.startsWith('#') || image_url.startsWith('rgba(')) {
          document.body.style.backgroundImage = 'none'; 
          document.body.style.backgroundColor = image_url;
      } else {
          document.body.style.backgroundImage = "url('" + image_url + "')"; 
      }
  };

  // ------------------------------------------------------------------------
  // Additional methods

  BrowserUserInterface.prototype.getGameOverMsg = function() {
    return 'Game Over (reload to read again)';
  };

  BrowserUserInterface.prototype._registerEvents = function() {
    var that = this;
    this.$content.on('click', 'ul.choices li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = parseInt($(this).attr('data-choice'));
      that.dendryEngine.choose(choice);
      return false;
    });
    this.$content.on('click', 'ul.choices li', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $('a', this).click();
      return false;
    });
  };

  // ------------------------------------------------------------------------
  // Run when loaded.

  var main = function() {
    engine.convertJSONToGame(window.game.compiled, function(err, game) {
      if (err) {
        throw err;
      }

      var ui = new BrowserUserInterface(game, $('#content'));
      window.dendryUI = ui;
      // Allow the ui system to be customized before use.
      if (window.dendryModifyUI !== undefined) {
        // If it returns true, then we don't need to begin the game.
        var dontStart = window.dendryModifyUI(ui);
        if (dontStart) {
          return;
        }
      }
      ui.dendryEngine.beginGame();
    });
  };
  $(main);

}(jQuery));
