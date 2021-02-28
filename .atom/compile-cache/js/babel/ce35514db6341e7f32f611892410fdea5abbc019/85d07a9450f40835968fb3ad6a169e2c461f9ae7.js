Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

'use babel';

var TagGenerator = (function () {
  function TagGenerator(path1, scopeName) {
    _classCallCheck(this, TagGenerator);

    this.path = path1;
    this.scopeName = scopeName;
  }

  _createClass(TagGenerator, [{
    key: 'getLanguage',
    value: function getLanguage() {
      var needle = undefined;
      if (_lodash2['default'].isString(this.path) && (needle = _path2['default'].extname(this.path), ['.cson', '.gyp'].includes(needle))) {
        return 'Cson';
      }

      return ({
        'source.c': 'c',
        'source.cpp': 'cpp',
        'source.clojure': 'lisp',
        'source.coffee': 'coffeescript',
        'source.css': 'css',
        'source.css.less': 'less',
        'source.css.scss': 'scss',
        'source.gfm': 'markdown',
        'source.go': 'go',
        'source.java': 'java',
        'source.js': 'javascript',
        'source.es6': 'javascript',
        'source.js.jsx': 'javascript',
        'source.jsx': 'javascript',
        'source.json': 'json',
        'source.makefile': 'make',
        'source.objc': 'c',
        'source.objcpp': 'cpp',
        'source.python': 'python',
        'source.ruby': 'ruby',
        'source.sass': 'sass',
        'source.yaml': 'yaml',
        'text.html': 'html',
        'text.html.basic': 'html',
        'text.html.php': 'php',
        'source.livecodescript': 'liveCode',
        'source.scilab': 'scilab', // Scilab
        'source.matlab': 'scilab', // Matlab
        'source.octave': 'scilab', // GNU Octave

        // For backward-compatibility with Atom versions < 0.166
        'source.c++': 'cpp',
        'source.objc++': 'cpp'
      })[this.scopeName];
    }
  }, {
    key: 'generate',
    value: _asyncToGenerator(function* () {
      if (!this.lang) this.lang = this.getLanguage();
      if (!_fs2['default'].statSync(this.path).isFile()) return {};

      var self = this,
          Gen = undefined;
      try {
        Gen = require('./tag-generators/' + this.lang);
      } catch (e) {
        Gen = require('./tag-generators/universal');
      }

      var ctx = {
        file: this.path,
        content: _fs2['default'].readFileSync(this.path, 'utf8'),
        lang: this.lang
      };
      var tags = yield Gen.parseFile(ctx); // tags contains list and tree data structure

      // For inline script in HTML
      if (tags.scriptNode && tags.scriptNode.length) yield this.inlineScriptHandler(tags.scriptNode, ctx);
      return tags;
    })
  }, {
    key: 'inlineScriptHandler',
    value: _asyncToGenerator(function* (nodes, ctx) {
      var parser = require('./tag-generators/javascript');
      for (var i in nodes) {
        var _parent = nodes[i];
        var tags = yield parser.parseFile({
          content: _parent.content,
          file: ctx.file
        });
        if (tags.tree && Object.keys(tags.tree).length) {
          _parent.child = tags.tree;
          this.fixLineno(_parent);
        }
        // If JS error exists, jsctags would work
        else if (tags.list) {
            if (!_parent.child) _parent.child = {};
            for (var j in tags.list) {
              var item = tags.list[j];
              _parent.child[item.id] = item;
            }
            this.fixLineno(_parent);
          }
      }
    })
  }, {
    key: 'fixLineno',
    value: function fixLineno(parent, baseLineno) {
      // Line number of root node is the base number
      if (!baseLineno) baseLineno = parent.lineno;
      for (var i in parent.child) {
        var child = parent.child[i];
        child.lineno += baseLineno - 1;
        if (child.child) this.fixLineno(child, baseLineno);
      }
    }
  }]);

  return TagGenerator;
})();

exports['default'] = TagGenerator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi90YWctZ2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztrQkFFZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7c0JBQ1QsUUFBUTs7OztBQUp0QixXQUFXLENBQUM7O0lBTVMsWUFBWTtBQUNwQixXQURRLFlBQVksQ0FDbkIsS0FBSyxFQUFFLFNBQVMsRUFBRTswQkFEWCxZQUFZOztBQUU3QixRQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNsQixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztHQUM1Qjs7ZUFKa0IsWUFBWTs7V0FNcEIsdUJBQUc7QUFDWixVQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsVUFBSSxvQkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLE1BQU0sR0FBRyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQSxBQUFDLEVBQUU7QUFDbkcsZUFBTyxNQUFNLENBQUM7T0FDZjs7QUFFRCxhQUFPLENBQUE7QUFDTCxrQkFBVSxFQUFFLEdBQUc7QUFDZixvQkFBWSxFQUFFLEtBQUs7QUFDbkIsd0JBQWdCLEVBQUUsTUFBTTtBQUN4Qix1QkFBZSxFQUFFLGNBQWM7QUFDL0Isb0JBQVksRUFBRSxLQUFLO0FBQ25CLHlCQUFpQixFQUFFLE1BQU07QUFDekIseUJBQWlCLEVBQUUsTUFBTTtBQUN6QixvQkFBWSxFQUFFLFVBQVU7QUFDeEIsbUJBQVcsRUFBRSxJQUFJO0FBQ2pCLHFCQUFhLEVBQUUsTUFBTTtBQUNyQixtQkFBVyxFQUFFLFlBQVk7QUFDekIsb0JBQVksRUFBRSxZQUFZO0FBQzFCLHVCQUFlLEVBQUUsWUFBWTtBQUM3QixvQkFBWSxFQUFFLFlB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LENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIscUJBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM5QjtBQUNELGdCQUFJLENBQUMsU0FBUyxDQUFDLE9BQU0sQ0FBQyxDQUFDO1dBQ3hCO09BQ0Y7S0FDRjs7O1dBRVEsbUJBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTs7QUFFNUIsVUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUM1QyxXQUFLLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDMUIsWUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixhQUFLLENBQUMsTUFBTSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDL0IsWUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO09BQ3BEO0tBQ0Y7OztTQXpHa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvc3RydWN0dXJlLXZpZXcvbGliL3RhZy1nZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFnR2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IocGF0aDEsIHNjb3BlTmFtZSkge1xuICAgIHRoaXMucGF0aCA9IHBhdGgxO1xuICAgIHRoaXMuc2NvcGVOYW1lID0gc2NvcGVOYW1lO1xuICB9XG5cbiAgZ2V0TGFuZ3VhZ2UoKSB7XG4gICAgbGV0IG5lZWRsZTtcbiAgICBpZiAoXy5pc1N0cmluZyh0aGlzLnBhdGgpICYmIChuZWVkbGUgPSBwYXRoLmV4dG5hbWUodGhpcy5wYXRoKSwgWycuY3NvbicsICcuZ3lwJ10uaW5jbHVkZXMobmVlZGxlKSkpIHtcbiAgICAgIHJldHVybiAnQ3Nvbic7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICdzb3VyY2UuYyc6ICdjJyxcbiAgICAgICdzb3VyY2UuY3BwJzogJ2NwcCcsXG4gICAgICAnc291cmNlLmNsb2p1cmUnOiAnbGlzcCcsXG4gICAgICAnc291cmNlLmNvZmZlZSc6ICdjb2ZmZWVzY3JpcHQnLFxuICAgICAgJ3NvdXJjZS5jc3MnOiAnY3NzJyxcbiAgICAgICdzb3VyY2UuY3NzLmxlc3MnOiAnbGVzcycsXG4gICAgICAnc291cmNlLmNzcy5zY3NzJzogJ3Njc3MnLFxuICAgICAgJ3NvdXJjZS5nZm0nOiAnbWFya2Rvd24nLFxuICAgICAgJ3NvdXJjZS5nbyc6ICdnbycsXG4gICAgICAnc291cmNlLmphdmEnOiAnamF2YScsXG4gICAgICAnc291cmNlLmpzJzogJ2phdmFzY3JpcHQnLFxuICAgICAgJ3NvdXJjZS5lczYnOiAnamF2YXNjcmlwdCcsXG4gICAgICAnc291cmNlLmpzLmpzeCc6ICdqYXZhc2NyaXB0JyxcbiAgICAgICdzb3VyY2UuanN4JzogJ2phdmFzY3JpcHQnLFxuICAgICAgJ3NvdXJjZS5qc29uJzogJ2pzb24nLFxuICAgICAgJ3NvdXJjZS5tYWtlZmlsZSc6ICdtYWtlJyxcbiAgICAgICdzb3VyY2Uub2JqYyc6ICdjJyxcbiAgICAgICdzb3VyY2Uub2JqY3BwJzogJ2NwcCcsXG4gICAgICAnc291cmNlLnB5dGhvbic6ICdweXRob24nLFxuICAgICAgJ3NvdXJjZS5ydWJ5JzogJ3J1YnknLFxuICAgICAgJ3NvdXJjZS5zYXNzJzogJ3Nhc3MnLFxuICAgICAgJ3NvdXJjZS55YW1sJzogJ3lhbWwnLFxuICAgICAgJ3RleHQuaHRtbCc6ICdodG1sJyxcbiAgICAgICd0ZXh0Lmh0bWwuYmFzaWMnOiAnaHRtbCcsXG4gICAgICAndGV4dC5odG1sLnBocCc6ICdwaHAnLFxuICAgICAgJ3NvdXJjZS5saXZlY29kZXNjcmlwdCc6ICdsaXZlQ29kZScsXG4gICAgICAnc291cmNlLnNjaWxhYic6ICdzY2lsYWInLCAvLyBTY2lsYWJcbiAgICAgICdzb3VyY2UubWF0bGFiJzogJ3NjaWxhYicsIC8vIE1hdGxhYlxuICAgICAgJ3NvdXJjZS5vY3RhdmUnOiAnc2NpbGFiJywgLy8gR05VIE9jdGF2ZVxuXG4gICAgICAvLyBGb3IgYmFja3dhcmQtY29tcGF0aWJpbGl0eSB3aXRoIEF0b20gdmVyc2lvbnMgPCAwLjE2NlxuICAgICAgJ3NvdXJjZS5jKysnOiAnY3BwJyxcbiAgICAgICdzb3VyY2Uub2JqYysrJzogJ2NwcCdcbiAgICB9W3RoaXMuc2NvcGVOYW1lXTtcbiAgfVxuXG4gIGFzeW5jIGdlbmVyYXRlKCkge1xuICAgIGlmICghdGhpcy5sYW5nKSB0aGlzLmxhbmcgPSB0aGlzLmdldExhbmd1YWdlKCk7XG4gICAgaWYgKCFmcy5zdGF0U3luYyh0aGlzLnBhdGgpLmlzRmlsZSgpKSByZXR1cm4ge307XG5cbiAgICBsZXQgc2VsZiA9IHRoaXMsXG4gICAgICBHZW47XG4gICAgdHJ5IHtcbiAgICAgIEdlbiA9IHJlcXVpcmUoYC4vdGFnLWdlbmVyYXRvcnMvJHt0aGlzLmxhbmd9YCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgR2VuID0gcmVxdWlyZSgnLi90YWctZ2VuZXJhdG9ycy91bml2ZXJzYWwnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjdHggPSB7XG4gICAgICBmaWxlOiB0aGlzLnBhdGgsXG4gICAgICBjb250ZW50OiBmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRoLCAndXRmOCcpLFxuICAgICAgbGFuZzogdGhpcy5sYW5nXG4gICAgfTtcbiAgICBsZXQgdGFncyA9IGF3YWl0IEdlbi5wYXJzZUZpbGUoY3R4KTsgLy8gdGFncyBjb250YWlucyBsaXN0IGFuZCB0cmVlIGRhdGEgc3RydWN0dXJlXG5cbiAgICAvLyBGb3IgaW5saW5lIHNjcmlwdCBpbiBIVE1MXG4gICAgaWYgKHRhZ3Muc2NyaXB0Tm9kZSAmJiB0YWdzLnNjcmlwdE5vZGUubGVuZ3RoKSBhd2FpdCB0aGlzLmlubGluZVNjcmlwdEhhbmRsZXIodGFncy5zY3JpcHROb2RlLCBjdHgpO1xuICAgIHJldHVybiB0YWdzO1xuICB9XG5cbiAgYXN5bmMgaW5saW5lU2NyaXB0SGFuZGxlcihub2RlcywgY3R4KSB7XG4gICAgbGV0IHBhcnNlciA9IHJlcXVpcmUoJy4vdGFnLWdlbmVyYXRvcnMvamF2YXNjcmlwdCcpO1xuICAgIGZvciAobGV0IGkgaW4gbm9kZXMpIHtcbiAgICAgIGxldCBwYXJlbnQgPSBub2Rlc1tpXTtcbiAgICAgIGxldCB0YWdzID0gYXdhaXQgcGFyc2VyLnBhcnNlRmlsZSh7XG4gICAgICAgICAgICAgICAgICBjb250ZW50OiBwYXJlbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgIGZpbGU6IGN0eC5maWxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICBpZiAodGFncy50cmVlICYmIE9iamVjdC5rZXlzKHRhZ3MudHJlZSkubGVuZ3RoKSB7XG4gICAgICAgIHBhcmVudC5jaGlsZCA9IHRhZ3MudHJlZTtcbiAgICAgICAgdGhpcy5maXhMaW5lbm8ocGFyZW50KTtcbiAgICAgIH1cbiAgICAgIC8vIElmIEpTIGVycm9yIGV4aXN0cywganNjdGFncyB3b3VsZCB3b3JrXG4gICAgICBlbHNlIGlmICh0YWdzLmxpc3QpIHtcbiAgICAgICAgaWYgKCFwYXJlbnQuY2hpbGQpIHBhcmVudC5jaGlsZCA9IHt9O1xuICAgICAgICBmb3IgKGxldCBqIGluIHRhZ3MubGlzdCkge1xuICAgICAgICAgIGxldCBpdGVtID0gdGFncy5saXN0W2pdO1xuICAgICAgICAgIHBhcmVudC5jaGlsZFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maXhMaW5lbm8ocGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaXhMaW5lbm8ocGFyZW50LCBiYXNlTGluZW5vKSB7XG4gICAgLy8gTGluZSBudW1iZXIgb2Ygcm9vdCBub2RlIGlzIHRoZSBiYXNlIG51bWJlclxuICAgIGlmICghYmFzZUxpbmVubykgYmFzZUxpbmVubyA9IHBhcmVudC5saW5lbm87XG4gICAgZm9yIChsZXQgaSBpbiBwYXJlbnQuY2hpbGQpIHtcbiAgICAgIGxldCBjaGlsZCA9IHBhcmVudC5jaGlsZFtpXTtcbiAgICAgIGNoaWxkLmxpbmVubyArPSBiYXNlTGluZW5vIC0gMTtcbiAgICAgIGlmIChjaGlsZC5jaGlsZCkgdGhpcy5maXhMaW5lbm8oY2hpbGQsIGJhc2VMaW5lbm8pO1xuICAgIH1cbiAgfVxufVxuIl19