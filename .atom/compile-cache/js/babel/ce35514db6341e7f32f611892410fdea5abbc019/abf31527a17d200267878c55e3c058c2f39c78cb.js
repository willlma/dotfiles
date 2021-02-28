Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

var AbstractProvider = (function () {
  function AbstractProvider(filePath, type) {
    _classCallCheck(this, AbstractProvider);

    this.filePath = filePath;
    this.type = type;
  }

  _createClass(AbstractProvider, [{
    key: 'supports',
    value: function supports(type) {
      return false;
    }
  }, {
    key: 'blame',
    value: function blame(callback) {}
  }, {
    key: 'getCommit',
    value: function getCommit(hash, callback) {}
  }, {
    key: 'getCommitLink',
    value: function getCommitLink(hash, callback) {}
  }, {
    key: 'dependenciesExist',
    value: function dependenciesExist() {
      return this.filePath && _fs2['default'].existsSync(this.filePath);
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.filePath && _fs2['default'].existsSync(this.filePath);
    }
  }]);

  return AbstractProvider;
})();

exports['default'] = AbstractProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9wcm92aWRlci9hYnN0cmFjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7QUFGbkIsV0FBVyxDQUFBOztJQUlVLGdCQUFnQjtBQUN2QixXQURPLGdCQUFnQixDQUN0QixRQUFRLEVBQUUsSUFBSSxFQUFFOzBCQURWLGdCQUFnQjs7QUFFakMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7R0FDakI7O2VBSmtCLGdCQUFnQjs7V0FNMUIsa0JBQUMsSUFBSSxFQUFFO0FBQ2QsYUFBTyxLQUFLLENBQUE7S0FDYjs7O1dBRUssZUFBQyxRQUFRLEVBQUUsRUFBRTs7O1dBRVQsbUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFOzs7V0FFZix1QkFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUU7OztXQUVmLDZCQUFHO0FBQ25CLGFBQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxnQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3JEOzs7V0FFTSxrQkFBRztBQUNSLGFBQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxnQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3JEOzs7U0F0QmtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYmxhbWUvbGliL3Byb3ZpZGVyL2Fic3RyYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYnN0cmFjdFByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IgKGZpbGVQYXRoLCB0eXBlKSB7XG4gICAgdGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICB9XG5cbiAgc3VwcG9ydHMgKHR5cGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGJsYW1lIChjYWxsYmFjaykge31cblxuICBnZXRDb21taXQgKGhhc2gsIGNhbGxiYWNrKSB7fVxuXG4gIGdldENvbW1pdExpbmsgKGhhc2gsIGNhbGxiYWNrKSB7fVxuXG4gIGRlcGVuZGVuY2llc0V4aXN0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0aCAmJiBmcy5leGlzdHNTeW5jKHRoaXMuZmlsZVBhdGgpXG4gIH1cblxuICBleGlzdHMgKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRoICYmIGZzLmV4aXN0c1N5bmModGhpcy5maWxlUGF0aClcbiAgfVxufVxuIl19