(function() {
  var TableHeaderView, TodoEmptyView, TodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  View = require('atom-space-pen-views').View;

  TableHeaderView = (function(superClass) {
    extend(TableHeaderView, superClass);

    function TableHeaderView() {
      return TableHeaderView.__super__.constructor.apply(this, arguments);
    }

    TableHeaderView.content = function(showInTable, arg) {
      var sortAsc, sortBy;
      if (showInTable == null) {
        showInTable = [];
      }
      sortBy = arg.sortBy, sortAsc = arg.sortAsc;
      return this.tr((function(_this) {
        return function() {
          var i, item, len, results;
          results = [];
          for (i = 0, len = showInTable.length; i < len; i++) {
            item = showInTable[i];
            results.push(_this.th(item, function() {
              if (item === sortBy && sortAsc) {
                _this.div({
                  "class": 'sort-asc icon-triangle-down active'
                });
              } else {
                _this.div({
                  "class": 'sort-asc icon-triangle-down'
                });
              }
              if (item === sortBy && !sortAsc) {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up active'
                });
              } else {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up'
                });
              }
            }));
          }
          return results;
        };
      })(this));
    };

    return TableHeaderView;

  })(View);

  TodoView = (function(superClass) {
    extend(TodoView, superClass);

    function TodoView() {
      this.openPath = bind(this.openPath, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.content = function(showInTable, todo) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          var i, item, len, results;
          results = [];
          for (i = 0, len = showInTable.length; i < len; i++) {
            item = showInTable[i];
            results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.all);
                case 'Text':
                  return _this.span(todo.text);
                case 'Type':
                  return _this.i(todo.type);
                case 'Range':
                  return _this.i(todo.range);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'Path':
                  return _this.a(todo.path);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
                case 'Id':
                  return _this.i(todo.id);
                case 'Project':
                  return _this.a(todo.project);
              }
            }));
          }
          return results;
        };
      })(this));
    };

    TodoView.prototype.initialize = function(showInTable, todo1) {
      this.todo = todo1;
      return this.handleEvents();
    };

    TodoView.prototype.destroy = function() {
      return this.detach();
    };

    TodoView.prototype.handleEvents = function() {
      return this.on('click', 'td', this.openPath);
    };

    TodoView.prototype.openPath = function() {
      var position;
      if (!(this.todo && this.todo.loc)) {
        return;
      }
      position = [this.todo.position[0][0], this.todo.position[0][1]];
      return atom.workspace.open(this.todo.loc, {
        pending: atom.config.get('core.allowPendingPaneItems') || false
      }).then(function() {
        var textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
          textEditor.setCursorBufferPosition(position, {
            autoscroll: false
          });
          return textEditor.scrollToCursorPosition({
            center: true
          });
        }
      });
    };

    return TodoView;

  })(View);

  TodoEmptyView = (function(superClass) {
    extend(TodoEmptyView, superClass);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function(showInTable) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          return _this.td({
            colspan: showInTable.length
          }, function() {
            return _this.p("No results...");
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TableHeaderView: TableHeaderView,
    TodoView: TodoView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWl0ZW0tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhDQUFBO0lBQUE7Ozs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFFSDs7Ozs7OztJQUNKLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxXQUFELEVBQW1CLEdBQW5CO0FBQ1IsVUFBQTs7UUFEUyxjQUFjOztNQUFLLHFCQUFRO2FBQ3BDLElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ0YsY0FBQTtBQUFBO2VBQUEsNkNBQUE7O3lCQUNFLEtBQUMsQ0FBQSxFQUFELENBQUksSUFBSixFQUFVLFNBQUE7Y0FDUixJQUFHLElBQUEsS0FBUSxNQUFSLElBQW1CLE9BQXRCO2dCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUs7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxvQ0FBUDtpQkFBTCxFQURGO2VBQUEsTUFBQTtnQkFHRSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sNkJBQVA7aUJBQUwsRUFIRjs7Y0FJQSxJQUFHLElBQUEsS0FBUSxNQUFSLElBQW1CLENBQUksT0FBMUI7dUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG1DQUFQO2lCQUFMLEVBREY7ZUFBQSxNQUFBO3VCQUdFLEtBQUMsQ0FBQSxHQUFELENBQUs7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyw0QkFBUDtpQkFBTCxFQUhGOztZQUxRLENBQVY7QUFERjs7UUFERTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSjtJQURROzs7O0tBRGtCOztFQWN4Qjs7Ozs7Ozs7SUFDSixRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMs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QUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDRixLQUFDLENBQUEsRUFBRCxDQUFJO1lBQUEsT0FBQSxFQUFTLFdBQVcsQ0FBQyxNQUFyQjtXQUFKLEVBQWlDLFNBQUE7bUJBQy9CLEtBQUMsQ0FBQSxDQUFELENBQUcsZUFBSDtVQUQrQixDQUFqQztRQURFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO0lBRFE7Ozs7S0FEZ0I7O0VBTTVCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsaUJBQUEsZUFBRDtJQUFrQixVQUFBLFFBQWxCO0lBQTRCLGVBQUEsYUFBNUI7O0FBN0RqQiIsInNvdXJjZXNDb250ZW50IjpbIntWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5jbGFzcyBUYWJsZUhlYWRlclZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoc2hvd0luVGFibGUgPSBbXSwge3NvcnRCeSwgc29ydEFzY30pIC0+XG4gICAgQHRyID0+XG4gICAgICBmb3IgaXRlbSBpbiBzaG93SW5UYWJsZVxuICAgICAgICBAdGggaXRlbSwgPT5cbiAgICAgICAgICBpZiBpdGVtIGlzIHNvcnRCeSBhbmQgc29ydEFzY1xuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NvcnQtYXNjIGljb24tdHJpYW5nbGUtZG93biBhY3RpdmUnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NvcnQtYXNjIGljb24tdHJpYW5nbGUtZG93bidcbiAgICAgICAgICBpZiBpdGVtIGlzIHNvcnRCeSBhbmQgbm90IHNvcnRBc2NcbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzb3J0LWRlc2MgaWNvbi10cmlhbmdsZS11cCBhY3RpdmUnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NvcnQtZGVzYyBpY29uLXRyaWFuZ2xlLXVwJ1xuXG5jbGFzcyBUb2RvVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChzaG93SW5UYWJsZSA9IFtdLCB0b2RvKSAtPlxuICAgIEB0ciA9PlxuICAgICAgZm9yIGl0ZW0gaW4gc2hvd0luVGFibGVcbiAgICAgICAgQHRkID0+XG4gICAgICAgICAgc3dpdGNoIGl0ZW1cbiAgICAgICAgICAgIHdoZW4gJ0FsbCcgICB0aGVuIEBzcGFuIHRvZG8uYWxsXG4gICAgICAgICAgICB3aGVuICdUZXh0JyAgdGhlbiBAc3BhbiB0b2RvLnRleHRcbiAgICAgICAgICAgIHdoZW4gJ1R5cGUnICB0aGVuIEBpIHRvZG8udHlwZVxuICAgICAgICAgICAgd2hlbiAnUmFuZ2UnIHRoZW4gQGkgdG9kby5yYW5nZVxuICAgICAgICAgICAgd2hlbiAnTGluZScgIHRoZW4gQGkgdG9kby5saW5lXG4gICAgICAgICAgICB3aGVuICdSZWdleCcgdGhlbiBAY29kZSB0b2RvLnJlZ2V4XG4gICAgICAgICAgICB3aGVuICdQYXRoJyAgdGhlbiBAYSB0b2RvLnBhdGhcbiAgICAgICAgICAgIHdoZW4gJ0ZpbGUnICB0aGVuIEBhIHRvZG8uZmlsZVxuICAgICAgICAgICAgd2hlbiAnVGFncycgIHRoZW4gQGkgdG9kby50YWdzXG4gICAgICAgICAgICB3aGVuICdJZCcgICAgdGhlbiBAaSB0b2RvLmlkXG4gICAgICAgICAgICB3aGVuICdQcm9qZWN0JyB0aGVuIEBhIHRvZG8ucHJvamVjdFxuXG4gIGluaXRpYWxpemU6IChzaG93SW5UYWJsZSwgQHRvZG8pIC0+XG4gICAgQGhhbmRsZUV2ZW50cygpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGV0YWNoKClcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgQG9uICdjbGljaycsICd0ZCcsIEBvcGVuUGF0aFxuXG4gIG9wZW5QYXRoOiA9PlxuICAgIHJldHVybiB1bmxlc3MgQHRvZG8gYW5kIEB0b2RvLmxvY1xuICAgIHBvc2l0aW9uID0gW0B0b2RvLnBvc2l0aW9uWzBdWzBdLCBAdG9kby5wb3NpdGlvblswXVsxXV1cblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oQHRvZG8ubG9jLCB7XG4gICAgICBwZW5kaW5nOiBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJykgb3IgZmFsc2VcbiAgICB9KS50aGVuIC0+XG4gICAgICAjIFNldHRpbmcgaW5pdGlhbENvbHVtbi9MaW5lIGRvZXMgbm90IGFsd2F5cyBjZW50ZXIgdmlld1xuICAgICAgaWYgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICB0ZXh0RWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uLCBhdXRvc2Nyb2xsOiBmYWxzZSlcbiAgICAgICAgdGV4dEVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKGNlbnRlcjogdHJ1ZSlcblxuY2xhc3MgVG9kb0VtcHR5VmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChzaG93SW5UYWJsZSA9IFtdKSAtPlxuICAgIEB0ciA9PlxuICAgICAgQHRkIGNvbHNwYW46IHNob3dJblRhYmxlLmxlbmd0aCwgPT5cbiAgICAgICAgQHAgXCJObyByZXN1bHRzLi4uXCJcblxubW9kdWxlLmV4cG9ydHMgPSB7VGFibGVIZWFkZXJWaWV3LCBUb2RvVmlldywgVG9kb0VtcHR5Vmlld31cbiJdfQ==
