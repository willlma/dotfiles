Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

'use babel';

var TagParser = (function () {
  function TagParser(tags, lang) {
    _classCallCheck(this, TagParser);

    this.tags = tags;
    this.lang = lang;
  }

  _createClass(TagParser, [{
    key: 'parser',
    value: function parser() {
      var _this = this;

      if (this.tags.tree) {
        this.tags.list = {};
        this.treeToList(this.tags.list, this.tags.tree);
        return this.tags.tree;
      } else if (this.tags.list) {
        var _ret = (function () {
          var res = {},
              data = _this.tags.list;
          if (Object.keys(data).length === 0) return {
              v: res
            };

          // Let items without parent as root node
          var childs = [],
              tagSet = {};
          _lodash2['default'].forEach(data, function (item) {
            item.position = new _atom.Point(item.lineno - 1);
            if (!item.parent) res[item.id] = item;else childs.push(item);
            tagSet[item.id] = item;
          });

          var missed = [];
          _lodash2['default'].forEach(childs, function (item) {
            // Save missed child if cannot find its parent in all tags
            if (!tagSet[item.parent]) missed.push(item);else {
              if (!tagSet[item.parent].child) tagSet[item.parent].child = {};
              tagSet[item.parent].child[item.id] = item;
            }
          });

          if (missed) {
            _lodash2['default'].forEach(missed, function (item) {
              res[item.id] = item;
            });
          }

          _this.tags.tree = res;
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
    }
  }, {
    key: 'treeToList',
    value: function treeToList(list, tree) {
      var self = this;
      _lodash2['default'].forEach(tree, function (item, index) {
        if (item.child && Object.keys(item.child).length === 0) delete item.child;
        item.position = new _atom.Point(item.lineno - 1);
        list[index] = item;
        if (item.child) self.treeToList(list, item.child);
      });
    }
  }]);

  return TagParser;
})();

exports['default'] = TagParser;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi90YWctcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQ3NCLE1BQU07O3NCQUNkLFFBQVE7Ozs7QUFGdEIsV0FBVyxDQUFDOztJQUlTLFNBQVM7QUFDakIsV0FEUSxTQUFTLENBQ2hCLElBQUksRUFBRSxJQUFJLEVBQUU7MEJBREwsU0FBUzs7QUFFMUIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7R0FDbEI7O2VBSmtCLFNBQVM7O1dBTXRCLGtCQUFHOzs7QUFDUCxVQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNwQixZQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEQsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUN2QixNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7O0FBQ3pCLGNBQUksR0FBRyxHQUFHLEVBQUU7Y0FDVixJQUFJLEdBQUcsTUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3hCLGNBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2lCQUFPLEdBQUc7Y0FBQzs7O0FBRy9DLGNBQUksTUFBTSxHQUFHLEVBQUU7Y0FDYixNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2QsOEJBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFBLElBQUksRUFBSTtBQUN0QixnQkFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBVSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNDLGdCQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLGtCQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztXQUN4QixDQUFDLENBQUM7O0FBRUgsY0FBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLDhCQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBQSxJQUFJLEVBQUk7O0FBRXhCLGdCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQ3ZDO0FBQ0gsa0JBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDL0Qsb0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDM0M7V0FDRixDQUFDLENBQUM7O0FBRUgsY0FBSSxNQUFNLEVBQUU7QUFDVixnQ0FBRSxPQUFPLENBQUMsTUFBTSxFQUFFLFVBQUEsSUFBSSxFQUFJO0FBQ3hCLGlCQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNyQixDQUFDLENBQUM7V0FDSjs7QUFFRCxnQkFBSyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQzs7OztPQUN0QjtLQUNGOzs7V0FFUyxvQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3JCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQiwwQkFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUMvQixZQUFJLElBQUksQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDMUUsWUFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBVSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbkIsWUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNuRCxDQUFDLENBQUM7S0FDSjs7O1NBdERrQixTQUFTOzs7cUJBQVQsU0FBUztBQXVEN0IsQ0FBQyIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9zdHJ1Y3R1cmUtdmlldy9saWIvdGFnLXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICdhdG9tJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ1BhcnNlciB7XG4gIGNvbnN0cnVjdG9yKHRhZ3MsIGxhbmcpIHtcbiAgICB0aGlzLnRhZ3MgPSB0YWdzO1xuICAgIHRoaXMubGFuZyA9IGxhbmc7XG4gIH1cblxuICBwYXJzZXIoKSB7XG4gICAgaWYgKHRoaXMudGFncy50cmVlKSB7XG4gICAgICB0aGlzLnRhZ3MubGlzdCA9IHt9O1xuICAgICAgdGhpcy50cmVlVG9MaXN0KHRoaXMudGFncy5saXN0LCB0aGlzLnRhZ3MudHJlZSk7XG4gICAgICByZXR1cm4gdGhpcy50YWdzLnRyZWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRhZ3MubGlzdCkge1xuICAgICAgbGV0IHJlcyA9IHt9LFxuICAgICAgICBkYXRhID0gdGhpcy50YWdzLmxpc3Q7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzO1xuXG4gICAgICAvLyBMZXQgaXRlbXMgd2l0aG91dCBwYXJlbnQgYXMgcm9vdCBub2RlXG4gICAgICBsZXQgY2hpbGRzID0gW10sXG4gICAgICAgIHRhZ1NldCA9IHt9O1xuICAgICAgXy5mb3JFYWNoKGRhdGEsIGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLnBvc2l0aW9uID0gbmV3IFBvaW50KGl0ZW0ubGluZW5vIC0gMSk7XG4gICAgICAgIGlmICghaXRlbS5wYXJlbnQpIHJlc1tpdGVtLmlkXSA9IGl0ZW07XG4gICAgICAgIGVsc2UgY2hpbGRzLnB1c2goaXRlbSk7XG4gICAgICAgIHRhZ1NldFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICB9KTtcblxuICAgICAgbGV0IG1pc3NlZCA9IFtdO1xuICAgICAgXy5mb3JFYWNoKGNoaWxkcywgaXRlbSA9PiB7XG4gICAgICAgIC8vIFNhdmUgbWlzc2VkIGNoaWxkIGlmIGNhbm5vdCBmaW5kIGl0cyBwYXJlbnQgaW4gYWxsIHRhZ3NcbiAgICAgICAgaWYgKCF0YWdTZXRbaXRlbS5wYXJlbnRdKSBtaXNzZWQucHVzaChpdGVtKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKCF0YWdTZXRbaXRlbS5wYXJlbnRdLmNoaWxkKSB0YWdTZXRbaXRlbS5wYXJlbnRdLmNoaWxkID0ge307XG4gICAgICAgICAgdGFnU2V0W2l0ZW0ucGFyZW50XS5jaGlsZFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAobWlzc2VkKSB7XG4gICAgICAgIF8uZm9yRWFjaChtaXNzZWQsIGl0ZW0gPT4ge1xuICAgICAgICAgIHJlc1tpdGVtLmlkXSA9IGl0ZW07XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRhZ3MudHJlZSA9IHJlcztcbiAgICB9XG4gIH1cblxuICB0cmVlVG9MaXN0KGxpc3QsIHRyZWUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBfLmZvckVhY2godHJlZSwgKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaXRlbS5jaGlsZCAmJiBPYmplY3Qua2V5cyhpdGVtLmNoaWxkKS5sZW5ndGggPT09IDApIGRlbGV0ZSBpdGVtLmNoaWxkO1xuICAgICAgaXRlbS5wb3NpdGlvbiA9IG5ldyBQb2ludChpdGVtLmxpbmVubyAtIDEpO1xuICAgICAgbGlzdFtpbmRleF0gPSBpdGVtO1xuICAgICAgaWYgKGl0ZW0uY2hpbGQpIHNlbGYudHJlZVRvTGlzdChsaXN0LCBpdGVtLmNoaWxkKTtcbiAgICB9KTtcbiAgfVxufTtcbiJdfQ==