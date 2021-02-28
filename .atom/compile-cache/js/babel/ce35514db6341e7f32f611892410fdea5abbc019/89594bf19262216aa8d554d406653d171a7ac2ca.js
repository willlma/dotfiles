Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _atom = require('atom');

var _sensors = require('./sensors');

var _sensors2 = _interopRequireDefault(_sensors);

'use babel';

var notificationsOptions = { icon: 'light-bulb' };

exports['default'] = Object.defineProperties({
  config: _config2['default'],
  subscriptions: null,

  activate: function activate() {
    this.subscriptions = new _atom.CompositeDisposable();

    this._registerCommands();
    this._registerCallbacks();
    this._setSensorsState(this.autoModeOption);
    this._startupNotification();
  },

  deactivate: function deactivate() {
    this._setSensorsState(false);
    this._disposeCallbacks();
  },

  switchToLightMode: function switchToLightMode() {
    if (this.currentTheme != this.lightTheme) {
      this._changeTheme(this.lightTheme);
      atom.notifications.addSuccess('Dark Mode: Theme has been changed automatically', notificationsOptions);
    }
  },

  switchToDarkMode: function switchToDarkMode() {
    if (this.currentTheme != this.darkTheme) {
      this._changeTheme(this.darkTheme);
      atom.notifications.addSuccess('Dark Mode: Theme has been changed automatically', notificationsOptions);
    }
  },

  _registerCommands: function _registerCommands() {
    var _this = this;

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dark-mode:toggle': function darkModeToggle() {
        return _this._toggle();
      },
      'dark-mode:Turn On Auto Mode': function darkModeTurnOnAutoMode() {
        return atom.config.set('dark-mode.autoMode', true);
      },
      'dark-mode:Turn Off Auto Mode': function darkModeTurnOffAutoMode() {
        return atom.config.set('dark-mode.autoMode', false);
      }
    }));
  },

  _registerCallbacks: function _registerCallbacks() {
    var _this2 = this;

    this.subscriptions.add(atom.config.onDidChange('dark-mode.autoMode', function (_ref) {
      var newValue = _ref.newValue;

      _this2._setSensorsState(newValue);
      atom.notifications.addInfo('Dark Mode: Automatic mode is ' + (newValue ? 'ON' : 'OFF'), notificationsOptions);
    }));
  },

  _initializeSensors: function _initializeSensors() {
    var _this3 = this;

    return this._sensors = _sensors2['default'].map(function (Sensor) {
      return new Sensor(_this3);
    });
  },

  _setSensorsState: function _setSensorsState(state) {
    this.sensors.forEach(function (sensor) {
      return state ? sensor.activateSensor() : sensor.deactivateSensor();
    });
  },

  _disposeCallbacks: function _disposeCallbacks() {
    this.sensors.forEach(function (sensor) {
      return sensor.disposeCallbacks();
    });
    this.subscriptions.dispose();
  },

  _toggle: function _toggle() {
    atom.config.set('dark-mode.autoMode', false);
    return this._changeTheme(this.contrastTheme);
  },

  _changeTheme: function _changeTheme() {
    var theme = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    atom.config.set('core.themes', theme.split(' '));
  },

  _startupNotification: function _startupNotification() {
    atom.notifications.addInfo('Dark Mode: Automatic mode is ' + (this.autoModeOption ? 'ON' : 'OFF'), {
      icon: 'light-bulb',
      buttons: [{
        text: this.autoModeOption ? 'Disable' : 'Enable',
        onDidClick: function onDidClick() {
          atom.config.set('dark-mode.autoMode', !this.autoModeOption);
        }
      }]
    });
  }
}, {
  sensors: {
    get: function get() {
      return this._sensors || this._initializeSensors();
    },
    configurable: true,
    enumerable: true
  },
  lightTheme: {
    get: function get() {
      return atom.config.get('dark-mode.lightProfile');
    },
    configurable: true,
    enumerable: true
  },
  darkTheme: {
    get: function get() {
      return atom.config.get('dark-mode.darkProfile');
    },
    configurable: true,
    enumerable: true
  },
  currentTheme: {
    get: function get() {
      return atom.config.get('core.themes').join(' ');
    },
    configurable: true,
    enumerable: true
  },
  contrastTheme: {
    get: function get() {
      return this.currentTheme == this.darkTheme ? this.lightTheme : this.darkTheme;
    },
    configurable: true,
    enumerable: true
  },
  autoModeOption: {
    get: function get() {
      return atom.config.get('dark-mode.autoMode');
    },
    configurable: true,
    enumerable: true
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvZGFyay1tb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFFbUIsVUFBVTs7OztvQkFDTyxNQUFNOzt1QkFDdEIsV0FBVzs7OztBQUovQixXQUFXLENBQUM7O0FBTVosSUFBTSxvQkFBb0IsR0FBRyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs7NkNBRXJDO0FBQ2IsUUFBTSxxQkFBUTtBQUNkLGVBQWEsRUFBRSxJQUFJOztBQTBCbkIsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7QUFFL0MsUUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDekIsUUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMzQyxRQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztHQUM3Qjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0IsUUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7R0FDMUI7O0FBRUQsbUJBQWlCLEVBQUEsNkJBQUc7QUFDbEIsUUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDeEMsVUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsaURBQWlELEVBQUUsb0JBQW9CLENBQUMsQ0FBQztLQUN4RztHQUNGOztBQUVELGtCQUFnQixFQUFBLDRCQUFHO0FBQ2pCLFFBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ3ZDLFVBQUksQ0FBQyxZQUFZLENBQUMs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O0NBQ0Y7QUFwR0ssU0FBTztTQUFBLGVBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7S0FDbkQ7Ozs7QUFFRyxZQUFVO1NBQUEsZUFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUNsRDs7OztBQUVHLFdBQVM7U0FBQSxlQUFHO0FBQ2QsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQ2pEOzs7O0FBRUcsY0FBWTtTQUFBLGVBQUc7QUFDakIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakQ7Ozs7QUFFRyxlQUFhO1NBQUEsZUFBRztBQUNsQixhQUFRLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUU7S0FDakY7Ozs7QUFFRyxnQkFBYztTQUFBLGVBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzlDIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvZGFyay1tb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBDb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHNlbnNvcnMgZnJvbSAnLi9zZW5zb3JzJztcblxuY29uc3Qgbm90aWZpY2F0aW9uc09wdGlvbnMgPSB7IGljb246ICdsaWdodC1idWxiJyB9O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzogQ29uZmlnLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGdldCBzZW5zb3JzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZW5zb3JzIHx8IHRoaXMuX2luaXRpYWxpemVTZW5zb3JzKCk7XG4gIH0sXG5cbiAgZ2V0IGxpZ2h0VGhlbWUoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnZGFyay1tb2RlLmxpZ2h0UHJvZmlsZScpO1xuICB9LFxuXG4gIGdldCBkYXJrVGhlbWUoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnZGFyay1tb2RlLmRhcmtQcm9maWxlJyk7XG4gIH0sXG5cbiAgZ2V0IGN1cnJlbnRUaGVtZSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdjb3JlLnRoZW1lcycpLmpvaW4oJyAnKTtcbiAgfSxcblxuICBnZXQgY29udHJhc3RUaGVtZSgpIHtcbiAgICByZXR1cm4gKHRoaXMuY3VycmVudFRoZW1lID09IHRoaXMuZGFya1RoZW1lID8gdGhpcy5saWdodFRoZW1lIDogdGhpcy5kYXJrVGhlbWUpO1xuICB9LFxuXG4gIGdldCBhdXRvTW9kZU9wdGlvbigpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdkYXJrLW1vZGUuYXV0b01vZGUnKTtcbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5fcmVnaXN0ZXJDb21tYW5kcygpO1xuICAgIHRoaXMuX3JlZ2lzdGVyQ2FsbGJhY2tzKCk7XG4gICAgdGhpcy5fc2V0U2Vuc29yc1N0YXRlKHRoaXMuYXV0b01vZGVPcHRpb24pO1xuICAgIHRoaXMuX3N0YXJ0dXBOb3RpZmljYXRpb24oKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuX3NldFNlbnNvcnNTdGF0ZShmYWxzZSk7XG4gICAgdGhpcy5fZGlzcG9zZUNhbGxiYWNrcygpO1xuICB9LFxuXG4gIHN3aXRjaFRvTGlnaHRNb2RlKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRUaGVtZSAhPSB0aGlzLmxpZ2h0VGhlbWUpIHtcbiAgICAgIHRoaXMuX2NoYW5nZVRoZW1lKHRoaXMubGlnaHRUaGVtZSk7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnRGFyayBNb2RlOiBUaGVtZSBoYXMgYmVlbiBjaGFuZ2VkIGF1dG9tYXRpY2FsbHknLCBub3RpZmljYXRpb25zT3B0aW9ucyk7XG4gICAgfVxuICB9LFxuXG4gIHN3aXRjaFRvRGFya01vZGUoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFRoZW1lICE9IHRoaXMuZGFya1RoZW1lKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VUaGVtZSh0aGlzLmRhcmtUaGVtZSk7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnRGFyayBNb2RlOiBUaGVtZSBoYXMgYmVlbiBjaGFuZ2VkIGF1dG9tYXRpY2FsbHknLCBub3RpZmljYXRpb25zT3B0aW9ucyk7XG4gICAgfVxuICB9LFxuXG4gIF9yZWdpc3RlckNvbW1hbmRzKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2RhcmstbW9kZTp0b2dnbGUnOiAoKSA9PiB0aGlzLl90b2dnbGUoKSxcbiAgICAgICdkYXJrLW1vZGU6VHVybiBPbiBBdXRvIE1vZGUnOiAoKSA9PiBhdG9tLmNvbmZpZy5zZXQoJ2RhcmstbW9kZS5hdXRvTW9kZScsIHRydWUpLFxuICAgICAgJ2RhcmstbW9kZTpUdXJuIE9mZiBBdXRvIE1vZGUnOiAoKSA9PiBhdG9tLmNvbmZpZy5zZXQoJ2RhcmstbW9kZS5hdXRvTW9kZScsIGZhbHNlKVxuICAgIH0pKTtcbiAgfSxcblxuICBfcmVnaXN0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnZGFyay1tb2RlLmF1dG9Nb2RlJywgKHsgbmV3VmFsdWUgfSkgPT4ge1xuICAgICAgdGhpcy5fc2V0U2Vuc29yc1N0YXRlKG5ld1ZhbHVlKTtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKGBEYXJrIE1vZGU6IEF1dG9tYXRpYyBtb2RlIGlzICR7bmV3VmFsdWUgPyAnT04nIDogJ09GRid9YCwgbm90aWZpY2F0aW9uc09wdGlvbnMpO1xuICAgIH0pKTtcbiAgfSxcblxuICBfaW5pdGlhbGl6ZVNlbnNvcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbnNvcnMgPSBzZW5zb3JzLm1hcCgoU2Vuc29yKSA9PiBuZXcgU2Vuc29yKHRoaXMpKTtcbiAgfSxcblxuICBfc2V0U2Vuc29yc1N0YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5zZW5zb3JzLmZvckVhY2goKHNlbnNvcikgPT4gc3RhdGUgPyBzZW5zb3IuYWN0aXZhdGVTZW5zb3IoKSA6IHNlbnNvci5kZWFjdGl2YXRlU2Vuc29yKCkpO1xuICB9LFxuXG4gIF9kaXNwb3NlQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuc2Vuc29ycy5mb3JFYWNoKChzZW5zb3IpID0+IHNlbnNvci5kaXNwb3NlQ2FsbGJhY2tzKCkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgX3RvZ2dsZSgpIHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2RhcmstbW9kZS5hdXRvTW9kZScsIGZhbHNlKTtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlVGhlbWUodGhpcy5jb250cmFzdFRoZW1lKTtcbiAgfSxcblxuICBfY2hhbmdlVGhlbWUodGhlbWUgPSAnJykge1xuICAgIGF0b20uY29uZmlnLnNldCgnY29yZS50aGVtZXMnLCB0aGVtZS5zcGxpdCgnICcpKTtcbiAgfSxcblxuICBfc3RhcnR1cE5vdGlmaWNhdGlvbigpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhgRGFyayBNb2RlOiBBdXRvbWF0aWMgbW9kZSBpcyAke3RoaXMuYXV0b01vZGVPcHRpb24gPyAnT04nIDogJ09GRid9YCwge1xuICAgICAgaWNvbjogJ2xpZ2h0LWJ1bGInLFxuICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgdGV4dDogdGhpcy5hdXRvTW9kZU9wdGlvbiA/ICdEaXNhYmxlJyA6ICdFbmFibGUnLFxuICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnZGFyay1tb2RlLmF1dG9Nb2RlJywgIXRoaXMuYXV0b01vZGVPcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9XVxuICAgIH0pO1xuICB9XG59O1xuIl19