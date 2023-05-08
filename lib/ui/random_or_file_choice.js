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
    };
    RandomTest.prototype.displayContent = function(paragraphs) {
        var width = this._getWidth();
        var text = toText.convert(paragraphs, width);
        this.console.log(text);
    };
    RandomTest.prototype.displayChoices = function(choices) {};
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


    module.exports = {
        RandomTest: RandomTest
    };
})();
