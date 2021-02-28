Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _jsctags = require('jsctags');

var _jsctags2 = _interopRequireDefault(_jsctags);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';
exports['default'] = {

  parseFile: _asyncToGenerator(function* (ctx) {
    ctx.dir = _path2['default'].dirname(ctx.file);
    var self = this,
        tags = yield new Promise(function (resolve) {
      (0, _jsctags2['default'])(ctx, function (e, tags) {
        if (e) console.log(e);
        resolve(self.parseTags(tags));
      });
    });
    return {
      list: tags,
      tree: null
    };
  }),

  parseTags: function parseTags(tags) {
    var res = {};
    for (var i in tags) {
      // jsctags only provides two type of tag kind: "var", "func"
      if ('v' === tags[i].kind) tags[i].kind = 'var';else if ('f' === tags[i].kind) tags[i].kind = 'function';

      res[tags[i].id] = {
        name: tags[i].name,
        type: tags[i].kind,
        lineno: tags[i].lineno,
        // namespace: tags[i].namespace,
        parent: tags[i].namespace ? tags[i].parent : null,
        id: tags[i].id
      };
    }
    return res;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi90YWctZ2VuZXJhdG9ycy9qYXZhc2NyaXB0LXN1Yi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozt1QkFDb0IsU0FBUzs7OztvQkFDWixNQUFNOzs7O0FBRnZCLFdBQVcsQ0FBQztxQkFJRzs7QUFFYixBQUFNLFdBQVMsb0JBQUEsV0FBQyxHQUFHLEVBQUU7QUFDbkIsT0FBRyxDQUFDLEdBQUcsR0FBRyxrQkFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLFFBQU0sSUFBSSxHQUFHLElBQUk7UUFDZixJQUFJLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNsQyxnQ0FBUSxHQUFHLEVBQUUsVUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFLO0FBQ3hCLFlBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsZUFBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztPQUMvQixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7QUFDTCxXQUFPO0FBQ0wsVUFBSSxFQUFFLElBQUk7QUFDVixVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7R0FDSCxDQUFBOztBQUVELFdBQVMsRUFBQSxtQkFBQyxJQUFJLEVBQUU7QUFDZCxRQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixTQUFLLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTs7QUFFbEIsVUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUMxQyxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOztBQUV6RCxTQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ2hCLFlBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtBQUNsQixZQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7QUFDbEIsY0FBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNOztBQUV0QixjQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUk7QUFDakQsVUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO09BQ2YsQ0FBQztLQUNIO0FBQ0QsV0FBTyxHQUFHLENBQUM7R0FDWjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi90YWctZ2VuZXJhdG9ycy9qYXZhc2NyaXB0LXN1Yi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IGpzY3RhZ3MgZnJvbSAnanNjdGFncyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGFzeW5jIHBhcnNlRmlsZShjdHgpIHtcbiAgICBjdHguZGlyID0gcGF0aC5kaXJuYW1lKGN0eC5maWxlKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcyxcbiAgICAgIHRhZ3MgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAganNjdGFncyhjdHgsIChlLCB0YWdzKSA9PiB7XG4gICAgICAgICAgaWYgKGUpIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgIHJlc29sdmUoc2VsZi5wYXJzZVRhZ3ModGFncykpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBsaXN0OiB0YWdzLFxuICAgICAgdHJlZTogbnVsbFxuICAgIH07XG4gIH0sXG5cbiAgcGFyc2VUYWdzKHRhZ3MpIHtcbiAgICBsZXQgcmVzID0ge307XG4gICAgZm9yIChsZXQgaSBpbiB0YWdzKSB7XG4gICAgICAvLyBqc2N0YWdzIG9ubHkgcHJvdmlkZXMgdHdvIHR5cGUgb2YgdGFnIGtpbmQ6IFwidmFyXCIsIFwiZnVuY1wiXG4gICAgICBpZiAoJ3YnID09PSB0YWdzW2ldLmtpbmQpIHRhZ3NbaV0ua2luZCA9ICd2YXInO1xuICAgICAgZWxzZSBpZiAoJ2YnID09PSB0YWdzW2ldLmtpbmQpIHRhZ3NbaV0ua2luZCA9ICdmdW5jdGlvbic7XG5cbiAgICAgIHJlc1t0YWdzW2ldLmlkXSA9IHtcbiAgICAgICAgbmFtZTogdGFnc1tpXS5uYW1lLFxuICAgICAgICB0eXBlOiB0YWdzW2ldLmtpbmQsXG4gICAgICAgIGxpbmVubzogdGFnc1tpXS5saW5lbm8sXG4gICAgICAgIC8vIG5hbWVzcGFjZTogdGFnc1tpXS5uYW1lc3BhY2UsXG4gICAgICAgIHBhcmVudDogdGFnc1tpXS5uYW1lc3BhY2UgPyB0YWdzW2ldLnBhcmVudCA6IG51bGwsXG4gICAgICAgIGlkOiB0YWdzW2ldLmlkXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuIl19