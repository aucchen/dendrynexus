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
    console.log('addFadeIn', content);
    $content.addClass('content_hidden');
    setTimeout(function() {
        $content.toggleClass('content_hidden');
        $content.toggleClass('content_visible');
    },
    100);
  }

  function addFadeOut($content) {
    $content.addClass('content_visible');
    setTimeout(function() {
        $content.toggleClass('content_visible');
        $content.toggleClass('content_hidden');
    },
    100);
  }

  function addFadeOutIn($content) {
    console.log('addFadeOutIn', $content);
    $content.addClass('content_hidden');
    $content.removeClass('content_visible');
    setTimeout(function() {
        $content.removeClass('content_hidden');
        $content.addClass('content_visible');
    },
    100);
  }

  function addSlowFadeIn($content) {
    $content.addClass('content_hidden');
    setTimeout(function() {
        $content.toggleClass('content_hidden');
        $content.toggleClass('content_fade_in');
    },
    500);
  }

  var BrowserUserInterface = function(game, $content) {
    this.game = game;
    this.$content = $content;
    this._registerEvents();

    this.dendryEngine = new engine.DendryEngine(this, game);
    // TODO: consider displaying a sidebar with various qualities...
    this.hasSidebar = false;
    this.sidebarQualities = [];
    this.disable_bg = false;
    this.animate = false;
    this.animate_bg = false;
  };
  engine.UserInterface.makeParentOf(BrowserUserInterface);

  // ------------------------------------------------------------------------
  // Main API

  BrowserUserInterface.prototype.displayContent = function(paragraphs) {
    var $html = $(contentToHTML.convert(paragraphs));
    if (this.animate) addFadeIn($html);
    this.$content.append($html);
    $html.focus();
  };
  BrowserUserInterface.prototype.displayGameOver = function() {
    var $p = $('<p>').text(this.getGameOverMsg()).addClass('game-over');
    if (this.animate) addFadeIn($p);
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
    if (this.animate) addFadeIn($ul);
    this.$content.append($ul);
    $ul.focus();
  };
  BrowserUserInterface.prototype.newPage = function() {
    if (this.animate) {
        // TODO: this doesn't actually work...
        this.$content.children().removeClass('content_visible');
        this.$content.children().addClass('content_hidden');
        addFadeOutIn(this.$content);
        this.$content.empty();
    } else {
        this.$content.empty();
    }
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
    if (this.animate) {
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
      if (!image_url || image_url == 'none' || image_url == 'null' || this.disable_bg) {
          if (this.animate_bg) {
            $('#bg1').addClass('content_hidden');
            $('#bg1').removeClass('content_visible');
            setTimeout(function() {
                $('#bg1').css('background-image', 'none'); 
                $('#bg1').removeClass('content_hidden');
                $('#bg1').addClass('content_visible');
            },
            100);
          } else {
              $('#bg1').css('backgroundImage', 'none'); 
          }
      } else if (image_url.startsWith('#') || image_url.startsWith('rgba(')) {
          if (this.animate_bg) {
            $('#bg1').addClass('content_hidden');
            $('#bg1').removeClass('content_visible');
            setTimeout(function() {
                $('#bg1').css('background-image', 'none'); 
                $('#bg1').css('bacground-color', image_url);
                $('#bg1').removeClass('content_hidden');
                $('#bg1').addClass('content_visible');
            },
            100);
          } else {
              $('#bg1').css('background-image', 'none'); 
              $('#bg1').css('bacground-color', image_url);
          }
      } else {
          if (this.animate_bg) {
            $('#bg1').addClass('content_hidden');
            $('#bg1').removeClass('content_visible');
            setTimeout(function() {
                $('#bg1').css('background-image', 'url("' + image_url + '")'); 
            },
            500);
            setTimeout(function() {
                $('#bg1').removeClass('content_hidden');
                $('#bg1').addClass('content_visible');
            }, 550);
            setTimeout(function() {
                $('#bg2').css('background-image', $('#bg1').css('background-image'));
            }, 1000);
          } else {
              $('#bg2').css('background-image', $('#bg1').css('background-image'));
              $('#bg1').css('background-image', 'url("' + image_url + '")'); 
          }
      }
  };

  BrowserUserInterface.prototype.saveSettings = function() {
    if (typeof localStorage !== 'undefined') {
        localStorage[this.game.title + '_animate'] = this.animate;
        localStorage[this.game.title + '_disable_bg'] = this.disable_bg;
        localStorage[this.game.title + '_animate_bg'] = this.animate_bg;
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
