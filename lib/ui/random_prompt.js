(function() {
    function RandomTestPrompt(dumpFile) {
        this.dumpFile = dumpFile;
    }

    RandomTestPrompt.prototype.get = function(params, callback) {
        var param = params[0];
        var name = param.name;
        var result = {};
        if (!param.numChoices) {
            if (name == 'filename') {
                result[name] = String(this.dumpFile);
                return callback(false, result);
            }
            return callback(true);
        }
        var numChoices = param.numChoices;
        var choice = Math.ceil(Math.random()*(numChoices)); 
        while (!param.availableChoices[choice-1]) {
            choice = Math.ceil(Math.random()*(numChoices)); 
        }
        result[name] = String(choice);
        return callback(false, result);
    };

    RandomTestPrompt.prototype.start = function() {
    };

    module.exports = {
        RandomTestPrompt: RandomTestPrompt
    };

})();
