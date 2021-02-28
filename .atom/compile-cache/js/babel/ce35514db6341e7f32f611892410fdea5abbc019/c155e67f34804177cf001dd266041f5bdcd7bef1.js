Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * To define a new sensor use following template and create it in `sensors` folder:
 *
 * ```js
 * import Sensor from './sensor';
 *
 * export default class extends Sensor {
 *    get sensorOptionName() {
 *      return 'yourSensorConfigOptionName';
 *    }
 *
 *    activate() {
 *      // activate the sensor
 *    }
 *
 *    deactivate() {
 *      // deactivate the sensor
 *    }
 * }
 * ```
 *
 * Next go to `dark-mode/sensors/index.js` and export a new sensor:
 * ```js
 * import MySuperSensor from './my-super-sensor'
 *
 * export [
 *  AmbientLightSensor,
 *  MySuperSensor
 * ]
 *
 * ```
 */

var _atom = require('atom');

'use babel';
var _default = (function () {
  function _default(darkMode) {
    _classCallCheck(this, _default);

    this.darkMode = darkMode;
    this.subscriptions = new _atom.CompositeDisposable();
    this._registerCallbacks();
  }

  /**
   * @public
   * @override
   * Sensor option name
   */

  _createClass(_default, [{
    key: 'activate',

    /**
     * @public
     * @override
     * This method should activate the sensor (turn on)
     */
    value: function activate() {}

    /**
     * @public
     * @override
     * This method should deactivate the sensor (turn off)
     */
  }, {
    key: 'deactivate',
    value: function deactivate() {}

    /**
     * @public
     */
  }, {
    key: 'switchToLightMode',
    value: function switchToLightMode() {
      this.darkMode.switchToLightMode();
    }

    /**
     * @public
     */
  }, {
    key: 'switchToDarkMode',
    value: function switchToDarkMode() {
      this.darkMode.switchToDarkMode();
    }

    /**
     * @public
     */
  }, {
    key: 'log',
    value: function log(message) {
      var severity = arguments.length <= 1 || arguments[1] === undefined ? 'info' : arguments[1];

      return console[severity]('DarkMode: [' + this.sensorOptionName + '] | ' + message);
    }

    /**
     * @private
     * @override
     */
  }, {
    key: 'activateSensor',
    value: function activateSensor() {
      if (this.isAutoMode && this.isEnabled && !this.isActive) {
        this.activate();
        this._isActive = true;
        this.log('Sensor has been activated');
      }

      return this.isActive;
    }

    /**
     * @private
     */
  }, {
    key: 'deactivateSensor',
    value: function deactivateSensor() {
      if (this.isActive) {
        this.deactivate();
        this._isActive = false;
        this.log('Sensor has been deactivated');
      }

      return !this.isActive;
    }

    /**
     * @private
     */
  }, {
    key: 'disposeCallbacks',
    value: function disposeCallbacks() {
      this.subscriptions.dispose();
    }
  }, {
    key: '_registerCallbacks',
    value: function _registerCallbacks() {
      var _this = this;

      this.subscriptions.add(atom.config.onDidChange('dark-mode.' + this.sensorOptionName, function (_ref) {
        var newValue = _ref.newValue;

        newValue ? _this.activateSensor() : _this.deactivateSensor();
      }));
    }
  }, {
    key: 'sensorOptionName',
    get: function get() {
      return 'autoMode';
    }

    /**
     * @public
     * @protected
     * Returns a config status if a sensor is enabled or not
     * @return {Boolean} sensor config status
     */
  }, {
    key: 'isEnabled',
    get: function get() {
      return atom.config.get('dark-mode.' + this.sensorOptionName);
    }

    /**
     * @public
     * @protected
     * @return {Boolean} auto mode config status
     */
  }, {
    key: 'isAutoMode',
    get: function get() {
      return atom.config.get('dark-mode.autoMode');
    }

    /**
     * @public
     * @protected
     * Status if the sensor is currently activated or not
     * @return {Boolean} sensor status
     */
  }, {
    key: 'isActive',
    get: function get() {
      return this._isActive || false;
    }
  }]);

  return _default;
})();

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvc2Vuc29ycy9zZW5zb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBbUNvQyxNQUFNOztBQW5DMUMsV0FBVyxDQUFDOztBQXNDQyxvQkFBQyxRQUFRLEVBQUU7OztBQUNwQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFFBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0dBQzNCOzs7Ozs7Ozs7Ozs7Ozs7O1dBNkNPLG9CQUFHLEVBQUU7Ozs7Ozs7OztXQU9ILHNCQUFHLEVBQUU7Ozs7Ozs7V0FLRSw2QkFBRztBQUNsQixVQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDbkM7Ozs7Ozs7V0FLZSw0QkFBRztBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7S0FDbEM7Ozs7Ozs7V0FLRSxhQUFDLE9BQU8sRUFBcUI7VUFBbkIsUUFBUSx5REFBRyxNQUFNOztBQUM1QixhQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsaUJBQWUsSUFBSSxDQUFDLGdCQUFnQixZQUFPLE9BQU8sQ0FBRyxDQUFDO0tBQy9FOzs7Ozs7OztXQU1hLDBCQUFHO0FBQ2YsVUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3ZELFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixZQUFJLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7T0FDdkM7O0FBRUQsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCOzs7Ozs7O1dBS2UsNEJBQUc7QUFDakIsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixZQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixZQUFJLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7T0FDekM7O0FBRUQsYUFBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdkI7Ozs7Ozs7V0FLZSw0QkFBRztBQUNqQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzlCOzs7V0FFaUIsOEJBQUc7OztBQUNuQixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsZ0JBQWMsSUFBSSxDQUFDLGdCQUFnQixFQUFJLFVBQUMsSUFBWSxFQUFLO1lBQWYsUUFBUSxHQUFWLElBQVksQ0FBVixRQUFROztBQUM5RixnQkFBUSxHQUFHLE1BQUssY0FBYyxFQUFFLEdBQUcsTUFBSyxnQkFBZ0IsRUFBRSxDQUFDO09BQzVELENBQUMsQ0FBQyxDQUFDO0tBQ0w7OztTQTFHbUIsZUFBRztBQUNyQixhQUFPLFVBQVUsQ0FBQztLQUNuQjs7Ozs7Ozs7OztTQVFZLGVBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxnQkFBYyxJQUFJLENBQUMsZ0JBQWdCLENBQUcsQ0FBQztLQUM5RDs7Ozs7Ozs7O1NBT2EsZUFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUM5Qzs7Ozs7Ozs7OztTQVFXLGVBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDO0tBQ2hDIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvc2Vuc29ycy9zZW5zb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBUbyBkZWZpbmUgYSBuZXcgc2Vuc29yIHVzZSBmb2xsb3dpbmcgdGVtcGxhdGUgYW5kIGNyZWF0ZSBpdCBpbiBgc2Vuc29yc2AgZm9sZGVyOlxuICpcbiAqIGBgYGpzXG4gKiBpbXBvcnQgU2Vuc29yIGZyb20gJy4vc2Vuc29yJztcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFNlbnNvciB7XG4gKiAgICBnZXQgc2Vuc29yT3B0aW9uTmFtZSgpIHtcbiAqICAgICAgcmV0dXJuICd5b3VyU2Vuc29yQ29uZmlnT3B0aW9uTmFtZSc7XG4gKiAgICB9XG4gKlxuICogICAgYWN0aXZhdGUoKSB7XG4gKiAgICAgIC8vIGFjdGl2YXRlIHRoZSBzZW5zb3JcbiAqICAgIH1cbiAqXG4gKiAgICBkZWFjdGl2YXRlKCkge1xuICogICAgICAvLyBkZWFjdGl2YXRlIHRoZSBzZW5zb3JcbiAqICAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIE5leHQgZ28gdG8gYGRhcmstbW9kZS9zZW5zb3JzL2luZGV4LmpzYCBhbmQgZXhwb3J0IGEgbmV3IHNlbnNvcjpcbiAqIGBgYGpzXG4gKiBpbXBvcnQgTXlTdXBlclNlbnNvciBmcm9tICcuL215LXN1cGVyLXNlbnNvcidcbiAqXG4gKiBleHBvcnQgW1xuICogIEFtYmllbnRMaWdodFNlbnNvcixcbiAqICBNeVN1cGVyU2Vuc29yXG4gKiBdXG4gKlxuICogYGBgXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGRhcmtNb2RlKSB7XG4gICAgdGhpcy5kYXJrTW9kZSA9IGRhcmtNb2RlO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJDYWxsYmFja3MoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHVibGljXG4gICAqIEBvdmVycmlkZVxuICAgKiBTZW5zb3Igb3B0aW9uIG5hbWVcbiAgICovXG4gIGdldCBzZW5zb3JPcHRpb25OYW1lKCkge1xuICAgIHJldHVybiAnYXV0b01vZGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwdWJsaWNcbiAgICogQHByb3RlY3RlZFxuICAgKiBSZXR1cm5zIGEgY29uZmlnIHN0YXR1cyBpZiBhIHNlbnNvciBpcyBlbmFibGVkIG9yIG5vdFxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBzZW5zb3IgY29uZmlnIHN0YXR1c1xuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KGBkYXJrLW1vZGUuJHt0aGlzLnNlbnNvck9wdGlvbk5hbWV9YCk7XG4gIH1cblxuICAvKipcbiAgICogQHB1YmxpY1xuICAgKiBAcHJvdGVjdGVkXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGF1dG8gbW9kZSBjb25maWcgc3RhdHVzXG4gICAqL1xuICBnZXQgaXNBdXRvTW9kZSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdkYXJrLW1vZGUuYXV0b01vZGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHVibGljXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogU3RhdHVzIGlmIHRoZSBzZW5zb3IgaXMgY3VycmVudGx5IGFjdGl2YXRlZCBvciBub3RcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gc2Vuc29yIHN0YXR1c1xuICAgKi9cbiAgZ2V0IGlzQWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9pc0FjdGl2ZSB8fCBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHVibGljXG4gICAqIEBvdmVycmlkZVxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYWN0aXZhdGUgdGhlIHNlbnNvciAodHVybiBvbilcbiAgICovXG4gIGFjdGl2YXRlKCkge31cblxuICAvKipcbiAgICogQHB1YmxpY1xuICAgKiBAb3ZlcnJpZGVcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGRlYWN0aXZhdGUgdGhlIHNlbnNvciAodHVybiBvZmYpXG4gICAqL1xuICBkZWFjdGl2YXRlKCkge31cblxuICAvKipcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgc3dpdGNoVG9MaWdodE1vZGUoKSB7XG4gICAgdGhpcy5kYXJrTW9kZS5zd2l0Y2hUb0xpZ2h0TW9kZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN3aXRjaFRvRGFya01vZGUoKSB7XG4gICAgdGhpcy5kYXJrTW9kZS5zd2l0Y2hUb0RhcmtNb2RlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgbG9nKG1lc3NhZ2UsIHNldmVyaXR5ID0gJ2luZm8nKSB7XG4gICAgcmV0dXJuIGNvbnNvbGVbc2V2ZXJpdHldKGBEYXJrTW9kZTogWyR7dGhpcy5zZW5zb3JPcHRpb25OYW1lfV0gfCAke21lc3NhZ2V9YCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQG92ZXJyaWRlXG4gICAqL1xuICBhY3RpdmF0ZVNlbnNvcigpIHtcbiAgICBpZiAodGhpcy5pc0F1dG9Nb2RlICYmIHRoaXMuaXNFbmFibGVkICYmICF0aGlzLmlzQWN0aXZlKSB7XG4gICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLmxvZygnU2Vuc29yIGhhcyBiZWVuIGFjdGl2YXRlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmlzQWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWFjdGl2YXRlU2Vuc29yKCkge1xuICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLmxvZygnU2Vuc29yIGhhcyBiZWVuIGRlYWN0aXZhdGVkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0aGlzLmlzQWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkaXNwb3NlQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICBfcmVnaXN0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShgZGFyay1tb2RlLiR7dGhpcy5zZW5zb3JPcHRpb25OYW1lfWAsICh7IG5ld1ZhbHVlIH0pID0+IHtcbiAgICAgIG5ld1ZhbHVlID8gdGhpcy5hY3RpdmF0ZVNlbnNvcigpIDogdGhpcy5kZWFjdGl2YXRlU2Vuc29yKCk7XG4gICAgfSkpO1xuICB9XG59XG4iXX0=