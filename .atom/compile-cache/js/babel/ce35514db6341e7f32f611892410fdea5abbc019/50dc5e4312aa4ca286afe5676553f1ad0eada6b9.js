Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getBlame;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _gitBlame = require('git-blame');

var _gitBlame2 = _interopRequireDefault(_gitBlame);

var _utilsFindRepo = require('../../utils/find-repo');

var _utilsFindRepo2 = _interopRequireDefault(_utilsFindRepo);

'use babel';

function getBlame(filePath, callback) {
  var repoPath = (0, _utilsFindRepo2['default'])(filePath);
  var basePath = repoPath.replace(/\.git$/, '');
  filePath = filePath.replace(basePath, '');

  var commits = {};
  var lines = [];

  (0, _gitBlame2['default'])(repoPath, {
    file: filePath,
    rev: 'HEAD',
    ignoreWhitespace: atom.config.get('blame.ignoreWhitespace'),
    detectMoved: atom.config.get('blame.detectMoved'),
    detectCopy: atom.config.get('blame.detectCopy')
  }).on('data', function (type, data) {
    if (type === 'commit') {
      commits[data.hash] = data;
    } else {
      lines.push(data);
    }
  }).on('error', function (err) {
    return console.error(filePath, err) || callback(null);
  }).on('end', function () {
    var result = lines.sort(function (a, b) {
      return Number(a.finalLine) - Number(b.finalLine);
    }).reduce(function (result, _ref) {
      var line = _ref.finalLine;
      var rev = _ref.hash;
      var _commits$rev$author = commits[rev].author;
      var name = _commits$rev$author.name;
      var timestamp = _commits$rev$author.timestamp;

      var date = _moment2['default'].unix(timestamp).toISOString();

      result[line] = { author: { name: name }, date: date, line: line, rev: rev };

      return result;
    }, {});

    callback(result);
  });
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9wcm92aWRlci9naXQvZ2V0LWJsYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFNd0IsUUFBUTs7OztzQkFKYixRQUFROzs7O3dCQUNOLFdBQVc7Ozs7NkJBQ1gsdUJBQXVCOzs7O0FBSjVDLFdBQVcsQ0FBQTs7QUFNSSxTQUFTLFFBQVEsQ0FBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQ3BELE1BQU0sUUFBUSxHQUFHLGdDQUFTLFFBQVEsQ0FBQyxDQUFBO0FBQ25DLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQy9DLFVBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFekMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQTs7QUFFaEIsNkJBQVMsUUFBUSxFQUFFO0FBQ2pCLFFBQUksRUFBRSxRQUFRO0FBQ2QsT0FBRyxFQUFFLE1BQU07QUFDWCxvQkFBZ0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQztBQUMzRCxlQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7QUFDakQsY0FBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0dBQ2hELENBQUMsQ0FDQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSSxFQUFFLElBQUksRUFBSztBQUMxQixRQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDckIsYUFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUE7S0FDMUIsTUFBTTtBQUNMLFdBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDakI7R0FDRixDQUFDLENBQ0QsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQUc7V0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDO0dBQUEsQ0FBQyxDQUNwRSxFQUFFLENBQUMsS0FBSyxFQUFFLFlBQU07QUFDZixRQUFNLE1BQU0sR0FBRyxLQUFLLENBQ2pCLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2FBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUFBLENBQUMsQ0FDekQsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLElBQThCLEVBQUs7VUFBdEIsSUFBSSxHQUFqQixJQUE4QixDQUE1QixTQUFTO1VBQWMsR0FBRyxHQUE1QixJQUE4QixDQUFYLElBQUk7Z0NBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUE1QyxNQUFNO1VBQUksSUFBSSx1QkFBSixJQUFJO1VBQUUsU0FBUyx1QkFBVCxTQUFTOztBQUVqQyxVQUFNLElBQUksR0FBRyxvQkFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7O0FBRWpELFlBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxDQUFBOztBQUVwRCxhQUFPLE1BQU0sQ0FBQTtLQUNkLEVBQUUsRUFBRSxDQUFDLENBQUE7O0FBRVIsWUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0dBQ2pCLENBQUMsQ0FBQTtDQUNMIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9wcm92aWRlci9naXQvZ2V0LWJsYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnXG5pbXBvcnQgZ2l0QmxhbWUgZnJvbSAnZ2l0LWJsYW1lJ1xuaW1wb3J0IGZpbmRSZXBvIGZyb20gJy4uLy4uL3V0aWxzL2ZpbmQtcmVwbydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QmxhbWUgKGZpbGVQYXRoLCBjYWxsYmFjaykge1xuICBjb25zdCByZXBvUGF0aCA9IGZpbmRSZXBvKGZpbGVQYXRoKVxuICBjb25zdCBiYXNlUGF0aCA9IHJlcG9QYXRoLnJlcGxhY2UoL1xcLmdpdCQvLCAnJylcbiAgZmlsZVBhdGggPSBmaWxlUGF0aC5yZXBsYWNlKGJhc2VQYXRoLCAnJylcblxuICBjb25zdCBjb21taXRzID0ge31cbiAgY29uc3QgbGluZXMgPSBbXVxuXG4gIGdpdEJsYW1lKHJlcG9QYXRoLCB7XG4gICAgZmlsZTogZmlsZVBhdGgsXG4gICAgcmV2OiAnSEVBRCcsXG4gICAgaWdub3JlV2hpdGVzcGFjZTogYXRvbS5jb25maWcuZ2V0KCdibGFtZS5pZ25vcmVXaGl0ZXNwYWNlJyksXG4gICAgZGV0ZWN0TW92ZWQ6IGF0b20uY29uZmlnLmdldCgnYmxhbWUuZGV0ZWN0TW92ZWQnKSxcbiAgICBkZXRlY3RDb3B5OiBhdG9tLmNvbmZpZy5nZXQoJ2JsYW1lLmRldGVjdENvcHknKVxuICB9KVxuICAgIC5vbignZGF0YScsICh0eXBlLCBkYXRhKSA9PiB7XG4gICAgICBpZiAodHlwZSA9PT0gJ2NvbW1pdCcpIHtcbiAgICAgICAgY29tbWl0c1tkYXRhLmhhc2hdID0gZGF0YVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZXMucHVzaChkYXRhKVxuICAgICAgfVxuICAgIH0pXG4gICAgLm9uKCdlcnJvcicsIChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZmlsZVBhdGgsIGVycikgfHwgY2FsbGJhY2sobnVsbCkpXG4gICAgLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBsaW5lc1xuICAgICAgICAuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEuZmluYWxMaW5lKSAtIE51bWJlcihiLmZpbmFsTGluZSkpXG4gICAgICAgIC5yZWR1Y2UoKHJlc3VsdCwgeyBmaW5hbExpbmU6IGxpbmUsIGhhc2g6IHJldiB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBhdXRob3I6IHsgbmFtZSwgdGltZXN0YW1wIH0gfSA9IGNvbW1pdHNbcmV2XVxuXG4gICAgICAgICAgY29uc3QgZGF0ZSA9IG1vbWVudC51bml4KHRpbWVzdGFtcCkudG9JU09TdHJpbmcoKVxuXG4gICAgICAgICAgcmVzdWx0W2xpbmVdID0geyBhdXRob3I6IHsgbmFtZSB9LCBkYXRlLCBsaW5lLCByZXYgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9LCB7fSlcblxuICAgICAgY2FsbGJhY2socmVzdWx0KVxuICAgIH0pXG59XG4iXX0=