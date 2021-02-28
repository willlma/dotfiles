Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _getBlame = require('./get-blame');

var _getBlame2 = _interopRequireDefault(_getBlame);

var _getCommit2 = require('./get-commit');

var _getCommit3 = _interopRequireDefault(_getCommit2);

var _getCommitLink2 = require('./get-commit-link');

var _getCommitLink3 = _interopRequireDefault(_getCommitLink2);

var _abstract = require('../abstract');

var _abstract2 = _interopRequireDefault(_abstract);

'use babel';

var GitProvider = (function (_AbstractProvider) {
  _inherits(GitProvider, _AbstractProvider);

  function GitProvider() {
    _classCallCheck(this, GitProvider);

    _get(Object.getPrototypeOf(GitProvider.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(GitProvider, [{
    key: 'supports',
    value: function supports(type) {
      return ['copy', 'link'].indexOf(type) !== -1;
    }
  }, {
    key: 'blame',
    value: function blame(callback) {
      if (this.exists()) {
        return (0, _getBlame2['default'])(this.filePath, callback);
      }
      callback(null);
    }
  }, {
    key: 'getCommit',
    value: function getCommit(hash, callback) {
      (0, _getCommit3['default'])(this.filePath, hash, callback);
    }
  }, {
    key: 'getCommitLink',
    value: function getCommitLink(hash, callback) {
      (0, _getCommitLink3['default'])(this.filePath, hash, callback);
    }
  }]);

  return GitProvider;
})(_abstract2['default']);

exports['default'] = GitProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9wcm92aWRlci9naXQvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozt3QkFFcUIsYUFBYTs7OzswQkFDWixjQUFjOzs7OzhCQUNWLG1CQUFtQjs7Ozt3QkFDaEIsYUFBYTs7OztBQUwxQyxXQUFXLENBQUE7O0lBT1UsV0FBVztZQUFYLFdBQVc7O1dBQVgsV0FBVzswQkFBWCxXQUFXOzsrQkFBWCxXQUFXOzs7ZUFBWCxXQUFXOztXQUNyQixrQkFBQyxJQUFJLEVBQUU7QUFDZCxhQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtLQUM3Qzs7O1dBRUssZUFBQyxRQUFRLEVBQUU7QUFDZixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUNqQixlQUFPLDJCQUFTLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7T0FDekM7QUFDRCxjQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDZjs7O1dBRVMsbUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUN6QixrQ0FBVSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN6Qzs7O1dBRWEsdUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM3QixzQ0FBYyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM3Qzs7O1NBbEJrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvcHJvdmlkZXIvZ2l0L21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgZ2V0QmxhbWUgZnJvbSAnLi9nZXQtYmxhbWUnXG5pbXBvcnQgZ2V0Q29tbWl0IGZyb20gJy4vZ2V0LWNvbW1pdCdcbmltcG9ydCBnZXRDb21taXRMaW5rIGZyb20gJy4vZ2V0LWNvbW1pdC1saW5rJ1xuaW1wb3J0IEFic3RyYWN0UHJvdmlkZXIgZnJvbSAnLi4vYWJzdHJhY3QnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFByb3ZpZGVyIGV4dGVuZHMgQWJzdHJhY3RQcm92aWRlciB7XG4gIHN1cHBvcnRzICh0eXBlKSB7XG4gICAgcmV0dXJuIFsnY29weScsICdsaW5rJ10uaW5kZXhPZih0eXBlKSAhPT0gLTFcbiAgfVxuXG4gIGJsYW1lIChjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLmV4aXN0cygpKSB7XG4gICAgICByZXR1cm4gZ2V0QmxhbWUodGhpcy5maWxlUGF0aCwgY2FsbGJhY2spXG4gICAgfVxuICAgIGNhbGxiYWNrKG51bGwpXG4gIH1cblxuICBnZXRDb21taXQgKGhhc2gsIGNhbGxiYWNrKSB7XG4gICAgZ2V0Q29tbWl0KHRoaXMuZmlsZVBhdGgsIGhhc2gsIGNhbGxiYWNrKVxuICB9XG5cbiAgZ2V0Q29tbWl0TGluayAoaGFzaCwgY2FsbGJhY2spIHtcbiAgICBnZXRDb21taXRMaW5rKHRoaXMuZmlsZVBhdGgsIGhhc2gsIGNhbGxiYWNrKVxuICB9XG59XG4iXX0=