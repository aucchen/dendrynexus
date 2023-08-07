/* dendry
 * http://github.com/aucchen/dendry
 *
 * MIT License
 */
(function() {
    // TODO: scene to drive a script
    var engine = require('../engine');
    var toText = require('./content/text');

    // This implements the prompt interface, and can either be random
    // or driven by a file. The file would contain the text of each choice.
    var RandomTest = function(game, consoleObj, width) {
        this.game = game;
        this.console = consoleObj || console;
        this.defaultWidth = width;

        this.dendryEngine = new engine.DendryEngine(this, game);
    };
    engine.UserInterface.makeParentOf(RandomTest);


    RandomTest.prototype.beginGame = function() {
        this._line();
        this.console.log(this.game.title.bold + ' by '.grey +
                         this.game.author.white.bold);
        this.console.log('(Ctrl+D or Q at prompt stops the game)'.grey);
        this._line();
    };

    RandomTest.prototype.displayContent = function(paragraphs) {
        var width = this._getWidth();
        var text = toText.convert(paragraphs, width);
        this.console.log(text);
    };

    RandomTest.prototype.displayChoices = function(choices) {
        var width = this._getWidth();
        var titleWrap = wordwrap(4, width);
        var subtitleWrap = wordwrap(7, width);
        for (var i = 0; i < choices.length; ++i) {
          var choice = choices[i];
          var title = (i + 1) + '. ' + toText.convertLine(choice.title);
          if (!choice.canChoose) {
            title = title.grey;
            title += ' [Unavailable]';
          }
          title = titleWrap(title);
          this.console.log(title);
          if (choice.subtitle) {
            var subtitle = subtitleWrap(choice.subtitle);
            this.console.log(subtitle.grey);
          }
        }
    };

    RandomTest.prototype.displayGameOver = function() {
        this.displayContent(simpleContent('Game Over'));
    };
    RandomTest.prototype.removeChoices = function() {};
    // Called when the player makes a choice and new content is about to be
    // added (i.e. isn't called between output when the next scene is arrived
    // at via go-to).
    RandomTest.prototype.beginOutput = function() {};
    RandomTest.prototype.endOutput = function() {};
    RandomTest.prototype.newPage = function() {};
    RandomTest.prototype.setStyle = function(style) {};
    RandomTest.prototype.signal = function(data) {};
    RandomTest.prototype.setBg = function(img) {};


    // copied from cli.js
    RandomTest.prototype.run = function(state, callback) {
        if (callback === undefined) {
            callback = state;
            state = undefined;
        }
        if (state) {
            this.beginGame();
            this.dendryEngine.setState(state);
        } else {
            this.dendryEngine.beginGame();
        }
        return this._getChoice(callback);
    };



    //------------------------------
    // Internal functions

    // see _doChoice in cli.js 
    RandomTest.prototype._getChoice = function(callback) {
        var that = this;

        if (this.dendryEngine.isGameOver()) {
            if (this.randomTest) {
                this._dumpAndQuit();
            }
            return callback();
        }
        var choices = this.dendryEngine.getCurrentChoices();
        var availableChoices = [];
        for (var i = 0; i < choices.length; i++) {
            availableChoices.push(choices[i].canChoose);
        }
        this._getChoice(callback);
    };

    module.exports = {
        RandomTest: RandomTest
    };
})();
