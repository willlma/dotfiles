'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var theCommand = Symbol('theCommand');
var isDisableWhenNoConfigFile = Symbol('isDisableWhenNoConfigFile');
var isUseBundler = Symbol('isUseBundler');
var baseCommand = Symbol('baseCommand');

var buildBaseCommand = Symbol('buildBaseCommand');

var BUNDLE_EXEC_CMD = 'bundle exec';

var DEFAULT_ARGS = ['--force-exclusion', '--format', 'json', '--display-style-guide', '--cache', 'false'];

var Config = (function () {
  function Config(_ref) {
    var command = _ref.command;
    var disableWhenNoConfigFile = _ref.disableWhenNoConfigFile;
    var useBundler = _ref.useBundler;

    _classCallCheck(this, Config);

    this[theCommand] = command;
    this[isDisableWhenNoConfigFile] = disableWhenNoConfigFile;
    this[isUseBundler] = useBundler;
    this[baseCommand] = this[buildBaseCommand]();
  }

  _createClass(Config, [{
    key: buildBaseCommand,
    value: function value() {
      var cmd = undefined;
      if (this[isUseBundler]) {
        cmd = BUNDLE_EXEC_CMD + ' ' + this[theCommand];
      } else if (this[theCommand].length !== 0) {
        cmd = this[theCommand];
      }

      return cmd.split(/\s+/).filter(function (i) {
        return i;
      }).concat(DEFAULT_ARGS);
    }
  }, {
    key: 'command',
    get: function get() {
      return this[theCommand];
    },
    set: function set(value) {
      this[theCommand] = value;
    }
  }, {
    key: 'disableWhenNoConfigFile',
    get: function get() {
      return this[isDisableWhenNoConfigFile];
    },
    set: function set(value) {
      this[isDisableWhenNoConfigFile] = value;
    }
  }, {
    key: 'useBundler',
    get: function get() {
      return this[isUseBundler];
    },
    set: function set(value) {
      this[isUseBundler] = value;
    }
  }, {
    key: 'baseCommand',
    get: function get() {
      return this[baseCommand];
    }
  }]);

  return Config;
})();

module.exports = Config;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWJvY29wL0NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7OztBQUVYLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN2QyxJQUFNLHlCQUF5QixHQUFHLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0FBQ3JFLElBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUMzQyxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7O0FBRXpDLElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUE7O0FBRW5ELElBQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQTs7QUFFckMsSUFBTSxZQUFZLEdBQUcsQ0FDbkIsbUJBQW1CLEVBQ25CLFVBQVUsRUFBRSxNQUFNLEVBQ2xCLHVCQUF1QixFQUN2QixTQUFTLEVBQUUsT0FBTyxDQUNuQixDQUFBOztJQUVLLE1BQU07QUFDQyxXQURQLE1BQU0sQ0FDRSxJQUFnRCxFQUFFO1FBQWhELE9BQU8sR0FBVCxJQUFnRCxDQUE5QyxPQUFPO1FBQUUsdUJBQXVCLEdBQWxDLElBQWdELENBQXJDLHVCQUF1QjtRQUFFLFVBQVUsR0FBOUMsSUFBZ0QsQ0FBWixVQUFVOzswQkFEdEQsTUFBTTs7QUFFUixRQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFBO0FBQzFCLFFBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLHVCQUF1QixDQUFBO0FBQ3pELFFBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxVQUFVLENBQUE7QUFDL0IsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUE7R0FDN0M7O2VBTkcsTUFBTTtTQW9DVCxnQkFBZ0I7V0FBQyxpQkFBRztBQUNuQixVQUFJLEdBQUcsWUFBQSxDQUFBO0FBQ1AsVUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDdEIsV0FBRyxHQUFNLGVBQWUsU0FBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEFBQUUsQ0FBQTtPQUMvQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDeEMsV0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUN2Qjs7QUFFRCxhQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQ3BCLE1BQU0sQ0FBQyxVQUFDLENBQUM7ZUFBSyxDQUFDO09BQUEsQ0FBQyxDQUNoQixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDeEI7OztTQXZDVSxlQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDeEI7U0FFVSxhQUFDLEtBQUssRUFBRTtBQUNqQixVQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxDQUFBO0tBQ3pCOzs7U0FFMEIsZUFBRztBQUM1QixhQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0tBQ3ZDO1NBRTBCLGFBQUMsS0FBSyxFQUFFO0FBQ2pDLFVBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLEtBQUssQ0FBQTtLQUN4Qzs7O1NBRWEsZUFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0tBQzFCO1NBRWEsYUFBQyxLQUFLLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQTtLQUMzQjs7O1NBRWMsZUFBRztBQUNoQixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtLQUN6Qjs7O1NBbENHLE1BQU07OztBQWtEWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVib2NvcC9zcmMvcnVib2NvcC9Db25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCB0aGVDb21tYW5kID0gU3ltYm9sKCd0aGVDb21tYW5kJylcbmNvbnN0IGlzRGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUgPSBTeW1ib2woJ2lzRGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUnKVxuY29uc3QgaXNVc2VCdW5kbGVyID0gU3ltYm9sKCdpc1VzZUJ1bmRsZXInKVxuY29uc3QgYmFzZUNvbW1hbmQgPSBTeW1ib2woJ2Jhc2VDb21tYW5kJylcblxuY29uc3QgYnVpbGRCYXNlQ29tbWFuZCA9IFN5bWJvbCgnYnVpbGRCYXNlQ29tbWFuZCcpXG5cbmNvbnN0IEJVTkRMRV9FWEVDX0NNRCA9ICdidW5kbGUgZXhlYydcblxuY29uc3QgREVGQVVMVF9BUkdTID0gW1xuICAnLS1mb3JjZS1leGNsdXNpb24nLFxuICAnLS1mb3JtYXQnLCAnanNvbicsXG4gICctLWRpc3BsYXktc3R5bGUtZ3VpZGUnLFxuICAnLS1jYWNoZScsICdmYWxzZScsXG5dXG5cbmNsYXNzIENvbmZpZyB7XG4gIGNvbnN0cnVjdG9yKHsgY29tbWFuZCwgZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUsIHVzZUJ1bmRsZXIgfSkge1xuICAgIHRoaXNbdGhlQ29tbWFuZF0gPSBjb21tYW5kXG4gICAgdGhpc1tpc0Rpc2FibGVXaGVuTm9Db25maWdGaWxlXSA9IGRpc2FibGVXaGVuTm9Db25maWdGaWxlXG4gICAgdGhpc1tpc1VzZUJ1bmRsZXJdID0gdXNlQnVuZGxlclxuICAgIHRoaXNbYmFzZUNvbW1hbmRdID0gdGhpc1tidWlsZEJhc2VDb21tYW5kXSgpXG4gIH1cblxuICBnZXQgY29tbWFuZCgpIHtcbiAgICByZXR1cm4gdGhpc1t0aGVDb21tYW5kXVxuICB9XG5cbiAgc2V0IGNvbW1hbmQodmFsdWUpIHtcbiAgICB0aGlzW3RoZUNvbW1hbmRdID0gdmFsdWVcbiAgfVxuXG4gIGdldCBkaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSgpIHtcbiAgICByZXR1cm4gdGhpc1tpc0Rpc2FibGVXaGVuTm9Db25maWdGaWxlXVxuICB9XG5cbiAgc2V0IGRpc2FibGVXaGVuTm9Db25maWdGaWxlKHZhbHVlKSB7XG4gICAgdGhpc1tpc0Rpc2FibGVXaGVuTm9Db25maWdGaWxlXSA9IHZhbHVlXG4gIH1cblxuICBnZXQgdXNlQnVuZGxlcigpIHtcbiAgICByZXR1cm4gdGhpc1tpc1VzZUJ1bmRsZXJdXG4gIH1cblxuICBzZXQgdXNlQnVuZGxlcih2YWx1ZSkge1xuICAgIHRoaXNbaXNVc2VCdW5kbGVyXSA9IHZhbHVlXG4gIH1cblxuICBnZXQgYmFzZUNvbW1hbmQoKSB7XG4gICAgcmV0dXJuIHRoaXNbYmFzZUNvbW1hbmRdXG4gIH1cblxuICBbYnVpbGRCYXNlQ29tbWFuZF0oKSB7XG4gICAgbGV0IGNtZFxuICAgIGlmICh0aGlzW2lzVXNlQnVuZGxlcl0pIHtcbiAgICAgIGNtZCA9IGAke0JVTkRMRV9FWEVDX0NNRH0gJHt0aGlzW3RoZUNvbW1hbmRdfWBcbiAgICB9IGVsc2UgaWYgKHRoaXNbdGhlQ29tbWFuZF0ubGVuZ3RoICE9PSAwKSB7XG4gICAgICBjbWQgPSB0aGlzW3RoZUNvbW1hbmRdXG4gICAgfVxuXG4gICAgcmV0dXJuIGNtZC5zcGxpdCgvXFxzKy8pXG4gICAgICAuZmlsdGVyKChpKSA9PiBpKVxuICAgICAgLmNvbmNhdChERUZBVUxUX0FSR1MpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdcbiJdfQ==