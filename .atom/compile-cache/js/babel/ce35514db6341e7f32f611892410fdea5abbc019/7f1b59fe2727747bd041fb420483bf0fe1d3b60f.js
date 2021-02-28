Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint-disable import/no-duplicates */

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var LinterRegistry = (function () {
  function LinterRegistry() {
    var _this = this;

    _classCallCheck(this, LinterRegistry);

    this.emitter = new _atom.Emitter();
    this.linters = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.activeNotifications = new Set();

    this.subscriptions.add(atom.config.observe('linter.lintOnChange', function (lintOnChange) {
      _this.lintOnChange = lintOnChange;
    }));
    this.subscriptions.add(atom.config.observe('core.excludeVcsIgnoredPaths', function (ignoreVCS) {
      _this.ignoreVCS = ignoreVCS;
    }));
    this.subscriptions.add(atom.config.observe('linter.ignoreGlob', function (ignoreGlob) {
      _this.ignoreGlob = ignoreGlob;
    }));
    this.subscriptions.add(atom.config.observe('linter.lintPreviewTabs', function (lintPreviewTabs) {
      _this.lintPreviewTabs = lintPreviewTabs;
    }));
    this.subscriptions.add(atom.config.observe('linter.disabledProviders', function (disabledProviders) {
      _this.disabledProviders = disabledProviders;
    }));
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      if (!Validate.linter(linter)) {
        return;
      }
      linter[_helpers.$activated] = true;
      if (typeof linter[_helpers.$requestLatest] === 'undefined') {
        linter[_helpers.$requestLatest] = 0;
      }
      if (typeof linter[_helpers.$requestLastReceived] === 'undefined') {
        linter[_helpers.$requestLastReceived] = 0;
      }
      linter[_helpers.$version] = 2;
      this.linters.add(linter);
    }
  }, {
    key: 'getProviders',
    value: function getProviders() {
      return Array.from(this.linters);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (!this.linters.has(linter)) {
        return;
      }
      linter[_helpers.$activated] = false;
      this.linters['delete'](linter);
    }
  }, {
    key: 'lint',
    value: _asyncToGenerator(function* (_ref) {
      var onChange = _ref.onChange;
      var editor = _ref.editor;
      return yield* (function* () {
        var _this2 = this;

        var filePath = editor.getPath();

        if (onChange && !this.lintOnChange || // Lint-on-change mismatch
        !filePath || // Not saved anywhere yet
        Helpers.isPathIgnored(editor.getPath(), this.ignoreGlob, this.ignoreVCS) || // Ignored by VCS or Glob
        !this.lintPreviewTabs && atom.workspace.getActivePane().getPendingItem() === editor // Ignore Preview tabs
        ) {
            return false;
          }

        var scopes = Helpers.getEditorCursorScopes(editor);

        var promises = [];

        var _loop = function (linter) {
          if (!Helpers.shouldTriggerLinter(linter, onChange, scopes)) {
            return 'continue';
          }
          if (_this2.disabledProviders.includes(linter.name)) {
            return 'continue';
          }
          var number = ++linter[_helpers.$requestLatest];
          var statusBuffer = linter.scope === 'file' ? editor.getBuffer() : null;
          var statusFilePath = linter.scope === 'file' ? filePath : null;

          _this2.emitter.emit('did-begin-linting', { number: number, linter: linter, filePath: statusFilePath });
          promises.push(new Promise(function (resolve) {
            // $FlowIgnore: Type too complex, duh
            resolve(linter.lint(editor));
          }).then(function (messages) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });
            if (linter[_helpers.$requestLastReceived] >= number || !linter[_helpers.$activated] || statusBuffer && !statusBuffer.isAlive()) {
              return;
            }
            linter[_helpers.$requestLastReceived] = number;
            if (statusBuffer && !statusBuffer.isAlive()) {
              return;
            }

            if (messages === null) {
              // NOTE: Do NOT update the messages when providers return null
              return;
            }

            var validity = true;
            // NOTE: We are calling it when results are not an array to show a nice notification
            if (atom.inDevMode() || !Array.isArray(messages)) {
              validity = Validate.messages(linter.name, messages);
            }
            if (!validity) {
              return;
            }

            Helpers.normalizeMessages(linter.name, messages);
            _this2.emitter.emit('did-update-messages', { messages: messages, linter: linter, buffer: statusBuffer });
          }, function (error) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });

            console.error('[Linter] Error running ' + linter.name, error);
            var notificationMessage = '[Linter] Error running ' + linter.name;
            if (Array.from(_this2.activeNotifications).some(function (item) {
              return item.getOptions().detail === notificationMessage;
            })) {
              // This message is still showing to the user!
              return;
            }

            var notification = atom.notifications.addError(notificationMessage, {
              detail: 'See Console for more info.',
              dismissable: true,
              buttons: [{
                text: 'Open Console',
                onDidClick: function onDidClick() {
                  atom.openDevTools();
                  notification.dismiss();
                }
              }, {
                text: 'Cancel',
                onDidClick: function onDidClick() {
                  notification.dismiss();
                }
              }]
            });
          }));
        };

        for (var linter of this.linters) {
          var _ret = _loop(linter);

          if (_ret === 'continue') continue;
        }

        yield Promise.all(promises);
        return true;
      }).apply(this, arguments);
    })
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'onDidBeginLinting',
    value: function onDidBeginLinting(callback) {
      return this.emitter.on('did-begin-linting', callback);
    }
  }, {
    key: 'onDidFinishLinting',
    value: function onDidFinishLinting(callback) {
      return this.emitter.on('did-finish-linting', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.activeNotifications.forEach(function (notification) {
        return notification.dismiss();
      });
      this.activeNotifications.clear();
      this.linters.clear();
      this.subscriptions.dispose();
    }
  }]);

  return LinterRegistry;
})();

exports['default'] = LinterRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUc2QyxNQUFNOzt1QkFHMUIsV0FBVzs7SUFBeEIsT0FBTzs7d0JBQ08sWUFBWTs7SUFBMUIsUUFBUTs7SUFJZCxjQUFjO0FBV1AsV0FYUCxjQUFjLEdBV0o7OzswQkFYVixjQUFjOztBQVloQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRXBDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxVQUFBLFlBQVksRUFBSTtBQUN6RCxZQUFLLFlBQVksR0FBRyxZQUFZLENBQUE7S0FDakMsQ0FBQyxDQUNILENBQUE7QUFDRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsVUFBQSxTQUFTLEVBQUk7QUFDOUQsWUFBSyxTQUFTLEdBQUcsU0FBUyxDQUFBO0tBQzNCLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQUEsVUFBVSxFQUFJO0FBQ3JELFlBQUssVUFBVSxHQUFHLFVBQVUsQ0FBQTtLQUM3QixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9B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TCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1kdXBsaWNhdGVzICovXG5cbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yLCBEaXNwb3NhYmxlLCBOb3RpZmljYXRpb24gfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgeyAkdmVyc2lvbiwgJGFjdGl2YXRlZCwgJHJlcXVlc3RMYXRlc3QsICRyZXF1ZXN0TGFzdFJlY2VpdmVkIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBMaW50ZXJSZWdpc3RyeSB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgbGludGVyczogU2V0PExpbnRlcj5cbiAgbGludE9uQ2hhbmdlOiBib29sZWFuXG4gIGlnbm9yZVZDUzogYm9vbGVhblxuICBpZ25vcmVHbG9iOiBzdHJpbmdcbiAgbGludFByZXZpZXdUYWJzOiBib29sZWFuXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgZGlzYWJsZWRQcm92aWRlcnM6IEFycmF5PHN0cmluZz5cbiAgYWN0aXZlTm90aWZpY2F0aW9uczogU2V0PE5vdGlmaWNhdGlvbj5cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5saW50ZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucyA9IG5ldyBTZXQoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50T25DaGFuZ2UnLCBsaW50T25DaGFuZ2UgPT4ge1xuICAgICAgICB0aGlzLmxpbnRPbkNoYW5nZSA9IGxpbnRPbkNoYW5nZVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdjb3JlLmV4Y2x1ZGVWY3NJZ25vcmVkUGF0aHMnLCBpZ25vcmVWQ1MgPT4ge1xuICAgICAgICB0aGlzLmlnbm9yZVZDUyA9IGlnbm9yZVZDU1xuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuaWdub3JlR2xvYicsIGlnbm9yZUdsb2IgPT4ge1xuICAgICAgICB0aGlzLmlnbm9yZUdsb2IgPSBpZ25vcmVHbG9iXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50UHJldmlld1RhYnMnLCBsaW50UHJldmlld1RhYnMgPT4ge1xuICAgICAgICB0aGlzLmxpbnRQcmV2aWV3VGFicyA9IGxpbnRQcmV2aWV3VGFic1xuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuZGlzYWJsZWRQcm92aWRlcnMnLCBkaXNhYmxlZFByb3ZpZGVycyA9PiB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWRQcm92aWRlcnMgPSBkaXNhYmxlZFByb3ZpZGVyc1xuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIGhhc0xpbnRlcihsaW50ZXI6IExpbnRlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmxpbnRlcnMuaGFzKGxpbnRlcilcbiAgfVxuICBhZGRMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBpZiAoIVZhbGlkYXRlLmxpbnRlcihsaW50ZXIpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGludGVyWyRhY3RpdmF0ZWRdID0gdHJ1ZVxuICAgIGlmICh0eXBlb2YgbGludGVyWyRyZXF1ZXN0TGF0ZXN0XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxpbnRlclskcmVxdWVzdExhdGVzdF0gPSAwXG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPSAwXG4gICAgfVxuICAgIGxpbnRlclskdmVyc2lvbl0gPSAyXG4gICAgdGhpcy5saW50ZXJzLmFkZChsaW50ZXIpXG4gIH1cbiAgZ2V0UHJvdmlkZXJzKCk6IEFycmF5PExpbnRlcj4ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMubGludGVycylcbiAgfVxuICBkZWxldGVMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBpZiAoIXRoaXMubGludGVycy5oYXMobGludGVyKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxpbnRlclskYWN0aXZhdGVkXSA9IGZhbHNlXG4gICAgdGhpcy5saW50ZXJzLmRlbGV0ZShsaW50ZXIpXG4gIH1cbiAgYXN5bmMgbGludCh7IG9uQ2hhbmdlLCBlZGl0b3IgfTogeyBvbkNoYW5nZTogYm9vbGVhbiwgZWRpdG9yOiBUZXh0RWRpdG9yIH0pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcblxuICAgIGlmIChcbiAgICAgIChvbkNoYW5nZSAmJiAhdGhpcy5saW50T25DaGFuZ2UpIHx8IC8vIExpbnQtb24tY2hhbmdlIG1pc21hdGNoXG4gICAgICAhZmlsZVBhdGggfHwgLy8gTm90IHNhdmVkIGFueXdoZXJlIHlldFxuICAgICAgSGVscGVycy5pc1BhdGhJZ25vcmVkKGVkaXRvci5nZXRQYXRoKCksIHRoaXMuaWdub3JlR2xvYiwgdGhpcy5pZ25vcmVWQ1MpIHx8IC8vIElnbm9yZWQgYnkgVkNTIG9yIEdsb2JcbiAgICAgICghdGhpcy5saW50UHJldmlld1RhYnMgJiYgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmdldFBlbmRpbmdJdGVtKCkgPT09IGVkaXRvcikgLy8gSWdub3JlIFByZXZpZXcgdGFic1xuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGVzID0gSGVscGVycy5nZXRFZGl0b3JDdXJzb3JTY29wZXMoZWRpdG9yKVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIGZvciAoY29uc3QgbGludGVyIG9mIHRoaXMubGludGVycykge1xuICAgICAgaWYgKCFIZWxwZXJzLnNob3VsZFRyaWdnZXJMaW50ZXIobGludGVyLCBvbkNoYW5nZSwgc2NvcGVzKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWRQcm92aWRlcnMuaW5jbHVkZXMobGludGVyLm5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBjb25zdCBudW1iZXIgPSArK2xpbnRlclskcmVxdWVzdExhdGVzdF1cbiAgICAgIGNvbnN0IHN0YXR1c0J1ZmZlciA9IGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnID8gZWRpdG9yLmdldEJ1ZmZlcigpIDogbnVsbFxuICAgICAgY29uc3Qgc3RhdHVzRmlsZVBhdGggPSBsaW50ZXIuc2NvcGUgPT09ICdmaWxlJyA/IGZpbGVQYXRoIDogbnVsbFxuXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWJlZ2luLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcbiAgICAgIHByb21pc2VzLnB1c2goXG4gICAgICAgIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAvLyAkRmxvd0lnbm9yZTogVHlwZSB0b28gY29tcGxleCwgZHVoXG4gICAgICAgICAgcmVzb2x2ZShsaW50ZXIubGludChlZGl0b3IpKVxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgIG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZmluaXNoLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcbiAgICAgICAgICAgIGlmIChsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID49IG51bWJlciB8fCAhbGludGVyWyRhY3RpdmF0ZWRdIHx8IChzdGF0dXNCdWZmZXIgJiYgIXN0YXR1c0J1ZmZlci5pc0FsaXZlKCkpKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA9IG51bWJlclxuICAgICAgICAgICAgaWYgKHN0YXR1c0J1ZmZlciAmJiAhc3RhdHVzQnVmZmVyLmlzQWxpdmUoKSkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1lc3NhZ2VzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIC8vIE5PVEU6IERvIE5PVCB1cGRhdGUgdGhlIG1lc3NhZ2VzIHdoZW4gcHJvdmlkZXJzIHJldHVybiBudWxsXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdmFsaWRpdHkgPSB0cnVlXG4gICAgICAgICAgICAvLyBOT1RFOiBXZSBhcmUgY2FsbGluZyBpdCB3aGVuIHJlc3VsdHMgYXJlIG5vdCBhbiBhcnJheSB0byBzaG93IGEgbmljZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpIHx8ICFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICB2YWxpZGl0eSA9IFZhbGlkYXRlLm1lc3NhZ2VzKGxpbnRlci5uYW1lLCBtZXNzYWdlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdmFsaWRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXMobGludGVyLm5hbWUsIG1lc3NhZ2VzKVxuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7IG1lc3NhZ2VzLCBsaW50ZXIsIGJ1ZmZlcjogc3RhdHVzQnVmZmVyIH0pXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWZpbmlzaC1saW50aW5nJywgeyBudW1iZXIsIGxpbnRlciwgZmlsZVBhdGg6IHN0YXR1c0ZpbGVQYXRoIH0pXG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtMaW50ZXJdIEVycm9yIHJ1bm5pbmcgJHtsaW50ZXIubmFtZX1gLCBlcnJvcilcbiAgICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbk1lc3NhZ2UgPSBgW0xpbnRlcl0gRXJyb3IgcnVubmluZyAke2xpbnRlci5uYW1lfWBcbiAgICAgICAgICAgIGlmIChBcnJheS5mcm9tKHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucykuc29tZShpdGVtID0+IGl0ZW0uZ2V0T3B0aW9ucygpLmRldGFpbCA9PT0gbm90aWZpY2F0aW9uTWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBtZXNzYWdlIGlzIHN0aWxsIHNob3dpbmcgdG8gdGhlIHVzZXIhXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3Iobm90aWZpY2F0aW9uTWVzc2FnZSwge1xuICAgICAgICAgICAgICBkZXRhaWw6ICdTZWUgQ29uc29sZSBmb3IgbW9yZSBpbmZvLicsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdGV4dDogJ09wZW4gQ29uc29sZScsXG4gICAgICAgICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF0b20ub3BlbkRldlRvb2xzKClcbiAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6ICdDYW5jZWwnLFxuICAgICAgICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sXG4gICAgICAgICksXG4gICAgICApXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZEJlZ2luTGludGluZyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYmVnaW4tbGludGluZycsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkRmluaXNoTGludGluZyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZmluaXNoLWxpbnRpbmcnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucy5mb3JFYWNoKG5vdGlmaWNhdGlvbiA9PiBub3RpZmljYXRpb24uZGlzbWlzcygpKVxuICAgIHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucy5jbGVhcigpXG4gICAgdGhpcy5saW50ZXJzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGludGVyUmVnaXN0cnlcbiJdfQ==