function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

function findRepo(currentPath) {
  var lastPath = undefined;
  while (currentPath && lastPath !== currentPath) {
    lastPath = currentPath;
    currentPath = _path2['default'].dirname(currentPath);

    var repoPath = _path2['default'].join(currentPath, '.git');

    if (_fs2['default'].existsSync(repoPath)) {
      return repoPath;
    }
  }

  return null;
}

module.exports = findRepo;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi91dGlscy9maW5kLXJlcG8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0JBRWlCLE1BQU07Ozs7a0JBQ1IsSUFBSTs7OztBQUhuQixXQUFXLENBQUE7O0FBS1gsU0FBUyxRQUFRLENBQUUsV0FBVyxFQUFFO0FBQzlCLE1BQUksUUFBUSxZQUFBLENBQUE7QUFDWixTQUFPLFdBQVcsSUFBSSxRQUFRLEtBQUssV0FBVyxFQUFFO0FBQzlDLFlBQVEsR0FBRyxXQUFXLENBQUE7QUFDdEIsZUFBVyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFdkMsUUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQTs7QUFFL0MsUUFBSSxnQkFBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDM0IsYUFBTyxRQUFRLENBQUE7S0FDaEI7R0FDRjs7QUFFRCxTQUFPLElBQUksQ0FBQTtDQUNaOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi91dGlscy9maW5kLXJlcG8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5mdW5jdGlvbiBmaW5kUmVwbyAoY3VycmVudFBhdGgpIHtcbiAgbGV0IGxhc3RQYXRoXG4gIHdoaWxlIChjdXJyZW50UGF0aCAmJiBsYXN0UGF0aCAhPT0gY3VycmVudFBhdGgpIHtcbiAgICBsYXN0UGF0aCA9IGN1cnJlbnRQYXRoXG4gICAgY3VycmVudFBhdGggPSBwYXRoLmRpcm5hbWUoY3VycmVudFBhdGgpXG5cbiAgICBjb25zdCByZXBvUGF0aCA9IHBhdGguam9pbihjdXJyZW50UGF0aCwgJy5naXQnKVxuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocmVwb1BhdGgpKSB7XG4gICAgICByZXR1cm4gcmVwb1BhdGhcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRSZXBvXG4iXX0=