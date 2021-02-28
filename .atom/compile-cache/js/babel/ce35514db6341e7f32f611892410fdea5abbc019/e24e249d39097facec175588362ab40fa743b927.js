Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require('atom');

var _helpersScopeValidator = require('./helpers/scope-validator');

var _helpersScopeValidator2 = _interopRequireDefault(_helpersScopeValidator);

'use babel';

var rubocop = undefined;

var initializeRubocop = function initializeRubocop(_ref) {
  var command = _ref.command;
  var disableWhenNoConfigFile = _ref.disableWhenNoConfigFile;
  var useBundler = _ref.useBundler;

  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var force = _ref2.force;

  if (!rubocop || Boolean(force)) {
    var Rubocop = require('./rubocop/Rubocop');
    rubocop = new Rubocop({ command: command, disableWhenNoConfigFile: disableWhenNoConfigFile, useBundler: useBundler });
  }
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.scopes = ['source.ruby', 'source.ruby.gemfile', 'source.ruby.rails', 'source.ruby.rspec', 'source.ruby.chef'];

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;

    var installLinterRubocopDeps = function installLinterRubocopDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-rubocop', true);
      }
      initializeRubocop({
        command: _this.command,
        disableWhenNoConfigFile: _this.disableWhenNoConfigFile,
        useBundler: _this.useBundler
      });
    };

    depsCallbackID = window.requestIdleCallback(installLinterRubocopDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();

    // Register autocorrect command
    this.subscriptions.add(

    // Register autocorrect command
    atom.commands.add('atom-text-editor', {
      'linter-rubocop:fix-file': _asyncToGenerator(function* () {
        var editor = atom.workspace.getActiveTextEditor();
        if ((0, _helpersScopeValidator2['default'])(editor, _this.scopes)) {
          yield _this.fixFile(editor);
        }
      })
    }), atom.workspace.observeTextEditors(function (editor) {
      editor.onDidSave(_asyncToGenerator(function* () {
        if ((0, _helpersScopeValidator2['default'])(editor, _this.scopes) && atom.config.get('linter-rubocop.fixOnSave')) {
          yield _this.fixFile(editor, { onSave: true });
        }
      }));
    }), atom.contextMenu.add({
      'atom-text-editor:not(.mini), .overlayer': [{
        label: 'Fix file with Rubocop',
        command: 'linter-rubocop:fix-file',
        shouldDisplay: function shouldDisplay(_ref3) {
          var path = _ref3.path;

          var activeEditor = atom.workspace.getActiveTextEditor();
          if (!activeEditor) {
            return false;
          }
          // Black magic!
          // Compares the private component property of the active TextEditor
          // against the components of the elements
          // Atom v1.19.0+
          var evtIsActiveEditor = path.some(function (_ref4) {
            var component = _ref4.component;
            return component && activeEditor.component && component === activeEditor.component;
          });
          // Only show if it was the active editor and it is a valid scope
          return evtIsActiveEditor && (0, _helpersScopeValidator2['default'])(activeEditor, _this.scopes);
        }
      }]
    }), atom.config.observe('linter-rubocop.command', function (value) {
      _this.command = value;
    }), atom.config.observe('linter-rubocop.disableWhenNoConfigFile', function (value) {
      _this.disableWhenNoConfigFile = value;
    }), atom.config.observe('linter-rubocop.useBundler', function (value) {
      _this.useBundler = value;
    }), atom.config.onDidChange(function (_ref5) {
      var newValue = _ref5.newValue;
      var oldValue = _ref5.oldValue;

      var newVal = newValue['linter-rubocop'];
      var oldVal = oldValue['linter-rubocop'];
      if (Object.entries(newVal).toString() === Object.entries(oldVal).toString()) {
        return;
      }
      initializeRubocop(newVal, { force: true });
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  fixFile: _asyncToGenerator(function* (editor) {
    var _ref6 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var onSave = _ref6.onSave;

    if (!editor || !atom.workspace.isTextEditor(editor)) {
      return;
    }

    if (editor.isModified()) {
      atom.notifications.addError('Linter-Rubocop: Please save before fix file');
    }

    var text = editor.getText();
    if (text.length === 0) {
      return;
    }

    rubocop.autocorrect(editor.getPath(), onSave);
  }),

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'RuboCop',
      grammarScopes: this.scopes,
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (editor) {
        var filePath = editor.getPath();
        if (!filePath) {
          return null;
        }

        initializeRubocop({
          command: _this2.command,
          disableWhenNoConfigFile: _this2.disableWhenNoConfigFile,
          useBundler: _this2.useBundler
        });

        var messages = yield rubocop.analyze(editor.getText(), filePath);

        return messages;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7cUNBQ2hCLDJCQUEyQjs7OztBQUhyRCxXQUFXLENBQUE7O0FBS1gsSUFBSSxPQUFPLFlBQUEsQ0FBQTs7QUFFWCxJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFJLElBQWdELEVBQXFCO01BQW5FLE9BQU8sR0FBVCxJQUFnRCxDQUE5QyxPQUFPO01BQUUsdUJBQXVCLEdBQWxDLElBQWdELENBQXJDLHVCQUF1QjtNQUFFLFVBQVUsR0FBOUMsSUFBZ0QsQ0FBWixVQUFVOztvRUFBZ0IsRUFBRTs7TUFBWixLQUFLLFNBQUwsS0FBSzs7QUFDbEYsTUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDOUIsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDNUMsV0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSx1QkFBdUIsRUFBdkIsdUJBQXVCLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFDLENBQUE7R0FDeEU7Q0FDRixDQUFBOztxQkFFYztBQUNiLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUNaLGFBQWEsRUFDYixxQkFBcUIsRUFDckIsbUJBQW1CLEVBQ25CLG1CQUFtQixFQUNuQixrQkFBa0IsQ0FDbkIsQ0FBQTs7QUFFRCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDOUIsUUFBSSxjQUFjLFlBQUEsQ0FBQTs7QUFFbEIsUUFBTSx3QkFBd0IsR0FBRyxTQUEzQix3QkFBd0IsR0FBUztBQUNyQyxZQUFLLGFBQWEsVUFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3pDLFVB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RyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDN0IsUUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNyQixhQUFNO0tBQ1A7O0FBRUQsV0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUE7R0FDOUMsQ0FBQTs7QUFFRCxlQUFhLEVBQUEseUJBQUc7OztBQUNkLFdBQU87QUFDTCxVQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU07QUFDMUIsV0FBSyxFQUFFLE1BQU07QUFDYixtQkFBYSxFQUFFLElBQUk7QUFDbkIsVUFBSSxvQkFBRSxXQUFPLE1BQU0sRUFBSztBQUN0QixZQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDakMsWUFBSSxDQUFDLFFBQVEsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQTtTQUFFOztBQUU5Qix5QkFBaUIsQ0FBQztBQUNoQixpQkFBTyxFQUFFLE9BQUssT0FBTztBQUNyQixpQ0FBdUIsRUFBRSxPQUFLLHVCQUF1QjtBQUNyRCxvQkFBVSxFQUFFLE9BQUssVUFBVTtTQUM1QixDQUFDLENBQUE7O0FBRUYsWUFBTSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFbEUsZUFBTyxRQUFRLENBQUE7T0FDaEIsQ0FBQTtLQUNGLENBQUE7R0FDRjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGhhc1ZhbGlkU2NvcGUgZnJvbSAnLi9oZWxwZXJzL3Njb3BlLXZhbGlkYXRvcidcblxubGV0IHJ1Ym9jb3BcblxuY29uc3QgaW5pdGlhbGl6ZVJ1Ym9jb3AgPSAoeyBjb21tYW5kLCBkaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSwgdXNlQnVuZGxlciB9LCB7IGZvcmNlIH0gPSB7fSkgPT4ge1xuICBpZiAoIXJ1Ym9jb3AgfHwgQm9vbGVhbihmb3JjZSkpIHtcbiAgICBjb25zdCBSdWJvY29wID0gcmVxdWlyZSgnLi9ydWJvY29wL1J1Ym9jb3AnKVxuICAgIHJ1Ym9jb3AgPSBuZXcgUnVib2NvcCh7IGNvbW1hbmQsIGRpc2FibGVXaGVuTm9Db25maWdGaWxlLCB1c2VCdW5kbGVyIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnNjb3BlcyA9IFtcbiAgICAgICdzb3VyY2UucnVieScsXG4gICAgICAnc291cmNlLnJ1YnkuZ2VtZmlsZScsXG4gICAgICAnc291cmNlLnJ1YnkucmFpbHMnLFxuICAgICAgJ3NvdXJjZS5ydWJ5LnJzcGVjJyxcbiAgICAgICdzb3VyY2UucnVieS5jaGVmJyxcbiAgICBdXG5cbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KClcbiAgICBsZXQgZGVwc0NhbGxiYWNrSURcblxuICAgIGNvbnN0IGluc3RhbGxMaW50ZXJSdWJvY29wRGVwcyA9ICgpID0+IHtcbiAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUoZGVwc0NhbGxiYWNrSUQpXG4gICAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLXJ1Ym9jb3AnLCB0cnVlKVxuICAgICAgfVxuICAgICAgaW5pdGlhbGl6ZVJ1Ym9jb3Aoe1xuICAgICAgICBjb21tYW5kOiB0aGlzLmNvbW1hbmQsXG4gICAgICAgIGRpc2FibGVXaGVuTm9Db25maWdGaWxlOiB0aGlzLmRpc2FibGVXaGVuTm9Db25maWdGaWxlLFxuICAgICAgICB1c2VCdW5kbGVyOiB0aGlzLnVzZUJ1bmRsZXIsXG4gICAgICB9KVxuICAgIH1cblxuICAgIGRlcHNDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soaW5zdGFsbExpbnRlclJ1Ym9jb3BEZXBzKVxuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5hZGQoZGVwc0NhbGxiYWNrSUQpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAvLyBSZWdpc3RlciBhdXRvY29ycmVjdCBjb21tYW5kXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcblxuICAgICAgLy8gUmVnaXN0ZXIgYXV0b2NvcnJlY3QgY29tbWFuZFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCB7XG4gICAgICAgICdsaW50ZXItcnVib2NvcDpmaXgtZmlsZSc6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICBpZiAoaGFzVmFsaWRTY29wZShlZGl0b3IsIHRoaXMuc2NvcGVzKSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5maXhGaWxlKGVkaXRvcilcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcblxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgICAgZWRpdG9yLm9uRGlkU2F2ZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgaWYgKGhhc1ZhbGlkU2NvcGUoZWRpdG9yLCB0aGlzLnNjb3BlcylcbiAgICAgICAgICAgICYmIGF0b20uY29uZmlnLmdldCgnbGludGVyLXJ1Ym9jb3AuZml4T25TYXZlJylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZml4RmlsZShlZGl0b3IsIHsgb25TYXZlOiB0cnVlIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSksXG5cbiAgICAgIGF0b20uY29udGV4dE1lbnUuYWRkKHtcbiAgICAgICAgJ2F0b20tdGV4dC1lZGl0b3I6bm90KC5taW5pKSwgLm92ZXJsYXllcic6IFt7XG4gICAgICAgICAgbGFiZWw6ICdGaXggZmlsZSB3aXRoIFJ1Ym9jb3AnLFxuICAgICAgICAgIGNvbW1hbmQ6ICdsaW50ZXItcnVib2NvcDpmaXgtZmlsZScsXG4gICAgICAgICAgc2hvdWxkRGlzcGxheTogKHsgcGF0aCB9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICAgIGlmICghYWN0aXZlRWRpdG9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQmxhY2sgbWFnaWMhXG4gICAgICAgICAgICAvLyBDb21wYXJlcyB0aGUgcHJpdmF0ZSBjb21wb25lbnQgcHJvcGVydHkgb2YgdGhlIGFjdGl2ZSBUZXh0RWRpdG9yXG4gICAgICAgICAgICAvLyBhZ2FpbnN0IHRoZSBjb21wb25lbnRzIG9mIHRoZSBlbGVtZW50c1xuICAgICAgICAgICAgLy8gQXRvbSB2MS4xOS4wK1xuICAgICAgICAgICAgY29uc3QgZXZ0SXNBY3RpdmVFZGl0b3IgPSBwYXRoLnNvbWUoKHsgY29tcG9uZW50IH0pID0+IGNvbXBvbmVudFxuICAgICAgICAgICAgICAmJiBhY3RpdmVFZGl0b3IuY29tcG9uZW50XG4gICAgICAgICAgICAgICYmIGNvbXBvbmVudCA9PT0gYWN0aXZlRWRpdG9yLmNvbXBvbmVudClcbiAgICAgICAgICAgIC8vIE9ubHkgc2hvdyBpZiBpdCB3YXMgdGhlIGFjdGl2ZSBlZGl0b3IgYW5kIGl0IGlzIGEgdmFsaWQgc2NvcGVcbiAgICAgICAgICAgIHJldHVybiBldnRJc0FjdGl2ZUVkaXRvciAmJiBoYXNWYWxpZFNjb3BlKGFjdGl2ZUVkaXRvciwgdGhpcy5zY29wZXMpXG4gICAgICAgICAgfSxcbiAgICAgICAgfV0sXG4gICAgICB9KSxcblxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXJ1Ym9jb3AuY29tbWFuZCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNvbW1hbmQgPSB2YWx1ZVxuICAgICAgfSksXG5cbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1ydWJvY29wLmRpc2FibGVXaGVuTm9Db25maWdGaWxlJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUgPSB2YWx1ZVxuICAgICAgfSksXG5cbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1ydWJvY29wLnVzZUJ1bmRsZXInLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy51c2VCdW5kbGVyID0gdmFsdWVcbiAgICAgIH0pLFxuXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgoeyBuZXdWYWx1ZSwgb2xkVmFsdWUgfSkgPT4ge1xuICAgICAgICBjb25zdCBuZXdWYWwgPSBuZXdWYWx1ZVsnbGludGVyLXJ1Ym9jb3AnXVxuICAgICAgICBjb25zdCBvbGRWYWwgPSBvbGRWYWx1ZVsnbGludGVyLXJ1Ym9jb3AnXVxuICAgICAgICBpZiAoT2JqZWN0LmVudHJpZXMobmV3VmFsKS50b1N0cmluZygpID09PSBPYmplY3QuZW50cmllcyhvbGRWYWwpLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpbml0aWFsaXplUnVib2NvcChuZXdWYWwsIHsgZm9yY2U6IHRydWUgfSlcbiAgICAgIH0pLFxuICAgIClcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFja0lEKSA9PiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKGNhbGxiYWNrSUQpKVxuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5jbGVhcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9LFxuXG4gIGFzeW5jIGZpeEZpbGUoZWRpdG9yLCB7IG9uU2F2ZSB9ID0ge30pIHtcbiAgICBpZiAoIWVkaXRvciB8fCAhYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKGVkaXRvcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0xpbnRlci1SdWJvY29wOiBQbGVhc2Ugc2F2ZSBiZWZvcmUgZml4IGZpbGUnKVxuICAgIH1cblxuICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgaWYgKHRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBydWJvY29wLmF1dG9jb3JyZWN0KGVkaXRvci5nZXRQYXRoKCksIG9uU2F2ZSlcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUnVib0NvcCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiB0aGlzLnNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKGVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgaWYgKCFmaWxlUGF0aCkgeyByZXR1cm4gbnVsbCB9XG5cbiAgICAgICAgaW5pdGlhbGl6ZVJ1Ym9jb3Aoe1xuICAgICAgICAgIGNvbW1hbmQ6IHRoaXMuY29tbWFuZCxcbiAgICAgICAgICBkaXNhYmxlV2hlbk5vQ29uZmlnRmlsZTogdGhpcy5kaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSxcbiAgICAgICAgICB1c2VCdW5kbGVyOiB0aGlzLnVzZUJ1bmRsZXIsXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBydWJvY29wLmFuYWx5emUoZWRpdG9yLmdldFRleHQoKSwgZmlsZVBhdGgpXG5cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzXG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cbiJdfQ==