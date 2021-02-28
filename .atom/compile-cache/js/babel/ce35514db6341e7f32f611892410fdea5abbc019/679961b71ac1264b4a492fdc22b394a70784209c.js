function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _pickForPath = require('./pick-for-path');

var _pickForPath2 = _interopRequireDefault(_pickForPath);

'use babel';

var types = ['git', 'svn', 'hg'];

module.exports = function findRepoType(filePath) {
  return (0, _pickForPath2['default'])(filePath, function (currentPath) {
    var type = types.find(function (type) {
      return _fs2['default'].existsSync(_path2['default'].join(currentPath, '.' + type));
    });

    if (type) {
      return type;
    }
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi91dGlscy9maW5kLXJlcG8tdHlwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQkFFaUIsTUFBTTs7OztrQkFDUixJQUFJOzs7OzJCQUNLLGlCQUFpQjs7OztBQUp6QyxXQUFXLENBQUE7O0FBTVgsSUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUVsQyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsWUFBWSxDQUFFLFFBQVEsRUFBRTtBQUNoRCxTQUFPLDhCQUFZLFFBQVEsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUM1QyxRQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2hDLGFBQU8sZ0JBQUcsVUFBVSxDQUFDLGtCQUFLLElBQUksQ0FBQyxXQUFXLFFBQU0sSUFBSSxDQUFHLENBQUMsQ0FBQTtLQUN6RCxDQUFDLENBQUE7O0FBRUYsUUFBSSxJQUFJLEVBQUU7QUFBRSxhQUFPLElBQUksQ0FBQTtLQUFFO0dBQzFCLENBQUMsQ0FBQTtDQUNILENBQUEiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYmxhbWUvbGliL3V0aWxzL2ZpbmQtcmVwby10eXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwaWNrRm9yUGF0aCBmcm9tICcuL3BpY2stZm9yLXBhdGgnXG5cbmNvbnN0IHR5cGVzID0gWydnaXQnLCAnc3ZuJywgJ2hnJ11cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5kUmVwb1R5cGUgKGZpbGVQYXRoKSB7XG4gIHJldHVybiBwaWNrRm9yUGF0aChmaWxlUGF0aCwgKGN1cnJlbnRQYXRoKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVzLmZpbmQoKHR5cGUpID0+IHtcbiAgICAgIHJldHVybiBmcy5leGlzdHNTeW5jKHBhdGguam9pbihjdXJyZW50UGF0aCwgYC4ke3R5cGV9YCkpXG4gICAgfSlcblxuICAgIGlmICh0eXBlKSB7IHJldHVybiB0eXBlIH1cbiAgfSlcbn1cbiJdfQ==