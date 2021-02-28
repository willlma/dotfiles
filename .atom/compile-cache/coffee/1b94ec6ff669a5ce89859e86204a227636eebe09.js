(function() {
  var Emitter, TodoCollection, TodoModel, TodoRegex, TodosMarkdown, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  TodoModel = require('./todo-model');

  TodosMarkdown = require('./todo-markdown');

  TodoRegex = require('./todo-regex');

  module.exports = TodoCollection = (function() {
    function TodoCollection() {
      this.emitter = new Emitter;
      this.defaultKey = 'Text';
      this.scope = 'workspace';
      this.todos = [];
    }

    TodoCollection.prototype.onDidAddTodo = function(cb) {
      return this.emitter.on('did-add-todo', cb);
    };

    TodoCollection.prototype.onDidRemoveTodo = function(cb) {
      return this.emitter.on('did-remove-todo', cb);
    };

    TodoCollection.prototype.onDidClear = function(cb) {
      return this.emitter.on('did-clear-todos', cb);
    };

    TodoCollection.prototype.onDidStartSearch = function(cb) {
      return this.emitter.on('did-start-search', cb);
    };

    TodoCollection.prototype.onDidSearchPaths = function(cb) {
      return this.emitter.on('did-search-paths', cb);
    };

    TodoCollection.prototype.onDidFinishSearch = function(cb) {
      return this.emitter.on('did-finish-search', cb);
    };

    TodoCollection.prototype.onDidCancelSearch = function(cb) {
      return this.emitter.on('did-cancel-search', cb);
    };

    TodoCollection.prototype.onDidFailSearch = function(cb) {
      return this.emitter.on('did-fail-search', cb);
    };

    TodoCollection.prototype.onDidSortTodos = function(cb) {
      return this.emitter.on('did-sort-todos', cb);
    };

    TodoCollection.prototype.onDidFilterTodos = function(cb) {
      return this.emitter.on('did-filter-todos', cb);
    };

    TodoCollection.prototype.onDidChangeSearchScope = function(cb) {
      return this.emitter.on('did-change-scope', cb);
    };

    TodoCollection.prototype.clear = function() {
      this.cancelSearch();
      this.todos = [];
      return this.emitter.emit('did-clear-todos');
    };

    TodoCollection.prototype.addTodo = function(todo) {
      if (this.alreadyExists(todo)) {
        return;
      }
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodoCollection.prototype.getTodos = function() {
      return this.todos;
    };

    TodoCollection.prototype.getTodosCount = function() {
      return this.todos.length;
    };

    TodoCollection.prototype.getState = function() {
      return this.searching;
    };

    TodoCollection.prototype.sortTodos = function(arg) {
      var ref, ref1, sortAsc, sortBy;
      ref = arg != null ? arg : {}, sortBy = ref.sortBy, sortAsc = ref.sortAsc;
      if (sortBy == null) {
        sortBy = this.defaultKey;
      }
      if (((ref1 = this.searches) != null ? ref1[this.searches.length - 1].sortBy : void 0) !== sortBy) {
        if (this.searches == null) {
          this.searches = [];
        }
        this.searches.push({
          sortBy: sortBy,
          sortAsc: sortAsc
        });
      } else {
        this.searches[this.searches.length - 1] = {
          sortBy: sortBy,
          sortAsc: sortAsc
        };
      }
      this.todos = this.todos.sort((function(_this) {
        return function(todoA, todoB) {
          return _this.todoSorter(todoA, todoB, sortBy, sortAsc);
        };
      })(this));
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodoCollection.prototype.todoSorter = function(todoA, todoB, sortBy, sortAsc) {
      var aVal, bVal, comp, findTheseTodos, ref, ref1, ref2, ref3, search, sortAsc2, sortBy2;
      ref = [sortBy, sortAsc], sortBy2 = ref[0], sortAsc2 = ref[1];
      aVal = todoA.get(sortBy2);
      bVal = todoB.get(sortBy2);
      if (aVal === bVal) {
        if (search = (ref1 = this.searches) != null ? ref1[this.searches.length - 2] : void 0) {
          ref2 = [search.sortBy, search.sortAsc], sortBy2 = ref2[0], sortAsc2 = ref2[1];
        } else {
          sortBy2 = this.defaultKey;
        }
        ref3 = [todoA.get(sortBy2), todoB.get(sortBy2)], aVal = ref3[0], bVal = ref3[1];
      }
      if (sortBy2 === 'Type') {
        findTheseTodos = atom.config.get('todo-show.findTheseTodos');
        comp = findTheseTodos.indexOf(aVal) - findTheseTodos.indexOf(bVal);
      } else if (todoA.keyIsNumber(sortBy2)) {
        comp = parseInt(aVal) - parseInt(bVal);
      } else {
        comp = aVal.localeCompare(bVal);
      }
      if (sortAsc2) {
        return comp;
      } else {
        return -comp;
      }
    };

    TodoCollection.prototype.filterTodos = function(filter) {
      this.filter = filter;
      return this.emitter.emit('did-filter-todos', this.getFilteredTodos());
    };

    TodoCollection.prototype.getFilteredTodos = function() {
      var filter;
      if (!(filter = this.filter)) {
        return this.todos;
      }
      return this.todos.filter(function(todo) {
        return todo.contains(filter);
      });
    };

    TodoCollection.prototype.getAvailableTableItems = function() {
      return this.availableItems;
    };

    TodoCollection.prototype.setAvailableTableItems = function(availableItems) {
      this.availableItems = availableItems;
    };

    TodoCollection.prototype.getSearchScope = function() {
      return this.scope;
    };

    TodoCollection.prototype.setSearchScope = function(scope) {
      return this.emitter.emit('did-change-scope', this.scope = scope);
    };

    TodoCollection.prototype.toggleSearchScope = function() {
      var scope;
      scope = (function() {
        switch (this.scope) {
          case 'workspace':
            return 'project';
          case 'project':
            return 'open';
          case 'open':
            return 'active';
          default:
            return 'workspace';
        }
      }).call(this);
      this.setSearchScope(scope);
      return scope;
    };

    TodoCollection.prototype.getCustomPath = function() {
      return this.customPath;
    };

    TodoCollection.prototype.setCustomPath = function(customPath) {
      this.customPath = customPath;
    };

    TodoCollection.prototype.alreadyExists = function(newTodo) {
      var properties;
      properties = ['range', 'path'];
      return this.todos.some(function(todo) {
        return properties.every(function(prop) {
          if (todo[prop] === newTodo[prop]) {
            return true;
          }
        });
      });
    };

    TodoCollection.prototype.fetchRegexItem = function(todoRegex, activeProjectOnly) {
      var options;
      options = {
        paths: this.getSearchPaths(),
        onPathsSearched: (function(_this) {
          return function(nPaths) {
            if (_this.searching) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this)
      };
      return atom.workspace.scan(todoRegex.regexp, options, (function(_this) {
        return function(result, error) {
          var i, len, match, ref, results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          if (activeProjectOnly && !_this.activeProjectHas(result.filePath)) {
            return;
          }
          ref = result.matches;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            match = ref[i];
            results.push(_this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: result.filePath,
              position: match.range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            })));
          }
          return results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(todoRegex, activeEditorOnly) {
      var editor, editors, i, len;
      editors = [];
      if (activeEditorOnly) {
        if (editor = atom.workspace.getActiveTextEditor()) {
          editors = [editor];
        }
      } else {
        editors = atom.workspace.getTextEditors();
      }
      for (i = 0, len = editors.length; i < len; i++) {
        editor = editors[i];
        editor.scan(todoRegex.regexp, (function(_this) {
          return function(match, error) {
            var range;
            if (error) {
              console.debug(error.message);
            }
            if (!match) {
              return;
            }
            range = [[match.range.start.row, match.range.start.column], [match.range.end.row, match.range.end.column]];
            return _this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: editor.getPath(),
              position: range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodoCollection.prototype.search = function(force) {
      var todoRegex;
      if (force == null) {
        force = false;
      }
      if (!atom.config.get('todo-show.autoRefresh') && !force) {
        return;
      }
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      todoRegex = new TodoRegex(atom.config.get('todo-show.findUsingRegex'), atom.config.get('todo-show.findTheseTodos'));
      if (todoRegex.error) {
        this.emitter.emit('did-fail-search', "Invalid todo search regex");
        return;
      }
      this.searchPromise = (function() {
        switch (this.scope) {
          case 'open':
            return this.fetchOpenRegexItem(todoRegex, false);
          case 'active':
            return this.fetchOpenRegexItem(todoRegex, true);
          case 'project':
            return this.fetchRegexItem(todoRegex, true);
          default:
            return this.fetchRegexItem(todoRegex);
        }
      }).call(this);
      return this.searchPromise.then((function(_this) {
        return function(result) {
          _this.searching = false;
          if (result === 'cancelled') {
            return _this.emitter.emit('did-cancel-search');
          } else {
            return _this.emitter.emit('did-finish-search');
          }
        };
      })(this))["catch"]((function(_this) {
        return function(reason) {
          _this.searching = false;
          return _this.emitter.emit('did-fail-search', reason);
        };
      })(this));
    };

    TodoCollection.prototype.getSearchPaths = function() {
      var i, ignore, ignores, len, results;
      if (this.scope === 'custom') {
        return [this.getCustomPath()];
      }
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.emitter.emit('did-fail-search', "ignoreThesePaths must be an array");
        return ['*'];
      }
      results = [];
      for (i = 0, len = ignores.length; i < len; i++) {
        ignore = ignores[i];
        results.push("!" + ignore);
      }
      return results;
    };

    TodoCollection.prototype.activeProjectHas = function(filePath) {
      var project;
      if (filePath == null) {
        filePath = '';
      }
      if (!(project = this.getActiveProject())) {
        return;
      }
      return filePath.indexOf(project) === 0;
    };

    TodoCollection.prototype.getActiveProject = function() {
      var project;
      if (this.activeProject) {
        return this.activeProject;
      }
      if (project = this.getFallbackProject()) {
        return this.activeProject = project;
      }
    };

    TodoCollection.prototype.getFallbackProject = function() {
      var i, item, len, project, ref;
      ref = atom.workspace.getPaneItems();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (project = this.projectForFile(typeof item.getPath === "function" ? item.getPath() : void 0)) {
          return project;
        }
      }
      if (project = atom.project.getPaths()[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getActiveProjectName = function() {
      var project, projectName;
      if (!(project = this.getActiveProject())) {
        return 'no active project';
      }
      projectName = path.basename(project);
      if (projectName === 'undefined') {
        return "no active project";
      } else {
        return projectName;
      }
    };

    TodoCollection.prototype.setActiveProject = function(filePath) {
      var lastProject, project;
      lastProject = this.activeProject;
      if (project = this.projectForFile(filePath)) {
        this.activeProject = project;
      }
      if (!lastProject) {
        return false;
      }
      return lastProject !== this.activeProject;
    };

    TodoCollection.prototype.projectForFile = function(filePath) {
      var project;
      if (typeof filePath !== 'string') {
        return;
      }
      if (project = atom.project.relativizePath(filePath)[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getMarkdown = function() {
      var todosMarkdown;
      todosMarkdown = new TodosMarkdown;
      return todosMarkdown.markdown(this.getFilteredTodos());
    };

    TodoCollection.prototype.cancelSearch = function() {
      var ref;
      return (ref = this.searchPromise) != null ? typeof ref.cancel === "function" ? ref.cancel() : void 0 : void 0;
    };

    TodoCollection.prototype.getPreviousSearch = function() {
      var sortBy;
      return sortBy = localStorage.getItem('todo-show.previous-sortBy');
    };

    TodoCollection.prototype.setPreviousSearch = function(search) {
      return localStorage.setItem('todo-show.previous-search', search);
    };

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWNvbGxlY3Rpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sVUFBVyxPQUFBLENBQVEsTUFBUjs7RUFFWixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBQ1osYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVI7O0VBQ2hCLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1Msd0JBQUE7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxLQUFELEdBQVM7SUFKRTs7NkJBTWIsWUFBQSxHQUFjLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGNBQVosRUFBNEIsRUFBNUI7SUFBUjs7NkJBQ2QsZUFBQSxHQUFpQixTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQjtJQUFSOzs2QkFDakIsVUFBQSxHQUFZLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGlCQUFaLEVBQStCLEVBQS9CO0lBQVI7OzZCQUNaLGdCQUFBLEdBQWtCLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGtCQUFaLEVBQWdDLEVBQWhDO0lBQVI7OzZCQUNsQixnQkFBQSxHQUFrQixTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxFQUFoQztJQUFSOzs2QkFD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b0IsV0FBcEI7QUFBQSxlQUFPLE1BQVA7O2FBQ0EsV0FBQSxLQUFpQixJQUFDLENBQUE7SUFKRjs7NkJBTWxCLGNBQUEsR0FBZ0IsU0FBQyxRQUFEO0FBQ2QsVUFBQTtNQUFBLElBQVUsT0FBTyxRQUFQLEtBQXFCLFFBQS9CO0FBQUEsZUFBQTs7TUFDQSxJQUFXLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsUUFBNUIsQ0FBc0MsQ0FBQSxDQUFBLENBQTNEO2VBQUEsUUFBQTs7SUFGYzs7NkJBSWhCLFdBQUEsR0FBYSxTQUFBO0FBQ1gsVUFBQTtNQUFBLGFBQUEsR0FBZ0IsSUFBSTthQUNwQixhQUFhLENBQUMsUUFBZCxDQUF1QixJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUF2QjtJQUZXOzs2QkFJYixZQUFBLEdBQWMsU0FBQTtBQUNaLFVBQUE7d0ZBQWMsQ0FBRTtJQURKOzs2QkFJZCxpQkFBQSxHQUFtQixTQUFBO0FBQ2pCLFVBQUE7YUFBQSxNQUFBLEdBQVMsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsMkJBQXJCO0lBRFE7OzZCQUduQixpQkFBQSxHQUFtQixTQUFDLE1BQUQ7YUFDakIsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsMkJBQXJCLEVBQWtELE1BQWxEO0lBRGlCOzs7OztBQTlQckIiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbntFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG5cblRvZG9Nb2RlbCA9IHJlcXVpcmUgJy4vdG9kby1tb2RlbCdcblRvZG9zTWFya2Rvd24gPSByZXF1aXJlICcuL3RvZG8tbWFya2Rvd24nXG5Ub2RvUmVnZXggPSByZXF1aXJlICcuL3RvZG8tcmVnZXgnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRvZG9Db2xsZWN0aW9uXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAZGVmYXVsdEtleSA9ICdUZXh0J1xuICAgIEBzY29wZSA9ICd3b3Jrc3BhY2UnXG4gICAgQHRvZG9zID0gW11cblxuICBvbkRpZEFkZFRvZG86IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1hZGQtdG9kbycsIGNiXG4gIG9uRGlkUmVtb3ZlVG9kbzogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLXJlbW92ZS10b2RvJywgY2JcbiAgb25EaWRDbGVhcjogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWNsZWFyLXRvZG9zJywgY2JcbiAgb25EaWRTdGFydFNlYXJjaDogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLXN0YXJ0LXNlYXJjaCcsIGNiXG4gIG9uRGlkU2VhcmNoUGF0aHM6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1zZWFyY2gtcGF0aHMnLCBjYlxuICBvbkRpZEZpbmlzaFNlYXJjaDogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWZpbmlzaC1zZWFyY2gnLCBjYlxuICBvbkRpZENhbmNlbFNlYXJjaDogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWNhbmNlbC1zZWFyY2gnLCBjYlxuICBvbkRpZEZhaWxTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1mYWlsLXNlYXJjaCcsIGNiXG4gIG9uRGlkU29ydFRvZG9zOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtc29ydC10b2RvcycsIGNiXG4gIG9uRGlkRmlsdGVyVG9kb3M6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1maWx0ZXItdG9kb3MnLCBjYlxuICBvbkRpZENoYW5nZVNlYXJjaFNjb3BlOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtY2hhbmdlLXNjb3BlJywgY2JcblxuICBjbGVhcjogLT5cbiAgICBAY2FuY2VsU2VhcmNoKClcbiAgICBAdG9kb3MgPSBbXVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jbGVhci10b2RvcydcblxuICBhZGRUb2RvOiAodG9kbykgLT5cbiAgICByZXR1cm4gaWYgQGFscmVhZHlFeGlzdHModG9kbylcbiAgICBAdG9kb3MucHVzaCh0b2RvKVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtdG9kbycsIHRvZG9cblxuICBnZXRUb2RvczogLT4gQHRvZG9zXG4gIGdldFRvZG9zQ291bnQ6IC0+IEB0b2Rvcy5sZW5ndGhcbiAgZ2V0U3RhdGU6IC0+IEBzZWFyY2hpbmdcblxuICBzb3J0VG9kb3M6ICh7c29ydEJ5LCBzb3J0QXNjfSA9IHt9KSAtPlxuICAgIHNvcnRCeSA/PSBAZGVmYXVsdEtleVxuXG4gICAgIyBTYXZlIGhpc3Rvcnkgb2YgbmV3IHNvcnQgZWxlbWVudHNcbiAgICBpZiBAc2VhcmNoZXM/W0BzZWFyY2hlcy5sZW5ndGggLSAxXS5zb3J0QnkgaXNudCBzb3J0QnlcbiAgICAgIEBzZWFyY2hlcyA/PSBbXVxuICAgICAgQHNlYXJjaGVzLnB1c2gge3NvcnRCeSwgc29ydEFzY31cbiAgICBlbHNlXG4gICAgICBAc2VhcmNoZXNbQHNlYXJjaGVzLmxlbmd0aCAtIDFdID0ge3NvcnRCeSwgc29ydEFzY31cblxuICAgIEB0b2RvcyA9IEB0b2Rvcy5zb3J0KCh0b2RvQSwgdG9kb0IpID0+XG4gICAgICBAdG9kb1NvcnRlcih0b2RvQSwgdG9kb0IsIHNvcnRCeSwgc29ydEFzYylcbiAgICApXG5cbiAgICByZXR1cm4gQGZpbHRlclRvZG9zKEBmaWx0ZXIpIGlmIEBmaWx0ZXJcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtc29ydC10b2RvcycsIEB0b2Rvc1xuXG4gIHRvZG9Tb3J0ZXI6ICh0b2RvQSwgdG9kb0IsIHNvcnRCeSwgc29ydEFzYykgLT5cbiAgICBbc29ydEJ5Miwgc29ydEFzYzJdID0gW3NvcnRCeSwgc29ydEFzY11cblxuICAgIGFWYWwgPSB0b2RvQS5nZXQoc29ydEJ5MilcbiAgICBiVmFsID0gdG9kb0IuZ2V0KHNvcnRCeTIpXG5cbiAgICBpZiBhVmFsIGlzIGJWYWxcbiAgICAgICMgVXNlIHByZXZpb3VzIHNvcnRzIHRvIG1ha2UgYSAyLWxldmVsIHN0YWJsZSBzb3J0XG4gICAgICBpZiBzZWFyY2ggPSBAc2VhcmNoZXM/W0BzZWFyY2hlcy5sZW5ndGggLSAyXVxuICAgICAgICBbc29ydEJ5Miwgc29ydEFzYzJdID0gW3NlYXJjaC5zb3J0QnksIHNlYXJjaC5zb3J0QXNjXVxuICAgICAgZWxzZVxuICAgICAgICBzb3J0QnkyID0gQGRlZmF1bHRLZXlcblxuICAgICAgW2FWYWwsIGJWYWxdID0gW3RvZG9BLmdldChzb3J0QnkyKSwgdG9kb0IuZ2V0KHNvcnRCeTIpXVxuXG4gICAgIyBTb3J0IHR5cGUgaW4gdGhlIGRlZmluZWQgb3JkZXIsIGFzIG51bWJlciBvciBub3JtYWwgc3RyaW5nIHNvcnRcbiAgICBpZiBzb3J0QnkyIGlzICdUeXBlJ1xuICAgICAgZmluZFRoZXNlVG9kb3MgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVGhlc2VUb2RvcycpXG4gICAgICBjb21wID0gZmluZFRoZXNlVG9kb3MuaW5kZXhPZihhVmFsKSAtIGZpbmRUaGVzZVRvZG9zLmluZGV4T2YoYlZhbClcbiAgICBlbHNlIGlmIHRvZG9BLmtleUlzTnVtYmVyKHNvcnRCeTIpXG4gICAgICBjb21wID0gcGFyc2VJbnQoYVZhbCkgLSBwYXJzZUludChiVmFsKVxuICAgIGVsc2VcbiAgICAgIGNvbXAgPSBhVmFsLmxvY2FsZUNvbXBhcmUoYlZhbClcbiAgICBpZiBzb3J0QXNjMiB0aGVuIGNvbXAgZWxzZSAtY29tcFxuXG4gIGZpbHRlclRvZG9zOiAoZmlsdGVyKSAtPlxuICAgIEBmaWx0ZXIgPSBmaWx0ZXJcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtZmlsdGVyLXRvZG9zJywgQGdldEZpbHRlcmVkVG9kb3MoKVxuXG4gIGdldEZpbHRlcmVkVG9kb3M6IC0+XG4gICAgcmV0dXJuIEB0b2RvcyB1bmxlc3MgZmlsdGVyID0gQGZpbHRlclxuICAgIEB0b2Rvcy5maWx0ZXIgKHRvZG8pIC0+XG4gICAgICB0b2RvLmNvbnRhaW5zKGZpbHRlcilcblxuICBnZXRBdmFpbGFibGVUYWJsZUl0ZW1zOiAtPiBAYXZhaWxhYmxlSXRlbXNcbiAgc2V0QXZhaWxhYmxlVGFibGVJdGVtczogKEBhdmFpbGFibGVJdGVtcykgLT5cblxuICBnZXRTZWFyY2hTY29wZTogLT4gQHNjb3BlXG4gIHNldFNlYXJjaFNjb3BlOiAoc2NvcGUpIC0+XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS1zY29wZScsIEBzY29wZSA9IHNjb3BlXG5cbiAgdG9nZ2xlU2VhcmNoU2NvcGU6IC0+XG4gICAgc2NvcGUgPSBzd2l0Y2ggQHNjb3BlXG4gICAgICB3aGVuICd3b3Jrc3BhY2UnIHRoZW4gJ3Byb2plY3QnXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuICdvcGVuJ1xuICAgICAgd2hlbiAnb3BlbicgdGhlbiAnYWN0aXZlJ1xuICAgICAgZWxzZSAnd29ya3NwYWNlJ1xuICAgIEBzZXRTZWFyY2hTY29wZShzY29wZSlcbiAgICBzY29wZVxuXG4gIGdldEN1c3RvbVBhdGg6IC0+IEBjdXN0b21QYXRoXG4gIHNldEN1c3RvbVBhdGg6IChAY3VzdG9tUGF0aCkgLT5cblxuICBhbHJlYWR5RXhpc3RzOiAobmV3VG9kbykgLT5cbiAgICBwcm9wZXJ0aWVzID0gWydyYW5nZScsICdwYXRoJ11cbiAgICBAdG9kb3Muc29tZSAodG9kbykgLT5cbiAgICAgIHByb3BlcnRpZXMuZXZlcnkgKHByb3ApIC0+XG4gICAgICAgIHRydWUgaWYgdG9kb1twcm9wXSBpcyBuZXdUb2RvW3Byb3BdXG5cbiAgIyBTY2FuIHByb2plY3Qgd29ya3NwYWNlIGZvciB0aGUgVG9kb1JlZ2V4IG9iamVjdFxuICAjIHJldHVybnMgYSBwcm9taXNlIHRoYXQgdGhlIHNjYW4gZ2VuZXJhdGVzXG4gIGZldGNoUmVnZXhJdGVtOiAodG9kb1JlZ2V4LCBhY3RpdmVQcm9qZWN0T25seSkgLT5cbiAgICBvcHRpb25zID1cbiAgICAgIHBhdGhzOiBAZ2V0U2VhcmNoUGF0aHMoKVxuICAgICAgb25QYXRoc1NlYXJjaGVkOiAoblBhdGhzKSA9PlxuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtc2VhcmNoLXBhdGhzJywgblBhdGhzIGlmIEBzZWFyY2hpbmdcblxuICAgIGF0b20ud29ya3NwYWNlLnNjYW4gdG9kb1JlZ2V4LnJlZ2V4cCwgb3B0aW9ucywgKHJlc3VsdCwgZXJyb3IpID0+XG4gICAgICBjb25zb2xlLmRlYnVnIGVycm9yLm1lc3NhZ2UgaWYgZXJyb3JcbiAgICAgIHJldHVybiB1bmxlc3MgcmVzdWx0XG5cbiAgICAgIHJldHVybiBpZiBhY3RpdmVQcm9qZWN0T25seSBhbmQgbm90IEBhY3RpdmVQcm9qZWN0SGFzKHJlc3VsdC5maWxlUGF0aClcblxuICAgICAgZm9yIG1hdGNoIGluIHJlc3VsdC5tYXRjaGVzXG4gICAgICAgIEBhZGRUb2RvIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgICAgYWxsOiBtYXRjaC5saW5lVGV4dFxuICAgICAgICAgIHRleHQ6IG1hdGNoLm1hdGNoVGV4dFxuICAgICAgICAgIGxvYzogcmVzdWx0LmZpbGVQYXRoXG4gICAgICAgICAgcG9zaXRpb246IG1hdGNoLnJhbmdlXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG5cbiAgIyBTY2FuIG9wZW4gZmlsZXMgZm9yIHRoZSBUb2RvUmVnZXggb2JqZWN0XG4gIGZldGNoT3BlblJlZ2V4SXRlbTogKHRvZG9SZWdleCwgYWN0aXZlRWRpdG9yT25seSkgLT5cbiAgICBlZGl0b3JzID0gW11cbiAgICBpZiBhY3RpdmVFZGl0b3JPbmx5XG4gICAgICBpZiBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZWRpdG9ycyA9IFtlZGl0b3JdXG4gICAgZWxzZVxuICAgICAgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcblxuICAgIGZvciBlZGl0b3IgaW4gZWRpdG9yc1xuICAgICAgZWRpdG9yLnNjYW4gdG9kb1JlZ2V4LnJlZ2V4cCwgKG1hdGNoLCBlcnJvcikgPT5cbiAgICAgICAgY29uc29sZS5kZWJ1ZyBlcnJvci5tZXNzYWdlIGlmIGVycm9yXG4gICAgICAgIHJldHVybiB1bmxlc3MgbWF0Y2hcblxuICAgICAgICByYW5nZSA9IFtcbiAgICAgICAgICBbbWF0Y2gucmFuZ2Uuc3RhcnQucm93LCBtYXRjaC5yYW5nZS5zdGFydC5jb2x1bW5dXG4gICAgICAgICAgW21hdGNoLnJhbmdlLmVuZC5yb3csIG1hdGNoLnJhbmdlLmVuZC5jb2x1bW5dXG4gICAgICAgIF1cblxuICAgICAgICBAYWRkVG9kbyBuZXcgVG9kb01vZGVsKFxuICAgICAgICAgIGFsbDogbWF0Y2gubGluZVRleHRcbiAgICAgICAgICB0ZXh0OiBtYXRjaC5tYXRjaFRleHRcbiAgICAgICAgICBsb2M6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICBwb3NpdGlvbjogcmFuZ2VcbiAgICAgICAgICByZWdleDogdG9kb1JlZ2V4LnJlZ2V4XG4gICAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICAgIClcblxuICAgICMgTm8gYXN5bmMgb3BlcmF0aW9ucywgc28ganVzdCByZXR1cm4gYSByZXNvbHZlZCBwcm9taXNlXG4gICAgUHJvbWlzZS5yZXNvbHZlKClcblxuICBzZWFyY2g6IChmb3JjZSA9IGZhbHNlKSAtPlxuICAgIHJldHVybiBpZiAhYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuYXV0b1JlZnJlc2gnKSBhbmQgIWZvcmNlXG5cbiAgICBAY2xlYXIoKVxuICAgIEBzZWFyY2hpbmcgPSB0cnVlXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXN0YXJ0LXNlYXJjaCdcblxuICAgIHRvZG9SZWdleCA9IG5ldyBUb2RvUmVnZXgoXG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVXNpbmdSZWdleCcpXG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVGhlc2VUb2RvcycpXG4gICAgKVxuXG4gICAgaWYgdG9kb1JlZ2V4LmVycm9yXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtZmFpbC1zZWFyY2gnLCBcIkludmFsaWQgdG9kbyBzZWFyY2ggcmVnZXhcIlxuICAgICAgcmV0dXJuXG5cbiAgICBAc2VhcmNoUHJvbWlzZSA9IHN3aXRjaCBAc2NvcGVcbiAgICAgIHdoZW4gJ29wZW4nIHRoZW4gQGZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgsIGZhbHNlKVxuICAgICAgd2hlbiAnYWN0aXZlJyB0aGVuIEBmZXRjaE9wZW5SZWdleEl0ZW0odG9kb1JlZ2V4LCB0cnVlKVxuICAgICAgd2hlbiAncHJvamVjdCcgdGhlbiBAZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4LCB0cnVlKVxuICAgICAgZWxzZSBAZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuXG4gICAgQHNlYXJjaFByb21pc2UudGhlbiAocmVzdWx0KSA9PlxuICAgICAgQHNlYXJjaGluZyA9IGZhbHNlXG4gICAgICBpZiByZXN1bHQgaXMgJ2NhbmNlbGxlZCdcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNhbmNlbC1zZWFyY2gnXG4gICAgICBlbHNlXG4gICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1maW5pc2gtc2VhcmNoJ1xuICAgIC5jYXRjaCAocmVhc29uKSA9PlxuICAgICAgQHNlYXJjaGluZyA9IGZhbHNlXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtZmFpbC1zZWFyY2gnLCByZWFzb25cblxuICBnZXRTZWFyY2hQYXRoczogLT5cbiAgICByZXR1cm4gW0BnZXRDdXN0b21QYXRoKCldIGlmIEBzY29wZSBpcyAnY3VzdG9tJ1xuXG4gICAgaWdub3JlcyA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93Lmlnbm9yZVRoZXNlUGF0aHMnKVxuICAgIHJldHVybiBbJyonXSB1bmxlc3MgaWdub3Jlcz9cbiAgICBpZiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaWdub3JlcykgaXNudCAnW29iamVjdCBBcnJheV0nXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtZmFpbC1zZWFyY2gnLCBcImlnbm9yZVRoZXNlUGF0aHMgbXVzdCBiZSBhbiBhcnJheVwiXG4gICAgICByZXR1cm4gWycqJ11cbiAgICBcIiEje2lnbm9yZX1cIiBmb3IgaWdub3JlIGluIGlnbm9yZXNcblxuICBhY3RpdmVQcm9qZWN0SGFzOiAoZmlsZVBhdGggPSAnJykgLT5cbiAgICByZXR1cm4gdW5sZXNzIHByb2plY3QgPSBAZ2V0QWN0aXZlUHJvamVjdCgpXG4gICAgZmlsZVBhdGguaW5kZXhPZihwcm9qZWN0KSBpcyAwXG5cbiAgZ2V0QWN0aXZlUHJvamVjdDogLT5cbiAgICByZXR1cm4gQGFjdGl2ZVByb2plY3QgaWYgQGFjdGl2ZVByb2plY3RcbiAgICBAYWN0aXZlUHJvamVjdCA9IHByb2plY3QgaWYgcHJvamVjdCA9IEBnZXRGYWxsYmFja1Byb2plY3QoKVxuXG4gIGdldEZhbGxiYWNrUHJvamVjdDogLT5cbiAgICBmb3IgaXRlbSBpbiBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgICAgaWYgcHJvamVjdCA9IEBwcm9qZWN0Rm9yRmlsZShpdGVtLmdldFBhdGg/KCkpXG4gICAgICAgIHJldHVybiBwcm9qZWN0XG4gICAgcHJvamVjdCBpZiBwcm9qZWN0ID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cblxuICBnZXRBY3RpdmVQcm9qZWN0TmFtZTogLT5cbiAgICByZXR1cm4gJ25vIGFjdGl2ZSBwcm9qZWN0JyB1bmxlc3MgcHJvamVjdCA9IEBnZXRBY3RpdmVQcm9qZWN0KClcbiAgICBwcm9qZWN0TmFtZSA9IHBhdGguYmFzZW5hbWUocHJvamVjdClcbiAgICBpZiBwcm9qZWN0TmFtZSBpcyAndW5kZWZpbmVkJyB0aGVuIFwibm8gYWN0aXZlIHByb2plY3RcIiBlbHNlIHByb2plY3ROYW1lXG5cbiAgc2V0QWN0aXZlUHJvamVjdDogKGZpbGVQYXRoKSAtPlxuICAgIGxhc3RQcm9qZWN0ID0gQGFjdGl2ZVByb2plY3RcbiAgICBAYWN0aXZlUHJvamVjdCA9IHByb2plY3QgaWYgcHJvamVjdCA9IEBwcm9qZWN0Rm9yRmlsZShmaWxlUGF0aClcbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGxhc3RQcm9qZWN0XG4gICAgbGFzdFByb2plY3QgaXNudCBAYWN0aXZlUHJvamVjdFxuXG4gIHByb2plY3RGb3JGaWxlOiAoZmlsZVBhdGgpIC0+XG4gICAgcmV0dXJuIGlmIHR5cGVvZiBmaWxlUGF0aCBpc250ICdzdHJpbmcnXG4gICAgcHJvamVjdCBpZiBwcm9qZWN0ID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVswXVxuXG4gIGdldE1hcmtkb3duOiAtPlxuICAgIHRvZG9zTWFya2Rvd24gPSBuZXcgVG9kb3NNYXJrZG93blxuICAgIHRvZG9zTWFya2Rvd24ubWFya2Rvd24gQGdldEZpbHRlcmVkVG9kb3MoKVxuXG4gIGNhbmNlbFNlYXJjaDogLT5cbiAgICBAc2VhcmNoUHJvbWlzZT8uY2FuY2VsPygpXG5cbiAgIyBUT0RPOiBQcmV2aW91cyBzZWFyY2hlcyBhcmUgbm90IHNhdmVkIHlldCFcbiAgZ2V0UHJldmlvdXNTZWFyY2g6IC0+XG4gICAgc29ydEJ5ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0gJ3RvZG8tc2hvdy5wcmV2aW91cy1zb3J0QnknXG5cbiAgc2V0UHJldmlvdXNTZWFyY2g6IChzZWFyY2gpIC0+XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3RvZG8tc2hvdy5wcmV2aW91cy1zZWFyY2gnLCBzZWFyY2hcbiJdfQ==
