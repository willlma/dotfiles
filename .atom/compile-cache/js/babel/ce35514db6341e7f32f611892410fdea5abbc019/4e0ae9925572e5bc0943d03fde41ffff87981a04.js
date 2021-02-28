Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _atomLinter = require('atom-linter');

'use babel';

var TIMEOUT_ERROR_MSG = 'Process execution timed out';
var LINTER_TIMEOUT_MSG = 'Linter-Rubocop: Linter timed out';
var LINTER_TIMEOUT_DESC = 'Make sure you are not running Rubocop with a slow-starting interpreter like JRuby. ' + 'If you are still seeing timeouts, consider running your linter `on save` and not `on change`, ' + 'or reference https://github.com/AtomLinter/linter-rubocop/issues/202 .';

function currentDirectory(filePath) {
  return atom.project.relativizePath(filePath)[0] || _path2['default'].dirname(filePath);
}

function errorHandler(e) {
  if (e.message !== TIMEOUT_ERROR_MSG) {
    throw e;
  }
  atom.notifications.addInfo(LINTER_TIMEOUT_MSG, { description: LINTER_TIMEOUT_DESC });
}

var Runner = (function () {
  function Runner(config) {
    _classCallCheck(this, Runner);

    this.config = config;
  }

  _createClass(Runner, [{
    key: 'runSync',
    value: function runSync(filePath, args) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var cwd = currentDirectory(filePath);

      var command = this.config.baseCommand.concat(args);
      var output = _child_process2['default'].spawnSync(command[0], command.slice(1), _extends({
        cwd: cwd,
        shell: process.platform === 'win32' || process.platform === 'win64'
      }, options));

      if (output.error) {
        errorHandler(output.error);
        return null;
      }

      return output;
    }
  }, {
    key: 'run',
    value: _asyncToGenerator(function* (filePath, args) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var command = this.config.baseCommand.concat(args);
      var output = undefined;
      try {
        output = yield (0, _atomLinter.exec)(command[0], command.slice(1), _extends({
          cwd: currentDirectory(filePath),
          stream: 'both',
          timeout: 10000,
          uniqueKey: 'linter-rubocop::' + filePath,
          ignoreExitCode: true
        }, options));
      } catch (e) {
        errorHandler(e);
        return null;
      }

      return output;
    })
  }]);

  return Runner;
})();

exports['default'] = Runner;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWJvY29wL1J1bm5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7Ozs2QkFDRSxlQUFlOzs7OzBCQUNuQixhQUFhOztBQUpsQyxXQUFXLENBQUE7O0FBTVgsSUFBTSxpQkFBaUIsR0FBRyw2QkFBNkIsQ0FBQTtBQUN2RCxJQUFNLGtCQUFrQixHQUFHLGtDQUFrQyxDQUFBO0FBQzdELElBQU0sbUJBQW1CLEdBQUcscUZBQXFGLEdBQ25GLGdHQUFnRyxHQUNoRyx3RUFBd0UsQ0FBQTs7QUFFdEcsU0FBUyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7QUFDbEMsU0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7Q0FDMUU7O0FBRUQsU0FBUyxZQUFZLENBQUMsQ0FBQyxFQUFFO0FBQ3ZCLE1BQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxpQkFBaUIsRUFBRTtBQUNuQyxVQUFNLENBQUMsQ0FBQTtHQUNSO0FBQ0QsTUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO0NBQ3JGOztJQUVvQixNQUFNO0FBQ2QsV0FEUSxNQUFNLENBQ2IsTUFBTSxFQUFFOzBCQURELE1BQU07O0FBRXZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0dBQ3JCOztlQUhrQixNQUFNOztXQUtsQixpQkFBQyxRQUFRLEVBQUUsSUFBSSxFQUFnQjtVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDbEMsVUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXRDLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNwRCxVQUFNLE1BQU0sR0FBRywyQkFBYSxTQUFTLENBQ25DLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUVkLFdBQUcsRUFBSCxHQUFHO0FBQ0gsYUFBSyxFQUNILE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUN6QixPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU87U0FDOUIsT0FBTyxFQUViLENBQUE7O0FBRUQsVUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ2hCLG9CQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzFCLGVBQU8sSUFBSSxDQUFBO09BQ1o7O0FBRUQsYUFBTyxNQUFNLENBQUE7S0FDZDs7OzZCQUVRLFdBQUMsUUFBUSxFQUFFLElBQUksRUFBZ0I7VUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3BDLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNwRCxVQUFJLE1BQU0sWUFBQSxDQUFBO0FBQ1YsVUFBSTtBQUNGLGNBQU0sR0FBRyxNQUFNLHNCQUNiLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUVkLGFBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7QUFDL0IsZ0JBQU0sRUFBRSxNQUFNO0FBQ2QsaUJBQU8sRUFBRSxLQUFLO0FBQ2QsbUJBQVMsdUJBQXFCLFFBQVEsQUFBRTtBQUN4Qyx3QkFBYyxFQUFFLElBQUk7V0FDakIsT0FBTyxFQUViLENBQUE7T0FDRixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1Ysb0JBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNmLGVBQU8sSUFBSSxDQUFBO09BQ1o7O0FBRUQsYUFBTyxNQUFNLENBQUE7S0FDZDs7O1NBbkRrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVib2NvcC9zcmMvcnVib2NvcC9SdW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGNoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2F0b20tbGludGVyJ1xuXG5jb25zdCBUSU1FT1VUX0VSUk9SX01TRyA9ICdQcm9jZXNzIGV4ZWN1dGlvbiB0aW1lZCBvdXQnXG5jb25zdCBMSU5URVJfVElNRU9VVF9NU0cgPSAnTGludGVyLVJ1Ym9jb3A6IExpbnRlciB0aW1lZCBvdXQnXG5jb25zdCBMSU5URVJfVElNRU9VVF9ERVNDID0gJ01ha2Ugc3VyZSB5b3UgYXJlIG5vdCBydW5uaW5nIFJ1Ym9jb3Agd2l0aCBhIHNsb3ctc3RhcnRpbmcgaW50ZXJwcmV0ZXIgbGlrZSBKUnVieS4gJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ0lmIHlvdSBhcmUgc3RpbGwgc2VlaW5nIHRpbWVvdXRzLCBjb25zaWRlciBydW5uaW5nIHlvdXIgbGludGVyIGBvbiBzYXZlYCBhbmQgbm90IGBvbiBjaGFuZ2VgLCAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnb3IgcmVmZXJlbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9BdG9tTGludGVyL2xpbnRlci1ydWJvY29wL2lzc3Vlcy8yMDIgLidcblxuZnVuY3Rpb24gY3VycmVudERpcmVjdG9yeShmaWxlUGF0aCkge1xuICByZXR1cm4gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVswXSB8fCBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG59XG5cbmZ1bmN0aW9uIGVycm9ySGFuZGxlcihlKSB7XG4gIGlmIChlLm1lc3NhZ2UgIT09IFRJTUVPVVRfRVJST1JfTVNHKSB7XG4gICAgdGhyb3cgZVxuICB9XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKExJTlRFUl9USU1FT1VUX01TRywgeyBkZXNjcmlwdGlvbjogTElOVEVSX1RJTUVPVVRfREVTQyB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5uZXIge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZ1xuICB9XG5cbiAgcnVuU3luYyhmaWxlUGF0aCwgYXJncywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY3dkID0gY3VycmVudERpcmVjdG9yeShmaWxlUGF0aClcblxuICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLmNvbmZpZy5iYXNlQ29tbWFuZC5jb25jYXQoYXJncylcbiAgICBjb25zdCBvdXRwdXQgPSBjaGlsZFByb2Nlc3Muc3Bhd25TeW5jKFxuICAgICAgY29tbWFuZFswXSxcbiAgICAgIGNvbW1hbmQuc2xpY2UoMSksXG4gICAgICB7XG4gICAgICAgIGN3ZCxcbiAgICAgICAgc2hlbGw6XG4gICAgICAgICAgcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJ1xuICAgICAgICAgIHx8IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW42NCcsXG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB9LFxuICAgIClcblxuICAgIGlmIChvdXRwdXQuZXJyb3IpIHtcbiAgICAgIGVycm9ySGFuZGxlcihvdXRwdXQuZXJyb3IpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRcbiAgfVxuXG4gIGFzeW5jIHJ1bihmaWxlUGF0aCwgYXJncywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY29tbWFuZCA9IHRoaXMuY29uZmlnLmJhc2VDb21tYW5kLmNvbmNhdChhcmdzKVxuICAgIGxldCBvdXRwdXRcbiAgICB0cnkge1xuICAgICAgb3V0cHV0ID0gYXdhaXQgZXhlYyhcbiAgICAgICAgY29tbWFuZFswXSxcbiAgICAgICAgY29tbWFuZC5zbGljZSgxKSxcbiAgICAgICAge1xuICAgICAgICAgIGN3ZDogY3VycmVudERpcmVjdG9yeShmaWxlUGF0aCksXG4gICAgICAgICAgc3RyZWFtOiAnYm90aCcsXG4gICAgICAgICAgdGltZW91dDogMTAwMDAsXG4gICAgICAgICAgdW5pcXVlS2V5OiBgbGludGVyLXJ1Ym9jb3A6OiR7ZmlsZVBhdGh9YCxcbiAgICAgICAgICBpZ25vcmVFeGl0Q29kZTogdHJ1ZSxcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9LFxuICAgICAgKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9ySGFuZGxlcihlKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0XG4gIH1cbn1cbiJdfQ==