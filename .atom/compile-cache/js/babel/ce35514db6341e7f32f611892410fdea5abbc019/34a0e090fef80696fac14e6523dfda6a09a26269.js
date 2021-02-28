Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _ruleHelpers = require('./rule-helpers');

var _ruleHelpers2 = _interopRequireDefault(_ruleHelpers);

var _scopeUtil = require('./scope-util');

var _scopeUtil2 = _interopRequireDefault(_scopeUtil);

'use babel';

var DEFAULT_ARGS = ['--force-exclusion', '--format', 'json', '--display-style-guide'];

var helpers = undefined;
var path = undefined;
var pluralize = undefined;
var semver = undefined;

var loadDeps = function loadDeps() {
  if (!helpers) {
    helpers = require('atom-linter');
  }
  if (!path) {
    path = require('path');
  }
  if (!pluralize) {
    pluralize = require('pluralize');
  }
  if (!semver) {
    semver = require('semver');
  }
};

var parseFromStd = function parseFromStd(stdout, stderr) {
  var parsed = undefined;
  try {
    parsed = JSON.parse(stdout);
  } catch (error) {
    // continue regardless of error
  }
  if (typeof parsed !== 'object') {
    throw new Error(stderr || stdout);
  }
  return parsed;
};

var getBaseCommand = function getBaseCommand(command) {
  return command.split(/\s+/).filter(function (i) {
    return i;
  }).concat(DEFAULT_ARGS);
};

var getBaseExecutionOpts = function getBaseExecutionOpts(filePath) {
  return {
    cwd: atom.project.relativizePath(filePath)[0] || path.dirname(filePath),
    stream: 'both',
    timeout: 10000,
    uniqueKey: 'linter-rubocop::' + filePath
  };
};

var executeRubocop = _asyncToGenerator(function* (execOptions, command) {
  var output = undefined;
  try {
    output = yield helpers.exec(command[0], command.slice(1), execOptions);
  } catch (e) {
    if (e.message !== 'Process execution timed out') throw e;
    atom.notifications.addInfo('Linter-Rubocop: Linter timed out', {
      description: 'Make sure you are not running Rubocop with a slow-starting interpreter like JRuby. ' + 'If you are still seeing timeouts, consider running your linter `on save` and not `on change`, ' + 'or reference https://github.com/AtomLinter/linter-rubocop/issues/202 .'
    });
    return null;
  }
  return output;
});

var forwardRubocopToLinter = function forwardRubocopToLinter(version, _ref, file, editor) {
  var rawMessage = _ref.message;
  var location = _ref.location;
  var severity = _ref.severity;
  var copName = _ref.cop_name;

  var hasCopName = semver.satisfies(version, '>=0.52.0 <0.68.0');

  var _rawMessage$split = rawMessage.split(/ \((.*)\)/, 2);

  var _rawMessage$split2 = _slicedToArray(_rawMessage$split, 2);

  var excerpt = _rawMessage$split2[0];
  var url = _rawMessage$split2[1];

  var position = undefined;
  if (location) {
    var line = location.line;
    var column = location.column;
    var _length = location.length;

    position = [[line - 1, column - 1], [line - 1, _length + column - 1]];
  } else {
    position = helpers.generateRange(editor, 0);
  }

  var severityMapping = {
    refactor: 'info',
    convention: 'info',
    warning: 'warning',
    error: 'error',
    fatal: 'error'
  };

  var linterMessage = {
    url: url,
    excerpt: hasCopName ? excerpt : copName + ': ' + excerpt,
    severity: severityMapping[severity],
    location: {
      file: file,
      position: position
    }
  };

  (0, _ruleHelpers2['default'])(url).then(function (markdown) {
    if (markdown) {
      linterMessage.description = markdown;
    }
  });

  return linterMessage;
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
      loadDeps();
    };

    depsCallbackID = window.requestIdleCallback(installLinterRubocopDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(
    // Register autocorrect command
    atom.commands.add('atom-text-editor', {
      'linter-rubocop:fix-file': _asyncToGenerator(function* () {
        var editor = atom.workspace.getActiveTextEditor();
        if ((0, _scopeUtil2['default'])(editor, _this.scopes)) {
          yield _this.fixFile(editor);
        }
      })
    }), atom.contextMenu.add({
      'atom-text-editor:not(.mini), .overlayer': [{
        label: 'Fix file with Rubocop',
        command: 'linter-rubocop:fix-file',
        shouldDisplay: function shouldDisplay(evt) {
          var activeEditor = atom.workspace.getActiveTextEditor();
          if (!activeEditor) {
            return false;
          }
          // Black magic!
          // Compares the private component property of the active TextEditor
          //   against the components of the elements
          var evtIsActiveEditor = evt.path.some(function (elem) {
            return(
              // Atom v1.19.0+
              elem.component && activeEditor.component && elem.component === activeEditor.component
            );
          });
          // Only show if it was the active editor and it is a valid scope
          return evtIsActiveEditor && (0, _scopeUtil2['default'])(activeEditor, _this.scopes);
        }
      }]
    }), atom.config.observe('linter-rubocop.command', function (value) {
      _this.command = value;
    }), atom.config.observe('linter-rubocop.disableWhenNoConfigFile', function (value) {
      _this.disableWhenNoConfigFile = value;
    }), atom.config.observe('linter-rubocop.runExtraRailsCops', function (value) {
      _this.runExtraRailsCops = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  fixFile: _asyncToGenerator(function* (textEditor) {
    if (!textEditor || !atom.workspace.isTextEditor(textEditor)) {
      return;
    }

    if (textEditor.isModified()) {
      atom.notifications.addError('Linter-Rubocop: Please save before fix file');
    }

    var text = textEditor.getText();
    if (text.length === 0) {
      return;
    }

    var filePath = textEditor.getPath();

    var command = getBaseCommand(this.command);
    command.push('--auto-correct');
    command.push(filePath);

    var output = yield executeRubocop(getBaseExecutionOpts(filePath), command);

    var _parseFromStd = parseFromStd(output.stdout, output.stderr);

    var files = _parseFromStd.files;
    var offenseCount = _parseFromStd.summary.offense_count;

    var offenses = files && files[0] && files[0].offenses;

    if (offenseCount === 0) {
      atom.notifications.addInfo('Linter-Rubocop: No fixes were made');
    } else {
      var corrections = Object.values(offenses).reduce(function (off, _ref2) {
        var corrected = _ref2.corrected;
        return off + corrected;
      }, 0);
      var message = 'Linter-Rubocop: Fixed ' + pluralize('offenses', corrections, true) + ' of ' + offenseCount;
      if (corrections < offenseCount) {
        atom.notifications.addInfo(message);
      } else {
        atom.notifications.addSuccess(message);
      }
    }
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

        loadDeps();

        if (_this2.disableWhenNoConfigFile === true) {
          var config = yield helpers.findAsync(filePath, '.rubocop.yml');
          if (config === null) {
            return [];
          }
        }

        var execOptions = getBaseExecutionOpts(filePath);
        var command = getBaseCommand(_this2.command);

        if (editor.isModified()) {
          execOptions.stdin = editor.getText();
          command.push('--stdin', filePath);
        } else {
          execOptions.ignoreExitCode = true;
          command.push(filePath);
        }

        var output = yield executeRubocop(execOptions, command);

        // Process was canceled by newer process
        if (output === null) {
          return null;
        }

        var _parseFromStd2 = parseFromStd(output.stdout, output.stderr);

        var rubocopVersion = _parseFromStd2.metadata.rubocop_version;
        var files = _parseFromStd2.files;

        if (rubocopVersion == null || rubocopVersion === '') {
          throw new Error('Unable to get rubocop version from linting output results.');
        }

        var offenses = files && files[0] && files[0].offenses;

        return (offenses || []).map(function (offense) {
          return forwardRubocopToLinter(rubocopVersion, offense, filePath, editor);
        });
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OzJCQUNkLGdCQUFnQjs7Ozt5QkFDbEIsY0FBYzs7OztBQUx4QyxXQUFXLENBQUE7O0FBT1gsSUFBTSxZQUFZLEdBQUcsQ0FDbkIsbUJBQW1CLEVBQ25CLFVBQVUsRUFBRSxNQUFNLEVBQ2xCLHVCQUF1QixDQUN4QixDQUFBOztBQUVELElBQUksT0FBTyxZQUFBLENBQUE7QUFDWCxJQUFJLElBQUksWUFBQSxDQUFBO0FBQ1IsSUFBSSxTQUFTLFlBQUEsQ0FBQTtBQUNiLElBQUksTUFBTSxZQUFBLENBQUE7O0FBRVYsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDckIsTUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLFdBQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7R0FDakM7QUFDRCxNQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsUUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUN2QjtBQUNELE1BQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCxhQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0dBQ2pDO0FBQ0QsTUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLFVBQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDM0I7Q0FDRixDQUFBOztBQUVELElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLE1BQU0sRUFBRSxNQUFNLEVBQUs7QUFDdkMsTUFBSSxNQUFNLFlBQUEsQ0FBQTtBQUNWLE1BQUk7QUFDRixVQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUM1QixDQUFDLE9BQU8sS0FBSyxFQUFFOztHQUVmO0FBQ0QsTUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFR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LE1BQU0sQ0FBQyxNQUFNLENBQUM7O1lBRGYsY0FBYyxrQkFBM0MsUUFBUSxDQUFJLGVBQWU7WUFBb0IsS0FBSyxrQkFBTCxLQUFLOztBQUd0RCxZQUFJLGNBQWMsSUFBSSxJQUFJLElBQUksY0FBYyxLQUFLLEVBQUUsRUFBRTtBQUNuRCxnQkFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFBO1NBQzlFOztBQUVELFlBQU0sUUFBUSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQTs7QUFFdkQsZUFBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUEsQ0FBRSxHQUFHLENBQ3pCLFVBQUEsT0FBTztpQkFBSSxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7U0FBQSxDQUM3RSxDQUFBO09BQ0YsQ0FBQTtLQUNGLENBQUE7R0FDRjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBnZXRSdWxlTWFya0Rvd24gZnJvbSAnLi9ydWxlLWhlbHBlcnMnXG5pbXBvcnQgaGFzVmFsaWRTY29wZSBmcm9tICcuL3Njb3BlLXV0aWwnXG5cbmNvbnN0IERFRkFVTFRfQVJHUyA9IFtcbiAgJy0tZm9yY2UtZXhjbHVzaW9uJyxcbiAgJy0tZm9ybWF0JywgJ2pzb24nLFxuICAnLS1kaXNwbGF5LXN0eWxlLWd1aWRlJyxcbl1cblxubGV0IGhlbHBlcnNcbmxldCBwYXRoXG5sZXQgcGx1cmFsaXplXG5sZXQgc2VtdmVyXG5cbmNvbnN0IGxvYWREZXBzID0gKCkgPT4ge1xuICBpZiAoIWhlbHBlcnMpIHtcbiAgICBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKVxuICB9XG4gIGlmICghcGF0aCkge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgfVxuICBpZiAoIXBsdXJhbGl6ZSkge1xuICAgIHBsdXJhbGl6ZSA9IHJlcXVpcmUoJ3BsdXJhbGl6ZScpXG4gIH1cbiAgaWYgKCFzZW12ZXIpIHtcbiAgICBzZW12ZXIgPSByZXF1aXJlKCdzZW12ZXInKVxuICB9XG59XG5cbmNvbnN0IHBhcnNlRnJvbVN0ZCA9IChzdGRvdXQsIHN0ZGVycikgPT4ge1xuICBsZXQgcGFyc2VkXG4gIHRyeSB7XG4gICAgcGFyc2VkID0gSlNPTi5wYXJzZShzdGRvdXQpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gY29udGludWUgcmVnYXJkbGVzcyBvZiBlcnJvclxuICB9XG4gIGlmICh0eXBlb2YgcGFyc2VkICE9PSAnb2JqZWN0JykgeyB0aHJvdyBuZXcgRXJyb3Ioc3RkZXJyIHx8IHN0ZG91dCkgfVxuICByZXR1cm4gcGFyc2VkXG59XG5cbmNvbnN0IGdldEJhc2VDb21tYW5kID0gY29tbWFuZCA9PiBjb21tYW5kXG4gIC5zcGxpdCgvXFxzKy8pXG4gIC5maWx0ZXIoaSA9PiBpKVxuICAuY29uY2F0KERFRkFVTFRfQVJHUylcblxuY29uc3QgZ2V0QmFzZUV4ZWN1dGlvbk9wdHMgPSBmaWxlUGF0aCA9PiAoe1xuICBjd2Q6IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF0gfHwgcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSxcbiAgc3RyZWFtOiAnYm90aCcsXG4gIHRpbWVvdXQ6IDEwMDAwLFxuICB1bmlxdWVLZXk6IGBsaW50ZXItcnVib2NvcDo6JHtmaWxlUGF0aH1gLFxufSlcblxuY29uc3QgZXhlY3V0ZVJ1Ym9jb3AgPSBhc3luYyAoZXhlY09wdGlvbnMsIGNvbW1hbmQpID0+IHtcbiAgbGV0IG91dHB1dFxuICB0cnkge1xuICAgIG91dHB1dCA9IGF3YWl0IGhlbHBlcnMuZXhlYyhjb21tYW5kWzBdLCBjb21tYW5kLnNsaWNlKDEpLCBleGVjT3B0aW9ucylcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlLm1lc3NhZ2UgIT09ICdQcm9jZXNzIGV4ZWN1dGlvbiB0aW1lZCBvdXQnKSB0aHJvdyBlXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXG4gICAgICAnTGludGVyLVJ1Ym9jb3A6IExpbnRlciB0aW1lZCBvdXQnLFxuICAgICAge1xuICAgICAgICBkZXNjcmlwdGlvbjogJ01ha2Ugc3VyZSB5b3UgYXJlIG5vdCBydW5uaW5nIFJ1Ym9jb3Agd2l0aCBhIHNsb3ctc3RhcnRpbmcgaW50ZXJwcmV0ZXIgbGlrZSBKUnVieS4gJ1xuICAgICAgICAgICAgICAgICAgICAgKyAnSWYgeW91IGFyZSBzdGlsbCBzZWVpbmcgdGltZW91dHMsIGNvbnNpZGVyIHJ1bm5pbmcgeW91ciBsaW50ZXIgYG9uIHNhdmVgIGFuZCBub3QgYG9uIGNoYW5nZWAsICdcbiAgICAgICAgICAgICAgICAgICAgICsgJ29yIHJlZmVyZW5jZSBodHRwczovL2dpdGh1Yi5jb20vQXRvbUxpbnRlci9saW50ZXItcnVib2NvcC9pc3N1ZXMvMjAyIC4nLFxuICAgICAgfSxcbiAgICApXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICByZXR1cm4gb3V0cHV0XG59XG5cbmNvbnN0IGZvcndhcmRSdWJvY29wVG9MaW50ZXIgPSAodmVyc2lvbiwge1xuICBtZXNzYWdlOiByYXdNZXNzYWdlLCBsb2NhdGlvbiwgc2V2ZXJpdHksIGNvcF9uYW1lOiBjb3BOYW1lLFxufSwgZmlsZSwgZWRpdG9yKSA9PiB7XG4gIGNvbnN0IGhhc0NvcE5hbWUgPSBzZW12ZXIuc2F0aXNmaWVzKHZlcnNpb24sICc+PTAuNTIuMCA8MC42OC4wJylcbiAgY29uc3QgW2V4Y2VycHQsIHVybF0gPSByYXdNZXNzYWdlLnNwbGl0KC8gXFwoKC4qKVxcKS8sIDIpXG4gIGxldCBwb3NpdGlvblxuICBpZiAobG9jYXRpb24pIHtcbiAgICBjb25zdCB7IGxpbmUsIGNvbHVtbiwgbGVuZ3RoIH0gPSBsb2NhdGlvblxuICAgIHBvc2l0aW9uID0gW1tsaW5lIC0gMSwgY29sdW1uIC0gMV0sIFtsaW5lIC0gMSwgKGxlbmd0aCArIGNvbHVtbikgLSAxXV1cbiAgfSBlbHNlIHtcbiAgICBwb3NpdGlvbiA9IGhlbHBlcnMuZ2VuZXJhdGVSYW5nZShlZGl0b3IsIDApXG4gIH1cblxuICBjb25zdCBzZXZlcml0eU1hcHBpbmcgPSB7XG4gICAgcmVmYWN0b3I6ICdpbmZvJyxcbiAgICBjb252ZW50aW9uOiAnaW5mbycsXG4gICAgd2FybmluZzogJ3dhcm5pbmcnLFxuICAgIGVycm9yOiAnZXJyb3InLFxuICAgIGZhdGFsOiAnZXJyb3InLFxuICB9XG5cbiAgY29uc3QgbGludGVyTWVzc2FnZSA9IHtcbiAgICB1cmwsXG4gICAgZXhjZXJwdDogaGFzQ29wTmFtZSA/IGV4Y2VycHQgOiBgJHtjb3BOYW1lfTogJHtleGNlcnB0fWAsXG4gICAgc2V2ZXJpdHk6IHNldmVyaXR5TWFwcGluZ1tzZXZlcml0eV0sXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGZpbGUsXG4gICAgICBwb3NpdGlvbixcbiAgICB9LFxuICB9XG5cbiAgZ2V0UnVsZU1hcmtEb3duKHVybCkudGhlbigobWFya2Rvd24pID0+IHtcbiAgICBpZiAobWFya2Rvd24pIHtcbiAgICAgIGxpbnRlck1lc3NhZ2UuZGVzY3JpcHRpb24gPSBtYXJrZG93blxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gbGludGVyTWVzc2FnZVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc2NvcGVzID0gW1xuICAgICAgJ3NvdXJjZS5ydWJ5JyxcbiAgICAgICdzb3VyY2UucnVieS5nZW1maWxlJyxcbiAgICAgICdzb3VyY2UucnVieS5yYWlscycsXG4gICAgICAnc291cmNlLnJ1YnkucnNwZWMnLFxuICAgICAgJ3NvdXJjZS5ydWJ5LmNoZWYnLFxuICAgIF1cblxuICAgIHRoaXMuaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKVxuICAgIGxldCBkZXBzQ2FsbGJhY2tJRFxuXG4gICAgY29uc3QgaW5zdGFsbExpbnRlclJ1Ym9jb3BEZXBzID0gKCkgPT4ge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShkZXBzQ2FsbGJhY2tJRClcbiAgICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItcnVib2NvcCcsIHRydWUpXG4gICAgICB9XG4gICAgICBsb2FkRGVwcygpXG4gICAgfVxuXG4gICAgZGVwc0NhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhpbnN0YWxsTGludGVyUnVib2NvcERlcHMpXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChkZXBzQ2FsbGJhY2tJRClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgLy8gUmVnaXN0ZXIgYXV0b2NvcnJlY3QgY29tbWFuZFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCB7XG4gICAgICAgICdsaW50ZXItcnVib2NvcDpmaXgtZmlsZSc6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICBpZiAoaGFzVmFsaWRTY29wZShlZGl0b3IsIHRoaXMuc2NvcGVzKSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5maXhGaWxlKGVkaXRvcilcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGF0b20uY29udGV4dE1lbnUuYWRkKHtcbiAgICAgICAgJ2F0b20tdGV4dC1lZGl0b3I6bm90KC5taW5pKSwgLm92ZXJsYXllcic6IFt7XG4gICAgICAgICAgbGFiZWw6ICdGaXggZmlsZSB3aXRoIFJ1Ym9jb3AnLFxuICAgICAgICAgIGNvbW1hbmQ6ICdsaW50ZXItcnVib2NvcDpmaXgtZmlsZScsXG4gICAgICAgICAgc2hvdWxkRGlzcGxheTogKGV2dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgICBpZiAoIWFjdGl2ZUVkaXRvcikge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEJsYWNrIG1hZ2ljIVxuICAgICAgICAgICAgLy8gQ29tcGFyZXMgdGhlIHByaXZhdGUgY29tcG9uZW50IHByb3BlcnR5IG9mIHRoZSBhY3RpdmUgVGV4dEVkaXRvclxuICAgICAgICAgICAgLy8gICBhZ2FpbnN0IHRoZSBjb21wb25lbnRzIG9mIHRoZSBlbGVtZW50c1xuICAgICAgICAgICAgY29uc3QgZXZ0SXNBY3RpdmVFZGl0b3IgPSBldnQucGF0aC5zb21lKGVsZW0gPT4gKFxuICAgICAgICAgICAgICAvLyBBdG9tIHYxLjE5LjArXG4gICAgICAgICAgICAgIGVsZW0uY29tcG9uZW50ICYmIGFjdGl2ZUVkaXRvci5jb21wb25lbnRcbiAgICAgICAgICAgICAgICAmJiBlbGVtLmNvbXBvbmVudCA9PT0gYWN0aXZlRWRpdG9yLmNvbXBvbmVudCkpXG4gICAgICAgICAgICAvLyBPbmx5IHNob3cgaWYgaXQgd2FzIHRoZSBhY3RpdmUgZWRpdG9yIGFuZCBpdCBpcyBhIHZhbGlkIHNjb3BlXG4gICAgICAgICAgICByZXR1cm4gZXZ0SXNBY3RpdmVFZGl0b3IgJiYgaGFzVmFsaWRTY29wZShhY3RpdmVFZGl0b3IsIHRoaXMuc2NvcGVzKVxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcnVib2NvcC5jb21tYW5kJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuY29tbWFuZCA9IHZhbHVlXG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1ydWJvY29wLmRpc2FibGVXaGVuTm9Db25maWdGaWxlJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUgPSB2YWx1ZVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcnVib2NvcC5ydW5FeHRyYVJhaWxzQ29wcycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLnJ1bkV4dHJhUmFpbHNDb3BzID0gdmFsdWVcbiAgICAgIH0pLFxuICAgIClcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfSxcblxuICBhc3luYyBmaXhGaWxlKHRleHRFZGl0b3IpIHtcbiAgICBpZiAoIXRleHRFZGl0b3IgfHwgIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcih0ZXh0RWRpdG9yKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRleHRFZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0xpbnRlci1SdWJvY29wOiBQbGVhc2Ugc2F2ZSBiZWZvcmUgZml4IGZpbGUnKVxuICAgIH1cblxuICAgIGNvbnN0IHRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKVxuICAgIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuXG4gICAgY29uc3QgY29tbWFuZCA9IGdldEJhc2VDb21tYW5kKHRoaXMuY29tbWFuZClcbiAgICBjb21tYW5kLnB1c2goJy0tYXV0by1jb3JyZWN0JylcbiAgICBjb21tYW5kLnB1c2goZmlsZVBhdGgpXG5cbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBleGVjdXRlUnVib2NvcChnZXRCYXNlRXhlY3V0aW9uT3B0cyhmaWxlUGF0aCksIGNvbW1hbmQpXG4gICAgY29uc3Qge1xuICAgICAgZmlsZXMsXG4gICAgICBzdW1tYXJ5OiB7IG9mZmVuc2VfY291bnQ6IG9mZmVuc2VDb3VudCB9LFxuICAgIH0gPSBwYXJzZUZyb21TdGQob3V0cHV0LnN0ZG91dCwgb3V0cHV0LnN0ZGVycilcblxuICAgIGNvbnN0IG9mZmVuc2VzID0gZmlsZXMgJiYgZmlsZXNbMF0gJiYgZmlsZXNbMF0ub2ZmZW5zZXNcblxuICAgIGlmIChvZmZlbnNlQ291bnQgPT09IDApIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdMaW50ZXItUnVib2NvcDogTm8gZml4ZXMgd2VyZSBtYWRlJylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29ycmVjdGlvbnMgPSBPYmplY3QudmFsdWVzKG9mZmVuc2VzKVxuICAgICAgICAucmVkdWNlKChvZmYsIHsgY29ycmVjdGVkIH0pID0+IG9mZiArIGNvcnJlY3RlZCwgMClcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgTGludGVyLVJ1Ym9jb3A6IEZpeGVkICR7cGx1cmFsaXplKCdvZmZlbnNlcycsIGNvcnJlY3Rpb25zLCB0cnVlKX0gb2YgJHtvZmZlbnNlQ291bnR9YFxuICAgICAgaWYgKGNvcnJlY3Rpb25zIDwgb2ZmZW5zZUNvdW50KSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKG1lc3NhZ2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhtZXNzYWdlKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUnVib0NvcCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiB0aGlzLnNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKGVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgaWYgKCFmaWxlUGF0aCkgeyByZXR1cm4gbnVsbCB9XG5cbiAgICAgICAgbG9hZERlcHMoKVxuXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVXaGVuTm9Db25maWdGaWxlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gYXdhaXQgaGVscGVycy5maW5kQXN5bmMoZmlsZVBhdGgsICcucnVib2NvcC55bWwnKVxuICAgICAgICAgIGlmIChjb25maWcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4ZWNPcHRpb25zID0gZ2V0QmFzZUV4ZWN1dGlvbk9wdHMoZmlsZVBhdGgpXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBnZXRCYXNlQ29tbWFuZCh0aGlzLmNvbW1hbmQpXG5cbiAgICAgICAgaWYgKGVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgICAgICBleGVjT3B0aW9ucy5zdGRpbiA9IGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgICBjb21tYW5kLnB1c2goJy0tc3RkaW4nLCBmaWxlUGF0aClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleGVjT3B0aW9ucy5pZ25vcmVFeGl0Q29kZSA9IHRydWVcbiAgICAgICAgICBjb21tYW5kLnB1c2goZmlsZVBhdGgpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBleGVjdXRlUnVib2NvcChleGVjT3B0aW9ucywgY29tbWFuZClcblxuICAgICAgICAvLyBQcm9jZXNzIHdhcyBjYW5jZWxlZCBieSBuZXdlciBwcm9jZXNzXG4gICAgICAgIGlmIChvdXRwdXQgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBtZXRhZGF0YTogeyBydWJvY29wX3ZlcnNpb246IHJ1Ym9jb3BWZXJzaW9uIH0sIGZpbGVzLFxuICAgICAgICB9ID0gcGFyc2VGcm9tU3RkKG91dHB1dC5zdGRvdXQsIG91dHB1dC5zdGRlcnIpXG5cbiAgICAgICAgaWYgKHJ1Ym9jb3BWZXJzaW9uID09IG51bGwgfHwgcnVib2NvcFZlcnNpb24gPT09ICcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZ2V0IHJ1Ym9jb3AgdmVyc2lvbiBmcm9tIGxpbnRpbmcgb3V0cHV0IHJlc3VsdHMuJylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9mZmVuc2VzID0gZmlsZXMgJiYgZmlsZXNbMF0gJiYgZmlsZXNbMF0ub2ZmZW5zZXNcblxuICAgICAgICByZXR1cm4gKG9mZmVuc2VzIHx8IFtdKS5tYXAoXG4gICAgICAgICAgb2ZmZW5zZSA9PiBmb3J3YXJkUnVib2NvcFRvTGludGVyKHJ1Ym9jb3BWZXJzaW9uLCBvZmZlbnNlLCBmaWxlUGF0aCwgZWRpdG9yKSxcbiAgICAgICAgKVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG4iXX0=