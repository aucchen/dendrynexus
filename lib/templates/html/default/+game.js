(function() {
  var game;
  var ui;

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var save = function() {
      var saveString = JSON.stringify(window.dendryUI.dendryEngine.getExportableState());
      localStorage["{{game.title}}  - {{game.author}}"] = saveString;
      window.alert("Saved.");
  };

  var load = function() {
      if (localStorage["{{game.title}} - {{game.author}}"]) {
          var saveString = localStorage["{{game.title}} - {{game.author}}"];
          window.dendryUI.dendryEngine.setState(JSON.parse(saveString));
          window.alert("Loaded.");
      } else {
          window.alert("No save available.");
      }
  };

  window.dendryModifyUI = main;
  window.dendrySave = save;
  window.dendryLoad = load;
}());
