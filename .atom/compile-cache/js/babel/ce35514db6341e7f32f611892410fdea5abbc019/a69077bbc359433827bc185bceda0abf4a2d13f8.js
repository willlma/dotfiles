function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* global emit */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomLinter = require('atom-linter');

var _workerHelpers = require('./worker-helpers');

var Helpers = _interopRequireWildcard(_workerHelpers);

var _isConfigAtHomeRoot = require('./is-config-at-home-root');

var _isConfigAtHomeRoot2 = _interopRequireDefault(_isConfigAtHomeRoot);

'use babel';

process.title = 'linter-eslint helper';

var rulesMetadata = new Map();
var shouldSendRules = false;

function lintJob(_ref) {
  var cliEngineOptions = _ref.cliEngineOptions;
  var contents = _ref.contents;
  var eslint = _ref.eslint;
  var filePath = _ref.filePath;

  var cliEngine = new eslint.CLIEngine(cliEngineOptions);
  var report = cliEngine.executeOnText(contents, filePath);
  var rules = Helpers.getRules(cliEngine);
  shouldSendRules = Helpers.didRulesChange(rulesMetadata, rules);
  if (shouldSendRules) {
    // Rebuild rulesMetadata
    rulesMetadata.clear();
    rules.forEach(function (properties, rule) {
      return rulesMetadata.set(rule, properties);
    });
  }
  return report;
}

function fixJob(_ref2) {
  var cliEngineOptions = _ref2.cliEngineOptions;
  var contents = _ref2.contents;
  var eslint = _ref2.eslint;
  var filePath = _ref2.filePath;

  var report = lintJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });

  eslint.CLIEngine.outputFixes(report);

  if (!report.results.length || !report.results[0].messages.length) {
    return 'Linter-ESLint: Fix complete.';
  }
  return 'Linter-ESLint: Fix attempt complete, but linting errors remain.';
}

module.exports = _asyncToGenerator(function* () {
  process.on('message', function (jobConfig) {
    // We catch all worker errors so that we can create a separate error emitter
    // for each emitKey, rather than adding multiple listeners for `task:error`
    var contents = jobConfig.contents;
    var type = jobConfig.type;
    var config = jobConfig.config;
    var filePath = jobConfig.filePath;
    var projectPath = jobConfig.projectPath;
    var rules = jobConfig.rules;
    var emitKey = jobConfig.emitKey;

    try {
      if (config.disableFSCache) {
        _atomLinter.FindCache.clear();
      }

      var fileDir = _path2['default'].dirname(filePath);
      var eslint = Helpers.getESLintInstance(fileDir, config, projectPath);
      var configPath = Helpers.getConfigPath(fileDir);
      var noProjectConfig = configPath === null || (0, _isConfigAtHomeRoot2['default'])(configPath);
      if (noProjectConfig && config.disableWhenNoEslintConfig) {
        emit(emitKey, { messages: [] });
        return;
      }

      var relativeFilePath = Helpers.getRelativePath(fileDir, filePath, config, projectPath);

      var cliEngineOptions = Helpers.getCLIEngineOptions(type, config, rules, relativeFilePath, fileDir, configPath);

      var response = undefined;
      if (type === 'lint') {
        var report = lintJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });
        response = {
          messages: report.results.length ? report.results[0].messages : []
        };
        if (shouldSendRules) {
          // You can't emit Maps, convert to Array of Arrays to send back.
          response.updatedRules = Array.from(rulesMetadata);
        }
      } else if (type === 'fix') {
        response = fixJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });
      } else if (type === 'debug') {
        var modulesDir = _path2['default'].dirname((0, _atomLinter.findCached)(fileDir, 'node_modules/eslint') || '');
        response = Helpers.findESLintDirectory(modulesDir, config, projectPath);
      }
      emit(emitKey, response);
    } catch (workerErr) {
      emit('workerError:' + emitKey, { msg: workerErr.message, stack: workerErr.stack });
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL3dvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFJaUIsTUFBTTs7OzswQkFDZSxhQUFhOzs2QkFDMUIsa0JBQWtCOztJQUEvQixPQUFPOztrQ0FDWSwwQkFBMEI7Ozs7QUFQekQsV0FBVyxDQUFBOztBQVNYLE9BQU8sQ0FBQyxLQUFLLEdBQUcsc0JBQXNCLENBQUE7O0FBRXRDLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDL0IsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFBOztBQUUzQixTQUFTLE9BQU8sQ0FBQyxJQUFnRCxFQUFFO01BQWhELGdCQUFnQixHQUFsQixJQUFnRCxDQUE5QyxnQkFBZ0I7TUFBRSxRQUFRLEdBQTVCLElBQWdELENBQTVCLFFBQVE7TUFBRSxNQUFNLEdBQXBDLElBQWdELENBQWxCLE1BQU07TUFBRSxRQUFRLEdBQTlDLElBQWdELENBQVYsUUFBUTs7QUFDN0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDeEQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDMUQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUN6QyxpQkFBZSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzlELE1BQUksZUFBZSxFQUFFOztBQUVuQixpQkFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3JCLFNBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVLEVBQUUsSUFBSTthQUFLLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztLQUFBLENBQUMsQ0FBQTtHQUN6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QUNsRSxDQUFBO0FBQ0QsWUFBSSxlQUFlLEVBQUU7O0FBRW5CLGtCQUFRLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7U0FDbEQ7T0FDRixNQUFNLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtBQUN6QixnQkFBUSxHQUFHLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixFQUFoQixnQkFBZ0IsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7T0FDcEUsTUFBTSxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7QUFDM0IsWUFBTSxVQUFVLEdBQUcsa0JBQUssT0FBTyxDQUFDLDRCQUFXLE9BQU8sRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ2pGLGdCQUFRLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7T0FDeEU7QUFDRCxVQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3hCLENBQUMsT0FBTyxTQUFTLEVBQUU7QUFDbEIsVUFBSSxrQkFBZ0IsT0FBTyxFQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0tBQ25GO0dBQ0YsQ0FBQyxDQUFBO0NBQ0gsQ0FBQSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL3dvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8qIGdsb2JhbCBlbWl0ICovXG5cbmltcG9ydCBQYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBGaW5kQ2FjaGUsIGZpbmRDYWNoZWQgfSBmcm9tICdhdG9tLWxpbnRlcidcbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi93b3JrZXItaGVscGVycydcbmltcG9ydCBpc0NvbmZpZ0F0SG9tZVJvb3QgZnJvbSAnLi9pcy1jb25maWctYXQtaG9tZS1yb290J1xuXG5wcm9jZXNzLnRpdGxlID0gJ2xpbnRlci1lc2xpbnQgaGVscGVyJ1xuXG5jb25zdCBydWxlc01ldGFkYXRhID0gbmV3IE1hcCgpXG5sZXQgc2hvdWxkU2VuZFJ1bGVzID0gZmFsc2VcblxuZnVuY3Rpb24gbGludEpvYih7IGNsaUVuZ2luZU9wdGlvbnMsIGNvbnRlbnRzLCBlc2xpbnQsIGZpbGVQYXRoIH0pIHtcbiAgY29uc3QgY2xpRW5naW5lID0gbmV3IGVzbGludC5DTElFbmdpbmUoY2xpRW5naW5lT3B0aW9ucylcbiAgY29uc3QgcmVwb3J0ID0gY2xpRW5naW5lLmV4ZWN1dGVPblRleHQoY29udGVudHMsIGZpbGVQYXRoKVxuICBjb25zdCBydWxlcyA9IEhlbHBlcnMuZ2V0UnVsZXMoY2xpRW5naW5lKVxuICBzaG91bGRTZW5kUnVsZXMgPSBIZWxwZXJzLmRpZFJ1bGVzQ2hhbmdlKHJ1bGVzTWV0YWRhdGEsIHJ1bGVzKVxuICBpZiAoc2hvdWxkU2VuZFJ1bGVzKSB7XG4gICAgLy8gUmVidWlsZCBydWxlc01ldGFkYXRhXG4gICAgcnVsZXNNZXRhZGF0YS5jbGVhcigpXG4gICAgcnVsZXMuZm9yRWFjaCgocHJvcGVydGllcywgcnVsZSkgPT4gcnVsZXNNZXRhZGF0YS5zZXQocnVsZSwgcHJvcGVydGllcykpXG4gIH1cbiAgcmV0dXJuIHJlcG9ydFxufVxuXG5mdW5jdGlvbiBmaXhKb2IoeyBjbGlFbmdpbmVPcHRpb25zLCBjb250ZW50cywgZXNsaW50LCBmaWxlUGF0aCB9KSB7XG4gIGNvbnN0IHJlcG9ydCA9IGxpbnRKb2IoeyBjbGlFbmdpbmVPcHRpb25zLCBjb250ZW50cywgZXNsaW50LCBmaWxlUGF0aCB9KVxuXG4gIGVzbGludC5DTElFbmdpbmUub3V0cHV0Rml4ZXMocmVwb3J0KVxuXG4gIGlmICghcmVwb3J0LnJlc3VsdHMubGVuZ3RoIHx8ICFyZXBvcnQucmVzdWx0c1swXS5tZXNzYWdlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJ0xpbnRlci1FU0xpbnQ6IEZpeCBjb21wbGV0ZS4nXG4gIH1cbiAgcmV0dXJuICdMaW50ZXItRVNMaW50OiBGaXggYXR0ZW1wdCBjb21wbGV0ZSwgYnV0IGxpbnRpbmcgZXJyb3JzIHJlbWFpbi4nXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgKCkgPT4ge1xuICBwcm9jZXNzLm9uKCdtZXNzYWdlJywgKGpvYkNvbmZpZykgPT4ge1xuICAgIC8vIFdlIGNhdGNoIGFsbCB3b3JrZXIgZXJyb3JzIHNvIHRoYXQgd2UgY2FuIGNyZWF0ZSBhIHNlcGFyYXRlIGVycm9yIGVtaXR0ZXJcbiAgICAvLyBmb3IgZWFjaCBlbWl0S2V5LCByYXRoZXIgdGhhbiBhZGRpbmcgbXVsdGlwbGUgbGlzdGVuZXJzIGZvciBgdGFzazplcnJvcmBcbiAgICBjb25zdCB7XG4gICAgICBjb250ZW50cywgdHlwZSwgY29uZmlnLCBmaWxlUGF0aCwgcHJvamVjdFBhdGgsIHJ1bGVzLCBlbWl0S2V5XG4gICAgfSA9IGpvYkNvbmZpZ1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlnLmRpc2FibGVGU0NhY2hlKSB7XG4gICAgICAgIEZpbmRDYWNoZS5jbGVhcigpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBQYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gICAgICBjb25zdCBlc2xpbnQgPSBIZWxwZXJzLmdldEVTTGludEluc3RhbmNlKGZpbGVEaXIsIGNvbmZpZywgcHJvamVjdFBhdGgpXG4gICAgICBjb25zdCBjb25maWdQYXRoID0gSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpXG4gICAgICBjb25zdCBub1Byb2plY3RDb25maWcgPSAoY29uZmlnUGF0aCA9PT0gbnVsbCB8fCBpc0NvbmZpZ0F0SG9tZVJvb3QoY29uZmlnUGF0aCkpXG4gICAgICBpZiAobm9Qcm9qZWN0Q29uZmlnICYmIGNvbmZpZy5kaXNhYmxlV2hlbk5vRXNsaW50Q29uZmlnKSB7XG4gICAgICAgIGVtaXQoZW1pdEtleSwgeyBtZXNzYWdlczogW10gfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbGF0aXZlRmlsZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aChmaWxlRGlyLCBmaWxlUGF0aCwgY29uZmlnLCBwcm9qZWN0UGF0aClcblxuICAgICAgY29uc3QgY2xpRW5naW5lT3B0aW9ucyA9IEhlbHBlcnNcbiAgICAgICAgLmdldENMSUVuZ2luZU9wdGlvbnModHlwZSwgY29uZmlnLCBydWxlcywgcmVsYXRpdmVGaWxlUGF0aCwgZmlsZURpciwgY29uZmlnUGF0aClcblxuICAgICAgbGV0IHJlc3BvbnNlXG4gICAgICBpZiAodHlwZSA9PT0gJ2xpbnQnKSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydCA9IGxpbnRKb2IoeyBjbGlFbmdpbmVPcHRpb25zLCBjb250ZW50cywgZXNsaW50LCBmaWxlUGF0aCB9KVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBtZXNzYWdlczogcmVwb3J0LnJlc3VsdHMubGVuZ3RoID8gcmVwb3J0LnJlc3VsdHNbMF0ubWVzc2FnZXMgOiBbXVxuICAgICAgICB9XG4gICAgICAgIGlmIChzaG91bGRTZW5kUnVsZXMpIHtcbiAgICAgICAgICAvLyBZb3UgY2FuJ3QgZW1pdCBNYXBzLCBjb252ZXJ0IHRvIEFycmF5IG9mIEFycmF5cyB0byBzZW5kIGJhY2suXG4gICAgICAgICAgcmVzcG9uc2UudXBkYXRlZFJ1bGVzID0gQXJyYXkuZnJvbShydWxlc01ldGFkYXRhKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmaXgnKSB7XG4gICAgICAgIHJlc3BvbnNlID0gZml4Sm9iKHsgY2xpRW5naW5lT3B0aW9ucywgY29udGVudHMsIGVzbGludCwgZmlsZVBhdGggfSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RlYnVnJykge1xuICAgICAgICBjb25zdCBtb2R1bGVzRGlyID0gUGF0aC5kaXJuYW1lKGZpbmRDYWNoZWQoZmlsZURpciwgJ25vZGVfbW9kdWxlcy9lc2xpbnQnKSB8fCAnJylcbiAgICAgICAgcmVzcG9uc2UgPSBIZWxwZXJzLmZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aClcbiAgICAgIH1cbiAgICAgIGVtaXQoZW1pdEtleSwgcmVzcG9uc2UpXG4gICAgfSBjYXRjaCAod29ya2VyRXJyKSB7XG4gICAgICBlbWl0KGB3b3JrZXJFcnJvcjoke2VtaXRLZXl9YCwgeyBtc2c6IHdvcmtlckVyci5tZXNzYWdlLCBzdGFjazogd29ya2VyRXJyLnN0YWNrIH0pXG4gICAgfVxuICB9KVxufVxuIl19