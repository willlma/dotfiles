Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _sensor = require('./sensor');

var _sensor2 = _interopRequireDefault(_sensor);

var _lodashThrottle = require('lodash.throttle');

var _lodashThrottle2 = _interopRequireDefault(_lodashThrottle);

'use babel';

var loopInterval = 3000;

var _default = (function (_Sensor) {
  _inherits(_default, _Sensor);

  function _default() {
    _classCallCheck(this, _default);

    _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(_default, [{
    key: 'activate',
    value: function activate() {
      this._initializeSensor();

      if (this.sensor) {
        this.sensor.start();
      }
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      if (this.sensor) {
        this.sensor.stop();
      }
    }
  }, {
    key: '_initializeSensor',
    value: function _initializeSensor() {
      var _this = this;

      this.sensor = new window.AmbientLightSensor();
      this.sensor.onreading = (0, _lodashThrottle2['default'])(this._onLightChange.bind(this), loopInterval);
      this.sensor.onerror = function (event) {
        return _this.log(event.error.message, 'warn');
      };
    }
  }, {
    key: '_onLightChange',
    value: function _onLightChange(_ref) {
      var value = _ref.value;

      value > this.thresholdOption ? this.switchToLightMode() : this.switchToDarkMode();
    }
  }, {
    key: 'sensorOptionName',
    get: function get() {
      return 'ambientLightSensor';
    }
  }, {
    key: 'thresholdOption',
    get: function get() {
      return atom.config.get('dark-mode.ambientLightThreshold');
    }
  }]);

  return _default;
})(_sensor2['default']);

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvc2Vuc29ycy9hbWJpZW50LWxpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixVQUFVOzs7OzhCQUVSLGlCQUFpQjs7OztBQUp0QyxXQUFXLENBQUM7O0FBTVosSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Ozs7Ozs7O1dBV2hCLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7O0FBRXpCLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDckI7S0FDRjs7O1dBRVMsc0JBQUc7QUFDWCxVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ3BCO0tBQ0Y7OztXQUVnQiw2QkFBRzs7O0FBQ2xCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUM5QyxVQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxpQ0FBUyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMvRSxVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQUs7ZUFBSyxNQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7T0FBQSxDQUFDO0tBRXhFOzs7V0FFYSx3QkFBQyxJQUFTLEVBQUU7VUFBVCxLQUFLLEdBQVAsSUFBUyxDQUFQLEtBQUs7O0FBQ3BCLFdBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0tBQ25GOzs7U0EvQm1CLGVBQUc7QUFDckIsYUFBTyxvQkFBb0IsQ0FBQztLQUM3Qjs7O1NBRWtCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0tBQzNEIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvc2Vuc29ycy9hbWJpZW50LWxpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBTZW5zb3IgZnJvbSAnLi9zZW5zb3InO1xuXG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoLnRocm90dGxlJztcblxuY29uc3QgbG9vcEludGVydmFsID0gMzAwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBTZW5zb3Ige1xuICBnZXQgc2Vuc29yT3B0aW9uTmFtZSgpIHtcbiAgICByZXR1cm4gJ2FtYmllbnRMaWdodFNlbnNvcic7XG4gIH1cblxuICBnZXQgdGhyZXNob2xkT3B0aW9uKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2RhcmstbW9kZS5hbWJpZW50TGlnaHRUaHJlc2hvbGQnKTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuX2luaXRpYWxpemVTZW5zb3IoKTtcblxuICAgIGlmICh0aGlzLnNlbnNvcikge1xuICAgICAgdGhpcy5zZW5zb3Iuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIGlmICh0aGlzLnNlbnNvcikge1xuICAgICAgdGhpcy5zZW5zb3Iuc3RvcCgpO1xuICAgIH1cbiAgfVxuXG4gIF9pbml0aWFsaXplU2Vuc29yKCkge1xuICAgIHRoaXMuc2Vuc29yID0gbmV3IHdpbmRvdy5BbWJpZW50TGlnaHRTZW5zb3IoKTtcbiAgICB0aGlzLnNlbnNvci5vbnJlYWRpbmcgPSB0aHJvdHRsZSh0aGlzLl9vbkxpZ2h0Q2hhbmdlLmJpbmQodGhpcyksIGxvb3BJbnRlcnZhbCk7XG4gICAgdGhpcy5zZW5zb3Iub25lcnJvciA9IChldmVudCkgPT4gdGhpcy5sb2coZXZlbnQuZXJyb3IubWVzc2FnZSwgJ3dhcm4nKTtcblxuICB9XG5cbiAgX29uTGlnaHRDaGFuZ2UoeyB2YWx1ZSB9KSB7XG4gICAgdmFsdWUgPiB0aGlzLnRocmVzaG9sZE9wdGlvbiA/IHRoaXMuc3dpdGNoVG9MaWdodE1vZGUoKSA6IHRoaXMuc3dpdGNoVG9EYXJrTW9kZSgpO1xuICB9XG59XG4iXX0=