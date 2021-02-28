var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomLinter = require('atom-linter');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _helpersStdParser = require('../helpers/std-parser');

var _helpersStdParser2 = _interopRequireDefault(_helpersStdParser);

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _Runner = require('./Runner');

var _Runner2 = _interopRequireDefault(_Runner);

var _ErrorFormatter = require('../ErrorFormatter');

var _ErrorFormatter2 = _interopRequireDefault(_ErrorFormatter);

var _OffenseFormatter = require('./OffenseFormatter');

var _OffenseFormatter2 = _interopRequireDefault(_OffenseFormatter);

'use babel';

var CONFIG_FILE = '.rubocop.yml';

var PARSE_ERROR_MSG = 'Rubocop: Parse error';
var UNEXPECTED_ERROR_MSG = 'Rubocop: Unexpected error';
var UNDEF_VERSION_ERROR_MSG = 'Unable to get rubocop version from linting output results.';
var NO_FIXES_INFO_MSG = 'Linter-Rubocop: No fixes were made';

var configFileFound = Symbol('configFileFound');

var Rubocop = (function () {
  function Rubocop(_ref) {
    var command = _ref.command;
    var disableWhenNoConfigFile = _ref.disableWhenNoConfigFile;
    var useBundler = _ref.useBundler;

    _classCallCheck(this, Rubocop);

    this.config = new _Config2['default']({ command: command, disableWhenNoConfigFile: disableWhenNoConfigFile, useBundler: useBundler });
    this.runner = new _Runner2['default'](this.config);
    this.offenseFormatter = new _OffenseFormatter2['default']();
    this.errorFormatter = new _ErrorFormatter2['default']();
  }

  _createClass(Rubocop, [{
    key: configFileFound,
    value: _asyncToGenerator(function* (filePath) {
      if (this.config.disableWhenNoConfigFile === true) {
        return (yield (0, _atomLinter.findAsync)(filePath, CONFIG_FILE)) !== null;
      }
      return true;
    })
  }, {
    key: 'autocorrect',
    value: _asyncToGenerator(function* (filePath) {
      var onSave = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (!filePath || !(yield this[configFileFound](filePath))) {
        return;
      }

      try {
        var output = yield this.runner.runSync(filePath, ['--auto-correct', filePath]);
        try {
          var _parseFromStd = (0, _helpersStdParser2['default'])(output.stdout, output.stderr);

          var files = _parseFromStd.files;
          var offenseCount = _parseFromStd.summary.offense_count;

          var offenses = files && files[0] && files[0].offenses;

          if (offenseCount === 0) {
            atom.notifications.addInfo(NO_FIXES_INFO_MSG);
          } else {
            var corrections = Object.values(offenses).reduce(function (off, _ref2) {
              var corrected = _ref2.corrected;
              return off + corrected;
            }, 0);
            var message = 'Linter-Rubocop: Fixed ' + (0, _pluralize2['default'])('offenses', corrections, true) + ' of ' + offenseCount;
            if (!onSave) {
              if (corrections < offenseCount) {
                atom.notifications.addInfo(message);
              } else {
                atom.notifications.addSuccess(message);
              }
            }
          }
        } catch (e) {
          atom.notifications.addError(PARSE_ERROR_MSG, { description: e.message });
        }
      } catch (e) {
        atom.notifications.addError(UNEXPECTED_ERROR_MSG, { description: e.message });
      }
    })
  }, {
    key: 'analyze',
    value: _asyncToGenerator(function* (text, filePath) {
      var _this = this;

      if (!filePath || !(yield this[configFileFound](filePath))) {
        return null;
      }

      try {
        var output = yield this.runner.run(filePath, ['--stdin', filePath], { stdin: text });
        try {
          var _ret = (function () {
            if (output === null) {
              return {
                v: null
              };
            }

            var _parseFromStd2 = (0, _helpersStdParser2['default'])(output.stdout, output.stderr);

            var rubocopVersion = _parseFromStd2.metadata.rubocop_version;
            var files = _parseFromStd2.files;

            if (rubocopVersion == null || rubocopVersion === '') {
              throw new Error(UNDEF_VERSION_ERROR_MSG);
            }

            var offenses = files && files[0] && files[0].offenses;

            return {
              v: (offenses || []).map(function (offense) {
                return _this.offenseFormatter.format(rubocopVersion, offense, filePath);
              })
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        } catch (e) {
          return this.errorFormatter.format(filePath, e.message);
        }
      } catch (e) {
        atom.notifications.addError(UNEXPECTED_ERROR_MSG, { description: e.message });
        return null;
      }
    })
  }]);

  return Rubocop;
})();

module.exports = Rubocop;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWJvY29wL1J1Ym9jb3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBRTBCLGFBQWE7O3lCQUNqQixXQUFXOzs7O2dDQUNSLHVCQUF1Qjs7OztzQkFDN0IsVUFBVTs7OztzQkFDVixVQUFVOzs7OzhCQUNGLG1CQUFtQjs7OztnQ0FDakIsb0JBQW9COzs7O0FBUmpELFdBQVcsQ0FBQTs7QUFVWCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUE7O0FBRWxDLElBQU0sZUFBZSxHQUFHLHNCQUFzQixDQUFBO0FBQzlDLElBQU0sb0JBQW9CLEdBQUcsMkJBQTJCLENBQUE7QUFDeEQsSUFBTSx1QkFBdUIsR0FBRyw0REFBNEQsQ0FBQTtBQUM1RixJQUFNLGlCQUFpQixHQUFHLG9DQUFvQyxDQUFBOztBQUU5RCxJQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQTs7SUFFM0MsT0FBTztBQUNBLFdBRFAsT0FBTyxDQUNDLElBQWdELEVBQUU7UUFBaEQsT0FBTyxHQUFULElBQWdELENBQTlDLE9BQU87UUFBRSx1QkFBdUIsR0FBbEMsSUFBZ0QsQ0FBckMsdUJBQXVCO1FBQUUsVUFBVSxHQUE5QyxJQUFnRCxDQUFaLFVBQVU7OzBCQUR0RCxPQUFPOztBQUVULFFBQUksQ0FBQyxNQUFNLEdBQUcsd0JBQVcsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLHVCQUF1QixFQUF2Qix1QkFBdUIsRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFFLENBQUMsQ0FBQTtBQUMxRSxRQUFJLENBQUMsTUFBTSxHQUFHLHdCQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsbUNBQXNCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGNBQWMsR0FBRyxpQ0FBb0IsQ0FBQTtHQUMzQzs7ZUFORyxPQUFPO1NBUUos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LE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDOztnQkFEZixjQUFjLGtCQUEzQyxRQUFRLENBQUksZUFBZTtnQkFBb0IsS0FBSyxrQkFBTCxLQUFLOztBQUd0RCxnQkFBSSxjQUFjLElBQUksSUFBSSxJQUFJLGNBQWMsS0FBSyxFQUFFLEVBQUU7QUFDbkQsb0JBQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQTthQUN6Qzs7QUFFRCxnQkFBTSxRQUFRLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFBOztBQUV2RDtpQkFBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUEsQ0FBRSxHQUFHLENBQ3pCLFVBQUMsT0FBTzt1QkFBSyxNQUFLLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztlQUFBLENBQzdFO2NBQUE7Ozs7U0FDRixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsaUJBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUN2RDtPQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixZQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtBQUM3RSxlQUFPLElBQUksQ0FBQTtPQUNaO0tBQ0Y7OztTQWxGRyxPQUFPOzs7QUFxRmIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUEiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1Ym9jb3Avc3JjL3J1Ym9jb3AvUnVib2NvcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IGZpbmRBc3luYyB9IGZyb20gJ2F0b20tbGludGVyJ1xuaW1wb3J0IHBsdXJhbGl6ZSBmcm9tICdwbHVyYWxpemUnXG5pbXBvcnQgcGFyc2VGcm9tU3RkIGZyb20gJy4uL2hlbHBlcnMvc3RkLXBhcnNlcidcbmltcG9ydCBDb25maWcgZnJvbSAnLi9Db25maWcnXG5pbXBvcnQgUnVubmVyIGZyb20gJy4vUnVubmVyJ1xuaW1wb3J0IEVycm9yRm9ybWF0dGVyIGZyb20gJy4uL0Vycm9yRm9ybWF0dGVyJ1xuaW1wb3J0IE9mZmVuc2VGb3JtYXR0ZXIgZnJvbSAnLi9PZmZlbnNlRm9ybWF0dGVyJ1xuXG5jb25zdCBDT05GSUdfRklMRSA9ICcucnVib2NvcC55bWwnXG5cbmNvbnN0IFBBUlNFX0VSUk9SX01TRyA9ICdSdWJvY29wOiBQYXJzZSBlcnJvcidcbmNvbnN0IFVORVhQRUNURURfRVJST1JfTVNHID0gJ1J1Ym9jb3A6IFVuZXhwZWN0ZWQgZXJyb3InXG5jb25zdCBVTkRFRl9WRVJTSU9OX0VSUk9SX01TRyA9ICdVbmFibGUgdG8gZ2V0IHJ1Ym9jb3AgdmVyc2lvbiBmcm9tIGxpbnRpbmcgb3V0cHV0IHJlc3VsdHMuJ1xuY29uc3QgTk9fRklYRVNfSU5GT19NU0cgPSAnTGludGVyLVJ1Ym9jb3A6IE5vIGZpeGVzIHdlcmUgbWFkZSdcblxuY29uc3QgY29uZmlnRmlsZUZvdW5kID0gU3ltYm9sKCdjb25maWdGaWxlRm91bmQnKVxuXG5jbGFzcyBSdWJvY29wIHtcbiAgY29uc3RydWN0b3IoeyBjb21tYW5kLCBkaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSwgdXNlQnVuZGxlciB9KSB7XG4gICAgdGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKHsgY29tbWFuZCwgZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUsIHVzZUJ1bmRsZXIgfSlcbiAgICB0aGlzLnJ1bm5lciA9IG5ldyBSdW5uZXIodGhpcy5jb25maWcpXG4gICAgdGhpcy5vZmZlbnNlRm9ybWF0dGVyID0gbmV3IE9mZmVuc2VGb3JtYXR0ZXIoKVxuICAgIHRoaXMuZXJyb3JGb3JtYXR0ZXIgPSBuZXcgRXJyb3JGb3JtYXR0ZXIoKVxuICB9XG5cbiAgYXN5bmMgW2NvbmZpZ0ZpbGVGb3VuZF0oZmlsZVBhdGgpIHtcbiAgICBpZiAodGhpcy5jb25maWcuZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBhd2FpdCBmaW5kQXN5bmMoZmlsZVBhdGgsIENPTkZJR19GSUxFKSAhPT0gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgYXN5bmMgYXV0b2NvcnJlY3QoZmlsZVBhdGgsIG9uU2F2ZSA9IGZhbHNlKSB7XG4gICAgaWYgKCFmaWxlUGF0aCB8fCAhYXdhaXQgdGhpc1tjb25maWdGaWxlRm91bmRdKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMucnVubmVyLnJ1blN5bmMoZmlsZVBhdGgsIFsnLS1hdXRvLWNvcnJlY3QnLCBmaWxlUGF0aF0pXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgZmlsZXMsXG4gICAgICAgICAgc3VtbWFyeTogeyBvZmZlbnNlX2NvdW50OiBvZmZlbnNlQ291bnQgfSxcbiAgICAgICAgfSA9IHBhcnNlRnJvbVN0ZChvdXRwdXQuc3Rkb3V0LCBvdXRwdXQuc3RkZXJyKVxuXG4gICAgICAgIGNvbnN0IG9mZmVuc2VzID0gZmlsZXMgJiYgZmlsZXNbMF0gJiYgZmlsZXNbMF0ub2ZmZW5zZXNcblxuICAgICAgICBpZiAob2ZmZW5zZUNvdW50ID09PSAwKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oTk9fRklYRVNfSU5GT19NU0cpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgY29ycmVjdGlvbnMgPSBPYmplY3QudmFsdWVzKG9mZmVuc2VzKVxuICAgICAgICAgICAgLnJlZHVjZSgob2ZmLCB7IGNvcnJlY3RlZCB9KSA9PiBvZmYgKyBjb3JyZWN0ZWQsIDApXG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBMaW50ZXItUnVib2NvcDogRml4ZWQgJHtwbHVyYWxpemUoJ29mZmVuc2VzJywgY29ycmVjdGlvbnMsIHRydWUpfSBvZiAke29mZmVuc2VDb3VudH1gXG4gICAgICAgICAgaWYgKCFvblNhdmUpIHtcbiAgICAgICAgICAgIGlmIChjb3JyZWN0aW9ucyA8IG9mZmVuc2VDb3VudCkge1xuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhtZXNzYWdlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MobWVzc2FnZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFBBUlNFX0VSUk9SX01TRywgeyBkZXNjcmlwdGlvbjogZS5tZXNzYWdlIH0pXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFVORVhQRUNURURfRVJST1JfTVNHLCB7IGRlc2NyaXB0aW9uOiBlLm1lc3NhZ2UgfSlcbiAgICB9XG4gIH1cblxuICBhc3luYyBhbmFseXplKHRleHQsIGZpbGVQYXRoKSB7XG4gICAgaWYgKCFmaWxlUGF0aCB8fCAhYXdhaXQgdGhpc1tjb25maWdGaWxlRm91bmRdKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5ydW5uZXIucnVuKGZpbGVQYXRoLCBbJy0tc3RkaW4nLCBmaWxlUGF0aF0sIHsgc3RkaW46IHRleHQgfSlcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChvdXRwdXQgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBtZXRhZGF0YTogeyBydWJvY29wX3ZlcnNpb246IHJ1Ym9jb3BWZXJzaW9uIH0sIGZpbGVzLFxuICAgICAgICB9ID0gcGFyc2VGcm9tU3RkKG91dHB1dC5zdGRvdXQsIG91dHB1dC5zdGRlcnIpXG5cbiAgICAgICAgaWYgKHJ1Ym9jb3BWZXJzaW9uID09IG51bGwgfHwgcnVib2NvcFZlcnNpb24gPT09ICcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFVOREVGX1ZFUlNJT05fRVJST1JfTVNHKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb2ZmZW5zZXMgPSBmaWxlcyAmJiBmaWxlc1swXSAmJiBmaWxlc1swXS5vZmZlbnNlc1xuXG4gICAgICAgIHJldHVybiAob2ZmZW5zZXMgfHwgW10pLm1hcChcbiAgICAgICAgICAob2ZmZW5zZSkgPT4gdGhpcy5vZmZlbnNlRm9ybWF0dGVyLmZvcm1hdChydWJvY29wVmVyc2lvbiwgb2ZmZW5zZSwgZmlsZVBhdGgpLFxuICAgICAgICApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVycm9yRm9ybWF0dGVyLmZvcm1hdChmaWxlUGF0aCwgZS5tZXNzYWdlKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihVTkVYUEVDVEVEX0VSUk9SX01TRywgeyBkZXNjcmlwdGlvbjogZS5tZXNzYWdlIH0pXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJ1Ym9jb3BcbiJdfQ==