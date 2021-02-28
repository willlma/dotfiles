'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CommitCache = (function () {
  function CommitCache() {
    _classCallCheck(this, CommitCache);

    this.cache = {};
  }

  _createClass(CommitCache, [{
    key: 'get',
    value: function get(file, hash) {
      return this.cache[file + '|' + hash] || null;
    }
  }, {
    key: 'set',
    value: function set(file, hash, msg) {
      this.cache[file + '|' + hash] = msg;
    }
  }]);

  return CommitCache;
})();

exports['default'] = CommitCache;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi91dGlscy9jb21taXQtY2FjaGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7O0lBRVUsV0FBVztBQUNsQixXQURPLFdBQVcsR0FDZjswQkFESSxXQUFXOztBQUU1QixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtHQUNoQjs7ZUFIa0IsV0FBVzs7V0FLMUIsYUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2YsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFJLElBQUksU0FBSSxJQUFJLENBQUcsSUFBSSxJQUFJLENBQUE7S0FDN0M7OztXQUVHLGFBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDcEIsVUFBSSxDQUFDLEtBQUssQ0FBSSxJQUFJLFNBQUksSUFBSSxDQUFHLEdBQUcsR0FBRyxDQUFBO0tBQ3BDOzs7U0FYa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYmxhbWUvbGliL3V0aWxzL2NvbW1pdC1jYWNoZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1pdENhY2hlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fVxuICB9XG5cbiAgZ2V0IChmaWxlLCBoYXNoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGVbYCR7ZmlsZX18JHtoYXNofWBdIHx8IG51bGxcbiAgfVxuXG4gIHNldCAoZmlsZSwgaGFzaCwgbXNnKSB7XG4gICAgdGhpcy5jYWNoZVtgJHtmaWxlfXwke2hhc2h9YF0gPSBtc2dcbiAgfVxufVxuIl19