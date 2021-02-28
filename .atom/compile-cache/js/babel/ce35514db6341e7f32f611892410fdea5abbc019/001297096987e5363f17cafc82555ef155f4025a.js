Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _sensor = require('./sensor');

var _sensor2 = _interopRequireDefault(_sensor);

var _suncalc = require('suncalc');

var _suncalc2 = _interopRequireDefault(_suncalc);

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

'use babel';

var _default = (function (_Sensor) {
  _inherits(_default, _Sensor);

  function _default() {
    _classCallCheck(this, _default);

    _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(_default, [{
    key: 'activate',
    value: _asyncToGenerator(function* () {
      var _this = this;

      yield this._fetchSunTimes();

      if (this.dayAt && this.nightAt) {
        var changeAt = this.currentPhase == 'day' ? this.nightAt : this.dayAt;

        this._setCurrentPhaseTheme();
        this.scheduler = this._callAt(changeAt, function () {
          return _this.activate();
        });
      } else {
        this.log('Could not calculate sun positions', 'warn');
      }
    })
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.scheduler.cancel();
    }
  }, {
    key: '_fetchSunTimes',
    value: function _fetchSunTimes() {
      var _this2 = this;

      return fetch('http://ip-api.com/json?fields=lat,lon').then(function (response) {
        return response.json();
      }).then(function (_ref) {
        var lat = _ref.lat;
        var lon = _ref.lon;

        var day = 1000 * 60 * 60 * 24;
        var now = new Date();
        var tomorrow = new Date(now.getTime() + day);
        var yesterday = new Date(now.getTime() - day);

        var todayTimes = _this2._calculateTimes(now, lat, lon);

        _this2.dayAt = now >= todayTimes.nightAt ? _this2._calculateTimes(tomorrow, lat, lon).dayAt : todayTimes.dayAt;
        _this2.nightAt = now < todayTimes.dayAt ? _this2._calculateTimes(yesterday, lat, lon).nightAt : todayTimes.nightAt;
      });
    }
  }, {
    key: '_calculateTimes',
    value: function _calculateTimes(date, lat, long) {
      var times = _suncalc2['default'].getTimes(date, lat, long);

      return {
        nightAt: times.dusk,
        dayAt: times.sunriseEnd
      };
    }
  }, {
    key: '_setCurrentPhaseTheme',
    value: function _setCurrentPhaseTheme() {
      this.currentPhase == 'day' ? this.switchToLightMode() : this.switchToDarkMode();
    }
  }, {
    key: '_callAt',
    value: function _callAt(date) {
      var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

      var now = new Date();

      if (date && date > now) {
        this.log('Theme change has been schedule at: ' + date);
        return _nodeSchedule2['default'].scheduleJob(date, callback);
      }
    }
  }, {
    key: 'sensorOptionName',
    get: function get() {
      return 'sunSensor';
    }
  }, {
    key: 'currentPhase',
    get: function get() {
      var now = new Date();
      var nightAt = this.nightAt;
      var dayAt = this.dayAt;

      return now >= dayAt && now < nightAt ? 'day' : 'night';
    }
  }]);

  return _default;
})(_sensor2['default']);

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvc2Vuc29ycy9zdW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFFbUIsVUFBVTs7Ozt1QkFDVCxTQUFTOzs7OzRCQUNSLGVBQWU7Ozs7QUFKcEMsV0FBVyxDQUFDOzs7OztBQU9DLHNCQUFHOzs7QUFDWixxRkFBUyxTQUFTLEVBQUU7R0FDckI7Ozs7NkJBYWEsYUFBRzs7O0FBQ2YsWUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRTVCLFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlCLFlBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7QUFFdEUsWUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtpQkFBTSxNQUFLLFFBQVEsRUFBRTtTQUFBLENBQUMsQ0FBQztPQUNoRSxNQUFNO0FBQ0wsWUFBSSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUN2RDtLQUNGOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDekI7OztXQUVhLDBCQUFHOzs7QUFDZixhQUFPLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUNsRCxJQUFJLENBQUMsVUFBQyxRQUFRO2VBQUssUUFBUSxDQUFDLElBQUksRUFBRTtPQUFBLENBQUMsQ0FDbkMsSUFBSSxDQUFDLFVBQUMsSUFBWSxFQUFLO1lBQWYsR0FBRyxHQUFMLElBQVksQ0FBVixHQUFHO1lBQUUsR0FBRyxHQUFWLElBQVksQ0FBTCxHQUFHOztBQUNmLFlBQUksR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUM5QixZQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3JCLFlBQUksUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM3QyxZQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRTlDLFlBQUksVUFBVSxHQUFHLE9BQUssZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXJELGVBQUssS0FBSyxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxHQUFHLE9BQUssZUFBZSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7QUFDM0csZUFBSyxPQUFPLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEdBQUcsT0FBSyxlQUFlLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztPQUNoSCxDQUFDLENBQUM7S0FDTjs7O1dBRWMseUJBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDL0IsVUFBSSxLQUFLLEdBQUcscUJBQVEsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRTlDLGFBQU87QUFDTCxlQUFPLEVBQUUsS0FBSyxDQUFDLElBQUk7QUFDbkIsYUFBSyxFQUFFLEtBQUssQ0FBQyxVQUFVO09BQ3hCLENBQUM7S0FDSDs7O1dBRW9CLGlDQUFHO0FBQ3RCLFVBQUksQ0FBQyxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0tBQ2pGOzs7V0FFTSxpQkFBQyxJQUFJLEVBQXVCO1VBQXJCLFFBQVEseURBQUcsWUFBTSxFQUFFOztBQUMvQixVQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztBQUVyQixVQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxHQUFHLHlDQUF1QyxJQUFJLENBQUcsQ0FBQztBQUN2RCxlQUFPLDBCQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDN0M7S0FDRjs7O1NBaEVtQixlQUFHO0FBQ3JCLGFBQU8sV0FBVyxDQUFDO0tBQ3BCOzs7U0FFZSxlQUFHO0FBQ2pCLFVBQUksR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7VUFDZixPQUFPLEdBQVksSUFBSSxDQUF2QixPQUFPO1VBQUUsS0FBSyxHQUFLLElBQUksQ0FBZCxLQUFLOztBQUVwQixhQUFPLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxHQUFHLE9BQU8sR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO0tBQ3hEIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvc2Vuc29ycy9zdW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFNlbnNvciBmcm9tICcuL3NlbnNvcic7XG5pbXBvcnQgU3VuQ2FsYyBmcm9tICdzdW5jYWxjJztcbmltcG9ydCBzY2hlZHVsZSBmcm9tICdub2RlLXNjaGVkdWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBTZW5zb3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICB9XG5cbiAgZ2V0IHNlbnNvck9wdGlvbk5hbWUoKSB7XG4gICAgcmV0dXJuICdzdW5TZW5zb3InO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQaGFzZSgpIHtcbiAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcbiAgICBsZXQgeyBuaWdodEF0LCBkYXlBdCB9ID0gdGhpcztcblxuICAgIHJldHVybiBub3cgPj0gZGF5QXQgJiYgbm93IDwgbmlnaHRBdCA/ICdkYXknIDogJ25pZ2h0JztcbiAgfVxuXG4gIGFzeW5jIGFjdGl2YXRlKCkge1xuICAgIGF3YWl0IHRoaXMuX2ZldGNoU3VuVGltZXMoKTtcblxuICAgIGlmICh0aGlzLmRheUF0ICYmIHRoaXMubmlnaHRBdCkge1xuICAgICAgbGV0IGNoYW5nZUF0ID0gdGhpcy5jdXJyZW50UGhhc2UgPT0gJ2RheScgPyB0aGlzLm5pZ2h0QXQgOiB0aGlzLmRheUF0O1xuXG4gICAgICB0aGlzLl9zZXRDdXJyZW50UGhhc2VUaGVtZSgpO1xuICAgICAgdGhpcy5zY2hlZHVsZXIgPSB0aGlzLl9jYWxsQXQoY2hhbmdlQXQsICgpID0+IHRoaXMuYWN0aXZhdGUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nKCdDb3VsZCBub3QgY2FsY3VsYXRlIHN1biBwb3NpdGlvbnMnLCAnd2FybicpO1xuICAgIH1cbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zY2hlZHVsZXIuY2FuY2VsKCk7XG4gIH1cblxuICBfZmV0Y2hTdW5UaW1lcygpIHtcbiAgICByZXR1cm4gZmV0Y2goJ2h0dHA6Ly9pcC1hcGkuY29tL2pzb24/ZmllbGRzPWxhdCxsb24nKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbigoeyBsYXQsIGxvbiB9KSA9PiB7XG4gICAgICAgIGxldCBkYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICAgICAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgbGV0IHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIGRheSk7XG4gICAgICAgIGxldCB5ZXN0ZXJkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gZGF5KTtcblxuICAgICAgICBsZXQgdG9kYXlUaW1lcyA9IHRoaXMuX2NhbGN1bGF0ZVRpbWVzKG5vdywgbGF0LCBsb24pO1xuXG4gICAgICAgIHRoaXMuZGF5QXQgPSBub3cgPj0gdG9kYXlUaW1lcy5uaWdodEF0ID8gdGhpcy5fY2FsY3VsYXRlVGltZXModG9tb3Jyb3csIGxhdCwgbG9uKS5kYXlBdCA6IHRvZGF5VGltZXMuZGF5QXQ7XG4gICAgICAgIHRoaXMubmlnaHRBdCA9IG5vdyA8IHRvZGF5VGltZXMuZGF5QXQgPyB0aGlzLl9jYWxjdWxhdGVUaW1lcyh5ZXN0ZXJkYXksIGxhdCwgbG9uKS5uaWdodEF0IDogdG9kYXlUaW1lcy5uaWdodEF0O1xuICAgICAgfSk7XG4gIH1cblxuICBfY2FsY3VsYXRlVGltZXMoZGF0ZSwgbGF0LCBsb25nKSB7XG4gICAgbGV0IHRpbWVzID0gU3VuQ2FsYy5nZXRUaW1lcyhkYXRlLCBsYXQsIGxvbmcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5pZ2h0QXQ6IHRpbWVzLmR1c2ssXG4gICAgICBkYXlBdDogdGltZXMuc3VucmlzZUVuZFxuICAgIH07XG4gIH1cblxuICBfc2V0Q3VycmVudFBoYXNlVGhlbWUoKSB7XG4gICAgdGhpcy5jdXJyZW50UGhhc2UgPT0gJ2RheScgPyB0aGlzLnN3aXRjaFRvTGlnaHRNb2RlKCkgOiB0aGlzLnN3aXRjaFRvRGFya01vZGUoKTtcbiAgfVxuXG4gIF9jYWxsQXQoZGF0ZSwgY2FsbGJhY2sgPSAoKSA9PiB7fSkge1xuICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuXG4gICAgaWYgKGRhdGUgJiYgZGF0ZSA+IG5vdykge1xuICAgICAgdGhpcy5sb2coYFRoZW1lIGNoYW5nZSBoYXMgYmVlbiBzY2hlZHVsZSBhdDogJHtkYXRlfWApO1xuICAgICAgcmV0dXJuIHNjaGVkdWxlLnNjaGVkdWxlSm9iKGRhdGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==