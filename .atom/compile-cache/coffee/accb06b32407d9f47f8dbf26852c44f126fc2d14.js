(function() {
  var CompositeDisposable, TabNumbersView, View,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = TabNumbersView = (function(superClass) {
    extend(TabNumbersView, superClass);

    function TabNumbersView() {
      this.update = bind(this.update, this);
      return TabNumbersView.__super__.constructor.apply(this, arguments);
    }

    TabNumbersView.prototype.nTodos = 0;

    TabNumbersView.content = function() {
      return this.div({
        "class": 'todo-status-bar-indicator inline-block',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.a({
            "class": 'inline-block'
          }, function() {
            _this.span({
              "class": 'icon icon-checklist'
            });
            return _this.span({
              outlet: 'todoCount'
            });
          });
        };
      })(this));
    };

    TabNumbersView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.on('click', this.element, this.activateTodoPackage);
      this.update();
      return this.disposables.add(this.collection.onDidFinishSearch(this.update));
    };

    TabNumbersView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.detach();
    };

    TabNumbersView.prototype.update = function() {
      var ref;
      this.nTodos = this.collection.getTodosCount();
      this.todoCount.text(this.nTodos);
      if ((ref = this.toolTipDisposable) != null) {
        ref.dispose();
      }
      return this.toolTipDisposable = atom.tooltips.add(this.element, {
        title: this.nTodos + " TODOs"
      });
    };

    TabNumbersView.prototype.activateTodoPackage = function() {
      return atom.commands.dispatch(this, 'todo-show:toggle');
    };

    return TabNumbersView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWluZGljYXRvci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTs7OztFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSOztFQUNSLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs7NkJBQ0osTUFBQSxHQUFROztJQUVSLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdDQUFQO1FBQWlELFFBQUEsRUFBVSxDQUFDLENBQTVEO09BQUwsRUFBb0UsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNsRSxLQUFDLENBQUEsQ0FBRCxDQUFHO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFQO1dBQUgsRUFBMEIsU0FBQTtZQUN4QixLQUFDLENBQUEsSUFBRCxDQUFNO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxxQkFBUDthQUFOO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07Y0FBQSxNQUFBLEVBQVEsV0FBUjthQUFOO1VBRndCLENBQTFCO1FBRGtFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRTtJQURROzs2QkFNVixVQUFBLEdBQVksU0FBQyxVQUFEO01BQUMsSUFBQyxDQUFBLGFBQUQ7TUFDWCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsSUFBSSxDQUFDLE9BQWxCLEVBQTJCLElBQUMsQ0FBQSxtQkFBNUI7TUFFQSxJQUFDLENBQUEsTUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsaUJBQVosQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLENBQWpCO0lBTFU7OzZCQU9aLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRk87OzZCQUlULE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxhQUFaLENBQUE7TUFDVixJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCOztXQUVrQixDQUFFLE9BQXBCLENBQUE7O2FBQ0EsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFBNEI7UUFBQSxLQUFBLEVBQVUsSUFBQyxDQUFBLE1BQUYsR0FBUyxRQUFsQjtPQUE1QjtJQUxmOzs2QkFPUixtQkFBQSxHQUFxQixTQUFBO2FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUF2QixFQUE2QixrQkFBN0I7SUFEbUI7Ozs7S0EzQk07QUFKN0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhYk51bWJlcnNWaWV3IGV4dGVuZHMgVmlld1xuICBuVG9kb3M6IDBcblxuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAndG9kby1zdGF0dXMtYmFyLWluZGljYXRvciBpbmxpbmUtYmxvY2snLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAYSBjbGFzczogJ2lubGluZS1ibG9jaycsID0+XG4gICAgICAgIEBzcGFuIGNsYXNzOiAnaWNvbiBpY29uLWNoZWNrbGlzdCdcbiAgICAgICAgQHNwYW4gb3V0bGV0OiAndG9kb0NvdW50J1xuXG4gIGluaXRpYWxpemU6IChAY29sbGVjdGlvbikgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBvbiAnY2xpY2snLCB0aGlzLmVsZW1lbnQsIEBhY3RpdmF0ZVRvZG9QYWNrYWdlXG5cbiAgICBAdXBkYXRlKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkRmluaXNoU2VhcmNoIEB1cGRhdGVcblxuICBkZXN0cm95OiAtPlxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBAZGV0YWNoKClcblxuICB1cGRhdGU6ID0+XG4gICAgQG5Ub2RvcyA9IEBjb2xsZWN0aW9uLmdldFRvZG9zQ291bnQoKVxuICAgIEB0b2RvQ291bnQudGV4dChAblRvZG9zKVxuXG4gICAgQHRvb2xUaXBEaXNwb3NhYmxlPy5kaXNwb3NlKClcbiAgICBAdG9vbFRpcERpc3Bvc2FibGUgPSBhdG9tLnRvb2x0aXBzLmFkZCBAZWxlbWVudCwgdGl0bGU6IFwiI3tAblRvZG9zfSBUT0RPc1wiXG5cbiAgYWN0aXZhdGVUb2RvUGFja2FnZTogLT5cbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRoaXMsICd0b2RvLXNob3c6dG9nZ2xlJylcbiJdfQ==
