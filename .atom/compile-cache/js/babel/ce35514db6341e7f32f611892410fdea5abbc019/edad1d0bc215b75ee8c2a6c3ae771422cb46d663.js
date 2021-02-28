Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utilsFindRepoType = require('../utils/find-repo-type');

var _utilsFindRepoType2 = _interopRequireDefault(_utilsFindRepoType);

'use babel';

exports['default'] = function (filePath) {
  var type = (0, _utilsFindRepoType2['default'])(filePath);

  if (!type) {
    return null;
  }

  var providerPath = _path2['default'].join(__dirname, type, 'main.js');

  if (_fs2['default'].existsSync(providerPath)) {
    var Provider = require(providerPath);
    return new Provider(filePath, type);
  }
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9wcm92aWRlci9mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztrQkFFZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7aUNBQ0UseUJBQXlCOzs7O0FBSmxELFdBQVcsQ0FBQTs7cUJBTUksVUFBVSxRQUFRLEVBQUU7QUFDakMsTUFBTSxJQUFJLEdBQUcsb0NBQWEsUUFBUSxDQUFDLENBQUE7O0FBRW5DLE1BQUksQ0FBQyxJQUFJLEVBQUU7QUFBRSxXQUFPLElBQUksQ0FBQTtHQUFFOztBQUUxQixNQUFNLFlBQVksR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQTs7QUFFMUQsTUFBSSxnQkFBRyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDL0IsUUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3RDLFdBQU8sSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO0dBQ3BDO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYmxhbWUvbGliL3Byb3ZpZGVyL2ZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZpbmRSZXBvVHlwZSBmcm9tICcuLi91dGlscy9maW5kLXJlcG8tdHlwZSdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGZpbGVQYXRoKSB7XG4gIGNvbnN0IHR5cGUgPSBmaW5kUmVwb1R5cGUoZmlsZVBhdGgpXG5cbiAgaWYgKCF0eXBlKSB7IHJldHVybiBudWxsIH1cblxuICBjb25zdCBwcm92aWRlclBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCB0eXBlLCAnbWFpbi5qcycpXG5cbiAgaWYgKGZzLmV4aXN0c1N5bmMocHJvdmlkZXJQYXRoKSkge1xuICAgIGNvbnN0IFByb3ZpZGVyID0gcmVxdWlyZShwcm92aWRlclBhdGgpXG4gICAgcmV0dXJuIG5ldyBQcm92aWRlcihmaWxlUGF0aCwgdHlwZSlcbiAgfVxufVxuIl19