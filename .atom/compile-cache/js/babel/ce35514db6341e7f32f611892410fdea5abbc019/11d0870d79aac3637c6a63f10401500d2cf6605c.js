Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _semver = require('semver');

var _helpersDocCache = require('./helpers/doc-cache');

var _helpersDocCache2 = _interopRequireDefault(_helpersDocCache);

var _ErrorFormatter2 = require('../ErrorFormatter');

var _ErrorFormatter3 = _interopRequireDefault(_ErrorFormatter2);

'use babel';

var SEVERITY_MAPPING = {
  refactor: 'info',
  convention: 'info',
  warning: 'warning',
  error: 'error',
  fatal: 'error'
};

var HASCOPNAME_VERSION_RANGE = '>=0.52.0 <0.68.0';
var RULE_MATCH_REGEX = /https:\/\/.*#(.*)/g;

function ruleName(url) {
  if (url == null) {
    return null;
  }

  var ruleMatch = RULE_MATCH_REGEX.exec(url);
  if (ruleMatch == null) {
    return null;
  }

  var _ruleMatch = _slicedToArray(ruleMatch, 2);

  var rule = _ruleMatch[1];

  return rule;
}

var OffenseFormatter = (function (_ErrorFormatter) {
  _inherits(OffenseFormatter, _ErrorFormatter);

  function OffenseFormatter() {
    _classCallCheck(this, OffenseFormatter);

    _get(Object.getPrototypeOf(OffenseFormatter.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(OffenseFormatter, [{
    key: 'format',
    value: function format(version, _ref, filePath) {
      var rawMessage = _ref.message;
      var location = _ref.location;
      var severity = _ref.severity;
      var copName = _ref.cop_name;

      var hasCopName = (0, _semver.satisfies)(version, HASCOPNAME_VERSION_RANGE);

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
        position = this.topFileRange;
      }

      var linterMessage = {
        url: url || null,
        excerpt: hasCopName ? excerpt : copName + ': ' + excerpt,
        severity: SEVERITY_MAPPING[severity] || SEVERITY_MAPPING.error,
        description: function description() {
          return (0, _helpersDocCache2['default'])(ruleName(url));
        },
        location: {
          file: filePath,
          position: position
        }
      };

      return linterMessage;
    }
  }]);

  return OffenseFormatter;
})(_ErrorFormatter3['default']);

exports['default'] = OffenseFormatter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWJvY29wL09mZmVuc2VGb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFFMEIsUUFBUTs7K0JBQ0QscUJBQXFCOzs7OytCQUUzQixtQkFBbUI7Ozs7QUFMOUMsV0FBVyxDQUFBOztBQU9YLElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsVUFBUSxFQUFFLE1BQU07QUFDaEIsWUFBVSxFQUFFLE1BQU07QUFDbEIsU0FBTyxFQUFFLFNBQVM7QUFDbEIsT0FBSyxFQUFFLE9BQU87QUFDZCxPQUFLLEVBQUUsT0FBTztDQUNmLENBQUE7O0FBRUQsSUFBTSx3QkFBd0IsR0FBRyxrQkFBa0IsQ0FBQTtBQUNuRCxJQUFNLGdCQUFnQixHQUFHLG9CQUFvQixDQUFBOztBQUU3QyxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDckIsTUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO0FBQ2YsV0FBTyxJQUFJLENBQUE7R0FDWjs7QUFFRCxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDNUMsTUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQ3JCLFdBQU8sSUFBSSxDQUFBO0dBQ1o7O2tDQUVnQixTQUFTOztNQUFqQixJQUFJOztBQUNiLFNBQU8sSUFBSSxDQUFBO0NBQ1o7O0lBRW9CLGdCQUFnQjtZQUFoQixnQkFBZ0I7O1dBQWhCLGdCQUFnQjswQkFBaEIsZ0JBQWdCOzsrQkFBaEIsZ0JBQWdCOzs7ZUFBaEIsZ0JBQWdCOztXQUM3QixnQkFBQyxPQUFPLEVBQUUsSUFFZixFQUFFLFFBQVEsRUFBRTtVQURGLFVBQVUsR0FETCxJQUVmLENBREMsT0FBTztVQUFjLFFBQVEsR0FEZixJQUVmLENBRHNCLFFBQVE7VUFBRSxRQUFRLEdBRHpCLElBRWYsQ0FEZ0MsUUFBUTtVQUFZLE9BQU8sR0FENUMsSUFFZixDQUQwQyxRQUFROztBQUVqRCxVQUFNLFVBQVUsR0FBRyx1QkFBVSxPQUFPLEVBQUUsd0JBQXdCLENBQUMsQ0FBQTs7OEJBQ3hDLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQzs7OztVQUFoRCxPQUFPO1VBQUUsR0FBRzs7QUFDbkIsVUFBSSxRQUFRLFlBQUEsQ0FBQTtBQUNaLFVBQUksUUFBUSxFQUFFO1lBQ0osSUFBSSxHQUFxQixRQUFRLENBQWpDLElBQUk7WUFBRSxNQUFNLEdBQWEsUUFBUSxDQUEzQixNQUFNO1lBQUUsT0FBTSxHQUFLLFFBQVEsQ0FBbkIsTUFBTTs7QUFDNUIsZ0JBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEFBQUMsT0FBTSxHQUFHLE1BQU0sR0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ3ZFLE1BQU07QUFDTCxnQkFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUE7T0FDN0I7O0FBRUQsVUFBTSxhQUFhLEdBQUc7QUFDcEIsV0FBRyxFQUFFLEdBQUcsSUFBSSxJQUFJO0FBQ2hCLGVBQU8sRUFBRSxVQUFVLEdBQUcsT0FBTyxHQUFNLE9BQU8sVUFBSyxPQUFPLEFBQUU7QUFDeEQsZ0JBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLO0FBQzlELG1CQUFXLEVBQUU7aUJBQU0sa0NBQXFCLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFBO0FBQ3RELGdCQUFRLEVBQUU7QUFDUixjQUFJLEVBQUUsUUFBUTtBQUNkLGtCQUFRLEVBQVIsUUFBUTtTQUNUO09BQ0YsQ0FBQTs7QUFFRCxhQUFPLGFBQWEsQ0FBQTtLQUNyQjs7O1NBMUJrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWJvY29wL09mZmVuc2VGb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBzYXRpc2ZpZXMgfSBmcm9tICdzZW12ZXInXG5pbXBvcnQgZ2V0UnVsZURvY3VtZW50YXRpb24gZnJvbSAnLi9oZWxwZXJzL2RvYy1jYWNoZSdcblxuaW1wb3J0IEVycm9yRm9ybWF0dGVyIGZyb20gJy4uL0Vycm9yRm9ybWF0dGVyJ1xuXG5jb25zdCBTRVZFUklUWV9NQVBQSU5HID0ge1xuICByZWZhY3RvcjogJ2luZm8nLFxuICBjb252ZW50aW9uOiAnaW5mbycsXG4gIHdhcm5pbmc6ICd3YXJuaW5nJyxcbiAgZXJyb3I6ICdlcnJvcicsXG4gIGZhdGFsOiAnZXJyb3InLFxufVxuXG5jb25zdCBIQVNDT1BOQU1FX1ZFUlNJT05fUkFOR0UgPSAnPj0wLjUyLjAgPDAuNjguMCdcbmNvbnN0IFJVTEVfTUFUQ0hfUkVHRVggPSAvaHR0cHM6XFwvXFwvLiojKC4qKS9nXG5cbmZ1bmN0aW9uIHJ1bGVOYW1lKHVybCkge1xuICBpZiAodXJsID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgY29uc3QgcnVsZU1hdGNoID0gUlVMRV9NQVRDSF9SRUdFWC5leGVjKHVybClcbiAgaWYgKHJ1bGVNYXRjaCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IFssIHJ1bGVdID0gcnVsZU1hdGNoXG4gIHJldHVybiBydWxlXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9mZmVuc2VGb3JtYXR0ZXIgZXh0ZW5kcyBFcnJvckZvcm1hdHRlciB7XG4gIGZvcm1hdCh2ZXJzaW9uLCB7XG4gICAgbWVzc2FnZTogcmF3TWVzc2FnZSwgbG9jYXRpb24sIHNldmVyaXR5LCBjb3BfbmFtZTogY29wTmFtZSxcbiAgfSwgZmlsZVBhdGgpIHtcbiAgICBjb25zdCBoYXNDb3BOYW1lID0gc2F0aXNmaWVzKHZlcnNpb24sIEhBU0NPUE5BTUVfVkVSU0lPTl9SQU5HRSlcbiAgICBjb25zdCBbZXhjZXJwdCwgdXJsXSA9IHJhd01lc3NhZ2Uuc3BsaXQoLyBcXCgoLiopXFwpLywgMilcbiAgICBsZXQgcG9zaXRpb25cbiAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgIGNvbnN0IHsgbGluZSwgY29sdW1uLCBsZW5ndGggfSA9IGxvY2F0aW9uXG4gICAgICBwb3NpdGlvbiA9IFtbbGluZSAtIDEsIGNvbHVtbiAtIDFdLCBbbGluZSAtIDEsIChsZW5ndGggKyBjb2x1bW4pIC0gMV1dXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc2l0aW9uID0gdGhpcy50b3BGaWxlUmFuZ2VcbiAgICB9XG5cbiAgICBjb25zdCBsaW50ZXJNZXNzYWdlID0ge1xuICAgICAgdXJsOiB1cmwgfHwgbnVsbCxcbiAgICAgIGV4Y2VycHQ6IGhhc0NvcE5hbWUgPyBleGNlcnB0IDogYCR7Y29wTmFtZX06ICR7ZXhjZXJwdH1gLFxuICAgICAgc2V2ZXJpdHk6IFNFVkVSSVRZX01BUFBJTkdbc2V2ZXJpdHldIHx8IFNFVkVSSVRZX01BUFBJTkcuZXJyb3IsXG4gICAgICBkZXNjcmlwdGlvbjogKCkgPT4gZ2V0UnVsZURvY3VtZW50YXRpb24ocnVsZU5hbWUodXJsKSksXG4gICAgICBsb2NhdGlvbjoge1xuICAgICAgICBmaWxlOiBmaWxlUGF0aCxcbiAgICAgICAgcG9zaXRpb24sXG4gICAgICB9LFxuICAgIH1cblxuICAgIHJldHVybiBsaW50ZXJNZXNzYWdlXG4gIH1cbn1cbiJdfQ==