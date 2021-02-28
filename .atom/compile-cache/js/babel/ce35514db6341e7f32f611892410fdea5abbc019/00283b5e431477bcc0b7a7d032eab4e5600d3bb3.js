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

var _electron = require('electron');

'use babel';

var _default = (function (_Sensor) {
  _inherits(_default, _Sensor);

  function _default() {
    _classCallCheck(this, _default);

    _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(_default, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      if (_electron.systemPreferences) {
        this.setCurrentSystemTheme();
        this.subscriptionId = _electron.systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', function () {
          _this.setCurrentSystemTheme();
        });
      } else {
        this.log('Sensor is not supported on this system!', 'warn');
      }
    }
  }, {
    key: 'setCurrentSystemTheme',
    value: function setCurrentSystemTheme() {
      if (_electron.systemPreferences) {
        _electron.systemPreferences.isDarkMode() ? this.switchToDarkMode() : this.switchToLightMode();
      }
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      if (this.subscriptionId && _electron.systemPreferences) {
        _electron.systemPreferences.unsubscribeNotification(this.subscriptionId);
      }
    }
  }, {
    key: 'sensorOptionName',
    get: function get() {
      return 'systemThemeSensor';
    }
  }]);

  return _default;
})(_sensor2['default']);

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvc2Vuc29ycy9zeXN0ZW0tdGhlbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFVBQVU7Ozs7d0JBQ0ssVUFBVTs7QUFINUMsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7O1dBVUYsb0JBQUc7OztBQUNULHVDQUF1QjtBQUNyQixZQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsY0FBYyxHQUFHLDRCQUFrQixxQkFBcUIsQ0FBQyx3Q0FBd0MsRUFBRSxZQUFNO0FBQzVHLGdCQUFLLHFCQUFxQixFQUFFLENBQUM7U0FDOUIsQ0FBQyxDQUFDO09BQ0osTUFBTTtBQUNMLFlBQUksQ0FBQyxHQUFHLENBQUMseUNBQXlDLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDN0Q7S0FDRjs7O1dBRW9CLGlDQUFHO0FBQ3RCLHVDQUF1QjtBQUNyQixvQ0FBa0IsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7T0FDckY7S0FDRjs7O1dBRVMsc0JBQUc7QUFDWCxVQUFJLElBQUksQ0FBQyxjQUFjLCtCQUFxQixFQUFFO0FBQzVDLG9DQUFrQix1QkFBdUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7T0FDaEU7S0FDRjs7O1NBekJtQixlQUFHO0FBQ3JCLGFBQU8sbUJBQW1CLENBQUM7S0FDNUIiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvZGFyay1tb2RlL2xpYi9zZW5zb3JzL3N5c3RlbS10aGVtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgU2Vuc29yIGZyb20gJy4vc2Vuc29yJztcbmltcG9ydCB7IHN5c3RlbVByZWZlcmVuY2VzIH0gZnJvbSAnZWxlY3Ryb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFNlbnNvciB7XG4gIGdldCBzZW5zb3JPcHRpb25OYW1lKCkge1xuICAgIHJldHVybiAnc3lzdGVtVGhlbWVTZW5zb3InO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgaWYgKHN5c3RlbVByZWZlcmVuY2VzKSB7XG4gICAgICB0aGlzLnNldEN1cnJlbnRTeXN0ZW1UaGVtZSgpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25JZCA9IHN5c3RlbVByZWZlcmVuY2VzLnN1YnNjcmliZU5vdGlmaWNhdGlvbignQXBwbGVJbnRlcmZhY2VUaGVtZUNoYW5nZWROb3RpZmljYXRpb24nLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudFN5c3RlbVRoZW1lKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2coJ1NlbnNvciBpcyBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgc3lzdGVtIScsICd3YXJuJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0Q3VycmVudFN5c3RlbVRoZW1lKCkge1xuICAgIGlmIChzeXN0ZW1QcmVmZXJlbmNlcykge1xuICAgICAgc3lzdGVtUHJlZmVyZW5jZXMuaXNEYXJrTW9kZSgpID8gdGhpcy5zd2l0Y2hUb0RhcmtNb2RlKCkgOiB0aGlzLnN3aXRjaFRvTGlnaHRNb2RlKCk7XG4gICAgfVxuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25JZCAmJiBzeXN0ZW1QcmVmZXJlbmNlcykge1xuICAgICAgc3lzdGVtUHJlZmVyZW5jZXMudW5zdWJzY3JpYmVOb3RpZmljYXRpb24odGhpcy5zdWJzY3JpcHRpb25JZCk7XG4gICAgfVxuICB9XG59XG4iXX0=