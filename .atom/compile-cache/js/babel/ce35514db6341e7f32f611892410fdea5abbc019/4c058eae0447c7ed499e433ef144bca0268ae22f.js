Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _path = require('path');

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

'use babel';

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-ruby');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-ruby.rubyExecutablePath', function (value) {
      _this.executablePath = value;
    }), atom.config.observe('linter-ruby.ignoredExtensions', function (value) {
      _this.ignoredExtensions = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    var regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/g;
    return {
      name: 'Ruby',
      grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec'],
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        if (!filePath) {
          // We somehow got called without a file path
          return null;
        }
        var fileText = textEditor.getText();
        var fileExtension = (0, _path.extname)(filePath).substr(1);

        if (_this2.ignoredExtensions.includes(fileExtension)) {
          return [];
        }

        var execArgs = ['-c', // Check syntax only, no execution
        '-w', // Turns on warnings
        // Set the encoding to UTF-8
        '--external-encoding=utf-8', '--internal-encoding=utf-8'];
        var execOpts = {
          stdin: fileText,
          stream: 'stderr',
          allowEmptyStderr: true
        };
        var output = yield helpers.exec(_this2.executablePath, execArgs, execOpts);
        if (textEditor.getText() !== fileText) {
          // File contents have changed, just tell Linter not to update messages
          return null;
        }
        var toReturn = [];
        var match = regex.exec(output);
        while (match !== null) {
          var msgLine = Number.parseInt(match[1] - 1, 10);
          var severity = match[2] === 'warning' ? 'warning' : 'error';
          toReturn.push({
            severity: severity,
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, msgLine)
            },
            excerpt: match[3]
          });
          match = regex.exec(output);
        }
        return toReturn;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJ5L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzBCQUV5QixhQUFhOztJQUExQixPQUFPOztvQkFDSyxNQUFNOzs7O29CQUVNLE1BQU07O0FBTDFDLFdBQVcsQ0FBQzs7cUJBT0c7QUFDYixVQUFRLEVBQUEsb0JBQUc7OztBQUNULFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDL0QsWUFBSyxjQUFjLEdBQUcsS0FBSyxDQUFDO0tBQzdCLENBQUMsRUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsRUFBRSxVQUFDLEtBQUssRUFBSztBQUM5RCxZQUFLLGlCQUFpQixHQUFHLEtBQUssQ0FBQztLQUNoQyxDQUFDLENBQ0gsQ0FBQztHQUNIOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDOUI7O0FBRUQsZUFBYSxFQUFBLHlCQUFHOzs7QUFDZCxRQUFNLEtBQUssR0FBRyw4QkFBOEIsQ0FBQztBQUM3QyxXQUFPO0FBQ0wsVUFBSSxFQUFFLE1BQU07QUFDWixtQkFBYSxFQUFFLENBQUMsYUFBYSxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDO0FBQ3hFLFdBQUssRUFBRSxNQUFNO0FBQ2IsbUJBQWEsRUFBRSxJQUFJO0FBQ25CLFVBQUksb0JBQUUsV0FBTyxVQUFVLEVBQUs7QUFDMUIsWUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxRQUFRLEVBQUU7O0FBRWIsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7QUFDRCxZQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEMsWUFBTSxhQUFhLEdBQUcsbUJBQVEsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVsRCxZQUFJLE9BQUssaUJBQWlCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0FBQ2xELGlCQUFPLEVBQUUsQ0FBQztTQUNYOztBQUVELFlBQU0sUUFBUSxHQUFHLENBQ2YsSUFBSTtBQUNKLFlBQUk7O0FBRUosbUNBQTJCLEVBQzNCLDJCQUEyQixDQUM1QixDQUFDO0FBQ0YsWUFBTSxRQUFRLEdBQUc7QUFDZixlQUFLLEVBQUUsUUFBUTtBQUNmLGdCQUFNLEVBQUUsUUFBUTtBQUNoQiwwQkFBZ0IsRUFBRSxJQUFJO1NBQ3ZCLENBQUM7QUFDRixZQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBSyxjQUFjLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNFLFlBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLFFBQVEsRUFBRTs7QUFFckMsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7QUFDRCxZQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDcEIsWUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixlQUFPLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDckIsY0FBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2xELGNBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUM5RCxrQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLG9CQUFRLEVBQVIsUUFBUTtBQUNSLG9CQUFRLEVBQUU7QUFDUixrQkFBSSxFQUFFLFFBQVE7QUFDZCxzQkFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQzthQUNyRDtBQUNELG1CQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztXQUNsQixDQUFDLENBQUM7QUFDSCxlQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtBQUNELGVBQU8sUUFBUSxDQUFDO09BQ2pCLENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJ2F0b20tbGludGVyJztcbmltcG9ydCB7IGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItcnVieScpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXJ1YnkucnVieUV4ZWN1dGFibGVQYXRoJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZXhlY3V0YWJsZVBhdGggPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXJ1YnkuaWdub3JlZEV4dGVuc2lvbnMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5pZ25vcmVkRXh0ZW5zaW9ucyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICBjb25zdCByZWdleCA9IC8uKzooXFxkKyk6XFxzKiguKz8pWyw6XVxccyguKykvZztcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1J1YnknLFxuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UucnVieScsICdzb3VyY2UucnVieS5yYWlscycsICdzb3VyY2UucnVieS5yc3BlYyddLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRzT25DaGFuZ2U6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICAgICAgLy8gV2Ugc29tZWhvdyBnb3QgY2FsbGVkIHdpdGhvdXQgYSBmaWxlIHBhdGhcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlVGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gZXh0bmFtZShmaWxlUGF0aCkuc3Vic3RyKDEpO1xuXG4gICAgICAgIGlmICh0aGlzLmlnbm9yZWRFeHRlbnNpb25zLmluY2x1ZGVzKGZpbGVFeHRlbnNpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXhlY0FyZ3MgPSBbXG4gICAgICAgICAgJy1jJywgLy8gQ2hlY2sgc3ludGF4IG9ubHksIG5vIGV4ZWN1dGlvblxuICAgICAgICAgICctdycsIC8vIFR1cm5zIG9uIHdhcm5pbmdzXG4gICAgICAgICAgLy8gU2V0IHRoZSBlbmNvZGluZyB0byBVVEYtOFxuICAgICAgICAgICctLWV4dGVybmFsLWVuY29kaW5nPXV0Zi04JyxcbiAgICAgICAgICAnLS1pbnRlcm5hbC1lbmNvZGluZz11dGYtOCcsXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IGV4ZWNPcHRzID0ge1xuICAgICAgICAgIHN0ZGluOiBmaWxlVGV4dCxcbiAgICAgICAgICBzdHJlYW06ICdzdGRlcnInLFxuICAgICAgICAgIGFsbG93RW1wdHlTdGRlcnI6IHRydWUsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IGhlbHBlcnMuZXhlYyh0aGlzLmV4ZWN1dGFibGVQYXRoLCBleGVjQXJncywgZXhlY09wdHMpO1xuICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVUZXh0KSB7XG4gICAgICAgICAgLy8gRmlsZSBjb250ZW50cyBoYXZlIGNoYW5nZWQsIGp1c3QgdGVsbCBMaW50ZXIgbm90IHRvIHVwZGF0ZSBtZXNzYWdlc1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gW107XG4gICAgICAgIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgbXNnTGluZSA9IE51bWJlci5wYXJzZUludChtYXRjaFsxXSAtIDEsIDEwKTtcbiAgICAgICAgICBjb25zdCBzZXZlcml0eSA9IG1hdGNoWzJdID09PSAnd2FybmluZycgPyAnd2FybmluZycgOiAnZXJyb3InO1xuICAgICAgICAgIHRvUmV0dXJuLnB1c2goe1xuICAgICAgICAgICAgc2V2ZXJpdHksXG4gICAgICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgICBmaWxlOiBmaWxlUGF0aCxcbiAgICAgICAgICAgICAgcG9zaXRpb246IGhlbHBlcnMuZ2VuZXJhdGVSYW5nZSh0ZXh0RWRpdG9yLCBtc2dMaW5lKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleGNlcnB0OiBtYXRjaFszXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19