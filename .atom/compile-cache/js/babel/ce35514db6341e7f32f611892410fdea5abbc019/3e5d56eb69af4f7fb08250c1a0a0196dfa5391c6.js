Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getCommitLink;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gitWrapper = require('git-wrapper');

var _gitWrapper2 = _interopRequireDefault(_gitWrapper);

var _findRepo = require('./find-repo');

var _findRepo2 = _interopRequireDefault(_findRepo);

var _configUrlSchemes = require('../../config/url-schemes');

var _configUrlSchemes2 = _interopRequireDefault(_configUrlSchemes);

'use babel';

function parseRemote(remote, config) {
  for (var exp of config.exps) {
    var m = remote.match(exp);
    if (m) {
      return m.groups;
    }
  }

  return null;
}

function buildLink(remote, hash, config) {
  var data = parseRemote(remote, config);
  if (data) {
    return config.template.replace('{protocol}', data.protocol || 'https').replace('{host}', data.host).replace('{organization}', data.organization).replace('{user}', data.user).replace('{repo}', data.repo).replace('{hash}', hash.substr(0, 8)).replace('{long-hash}', hash);
  }

  return null;
}

function getConfig(git, key, callback) {
  git.exec('config', { get: true }, [key], callback);
}

function getCommitLink(file, hash, callback) {
  var repoPath = (0, _findRepo2['default'])(file);
  if (!repoPath) {
    return;
  }

  var git = new _gitWrapper2['default']({ 'git-dir': repoPath });

  getConfig(git, 'atom-blame.browser-url', function (error, url) {
    if (!error && url) {
      var link = url.replace(/(^\s+|\s+$)/g, '').replace('{hash}', hash.substr(0, 8)).replace('{long-hash}', hash);

      if (link) {
        return callback(link);
      }
    }

    getConfig(git, 'remote.origin.url', function (error, remote) {
      if (error) {
        return console.error(error);
      }

      remote = remote.replace(/(^\s+|\s+$)/g, '');
      for (var config of _configUrlSchemes2['default']) {
        var link = buildLink(remote, hash, config);
        if (link) {
          return callback(link);
        }
      }

      callback(null);
    });
  });
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9wcm92aWRlci9naXQvZ2V0LWNvbW1pdC1saW5rLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFzQ3dCLGFBQWE7Ozs7MEJBcENyQixhQUFhOzs7O3dCQUVSLGFBQWE7Ozs7Z0NBQ2QsMEJBQTBCOzs7O0FBTDlDLFdBQVcsQ0FBQTs7QUFPWCxTQUFTLFdBQVcsQ0FBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQ3BDLE9BQUssSUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtBQUM3QixRQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzNCLFFBQUksQ0FBQyxFQUFFO0FBQ0wsYUFBTyxDQUFDLENBQUMsTUFBTSxDQUFBO0tBQ2hCO0dBQ0Y7O0FBRUQsU0FBTyxJQUFJLENBQUE7Q0FDWjs7QUFFRCxTQUFTLFNBQVMsQ0FBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUN4QyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3hDLE1BQUksSUFBSSxFQUFFO0FBQ1IsV0FBTyxNQUFNLENBQUMsUUFBUSxDQUNuQixPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLENBQy9DLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUM1QixPQUFPLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUM1QyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDNUIsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQzVCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDcEMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtHQUNoQzs7QUFFRCxTQUFPLElBQUksQ0FBQTtDQUNaOztBQUVELFNBQVMsU0FBUyxDQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQ3RDLEtBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUE7Q0FDbkQ7O0FBRWMsU0FBUyxhQUFhLENBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDM0QsTUFBTSxRQUFRLEdBQUcsMkJBQVMsSUFBSSxDQUFDLENBQUE7QUFDL0IsTUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLFdBQU07R0FDUDs7QUFFRCxNQUFNLEdBQUcsR0FBRyw0QkFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBOztBQUU1QyxXQUFTLENBQUMsR0FBRyxFQUFFLHdCQUF3QixFQUFFLFVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBSztBQUN2RCxRQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsRUFBRTtBQUNqQixVQUFNLElBQUksR0FBRyxHQUFHLENBQ2IsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FDM0IsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUNwQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUUvQixVQUFJLElBQUksRUFBRTtBQUNSLGVBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ3RCO0tBQ0Y7O0FBRUQsYUFBUyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNLEVBQUs7QUFDckQsVUFBSSxLQUFLLEVBQUU7QUFBRSxlQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7T0FBRTs7QUFFMUMsWUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzNDLFdBQUssSUFBTSxNQUFNLG1DQUFhO0FBQzVCLFlBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQzVDLFlBQUksSUFBSSxFQUFFO0FBQ1IsaUJBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ3RCO09BQ0Y7O0FBRUQsY0FBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2YsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0giLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYmxhbWUvbGliL3Byb3ZpZGVyL2dpdC9nZXQtY29tbWl0LWxpbmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgR2l0IGZyb20gJ2dpdC13cmFwcGVyJ1xuXG5pbXBvcnQgZmluZFJlcG8gZnJvbSAnLi9maW5kLXJlcG8nXG5pbXBvcnQgY29uZmlncyBmcm9tICcuLi8uLi9jb25maWcvdXJsLXNjaGVtZXMnXG5cbmZ1bmN0aW9uIHBhcnNlUmVtb3RlIChyZW1vdGUsIGNvbmZpZykge1xuICBmb3IgKGNvbnN0IGV4cCBvZiBjb25maWcuZXhwcykge1xuICAgIGNvbnN0IG0gPSByZW1vdGUubWF0Y2goZXhwKVxuICAgIGlmIChtKSB7XG4gICAgICByZXR1cm4gbS5ncm91cHNcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBidWlsZExpbmsgKHJlbW90ZSwgaGFzaCwgY29uZmlnKSB7XG4gIGNvbnN0IGRhdGEgPSBwYXJzZVJlbW90ZShyZW1vdGUsIGNvbmZpZylcbiAgaWYgKGRhdGEpIHtcbiAgICByZXR1cm4gY29uZmlnLnRlbXBsYXRlXG4gICAgICAucmVwbGFjZSgne3Byb3RvY29sfScsIGRhdGEucHJvdG9jb2wgfHwgJ2h0dHBzJylcbiAgICAgIC5yZXBsYWNlKCd7aG9zdH0nLCBkYXRhLmhvc3QpXG4gICAgICAucmVwbGFjZSgne29yZ2FuaXphdGlvbn0nLCBkYXRhLm9yZ2FuaXphdGlvbilcbiAgICAgIC5yZXBsYWNlKCd7dXNlcn0nLCBkYXRhLnVzZXIpXG4gICAgICAucmVwbGFjZSgne3JlcG99JywgZGF0YS5yZXBvKVxuICAgICAgLnJlcGxhY2UoJ3toYXNofScsIGhhc2guc3Vic3RyKDAsIDgpKVxuICAgICAgLnJlcGxhY2UoJ3tsb25nLWhhc2h9JywgaGFzaClcbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGdldENvbmZpZyAoZ2l0LCBrZXksIGNhbGxiYWNrKSB7XG4gIGdpdC5leGVjKCdjb25maWcnLCB7IGdldDogdHJ1ZSB9LCBba2V5XSwgY2FsbGJhY2spXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbW1pdExpbmsgKGZpbGUsIGhhc2gsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHJlcG9QYXRoID0gZmluZFJlcG8oZmlsZSlcbiAgaWYgKCFyZXBvUGF0aCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgZ2l0ID0gbmV3IEdpdCh7ICdnaXQtZGlyJzogcmVwb1BhdGggfSlcblxuICBnZXRDb25maWcoZ2l0LCAnYXRvbS1ibGFtZS5icm93c2VyLXVybCcsIChlcnJvciwgdXJsKSA9PiB7XG4gICAgaWYgKCFlcnJvciAmJiB1cmwpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSB1cmxcbiAgICAgICAgLnJlcGxhY2UoLyheXFxzK3xcXHMrJCkvZywgJycpXG4gICAgICAgIC5yZXBsYWNlKCd7aGFzaH0nLCBoYXNoLnN1YnN0cigwLCA4KSlcbiAgICAgICAgLnJlcGxhY2UoJ3tsb25nLWhhc2h9JywgaGFzaClcblxuICAgICAgaWYgKGxpbmspIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGxpbmspXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q29uZmlnKGdpdCwgJ3JlbW90ZS5vcmlnaW4udXJsJywgKGVycm9yLCByZW1vdGUpID0+IHtcbiAgICAgIGlmIChlcnJvcikgeyByZXR1cm4gY29uc29sZS5lcnJvcihlcnJvcikgfVxuXG4gICAgICByZW1vdGUgPSByZW1vdGUucmVwbGFjZSgvKF5cXHMrfFxccyskKS9nLCAnJylcbiAgICAgIGZvciAoY29uc3QgY29uZmlnIG9mIGNvbmZpZ3MpIHtcbiAgICAgICAgY29uc3QgbGluayA9IGJ1aWxkTGluayhyZW1vdGUsIGhhc2gsIGNvbmZpZylcbiAgICAgICAgaWYgKGxpbmspIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobGluaylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayhudWxsKVxuICAgIH0pXG4gIH0pXG59XG4iXX0=