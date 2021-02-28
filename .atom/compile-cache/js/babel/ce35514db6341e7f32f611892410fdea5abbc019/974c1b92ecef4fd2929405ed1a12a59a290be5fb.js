Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _structureView = require('./structure-view');

var _structureView2 = _interopRequireDefault(_structureView);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

'use babel';
exports['default'] = {
  structureView: null,

  activate: function activate(state) {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'structure-view:toggle': function structureViewToggle() {
        return _this['switch']();
      },
      'structure-view:show': function structureViewShow() {
        return _this['switch']('on');
      },
      'structure-view:hide': function structureViewHide() {
        return _this['switch']('off');
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
    this.structureView.destroy();
  },

  serialize: function serialize() {},

  'switch': function _switch(stat) {
    var editors = atom.workspace.getTextEditors();
    if (editors.length < 1 || editors.length === 1 && !editors[0].getPath()) return _util2['default'].alert('WARN', 'No file is opened!');

    if (!this.structureView) this.structureView = new _structureView2['default']();

    var rightDock = atom.workspace.getRightDock();
    try {
      // Whatever do these first for performance
      rightDock.getPanes()[0].addItem(this.structureView);
      rightDock.getPanes()[0].activateItem(this.structureView);
    } catch (e) {
      if (e.message.includes('can only contain one instance of item')) {
        this.handleOneInstanceError();
      }
    }

    // Sometimes dock title is hidden for somehow,
    // so force recalculate here to redraw
    (0, _jquery2['default'])('ul.list-inline.tab-bar.inset-panel').height();

    if (!stat) {
      rightDock.toggle();
      this.structureView.vm.viewShow = !this.structureView.vm.viewShow;
    } else if ('on' === stat) {
      rightDock.show();
      this.structureView.vm.viewShow = true;
    } else if ('off' === stat) {
      rightDock.hide();
      this.structureView.vm.viewShow = false;
    }
    if (rightDock.isVisible()) this.structureView.initialize();
  },

  handleOneInstanceError: function handleOneInstanceError() {
    var _this2 = this;

    var activePane = null;
    var rightDock = atom.workspace.getRightDock();
    atom.workspace.getPanes().forEach(function (pane) {
      pane.getItems().forEach(function (item) {
        if (item === _this2.structureView) activePane = pane;
      });
    });
    if (activePane) {
      activePane.destroyItem(this.structureView, true);
      this.structureView.destroy();
    }

    rightDock.getPanes()[0].addItem(this.structureView);
    rightDock.getPanes()[0].activateItem(this.structureView);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFDb0MsTUFBTTs7c0JBQzVCLFFBQVE7Ozs7NkJBQ0ksa0JBQWtCOzs7O29CQUMzQixRQUFROzs7O0FBSnpCLFdBQVcsQ0FBQztxQkFNRztBQUNiLGVBQWEsRUFBRSxJQUFJOztBQUVuQixVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFOzs7QUFDZCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3pELDZCQUF1QixFQUFFO2VBQU0sZUFBVyxFQUFFO09BQUE7QUFDNUMsMkJBQXFCLEVBQUU7ZUFBTSxlQUFXLENBQUMsSUFBSSxDQUFDO09BQUE7QUFDOUMsMkJBQXFCLEVBQUU7ZUFBTSxlQUFXLENBQUMsS0FBSyxDQUFDO09BQUE7S0FDaEQsQ0FBQyxDQUFDLENBQUM7R0FDTDs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDOUI7O0FBRUQsV0FBUyxFQUFBLHFCQUFHLEVBQUU7O0FBRWQsWUFBTyxpQkFBQyxJQUFJLEVBQUU7QUFDWixRQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzlDLFFBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQ25CLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxBQUFDLEVBQUUsT0FBTyxrQkFBSyxLQUFLLENBQUMsTUFBTSxFQUFFLG9CQUFvQixDQUFDLENBQUM7O0FBRW5HLFFBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsZ0NBQW1CLENBQUM7O0FBRWxFLFFBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEQsUUFBSTs7QUFFRixlQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNwRCxlQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUMxRCxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsVUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFFO0FBQy9ELFlBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO09BQy9CO0tBQ0Y7Ozs7QUFJRCw2QkFBRSxvQ0FBb0MsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVqRCxRQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsZUFBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztLQUNsRSxNQUFNLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtBQUN4QixlQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN2QyxNQUFNLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUN6QixlQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztLQUN4QztBQUNELFFBQUksU0FBUyxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDNUQ7O0FBRUQsd0JBQXNCLEVBQUEsa0NBQUc7OztBQUN2QixRQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdEIsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNoRCxRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBSTtBQUN4QyxVQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQzlCLFlBQUksSUFBSSxLQUFLLE9BQUssYUFBYSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUM7T0FDcEQsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0FBQ0gsUUFBSSxVQUFVLEVBQUU7QUFDZCxnQkFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDOUI7O0FBRUQsYUFBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEQsYUFBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7R0FDMUQ7Q0FDRiIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9zdHJ1Y3R1cmUtdmlldy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBTdHJ1Y3R1cmVWaWV3IGZyb20gJy4vc3RydWN0dXJlLXZpZXcnO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzdHJ1Y3R1cmVWaWV3OiBudWxsLFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdzdHJ1Y3R1cmUtdmlldzp0b2dnbGUnOiAoKSA9PiB0aGlzLnN3aXRjaCgpLFxuICAgICAgJ3N0cnVjdHVyZS12aWV3OnNob3cnOiAoKSA9PiB0aGlzLnN3aXRjaCgnb24nKSxcbiAgICAgICdzdHJ1Y3R1cmUtdmlldzpoaWRlJzogKCkgPT4gdGhpcy5zd2l0Y2goJ29mZicpLFxuICAgIH0pKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdHJ1Y3R1cmVWaWV3LmRlc3Ryb3koKTtcbiAgfSxcblxuICBzZXJpYWxpemUoKSB7fSxcblxuICBzd2l0Y2ggKHN0YXQpIHtcbiAgICBsZXQgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCk7XG4gICAgaWYgKGVkaXRvcnMubGVuZ3RoIDwgMSB8fFxuICAgICAgKGVkaXRvcnMubGVuZ3RoID09PSAxICYmICFlZGl0b3JzWzBdLmdldFBhdGgoKSkpIHJldHVybiBVdGlsLmFsZXJ0KCdXQVJOJywgJ05vIGZpbGUgaXMgb3BlbmVkIScpO1xuXG4gICAgaWYgKCF0aGlzLnN0cnVjdHVyZVZpZXcpIHRoaXMuc3RydWN0dXJlVmlldyA9IG5ldyBTdHJ1Y3R1cmVWaWV3KCk7XG5cbiAgICBjb25zdCByaWdodERvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRSaWdodERvY2soKTtcbiAgICB0cnkge1xuICAgICAgLy8gV2hhdGV2ZXIgZG8gdGhlc2UgZmlyc3QgZm9yIHBlcmZvcm1hbmNlXG4gICAgICByaWdodERvY2suZ2V0UGFuZXMoKVswXS5hZGRJdGVtKHRoaXMuc3RydWN0dXJlVmlldyk7XG4gICAgICByaWdodERvY2suZ2V0UGFuZXMoKVswXS5hY3RpdmF0ZUl0ZW0odGhpcy5zdHJ1Y3R1cmVWaWV3KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5tZXNzYWdlLmluY2x1ZGVzKCdjYW4gb25seSBjb250YWluIG9uZSBpbnN0YW5jZSBvZiBpdGVtJykpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVPbmVJbnN0YW5jZUVycm9yKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU29tZXRpbWVzIGRvY2sgdGl0bGUgaXMgaGlkZGVuIGZvciBzb21laG93LFxuICAgIC8vIHNvIGZvcmNlIHJlY2FsY3VsYXRlIGhlcmUgdG8gcmVkcmF3XG4gICAgJCgndWwubGlzdC1pbmxpbmUudGFiLWJhci5pbnNldC1wYW5lbCcpLmhlaWdodCgpO1xuXG4gICAgaWYgKCFzdGF0KSB7XG4gICAgICByaWdodERvY2sudG9nZ2xlKCk7XG4gICAgICB0aGlzLnN0cnVjdHVyZVZpZXcudm0udmlld1Nob3cgPSAhdGhpcy5zdHJ1Y3R1cmVWaWV3LnZtLnZpZXdTaG93O1xuICAgIH0gZWxzZSBpZiAoJ29uJyA9PT0gc3RhdCkge1xuICAgICAgcmlnaHREb2NrLnNob3coKTtcbiAgICAgIHRoaXMuc3RydWN0dXJlVmlldy52bS52aWV3U2hvdyA9IHRydWU7XG4gICAgfSBlbHNlIGlmICgnb2ZmJyA9PT0gc3RhdCkge1xuICAgICAgcmlnaHREb2NrLmhpZGUoKTtcbiAgICAgIHRoaXMuc3RydWN0dXJlVmlldy52bS52aWV3U2hvdyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAocmlnaHREb2NrLmlzVmlzaWJsZSgpKSB0aGlzLnN0cnVjdHVyZVZpZXcuaW5pdGlhbGl6ZSgpO1xuICB9LFxuXG4gIGhhbmRsZU9uZUluc3RhbmNlRXJyb3IoKSB7XG4gICAgbGV0IGFjdGl2ZVBhbmUgPSBudWxsO1xuICAgIGNvbnN0IHJpZ2h0RG9jayA9IGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaygpO1xuICAgIGF0b20ud29ya3NwYWNlLmdldFBhbmVzKCkuZm9yRWFjaChwYW5lID0+IHtcbiAgICAgIHBhbmUuZ2V0SXRlbXMoKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAoaXRlbSA9PT0gdGhpcy5zdHJ1Y3R1cmVWaWV3KSBhY3RpdmVQYW5lID0gcGFuZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChhY3RpdmVQYW5lKSB7XG4gICAgICBhY3RpdmVQYW5lLmRlc3Ryb3lJdGVtKHRoaXMuc3RydWN0dXJlVmlldywgdHJ1ZSk7XG4gICAgICB0aGlzLnN0cnVjdHVyZVZpZXcuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHJpZ2h0RG9jay5nZXRQYW5lcygpWzBdLmFkZEl0ZW0odGhpcy5zdHJ1Y3R1cmVWaWV3KTtcbiAgICByaWdodERvY2suZ2V0UGFuZXMoKVswXS5hY3RpdmF0ZUl0ZW0odGhpcy5zdHJ1Y3R1cmVWaWV3KTtcbiAgfVxufVxuIl19