Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _tagGenerator = require('./tag-generator');

var _tagGenerator2 = _interopRequireDefault(_tagGenerator);

var _tagParser = require('./tag-parser');

var _tagParser2 = _interopRequireDefault(_tagParser);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

'use babel';

var StructureView = (function () {
  function StructureView() {
    _classCallCheck(this, StructureView);

    var htmlString = _fs2['default'].readFileSync(_path2['default'].join(__dirname, '..', 'templates', 'structure-view.html'), {
      encoding: 'utf-8'
    });
    this.element = (0, _jquery2['default'])(htmlString).get(0);
    this.viewType = 'structureView';
    this.vm = new _vue2['default']({
      el: this.element,
      data: {
        treeNodeId: null,
        nodeSet: {},
        cursorListener: null,
        textEditorListener: null,
        editorSaveListener: {},
        viewLoading: true,
        noTagHint: null,
        lastFile: null,
        viewShow: false,
        CONFIG_DBLCLICK_TO_FOLD_TREE: atom.config.get('structure-view.DoubleClickToFoldTreeView'),
        CONFIG_SHOW_VARIABLES: atom.config.get('structure-view.ShowVariables'),
        CONFIG_SHOW_PROPERTIES: atom.config.get('structure-view.ShowProperties')
      },
      methods: {
        onToggleTreeNode: function onToggleTreeNode(evt) {
          if (this.CONFIG_DBLCLICK_TO_FOLD_TREE) {
            _util2['default'].selectTreeNode((0, _jquery2['default'])(evt.target), this, {
              toggle: true
            });
          }
        },
        onSelectTreeNode: function onSelectTreeNode(evt) {
          // If double click is not enable, tree should be toggled by single click
          if (this.CONFIG_DBLCLICK_TO_FOLD_TREE) {
            _util2['default'].selectTreeNode((0, _jquery2['default'])(evt.target), this, {
              toggle: false
            });
          } else {
            _util2['default'].selectTreeNode((0, _jquery2['default'])(evt.target), this, {
              toggle: true
            });
          }
        },
        onToggleWholeTree: function onToggleWholeTree(evt) {
          var val = evt.target.value;
          if (val === 'expand') {
            (0, _jquery2['default'])('div.structure-view>div.tree-panel>ol>li').removeClass('collapsed');
          } else {
            (0, _jquery2['default'])('div.structure-view>div.tree-panel>ol>li').addClass('collapsed');
          }
        },
        onClickGuide: function onClickGuide() {
          atom.workspace.open('atom://config/packages/structure-view').then(function () {
            document.getElementById('usage').scrollIntoView();
          });
        },
        onOpenSettingsTab: function onOpenSettingsTab() {
          atom.workspace.open('atom://config/packages/structure-view').then(function () {
            document.getElementsByClassName('section-heading icon-gear')[0].scrollIntoView();
          });
        }
      },
      created: function created() {
        var _this = this;

        atom.config.onDidChange('structure-view.DoubleClickToFoldTreeView', function (ret) {
          _this.CONFIG_DBLCLICK_TO_FOLD_TREE = ret.newValue;
        });
        atom.config.onDidChange('structure-view.ShowVariables', function (ret) {
          _this.CONFIG_SHOW_VARIABLES = ret.newValue;
        });
        atom.config.onDidChange('structure-view.ShowProperties', function (ret) {
          _this.CONFIG_SHOW_PROPERTIES = ret.newValue;
        });
      },
      watch: {
        treeNodeId: function treeNodeId(val) {
          var _this2 = this;

          if (!this.lastFile) return;
          var position = this.nodeSet[val].position,

          // getActiveTextEditor can not get editor after click left tree when on windows before v1.8.0
          editor = atom.workspace.getTextEditors().find(function (i) {
            return i.getPath() === _this2.lastFile;
          });
          if (editor) {
            var row = position.row;
            // Blocks of code could be folded
            if (editor.isFoldedAtBufferRow(row)) editor.unfoldBufferRow(row);
            // Lines can be soft-wrapped
            if (editor.isSoftWrapped()) {
              editor.setCursorBufferPosition(position);
            } else {
              editor.setCursorScreenPosition(position);
            }
            editor.scrollToCursorPosition();
          }
        },
        viewLoading: function viewLoading(val) {
          (0, _jquery2['default'])(this.$el).find('.mask')[val ? 'show' : 'hide']();
        }
      }
    });
  }

  _createClass(StructureView, [{
    key: 'initialize',
    value: function initialize() {
      this.vm.viewLoading = true;
      this.render();
      if (atom.config.get('structure-view.SelectTagWhenCursorChanged')) {
        this.listenOnCursorPositionChange();
      }
      this.listenOnTextEditorChange();
      this.listenOnTextEditorSave(atom.workspace.getActiveTextEditor());
    }
  }, {
    key: 'render',
    value: _asyncToGenerator(function* (filePath) {
      var editor = atom.workspace.getActiveTextEditor();
      if (!filePath && editor) {
        filePath = editor.getPath();
      }
      if (filePath) {
        var scopeName = editor.getGrammar().scopeName;
        var tags = yield new _tagGenerator2['default'](filePath, scopeName).generate();
        if (tags.err) {
          this.vm.noTagHint = tags.err;
        } else {
          new _tagParser2['default'](tags, 'javascript').parser();

          if (tags.list && Object.keys(tags.list).length > 0) {
            this.renderTree(tags.tree);
            this.vm.nodeSet = tags.list;
            this.vm.noTagHint = null;
          } else {
            this.vm.noTagHint = 'No tag in the file.';
          }
        }
        this.vm.lastFile = filePath;
      } else {
        this.vm.noTagHint = 'No file is opened.';
      }
      this.vm.viewLoading = false;
    })
  }, {
    key: 'renderTree',
    value: function renderTree(nodes) {
      var html = this.treeGenerator(nodes);
      (0, _jquery2['default'])('div.structure-view>div>ol').html(html);
    }
  }, {
    key: 'listenOnCursorPositionChange',
    value: function listenOnCursorPositionChange() {
      var _this3 = this;

      var self = this,
          activeEditor = atom.workspace.getActiveTextEditor();
      if (activeEditor) {
        this.vm.cursorListener = activeEditor.onDidChangeCursorPosition(function (e) {
          var nRow = e.newScreenPosition.row;
          if (nRow !== e.oldScreenPosition.row) {
            var tag = _lodash2['default'].find(self.vm.nodeSet, function (item) {
              return item.position.row === nRow;
            });
            // Same node would not change view
            if (tag && tag.id !== self.treeNodeId) {
              var $tag = (0, _jquery2['default'])(_this3.element).find('li[node-id="' + tag.id + '"]');
              if ($tag.length > 0) {
                // {top: 0, left: 0} means node is hidden
                // TODO: expand parent tree node
                if ($tag.offset().top === 0 && $tag.offset().left === 0) return;

                _util2['default'].selectTreeNode($tag, _this3);
                var ret = _util2['default'].getScrollDistance($tag, (0, _jquery2['default'])(_this3.element));
                if (ret.needScroll) (0, _jquery2['default'])(_this3.element).scrollTop(ret.distance);
              }
            }
          }
        });
      }
    }
  }, {
    key: 'listenOnTextEditorChange',
    value: function listenOnTextEditorChange() {
      if (this.vm.textEditorListener) return;

      var self = this;
      // ::onDidChangeActiveTextEditor API is only supported after 1.18.0
      var rightDock = atom.workspace.getRightDock();
      if (atom.appVersion >= '1.18') {
        this.vm.textEditorListener = atom.workspace.onDidChangeActiveTextEditor(function (editor) {
          if (self.vm.viewShow && editor && editor.element && 'ATOM-TEXT-EDITOR' === editor.element.nodeName) {
            // Do not show view when view is hidden by user
            if (!rightDock.isVisible() && !self.vm.lastFile) rightDock.show();

            // For changed file
            self.render(editor.getPath());

            // Add save event listener
            self.listenOnTextEditorSave(editor);
          } else {
            rightDock.hide();
            self.vm.lastFile = '';
          }
        });
      } else {
        this.vm.textEditorListener = atom.workspace.onDidChangeActivePaneItem(function (editor) {
          // Ensure pane item is an edior
          if (self.vm.viewShow && editor && editor.element && 'ATOM-TEXT-EDITOR' === editor.element.nodeName) {
            if (!rightDock.isVisible() && !self.vm.lastFile) rightDock.show();

            // Skip render if file is not changed and view has content
            if (self.vm.lastFile === editor.getPath() && !self.vm.noTagHint) return;

            self.render(editor.getPath());
            // Add save event listener
            self.listenOnTextEditorSave(editor);
          }
          // Do nothing if click SV itself
          else if (editor && 'structureView' === editor.viewType) ;
            // Do not close right dock if other item exists
            else if (rightDock.getPaneItems().length > 1) {
                self.render();
              } else {
                rightDock.hide();
                self.vm.lastFile = '';
              }
        });
      }
    }
  }, {
    key: 'listenOnTextEditorSave',
    value: function listenOnTextEditorSave(editor) {
      var _this4 = this;

      if (editor) {
        (function () {
          var listener = _this4.vm.editorSaveListener,
              self = _this4;
          if (!listener[editor.id]) listener[editor.id] = editor.onDidSave(function (i) {
            self.render(i.path);
          });
        })();
      }
    }
  }, {
    key: 'treeGenerator',
    value: function treeGenerator(data) {
      var self = this;
      var array = [],
          letter = undefined;

      _lodash2['default'].forEach(data, function (item) {
        switch (item.type) {

          case 'sel': // CSS
          case 'selector':
            // LESS, SASS
            letter = 'S';
            break;
          case 'prop':
            // CSS
            if (self.vm.CONFIG_SHOW_PROPERTIES) {
              letter = 'P';
            } else {
              return;
            }
            break;
          case 'elem':
            // HTML
            letter = '';
            break;

          case 'class':
            // JS
            letter = 'C';
            break;
          case 'import':
            // JS
            letter = 'I';
            break;
          case 'function':
            // JS, C
            letter = 'F';
            break;
          case 'method': // JS
          case 'member':
            // JSON, CSON, MARKDOWN
            letter = 'M';
            break;
          case 'var': // JS
          case 'variable': // C
          case 'macro':
            if (self.vm.CONFIG_SHOW_VARIABLES) {
              letter = 'V';
            } else {
              return;
            }
            break;
          default:
            letter = 'U';
            break;
        }
        var iconTpl = undefined;
        if (item.type === 'elem') {
          iconTpl = '<span class="icon icon-code"></span>';
        } else {
          iconTpl = '<div class="icon-circle icon-' + letter + '"><span>' + letter + '</span></div>';
        }

        var entry = '<li node-id="' + item.id + '" class="list-item" title="' + item.name + '">\n        <div class="symbol-mixed-block">\n            ' + iconTpl + '\n            <span>' + item.name + '</span>\n        </div>\n      </li>';

        if (item.child) {
          var childContent = self.treeGenerator(item.child);

          if (childContent.length != 0) {
            entry = '<li node-id="' + item.id + '" class="list-nested-item expanded" title="' + item.name + '">\n                        <div class="list-item symbol-mixed-block">\n                            ' + iconTpl + '\n                            <span>' + item.name + '</span>\n                        </div>\n                        <ol class="list-tree">' + childContent + '</ol>\n                    </li>';
          }
        }

        array.push(entry);
      });

      return array.join('');
    }
  }, {
    key: 'serialize',
    value: function serialize() {}
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element.remove();
      if (this.vm.cursorListener) {
        this.vm.cursorListener.dispose();
        this.vm.cursorListener = null;
      }
      if (this.vm.textEditorListener) {
        this.vm.textEditorListener.dispose();
        this.vm.textEditorListener = null;
      }
      _lodash2['default'].forEach(this.vm.editorSaveListener, function (item) {
        item.dispose();
      });
      this.vm.editorSaveListener = {};
      // this.vm.$destroy();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Structure View';
    }
  }]);

  return StructureView;
})();

exports['default'] = StructureView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi9zdHJ1Y3R1cmUtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7bUJBRWdCLEtBQUs7Ozs7c0JBQ1AsUUFBUTs7OztrQkFDUCxJQUFJOzs7O29CQUNGLE1BQU07Ozs7c0JBQ1QsUUFBUTs7Ozs0QkFDRyxpQkFBaUI7Ozs7eUJBQ3BCLGNBQWM7Ozs7b0JBQ25CLFFBQVE7Ozs7QUFUekIsV0FBVyxDQUFDOztJQVdTLGFBQWE7QUFFckIsV0FGUSxhQUFhLEdBRWxCOzBCQUZLLGFBQWE7O0FBRzlCLFFBQU0sVUFBVSxHQUFHLGdCQUFHLFlBQVksQ0FBQyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUscUJBQXFCLENBQUMsRUFBRTtBQUNqRyxjQUFRLEVBQUUsT0FBTztLQUNsQixDQUFDLENBQUM7QUFDSCxRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxRQUFJLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQztBQUNoQyxRQUFJLENBQUMsRUFBRSxHQUFHLHFCQUFRO0FBQ2hCLFFBQUUsRUFBRSxJQUFJLENBQUMsT0FBTztBQUNoQixVQUFJLEVBQUU7QUFDSixrQkFBVSxFQUFFLElBQUk7QUFDaEIsZUFBTyxFQUFFLEVBQUU7QUFDWCxzQkFBYyxFQUFFLElBQUk7QUFDcEIsMEJBQWtCLEVBQUUsSUFBSTtBQUN4QiwwQkFBa0IsRUFBRSxFQUFFO0FBQ3RCLG1CQUFXLEVBQUUsSUFBSTtBQUNqQixpQkFBUyxFQUFFLElBQUk7QUFDZixnQkFBUSxFQUFFLElBQUk7QUFDZCxnQkFBUSxFQUFFLEtBQUs7QUFDZixvQ0FBNEIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsQ0FBQztBQUN6Riw2QkFB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Q0FBQyxFQUFFLENBQUMsQ0FBQztLQUN2Qjs7O1dBRVEscUJBQUcsRUFBRTs7O1dBRVAsbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RCLFVBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUU7QUFDMUIsWUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsWUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO09BQy9CO0FBQ0QsVUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFO0FBQzlCLFlBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckMsWUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7T0FDbkM7QUFDRCwwQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFBLElBQUksRUFBSTtBQUM1QyxZQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDZixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQzs7S0FFakM7OztXQUVTLHNCQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7V0FFTyxvQkFBRztBQUNULGFBQU8sZ0JBQWdCLENBQUM7S0FDekI7OztTQS9Wa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvc3RydWN0dXJlLXZpZXcvbGliL3N0cnVjdHVyZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBWdWUgZnJvbSAndnVlJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFRhZ0dlbmVyYXRvciBmcm9tICcuL3RhZy1nZW5lcmF0b3InO1xuaW1wb3J0IFRhZ1BhcnNlciBmcm9tICcuL3RhZy1wYXJzZXInO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RydWN0dXJlVmlldyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgaHRtbFN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAndGVtcGxhdGVzJywgJ3N0cnVjdHVyZS12aWV3Lmh0bWwnKSwge1xuICAgICAgZW5jb2Rpbmc6ICd1dGYtOCdcbiAgICB9KTtcbiAgICB0aGlzLmVsZW1lbnQgPSAkKGh0bWxTdHJpbmcpLmdldCgwKTtcbiAgICB0aGlzLnZpZXdUeXBlID0gJ3N0cnVjdHVyZVZpZXcnO1xuICAgIHRoaXMudm0gPSBuZXcgVnVlKHtcbiAgICAgIGVsOiB0aGlzLmVsZW1lbnQsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHRyZWVOb2RlSWQ6IG51bGwsXG4gICAgICAgIG5vZGVTZXQ6IHt9LFxuICAgICAgICBjdXJzb3JMaXN0ZW5lcjogbnVsbCxcbiAgICAgICAgdGV4dEVkaXRvckxpc3RlbmVyOiBudWxsLFxuICAgICAgICBlZGl0b3JTYXZlTGlzdGVuZXI6IHt9LFxuICAgICAgICB2aWV3TG9hZGluZzogdHJ1ZSxcbiAgICAgICAgbm9UYWdIaW50OiBudWxsLFxuICAgICAgICBsYXN0RmlsZTogbnVsbCxcbiAgICAgICAgdmlld1Nob3c6IGZhbHNlLFxuICAgICAgICBDT05GSUdfREJMQ0xJQ0tfVE9fRk9MRF9UUkVFOiBhdG9tLmNvbmZpZy5nZXQoJ3N0cnVjdHVyZS12aWV3LkRvdWJsZUNsaWNrVG9Gb2xkVHJlZVZpZXcnKSxcbiAgICAgICAgQ09ORklHX1NIT1dfVkFSSUFCTEVTOiBhdG9tLmNvbmZpZy5nZXQoJ3N0cnVjdHVyZS12aWV3LlNob3dWYXJpYWJsZXMnKSxcbiAgICAgICAgQ09ORklHX1NIT1dfUFJPUEVSVElFUzogYXRvbS5jb25maWcuZ2V0KCdzdHJ1Y3R1cmUtdmlldy5TaG93UHJvcGVydGllcycpXG4gICAgICB9LFxuICAgICAgbWV0aG9kczoge1xuICAgICAgICBvblRvZ2dsZVRyZWVOb2RlKGV2dCkge1xuICAgICAgICAgIGlmICh0aGlzLkNPTkZJR19EQkxDTElDS19UT19GT0xEX1RSRUUpIHtcbiAgICAgICAgICAgIFV0aWwuc2VsZWN0VHJlZU5vZGUoJChldnQudGFyZ2V0KSwgdGhpcywge1xuICAgICAgICAgICAgICB0b2dnbGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25TZWxlY3RUcmVlTm9kZShldnQpIHtcbiAgICAgICAgICAvLyBJZiBkb3VibGUgY2xpY2sgaXMgbm90IGVuYWJsZSwgdHJlZSBzaG91bGQgYmUgdG9nZ2xlZCBieSBzaW5nbGUgY2xpY2tcbiAgICAgICAgICBpZiAodGhpcy5DT05GSUdfREJMQ0xJQ0tfVE9fRk9MRF9UUkVFKSB7XG4gICAgICAgICAgICBVdGlsLnNlbGVjdFRyZWVOb2RlKCQoZXZ0LnRhcmdldCksIHRoaXMsIHtcbiAgICAgICAgICAgICAgdG9nZ2xlOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFV0aWwuc2VsZWN0VHJlZU5vZGUoJChldnQudGFyZ2V0KSwgdGhpcywge1xuICAgICAgICAgICAgICB0b2dnbGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25Ub2dnbGVXaG9sZVRyZWUoZXZ0KSB7XG4gICAgICAgICAgbGV0IHZhbCA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgaWYgKHZhbCA9PT0gJ2V4cGFuZCcpIHtcbiAgICAgICAgICAgICQoJ2Rpdi5zdHJ1Y3R1cmUtdmlldz5kaXYudHJlZS1wYW5lbD5vbD5saScpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnZGl2LnN0cnVjdHVyZS12aWV3PmRpdi50cmVlLXBhbmVsPm9sPmxpJykuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25DbGlja0d1aWRlKCkge1xuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMvc3RydWN0dXJlLXZpZXcnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2FnZScpLnNjcm9sbEludG9WaWV3KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uT3BlblNldHRpbmdzVGFiKCkge1xuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMvc3RydWN0dXJlLXZpZXcnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlY3Rpb24taGVhZGluZyBpY29uLWdlYXInKVswXS5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjcmVhdGVkKCkge1xuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnc3RydWN0dXJlLXZpZXcuRG91YmxlQ2xpY2tUb0ZvbGRUcmVlVmlldycsIHJldCA9PiB7XG4gICAgICAgICAgdGhpcy5DT05GSUdfREJMQ0xJQ0tfVE9fRk9MRF9UUkVFID0gcmV0Lm5ld1ZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3N0cnVjdHVyZS12aWV3LlNob3dWYXJpYWJsZXMnLCByZXQgPT4ge1xuICAgICAgICAgIHRoaXMuQ09ORklHX1NIT1dfVkFSSUFCTEVTID0gcmV0Lm5ld1ZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3N0cnVjdHVyZS12aWV3LlNob3dQcm9wZXJ0aWVzJywgcmV0ID0+IHtcbiAgICAgICAgICB0aGlzLkNPTkZJR19TSE9XX1BST1BFUlRJRVMgPSByZXQubmV3VmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHdhdGNoOiB7XG4gICAgICAgIHRyZWVOb2RlSWQodmFsKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmxhc3RGaWxlKSByZXR1cm47XG4gICAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5ub2RlU2V0W3ZhbF0ucG9zaXRpb24sXG4gICAgICAgICAgICAvLyBnZXRBY3RpdmVUZXh0RWRpdG9yIGNhbiBub3QgZ2V0IGVkaXRvciBhZnRlciBjbGljayBsZWZ0IHRyZWUgd2hlbiBvbiB3aW5kb3dzIGJlZm9yZSB2MS44LjBcbiAgICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZmluZChpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGkuZ2V0UGF0aCgpID09PSB0aGlzLmxhc3RGaWxlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHBvc2l0aW9uLnJvdztcbiAgICAgICAgICAgIC8vIEJsb2NrcyBvZiBjb2RlIGNvdWxkIGJlIGZvbGRlZFxuICAgICAgICAgICAgaWYgKGVkaXRvci5pc0ZvbGRlZEF0QnVmZmVyUm93KHJvdykpIGVkaXRvci51bmZvbGRCdWZmZXJSb3cocm93KTtcbiAgICAgICAgICAgIC8vIExpbmVzIGNhbiBiZSBzb2Z0LXdyYXBwZWRcbiAgICAgICAgICAgIGlmIChlZGl0b3IuaXNTb2Z0V3JhcHBlZCgpKSB7XG4gICAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdMb2FkaW5nKHZhbCkge1xuICAgICAgICAgICQodGhpcy4kZWwpLmZpbmQoJy5tYXNrJylbdmFsID8gJ3Nob3cnIDogJ2hpZGUnXSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMudm0udmlld0xvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnc3RydWN0dXJlLXZpZXcuU2VsZWN0VGFnV2hlbkN1cnNvckNoYW5nZWQnKSkge1xuICAgICAgdGhpcy5saXN0ZW5PbkN1cnNvclBvc2l0aW9uQ2hhbmdlKCk7XG4gICAgfVxuICAgIHRoaXMubGlzdGVuT25UZXh0RWRpdG9yQ2hhbmdlKCk7XG4gICAgdGhpcy5saXN0ZW5PblRleHRFZGl0b3JTYXZlKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSk7XG4gIH1cblxuICBhc3luYyByZW5kZXIoZmlsZVBhdGgpIHtcbiAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGlmICghZmlsZVBhdGggJiYgZWRpdG9yKSB7XG4gICAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgfVxuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgbGV0IHNjb3BlTmFtZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lO1xuICAgICAgbGV0IHRhZ3MgPSBhd2FpdCBuZXcgVGFnR2VuZXJhdG9yKGZpbGVQYXRoLCBzY29wZU5hbWUpLmdlbmVyYXRlKCk7XG4gICAgICBpZiAodGFncy5lcnIpIHtcbiAgICAgICAgdGhpcy52bS5ub1RhZ0hpbnQgPSB0YWdzLmVycjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChuZXcgVGFnUGFyc2VyKHRhZ3MsICdqYXZhc2NyaXB0JykpLnBhcnNlcigpO1xuXG4gICAgICAgIGlmICh0YWdzLmxpc3QgJiYgT2JqZWN0LmtleXModGFncy5saXN0KS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUcmVlKHRhZ3MudHJlZSk7XG4gICAgICAgICAgdGhpcy52bS5ub2RlU2V0ID0gdGFncy5saXN0O1xuICAgICAgICAgIHRoaXMudm0ubm9UYWdIaW50ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnZtLm5vVGFnSGludCA9ICdObyB0YWcgaW4gdGhlIGZpbGUuJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy52bS5sYXN0RmlsZSA9IGZpbGVQYXRoO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMudm0ubm9UYWdIaW50ID0gJ05vIGZpbGUgaXMgb3BlbmVkLic7XG4gICAgfVxuICAgIHRoaXMudm0udmlld0xvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHJlbmRlclRyZWUobm9kZXMpIHtcbiAgICBsZXQgaHRtbCA9IHRoaXMudHJlZUdlbmVyYXRvcihub2Rlcyk7XG4gICAgJCgnZGl2LnN0cnVjdHVyZS12aWV3PmRpdj5vbCcpLmh0bWwoaHRtbCk7XG4gIH1cblxuICBsaXN0ZW5PbkN1cnNvclBvc2l0aW9uQ2hhbmdlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzLFxuICAgICAgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGlmIChhY3RpdmVFZGl0b3IpIHtcbiAgICAgIHRoaXMudm0uY3Vyc29yTGlzdGVuZXIgPSBhY3RpdmVFZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihlID0+IHtcbiAgICAgICAgbGV0IG5Sb3cgPSBlLm5ld1NjcmVlblBvc2l0aW9uLnJvdztcbiAgICAgICAgaWYgKG5Sb3cgIT09IGUub2xkU2NyZWVuUG9zaXRpb24ucm93KSB7XG4gICAgICAgICAgbGV0IHRhZyA9IF8uZmluZChzZWxmLnZtLm5vZGVTZXQsIGl0ZW0gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucG9zaXRpb24ucm93ID09PSBuUm93O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIFNhbWUgbm9kZSB3b3VsZCBub3QgY2hhbmdlIHZpZXdcbiAgICAgICAgICBpZiAodGFnICYmIHRhZy5pZCAhPT0gc2VsZi50cmVlTm9kZUlkKSB7XG4gICAgICAgICAgICBsZXQgJHRhZyA9ICQodGhpcy5lbGVtZW50KS5maW5kKGBsaVtub2RlLWlkPVwiJHt0YWcuaWR9XCJdYCk7XG4gICAgICAgICAgICBpZiAoJHRhZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIC8vIHt0b3A6IDAsIGxlZnQ6IDB9IG1lYW5zIG5vZGUgaXMgaGlkZGVuXG4gICAgICAgICAgICAgIC8vIFRPRE86IGV4cGFuZCBwYXJlbnQgdHJlZSBub2RlXG4gICAgICAgICAgICAgIGlmICgkdGFnLm9mZnNldCgpLnRvcCA9PT0gMCAmJiAkdGFnLm9mZnNldCgpLmxlZnQgPT09IDApIHJldHVybjtcblxuICAgICAgICAgICAgICBVdGlsLnNlbGVjdFRyZWVOb2RlKCR0YWcsIHRoaXMpO1xuICAgICAgICAgICAgICBsZXQgcmV0ID0gVXRpbC5nZXRTY3JvbGxEaXN0YW5jZSgkdGFnLCAkKHRoaXMuZWxlbWVudCkpO1xuICAgICAgICAgICAgICBpZiAocmV0Lm5lZWRTY3JvbGwpICQodGhpcy5lbGVtZW50KS5zY3JvbGxUb3AocmV0LmRpc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGxpc3Rlbk9uVGV4dEVkaXRvckNoYW5nZSgpIHtcbiAgICBpZiAodGhpcy52bS50ZXh0RWRpdG9yTGlzdGVuZXIpIHJldHVybjtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIC8vIDo6b25EaWRDaGFuZ2VBY3RpdmVUZXh0RWRpdG9yIEFQSSBpcyBvbmx5IHN1cHBvcnRlZCBhZnRlciAxLjE4LjBcbiAgICBjb25zdCByaWdodERvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRSaWdodERvY2soKTtcbiAgICBpZiAoYXRvbS5hcHBWZXJzaW9uID49ICcxLjE4Jykge1xuICAgICAgdGhpcy52bS50ZXh0RWRpdG9yTGlzdGVuZXIgPSBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVRleHRFZGl0b3IoZWRpdG9yID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHNlbGYudm0udmlld1Nob3cgJiZcbiAgICAgICAgICBlZGl0b3IgJiZcbiAgICAgICAgICBlZGl0b3IuZWxlbWVudCAmJlxuICAgICAgICAgICdBVE9NLVRFWFQtRURJVE9SJyA9PT0gZWRpdG9yLmVsZW1lbnQubm9kZU5hbWVcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gRG8gbm90IHNob3cgdmlldyB3aGVuIHZpZXcgaXMgaGlkZGVuIGJ5IHVzZXJcbiAgICAgICAgICBpZiAoIXJpZ2h0RG9jay5pc1Zpc2libGUoKSAmJiAhc2VsZi52bS5sYXN0RmlsZSkgcmlnaHREb2NrLnNob3coKTtcblxuICAgICAgICAgIC8vIEZvciBjaGFuZ2VkIGZpbGVcbiAgICAgICAgICBzZWxmLnJlbmRlcihlZGl0b3IuZ2V0UGF0aCgpKTtcblxuICAgICAgICAgIC8vIEFkZCBzYXZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc2VsZi5saXN0ZW5PblRleHRFZGl0b3JTYXZlKGVkaXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmlnaHREb2NrLmhpZGUoKTtcbiAgICAgICAgICBzZWxmLnZtLmxhc3RGaWxlID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZtLnRleHRFZGl0b3JMaXN0ZW5lciA9IGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oZWRpdG9yID0+IHtcbiAgICAgICAgLy8gRW5zdXJlIHBhbmUgaXRlbSBpcyBhbiBlZGlvclxuICAgICAgICBpZiAoXG4gICAgICAgICAgc2VsZi52bS52aWV3U2hvdyAmJlxuICAgICAgICAgIGVkaXRvciAmJlxuICAgICAgICAgIGVkaXRvci5lbGVtZW50ICYmXG4gICAgICAgICAgJ0FUT00tVEVYVC1FRElUT1InID09PSBlZGl0b3IuZWxlbWVudC5ub2RlTmFtZVxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoIXJpZ2h0RG9jay5pc1Zpc2libGUoKSAmJiAhc2VsZi52bS5sYXN0RmlsZSkgcmlnaHREb2NrLnNob3coKTtcblxuICAgICAgICAgIC8vIFNraXAgcmVuZGVyIGlmIGZpbGUgaXMgbm90IGNoYW5nZWQgYW5kIHZpZXcgaGFzIGNvbnRlbnRcbiAgICAgICAgICBpZiAoc2VsZi52bS5sYXN0RmlsZSA9PT0gZWRpdG9yLmdldFBhdGgoKSAmJiAhc2VsZi52bS5ub1RhZ0hpbnQpIHJldHVybjtcblxuICAgICAgICAgIHNlbGYucmVuZGVyKGVkaXRvci5nZXRQYXRoKCkpO1xuICAgICAgICAgIC8vIEFkZCBzYXZlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgc2VsZi5saXN0ZW5PblRleHRFZGl0b3JTYXZlKGVkaXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gbm90aGluZyBpZiBjbGljayBTViBpdHNlbGZcbiAgICAgICAgZWxzZSBpZiAoZWRpdG9yICYmICdzdHJ1Y3R1cmVWaWV3JyA9PT0gZWRpdG9yLnZpZXdUeXBlKTtcbiAgICAgICAgLy8gRG8gbm90IGNsb3NlIHJpZ2h0IGRvY2sgaWYgb3RoZXIgaXRlbSBleGlzdHNcbiAgICAgICAgZWxzZSBpZiAocmlnaHREb2NrLmdldFBhbmVJdGVtcygpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBzZWxmLnJlbmRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJpZ2h0RG9jay5oaWRlKCk7XG4gICAgICAgICAgc2VsZi52bS5sYXN0RmlsZSA9ICcnO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBsaXN0ZW5PblRleHRFZGl0b3JTYXZlKGVkaXRvcikge1xuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy52bS5lZGl0b3JTYXZlTGlzdGVuZXIsXG4gICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKCFsaXN0ZW5lcltlZGl0b3IuaWRdKSBsaXN0ZW5lcltlZGl0b3IuaWRdID0gZWRpdG9yLm9uRGlkU2F2ZShpID0+IHtcbiAgICAgICAgc2VsZi5yZW5kZXIoaS5wYXRoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHRyZWVHZW5lcmF0b3IoZGF0YSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGxldCBhcnJheSA9IFtdLFxuICAgICAgbGV0dGVyO1xuXG4gICAgXy5mb3JFYWNoKGRhdGEsIGl0ZW0gPT4ge1xuICAgICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcblxuICAgICAgICBjYXNlICdzZWwnOiAgICAgICAvLyBDU1NcbiAgICAgICAgY2FzZSAnc2VsZWN0b3InOiAgLy8gTEVTUywgU0FTU1xuICAgICAgICAgIGxldHRlciA9ICdTJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncHJvcCc6ICAgICAgLy8gQ1NTXG4gICAgICAgICAgaWYgKHNlbGYudm0uQ09ORklHX1NIT1dfUFJPUEVSVElFUykge1xuICAgICAgICAgICAgbGV0dGVyID0gJ1AnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlbGVtJzogICAgICAvLyBIVE1MXG4gICAgICAgICAgbGV0dGVyID0gJyc7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnY2xhc3MnOiAgICAgLy8gSlNcbiAgICAgICAgICBsZXR0ZXIgPSAnQyc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ltcG9ydCc6ICAgIC8vIEpTXG4gICAgICAgICAgbGV0dGVyID0gJ0knO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmdW5jdGlvbic6ICAvLyBKUywgQ1xuICAgICAgICAgIGxldHRlciA9ICdGJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbWV0aG9kJzogICAgLy8gSlNcbiAgICAgICAgY2FzZSAnbWVtYmVyJzogICAgLy8gSlNPTiwgQ1NPTiwgTUFSS0RPV05cbiAgICAgICAgICBsZXR0ZXIgPSAnTSc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Zhcic6ICAgICAgIC8vIEpTXG4gICAgICAgIGNhc2UgJ3ZhcmlhYmxlJzogIC8vIENcbiAgICAgICAgY2FzZSAnbWFjcm8nOlxuICAgICAgICAgIGlmIChzZWxmLnZtLkNPTkZJR19TSE9XX1ZBUklBQkxFUykge1xuICAgICAgICAgICAgbGV0dGVyID0gJ1YnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGxldHRlciA9ICdVJztcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxldCBpY29uVHBsO1xuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2VsZW0nKSB7XG4gICAgICAgIGljb25UcGwgPSBgPHNwYW4gY2xhc3M9XCJpY29uIGljb24tY29kZVwiPjwvc3Bhbj5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWNvblRwbCA9IGA8ZGl2IGNsYXNzPVwiaWNvbi1jaXJjbGUgaWNvbi0ke2xldHRlcn1cIj48c3Bhbj4ke2xldHRlcn08L3NwYW4+PC9kaXY+YDtcbiAgICAgIH1cblxuICAgICAgbGV0IGVudHJ5ID0gYDxsaSBub2RlLWlkPVwiJHtpdGVtLmlkfVwiIGNsYXNzPVwibGlzdC1pdGVtXCIgdGl0bGU9XCIke2l0ZW0ubmFtZX1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInN5bWJvbC1taXhlZC1ibG9ja1wiPlxuICAgICAgICAgICAgJHtpY29uVHBsfVxuICAgICAgICAgICAgPHNwYW4+JHtpdGVtLm5hbWV9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbGk+YDtcblxuICAgICAgaWYgKGl0ZW0uY2hpbGQpIHtcbiAgICAgICAgICBsZXQgY2hpbGRDb250ZW50ID0gc2VsZi50cmVlR2VuZXJhdG9yKGl0ZW0uY2hpbGQpO1xuXG4gICAgICAgICAgaWYgKGNoaWxkQ29udGVudC5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgZW50cnkgPSBgPGxpIG5vZGUtaWQ9XCIke2l0ZW0uaWR9XCIgY2xhc3M9XCJsaXN0LW5lc3RlZC1pdGVtIGV4cGFuZGVkXCIgdGl0bGU9XCIke2l0ZW0ubmFtZX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0gc3ltYm9sLW1peGVkLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtpY29uVHBsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7aXRlbS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9sIGNsYXNzPVwibGlzdC10cmVlXCI+JHtjaGlsZENvbnRlbnR9PC9vbD5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5gO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXJyYXkucHVzaChlbnRyeSk7XG5cbiAgICB9KTtcblxuICAgIHJldHVybiBhcnJheS5qb2luKCcnKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHt9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgaWYgKHRoaXMudm0uY3Vyc29yTGlzdGVuZXIpIHtcbiAgICAgIHRoaXMudm0uY3Vyc29yTGlzdGVuZXIuZGlzcG9zZSgpO1xuICAgICAgdGhpcy52bS5jdXJzb3JMaXN0ZW5lciA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnZtLnRleHRFZGl0b3JMaXN0ZW5lcikge1xuICAgICAgdGhpcy52bS50ZXh0RWRpdG9yTGlzdGVuZXIuZGlzcG9zZSgpO1xuICAgICAgdGhpcy52bS50ZXh0RWRpdG9yTGlzdGVuZXIgPSBudWxsO1xuICAgIH1cbiAgICBfLmZvckVhY2godGhpcy52bS5lZGl0b3JTYXZlTGlzdGVuZXIsIGl0ZW0gPT4ge1xuICAgICAgaXRlbS5kaXNwb3NlKClcbiAgICB9KTtcbiAgICB0aGlzLnZtLmVkaXRvclNhdmVMaXN0ZW5lciA9IHt9O1xuICAgIC8vIHRoaXMudm0uJGRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnU3RydWN0dXJlIFZpZXcnO1xuICB9XG59XG4iXX0=