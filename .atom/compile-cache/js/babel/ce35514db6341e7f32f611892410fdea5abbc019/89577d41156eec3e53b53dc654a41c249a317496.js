Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _blameGutterView = require('./blame-gutter-view');

var _blameGutterView2 = _interopRequireDefault(_blameGutterView);

'use babel';

exports['default'] = {
  gitBlameMeView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    gutterFormat: {
      title: 'Format (gutter)',
      description: 'Placeholders: `{hash}`, `{date}` and `{author}.`',
      type: 'string',
      'default': '{hash} {date} {author}'
    },
    dateFormat: {
      title: 'Format (date)',
      description: ['Placeholders: `YYYY` (year), `MM` (month), `DD` (day), `HH` (hours), `mm` (minutes).', 'See [momentjs documentation](http://momentjs.com/docs/#/parsing/string-format/) for mor information.'].join('<br>'),
      type: 'string',
      'default': 'YYYY-MM-DD'
    },
    defaultWidth: {
      title: 'Default width (px)',
      type: 'integer',
      'default': 250,
      minimum: 50,
      maximum: 500
    },
    ignoreWhitespace: {
      type: 'boolean',
      'default': true
    },
    detectMoved: {
      type: 'boolean',
      'default': true
    },
    detectCopy: {
      type: 'boolean',
      'default': true
    }
  },

  activate: function activate() {
    var _this = this;

    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this.state = state;
    this.gutters = new Map();
    this.disposables = new _atom.CompositeDisposable();

    this.disposables.add(atom.commands.add('atom-workspace', {
      'blame:toggle': function blameToggle() {
        return _this.toggleBlameGutter();
      }
    }));
  },

  toggleBlameGutter: function toggleBlameGutter() {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }

    var gutter = this.gutters.get(editor);
    if (gutter) {
      gutter.toggleVisible();
    } else {
      gutter = new _blameGutterView2['default'](this.state, editor);
      this.disposables.add(gutter);
      this.gutters.set(editor, gutter);
    }
  },

  deactivate: function deactivate() {
    this.disposables.dispose();
  },

  serialize: function serialize() {
    return this.state;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9pbml0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7K0JBQ2QscUJBQXFCOzs7O0FBSGpELFdBQVcsQ0FBQTs7cUJBS0k7QUFDYixnQkFBYyxFQUFFLElBQUk7QUFDcEIsWUFBVSxFQUFFLElBQUk7QUFDaEIsZUFBYSxFQUFFLElBQUk7O0FBRW5CLFFBQU0sRUFBRTtBQUNOLGdCQUFZLEVBQUU7QUFDWixXQUFLLEVBQUUsaUJBQWlCO0FBQ3hCLGlCQUFXLEVBQUUsa0RBQWtEO0FBQy9ELFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsd0JBQXdCO0tBQ2xDO0FBQ0QsY0FBVSxFQUFFO0FBQ1YsV0FBSyxFQUFFLGVBQWU7QUFDdEIsaUJBQVcsRUFBRSxDQUNYLHNGQUFzRixFQUN0RixzR0FBc0csQ0FDdkcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2QsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxZQUFZO0tBQ3RCO0FBQ0QsZ0JBQVksRUFBRTtBQUNaLFdBQUssRUFBRSxvQkFBb0I7QUFDM0IsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxHQUFHO0FBQ1osYUFBTyxFQUFFLEVBQUU7QUFDWCxhQUFPLEVBQUUsR0FBRztLQUNiO0FBQ0Qsb0JBQWdCLEVBQUU7QUFDaEIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7QUFDRCxlQUFXLEVBQUU7QUFDWCxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDtBQUNELGNBQVUsRUFBRTtBQUNWLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtLQUNkO0dBQ0Y7O0FBRUQsVUFBUSxFQUFDLG9CQUFhOzs7UUFBWixLQUFLLHlEQUFHLEVBQUU7O0FBQ2xCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBOztBQUU1QyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RCxvQkFBYyxFQUFFO2VBQU0sTUFBSyxpQkFBaUIsRUFBRTtPQUFBO0tBQy9DLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O0FBRUQsbUJBQWlCLEVBQUMsNkJBQUc7QUFDbkIsUUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ25ELFFBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxhQUFNO0tBQUU7O0FBRXZCLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3JDLFFBQUksTUFBTSxFQUFFO0FBQ1YsWUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFBO0tBQ3ZCLE1BQU07QUFDTCxZQUFNLEdBQUcsaUNBQW9CLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDaEQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0tBQ2pDO0dBQ0Y7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUMzQjs7QUFFRCxXQUFTLEVBQUMscUJBQUc7QUFDWCxXQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7R0FDbEI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvaW5pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEJsYW1lR3V0dGVyVmlldyBmcm9tICcuL2JsYW1lLWd1dHRlci12aWV3J1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdpdEJsYW1lTWVWaWV3OiBudWxsLFxuICBtb2RhbFBhbmVsOiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGNvbmZpZzoge1xuICAgIGd1dHRlckZvcm1hdDoge1xuICAgICAgdGl0bGU6ICdGb3JtYXQgKGd1dHRlciknLFxuICAgICAgZGVzY3JpcHRpb246ICdQbGFjZWhvbGRlcnM6IGB7aGFzaH1gLCBge2RhdGV9YCBhbmQgYHthdXRob3J9LmAnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAne2hhc2h9IHtkYXRlfSB7YXV0aG9yfSdcbiAgICB9LFxuICAgIGRhdGVGb3JtYXQ6IHtcbiAgICAgIHRpdGxlOiAnRm9ybWF0IChkYXRlKScsXG4gICAgICBkZXNjcmlwdGlvbjogW1xuICAgICAgICAnUGxhY2Vob2xkZXJzOiBgWVlZWWAgKHllYXIpLCBgTU1gIChtb250aCksIGBERGAgKGRheSksIGBISGAgKGhvdXJzKSwgYG1tYCAobWludXRlcykuJyxcbiAgICAgICAgJ1NlZSBbbW9tZW50anMgZG9jdW1lbnRhdGlvbl0oaHR0cDovL21vbWVudGpzLmNvbS9kb2NzLyMvcGFyc2luZy9zdHJpbmctZm9ybWF0LykgZm9yIG1vciBpbmZvcm1hdGlvbi4nXG4gICAgICBdLmpvaW4oJzxicj4nKSxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ1lZWVktTU0tREQnXG4gICAgfSxcbiAgICBkZWZhdWx0V2lkdGg6IHtcbiAgICAgIHRpdGxlOiAnRGVmYXVsdCB3aWR0aCAocHgpJyxcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDI1MCxcbiAgICAgIG1pbmltdW06IDUwLFxuICAgICAgbWF4aW11bTogNTAwXG4gICAgfSxcbiAgICBpZ25vcmVXaGl0ZXNwYWNlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBkZXRlY3RNb3ZlZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG4gICAgZGV0ZWN0Q29weToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZSAoc3RhdGUgPSB7fSkge1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZVxuICAgIHRoaXMuZ3V0dGVycyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnYmxhbWU6dG9nZ2xlJzogKCkgPT4gdGhpcy50b2dnbGVCbGFtZUd1dHRlcigpXG4gICAgfSkpXG4gIH0sXG5cbiAgdG9nZ2xlQmxhbWVHdXR0ZXIgKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSB7IHJldHVybiB9XG5cbiAgICBsZXQgZ3V0dGVyID0gdGhpcy5ndXR0ZXJzLmdldChlZGl0b3IpXG4gICAgaWYgKGd1dHRlcikge1xuICAgICAgZ3V0dGVyLnRvZ2dsZVZpc2libGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICBndXR0ZXIgPSBuZXcgQmxhbWVHdXR0ZXJWaWV3KHRoaXMuc3RhdGUsIGVkaXRvcilcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGd1dHRlcilcbiAgICAgIHRoaXMuZ3V0dGVycy5zZXQoZWRpdG9yLCBndXR0ZXIpXG4gICAgfVxuICB9LFxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIH0sXG5cbiAgc2VyaWFsaXplICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVxuICB9XG59XG4iXX0=