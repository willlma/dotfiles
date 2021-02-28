Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _requestPromise = require('request-promise');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

'use babel';

var DEFAULT_ARGS = ['--cache', 'false', '--force-exclusion', '--format', 'json', '--display-style-guide'];
var DOCUMENTATION_LIFETIME = 86400 * 1000; // 1 day TODO: Configurable?

var docsRuleCache = new Map();
var execPathVersions = new Map();
var docsLastRetrieved = undefined;

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
  return atom.project.relativizePath(filePath)[0] || _path2['default'].dirname(filePath);
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
  if (_semver2['default'].gte(version, '0.52.0')) {
    return ['--no-display-cop-names'];
  }

  return [];
});

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-rubocop', true);

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

        return offenseCount === 0 ? atom.notifications.addInfo('Linter-Rubocop: No fixes were made') : atom.notifications.addSuccess('Linter-Rubocop: Fixed ' + (0, _pluralize2['default'])('offenses', offenseCount, true));
      })
    }), atom.config.observe('linter-rubocop.command', function (value) {
      _this.command = value;
    }), atom.config.observe('linter-rubocop.disableWhenNoConfigFile', function (value) {
      _this.disableWhenNoConfigFile = value;
    }));
  },

  deactivate: function deactivate() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUdvQyxNQUFNOztvQkFDekIsTUFBTTs7Ozt5QkFDRCxXQUFXOzs7OzBCQUNSLGFBQWE7O0lBQTFCLE9BQU87OzhCQUNDLGlCQUFpQjs7c0JBQ2xCLFFBQVE7Ozs7QUFSM0IsV0FBVyxDQUFBOztBQVVYLElBQU0sWUFBWSxHQUFHLENBQ25CLFNBQVMsRUFBRSxPQUFPLEVBQ2xCLG1CQUFtQixFQUNuQixVQUFVLEVBQUUsTUFBTSxFQUNsQix1QkFBdUIsQ0FDeEIsQ0FBQTtBQUNELElBQU0sc0JBQXNCLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQTs7QUFFM0MsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMvQixJQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDbEMsSUFBSSxpQkFBaUIsWUFBQSxDQUFBOztBQUVyQixJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxNQUFNLEVBQUUsU0FBUyxFQUFLO0FBQ3ZDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtNQUNULE1BQU0sR0FBSyxNQUFNLENBQWpCLE1BQU07O0FBQ2QsTUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUVULFNBQU8sQ0FBQyxHQUFHLE1BQU0sSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQzVDLFVBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEIsS0FBQyxJQUFJLENBQUMsQ0FBQTtHQUNQOztBQUVELFNBQU8sTUFBTSxDQUFBO0NBQ2QsQ0FBQTs7QUFFRCxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxNQUFNLEVBQUUsTUFBTSxFQUFL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QUNGIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSdcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnYXRvbS1saW50ZXInXG5pbXBvcnQgeyBnZXQgfSBmcm9tICdyZXF1ZXN0LXByb21pc2UnXG5pbXBvcnQgc2VtdmVyIGZyb20gJ3NlbXZlcidcblxuY29uc3QgREVGQVVMVF9BUkdTID0gW1xuICAnLS1jYWNoZScsICdmYWxzZScsXG4gICctLWZvcmNlLWV4Y2x1c2lvbicsXG4gICctLWZvcm1hdCcsICdqc29uJyxcbiAgJy0tZGlzcGxheS1zdHlsZS1ndWlkZScsXG5dXG5jb25zdCBET0NVTUVOVEFUSU9OX0xJRkVUSU1FID0gODY0MDAgKiAxMDAwIC8vIDEgZGF5IFRPRE86IENvbmZpZ3VyYWJsZT9cblxuY29uc3QgZG9jc1J1bGVDYWNoZSA9IG5ldyBNYXAoKVxuY29uc3QgZXhlY1BhdGhWZXJzaW9ucyA9IG5ldyBNYXAoKVxubGV0IGRvY3NMYXN0UmV0cmlldmVkXG5cbmNvbnN0IHRha2VXaGlsZSA9IChzb3VyY2UsIHByZWRpY2F0ZSkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBbXVxuICBjb25zdCB7IGxlbmd0aCB9ID0gc291cmNlXG4gIGxldCBpID0gMFxuXG4gIHdoaWxlIChpIDwgbGVuZ3RoICYmIHByZWRpY2F0ZShzb3VyY2VbaV0sIGkpKSB7XG4gICAgcmVzdWx0LnB1c2goc291cmNlW2ldKVxuICAgIGkgKz0gMVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5jb25zdCBwYXJzZUZyb21TdGQgPSAoc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgbGV0IHBhcnNlZFxuICB0cnkge1xuICAgIHBhcnNlZCA9IEpTT04ucGFyc2Uoc3Rkb3V0KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIGNvbnRpbnVlIHJlZ2FyZGxlc3Mgb2YgZXJyb3JcbiAgfVxuICBpZiAodHlwZW9mIHBhcnNlZCAhPT0gJ29iamVjdCcpIHsgdGhyb3cgbmV3IEVycm9yKHN0ZGVyciB8fCBzdGRvdXQpIH1cbiAgcmV0dXJuIHBhcnNlZFxufVxuXG5jb25zdCBnZXRQcm9qZWN0RGlyZWN0b3J5ID0gZmlsZVBhdGggPT5cbiAgYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVswXSB8fCBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG5cbi8vIFJldHJpZXZlcyBzdHlsZSBndWlkZSBkb2N1bWVudGF0aW9uIHdpdGggY2FjaGVkIHJlc3BvbnNlc1xuY29uc3QgZ2V0TWFya0Rvd24gPSBhc3luYyAodXJsKSA9PiB7XG4gIGNvbnN0IGFuY2hvciA9IHVybC5zcGxpdCgnIycpWzFdXG5cbiAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZG9jc0xhc3RSZXRyaWV2ZWQgPCBET0NVTUVOVEFUSU9OX0xJRkVUSU1FKSB7XG4gICAgLy8gSWYgZG9jdW1lbnRhdGlvbiBpcyBzdGFsZSwgY2xlYXIgY2FjaGVcbiAgICBkb2NzUnVsZUNhY2hlLmNsZWFyKClcbiAgfVxuXG4gIGlmIChkb2NzUnVsZUNhY2hlLmhhcyhhbmNob3IpKSB7IHJldHVybiBkb2NzUnVsZUNhY2hlLmdldChhbmNob3IpIH1cblxuICBsZXQgcmF3UnVsZXNNYXJrZG93blxuICB0cnkge1xuICAgIHJhd1J1bGVzTWFya2Rvd24gPSBhd2FpdCBnZXQoJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9iYmF0c292L3J1Ynktc3R5bGUtZ3VpZGUvbWFzdGVyL1JFQURNRS5tZCcpXG4gIH0gY2F0Y2ggKHgpIHtcbiAgICByZXR1cm4gJyoqKlxcbkVycm9yIHJldHJpZXZpbmcgZG9jdW1lbnRhdGlvbidcbiAgfVxuXG4gIGNvbnN0IGJ5TGluZSA9IHJhd1J1bGVzTWFya2Rvd24uc3BsaXQoJ1xcbicpXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25mdXNpbmctYXJyb3dcbiAgY29uc3QgcnVsZUFuY2hvcnMgPSBieUxpbmUucmVkdWNlKFxuICAgIChhY2MsIGxpbmUsIGlkeCkgPT5cbiAgICAgIChsaW5lLm1hdGNoKC9cXCogPGEgbmFtZT0vZykgPyBhY2MuY29uY2F0KFtbaWR4LCBsaW5lXV0pIDogYWNjKSxcbiAgICBbXSxcbiAgKVxuXG4gIHJ1bGVBbmNob3JzLmZvckVhY2goKFtzdGFydGluZ0luZGV4LCBzdGFydGluZ0xpbmVdKSA9PiB7XG4gICAgY29uc3QgcnVsZU5hbWUgPSBzdGFydGluZ0xpbmUuc3BsaXQoJ1wiJylbMV1cbiAgICBjb25zdCBiZWdpblNlYXJjaCA9IGJ5TGluZS5zbGljZShzdGFydGluZ0luZGV4ICsgMSlcblxuICAgIC8vIGdvYmJsZSBhbGwgdGhlIGRvY3VtZW50YXRpb24gdW50aWwgeW91IHJlYWNoIHRoZSBuZXh0IHJ1bGVcbiAgICBjb25zdCBkb2N1bWVudGF0aW9uRm9yUnVsZSA9IHRha2VXaGlsZShiZWdpblNlYXJjaCwgeCA9PiAheC5tYXRjaCgvXFwqIDxhIG5hbWU9fCMjLykpXG4gICAgY29uc3QgbWFya2Rvd25PdXRwdXQgPSAnKioqXFxuJy5jb25jYXQoZG9jdW1lbnRhdGlvbkZvclJ1bGUuam9pbignXFxuJykpXG5cbiAgICBkb2NzUnVsZUNhY2hlLnNldChydWxlTmFtZSwgbWFya2Rvd25PdXRwdXQpXG4gIH0pXG5cbiAgZG9jc0xhc3RSZXRyaWV2ZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICByZXR1cm4gZG9jc1J1bGVDYWNoZS5nZXQoYW5jaG9yKVxufVxuXG5jb25zdCBmb3J3YXJkUnVib2NvcFRvTGludGVyID1cbiAgKHtcbiAgICBtZXNzYWdlOiByYXdNZXNzYWdlLCBsb2NhdGlvbiwgc2V2ZXJpdHksIGNvcF9uYW1lOiBjb3BOYW1lLFxuICB9LCBmaWxlLCBlZGl0b3IpID0+IHtcbiAgICBjb25zdCBbZXhjZXJwdCwgdXJsXSA9IHJhd01lc3NhZ2Uuc3BsaXQoLyBcXCgoLiopXFwpLywgMilcbiAgICBsZXQgcG9zaXRpb25cbiAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgIGNvbnN0IHsgbGluZSwgY29sdW1uLCBsZW5ndGggfSA9IGxvY2F0aW9uXG4gICAgICBwb3NpdGlvbiA9IFtbbGluZSAtIDEsIGNvbHVtbiAtIDFdLCBbbGluZSAtIDEsIChjb2x1bW4gKyBsZW5ndGgpIC0gMV1dXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc2l0aW9uID0gaGVscGVycy5nZW5lcmF0ZVJhbmdlKGVkaXRvciwgMClcbiAgICB9XG5cbiAgICBjb25zdCBzZXZlcml0eU1hcHBpbmcgPSB7XG4gICAgICByZWZhY3RvcjogJ2luZm8nLFxuICAgICAgY29udmVudGlvbjogJ2luZm8nLFxuICAgICAgd2FybmluZzogJ3dhcm5pbmcnLFxuICAgICAgZXJyb3I6ICdlcnJvcicsXG4gICAgICBmYXRhbDogJ2Vycm9yJyxcbiAgICB9XG5cbiAgICBjb25zdCBsaW50ZXJNZXNzYWdlID0ge1xuICAgICAgdXJsLFxuICAgICAgZXhjZXJwdDogYCR7Y29wTmFtZX06ICR7ZXhjZXJwdH1gLFxuICAgICAgc2V2ZXJpdHk6IHNldmVyaXR5TWFwcGluZ1tzZXZlcml0eV0sXG4gICAgICBkZXNjcmlwdGlvbjogdXJsID8gKCkgPT4gZ2V0TWFya0Rvd24odXJsKSA6IG51bGwsXG4gICAgICBsb2NhdGlvbjoge1xuICAgICAgICBmaWxlLFxuICAgICAgICBwb3NpdGlvbixcbiAgICAgIH0sXG4gICAgfVxuICAgIHJldHVybiBsaW50ZXJNZXNzYWdlXG4gIH1cblxuY29uc3QgZGV0ZXJtaW5lRXhlY1ZlcnNpb24gPSBhc3luYyAoY29tbWFuZCwgY3dkKSA9PiB7XG4gIGNvbnN0IGFyZ3MgPSBjb21tYW5kLnNsaWNlKDEpXG4gIGFyZ3MucHVzaCgnLS12ZXJzaW9uJylcbiAgY29uc3QgdmVyc2lvblN0cmluZyA9IGF3YWl0IGhlbHBlcnMuZXhlYyhjb21tYW5kWzBdLCBhcmdzLCB7IGN3ZCwgaWdub3JlRXhpdENvZGU6IHRydWUgfSlcbiAgY29uc3QgdmVyc2lvblBhdHRlcm4gPSAvXihcXGQrXFwuXFxkK1xcLlxcZCspL2lcbiAgY29uc3QgbWF0Y2ggPSB2ZXJzaW9uU3RyaW5nLm1hdGNoKHZlcnNpb25QYXR0ZXJuKVxuICBpZiAobWF0Y2ggIT09IG51bGwgJiYgbWF0Y2hbMV0pIHtcbiAgICByZXR1cm4gbWF0Y2hbMV1cbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBydWJvY29wIHZlcnNpb24gZnJvbSBjb21tYW5kIG91dHB1dDogJHt2ZXJzaW9uU3RyaW5nfWApXG59XG5cbmNvbnN0IGdldFJ1Ym9jb3BWZXJzaW9uID0gYXN5bmMgKGNvbW1hbmQsIGN3ZCkgPT4ge1xuICBjb25zdCBrZXkgPSBbY3dkLCBjb21tYW5kXS50b1N0cmluZygpXG4gIGlmICghZXhlY1BhdGhWZXJzaW9ucy5oYXMoa2V5KSkge1xuICAgIGV4ZWNQYXRoVmVyc2lvbnMuc2V0KGtleSwgYXdhaXQgZGV0ZXJtaW5lRXhlY1ZlcnNpb24oY29tbWFuZCwgY3dkKSlcbiAgfVxuICByZXR1cm4gZXhlY1BhdGhWZXJzaW9ucy5nZXQoa2V5KVxufVxuXG5jb25zdCBnZXRDb3BOYW1lQXJnID0gYXN5bmMgKGNvbW1hbmQsIGN3ZCkgPT4ge1xuICBjb25zdCB2ZXJzaW9uID0gYXdhaXQgZ2V0UnVib2NvcFZlcnNpb24oY29tbWFuZCwgY3dkKVxuICBpZiAoc2VtdmVyLmd0ZSh2ZXJzaW9uLCAnMC41Mi4wJykpIHtcbiAgICByZXR1cm4gWyctLW5vLWRpc3BsYXktY29wLW5hbWVzJ11cbiAgfVxuXG4gIHJldHVybiBbXVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLXJ1Ym9jb3AnLCB0cnVlKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgLy8gUmVnaXN0ZXIgZml4IGNvbW1hbmRcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCB7XG4gICAgICAgICdsaW50ZXItcnVib2NvcDpmaXgtZmlsZSc6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgICAgICBpZiAoIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcih0ZXh0RWRpdG9yKSB8fCB0ZXh0RWRpdG9yLmlzTW9kaWZpZWQoKSkge1xuICAgICAgICAgICAgLy8gQWJvcnQgZm9yIGludmFsaWQgb3IgdW5zYXZlZCB0ZXh0IGVkaXRvcnNcbiAgICAgICAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0xpbnRlci1SdWJvY29wOiBQbGVhc2Ugc2F2ZSBiZWZvcmUgZml4aW5nJylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgaWYgKCFmaWxlUGF0aCkgeyByZXR1cm4gbnVsbCB9XG5cbiAgICAgICAgICBjb25zdCBjd2QgPSBnZXRQcm9qZWN0RGlyZWN0b3J5KGZpbGVQYXRoKVxuICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRcbiAgICAgICAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICAuZmlsdGVyKGkgPT4gaSlcbiAgICAgICAgICAgIC5jb25jYXQoREVGQVVMVF9BUkdTLCAnLS1hdXRvLWNvcnJlY3QnKVxuICAgICAgICAgIGNvbW1hbmQucHVzaCguLi4oYXdhaXQgZ2V0Q29wTmFtZUFyZyhjb21tYW5kLCBjd2QpKSlcbiAgICAgICAgICBjb21tYW5kLnB1c2goZmlsZVBhdGgpXG5cbiAgICAgICAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBoZWxwZXJzLmV4ZWMoY29tbWFuZFswXSwgY29tbWFuZC5zbGljZSgxKSwgeyBjd2QsIHN0cmVhbTogJ2JvdGgnIH0pXG4gICAgICAgICAgY29uc3QgeyBzdW1tYXJ5OiB7IG9mZmVuc2VfY291bnQ6IG9mZmVuc2VDb3VudCB9IH0gPSBwYXJzZUZyb21TdGQoc3Rkb3V0LCBzdGRlcnIpXG4gICAgICAgICAgcmV0dXJuIG9mZmVuc2VDb3VudCA9PT0gMCA/XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnTGludGVyLVJ1Ym9jb3A6IE5vIGZpeGVzIHdlcmUgbWFkZScpIDpcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKGBMaW50ZXItUnVib2NvcDogRml4ZWQgJHtwbHVyYWxpemUoJ29mZmVuc2VzJywgb2ZmZW5zZUNvdW50LCB0cnVlKX1gKVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcnVib2NvcC5jb21tYW5kJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuY29tbWFuZCA9IHZhbHVlXG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1ydWJvY29wLmRpc2FibGVXaGVuTm9Db25maWdGaWxlJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUgPSB2YWx1ZVxuICAgICAgfSksXG4gICAgKVxuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdSdWJvQ29wJyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IFtcbiAgICAgICAgJ3NvdXJjZS5ydWJ5JyxcbiAgICAgICAgJ3NvdXJjZS5ydWJ5LmdlbWZpbGUnLFxuICAgICAgICAnc291cmNlLnJ1YnkucmFpbHMnLFxuICAgICAgICAnc291cmNlLnJ1YnkucnNwZWMnLFxuICAgICAgICAnc291cmNlLnJ1YnkuY2hlZicsXG4gICAgICBdLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRzT25DaGFuZ2U6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAoZWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBpZiAoIWZpbGVQYXRoKSB7IHJldHVybiBudWxsIH1cblxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IGhlbHBlcnMuZmluZEFzeW5jKGZpbGVQYXRoLCAnLnJ1Ym9jb3AueW1sJylcbiAgICAgICAgICBpZiAoY29uZmlnID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjd2QgPSBnZXRQcm9qZWN0RGlyZWN0b3J5KGZpbGVQYXRoKVxuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5jb21tYW5kXG4gICAgICAgICAgLnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAuZmlsdGVyKGkgPT4gaSlcbiAgICAgICAgICAuY29uY2F0KERFRkFVTFRfQVJHUylcbiAgICAgICAgY29tbWFuZC5wdXNoKC4uLihhd2FpdCBnZXRDb3BOYW1lQXJnKGNvbW1hbmQsIGN3ZCkpKVxuICAgICAgICBjb21tYW5kLnB1c2goJy0tc3RkaW4nLCBmaWxlUGF0aClcbiAgICAgICAgY29uc3Qgc3RkaW4gPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICAgIGNvbnN0IGV4ZXhPcHRpb25zID0ge1xuICAgICAgICAgIGN3ZCxcbiAgICAgICAgICBzdGRpbixcbiAgICAgICAgICBzdHJlYW06ICdib3RoJyxcbiAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcbiAgICAgICAgICB1bmlxdWVLZXk6IGBsaW50ZXItcnVib2NvcDo6JHtmaWxlUGF0aH1gLFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG91dHB1dFxuICAgICAgICB0cnkge1xuICAgICAgICAgIG91dHB1dCA9IGF3YWl0IGhlbHBlcnMuZXhlYyhjb21tYW5kWzBdLCBjb21tYW5kLnNsaWNlKDEpLCBleGV4T3B0aW9ucylcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlLm1lc3NhZ2UgIT09ICdQcm9jZXNzIGV4ZWN1dGlvbiB0aW1lZCBvdXQnKSB0aHJvdyBlXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXG4gICAgICAgICAgICAnTGludGVyLVJ1Ym9jb3A6IExpbnRlciB0aW1lZCBvdXQnLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ01ha2Ugc3VyZSB5b3UgYXJlIG5vdCBydW5uaW5nIFJ1Ym9jb3Agd2l0aCBhIHNsb3ctc3RhcnRpbmcgaW50ZXJwcmV0ZXIgbGlrZSBKUnVieS4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnSWYgeW91IGFyZSBzdGlsbCBzZWVpbmcgdGltZW91dHMsIGNvbnNpZGVyIHJ1bm5pbmcgeW91ciBsaW50ZXIgYG9uIHNhdmVgIGFuZCBub3QgYG9uIGNoYW5nZWAsICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29yIHJlZmVyZW5jZSBodHRwczovL2dpdGh1Yi5jb20vQXRvbUxpbnRlci9saW50ZXItcnVib2NvcC9pc3N1ZXMvMjAyIC4nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApXG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICAvLyBQcm9jZXNzIHdhcyBjYW5jZWxlZCBieSBuZXdlciBwcm9jZXNzXG4gICAgICAgIGlmIChvdXRwdXQgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuXG4gICAgICAgIGNvbnN0IHsgZmlsZXMgfSA9IHBhcnNlRnJvbVN0ZChvdXRwdXQuc3Rkb3V0LCBvdXRwdXQuc3RkZXJyKVxuICAgICAgICBjb25zdCBvZmZlbnNlcyA9IGZpbGVzICYmIGZpbGVzWzBdICYmIGZpbGVzWzBdLm9mZmVuc2VzXG4gICAgICAgIHJldHVybiAob2ZmZW5zZXMgfHwgW10pLm1hcChvZmZlbnNlID0+IGZvcndhcmRSdWJvY29wVG9MaW50ZXIob2ZmZW5zZSwgZmlsZVBhdGgsIGVkaXRvcikpXG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cbiJdfQ==