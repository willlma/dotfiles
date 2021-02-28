'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TOP_FILE_RANGE = [[0, 0], [0, Infinity]];

var ErrorFormatter = (function () {
  function ErrorFormatter() {
    _classCallCheck(this, ErrorFormatter);

    this.topFileRange = TOP_FILE_RANGE;
  }

  _createClass(ErrorFormatter, [{
    key: 'format',
    value: function format(filePath, message) {
      return [{
        excerpt: 'Linter-Rubocop: ' + message,
        severity: 'error',
        location: {
          file: filePath,
          position: this.topFileRange
        }
      }];
    }
  }]);

  return ErrorFormatter;
})();

exports['default'] = ErrorFormatter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9FcnJvckZvcm1hdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7QUFFWCxJQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7O0lBRXpCLGNBQWM7QUFDdEIsV0FEUSxjQUFjLEdBQ25COzBCQURLLGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxZQUFZLEdBQUcsY0FBYyxDQUFBO0dBQ25DOztlQUhrQixjQUFjOztXQUszQixnQkFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ3hCLGFBQU8sQ0FBQztBQUNOLGVBQU8sdUJBQXFCLE9BQU8sQUFBRTtBQUNyQyxnQkFBUSxFQUFFLE9BQU87QUFDakIsZ0JBQVEsRUFBRTtBQUNSLGNBQUksRUFBRSxRQUFRO0FBQ2Qsa0JBQVEsRUFBRSxJQUFJLENBQUMsWUFBWTtTQUM1QjtPQUNGLENBQUMsQ0FBQTtLQUNIOzs7U0Fka0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1Ym9jb3Avc3JjL0Vycm9yRm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY29uc3QgVE9QX0ZJTEVfUkFOR0UgPSBbWzAsIDBdLCBbMCwgSW5maW5pdHldXVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvckZvcm1hdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudG9wRmlsZVJhbmdlID0gVE9QX0ZJTEVfUkFOR0VcbiAgfVxuXG4gIGZvcm1hdChmaWxlUGF0aCwgbWVzc2FnZSkge1xuICAgIHJldHVybiBbe1xuICAgICAgZXhjZXJwdDogYExpbnRlci1SdWJvY29wOiAke21lc3NhZ2V9YCxcbiAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgZmlsZTogZmlsZVBhdGgsXG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLnRvcEZpbGVSYW5nZSxcbiAgICAgIH0sXG4gICAgfV1cbiAgfVxufVxuIl19