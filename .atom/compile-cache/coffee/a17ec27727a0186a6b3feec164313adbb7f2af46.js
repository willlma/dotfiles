(function() {
  var CodeView, CompositeDisposable, ItemView, ShowTodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  ItemView = (function(superClass) {
    extend(ItemView, superClass);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.content = function(item) {
      return this.span({
        "class": 'badge badge-large',
        'data-id': item
      }, item);
    };

    return ItemView;

  })(View);

  CodeView = (function(superClass) {
    extend(CodeView, superClass);

    function CodeView() {
      return CodeView.__super__.constructor.apply(this, arguments);
    }

    CodeView.content = function(item) {
      return this.code(item);
    };

    return CodeView;

  })(View);

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    function ShowTodoView() {
      this.updateShowInTable = bind(this.updateShowInTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        outlet: 'todoOptions',
        "class": 'todo-options'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('On Table');
            return _this.div({
              outlet: 'itemsOnTable',
              "class": 'block items-on-table'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Off Table');
            return _this.div({
              outlet: 'itemsOffTable',
              "class": 'block items-off-table'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Find Todos');
            return _this.div({
              outlet: 'findTodoDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Find Regex');
            return _this.div({
              outlet: 'findRegexDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Ignore Paths');
            return _this.div({
              outlet: 'ignorePathDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Auto Refresh');
            return _this.div({
              "class": 'checkbox'
            }, function() {
              return _this.label(function() {
                return _this.input({
                  outlet: 'autoRefreshCheckbox',
                  "class": 'input-checkbox',
                  type: 'checkbox'
                });
              });
            });
          });
          return _this.div({
            "class": 'option'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                outlet: 'configButton',
                "class": 'btn'
              }, "Go to Config");
              return _this.button({
                outlet: 'closeButton',
                "class": 'btn'
              }, "Close Options");
            });
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.updateUI();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.configButton.on('click', function() {
        return atom.workspace.open('atom://config/packages/todo-show');
      });
      this.closeButton.on('click', (function(_this) {
        return function() {
          return _this.parent().slideToggle();
        };
      })(this));
      this.autoRefreshCheckbox.on('click', (function(_this) {
        return function(event) {
          return _this.autoRefreshChange(event.target.checked);
        };
      })(this));
      return this.disposables.add(atom.config.observe('todo-show.autoRefresh', (function(_this) {
        return function(newValue) {
          var ref;
          return (ref = _this.autoRefreshCheckbox.context) != null ? ref.checked = newValue : void 0;
        };
      })(this)));
    };

    ShowTodoView.prototype.detach = function() {
      return this.disposables.dispose();
    };

    ShowTodoView.prototype.updateShowInTable = function() {
      var showInTable;
      showInTable = this.sortable.toArray();
      return atom.config.set('todo-show.showInTable', showInTable);
    };

    ShowTodoView.prototype.updateUI = function() {
      var Sortable, i, item, j, k, len, len1, len2, path, ref, ref1, ref2, regex, results, tableItems, todo, todos;
      tableItems = atom.config.get('todo-show.showInTable');
      ref = this.collection.getAvailableTableItems();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (tableItems.indexOf(item) === -1) {
          this.itemsOffTable.append(new ItemView(item));
        } else {
          this.itemsOnTable.append(new ItemView(item));
        }
      }
      Sortable = require('sortablejs');
      this.sortable = Sortable.create(this.itemsOnTable.context, {
        group: 'tableItems',
        ghostClass: 'ghost',
        onSort: this.updateShowInTable
      });
      Sortable.create(this.itemsOffTable.context, {
        group: 'tableItems',
        ghostClass: 'ghost'
      });
      ref1 = todos = atom.config.get('todo-show.findTheseTodos');
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        todo = ref1[j];
        this.findTodoDiv.append(new CodeView(todo));
      }
      regex = atom.config.get('todo-show.findUsingRegex');
      this.findRegexDiv.append(new CodeView(regex.replace('${TODOS}', todos.join('|'))));
      ref2 = atom.config.get('todo-show.ignoreThesePaths');
      results = [];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        path = ref2[k];
        results.push(this.ignorePathDiv.append(new CodeView(path)));
      }
      return results;
    };

    ShowTodoView.prototype.autoRefreshChange = function(state) {
      return atom.config.set('todo-show.autoRefresh', state);
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLW9wdGlvbnMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDJEQUFBO0lBQUE7Ozs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3ZCLE9BQVEsT0FBQSxDQUFRLHNCQUFSOztFQUVIOzs7Ozs7O0lBQ0osUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQ7YUFDUixJQUFDLENBQUEsSUFBRCxDQUFNO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBUDtRQUE0QixTQUFBLEVBQVcsSUFBdkM7T0FBTixFQUFtRCxJQUFuRDtJQURROzs7O0tBRFc7O0VBSWpCOzs7Ozs7O0lBQ0osUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQ7YUFDUixJQUFDLENBQUEsSUFBRCxDQUFNLElBQU47SUFEUTs7OztLQURXOztFQUl2QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OztJQUNKLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxNQUFBLEVBQVEsYUFBUjtRQUF1QixDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQTlCO09BQUwsRUFBbUQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2pELEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFFBQVA7V0FBTCxFQUFzQixTQUFBO1lBQ3BCLEtBQUMsQ0FBQSxFQUFELENBQUksVUFBSjttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsTUFBQSxFQUFRLGNBQVI7Y0FBd0IsQ0FBQSxLQUFBLENBQUEsRUFBTyxzQkFBL0I7YUFBTDtVQUZvQixDQUF0QjtVQUlBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FB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QXJCLEVBSEY7O0FBREY7TUFNQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7TUFFWCxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVEsQ0FBQyxNQUFULENBQ1YsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQURKLEVBRVY7UUFBQSxLQUFBLEVBQU8sWUFBUDtRQUNBLFVBQUEsRUFBWSxPQURaO1FBRUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxpQkFGVDtPQUZVO01BT1osUUFBUSxDQUFDLE1BQVQsQ0FDRSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BRGpCLEVBRUU7UUFBQSxLQUFBLEVBQU8sWUFBUDtRQUNBLFVBQUEsRUFBWSxPQURaO09BRkY7QUFNQTtBQUFBLFdBQUEsd0NBQUE7O1FBQ0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLElBQUksUUFBSixDQUFhLElBQWIsQ0FBcEI7QUFERjtNQUdBLEtBQUEsR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCO01BQ1IsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLENBQXFCLElBQUksUUFBSixDQUFhLEtBQUssQ0FBQyxPQUFOLENBQWMsVUFBZCxFQUEwQixLQUFLLENBQUMsSUFBTixDQUFXLEdBQVgsQ0FBMUIsQ0FBYixDQUFyQjtBQUVBO0FBQUE7V0FBQSx3Q0FBQTs7cUJBQ0UsSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLENBQXNCLElBQUksUUFBSixDQUFhLElBQWIsQ0FBdEI7QUFERjs7SUE3QlE7OzJCQWdDVixpQkFBQSxHQUFtQixTQUFDLEtBQUQ7YUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxLQUF6QztJQURpQjs7OztLQXpGTTtBQVozQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuY2xhc3MgSXRlbVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoaXRlbSkgLT5cbiAgICBAc3BhbiBjbGFzczogJ2JhZGdlIGJhZGdlLWxhcmdlJywgJ2RhdGEtaWQnOiBpdGVtLCBpdGVtXG5cbmNsYXNzIENvZGVWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKGl0ZW0pIC0+XG4gICAgQGNvZGUgaXRlbVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTaG93VG9kb1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgb3V0bGV0OiAndG9kb09wdGlvbnMnLCBjbGFzczogJ3RvZG8tb3B0aW9ucycsID0+XG4gICAgICBAZGl2IGNsYXNzOiAnb3B0aW9uJywgPT5cbiAgICAgICAgQGgyICdPbiBUYWJsZSdcbiAgICAgICAgQGRpdiBvdXRsZXQ6ICdpdGVtc09uVGFibGUnLCBjbGFzczogJ2Jsb2NrIGl0ZW1zLW9uLXRhYmxlJ1xuXG4gICAgICBAZGl2IGNsYXNzOiAnb3B0aW9uJywgPT5cbiAgICAgICAgQGgyICdPZmYgVGFibGUnXG4gICAgICAgIEBkaXYgb3V0bGV0OiAnaXRlbXNPZmZUYWJsZScsIGNsYXNzOiAnYmxvY2sgaXRlbXMtb2ZmLXRhYmxlJ1xuXG4gICAgICBAZGl2IGNsYXNzOiAnb3B0aW9uJywgPT5cbiAgICAgICAgQGgyICdGaW5kIFRvZG9zJ1xuICAgICAgICBAZGl2IG91dGxldDogJ2ZpbmRUb2RvRGl2J1xuXG4gICAgICBAZGl2IGNsYXNzOiAnb3B0aW9uJywgPT5cbiAgICAgICAgQGgyICdGaW5kIFJlZ2V4J1xuICAgICAgICBAZGl2IG91dGxldDogJ2ZpbmRSZWdleERpdidcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnSWdub3JlIFBhdGhzJ1xuICAgICAgICBAZGl2IG91dGxldDogJ2lnbm9yZVBhdGhEaXYnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdvcHRpb24nLCA9PlxuICAgICAgICBAaDIgJ0F1dG8gUmVmcmVzaCdcbiAgICAgICAgQGRpdiBjbGFzczogJ2NoZWNrYm94JywgPT5cbiAgICAgICAgICBAbGFiZWwgPT5cbiAgICAgICAgICAgIEBpbnB1dCBvdXRsZXQ6ICdhdXRvUmVmcmVzaENoZWNrYm94JywgY2xhc3M6ICdpbnB1dC1jaGVja2JveCcsIHR5cGU6ICdjaGVja2JveCdcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnY29uZmlnQnV0dG9uJywgY2xhc3M6ICdidG4nLCBcIkdvIHRvIENvbmZpZ1wiXG4gICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdjbG9zZUJ1dHRvbicsIGNsYXNzOiAnYnRuJywgXCJDbG9zZSBPcHRpb25zXCJcblxuICBpbml0aWFsaXplOiAoQGNvbGxlY3Rpb24pIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAdXBkYXRlVUkoKVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAY29uZmlnQnV0dG9uLm9uICdjbGljaycsIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuICdhdG9tOi8vY29uZmlnL3BhY2thZ2VzL3RvZG8tc2hvdydcbiAgICBAY2xvc2VCdXR0b24ub24gJ2NsaWNrJywgPT5cbiAgICAgIEBwYXJlbnQoKS5zbGlkZVRvZ2dsZSgpXG4gICAgQGF1dG9SZWZyZXNoQ2hlY2tib3gub24gJ2NsaWNrJywgKGV2ZW50KSA9PlxuICAgICAgQGF1dG9SZWZyZXNoQ2hhbmdlKGV2ZW50LnRhcmdldC5jaGVja2VkKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICd0b2RvLXNob3cuYXV0b1JlZnJlc2gnLCAobmV3VmFsdWUpID0+XG4gICAgICBAYXV0b1JlZnJlc2hDaGVja2JveC5jb250ZXh0Py5jaGVja2VkID0gbmV3VmFsdWVcblxuICBkZXRhY2g6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG4gIHVwZGF0ZVNob3dJblRhYmxlOiA9PlxuICAgIHNob3dJblRhYmxlID0gQHNvcnRhYmxlLnRvQXJyYXkoKVxuICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93LnNob3dJblRhYmxlJywgc2hvd0luVGFibGUpXG5cbiAgdXBkYXRlVUk6IC0+XG4gICAgdGFibGVJdGVtcyA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNob3dJblRhYmxlJylcbiAgICBmb3IgaXRlbSBpbiBAY29sbGVjdGlvbi5nZXRBdmFpbGFibGVUYWJsZUl0ZW1zKClcbiAgICAgIGlmIHRhYmxlSXRlbXMuaW5kZXhPZihpdGVtKSBpcyAtMVxuICAgICAgICBAaXRlbXNPZmZUYWJsZS5hcHBlbmQgbmV3IEl0ZW1WaWV3KGl0ZW0pXG4gICAgICBlbHNlXG4gICAgICAgIEBpdGVtc09uVGFibGUuYXBwZW5kIG5ldyBJdGVtVmlldyhpdGVtKVxuXG4gICAgU29ydGFibGUgPSByZXF1aXJlICdzb3J0YWJsZWpzJ1xuXG4gICAgQHNvcnRhYmxlID0gU29ydGFibGUuY3JlYXRlKFxuICAgICAgQGl0ZW1zT25UYWJsZS5jb250ZXh0XG4gICAgICBncm91cDogJ3RhYmxlSXRlbXMnXG4gICAgICBnaG9zdENsYXNzOiAnZ2hvc3QnXG4gICAgICBvblNvcnQ6IEB1cGRhdGVTaG93SW5UYWJsZVxuICAgIClcblxuICAgIFNvcnRhYmxlLmNyZWF0ZShcbiAgICAgIEBpdGVtc09mZlRhYmxlLmNvbnRleHRcbiAgICAgIGdyb3VwOiAndGFibGVJdGVtcydcbiAgICAgIGdob3N0Q2xhc3M6ICdnaG9zdCdcbiAgICApXG5cbiAgICBmb3IgdG9kbyBpbiB0b2RvcyA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICAgIEBmaW5kVG9kb0Rpdi5hcHBlbmQgbmV3IENvZGVWaWV3KHRvZG8pXG5cbiAgICByZWdleCA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRVc2luZ1JlZ2V4JylcbiAgICBAZmluZFJlZ2V4RGl2LmFwcGVuZCBuZXcgQ29kZVZpZXcocmVnZXgucmVwbGFjZSgnJHtUT0RPU30nLCB0b2Rvcy5qb2luKCd8JykpKVxuXG4gICAgZm9yIHBhdGggaW4gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycpXG4gICAgICBAaWdub3JlUGF0aERpdi5hcHBlbmQgbmV3IENvZGVWaWV3KHBhdGgpXG5cbiAgYXV0b1JlZnJlc2hDaGFuZ2U6IChzdGF0ZSkgLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5hdXRvUmVmcmVzaCcsIHN0YXRlKVxuIl19
