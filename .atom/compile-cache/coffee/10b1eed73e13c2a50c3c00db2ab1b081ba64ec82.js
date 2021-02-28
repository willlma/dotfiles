(function() {
  var $, CompositeDisposable, ShowTodoView, TableHeaderView, TodoEmptyView, TodoView, View, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), View = ref.View, $ = ref.$;

  ref1 = require('./todo-item-view'), TableHeaderView = ref1.TableHeaderView, TodoView = ref1.TodoView, TodoEmptyView = ref1.TodoEmptyView;

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    function ShowTodoView() {
      this.renderTable = bind(this.renderTable, this);
      this.clearTodos = bind(this.clearTodos, this);
      this.renderTodo = bind(this.renderTodo, this);
      this.tableHeaderClicked = bind(this.tableHeaderClicked, this);
      this.initTable = bind(this.initTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        "class": 'todo-table',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            outlet: 'table'
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleConfigChanges();
      return this.handleEvents();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(this.collection.onDidFinishSearch(this.initTable));
      this.disposables.add(this.collection.onDidRemoveTodo(this.removeTodo));
      this.disposables.add(this.collection.onDidClear(this.clearTodos));
      this.disposables.add(this.collection.onDidSortTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      this.disposables.add(this.collection.onDidFilterTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      return this.on('click', 'th', this.tableHeaderClicked);
    };

    ShowTodoView.prototype.handleConfigChanges = function() {
      this.disposables.add(atom.config.onDidChange('todo-show.showInTable', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          _this.showInTable = newValue;
          return _this.renderTable(_this.collection.getTodos());
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('todo-show.sortBy', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.sort(_this.sortBy = newValue, _this.sortAsc);
        };
      })(this)));
      return this.disposables.add(atom.config.onDidChange('todo-show.sortAscending', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.sort(_this.sortBy, _this.sortAsc = newValue);
        };
      })(this)));
    };

    ShowTodoView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.empty();
    };

    ShowTodoView.prototype.initTable = function() {
      this.showInTable = atom.config.get('todo-show.showInTable');
      this.sortBy = atom.config.get('todo-show.sortBy');
      this.sortAsc = atom.config.get('todo-show.sortAscending');
      return this.sort(this.sortBy, this.sortAsc);
    };

    ShowTodoView.prototype.renderTableHeader = function() {
      return this.table.append(new TableHeaderView(this.showInTable, {
        sortBy: this.sortBy,
        sortAsc: this.sortAsc
      }));
    };

    ShowTodoView.prototype.tableHeaderClicked = function(e) {
      var item, sortAsc;
      item = e.target.innerText;
      sortAsc = this.sortBy === item ? !this.sortAsc : this.sortAsc;
      atom.config.set('todo-show.sortBy', item);
      return atom.config.set('todo-show.sortAscending', sortAsc);
    };

    ShowTodoView.prototype.renderTodo = function(todo) {
      return this.table.append(new TodoView(this.showInTable, todo));
    };

    ShowTodoView.prototype.removeTodo = function(todo) {
      return console.log('removeTodo');
    };

    ShowTodoView.prototype.clearTodos = function() {
      return this.table.empty();
    };

    ShowTodoView.prototype.renderTable = function(todos) {
      var i, len, ref2, todo;
      this.clearTodos();
      this.renderTableHeader();
      ref2 = todos = todos;
      for (i = 0, len = ref2.length; i < len; i++) {
        todo = ref2[i];
        this.renderTodo(todo);
      }
      if (!todos.length) {
        return this.table.append(new TodoEmptyView(this.showInTable));
      }
    };

    ShowTodoView.prototype.sort = function(sortBy, sortAsc) {
      return this.collection.sortTodos({
        sortBy: sortBy,
        sortAsc: sortAsc
      });
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLXRhYmxlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrRkFBQTtJQUFBOzs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsZUFBRCxFQUFPOztFQUVQLE9BQTZDLE9BQUEsQ0FBUSxrQkFBUixDQUE3QyxFQUFDLHNDQUFELEVBQWtCLHdCQUFsQixFQUE0Qjs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs7Ozs7O0lBQ0osWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDtRQUFxQixRQUFBLEVBQVUsQ0FBQyxDQUFoQztPQUFMLEVBQXdDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDdEMsS0FBQyxDQUFBLEtBQUQsQ0FBTztZQUFBLE1BQUEsRUFBUSxPQUFSO1dBQVA7UUFEc0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDO0lBRFE7OzJCQUlWLFVBQUEsR0FBWSxTQUFDLFVBQUQ7TUFBQyxJQUFDLENBQUEsYUFBRDtNQUNYLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsbUJBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxZQUFELENBQUE7SUFIVTs7MkJBS1osWUFBQSxHQUFjLFNBQUE7TUFFWixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUE4QixJQUFDLENBQUEsU0FBL0IsQ0FBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxlQUFaLENBQTRCLElBQUMsQ0FBQSxVQUE3QixDQUFqQjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBdUIsSUFBQyxDQUFBLFVBQXhCLENBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsY0FBWixDQUEyQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFBVyxLQUFDLENBQUEsV0FBRCxDQUFhLEtBQWI7UUFBWDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsQ0FBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxnQkFBWixDQUE2QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFBVyxLQUFDLENBQUEsV0FBRCxDQUFhLEtBQWI7UUFBWDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0IsQ0FBakI7YUFFQSxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxJQUFiLEVBQW1CLElBQUMsQ0FBQSxrQkFBcEI7SUFSWTs7MkJBVWQsbUJBQUEsR0FBcUIsU0FBQTtNQUNuQixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHVCQUF4QixFQUFpRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUNoRSxjQUFBO1VBRGtFLHlCQUFVO1VBQzVFLEtBQUMsQ0FBQSxXQUFELEdBQWU7aUJBQ2YsS0FBQyxDQUFBLFdBQUQsQ0FBYSxLQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQSxDQUFiO1FBRmdFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRCxDQUFqQjtNQUlBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0Isa0JBQXhCLEVBQTRDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQzNELGNBQUE7VUFENkQseUJBQVU7aUJBQ3ZFLEtBQUMsQ0FBQSxJQUFELENBQU0sS0FBQyxDQUFBLE1BQUQsR0FBVSxRQUFoQixFQUEwQixLQUFDLENBQUEsT0FBM0I7UUFEMkQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVDLENBQWpCO2FBR0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qix5QkFBeEIsRUFBbUQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDbEUsY0FBQTtVQURvRSx5QkFBVTtpQkFDOUUsS0FBQyxDQUFBLElBQUQsQ0FBTSxLQUFDLENBQUEsTUFBUCxFQUFlLEtBQUMsQ0FBQSxPQUFELEdBQVcsUUFBMUI7UUFEa0U7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5ELENBQWpCO0lBUm1COzsyQkFXckIsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFELENBQUE7SUFGTzs7MkJBSVQsU0FBQSxHQUFXLFNBQUE7TUFDVCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEI7TUFDZixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEI7TUFDVixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEI7YUFDWCxJQUFDLENBQUEsSUFBRCxDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLE9BQWhCO0lBSlM7OzJCQU1YLGlCQUFBLEdBQW1CLFNBQUE7YUFDakIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsSUFBSSxlQUFKLENBQW9CLElBQUMsQ0FBQSxXQUFyQixFQUFrQztRQUFFLFFBQUQsSUFBQyxDQUFBLE1BQUY7UUFBVyxTQUFELElBQUMsQ0FBQSxPQUFYO09BQWxDLENBQWQ7SUFEaUI7OzJCQUduQixrQkFBQSxHQUFvQixTQUFDLENBQUQ7QUFDbEIsVUFBQTtNQUFBLElBQUEsR0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO01BQ2hCLE9BQUEsR0FBYSxJQUFDLENBQUEsTUFBRCxLQUFXLElBQWQsR0FBd0IsQ0FBQyxJQUFDLENBQUEsT0FBMUIsR0FBdUMsSUFBQyxDQUFBO01BRWxELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEIsRUFBb0MsSUFBcEM7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLEVBQTJDLE9BQTNDO0lBTGtCOzsyQkFPcEIsVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLElBQUksUUFBSixDQUFhLElBQUMsQ0FBQSxXQUFkLEVBQTJCLElBQTNCLENBQWQ7SUFEVTs7MkJBR1osVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBWjtJQURVOzsyQkFHWixVQUFBLEdBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFBO0lBRFU7OzJCQUdaLFdBQUEsR0FBYSxTQUFDLEtBQUQ7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLFVBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0FBRUE7QUFBQSxXQUFBLHNDQUFBOztRQUNFLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtBQURGO01BRUEsSUFBQSxDQUFxRCxLQUFLLENBQUMsTUFBM0Q7ZUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFJLGFBQUosQ0FBa0IsSUFBQyxDQUFBLFdBQW5CLENBQWQsRUFBQTs7SUFOVzs7MkJBUWIsSUFBQSxHQUFNLFNBQUMsTUFBRCxFQUFTLE9BQVQ7YUFDSixJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBc0I7UUFBQSxNQUFBLEVBQVEsTUFBUjtRQUFnQixPQUFBLEVBQVMsT0FBekI7T0FBdEI7SUFESTs7OztLQXBFbUI7QUFOM0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue1ZpZXcsICR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbntUYWJsZUhlYWRlclZpZXcsIFRvZG9WaWV3LCBUb2RvRW1wdHlWaWV3fSA9IHJlcXVpcmUgJy4vdG9kby1pdGVtLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNob3dUb2RvVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ3RvZG8tdGFibGUnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAdGFibGUgb3V0bGV0OiAndGFibGUnXG5cbiAgaW5pdGlhbGl6ZTogKEBjb2xsZWN0aW9uKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGhhbmRsZUNvbmZpZ0NoYW5nZXMoKVxuICAgIEBoYW5kbGVFdmVudHMoKVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICAjIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRBZGRUb2RvIEByZW5kZXJUb2RvXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZpbmlzaFNlYXJjaCBAaW5pdFRhYmxlXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZFJlbW92ZVRvZG8gQHJlbW92ZVRvZG9cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkQ2xlYXIgQGNsZWFyVG9kb3NcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU29ydFRvZG9zICh0b2RvcykgPT4gQHJlbmRlclRhYmxlIHRvZG9zXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZpbHRlclRvZG9zICh0b2RvcykgPT4gQHJlbmRlclRhYmxlIHRvZG9zXG5cbiAgICBAb24gJ2NsaWNrJywgJ3RoJywgQHRhYmxlSGVhZGVyQ2xpY2tlZFxuXG4gIGhhbmRsZUNvbmZpZ0NoYW5nZXM6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAndG9kby1zaG93LnNob3dJblRhYmxlJywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PlxuICAgICAgQHNob3dJblRhYmxlID0gbmV3VmFsdWVcbiAgICAgIEByZW5kZXJUYWJsZSBAY29sbGVjdGlvbi5nZXRUb2RvcygpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICd0b2RvLXNob3cuc29ydEJ5JywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PlxuICAgICAgQHNvcnQoQHNvcnRCeSA9IG5ld1ZhbHVlLCBAc29ydEFzYylcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3RvZG8tc2hvdy5zb3J0QXNjZW5kaW5nJywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PlxuICAgICAgQHNvcnQoQHNvcnRCeSwgQHNvcnRBc2MgPSBuZXdWYWx1ZSlcblxuICBkZXN0cm95OiAtPlxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBAZW1wdHkoKVxuXG4gIGluaXRUYWJsZTogPT5cbiAgICBAc2hvd0luVGFibGUgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScpXG4gICAgQHNvcnRCeSA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNvcnRCeScpXG4gICAgQHNvcnRBc2MgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zb3J0QXNjZW5kaW5nJylcbiAgICBAc29ydChAc29ydEJ5LCBAc29ydEFzYylcblxuICByZW5kZXJUYWJsZUhlYWRlcjogLT5cbiAgICBAdGFibGUuYXBwZW5kIG5ldyBUYWJsZUhlYWRlclZpZXcoQHNob3dJblRhYmxlLCB7QHNvcnRCeSwgQHNvcnRBc2N9KVxuXG4gIHRhYmxlSGVhZGVyQ2xpY2tlZDogKGUpID0+XG4gICAgaXRlbSA9IGUudGFyZ2V0LmlubmVyVGV4dFxuICAgIHNvcnRBc2MgPSBpZiBAc29ydEJ5IGlzIGl0ZW0gdGhlbiAhQHNvcnRBc2MgZWxzZSBAc29ydEFzY1xuXG4gICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuc29ydEJ5JywgaXRlbSlcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5zb3J0QXNjZW5kaW5nJywgc29ydEFzYylcblxuICByZW5kZXJUb2RvOiAodG9kbykgPT5cbiAgICBAdGFibGUuYXBwZW5kIG5ldyBUb2RvVmlldyhAc2hvd0luVGFibGUsIHRvZG8pXG5cbiAgcmVtb3ZlVG9kbzogKHRvZG8pIC0+XG4gICAgY29uc29sZS5sb2cgJ3JlbW92ZVRvZG8nXG5cbiAgY2xlYXJUb2RvczogPT5cbiAgICBAdGFibGUuZW1wdHkoKVxuXG4gIHJlbmRlclRhYmxlOiAodG9kb3MpID0+XG4gICAgQGNsZWFyVG9kb3MoKVxuICAgIEByZW5kZXJUYWJsZUhlYWRlcigpXG5cbiAgICBmb3IgdG9kbyBpbiB0b2RvcyA9IHRvZG9zXG4gICAgICBAcmVuZGVyVG9kbyh0b2RvKVxuICAgIEB0YWJsZS5hcHBlbmQgbmV3IFRvZG9FbXB0eVZpZXcoQHNob3dJblRhYmxlKSB1bmxlc3MgdG9kb3MubGVuZ3RoXG5cbiAgc29ydDogKHNvcnRCeSwgc29ydEFzYykgLT5cbiAgICBAY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiBzb3J0QnksIHNvcnRBc2M6IHNvcnRBc2MpXG4iXX0=
