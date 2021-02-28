Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _requestPromise = require('request-promise');

'use babel';

var DEFAULT_ARGS = ['--cache', 'false', '--force-exclusion', '--format', 'json', '--display-style-guide'];
var DOCUMENTATION_LIFETIME = 86400 * 1000; // 1 day TODO: Configurable?

var docsRuleCache = new Map();
var execPathVersions = new Map();
var docsLastRetrieved = undefined;

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

var takeWhile = function takeWhile(source, predicate) {
  var result = [];
  var length = source.length;

  var i = 0;

  while (i < length && predicate(source[i], i)) {
    result.push(source[i]);
    i += 1;
  }

  return result;
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

var getProjectDirectory = function getProjectDirectory(filePath) {
  return atom.project.relativizePath(filePath)[0] || path.dirname(filePath);
};

// Retrieves style guide documentation with cached responses
var getMarkDown = _asyncToGenerator(function* (url) {
  var anchor = url.split('#')[1];

  if (new Date().getTime() - docsLastRetrieved < DOCUMENTATION_LIFETIME) {
    // If documentation is stale, clear cache
    docsRuleCache.clear();
  }

  if (docsRuleCache.has(anchor)) {
    return docsRuleCache.get(anchor);
  }

  var rawRulesMarkdown = undefined;
  try {
    rawRulesMarkdown = yield (0, _requestPromise.get)('https://raw.githubusercontent.com/bbatsov/ruby-style-guide/master/README.md');
  } catch (x) {
    return '***\nError retrieving documentation';
  }

  var byLine = rawRulesMarkdown.split('\n');
  // eslint-disable-next-line no-confusing-arrow
  var ruleAnchors = byLine.reduce(function (acc, line, idx) {
    return line.match(/\* <a name=/g) ? acc.concat([[idx, line]]) : acc;
  }, []);

  ruleAnchors.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var startingIndex = _ref2[0];
    var startingLine = _ref2[1];

    var ruleName = startingLine.split('"')[1];
    var beginSearch = byLine.slice(startingIndex + 1);

    // gobble all the documentation until you reach the next rule
    var documentationForRule = takeWhile(beginSearch, function (x) {
      return !x.match(/\* <a name=|##/);
    });
    var markdownOutput = '***\n'.concat(documentationForRule.join('\n'));

    docsRuleCache.set(ruleName, markdownOutput);
  });

  docsLastRetrieved = new Date().getTime();
  return docsRuleCache.get(anchor);
});

var forwardRubocopToLinter = function forwardRubocopToLinter(_ref3, file, editor) {
  var rawMessage = _ref3.message;
  var location = _ref3.location;
  var severity = _ref3.severity;
  var copName = _ref3.cop_name;

  var _rawMessage$split = rawMessage.split(/ \((.*)\)/, 2);

  var _rawMessage$split2 = _slicedToArray(_rawMessage$split, 2);

  var excerpt = _rawMessage$split2[0];
  var url = _rawMessage$split2[1];

  var position = undefined;
  if (location) {
    var line = location.line;
    var column = location.column;
    var _length = location.length;

    position = [[line - 1, column - 1], [line - 1, column + _length - 1]];
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
    excerpt: copName + ': ' + excerpt,
    severity: severityMapping[severity],
    description: url ? function () {
      return getMarkDown(url);
    } : null,
    location: {
      file: file,
      position: position
    }
  };
  return linterMessage;
};

var determineExecVersion = _asyncToGenerator(function* (command, cwd) {
  var args = command.slice(1);
  args.push('--version');
  var versionString = yield helpers.exec(command[0], args, { cwd: cwd, ignoreExitCode: true });
  var versionPattern = /^(\d+\.\d+\.\d+)/i;
  var match = versionString.match(versionPattern);
  if (match !== null && match[1]) {
    return match[1];
  }
  throw new Error('Unable to parse rubocop version from command output: ' + versionString);
});

var getRubocopVersion = _asyncToGenerator(function* (command, cwd) {
  var key = [cwd, command].toString();
  if (!execPathVersions.has(key)) {
    execPathVersions.set(key, (yield determineExecVersion(command, cwd)));
  }
  return execPathVersions.get(key);
});

var getCopNameArg = _asyncToGenerator(function* (command, cwd) {
  var version = yield getRubocopVersion(command, cwd);
  if (semver.gte(version, '0.52.0')) {
    return ['--no-display-cop-names'];
  }

  return [];
});

exports['default'] = {
  activate: function activate() {
    var _this = this;

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

    // Register fix command
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'linter-rubocop:fix-file': _asyncToGenerator(function* () {
        var textEditor = atom.workspace.getActiveTextEditor();

        if (!atom.workspace.isTextEditor(textEditor) || textEditor.isModified()) {
          // Abort for invalid or unsaved text editors
          return atom.notifications.addError('Linter-Rubocop: Please save before fixing');
        }

        var filePath = textEditor.getPath();
        if (!filePath) {
          return null;
        }

        var cwd = getProjectDirectory(filePath);
        var command = _this.command.split(/\s+/).filter(function (i) {
          return i;
        }).concat(DEFAULT_ARGS, '--auto-correct');
        command.push.apply(command, _toConsumableArray((yield getCopNameArg(command, cwd))));
        command.push(filePath);

        var _ref4 = yield helpers.exec(command[0], command.slice(1), { cwd: cwd, stream: 'both' });

        var stdout = _ref4.stdout;
        var stderr = _ref4.stderr;

        var _parseFromStd = parseFromStd(stdout, stderr);

        var offenseCount = _parseFromStd.summary.offense_count;

        return offenseCount === 0 ? atom.notifications.addInfo('Linter-Rubocop: No fixes were made') : atom.notifications.addSuccess('Linter-Rubocop: Fixed ' + pluralize('offenses', offenseCount, true));
      })
    }), atom.config.observe('linter-rubocop.command', function (value) {
      _this.command = value;
    }), atom.config.observe('linter-rubocop.disableWhenNoConfigFile', function (value) {
      _this.disableWhenNoConfigFile = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'RuboCop',
      grammarScopes: ['source.ruby', 'source.ruby.gemfile', 'source.ruby.rails', 'source.ruby.rspec', 'source.ruby.chef'],
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

        var cwd = getProjectDirectory(filePath);
        var command = _this2.command.split(/\s+/).filter(function (i) {
          return i;
        }).concat(DEFAULT_ARGS);
        command.push.apply(command, _toConsumableArray((yield getCopNameArg(command, cwd))));
        command.push('--stdin', filePath);
        var stdin = editor.getText();
        var exexOptions = {
          cwd: cwd,
          stdin: stdin,
          stream: 'both',
          timeout: 10000,
          uniqueKey: 'linter-rubocop::' + filePath
        };

        var output = undefined;
        try {
          output = yield helpers.exec(command[0], command.slice(1), exexOptions);
        } catch (e) {
          if (e.message !== 'Process execution timed out') throw e;
          atom.notifications.addInfo('Linter-Rubocop: Linter timed out', {
            description: 'Make sure you are not running Rubocop with a slow-starting interpreter like JRuby. ' + 'If you are still seeing timeouts, consider running your linter `on save` and not `on change`, ' + 'or reference https://github.com/AtomLinter/linter-rubocop/issues/202 .'
          });
          return null;
        }
        // Process was canceled by newer process
        if (output === null) {
          return null;
        }

        var _parseFromStd2 = parseFromStd(output.stdout, output.stderr);

        var files = _parseFromStd2.files;

        var offenses = files && files[0] && files[0].offenses;
        return (offenses || []).map(function (offense) {
          return forwardRubocopToLinter(offense, filePath, editor);
        });
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OzhCQUN0QixpQkFBaUI7O0FBSnJDLFdBQVcsQ0FBQTs7QUFNWCxJQUFNLFlBQVksR0FBRyxDQUNuQixTQUFTLEVBQUUsT0FBTyxFQUNsQixtQkFBbUIsRUFDbkIsVUFBVSxFQUFFLE1BQU0sRUFDbEIsdUJBQXVCLENBQ3hCLENBQUE7QUFDRCxJQUFNLHNCQUFzQixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUE7O0FBRTNDLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDL0IsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ2xDLElBQUksaUJBQWlCLFlBQUEsQ0FBQTs7QUFFckIsSUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLElBQUksSUFBSSxZQUFBLENBQUE7QUFDUixJQUFJLFNBQVMsWUFBQSxDQUFBO0FBQ2IsSUFBSSxNQUFNLFlBQUEsQ0FBQTs7QUFFVixJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsR0FBUztBQUNyQixNQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osV0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtHQUNqQztBQUNELE1BQUksQ0FBQyxJQUFJLEVBQUU7QUFDVCxRQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0dBQ3ZCO0FBQ0QsTUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNkLGFBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7R0FDakM7QUFDRCxNQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsVUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUMzQjtDQUNGLENBQUE7O0FBRUQsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksTUFBTSxF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ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1Ym9jb3Avc3JjL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgZ2V0IH0gZnJvbSAncmVxdWVzdC1wcm9taXNlJ1xuXG5jb25zdCBERUZBVUxUX0FSR1MgPSBbXG4gICctLWNhY2hlJywgJ2ZhbHNlJyxcbiAgJy0tZm9yY2UtZXhjbHVzaW9uJyxcbiAgJy0tZm9ybWF0JywgJ2pzb24nLFxuICAnLS1kaXNwbGF5LXN0eWxlLWd1aWRlJyxcbl1cbmNvbnN0IERPQ1VNRU5UQVRJT05fTElGRVRJTUUgPSA4NjQwMCAqIDEwMDAgLy8gMSBkYXkgVE9ETzogQ29uZmlndXJhYmxlP1xuXG5jb25zdCBkb2NzUnVsZUNhY2hlID0gbmV3IE1hcCgpXG5jb25zdCBleGVjUGF0aFZlcnNpb25zID0gbmV3IE1hcCgpXG5sZXQgZG9jc0xhc3RSZXRyaWV2ZWRcblxubGV0IGhlbHBlcnNcbmxldCBwYXRoXG5sZXQgcGx1cmFsaXplXG5sZXQgc2VtdmVyXG5cbmNvbnN0IGxvYWREZXBzID0gKCkgPT4ge1xuICBpZiAoIWhlbHBlcnMpIHtcbiAgICBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKVxuICB9XG4gIGlmICghcGF0aCkge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgfVxuICBpZiAoIXBsdXJhbGl6ZSkge1xuICAgIHBsdXJhbGl6ZSA9IHJlcXVpcmUoJ3BsdXJhbGl6ZScpXG4gIH1cbiAgaWYgKCFzZW12ZXIpIHtcbiAgICBzZW12ZXIgPSByZXF1aXJlKCdzZW12ZXInKVxuICB9XG59XG5cbmNvbnN0IHRha2VXaGlsZSA9IChzb3VyY2UsIHByZWRpY2F0ZSkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBbXVxuICBjb25zdCB7IGxlbmd0aCB9ID0gc291cmNlXG4gIGxldCBpID0gMFxuXG4gIHdoaWxlIChpIDwgbGVuZ3RoICYmIHByZWRpY2F0ZShzb3VyY2VbaV0sIGkpKSB7XG4gICAgcmVzdWx0LnB1c2goc291cmNlW2ldKVxuICAgIGkgKz0gMVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5jb25zdCBwYXJzZUZyb21TdGQgPSAoc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgbGV0IHBhcnNlZFxuICB0cnkge1xuICAgIHBhcnNlZCA9IEpTT04ucGFyc2Uoc3Rkb3V0KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIGNvbnRpbnVlIHJlZ2FyZGxlc3Mgb2YgZXJyb3JcbiAgfVxuICBpZiAodHlwZW9mIHBhcnNlZCAhPT0gJ29iamVjdCcpIHsgdGhyb3cgbmV3IEVycm9yKHN0ZGVyciB8fCBzdGRvdXQpIH1cbiAgcmV0dXJuIHBhcnNlZFxufVxuXG5jb25zdCBnZXRQcm9qZWN0RGlyZWN0b3J5ID0gZmlsZVBhdGggPT4gKFxuICBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdIHx8IHBhdGguZGlybmFtZShmaWxlUGF0aCkpXG5cbi8vIFJldHJpZXZlcyBzdHlsZSBndWlkZSBkb2N1bWVudGF0aW9uIHdpdGggY2FjaGVkIHJlc3BvbnNlc1xuY29uc3QgZ2V0TWFya0Rvd24gPSBhc3luYyAodXJsKSA9PiB7XG4gIGNvbnN0IGFuY2hvciA9IHVybC5zcGxpdCgnIycpWzFdXG5cbiAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZG9jc0xhc3RSZXRyaWV2ZWQgPCBET0NVTUVOVEFUSU9OX0xJRkVUSU1FKSB7XG4gICAgLy8gSWYgZG9jdW1lbnRhdGlvbiBpcyBzdGFsZSwgY2xlYXIgY2FjaGVcbiAgICBkb2NzUnVsZUNhY2hlLmNsZWFyKClcbiAgfVxuXG4gIGlmIChkb2NzUnVsZUNhY2hlLmhhcyhhbmNob3IpKSB7IHJldHVybiBkb2NzUnVsZUNhY2hlLmdldChhbmNob3IpIH1cblxuICBsZXQgcmF3UnVsZXNNYXJrZG93blxuICB0cnkge1xuICAgIHJhd1J1bGVzTWFya2Rvd24gPSBhd2FpdCBnZXQoJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9iYmF0c292L3J1Ynktc3R5bGUtZ3VpZGUvbWFzdGVyL1JFQURNRS5tZCcpXG4gIH0gY2F0Y2ggKHgpIHtcbiAgICByZXR1cm4gJyoqKlxcbkVycm9yIHJldHJpZXZpbmcgZG9jdW1lbnRhdGlvbidcbiAgfVxuXG4gIGNvbnN0IGJ5TGluZSA9IHJhd1J1bGVzTWFya2Rvd24uc3BsaXQoJ1xcbicpXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25mdXNpbmctYXJyb3dcbiAgY29uc3QgcnVsZUFuY2hvcnMgPSBieUxpbmUucmVkdWNlKFxuICAgIChhY2MsIGxpbmUsIGlkeCkgPT4gKGxpbmUubWF0Y2goL1xcKiA8YSBuYW1lPS9nKSA/IGFjYy5jb25jYXQoW1tpZHgsIGxpbmVdXSkgOiBhY2MpLFxuICAgIFtdLFxuICApXG5cbiAgcnVsZUFuY2hvcnMuZm9yRWFjaCgoW3N0YXJ0aW5nSW5kZXgsIHN0YXJ0aW5nTGluZV0pID0+IHtcbiAgICBjb25zdCBydWxlTmFtZSA9IHN0YXJ0aW5nTGluZS5zcGxpdCgnXCInKVsxXVxuICAgIGNvbnN0IGJlZ2luU2VhcmNoID0gYnlMaW5lLnNsaWNlKHN0YXJ0aW5nSW5kZXggKyAxKVxuXG4gICAgLy8gZ29iYmxlIGFsbCB0aGUgZG9jdW1lbnRhdGlvbiB1bnRpbCB5b3UgcmVhY2ggdGhlIG5leHQgcnVsZVxuICAgIGNvbnN0IGRvY3VtZW50YXRpb25Gb3JSdWxlID0gdGFrZVdoaWxlKGJlZ2luU2VhcmNoLCB4ID0+ICF4Lm1hdGNoKC9cXCogPGEgbmFtZT18IyMvKSlcbiAgICBjb25zdCBtYXJrZG93bk91dHB1dCA9ICcqKipcXG4nLmNvbmNhdChkb2N1bWVudGF0aW9uRm9yUnVsZS5qb2luKCdcXG4nKSlcblxuICAgIGRvY3NSdWxlQ2FjaGUuc2V0KHJ1bGVOYW1lLCBtYXJrZG93bk91dHB1dClcbiAgfSlcblxuICBkb2NzTGFzdFJldHJpZXZlZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gIHJldHVybiBkb2NzUnVsZUNhY2hlLmdldChhbmNob3IpXG59XG5cbmNvbnN0IGZvcndhcmRSdWJvY29wVG9MaW50ZXIgPSAoe1xuICBtZXNzYWdlOiByYXdNZXNzYWdlLCBsb2NhdGlvbiwgc2V2ZXJpdHksIGNvcF9uYW1lOiBjb3BOYW1lLFxufSwgZmlsZSwgZWRpdG9yKSA9PiB7XG4gIGNvbnN0IFtleGNlcnB0LCB1cmxdID0gcmF3TWVzc2FnZS5zcGxpdCgvIFxcKCguKilcXCkvLCAyKVxuICBsZXQgcG9zaXRpb25cbiAgaWYgKGxvY2F0aW9uKSB7XG4gICAgY29uc3QgeyBsaW5lLCBjb2x1bW4sIGxlbmd0aCB9ID0gbG9jYXRpb25cbiAgICBwb3NpdGlvbiA9IFtbbGluZSAtIDEsIGNvbHVtbiAtIDFdLCBbbGluZSAtIDEsIChjb2x1bW4gKyBsZW5ndGgpIC0gMV1dXG4gIH0gZWxzZSB7XG4gICAgcG9zaXRpb24gPSBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UoZWRpdG9yLCAwKVxuICB9XG5cbiAgY29uc3Qgc2V2ZXJpdHlNYXBwaW5nID0ge1xuICAgIHJlZmFjdG9yOiAnaW5mbycsXG4gICAgY29udmVudGlvbjogJ2luZm8nLFxuICAgIHdhcm5pbmc6ICd3YXJuaW5nJyxcbiAgICBlcnJvcjogJ2Vycm9yJyxcbiAgICBmYXRhbDogJ2Vycm9yJyxcbiAgfVxuXG4gIGNvbnN0IGxpbnRlck1lc3NhZ2UgPSB7XG4gICAgdXJsLFxuICAgIGV4Y2VycHQ6IGAke2NvcE5hbWV9OiAke2V4Y2VycHR9YCxcbiAgICBzZXZlcml0eTogc2V2ZXJpdHlNYXBwaW5nW3NldmVyaXR5XSxcbiAgICBkZXNjcmlwdGlvbjogdXJsID8gKCkgPT4gZ2V0TWFya0Rvd24odXJsKSA6IG51bGwsXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGZpbGUsXG4gICAgICBwb3NpdGlvbixcbiAgICB9LFxuICB9XG4gIHJldHVybiBsaW50ZXJNZXNzYWdlXG59XG5cbmNvbnN0IGRldGVybWluZUV4ZWNWZXJzaW9uID0gYXN5bmMgKGNvbW1hbmQsIGN3ZCkgPT4ge1xuICBjb25zdCBhcmdzID0gY29tbWFuZC5zbGljZSgxKVxuICBhcmdzLnB1c2goJy0tdmVyc2lvbicpXG4gIGNvbnN0IHZlcnNpb25TdHJpbmcgPSBhd2FpdCBoZWxwZXJzLmV4ZWMoY29tbWFuZFswXSwgYXJncywgeyBjd2QsIGlnbm9yZUV4aXRDb2RlOiB0cnVlIH0pXG4gIGNvbnN0IHZlcnNpb25QYXR0ZXJuID0gL14oXFxkK1xcLlxcZCtcXC5cXGQrKS9pXG4gIGNvbnN0IG1hdGNoID0gdmVyc2lvblN0cmluZy5tYXRjaCh2ZXJzaW9uUGF0dGVybilcbiAgaWYgKG1hdGNoICE9PSBudWxsICYmIG1hdGNoWzFdKSB7XG4gICAgcmV0dXJuIG1hdGNoWzFdXG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcGFyc2UgcnVib2NvcCB2ZXJzaW9uIGZyb20gY29tbWFuZCBvdXRwdXQ6ICR7dmVyc2lvblN0cmluZ31gKVxufVxuXG5jb25zdCBnZXRSdWJvY29wVmVyc2lvbiA9IGFzeW5jIChjb21tYW5kLCBjd2QpID0+IHtcbiAgY29uc3Qga2V5ID0gW2N3ZCwgY29tbWFuZF0udG9TdHJpbmcoKVxuICBpZiAoIWV4ZWNQYXRoVmVyc2lvbnMuaGFzKGtleSkpIHtcbiAgICBleGVjUGF0aFZlcnNpb25zLnNldChrZXksIGF3YWl0IGRldGVybWluZUV4ZWNWZXJzaW9uKGNvbW1hbmQsIGN3ZCkpXG4gIH1cbiAgcmV0dXJuIGV4ZWNQYXRoVmVyc2lvbnMuZ2V0KGtleSlcbn1cblxuY29uc3QgZ2V0Q29wTmFtZUFyZyA9IGFzeW5jIChjb21tYW5kLCBjd2QpID0+IHtcbiAgY29uc3QgdmVyc2lvbiA9IGF3YWl0IGdldFJ1Ym9jb3BWZXJzaW9uKGNvbW1hbmQsIGN3ZClcbiAgaWYgKHNlbXZlci5ndGUodmVyc2lvbiwgJzAuNTIuMCcpKSB7XG4gICAgcmV0dXJuIFsnLS1uby1kaXNwbGF5LWNvcC1uYW1lcyddXG4gIH1cblxuICByZXR1cm4gW11cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KClcbiAgICBsZXQgZGVwc0NhbGxiYWNrSURcbiAgICBjb25zdCBpbnN0YWxsTGludGVyUnVib2NvcERlcHMgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKGRlcHNDYWxsYmFja0lEKVxuICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1ydWJvY29wJywgdHJ1ZSlcbiAgICAgIH1cbiAgICAgIGxvYWREZXBzKClcbiAgICB9XG4gICAgZGVwc0NhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhpbnN0YWxsTGludGVyUnVib2NvcERlcHMpXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChkZXBzQ2FsbGJhY2tJRClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIC8vIFJlZ2lzdGVyIGZpeCBjb21tYW5kXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywge1xuICAgICAgICAnbGludGVyLXJ1Ym9jb3A6Zml4LWZpbGUnOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgICAgICAgaWYgKCFhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IodGV4dEVkaXRvcikgfHwgdGV4dEVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgICAgICAgIC8vIEFib3J0IGZvciBpbnZhbGlkIG9yIHVuc2F2ZWQgdGV4dCBlZGl0b3JzXG4gICAgICAgICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdMaW50ZXItUnVib2NvcDogUGxlYXNlIHNhdmUgYmVmb3JlIGZpeGluZycpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgICAgICAgIGlmICghZmlsZVBhdGgpIHsgcmV0dXJuIG51bGwgfVxuXG4gICAgICAgICAgY29uc3QgY3dkID0gZ2V0UHJvamVjdERpcmVjdG9yeShmaWxlUGF0aClcbiAgICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5jb21tYW5kXG4gICAgICAgICAgICAuc3BsaXQoL1xccysvKVxuICAgICAgICAgICAgLmZpbHRlcihpID0+IGkpXG4gICAgICAgICAgICAuY29uY2F0KERFRkFVTFRfQVJHUywgJy0tYXV0by1jb3JyZWN0JylcbiAgICAgICAgICBjb21tYW5kLnB1c2goLi4uKGF3YWl0IGdldENvcE5hbWVBcmcoY29tbWFuZCwgY3dkKSkpXG4gICAgICAgICAgY29tbWFuZC5wdXNoKGZpbGVQYXRoKVxuXG4gICAgICAgICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgaGVscGVycy5leGVjKGNvbW1hbmRbMF0sIGNvbW1hbmQuc2xpY2UoMSksIHsgY3dkLCBzdHJlYW06ICdib3RoJyB9KVxuICAgICAgICAgIGNvbnN0IHsgc3VtbWFyeTogeyBvZmZlbnNlX2NvdW50OiBvZmZlbnNlQ291bnQgfSB9ID0gcGFyc2VGcm9tU3RkKHN0ZG91dCwgc3RkZXJyKVxuICAgICAgICAgIHJldHVybiBvZmZlbnNlQ291bnQgPT09IDBcbiAgICAgICAgICAgID8gYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0xpbnRlci1SdWJvY29wOiBObyBmaXhlcyB3ZXJlIG1hZGUnKVxuICAgICAgICAgICAgOiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhgTGludGVyLVJ1Ym9jb3A6IEZpeGVkICR7cGx1cmFsaXplKCdvZmZlbnNlcycsIG9mZmVuc2VDb3VudCwgdHJ1ZSl9YClcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXJ1Ym9jb3AuY29tbWFuZCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNvbW1hbmQgPSB2YWx1ZVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcnVib2NvcC5kaXNhYmxlV2hlbk5vQ29uZmlnRmlsZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmRpc2FibGVXaGVuTm9Db25maWdGaWxlID0gdmFsdWVcbiAgICAgIH0pLFxuICAgIClcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUnVib0NvcCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAgICdzb3VyY2UucnVieScsXG4gICAgICAgICdzb3VyY2UucnVieS5nZW1maWxlJyxcbiAgICAgICAgJ3NvdXJjZS5ydWJ5LnJhaWxzJyxcbiAgICAgICAgJ3NvdXJjZS5ydWJ5LnJzcGVjJyxcbiAgICAgICAgJ3NvdXJjZS5ydWJ5LmNoZWYnLFxuICAgICAgXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKGVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgaWYgKCFmaWxlUGF0aCkgeyByZXR1cm4gbnVsbCB9XG5cbiAgICAgICAgbG9hZERlcHMoKVxuXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVXaGVuTm9Db25maWdGaWxlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gYXdhaXQgaGVscGVycy5maW5kQXN5bmMoZmlsZVBhdGgsICcucnVib2NvcC55bWwnKVxuICAgICAgICAgIGlmIChjb25maWcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN3ZCA9IGdldFByb2plY3REaXJlY3RvcnkoZmlsZVBhdGgpXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRcbiAgICAgICAgICAuc3BsaXQoL1xccysvKVxuICAgICAgICAgIC5maWx0ZXIoaSA9PiBpKVxuICAgICAgICAgIC5jb25jYXQoREVGQVVMVF9BUkdTKVxuICAgICAgICBjb21tYW5kLnB1c2goLi4uKGF3YWl0IGdldENvcE5hbWVBcmcoY29tbWFuZCwgY3dkKSkpXG4gICAgICAgIGNvbW1hbmQucHVzaCgnLS1zdGRpbicsIGZpbGVQYXRoKVxuICAgICAgICBjb25zdCBzdGRpbiA9IGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgY29uc3QgZXhleE9wdGlvbnMgPSB7XG4gICAgICAgICAgY3dkLFxuICAgICAgICAgIHN0ZGluLFxuICAgICAgICAgIHN0cmVhbTogJ2JvdGgnLFxuICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxuICAgICAgICAgIHVuaXF1ZUtleTogYGxpbnRlci1ydWJvY29wOjoke2ZpbGVQYXRofWAsXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb3V0cHV0XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKGNvbW1hbmRbMF0sIGNvbW1hbmQuc2xpY2UoMSksIGV4ZXhPcHRpb25zKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGUubWVzc2FnZSAhPT0gJ1Byb2Nlc3MgZXhlY3V0aW9uIHRpbWVkIG91dCcpIHRocm93IGVcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhcbiAgICAgICAgICAgICdMaW50ZXItUnVib2NvcDogTGludGVyIHRpbWVkIG91dCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWFrZSBzdXJlIHlvdSBhcmUgbm90IHJ1bm5pbmcgUnVib2NvcCB3aXRoIGEgc2xvdy1zdGFydGluZyBpbnRlcnByZXRlciBsaWtlIEpSdWJ5LiAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArICdJZiB5b3UgYXJlIHN0aWxsIHNlZWluZyB0aW1lb3V0cywgY29uc2lkZXIgcnVubmluZyB5b3VyIGxpbnRlciBgb24gc2F2ZWAgYW5kIG5vdCBgb24gY2hhbmdlYCwgJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnb3IgcmVmZXJlbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9BdG9tTGludGVyL2xpbnRlci1ydWJvY29wL2lzc3Vlcy8yMDIgLicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIClcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICAgIC8vIFByb2Nlc3Mgd2FzIGNhbmNlbGVkIGJ5IG5ld2VyIHByb2Nlc3NcbiAgICAgICAgaWYgKG91dHB1dCA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbCB9XG5cbiAgICAgICAgY29uc3QgeyBmaWxlcyB9ID0gcGFyc2VGcm9tU3RkKG91dHB1dC5zdGRvdXQsIG91dHB1dC5zdGRlcnIpXG4gICAgICAgIGNvbnN0IG9mZmVuc2VzID0gZmlsZXMgJiYgZmlsZXNbMF0gJiYgZmlsZXNbMF0ub2ZmZW5zZXNcbiAgICAgICAgcmV0dXJuIChvZmZlbnNlcyB8fCBbXSkubWFwKG9mZmVuc2UgPT4gZm9yd2FyZFJ1Ym9jb3BUb0xpbnRlcihvZmZlbnNlLCBmaWxlUGF0aCwgZWRpdG9yKSlcbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuIl19