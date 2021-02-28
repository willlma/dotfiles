function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utilsPickForPath = require('../../utils/pick-for-path');

var _utilsPickForPath2 = _interopRequireDefault(_utilsPickForPath);

'use babel';

module.exports = function findRepo(filePath) {
  return (0, _utilsPickForPath2['default'])(filePath, function (currentPath) {
    var repoPath = _path2['default'].join(currentPath, '.git');

    if (_fs2['default'].existsSync(repoPath)) {
      return repoPath;
    }
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9wcm92aWRlci9naXQvZmluZC1yZXBvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O29CQUVpQixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7Z0NBQ0ssMkJBQTJCOzs7O0FBSm5ELFdBQVcsQ0FBQTs7QUFNWCxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsUUFBUSxDQUFFLFFBQVEsRUFBRTtBQUM1QyxTQUFPLG1DQUFZLFFBQVEsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUM1QyxRQUFJLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFBOztBQUU3QyxRQUFJLGdCQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMzQixhQUFPLFFBQVEsQ0FBQTtLQUNoQjtHQUNGLENBQUMsQ0FBQTtDQUNILENBQUEiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYmxhbWUvbGliL3Byb3ZpZGVyL2dpdC9maW5kLXJlcG8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBpY2tGb3JQYXRoIGZyb20gJy4uLy4uL3V0aWxzL3BpY2stZm9yLXBhdGgnXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluZFJlcG8gKGZpbGVQYXRoKSB7XG4gIHJldHVybiBwaWNrRm9yUGF0aChmaWxlUGF0aCwgKGN1cnJlbnRQYXRoKSA9PiB7XG4gICAgbGV0IHJlcG9QYXRoID0gcGF0aC5qb2luKGN1cnJlbnRQYXRoLCAnLmdpdCcpXG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhyZXBvUGF0aCkpIHtcbiAgICAgIHJldHVybiByZXBvUGF0aFxuICAgIH1cbiAgfSlcbn1cbiJdfQ==