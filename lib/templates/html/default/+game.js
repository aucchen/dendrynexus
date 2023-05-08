(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "{{game.title}}" + '_' + "{{game.author}}";

  window.quickSave = function() {
      var saveString = JSON.stringify(window.dendryUI.dendryEngine.getExportableState());
      localStorage[TITLE+'_save_q'] = saveString;
      window.alert("Saved.");
  };

  window.saveSlot = function(slot) {
      var saveString = JSON.stringify(window.dendryUI.dendryEngine.getExportableState());
      localStorage[TITLE+'_save_' + slot] = saveString;
      var scene = window.dendryUI.dendryEngine.state.sceneId;
      var date = new Date(Date.now());
      date = scene + '\n(' + date.toLocaleString(undefined, DateOptions) + ')';
      localStorage[TITLE+'_save_timestamp_' + slot] = date;
      window.populateSaveSlots(slot + 1, 2);
  };
  
  // writes an autosave slot
  window.autosave = function() {
      var oldData = localStorage[TITLE+'_save_' + 'a0'];
      if (oldData) {
          localStorage[TITLE+'_save_'+'a1'] = oldData;
          localStorage[TITLE+'_save_timestamp_'+'a1'] = localStorage[TITLE+'_save_timestamp_'+'a0'];
      }
      var slot = 'a0';
      var saveString = JSON.stringify(window.dendryUI.dendryEngine.getExportableState());
      localStorage[TITLE+'_save_' + slot] = saveString;
      var scene = window.dendryUI.dendryEngine.state.sceneId;
      var date = new Date(Date.now());
      date = scene + '\n(' + date.toLocaleString(undefined, DateOptions) + ')';
      localStorage[TITLE+'_save_timestamp_' + slot] = date;
      window.populateSaveSlots(slot + 1, 2);
  };


  window.quickLoad = function() {
      if (localStorage[TITLE+'_save_q']) {
          var saveString = localStorage[TITLE+'_save_q'];
          window.dendryUI.dendryEngine.setState(JSON.parse(saveString));
          window.alert("Loaded.");
      } else {
          window.alert("No save available.");
      }
  };

  window.loadSlot = function(slot) {
      if (localStorage[TITLE+'_save_' + slot]) {
          var saveString = localStorage[TITLE+'_save_' + slot];
          window.dendryUI.dendryEngine.setState(JSON.parse(saveString));
          window.hideSaveSlots();
          window.alert("Loaded.");
      } else {
          window.alert("No save available.");
      }
  };

  window.deleteSlot = function(slot) {
      if (localStorage[TITLE+'_save_' + slot]) {
          localStorage[TITLE+'_save_' + slot] = '';
          localStorage[TITLE+'_save_timestamp_' + slot] = '';
          window.populateSaveSlots(slot + 1, 2);
      } else {
          window.alert("No save available.");
      }
  };

  window.populateSaveSlots = function(max_slots, max_auto_slots) {
      // this fills in the save information
      function createLoadListener(i) {
          return function(evt) {
                window.loadSlot(i);
          };
      }
      function createSaveListener(i) {
          return function(evt) {
                window.saveSlot(i);
          };
      }
      function createDeleteListener(i) {
          return function(evt) {
                window.deleteSlot(i);
          };
      }
      function populateSlot(id) {
          var save_element = document.getElementById('save_info_' + id);
          var save_button = document.getElementById('save_button_' + id);
          var delete_button = document.getElementById('delete_button_' + id);
          if (localStorage[TITLE+'_save_' + id]) {
              var timestamp = localStorage[TITLE+'_save_timestamp_' + id];
              save_element.textContent = timestamp;
              save_button.textContent = "Load";
              save_button.onclick = createLoadListener(id);
              delete_button.onclick = createDeleteListener(id);
          } else {
              save_button.textContent = "Save";
              save_element.textContent = "Empty";
              save_button.onclick = createSaveListener(id);
          }

      }
      for (var i = 0; i < max_slots; i++) {
          populateSlot(i);
      }
      for (i = 0; i < max_auto_slots; i++) {
          populateSlot('a'+i);
      }
  };


  window.showSaveSlots = function() {
      var save_element = document.getElementById('save');
      save_element.style.display = "block";
      // magic number lol
      window.populateSaveSlots(8, 2);
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('save');
              if (target == save_element) {
                  window.hideSaveSlots();
              }
          };
      }
  };

  window.hideSaveSlots = function() {
      var save_element = document.getElementById('save');
      save_element.style.display = "none";
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('stats')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('stats');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var animate_bg = window.dendryUI.animate_bg;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (animate_bg) {
        $('#animate_bg_yes')[0].checked = true;
    } else {
        $('#animate_bg_no')[0].checked = true;
    }
  };
  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root') {
        window.autosave();
    }
  };


  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings();
  };

}());
