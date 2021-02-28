(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, deprecatedTextEditor, fs, path, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextBuffer = ref.TextBuffer;

  ref1 = require('atom-space-pen-views'), ScrollView = ref1.ScrollView, TextEditorView = ref1.TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./todo-table-view');

  TodoOptions = require('./todo-options-view');

  deprecatedTextEditor = function(params) {
    var TextEditor;
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      TextEditor = require('atom').TextEditor;
      return new TextEditor(params);
    }
  };

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    ShowTodoView.content = function(collection, filterBuffer) {
      return this.div({
        "class": 'show-todo-preview',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'input-block'
          }, function() {
            _this.div({
              "class": 'input-block-item input-block-item--flex'
            });
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'scopeButton',
                  "class": 'btn'
                });
                _this.button({
                  outlet: 'optionsButton',
                  "class": 'btn icon-gear'
                });
                _this.button({
                  outlet: 'exportButton',
                  "class": 'btn icon-cloud-download'
                });
                return _this.button({
                  outlet: 'refreshButton',
                  "class": 'btn icon-sync'
                });
              });
            });
          });
          _this.div({
            "class": 'input-block todo-info-block'
          }, function() {
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.span({
                outlet: 'todoInfo'
              });
            });
          });
          _this.div({
            outlet: 'optionsView'
          });
          _this.div({
            outlet: 'todoLoading',
            "class": 'todo-loading'
          }, function() {
            _this.div({
              "class": 'markdown-spinner'
            });
            return _this.h5({
              outlet: 'searchCount',
              "class": 'text-center'
            }, "Loading Todos...");
          });
          return _this.subview('todoTable', new TodoTable(collection));
        };
      })(this));
    };

    function ShowTodoView(collection1, uri) {
      this.collection = collection1;
      this.uri = uri;
      this.toggleOptions = bind(this.toggleOptions, this);
      this.setScopeButtonState = bind(this.setScopeButtonState, this);
      this.toggleSearchScope = bind(this.toggleSearchScope, this);
      this["export"] = bind(this["export"], this);
      this.stopLoading = bind(this.stopLoading, this);
      this.startLoading = bind(this.startLoading, this);
      ShowTodoView.__super__.constructor.call(this, this.collection, this.filterBuffer = new TextBuffer);
    }

    ShowTodoView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.setScopeButtonState(this.collection.getSearchScope());
      this.onlySearchWhenVisible = true;
      this.notificationOptions = {
        detail: 'Atom todo-show package',
        dismissable: true,
        icon: this.getIconName()
      };
      this.checkDeprecation();
      this.disposables.add(atom.tooltips.add(this.scopeButton, {
        title: "What to Search"
      }));
      this.disposables.add(atom.tooltips.add(this.optionsButton, {
        title: "Show Todo Options"
      }));
      this.disposables.add(atom.tooltips.add(this.exportButton, {
        title: "Export Todos"
      }));
      return this.disposables.add(atom.tooltips.add(this.refreshButton, {
        title: "Refresh Todos"
      }));
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(atom.commands.add(this.element, {
        'core:export': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this["export"]();
          };
        })(this),
        'core:refresh': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.search(true);
          };
        })(this)
      }));
      this.disposables.add(this.collection.onDidStartSearch(this.startLoading));
      this.disposables.add(this.collection.onDidFinishSearch(this.stopLoading));
      this.disposables.add(this.collection.onDidFailSearch((function(_this) {
        return function(err) {
          _this.searchCount.text("Search Failed");
          if (err) {
            console.error(err);
          }
          if (err) {
            return _this.showError(err);
          }
        };
      })(this)));
      this.disposables.add(this.collection.onDidChangeSearchScope((function(_this) {
        return function(scope) {
          _this.setScopeButtonState(scope);
          return _this.search(true);
        };
      })(this)));
      this.disposables.add(this.collection.onDidSearchPaths((function(_this) {
        return function(nPaths) {
          return _this.searchCount.text(nPaths + " paths searched...");
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (_this.collection.setActiveProject(item != null ? typeof item.getPath === "function" ? item.getPath() : void 0 : void 0) || ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.collection.scope === 'active')) {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(arg) {
          var textEditor;
          textEditor = arg.textEditor;
          if (_this.collection.scope === 'open') {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          if (_this.collection.scope === 'open') {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            return _this.search();
          }));
        };
      })(this)));
      this.scopeButton.on('click', this.toggleSearchScope);
      this.optionsButton.on('click', this.toggleOptions);
      this.exportButton.on('click', this["export"]);
      return this.refreshButton.on('click', (function(_this) {
        return function() {
          return _this.search(true);
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      this.collection.cancelSearch();
      this.disposables.dispose();
      return this.detach();
    };

    ShowTodoView.prototype.serialize = function() {
      return {
        deserializer: 'todo-show/todo-view',
        scope: this.collection.scope,
        customPath: this.collection.getCustomPath()
      };
    };

    ShowTodoView.prototype.getTitle = function() {
      return "Todo Show";
    };

    ShowTodoView.prototype.getIconName = function() {
      return "checklist";
    };

    ShowTodoView.prototype.getURI = function() {
      return this.uri;
    };

    ShowTodoView.prototype.getDefaultLocation = function() {
      return 'right';
    };

    ShowTodoView.prototype.getAllowedLocations = function() {
      return ['left', 'right', 'bottom'];
    };

    ShowTodoView.prototype.getProjectName = function() {
      return this.collection.getActiveProjectName();
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return this.collection.getActiveProject();
    };

    ShowTodoView.prototype.getTodos = function() {
      return this.collection.getTodos();
    };

    ShowTodoView.prototype.getTodosCount = function() {
      return this.collection.getTodosCount();
    };

    ShowTodoView.prototype.isSearching = function() {
      return this.collection.getState();
    };

    ShowTodoView.prototype.search = function(force) {
      var ref2;
      if (force == null) {
        force = false;
      }
      if (this.onlySearchWhenVisible) {
        if (!((ref2 = atom.workspace.paneContainerForItem(this)) != null ? ref2.isVisible() : void 0)) {
          return;
        }
      }
      return this.collection.search(force);
    };

    ShowTodoView.prototype.startLoading = function() {
      this.todoLoading.show();
      return this.updateInfo();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.todoLoading.hide();
      return this.updateInfo();
    };

    ShowTodoView.prototype.updateInfo = function() {
      return this.todoInfo.html((this.getInfoText()) + " " + (this.getScopeText()));
    };

    ShowTodoView.prototype.getInfoText = function() {
      var count;
      if (this.isSearching()) {
        return "Found ... results";
      }
      switch (count = this.getTodosCount()) {
        case 1:
          return "Found " + count + " result";
        default:
          return "Found " + count + " results";
      }
    };

    ShowTodoView.prototype.getScopeText = function() {
      switch (this.collection.scope) {
        case 'active':
          return "in active file";
        case 'open':
          return "in open files";
        case 'project':
          return "in project <code>" + (this.getProjectName()) + "</code>";
        case 'custom':
          return "in <code>" + this.collection.customPath + "</code>";
        default:
          return "in workspace";
      }
    };

    ShowTodoView.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addError(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype.showWarning = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addWarning(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype["export"] = function() {
      var filePath, projectPath;
      if (this.isSearching()) {
        return;
      }
      filePath = (this.getProjectName() || 'todos') + ".md";
      if (projectPath = this.getProjectPath()) {
        filePath = path.join(projectPath, filePath);
      }
      if (fs.existsSync(filePath)) {
        filePath = void 0;
      }
      return atom.workspace.open(filePath).then((function(_this) {
        return function(textEditor) {
          return textEditor.setText(_this.collection.getMarkdown());
        };
      })(this));
    };

    ShowTodoView.prototype.toggleSearchScope = function() {
      var scope;
      scope = this.collection.toggleSearchScope();
      return this.setScopeButtonState(scope);
    };

    ShowTodoView.prototype.setScopeButtonState = function(state) {
      switch (state) {
        case 'project':
          return this.scopeButton.text('Project');
        case 'open':
          return this.scopeButton.text('Open Files');
        case 'active':
          return this.scopeButton.text('Active File');
        case 'custom':
          return this.scopeButton.text('Custom');
        default:
          return this.scopeButton.text('Workspace');
      }
    };

    ShowTodoView.prototype.toggleOptions = function() {
      if (!this.todoOptions) {
        this.optionsView.hide();
        this.todoOptions = new TodoOptions(this.collection);
        this.optionsView.html(this.todoOptions);
      }
      return this.optionsView.slideToggle();
    };

    ShowTodoView.prototype.filter = function() {
      return this.collection.filterTodos(this.filterBuffer.getText());
    };

    ShowTodoView.prototype.checkDeprecation = function() {
      if (atom.config.get('todo-show.findTheseRegexes')) {
        return this.showWarning('Deprecation Warning:\n\n`findTheseRegexes` config is deprecated, please use `findTheseTodos` and `findUsingRegex` for custom behaviour.\nSee https://github.com/mrodalgaard/atom-todo-show#config for more information.');
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0SUFBQTtJQUFBOzs7O0VBQUEsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDdEIsT0FBK0IsT0FBQSxDQUFRLHNCQUFSLENBQS9CLEVBQUMsNEJBQUQsRUFBYTs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVI7O0VBQ1osV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUjs7RUFFZCxvQkFBQSxHQUF1QixTQUFDLE1BQUQ7QUFDckIsUUFBQTtJQUFBLElBQUcsc0NBQUg7YUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBK0IsTUFBL0IsRUFERjtLQUFBLE1BQUE7TUFHRSxVQUFBLEdBQWEsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDO2FBQzdCLElBQUksVUFBSixDQUFlLE1BQWYsRUFKRjs7RUFEcUI7O0VBT3ZCLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNKLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxVQUFELEVBQWEsWUFBYjthQVdSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG1CQUFQO1FBQTRCLFFBQUEsRUFBVSxDQUFDLENBQXZDO09BQUwsRUFBK0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQzdDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQVA7V0FBTCxFQUEyQixTQUFBO1lBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxF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QUFBLFVBQVUsQ0FBQyxXQUFaLENBQXdCLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBLENBQXhCO0lBRE07OzJCQUdSLGdCQUFBLEdBQWtCLFNBQUE7TUFDaEIsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQUg7ZUFDRSxJQUFDLENBQUEsV0FBRCxDQUFhLHlOQUFiLEVBREY7O0lBRGdCOzs7O0tBMU1PO0FBaEIzQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBUZXh0QnVmZmVyfSA9IHJlcXVpcmUgJ2F0b20nXG57U2Nyb2xsVmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxuVG9kb1RhYmxlID0gcmVxdWlyZSAnLi90b2RvLXRhYmxlLXZpZXcnXG5Ub2RvT3B0aW9ucyA9IHJlcXVpcmUgJy4vdG9kby1vcHRpb25zLXZpZXcnXG5cbmRlcHJlY2F0ZWRUZXh0RWRpdG9yID0gKHBhcmFtcykgLT5cbiAgaWYgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yP1xuICAgIGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcihwYXJhbXMpXG4gIGVsc2VcbiAgICBUZXh0RWRpdG9yID0gcmVxdWlyZSgnYXRvbScpLlRleHRFZGl0b3JcbiAgICBuZXcgVGV4dEVkaXRvcihwYXJhbXMpXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNob3dUb2RvVmlldyBleHRlbmRzIFNjcm9sbFZpZXdcbiAgQGNvbnRlbnQ6IChjb2xsZWN0aW9uLCBmaWx0ZXJCdWZmZXIpIC0+XG4gICAgIyBGSVhNRTogQ3JlYXRpbmcgdGV4dCBlZGl0b3IgdGhpcyB3YXkgcmVzdWx0cyBpbiB3ZWlyZCBnZXRTY29wZUNoYWluIGVycm9yIGluIEF0b20gY29yZSAtIGRlcHJlY2F0ZWRcbiAgICAjIGZpbHRlckVkaXRvciA9IGRlcHJlY2F0ZWRUZXh0RWRpdG9yKFxuICAgICMgICBtaW5pOiB0cnVlXG4gICAgIyAgIHRhYkxlbmd0aDogMlxuICAgICMgICBzb2Z0VGFiczogdHJ1ZVxuICAgICMgICBzb2Z0V3JhcHBlZDogZmFsc2VcbiAgICAjICAgYnVmZmVyOiBmaWx0ZXJCdWZmZXJcbiAgICAjICAgcGxhY2Vob2xkZXJUZXh0OiAnU2VhcmNoIFRvZG9zJ1xuICAgICMgKVxuXG4gICAgQGRpdiBjbGFzczogJ3Nob3ctdG9kby1wcmV2aWV3JywgdGFiaW5kZXg6IC0xLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0gaW5wdXQtYmxvY2staXRlbS0tZmxleCdcbiAgICAgICAgICAjIEBzdWJ2aWV3ICdmaWx0ZXJFZGl0b3JWaWV3JywgbmV3IFRleHRFZGl0b3JWaWV3KGVkaXRvcjogZmlsdGVyRWRpdG9yKVxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbScsID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ2J0bi1ncm91cCcsID0+XG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ3Njb3BlQnV0dG9uJywgY2xhc3M6ICdidG4nXG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ29wdGlvbnNCdXR0b24nLCBjbGFzczogJ2J0biBpY29uLWdlYXInXG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ2V4cG9ydEJ1dHRvbicsIGNsYXNzOiAnYnRuIGljb24tY2xvdWQtZG93bmxvYWQnXG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ3JlZnJlc2hCdXR0b24nLCBjbGFzczogJ2J0biBpY29uLXN5bmMnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jayB0b2RvLWluZm8tYmxvY2snLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbScsID0+XG4gICAgICAgICAgQHNwYW4gb3V0bGV0OiAndG9kb0luZm8nXG5cbiAgICAgIEBkaXYgb3V0bGV0OiAnb3B0aW9uc1ZpZXcnXG5cbiAgICAgIEBkaXYgb3V0bGV0OiAndG9kb0xvYWRpbmcnLCBjbGFzczogJ3RvZG8tbG9hZGluZycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdtYXJrZG93bi1zcGlubmVyJ1xuICAgICAgICBAaDUgb3V0bGV0OiAnc2VhcmNoQ291bnQnLCBjbGFzczogJ3RleHQtY2VudGVyJywgXCJMb2FkaW5nIFRvZG9zLi4uXCJcblxuICAgICAgQHN1YnZpZXcgJ3RvZG9UYWJsZScsIG5ldyBUb2RvVGFibGUoY29sbGVjdGlvbilcblxuICBjb25zdHJ1Y3RvcjogKEBjb2xsZWN0aW9uLCBAdXJpKSAtPlxuICAgIHN1cGVyIEBjb2xsZWN0aW9uLCBAZmlsdGVyQnVmZmVyID0gbmV3IFRleHRCdWZmZXJcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHNldFNjb3BlQnV0dG9uU3RhdGUoQGNvbGxlY3Rpb24uZ2V0U2VhcmNoU2NvcGUoKSlcblxuICAgIEBvbmx5U2VhcmNoV2hlblZpc2libGUgPSB0cnVlXG4gICAgQG5vdGlmaWNhdGlvbk9wdGlvbnMgPVxuICAgICAgZGV0YWlsOiAnQXRvbSB0b2RvLXNob3cgcGFja2FnZSdcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICBpY29uOiBAZ2V0SWNvbk5hbWUoKVxuXG4gICAgQGNoZWNrRGVwcmVjYXRpb24oKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAc2NvcGVCdXR0b24sIHRpdGxlOiBcIldoYXQgdG8gU2VhcmNoXCJcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEBvcHRpb25zQnV0dG9uLCB0aXRsZTogXCJTaG93IFRvZG8gT3B0aW9uc1wiXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAZXhwb3J0QnV0dG9uLCB0aXRsZTogXCJFeHBvcnQgVG9kb3NcIlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHJlZnJlc2hCdXR0b24sIHRpdGxlOiBcIlJlZnJlc2ggVG9kb3NcIlxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBlbGVtZW50LFxuICAgICAgJ2NvcmU6ZXhwb3J0JzogKGV2ZW50KSA9PlxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBAZXhwb3J0KClcbiAgICAgICdjb3JlOnJlZnJlc2gnOiAoZXZlbnQpID0+XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBzZWFyY2godHJ1ZSlcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRTdGFydFNlYXJjaCBAc3RhcnRMb2FkaW5nXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZpbmlzaFNlYXJjaCBAc3RvcExvYWRpbmdcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkRmFpbFNlYXJjaCAoZXJyKSA9PlxuICAgICAgQHNlYXJjaENvdW50LnRleHQgXCJTZWFyY2ggRmFpbGVkXCJcbiAgICAgIGNvbnNvbGUuZXJyb3IgZXJyIGlmIGVyclxuICAgICAgQHNob3dFcnJvciBlcnIgaWYgZXJyXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkQ2hhbmdlU2VhcmNoU2NvcGUgKHNjb3BlKSA9PlxuICAgICAgQHNldFNjb3BlQnV0dG9uU3RhdGUoc2NvcGUpXG4gICAgICBAc2VhcmNoKHRydWUpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU2VhcmNoUGF0aHMgKG5QYXRocykgPT5cbiAgICAgIEBzZWFyY2hDb3VudC50ZXh0IFwiI3tuUGF0aHN9IHBhdGhzIHNlYXJjaGVkLi4uXCJcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkgPT5cbiAgICAgIGlmIEBjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3QoaXRlbT8uZ2V0UGF0aD8oKSkgb3JcbiAgICAgIChpdGVtPy5jb25zdHJ1Y3Rvci5uYW1lIGlzICdUZXh0RWRpdG9yJyBhbmQgQGNvbGxlY3Rpb24uc2NvcGUgaXMgJ2FjdGl2ZScpXG4gICAgICAgIEBzZWFyY2goKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFRleHRFZGl0b3IgKHt0ZXh0RWRpdG9yfSkgPT5cbiAgICAgIEBzZWFyY2goKSBpZiBAY29sbGVjdGlvbi5zY29wZSBpcyAnb3BlbidcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0gKHtpdGVtfSkgPT5cbiAgICAgIEBzZWFyY2goKSBpZiBAY29sbGVjdGlvbi5zY29wZSBpcyAnb3BlbidcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGVkaXRvci5vbkRpZFNhdmUgPT5cbiAgICAgICAgQHNlYXJjaCgpXG5cbiAgICAjIEBmaWx0ZXJFZGl0b3JWaWV3LmdldE1vZGVsKCkub25EaWRTdG9wQ2hhbmdpbmcgPT5cbiAgICAjICAgQGZpbHRlcigpIGlmIEBmaXJzdFRpbWVGaWx0ZXJcbiAgICAjICAgQGZpcnN0VGltZUZpbHRlciA9IHRydWVcblxuICAgIEBzY29wZUJ1dHRvbi5vbiAnY2xpY2snLCBAdG9nZ2xlU2VhcmNoU2NvcGVcbiAgICBAb3B0aW9uc0J1dHRvbi5vbiAnY2xpY2snLCBAdG9nZ2xlT3B0aW9uc1xuICAgIEBleHBvcnRCdXR0b24ub24gJ2NsaWNrJywgQGV4cG9ydFxuICAgIEByZWZyZXNoQnV0dG9uLm9uICdjbGljaycsID0+IEBzZWFyY2godHJ1ZSlcblxuICBkZXN0cm95OiAtPlxuICAgIEBjb2xsZWN0aW9uLmNhbmNlbFNlYXJjaCgpXG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIEBkZXRhY2goKVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICBkZXNlcmlhbGl6ZXI6ICd0b2RvLXNob3cvdG9kby12aWV3J1xuICAgIHNjb3BlOiBAY29sbGVjdGlvbi5zY29wZVxuICAgIGN1c3RvbVBhdGg6IEBjb2xsZWN0aW9uLmdldEN1c3RvbVBhdGgoKVxuXG4gIGdldFRpdGxlOiAtPiBcIlRvZG8gU2hvd1wiXG4gIGdldEljb25OYW1lOiAtPiBcImNoZWNrbGlzdFwiXG4gIGdldFVSSTogLT4gQHVyaVxuICBnZXREZWZhdWx0TG9jYXRpb246IC0+ICdyaWdodCdcbiAgZ2V0QWxsb3dlZExvY2F0aW9uczogLT4gWydsZWZ0JywgJ3JpZ2h0JywgJ2JvdHRvbSddXG4gIGdldFByb2plY3ROYW1lOiAtPiBAY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0TmFtZSgpXG4gIGdldFByb2plY3RQYXRoOiAtPiBAY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0KClcblxuICBnZXRUb2RvczogLT4gQGNvbGxlY3Rpb24uZ2V0VG9kb3MoKVxuICBnZXRUb2Rvc0NvdW50OiAtPiBAY29sbGVjdGlvbi5nZXRUb2Rvc0NvdW50KClcbiAgaXNTZWFyY2hpbmc6IC0+IEBjb2xsZWN0aW9uLmdldFN0YXRlKClcbiAgc2VhcmNoOiAoZm9yY2UgPSBmYWxzZSkgLT5cbiAgICBpZiBAb25seVNlYXJjaFdoZW5WaXNpYmxlXG4gICAgICByZXR1cm4gdW5sZXNzIGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHRoaXMpPy5pc1Zpc2libGUoKVxuICAgIEBjb2xsZWN0aW9uLnNlYXJjaChmb3JjZSlcblxuICBzdGFydExvYWRpbmc6ID0+XG4gICAgQHRvZG9Mb2FkaW5nLnNob3coKVxuICAgIEB1cGRhdGVJbmZvKClcblxuICBzdG9wTG9hZGluZzogPT5cbiAgICBAdG9kb0xvYWRpbmcuaGlkZSgpXG4gICAgQHVwZGF0ZUluZm8oKVxuXG4gIHVwZGF0ZUluZm86IC0+XG4gICAgQHRvZG9JbmZvLmh0bWwoXCIje0BnZXRJbmZvVGV4dCgpfSAje0BnZXRTY29wZVRleHQoKX1cIilcblxuICBnZXRJbmZvVGV4dDogLT5cbiAgICByZXR1cm4gXCJGb3VuZCAuLi4gcmVzdWx0c1wiIGlmIEBpc1NlYXJjaGluZygpXG4gICAgc3dpdGNoIGNvdW50ID0gQGdldFRvZG9zQ291bnQoKVxuICAgICAgd2hlbiAxIHRoZW4gXCJGb3VuZCAje2NvdW50fSByZXN1bHRcIlxuICAgICAgZWxzZSBcIkZvdW5kICN7Y291bnR9IHJlc3VsdHNcIlxuXG4gIGdldFNjb3BlVGV4dDogLT5cbiAgICAjIFRPRE86IEFsc28gc2hvdyBudW1iZXIgb2YgZmlsZXNcblxuICAgIHN3aXRjaCBAY29sbGVjdGlvbi5zY29wZVxuICAgICAgd2hlbiAnYWN0aXZlJ1xuICAgICAgICBcImluIGFjdGl2ZSBmaWxlXCJcbiAgICAgIHdoZW4gJ29wZW4nXG4gICAgICAgIFwiaW4gb3BlbiBmaWxlc1wiXG4gICAgICB3aGVuICdwcm9qZWN0J1xuICAgICAgICBcImluIHByb2plY3QgPGNvZGU+I3tAZ2V0UHJvamVjdE5hbWUoKX08L2NvZGU+XCJcbiAgICAgIHdoZW4gJ2N1c3RvbSdcbiAgICAgICAgXCJpbiA8Y29kZT4je0Bjb2xsZWN0aW9uLmN1c3RvbVBhdGh9PC9jb2RlPlwiXG4gICAgICBlbHNlXG4gICAgICAgIFwiaW4gd29ya3NwYWNlXCJcblxuICBzaG93RXJyb3I6IChtZXNzYWdlID0gJycpIC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIG1lc3NhZ2UudG9TdHJpbmcoKSwgQG5vdGlmaWNhdGlvbk9wdGlvbnNcblxuICBzaG93V2FybmluZzogKG1lc3NhZ2UgPSAnJykgLT5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyBtZXNzYWdlLnRvU3RyaW5nKCksIEBub3RpZmljYXRpb25PcHRpb25zXG5cbiAgZXhwb3J0OiA9PlxuICAgIHJldHVybiBpZiBAaXNTZWFyY2hpbmcoKVxuXG4gICAgZmlsZVBhdGggPSBcIiN7QGdldFByb2plY3ROYW1lKCkgb3IgJ3RvZG9zJ30ubWRcIlxuICAgIGlmIHByb2plY3RQYXRoID0gQGdldFByb2plY3RQYXRoKClcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCBmaWxlUGF0aClcblxuICAgICMgRG8gbm90IG92ZXJyaWRlIGlmIGRlZmF1bHQgZmlsZSBwYXRoIGFscmVhZHkgZXhpc3RzXG4gICAgZmlsZVBhdGggPSB1bmRlZmluZWQgaWYgZnMuZXhpc3RzU3luYyhmaWxlUGF0aClcblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpLnRoZW4gKHRleHRFZGl0b3IpID0+XG4gICAgICB0ZXh0RWRpdG9yLnNldFRleHQoQGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSlcblxuICB0b2dnbGVTZWFyY2hTY29wZTogPT5cbiAgICBzY29wZSA9IEBjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKClcbiAgICBAc2V0U2NvcGVCdXR0b25TdGF0ZShzY29wZSlcblxuICBzZXRTY29wZUJ1dHRvblN0YXRlOiAoc3RhdGUpID0+XG4gICAgc3dpdGNoIHN0YXRlXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdQcm9qZWN0J1xuICAgICAgd2hlbiAnb3BlbicgdGhlbiBAc2NvcGVCdXR0b24udGV4dCAnT3BlbiBGaWxlcydcbiAgICAgIHdoZW4gJ2FjdGl2ZScgdGhlbiBAc2NvcGVCdXR0b24udGV4dCAnQWN0aXZlIEZpbGUnXG4gICAgICB3aGVuICdjdXN0b20nIHRoZW4gQHNjb3BlQnV0dG9uLnRleHQgJ0N1c3RvbSdcbiAgICAgIGVsc2UgQHNjb3BlQnV0dG9uLnRleHQgJ1dvcmtzcGFjZSdcblxuICB0b2dnbGVPcHRpb25zOiA9PlxuICAgIHVubGVzcyBAdG9kb09wdGlvbnNcbiAgICAgIEBvcHRpb25zVmlldy5oaWRlKClcbiAgICAgIEB0b2RvT3B0aW9ucyA9IG5ldyBUb2RvT3B0aW9ucyhAY29sbGVjdGlvbilcbiAgICAgIEBvcHRpb25zVmlldy5odG1sIEB0b2RvT3B0aW9uc1xuICAgIEBvcHRpb25zVmlldy5zbGlkZVRvZ2dsZSgpXG5cbiAgZmlsdGVyOiAtPlxuICAgIEBjb2xsZWN0aW9uLmZpbHRlclRvZG9zIEBmaWx0ZXJCdWZmZXIuZ2V0VGV4dCgpXG5cbiAgY2hlY2tEZXByZWNhdGlvbjogLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVGhlc2VSZWdleGVzJylcbiAgICAgIEBzaG93V2FybmluZyAnJydcbiAgICAgIERlcHJlY2F0aW9uIFdhcm5pbmc6XFxuXG4gICAgICBgZmluZFRoZXNlUmVnZXhlc2AgY29uZmlnIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGZpbmRUaGVzZVRvZG9zYCBhbmQgYGZpbmRVc2luZ1JlZ2V4YCBmb3IgY3VzdG9tIGJlaGF2aW91ci5cbiAgICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbXJvZGFsZ2FhcmQvYXRvbS10b2RvLXNob3cjY29uZmlnIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAgJycnXG4iXX0=
