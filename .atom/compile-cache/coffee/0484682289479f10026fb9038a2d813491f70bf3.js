(function() {
  var CompositeDisposable, EarlyTerminationSignal, Emitter, HighlightedAreaView, MarkerLayer, Range, StatusBarView, escapeRegExp, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter, MarkerLayer = ref.MarkerLayer;

  StatusBarView = require('./status-bar-view');

  escapeRegExp = require('./escape-reg-exp');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.destroyScrollMarkers = bind(this.destroyScrollMarkers, this);
      this.setScrollMarkerView = bind(this.setScrollMarkerView, this);
      this.setupMarkerLayers = bind(this.setupMarkerLayers, this);
      this.setScrollMarker = bind(this.setScrollMarker, this);
      this.selectAll = bind(this.selectAll, this);
      this.listenForStatusBarChange = bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = bind(this.removeStatusBar, this);
      this.setupStatusBar = bind(this.setupStatusBar, this);
      this.removeMarkers = bind(this.removeMarkers, this);
      this.removeAllMarkers = bind(this.removeAllMarkers, this);
      this.handleSelection = bind(this.handleSelection, this);
      this.debouncedHandleSelection = bind(this.debouncedHandleSelection, this);
      this.setStatusBar = bind(this.setStatusBar, this);
      this.enable = bind(this.enable, this);
      this.disable = bind(this.disable, this);
      this.onDidRemoveAllMarkers = bind(this.onDidRemoveAllMarkers, this);
      this.onDidAddSelectedMarkerForEditor = bind(this.onDidAddSelectedMarkerForEditor, this);
      this.onDidAddMarkerForEditor = bind(this.onDidAddMarkerForEditor, this);
      this.onDidAddSelectedMarker = bind(this.onDidAddSelectedMarker, this);
      this.onDidAddMarker = bind(this.onDidAddMarker, this);
      this.destroy = bind(this.destroy, this);
      this.emitter = new Emitter;
      this.editorToMarkerLayerMap = {};
      this.markerLayers = [];
      this.resultCount = 0;
      this.editorSubscriptions = new CompositeDisposable();
      this.editorSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this.setupMarkerLayers(editor);
          return _this.setScrollMarkerView(editor);
        };
      })(this)));
      this.editorSubscriptions.add(atom.workspace.onWillDestroyPaneItem((function(_this) {
        return function(item) {
          var editor;
          if (item.item.constructor.name !== 'TextEditor') {
            return;
          }
          editor = item.item;
          _this.removeMarkers(editor.id);
          delete _this.editorToMarkerLayerMap[editor.id];
          return _this.destroyScrollMarkers(editor);
        };
      })(this)));
      this.enable();
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
      this.listenForStatusBarChange();
      this.enableScrollViewObserveSubscription = atom.config.observe('highlight-selected.showResultsOnScrollBar', (function(_this) {
        return function(enabled) {
          if (enabled) {
            _this.ensureScrollViewInstalled();
            return atom.workspace.getTextEditors().forEach(_this.setScrollMarkerView);
          } else {
            return atom.workspace.getTextEditors().forEach(_this.destroyScrollMarkers);
          }
        };
      })(this));
    }

    HighlightedAreaView.prototype.destroy = function() {
      var ref1, ref2, ref3, ref4, ref5;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.enableScrollViewObserveSubscription) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.editorSubscriptions) != null) {
        ref3.dispose();
      }
      if ((ref4 = this.statusBarView) != null) {
        ref4.removeElement();
      }
      if ((ref5 = this.statusBarTile) != null) {
        ref5.destroy();
      }
      return this.statusBarTile = null;
    };

    HighlightedAreaView.prototype.onDidAddMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-selected-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-selected-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidRemoveAllMarkers = function(callback) {
      return this.emitter.on('did-remove-marker-layer', callback);
    };

    HighlightedAreaView.prototype.disable = function() {
      this.disabled = true;
      return this.removeAllMarkers();
    };

    HighlightedAreaView.prototype.enable = function() {
      this.disabled = false;
      return this.debouncedHandleSelection();
    };

    HighlightedAreaView.prototype.setStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.setupStatusBar();
    };

    HighlightedAreaView.prototype.debouncedHandleSelection = function() {
      clearTimeout(this.handleSelectionTimeout);
      return this.handleSelectionTimeout = setTimeout((function(_this) {
        return function() {
          return _this.handleSelection();
        };
      })(this), atom.config.get('highlight-selected.timeout'));
    };

    HighlightedAreaView.prototype.listenForTimeoutChange = function() {
      return atom.config.onDidChange('highlight-selected.timeout', (function(_this) {
        return function() {
          return _this.debouncedHandleSelection();
        };
      })(this));
    };

    HighlightedAreaView.prototype.subscribeToActiveTextEditor = function() {
      var editor, ref1;
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.selectionSubscription = new CompositeDisposable;
      this.selectionSubscription.add(editor.onDidAddSelection(this.debouncedHandleSelection));
      this.selectionSubscription.add(editor.onDidChangeSelectionRange(this.debouncedHandleSelection));
      return this.handleSelection();
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightedAreaView.prototype.getActiveEditors = function() {
      return atom.workspace.getPanes().map(function(pane) {
        var activeItem;
        activeItem = pane.activeItem;
        if (activeItem && activeItem.constructor.name === 'TextEditor') {
          return activeItem;
        }
      });
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var allowedCharactersToSelect, editor, lastSelection, nonWordCharacters, nonWordCharactersToStrip, originalEditor, ref1, regex, regexFlags, regexForWholeWord, regexSearch, selectionStart, text;
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.removeAllMarkers();
      if (this.disabled) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      this.selections = editor.getSelections();
      lastSelection = editor.getLastSelection();
      text = lastSelection.getText();
      if (text.length < atom.config.get('highlight-selected.minimumLength')) {
        return;
      }
      if (text.includes('\n')) {
        return;
      }
      regex = new RegExp("^\\s+$");
      if (regex.test(text)) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      regexSearch = escapeRegExp(text);
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (!this.isWordSelected(lastSelection)) {
          return;
        }
        selectionStart = lastSelection.getBufferRange().start;
        nonWordCharacters = this.getNonWordCharacters(editor, selectionStart);
        allowedCharactersToSelect = atom.config.get('highlight-selected.allowedCharactersToSelect');
        nonWordCharactersToStrip = nonWordCharacters.replace(new RegExp("[" + allowedCharactersToSelect + "]", 'g'), '');
        regexForWholeWord = new RegExp("[ \\t" + (escapeRegExp(nonWordCharactersToStrip)) + "]", regexFlags);
        if (regexForWholeWord.test(text)) {
          return;
        }
        regexSearch = ("(?:[ \\t" + (escapeRegExp(nonWordCharacters)) + "]|^)(") + regexSearch + (")(?:[ \\t" + (escapeRegExp(nonWordCharacters)) + "]|$)");
      }
      this.resultCount = 0;
      if (atom.config.get('highlight-selected.highlightInPanes')) {
        originalEditor = editor;
        this.getActiveEditors().forEach((function(_this) {
          return function(editor) {
            return _this.highlightSelectionInEditor(editor, regexSearch, regexFlags, originalEditor);
          };
        })(this));
      } else {
        this.highlightSelectionInEditor(editor, regexSearch, regexFlags);
      }
      return (ref1 = this.statusBarElement) != null ? ref1.updateCount(this.resultCount) : void 0;
    };

    HighlightedAreaView.prototype.highlightSelectionInEditor = function(editor, regexSearch, regexFlags, originalEditor) {
      var error, markerLayer, markerLayerForHiddenMarkers, markerLayers, maximumHighlights;
      if (editor == null) {
        return;
      }
      maximumHighlights = atom.config.get('highlight-selected.maximumHighlights');
      if (!(this.resultCount < maximumHighlights)) {
        return;
      }
      markerLayers = this.editorToMarkerLayerMap[editor.id];
      if (markerLayers == null) {
        return;
      }
      markerLayer = markerLayers['visibleMarkerLayer'];
      markerLayerForHiddenMarkers = markerLayers['selectedMarkerLayer'];
      try {
        editor.scan(new RegExp(regexSearch, regexFlags), (function(_this) {
          return function(result) {
            var marker, newResult;
            if (_this.resultCount >= maximumHighlights) {
              throw new EarlyTerminationSignal;
            }
            newResult = result;
            if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
              editor.scanInBufferRange(new RegExp(escapeRegExp(result.match[1])), result.range, function(e) {
                return newResult = e;
              });
            }
            if (newResult == null) {
              return;
            }
            _this.resultCount += 1;
            if (_this.showHighlightOnSelectedWord(newResult.range, _this.selections) && (originalEditor != null ? originalEditor.id : void 0) === editor.id) {
              marker = markerLayerForHiddenMarkers.markBufferRange(newResult.range);
              _this.emitter.emit('did-add-selected-marker', marker);
              return _this.emitter.emit('did-add-selected-marker-for-editor', {
                marker: marker,
                editor: editor
              });
            } else {
              marker = markerLayer.markBufferRange(newResult.range);
              _this.emitter.emit('did-add-marker', marker);
              return _this.emitter.emit('did-add-marker-for-editor', {
                marker: marker,
                editor: editor
              });
            }
          };
        })(this));
      } catch (error1) {
        error = error1;
        if (!(error instanceof EarlyTerminationSignal)) {
          throw error;
        }
      }
      return editor.decorateMarkerLayer(markerLayer, {
        type: 'highlight',
        "class": this.makeClasses()
      });
    };

    HighlightedAreaView.prototype.makeClasses = function() {
      var className;
      className = 'highlight-selected';
      if (atom.config.get('highlight-selected.lightTheme')) {
        className += ' light-theme';
      }
      if (atom.config.get('highlight-selected.highlightBackground')) {
        className += ' background';
      }
      return className;
    };

    HighlightedAreaView.prototype.showHighlightOnSelectedWord = function(range, selections) {
      var i, len, outcome, selection, selectionRange;
      if (!atom.config.get('highlight-selected.hideHighlightOnSelectedWord')) {
        return false;
      }
      outcome = false;
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        selectionRange = selection.getBufferRange();
        outcome = (range.start.column === selectionRange.start.column) && (range.start.row === selectionRange.start.row) && (range.end.column === selectionRange.end.column) && (range.end.row === selectionRange.end.row);
        if (outcome) {
          break;
        }
      }
      return outcome;
    };

    HighlightedAreaView.prototype.removeAllMarkers = function() {
      return Object.keys(this.editorToMarkerLayerMap).forEach(this.removeMarkers);
    };

    HighlightedAreaView.prototype.removeMarkers = function(editorId) {
      var markerLayer, ref1, selectedMarkerLayer;
      if (this.editorToMarkerLayerMap[editorId] == null) {
        return;
      }
      markerLayer = this.editorToMarkerLayerMap[editorId]['visibleMarkerLayer'];
      selectedMarkerLayer = this.editorToMarkerLayerMap[editorId]['selectedMarkerLayer'];
      markerLayer.clear();
      selectedMarkerLayer.clear();
      if ((ref1 = this.statusBarElement) != null) {
        ref1.updateCount(0);
      }
      return this.emitter.emit('did-remove-marker-layer');
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = selectionRange.start.isEqual(lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = selectionRange.end.isEqual(lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.getNonWordCharacters = function(editor, point) {
      var nonWordCharacters, scopeDescriptor;
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(point);
      return nonWordCharacters = atom.config.get('editor.nonWordCharacters', {
        scope: scopeDescriptor
      });
    };

    HighlightedAreaView.prototype.isNonWord = function(editor, range) {
      var nonWordCharacters, text;
      nonWordCharacters = this.getNonWordCharacters(editor, range.start);
      text = editor.getTextInBufferRange(range);
      return new RegExp("[ \t" + (escapeRegExp(nonWordCharacters)) + "]").test(text);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWord(this.getActiveEditor(), range);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWord(this.getActiveEditor(), range);
    };

    HighlightedAreaView.prototype.setupStatusBar = function() {
      if (this.statusBarElement != null) {
        return;
      }
      if (!atom.config.get('highlight-selected.showInStatusBar')) {
        return;
      }
      this.statusBarElement = new StatusBarView();
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this.statusBarElement.getElement(),
        priority: 100
      });
    };

    HighlightedAreaView.prototype.removeStatusBar = function() {
      var ref1;
      if (this.statusBarElement == null) {
        return;
      }
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      this.statusBarTile = null;
      return this.statusBarElement = null;
    };

    HighlightedAreaView.prototype.listenForStatusBarChange = function() {
      return atom.config.onDidChange('highlight-selected.showInStatusBar', (function(_this) {
        return function(changed) {
          if (changed.newValue) {
            return _this.setupStatusBar();
          } else {
            return _this.removeStatusBar();
          }
        };
      })(this));
    };

    HighlightedAreaView.prototype.selectAll = function() {
      var editor, i, j, len, len1, marker, markerLayer, markerLayers, ranges, ref1, ref2;
      editor = this.getActiveEditor();
      markerLayers = this.editorToMarkerLayerMap[editor.id];
      if (markerLayers == null) {
        return;
      }
      ranges = [];
      ref1 = [markerLayers['visibleMarkerLayer'], markerLayers['selectedMarkerLayer']];
      for (i = 0, len = ref1.length; i < len; i++) {
        markerLayer = ref1[i];
        ref2 = markerLayer.getMarkers();
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          marker = ref2[j];
          ranges.push(marker.getBufferRange());
        }
      }
      if (ranges.length > 0) {
        return editor.setSelectedBufferRanges(ranges, {
          flash: true
        });
      }
    };

    HighlightedAreaView.prototype.setScrollMarker = function(scrollMarkerAPI) {
      this.scrollMarker = scrollMarkerAPI;
      if (atom.config.get('highlight-selected.showResultsOnScrollBar')) {
        this.ensureScrollViewInstalled();
        return atom.workspace.getTextEditors().forEach(this.setScrollMarkerView);
      }
    };

    HighlightedAreaView.prototype.ensureScrollViewInstalled = function() {
      if (!atom.inSpecMode()) {
        return require('atom-package-deps').install('highlight-selected', true);
      }
    };

    HighlightedAreaView.prototype.setupMarkerLayers = function(editor) {
      var markerLayer, markerLayerForHiddenMarkers;
      if (this.editorToMarkerLayerMap[editor.id] != null) {
        markerLayer = this.editorToMarkerLayerMap[editor.id]['visibleMarkerLayer'];
        return markerLayerForHiddenMarkers = this.editorToMarkerLayerMap[editor.id]['selectedMarkerLayer'];
      } else {
        markerLayer = editor.addMarkerLayer();
        markerLayerForHiddenMarkers = editor.addMarkerLayer();
        return this.editorToMarkerLayerMap[editor.id] = {
          visibleMarkerLayer: markerLayer,
          selectedMarkerLayer: markerLayerForHiddenMarkers
        };
      }
    };

    HighlightedAreaView.prototype.setScrollMarkerView = function(editor) {
      var markerLayer, scrollMarkerView, selectedMarkerLayer;
      if (!atom.config.get('highlight-selected.showResultsOnScrollBar')) {
        return;
      }
      if (this.scrollMarker == null) {
        return;
      }
      scrollMarkerView = this.scrollMarker.scrollMarkerViewForEditor(editor);
      markerLayer = this.editorToMarkerLayerMap[editor.id]['visibleMarkerLayer'];
      selectedMarkerLayer = this.editorToMarkerLayerMap[editor.id]['selectedMarkerLayer'];
      scrollMarkerView.getLayer("highlight-selected-marker-layer").syncToMarkerLayer(markerLayer);
      return scrollMarkerView.getLayer("highlight-selected-selected-marker-layer").syncToMarkerLayer(selectedMarkerLayer);
    };

    HighlightedAreaView.prototype.destroyScrollMarkers = function(editor) {
      var scrollMarkerView;
      if (this.scrollMarker == null) {
        return;
      }
      scrollMarkerView = this.scrollMarker.scrollMarkerViewForEditor(editor);
      return scrollMarkerView.destroy();
    };

    return HighlightedAreaView;

  })();

  EarlyTerminationSignal = (function(superClass) {
    extend(EarlyTerminationSignal, superClass);

    function EarlyTerminationSignal() {
      return EarlyTerminationSignal.__super__.constructor.apply(this, arguments);
    }

    return EarlyTerminationSignal;

  })(Error);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9oaWdobGlnaHRlZC1hcmVhLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrSEFBQTtJQUFBOzs7O0VBQUEsTUFBcUQsT0FBQSxDQUFRLE1BQVIsQ0FBckQsRUFBQyxpQkFBRCxFQUFRLDZDQUFSLEVBQTZCLHFCQUE3QixFQUFzQzs7RUFDdEMsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVI7O0VBQ2hCLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLDZCQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLHNCQUFELEdBQTBCO01BQzFCLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQ2hCLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFFZixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBSSxtQkFBSixDQUFBO01BQ3ZCLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxHQUFyQixDQUF5QixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO1VBQ3pELEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixNQUFuQjtpQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsTUFBckI7UUFGeUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQXpCO01BS0EsSUFBQyxDQUFBLG1CQUFtQixDQUFDLEdBQXJCLENBQXlCLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBcUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7QUFDNUQsY0FBQTtVQUFBLElBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxX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QUMsTUFBRDtBQUNuQixVQUFBO01BQUEsSUFBQSxDQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQ0FBaEIsQ0FBZDtBQUFBLGVBQUE7O01BQ0EsSUFBYyx5QkFBZDtBQUFBLGVBQUE7O01BRUEsZ0JBQUEsR0FBbUIsSUFBQyxDQUFBLFlBQVksQ0FBQyx5QkFBZCxDQUF3QyxNQUF4QztNQUVuQixXQUFBLEdBQWMsSUFBQyxDQUFBLHNCQUF1QixDQUFBLE1BQU0sQ0FBQyxFQUFQLENBQVcsQ0FBQSxvQkFBQTtNQUNqRCxtQkFBQSxHQUFzQixJQUFDLENBQUEsc0JBQXVCLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBVyxDQUFBLHFCQUFBO01BRXpELGdCQUFnQixDQUFDLFFBQWpCLENBQTBCLGlDQUExQixDQUNnQixDQUFDLGlCQURqQixDQUNtQyxXQURuQzthQUVBLGdCQUFnQixDQUFDLFFBQWpCLENBQTBCLDBDQUExQixDQUNnQixDQUFDLGlCQURqQixDQUNtQyxtQkFEbkM7SUFYbUI7O2tDQWNyQixvQkFBQSxHQUFzQixTQUFDLE1BQUQ7QUFDcEIsVUFBQTtNQUFBLElBQWMseUJBQWQ7QUFBQSxlQUFBOztNQUVBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxZQUFZLENBQUMseUJBQWQsQ0FBd0MsTUFBeEM7YUFDbkIsZ0JBQWdCLENBQUMsT0FBakIsQ0FBQTtJQUpvQjs7Ozs7O0VBTWxCOzs7Ozs7Ozs7S0FBK0I7QUFwWHJDIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyLCBNYXJrZXJMYXllcn0gPSByZXF1aXJlICdhdG9tJ1xuU3RhdHVzQmFyVmlldyA9IHJlcXVpcmUgJy4vc3RhdHVzLWJhci12aWV3J1xuZXNjYXBlUmVnRXhwID0gcmVxdWlyZSAnLi9lc2NhcGUtcmVnLWV4cCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgSGlnaGxpZ2h0ZWRBcmVhVmlld1xuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAZWRpdG9yVG9NYXJrZXJMYXllck1hcCA9IHt9XG4gICAgQG1hcmtlckxheWVycyA9IFtdXG4gICAgQHJlc3VsdENvdW50ID0gMFxuXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PlxuICAgICAgQHNldHVwTWFya2VyTGF5ZXJzKGVkaXRvcilcbiAgICAgIEBzZXRTY3JvbGxNYXJrZXJWaWV3KGVkaXRvcilcbiAgICApKVxuXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9uV2lsbERlc3Ryb3lQYW5lSXRlbSgoaXRlbSkgPT5cbiAgICAgIHJldHVybiB1bmxlc3MgaXRlbS5pdGVtLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ1RleHRFZGl0b3InXG4gICAgICBlZGl0b3IgPSBpdGVtLml0ZW1cbiAgICAgIEByZW1vdmVNYXJrZXJzKGVkaXRvci5pZClcbiAgICAgIGRlbGV0ZSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdXG4gICAgICBAZGVzdHJveVNjcm9sbE1hcmtlcnMoZWRpdG9yKVxuICAgICkpXG5cbiAgICBAZW5hYmxlKClcbiAgICBAbGlzdGVuRm9yVGltZW91dENoYW5nZSgpXG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uKClcbiAgICAgIEBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBsaXN0ZW5Gb3JTdGF0dXNCYXJDaGFuZ2UoKVxuXG4gICAgQGVuYWJsZVNjcm9sbFZpZXdPYnNlcnZlU3Vic2NyaXB0aW9uID1cbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93UmVzdWx0c09uU2Nyb2xsQmFyJywgKGVuYWJsZWQpID0+XG4gICAgICAgIGlmIGVuYWJsZWRcbiAgICAgICAgICBAZW5zdXJlU2Nyb2xsVmlld0luc3RhbGxlZCgpXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoKEBzZXRTY3JvbGxNYXJrZXJWaWV3KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoKEBkZXN0cm95U2Nyb2xsTWFya2VycylcblxuICBkZXN0cm95OiA9PlxuICAgIGNsZWFyVGltZW91dChAaGFuZGxlU2VsZWN0aW9uVGltZW91dClcbiAgICBAYWN0aXZlSXRlbVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAZW5hYmxlU2Nyb2xsVmlld09ic2VydmVTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAc3RhdHVzQmFyVmlldz8ucmVtb3ZlRWxlbWVudCgpXG4gICAgQHN0YXR1c0JhclRpbGU/LmRlc3Ryb3koKVxuICAgIEBzdGF0dXNCYXJUaWxlID0gbnVsbFxuXG4gIG9uRGlkQWRkTWFya2VyOiAoY2FsbGJhY2spID0+XG4gICAgR3JpbSA9IHJlcXVpcmUgJ2dyaW0nXG4gICAgR3JpbS5kZXByZWNhdGUoXCJQbGVhc2UgZG8gbm90IHVzZS4gVGhpcyBtZXRob2Qgd2lsbCBiZSByZW1vdmVkLlwiKVxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLW1hcmtlcicsIGNhbGxiYWNrXG5cbiAgb25EaWRBZGRTZWxlY3RlZE1hcmtlcjogKGNhbGxiYWNrKSA9PlxuICAgIEdyaW0gPSByZXF1aXJlICdncmltJ1xuICAgIEdyaW0uZGVwcmVjYXRlKFwiUGxlYXNlIGRvIG5vdCB1c2UuIFRoaXMgbWV0aG9kIHdpbGwgYmUgcmVtb3ZlZC5cIilcbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkQWRkTWFya2VyRm9yRWRpdG9yOiAoY2FsbGJhY2spID0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtbWFya2VyLWZvci1lZGl0b3InLCBjYWxsYmFja1xuXG4gIG9uRGlkQWRkU2VsZWN0ZWRNYXJrZXJGb3JFZGl0b3I6IChjYWxsYmFjaykgPT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXItZm9yLWVkaXRvcicsIGNhbGxiYWNrXG5cbiAgb25EaWRSZW1vdmVBbGxNYXJrZXJzOiAoY2FsbGJhY2spID0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1yZW1vdmUtbWFya2VyLWxheWVyJywgY2FsbGJhY2tcblxuICBkaXNhYmxlOiA9PlxuICAgIEBkaXNhYmxlZCA9IHRydWVcbiAgICBAcmVtb3ZlQWxsTWFya2VycygpXG5cbiAgZW5hYmxlOiA9PlxuICAgIEBkaXNhYmxlZCA9IGZhbHNlXG4gICAgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbigpXG5cbiAgc2V0U3RhdHVzQmFyOiAoc3RhdHVzQmFyKSA9PlxuICAgIEBzdGF0dXNCYXIgPSBzdGF0dXNCYXJcbiAgICBAc2V0dXBTdGF0dXNCYXIoKVxuXG4gIGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbjogPT5cbiAgICBjbGVhclRpbWVvdXQoQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQpXG4gICAgQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG4gICAgICBAaGFuZGxlU2VsZWN0aW9uKClcbiAgICAsIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnRpbWVvdXQnKVxuXG4gIGxpc3RlbkZvclRpbWVvdXRDaGFuZ2U6IC0+XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2hpZ2hsaWdodC1zZWxlY3RlZC50aW1lb3V0JywgPT5cbiAgICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuXG4gIHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcjogLT5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcblxuICAgIGVkaXRvciA9IEBnZXRBY3RpdmVFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yXG5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24uYWRkKFxuICAgICAgZWRpdG9yLm9uRGlkQWRkU2VsZWN0aW9uIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb25cbiAgICApXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICBlZGl0b3Iub25EaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uXG4gICAgKVxuICAgIEBoYW5kbGVTZWxlY3Rpb24oKVxuXG4gIGdldEFjdGl2ZUVkaXRvcjogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICBnZXRBY3RpdmVFZGl0b3JzOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLmdldFBhbmVzKCkubWFwIChwYW5lKSAtPlxuICAgICAgYWN0aXZlSXRlbSA9IHBhbmUuYWN0aXZlSXRlbVxuICAgICAgYWN0aXZlSXRlbSBpZiBhY3RpdmVJdGVtIGFuZCBhY3RpdmVJdGVtLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ1RleHRFZGl0b3InXG5cbiAgaGFuZGxlU2VsZWN0aW9uOiA9PlxuICAgIGVkaXRvciA9IEBnZXRBY3RpdmVFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yXG5cbiAgICBAcmVtb3ZlQWxsTWFya2VycygpXG5cbiAgICByZXR1cm4gaWYgQGRpc2FibGVkXG4gICAgcmV0dXJuIGlmIGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuaXNFbXB0eSgpXG5cbiAgICBAc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICBsYXN0U2VsZWN0aW9uID0gZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKVxuICAgIHRleHQgPSBsYXN0U2VsZWN0aW9uLmdldFRleHQoKVxuXG4gICAgcmV0dXJuIGlmIHRleHQubGVuZ3RoIDwgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQubWluaW11bUxlbmd0aCcpXG4gICAgcmV0dXJuIGlmIHRleHQuaW5jbHVkZXMoJ1xcbicpXG4gICAgcmVnZXggPSBuZXcgUmVnRXhwKFwiXlxcXFxzKyRcIilcbiAgICByZXR1cm4gaWYgcmVnZXgudGVzdCh0ZXh0KVxuXG4gICAgcmVnZXhGbGFncyA9ICdnJ1xuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmlnbm9yZUNhc2UnKVxuICAgICAgcmVnZXhGbGFncyA9ICdnaSdcblxuICAgIHJlZ2V4U2VhcmNoID0gZXNjYXBlUmVnRXhwKHRleHQpXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5vbmx5SGlnaGxpZ2h0V2hvbGVXb3JkcycpXG4gICAgICByZXR1cm4gdW5sZXNzIEBpc1dvcmRTZWxlY3RlZChsYXN0U2VsZWN0aW9uKVxuICAgICAgc2VsZWN0aW9uU3RhcnQgPSBsYXN0U2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnRcbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJzID0gQGdldE5vbldvcmRDaGFyYWN0ZXJzKGVkaXRvciwgc2VsZWN0aW9uU3RhcnQpXG4gICAgICBhbGxvd2VkQ2hhcmFjdGVyc1RvU2VsZWN0ID0gYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuYWxsb3dlZENoYXJhY3RlcnNUb1NlbGVjdCcpXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyc1RvU3RyaXAgPSBub25Xb3JkQ2hhcmFjdGVycy5yZXBsYWNlKFxuICAgICAgICBuZXcgUmVnRXhwKFwiWyN7YWxsb3dlZENoYXJhY3RlcnNUb1NlbGVjdH1dXCIsICdnJyksICcnKVxuICAgICAgcmVnZXhGb3JXaG9sZVdvcmQgPSBuZXcgUmVnRXhwKFwiWyBcXFxcdCN7ZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzVG9TdHJpcCl9XVwiLCByZWdleEZsYWdzKVxuICAgICAgcmV0dXJuIGlmIHJlZ2V4Rm9yV2hvbGVXb3JkLnRlc3QodGV4dClcbiAgICAgIHJlZ2V4U2VhcmNoID1cbiAgICAgICAgXCIoPzpbIFxcXFx0I3tlc2NhcGVSZWdFeHAobm9uV29yZENoYXJhY3RlcnMpfV18XikoXCIgK1xuICAgICAgICByZWdleFNlYXJjaCArXG4gICAgICAgIFwiKSg/OlsgXFxcXHQje2VzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVycyl9XXwkKVwiXG5cbiAgICBAcmVzdWx0Q291bnQgPSAwXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuaGlnaGxpZ2h0SW5QYW5lcycpXG4gICAgICBvcmlnaW5hbEVkaXRvciA9IGVkaXRvclxuICAgICAgQGdldEFjdGl2ZUVkaXRvcnMoKS5mb3JFYWNoIChlZGl0b3IpID0+XG4gICAgICAgIEBoaWdobGlnaHRTZWxlY3Rpb25JbkVkaXRvcihlZGl0b3IsIHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzLCBvcmlnaW5hbEVkaXRvcilcbiAgICBlbHNlXG4gICAgICBAaGlnaGxpZ2h0U2VsZWN0aW9uSW5FZGl0b3IoZWRpdG9yLCByZWdleFNlYXJjaCwgcmVnZXhGbGFncylcblxuICAgIEBzdGF0dXNCYXJFbGVtZW50Py51cGRhdGVDb3VudChAcmVzdWx0Q291bnQpXG5cbiAgaGlnaGxpZ2h0U2VsZWN0aW9uSW5FZGl0b3I6IChlZGl0b3IsIHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzLCBvcmlnaW5hbEVkaXRvcikgLT5cbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvcj9cbiAgICBtYXhpbXVtSGlnaGxpZ2h0cyA9IGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm1heGltdW1IaWdobGlnaHRzJylcbiAgICByZXR1cm4gdW5sZXNzIHRoaXMucmVzdWx0Q291bnQgPCBtYXhpbXVtSGlnaGxpZ2h0c1xuXG4gICAgbWFya2VyTGF5ZXJzID0gIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1cbiAgICByZXR1cm4gdW5sZXNzIG1hcmtlckxheWVycz9cbiAgICBtYXJrZXJMYXllciA9IG1hcmtlckxheWVyc1sndmlzaWJsZU1hcmtlckxheWVyJ11cbiAgICBtYXJrZXJMYXllckZvckhpZGRlbk1hcmtlcnMgPSBtYXJrZXJMYXllcnNbJ3NlbGVjdGVkTWFya2VyTGF5ZXInXVxuXG4gICAgIyBIQUNLOiBgZWRpdG9yLnNjYW5gIGlzIGEgc3luY2hyb25vdXMgcHJvY2VzcyB3aGljaCBpdGVyYXRlcyB0aGUgZW50aXJlIGJ1ZmZlcixcbiAgICAjIGV4ZWN1dGluZyBhIHJlZ2V4IGFnYWluc3QgZXZlcnkgbGluZSBhbmQgeWllbGRpbmcgZWFjaCBtYXRjaC4gVGhpcyBjYW4gYmVcbiAgICAjIGNvc3RseSBmb3IgdmVyeSBsYXJnZSBmaWxlcyB3aXRoIG1hbnkgbWF0Y2hlcy5cbiAgICAjXG4gICAgIyBXaGlsZSB3ZSBjYW4gYW5kIGRvIGxpbWl0IHRoZSBtYXhpbXVtIG51bWJlciBvZiBoaWdobGlnaHQgbWFya2VycyxcbiAgICAjIGBlZGl0b3Iuc2NhbmAgY2Fubm90IGJlIHRlcm1pbmF0ZWQgZWFybHksIG1lYW5pbmcgdGhhdCB3ZSBhcmUgZm9yY2VkIHRvXG4gICAgIyBwYXkgdGhlIGNvc3Qgb2YgaXRlcmF0aW5nIGV2ZXJ5IGxpbmUgaW4gdGhlIGZpbGUsIHJ1bm5pbmcgdGhlIHJlZ2V4LCBhbmRcbiAgICAjIHJldHVybmluZyBtYXRjaGVzLCBldmVuIGlmIHdlIHNob3VsZG4ndCBiZSBjcmVhdGluZyBhbnkgbW9yZSBtYXJrZXJzLlxuICAgICNcbiAgICAjIEluc3RlYWQsIHRocm93IGFuIGV4Y2VwdGlvbi4gVGhpcyBpc24ndCBwcmV0dHksIGJ1dCBpdCBwcmV2ZW50cyB0aGVcbiAgICAjIHNjYW4gZnJvbSBydW5uaW5nIHRvIGNvbXBsZXRpb24gdW5uZWNlc3NhcmlseS5cbiAgICB0cnlcbiAgICAgIGVkaXRvci5zY2FuIG5ldyBSZWdFeHAocmVnZXhTZWFyY2gsIHJlZ2V4RmxhZ3MpLFxuICAgICAgICAocmVzdWx0KSA9PlxuICAgICAgICAgIGlmICh0aGlzLnJlc3VsdENvdW50ID49IG1heGltdW1IaWdobGlnaHRzKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVhcmx5VGVybWluYXRpb25TaWduYWxcblxuICAgICAgICAgIG5ld1Jlc3VsdCA9IHJlc3VsdFxuICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm9ubHlIaWdobGlnaHRXaG9sZVdvcmRzJylcbiAgICAgICAgICAgIGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZShcbiAgICAgICAgICAgICAgbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAocmVzdWx0Lm1hdGNoWzFdKSksXG4gICAgICAgICAgICAgIHJlc3VsdC5yYW5nZSxcbiAgICAgICAgICAgICAgKGUpIC0+IG5ld1Jlc3VsdCA9IGVcbiAgICAgICAgICAgIClcblxuICAgICAgICAgIHJldHVybiB1bmxlc3MgbmV3UmVzdWx0P1xuICAgICAgICAgIEByZXN1bHRDb3VudCArPSAxXG5cbiAgICAgICAgICBpZiBAc2hvd0hpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkKG5ld1Jlc3VsdC5yYW5nZSwgQHNlbGVjdGlvbnMpICYmXG4gICAgICAgICAgICAgb3JpZ2luYWxFZGl0b3I/LmlkID09IGVkaXRvci5pZFxuICAgICAgICAgICAgbWFya2VyID0gbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzLm1hcmtCdWZmZXJSYW5nZShuZXdSZXN1bHQucmFuZ2UpXG4gICAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLXNlbGVjdGVkLW1hcmtlcicsIG1hcmtlclxuICAgICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXItZm9yLWVkaXRvcicsXG4gICAgICAgICAgICAgIG1hcmtlcjogbWFya2VyXG4gICAgICAgICAgICAgIGVkaXRvcjogZWRpdG9yXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWFya2VyID0gbWFya2VyTGF5ZXIubWFya0J1ZmZlclJhbmdlKG5ld1Jlc3VsdC5yYW5nZSlcbiAgICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtbWFya2VyJywgbWFya2VyXG4gICAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLW1hcmtlci1mb3ItZWRpdG9yJyxcbiAgICAgICAgICAgICAgbWFya2VyOiBtYXJrZXJcbiAgICAgICAgICAgICAgZWRpdG9yOiBlZGl0b3JcbiAgICBjYXRjaCBlcnJvclxuICAgICAgaWYgZXJyb3Igbm90IGluc3RhbmNlb2YgRWFybHlUZXJtaW5hdGlvblNpZ25hbFxuICAgICAgICAjIElmIHRoaXMgaXMgYW4gZWFybHkgdGVybWluYXRpb24sIGp1c3QgY29udGludWUgb24uXG4gICAgICAgIHRocm93IGVycm9yXG5cbiAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXJMYXllcihtYXJrZXJMYXllciwge1xuICAgICAgdHlwZTogJ2hpZ2hsaWdodCcsXG4gICAgICBjbGFzczogQG1ha2VDbGFzc2VzKClcbiAgICB9KVxuXG4gIG1ha2VDbGFzc2VzOiAtPlxuICAgIGNsYXNzTmFtZSA9ICdoaWdobGlnaHQtc2VsZWN0ZWQnXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQubGlnaHRUaGVtZScpXG4gICAgICBjbGFzc05hbWUgKz0gJyBsaWdodC10aGVtZSdcblxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZ2hsaWdodEJhY2tncm91bmQnKVxuICAgICAgY2xhc3NOYW1lICs9ICcgYmFja2dyb3VuZCdcbiAgICBjbGFzc05hbWVcblxuICBzaG93SGlnaGxpZ2h0T25TZWxlY3RlZFdvcmQ6IChyYW5nZSwgc2VsZWN0aW9ucykgLT5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGF0b20uY29uZmlnLmdldChcbiAgICAgICdoaWdobGlnaHQtc2VsZWN0ZWQuaGlkZUhpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkJylcbiAgICBvdXRjb21lID0gZmFsc2VcbiAgICBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNcbiAgICAgIHNlbGVjdGlvblJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIG91dGNvbWUgPSAocmFuZ2Uuc3RhcnQuY29sdW1uIGlzIHNlbGVjdGlvblJhbmdlLnN0YXJ0LmNvbHVtbikgYW5kXG4gICAgICAgICAgICAgICAgKHJhbmdlLnN0YXJ0LnJvdyBpcyBzZWxlY3Rpb25SYW5nZS5zdGFydC5yb3cpIGFuZFxuICAgICAgICAgICAgICAgIChyYW5nZS5lbmQuY29sdW1uIGlzIHNlbGVjdGlvblJhbmdlLmVuZC5jb2x1bW4pIGFuZFxuICAgICAgICAgICAgICAgIChyYW5nZS5lbmQucm93IGlzIHNlbGVjdGlvblJhbmdlLmVuZC5yb3cpXG4gICAgICBicmVhayBpZiBvdXRjb21lXG4gICAgb3V0Y29tZVxuXG4gIHJlbW92ZUFsbE1hcmtlcnM6ID0+XG4gICAgT2JqZWN0LmtleXMoQGVkaXRvclRvTWFya2VyTGF5ZXJNYXApLmZvckVhY2goQHJlbW92ZU1hcmtlcnMpXG5cbiAgcmVtb3ZlTWFya2VyczogKGVkaXRvcklkKSA9PlxuICAgIHJldHVybiB1bmxlc3MgQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9ySWRdP1xuXG4gICAgbWFya2VyTGF5ZXIgPSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3JJZF1bJ3Zpc2libGVNYXJrZXJMYXllciddXG4gICAgc2VsZWN0ZWRNYXJrZXJMYXllciA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvcklkXVsnc2VsZWN0ZWRNYXJrZXJMYXllciddXG5cbiAgICBtYXJrZXJMYXllci5jbGVhcigpXG4gICAgc2VsZWN0ZWRNYXJrZXJMYXllci5jbGVhcigpXG5cbiAgICBAc3RhdHVzQmFyRWxlbWVudD8udXBkYXRlQ291bnQoMClcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtcmVtb3ZlLW1hcmtlci1sYXllcidcblxuICBpc1dvcmRTZWxlY3RlZDogKHNlbGVjdGlvbikgLT5cbiAgICBpZiBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5pc1NpbmdsZUxpbmUoKVxuICAgICAgc2VsZWN0aW9uUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgbGluZVJhbmdlID0gQGdldEFjdGl2ZUVkaXRvcigpLmJ1ZmZlclJhbmdlRm9yQnVmZmVyUm93KFxuICAgICAgICBzZWxlY3Rpb25SYW5nZS5zdGFydC5yb3cpXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0ID1cbiAgICAgICAgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQuaXNFcXVhbChsaW5lUmFuZ2Uuc3RhcnQpIG9yXG4gICAgICAgIEBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQoc2VsZWN0aW9uKVxuICAgICAgbm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQgPVxuICAgICAgICBzZWxlY3Rpb25SYW5nZS5lbmQuaXNFcXVhbChsaW5lUmFuZ2UuZW5kKSBvclxuICAgICAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodChzZWxlY3Rpb24pXG5cbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQgYW5kIG5vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0XG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuICBnZXROb25Xb3JkQ2hhcmFjdGVyczogKGVkaXRvciwgcG9pbnQpIC0+XG4gICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHBvaW50KVxuICAgIG5vbldvcmRDaGFyYWN0ZXJzID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iubm9uV29yZENoYXJhY3RlcnMnLCBzY29wZTogc2NvcGVEZXNjcmlwdG9yKVxuXG4gIGlzTm9uV29yZDogKGVkaXRvciwgcmFuZ2UpIC0+XG4gICAgbm9uV29yZENoYXJhY3RlcnMgPSBAZ2V0Tm9uV29yZENoYXJhY3RlcnMoZWRpdG9yLCByYW5nZS5zdGFydClcbiAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgIG5ldyBSZWdFeHAoXCJbIFxcdCN7ZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzKX1dXCIpLnRlc3QodGV4dClcblxuICBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZUxlZnQ6IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydFxuICAgIHJhbmdlID0gUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKHNlbGVjdGlvblN0YXJ0LCAwLCAtMSlcbiAgICBAaXNOb25Xb3JkKEBnZXRBY3RpdmVFZGl0b3IoKSwgcmFuZ2UpXG5cbiAgaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodDogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb25FbmQgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5lbmRcbiAgICByYW5nZSA9IFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShzZWxlY3Rpb25FbmQsIDAsIDEpXG4gICAgQGlzTm9uV29yZChAZ2V0QWN0aXZlRWRpdG9yKCksIHJhbmdlKVxuXG4gIHNldHVwU3RhdHVzQmFyOiA9PlxuICAgIHJldHVybiBpZiBAc3RhdHVzQmFyRWxlbWVudD9cbiAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dJblN0YXR1c0JhcicpXG4gICAgQHN0YXR1c0JhckVsZW1lbnQgPSBuZXcgU3RhdHVzQmFyVmlldygpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBAc3RhdHVzQmFyLmFkZExlZnRUaWxlKFxuICAgICAgaXRlbTogQHN0YXR1c0JhckVsZW1lbnQuZ2V0RWxlbWVudCgpLCBwcmlvcml0eTogMTAwKVxuXG4gIHJlbW92ZVN0YXR1c0JhcjogPT5cbiAgICByZXR1cm4gdW5sZXNzIEBzdGF0dXNCYXJFbGVtZW50P1xuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcbiAgICBAc3RhdHVzQmFyRWxlbWVudCA9IG51bGxcblxuICBsaXN0ZW5Gb3JTdGF0dXNCYXJDaGFuZ2U6ID0+XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93SW5TdGF0dXNCYXInLCAoY2hhbmdlZCkgPT5cbiAgICAgIGlmIGNoYW5nZWQubmV3VmFsdWVcbiAgICAgICAgQHNldHVwU3RhdHVzQmFyKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlbW92ZVN0YXR1c0JhcigpXG5cbiAgc2VsZWN0QWxsOiA9PlxuICAgIGVkaXRvciA9IEBnZXRBY3RpdmVFZGl0b3IoKVxuICAgIG1hcmtlckxheWVycyA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1cbiAgICByZXR1cm4gdW5sZXNzIG1hcmtlckxheWVycz9cbiAgICByYW5nZXMgPSBbXVxuICAgIGZvciBtYXJrZXJMYXllciBpbiBbbWFya2VyTGF5ZXJzWyd2aXNpYmxlTWFya2VyTGF5ZXInXSwgbWFya2VyTGF5ZXJzWydzZWxlY3RlZE1hcmtlckxheWVyJ11dXG4gICAgICBmb3IgbWFya2VyIGluIG1hcmtlckxheWVyLmdldE1hcmtlcnMoKVxuICAgICAgICByYW5nZXMucHVzaCBtYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKVxuXG4gICAgaWYgcmFuZ2VzLmxlbmd0aCA+IDBcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhyYW5nZXMsIGZsYXNoOiB0cnVlKVxuXG4gIHNldFNjcm9sbE1hcmtlcjogKHNjcm9sbE1hcmtlckFQSSkgPT5cbiAgICBAc2Nyb2xsTWFya2VyID0gc2Nyb2xsTWFya2VyQVBJXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd1Jlc3VsdHNPblNjcm9sbEJhcicpXG4gICAgICBAZW5zdXJlU2Nyb2xsVmlld0luc3RhbGxlZCgpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goQHNldFNjcm9sbE1hcmtlclZpZXcpXG5cbiAgZW5zdXJlU2Nyb2xsVmlld0luc3RhbGxlZDogLT5cbiAgICB1bmxlc3MgYXRvbS5pblNwZWNNb2RlKClcbiAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCAnaGlnaGxpZ2h0LXNlbGVjdGVkJywgdHJ1ZVxuXG4gIHNldHVwTWFya2VyTGF5ZXJzOiAoZWRpdG9yKSA9PlxuICAgIGlmIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF0/XG4gICAgICBtYXJrZXJMYXllciA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1bJ3Zpc2libGVNYXJrZXJMYXllciddXG4gICAgICBtYXJrZXJMYXllckZvckhpZGRlbk1hcmtlcnMgID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVsnc2VsZWN0ZWRNYXJrZXJMYXllciddXG4gICAgZWxzZVxuICAgICAgbWFya2VyTGF5ZXIgPSBlZGl0b3IuYWRkTWFya2VyTGF5ZXIoKVxuICAgICAgbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzID0gZWRpdG9yLmFkZE1hcmtlckxheWVyKClcbiAgICAgIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF0gPVxuICAgICAgICB2aXNpYmxlTWFya2VyTGF5ZXI6IG1hcmtlckxheWVyXG4gICAgICAgIHNlbGVjdGVkTWFya2VyTGF5ZXI6IG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2Vyc1xuXG4gIHNldFNjcm9sbE1hcmtlclZpZXc6IChlZGl0b3IpID0+XG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93UmVzdWx0c09uU2Nyb2xsQmFyJylcbiAgICByZXR1cm4gdW5sZXNzIEBzY3JvbGxNYXJrZXI/XG5cbiAgICBzY3JvbGxNYXJrZXJWaWV3ID0gQHNjcm9sbE1hcmtlci5zY3JvbGxNYXJrZXJWaWV3Rm9yRWRpdG9yKGVkaXRvcilcblxuICAgIG1hcmtlckxheWVyID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVsndmlzaWJsZU1hcmtlckxheWVyJ11cbiAgICBzZWxlY3RlZE1hcmtlckxheWVyID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVsnc2VsZWN0ZWRNYXJrZXJMYXllciddXG5cbiAgICBzY3JvbGxNYXJrZXJWaWV3LmdldExheWVyKFwiaGlnaGxpZ2h0LXNlbGVjdGVkLW1hcmtlci1sYXllclwiKVxuICAgICAgICAgICAgICAgICAgICAuc3luY1RvTWFya2VyTGF5ZXIobWFya2VyTGF5ZXIpXG4gICAgc2Nyb2xsTWFya2VyVmlldy5nZXRMYXllcihcImhpZ2hsaWdodC1zZWxlY3RlZC1zZWxlY3RlZC1tYXJrZXItbGF5ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgLnN5bmNUb01hcmtlckxheWVyKHNlbGVjdGVkTWFya2VyTGF5ZXIpXG5cbiAgZGVzdHJveVNjcm9sbE1hcmtlcnM6IChlZGl0b3IpID0+XG4gICAgcmV0dXJuIHVubGVzcyBAc2Nyb2xsTWFya2VyP1xuXG4gICAgc2Nyb2xsTWFya2VyVmlldyA9IEBzY3JvbGxNYXJrZXIuc2Nyb2xsTWFya2VyVmlld0ZvckVkaXRvcihlZGl0b3IpXG4gICAgc2Nyb2xsTWFya2VyVmlldy5kZXN0cm95KClcblxuY2xhc3MgRWFybHlUZXJtaW5hdGlvblNpZ25hbCBleHRlbmRzIEVycm9yXG4iXX0=
