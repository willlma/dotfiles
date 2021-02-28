function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gitWrapper = require('git-wrapper');

var _gitWrapper2 = _interopRequireDefault(_gitWrapper);

var _findRepo = require('./find-repo');

var _findRepo2 = _interopRequireDefault(_findRepo);

var _utilsCommitCache = require('../../utils/commit-cache');

var _utilsCommitCache2 = _interopRequireDefault(_utilsCommitCache);

'use babel';

var cache = new _utilsCommitCache2['default']();

var showOpts = {
  s: true,
  format: '%ae%n%an%n%ce%n%cn%n%B'
};

function getCommitMessage(file, hash, callback) {
  var repoPath = (0, _findRepo2['default'])(file);

  if (!repoPath) {
    return;
  }

  var git = new _gitWrapper2['default']({ 'git-dir': repoPath });
  git.exec('show', showOpts, [hash], function (error, msg) {
    if (error) {
      return;
    }
    callback(msg);
  });
}

function getCommit(file, hash, callback) {
  var cached = cache.get(file, hash);

  if (cached) {
    return callback(cached);
  }

  getCommitMessage(file, hash, function (msg) {
    var lines = msg.split(/\n/g);

    var commit = {
      author: { email: lines.shift(), name: lines.shift() },
      committer: { email: lines.shift(), name: lines.shift() },
      subject: lines.shift(),
      message: lines.join('\n').replace(/(^\s+|\s+$)/, '')
    };

    cache.set(file, hash, commit);

    callback(commit);
  });
}

module.exports = getCommit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9wcm92aWRlci9naXQvZ2V0LWNvbW1pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzswQkFFZ0IsYUFBYTs7Ozt3QkFDUixhQUFhOzs7O2dDQUNWLDBCQUEwQjs7OztBQUpsRCxXQUFXLENBQUE7O0FBTVgsSUFBTSxLQUFLLEdBQUcsbUNBQWlCLENBQUE7O0FBRS9CLElBQU0sUUFBUSxHQUFHO0FBQ2YsR0FBQyxFQUFFLElBQUk7QUFDUCxRQUFNLEVBQUUsd0JBQXdCO0NBQ2pDLENBQUE7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUMvQyxNQUFNLFFBQVEsR0FBRywyQkFBUyxJQUFJLENBQUMsQ0FBQTs7QUFFL0IsTUFBSSxDQUFDLFFBQVEsRUFBRTtBQUFFLFdBQU07R0FBRTs7QUFFekIsTUFBTSxHQUFHLEdBQUcsNEJBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUM1QyxLQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBRSxJQUFJLENBQUUsRUFBRSxVQUFDLEtBQUssRUFBRSxHQUFHLEVBQUs7QUFDbkQsUUFBSSxLQUFLLEVBQUU7QUFBRSxhQUFNO0tBQUU7QUFDckIsWUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0dBQ2QsQ0FBQyxDQUFBO0NBQ0g7O0FBRUQsU0FBUyxTQUFTLENBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDeEMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7O0FBRXBDLE1BQUksTUFBTSxFQUFFO0FBQUUsV0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7R0FBRTs7QUFFdkMsa0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBSztBQUNwQyxRQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBOztBQUU5QixRQUFNLE1BQU0sR0FBRztBQUNiLFlBQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRTtBQUNyRCxlQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUU7QUFDeEQsYUFBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDdEIsYUFBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUM7S0FDckQsQ0FBQTs7QUFFRCxTQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7O0FBRTdCLFlBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUNqQixDQUFDLENBQUE7Q0FDSDs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvcHJvdmlkZXIvZ2l0L2dldC1jb21taXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgR2l0IGZyb20gJ2dpdC13cmFwcGVyJ1xuaW1wb3J0IGZpbmRSZXBvIGZyb20gJy4vZmluZC1yZXBvJ1xuaW1wb3J0IENvbW1pdENhY2hlIGZyb20gJy4uLy4uL3V0aWxzL2NvbW1pdC1jYWNoZSdcblxuY29uc3QgY2FjaGUgPSBuZXcgQ29tbWl0Q2FjaGUoKVxuXG5jb25zdCBzaG93T3B0cyA9IHtcbiAgczogdHJ1ZSxcbiAgZm9ybWF0OiAnJWFlJW4lYW4lbiVjZSVuJWNuJW4lQidcbn1cblxuZnVuY3Rpb24gZ2V0Q29tbWl0TWVzc2FnZSAoZmlsZSwgaGFzaCwgY2FsbGJhY2spIHtcbiAgY29uc3QgcmVwb1BhdGggPSBmaW5kUmVwbyhmaWxlKVxuXG4gIGlmICghcmVwb1BhdGgpIHsgcmV0dXJuIH1cblxuICBjb25zdCBnaXQgPSBuZXcgR2l0KHsgJ2dpdC1kaXInOiByZXBvUGF0aCB9KVxuICBnaXQuZXhlYygnc2hvdycsIHNob3dPcHRzLCBbIGhhc2ggXSwgKGVycm9yLCBtc2cpID0+IHtcbiAgICBpZiAoZXJyb3IpIHsgcmV0dXJuIH1cbiAgICBjYWxsYmFjayhtc2cpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldENvbW1pdCAoZmlsZSwgaGFzaCwgY2FsbGJhY2spIHtcbiAgY29uc3QgY2FjaGVkID0gY2FjaGUuZ2V0KGZpbGUsIGhhc2gpXG5cbiAgaWYgKGNhY2hlZCkgeyByZXR1cm4gY2FsbGJhY2soY2FjaGVkKSB9XG5cbiAgZ2V0Q29tbWl0TWVzc2FnZShmaWxlLCBoYXNoLCAobXNnKSA9PiB7XG4gICAgY29uc3QgbGluZXMgPSBtc2cuc3BsaXQoL1xcbi9nKVxuXG4gICAgY29uc3QgY29tbWl0ID0ge1xuICAgICAgYXV0aG9yOiB7IGVtYWlsOiBsaW5lcy5zaGlmdCgpLCBuYW1lOiBsaW5lcy5zaGlmdCgpIH0sXG4gICAgICBjb21taXR0ZXI6IHsgZW1haWw6IGxpbmVzLnNoaWZ0KCksIG5hbWU6IGxpbmVzLnNoaWZ0KCkgfSxcbiAgICAgIHN1YmplY3Q6IGxpbmVzLnNoaWZ0KCksXG4gICAgICBtZXNzYWdlOiBsaW5lcy5qb2luKCdcXG4nKS5yZXBsYWNlKC8oXlxccyt8XFxzKyQpLywgJycpXG4gICAgfVxuXG4gICAgY2FjaGUuc2V0KGZpbGUsIGhhc2gsIGNvbW1pdClcblxuICAgIGNhbGxiYWNrKGNvbW1pdClcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRDb21taXRcbiJdfQ==