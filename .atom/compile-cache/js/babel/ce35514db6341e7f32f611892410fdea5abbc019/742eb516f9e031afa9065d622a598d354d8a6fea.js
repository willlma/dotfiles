'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = throttle;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function throttle(fn, threshold, scope) {
  threshold = threshold || 250;

  var last = undefined,
      timer = undefined;

  var step = function step(time, args) {
    last = time;
    fn.apply(undefined, _toConsumableArray(args));
  };

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var now = new Date().getTime();

    clearTimeout(timer);

    if (last && now < last + threshold) {
      timer = setTimeout(function () {
        return step(now, args);
      }, threshold);
    } else {
      step(now, args);
    }
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi91dGlscy90aHJvdHRsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7O3FCQUVhLFFBQVE7Ozs7QUFBakIsU0FBUyxRQUFRLENBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7QUFDdEQsV0FBUyxHQUFHLFNBQVMsSUFBSSxHQUFHLENBQUE7O0FBRTVCLE1BQUksSUFBSSxZQUFBO01BQUUsS0FBSyxZQUFBLENBQUE7O0FBRWYsTUFBTSxJQUFJLEdBQUcsU0FBUCxJQUFJLENBQUksSUFBSSxFQUFFLElBQUksRUFBSztBQUMzQixRQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ1gsTUFBRSxxQ0FBSSxJQUFJLEVBQUMsQ0FBQTtHQUNaLENBQUE7O0FBRUQsU0FBTyxZQUFhO3NDQUFULElBQUk7QUFBSixVQUFJOzs7QUFDYixRQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBOztBQUVoQyxnQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBOztBQUVuQixRQUFJLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLFNBQVMsRUFBRTtBQUNsQyxXQUFLLEdBQUcsVUFBVSxDQUFDO2VBQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7T0FBQSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQ3JELE1BQU07QUFDTCxVQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ2hCO0dBQ0YsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi91dGlscy90aHJvdHRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRocm90dGxlIChmbiwgdGhyZXNob2xkLCBzY29wZSkge1xuICB0aHJlc2hvbGQgPSB0aHJlc2hvbGQgfHwgMjUwXG5cbiAgbGV0IGxhc3QsIHRpbWVyXG5cbiAgY29uc3Qgc3RlcCA9ICh0aW1lLCBhcmdzKSA9PiB7XG4gICAgbGFzdCA9IHRpbWVcbiAgICBmbiguLi5hcmdzKVxuICB9XG5cbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKClcblxuICAgIGNsZWFyVGltZW91dCh0aW1lcilcblxuICAgIGlmIChsYXN0ICYmIG5vdyA8IGxhc3QgKyB0aHJlc2hvbGQpIHtcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBzdGVwKG5vdywgYXJncyksIHRocmVzaG9sZClcbiAgICB9IGVsc2Uge1xuICAgICAgc3RlcChub3csIGFyZ3MpXG4gICAgfVxuICB9XG59XG4iXX0=