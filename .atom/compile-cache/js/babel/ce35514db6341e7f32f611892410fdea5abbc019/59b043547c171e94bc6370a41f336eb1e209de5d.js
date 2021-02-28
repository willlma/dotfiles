Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _gravatar = require('gravatar');

var _gravatar2 = _interopRequireDefault(_gravatar);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _atom = require('atom');

var _providerFactory = require('./provider/factory');

var _providerFactory2 = _interopRequireDefault(_providerFactory);

var _utilsCreateElement = require('./utils/create-element');

var _utilsCreateElement2 = _interopRequireDefault(_utilsCreateElement);

var _utilsThrottle = require('./utils/throttle');

var _utilsThrottle2 = _interopRequireDefault(_utilsThrottle);

var _colorRainbow = require('color-rainbow');

var _colorRainbow2 = _interopRequireDefault(_colorRainbow);

'use babel';

var BlameGutterView = (function () {
  function BlameGutterView(state, editor) {
    _classCallCheck(this, BlameGutterView);

    this.state = state;
    this.editor = editor;
    this.listeners = {};

    this.state.width = atom.config.get('blame.defaultWidth');
    this.setGutterWidth(this.state.width);

    this.provider = (0, _providerFactory2['default'])(this.editor.getPath());

    this.gutter = this.editor.addGutter({ name: 'blame' });
    this.markers = [];

    this.editorElement = atom.views.getView(this.editor);

    this.setVisible(true);
  }

  _createClass(BlameGutterView, [{
    key: 'toggleVisible',
    value: function toggleVisible() {
      this.setVisible(!this.visible);
    }
  }, {
    key: 'setVisible',
    value: function setVisible(visible) {
      var _this = this;

      if (!this.provider) {
        visible = false;
      }

      this.visible = visible;

      if (this.editor.isModified()) {
        this.visible = false;
      }

      if (this.visible) {
        this.update();

        if (!this.disposables) {
          this.disposables = new _atom.CompositeDisposable();
        }
        this.disposables.add(this.editor.onDidSave(function () {
          return _this.update();
        }));

        this.gutter.show();

        this.scrollListener = this.editorElement.onDidChangeScrollTop((0, _utilsThrottle2['default'])(function () {
          return _this.hideTooltips();
        }, 500));
      } else {
        if (this.scrollListener) {
          this.scrollListener.dispose();
        }
        this.gutter.hide();

        if (this.disposables) {
          this.disposables.dispose();
        }
        this.disposables = null;
        this.removeAllMarkers();
      }
    }
  }, {
    key: 'hideTooltips',
    value: function hideTooltips() {
      // Trigger resize event on window to hide tooltips
      window.dispatchEvent(new window.Event('resize'));
    }
  }, {
    key: 'update',
    value: function update() {
      var _this2 = this;

      this.provider.blame(function (result) {
        if (!_this2.visible) {
          return;
        }

        _this2.removeAllMarkers();

        var lastHash = null;
        var commitCount = 0;

        if (!result) {
          return;
        }

        var hashes = Object.keys(result).reduce(function (hashes, key) {
          var line = result[key];
          var hash = line.rev.replace(/\s.*/, '');

          if (hashes.indexOf(hash) === -1) {
            hashes.push(hash);
          }
          return hashes;
        }, []);

        var rainbow = new _colorRainbow2['default'](hashes.length);
        var hashColors = hashes.reduce(function (colors, hash) {
          colors[hash] = 'rgba(' + rainbow.next().values.rgb.join(',') + ', 0.4)';
          return colors;
        }, {});

        Object.keys(result).forEach(function (lineNumber) {
          var line = result[lineNumber];

          var lineStr = undefined,
              rowCls = undefined;
          var hash = line.rev.replace(/\s.*/, '');

          if (lastHash !== hash) {
            lineStr = _this2.formatGutter(hash, line, hashColors[hash]);
            rowCls = 'blame-' + (commitCount++ % 2 === 0 ? 'even' : 'odd');
          } else {
            lineStr = '';
          }

          lastHash = hash;

          _this2.addMarker(Number(lineNumber) - 1, hash, rowCls, lineStr, hashColors[hash]);
        });
      });
    }
  }, {
    key: 'formatGutter',
    value: function formatGutter(hash, line, color) {
      var dateFormat = atom.config.get('blame.dateFormat');
      var dateStr = (0, _moment2['default'])(line.date).format(dateFormat);

      if (this.isCommitted(hash)) {
        return atom.config.get('blame.gutterFormat').replace('{hash}', '<span class="hash">' + hash.substr(0, 8) + '</span>').replace('{long-hash}', '<span class="hash">' + hash + '</span>').replace('{date}', '<span class="date">' + dateStr + '</span>').replace('{author}', '<span class="author">' + line.author.name + '</span>');
      }

      return '' + line.author;
    }
  }, {
    key: 'linkClicked',
    value: function linkClicked(hash) {
      this.provider.getCommitLink(hash.replace(/^[\^]/, ''), function (link) {
        if (link) {
          return (0, _open2['default'])(link);
        }
        atom.notifications.addInfo('Unknown url.');
      });
    }
  }, {
    key: 'copyClicked',
    value: function copyClicked(hash) {
      atom.clipboard.write(hash);
    }
  }, {
    key: 'addMarker',
    value: function addMarker(lineNo, hash, rowCls, lineStr, color) {
      var item = this.markerInnerDiv(rowCls, hash, color);

      // no need to create objects and events on blank lines
      if (lineStr.length > 0) {
        var actionsCount = 0;
        if (this.isCommitted(hash)) {
          if (this.provider.supports('copy')) {
            item.appendChild(this.copySpan(hash));
            actionsCount++;
          }
          if (this.provider.supports('link')) {
            item.appendChild(this.linkSpan(hash));
            actionsCount++;
          }
        }

        item.appendChild(this.lineSpan(lineStr, hash));
        item.classList.add('action-count-' + actionsCount);

        if (this.isCommitted(hash)) {
          this.addTooltip(item, hash);
        }
      }

      item.appendChild(this.resizeHandleDiv());

      var marker = this.editor.markBufferRange([[lineNo, 0], [lineNo, 0]]);
      this.editor.decorateMarker(marker, {
        type: 'gutter',
        gutterName: 'blame',
        'class': 'blame-gutter',
        item: item
      });
      this.markers.push(marker);
    }
  }, {
    key: 'markerInnerDiv',
    value: function markerInnerDiv(rowCls, hash, color) {
      var _this3 = this;

      var item = (0, _utilsCreateElement2['default'])('div', {
        classes: ['blame-gutter-inner', rowCls],
        events: {
          mouseover: function mouseover() {
            return _this3.highlight(hash);
          },
          mouseout: function mouseout() {
            return _this3.highlight();
          }
        }
      });

      item.style.borderLeft = '6px solid ' + color;
      item.dataset.hash = hash;

      return item;
    }
  }, {
    key: 'highlight',
    value: function highlight() {
      var hash = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      [].concat(_toConsumableArray(document.getElementsByClassName('blame-gutter-inner'))).forEach(function (item) {
        if (item.dataset.hash === hash) {
          item.classList.add('highlight');
        } else {
          item.classList.remove('highlight');
        }
      });
    }
  }, {
    key: 'resizeHandleDiv',
    value: function resizeHandleDiv() {
      return (0, _utilsCreateElement2['default'])('div', {
        classes: ['blame-gutter-handle'],
        events: { mousedown: this.resizeStarted.bind(this) }
      });
    }
  }, {
    key: 'lineSpan',
    value: function lineSpan(str, hash) {
      return (0, _utilsCreateElement2['default'])('span', { inner: str });
    }
  }, {
    key: 'copySpan',
    value: function copySpan(hash) {
      var _this4 = this;

      return this.iconSpan(hash, 'copy', function () {
        _this4.copyClicked(hash);
      });
    }
  }, {
    key: 'linkSpan',
    value: function linkSpan(hash) {
      var _this5 = this;

      return this.iconSpan(hash, 'link', function () {
        _this5.linkClicked(hash);
      });
    }
  }, {
    key: 'iconSpan',
    value: function iconSpan(hash, key, listener) {
      return (0, _utilsCreateElement2['default'])('span', {
        classes: ['icon', 'icon-' + key],
        attributes: { 'data-hash': hash },
        events: { click: listener }
      });
    }
  }, {
    key: 'removeAllMarkers',
    value: function removeAllMarkers() {
      this.markers.forEach(function (marker) {
        return marker.destroy();
      });
      this.markers = [];
    }
  }, {
    key: 'resizeStarted',
    value: function resizeStarted(e) {
      this.bind('mousemove', this.resizeMove);
      this.bind('mouseup', this.resizeStopped);

      this.resizeStartedAtX = e.pageX;
      this.resizeWidth = this.state.width;
    }
  }, {
    key: 'resizeStopped',
    value: function resizeStopped(e) {
      this.unbind('mousemove');
      this.unbind('mouseup');

      e.stopPropagation();
      e.preventDefault();
    }
  }, {
    key: 'bind',
    value: function bind(event, listener) {
      this.unbind(event);
      this.listeners[event] = listener.bind(this);
      document.addEventListener(event, this.listeners[event]);
    }
  }, {
    key: 'unbind',
    value: function unbind(event) {
      if (this.listeners[event]) {
        document.removeEventListener(event, this.listeners[event]);
        this.listeners[event] = false;
      }
    }
  }, {
    key: 'resizeMove',
    value: function resizeMove(e) {
      var diff = e.pageX - this.resizeStartedAtX;
      this.setGutterWidth(this.resizeWidth + diff);

      e.stopPropagation();
      e.preventDefault();
    }
  }, {
    key: 'gutterStyle',
    value: function gutterStyle() {
      var sheet = document.createElement('style');
      sheet.type = 'text/css';
      sheet.id = 'blame-gutter-style';

      return sheet;
    }
  }, {
    key: 'setGutterWidth',
    value: function setGutterWidth(width) {
      this.state.width = Math.max(50, Math.min(width, 500));

      var sheet = document.getElementById('blame-gutter-style');
      if (!sheet) {
        sheet = this.gutterStyle();
        document.head.appendChild(sheet);
      }

      sheet.innerHTML = '\n      atom-text-editor .gutter[gutter-name="blame"] {\n        width: ' + this.state.width + 'px\n      }\n    ';
    }
  }, {
    key: 'isCommitted',
    value: function isCommitted(hash) {
      return !/^[0]+$/.test(hash);
    }
  }, {
    key: 'addTooltip',
    value: function addTooltip(item, hash) {
      var _this6 = this;

      if (!item.getAttribute('data-has-tooltip')) {
        item.setAttribute('data-has-tooltip', true);

        this.provider.getCommit(hash.replace(/^[\^]/, ''), function (msg) {
          if (!_this6.visible) {
            return;
          }
          var avatar = _this6.avatarURL(msg.author.email, 80);
          var avatarCommitterStr = '';

          var authorStr = msg.author.name;

          if (msg.committer) {
            if (msg.author.name !== msg.committer.name) {
              authorStr += ' | Committer: ' + msg.committer.name;
            }

            if (msg.author.email !== msg.committer.email) {
              avatarCommitterStr = '<img class="committer-avatar" src="' + _this6.avatarURL(msg.committer.email, 40) + '"/>';
            }
          }

          _this6.disposables.add(atom.tooltips.add(item, {
            title: '\n            <div class="blame-tooltip">\n              <div class="head">\n                <img class="avatar" src="' + avatar + '"/>\n                ' + avatarCommitterStr + '\n                <div class="subject">' + msg.subject + '</div>\n                <div class="author">' + authorStr + '</div>\n              </div>\n              <div class="body">' + msg.message.replace('\n', '<br>') + '</div>\n            </div>\n          '
          }));
        });
      }
    }
  }, {
    key: 'avatarURL',
    value: function avatarURL(email, size) {
      if (email === 'noreply@github.com') {
        return 'https://github.com/github.png?size=' + size;
      }

      var match = email.match(/^(.+)@users\.noreply\.github\.com$/);
      if (match) {
        return 'https://github.com/' + match[1] + '.png?size=' + size;
      }

      return 'https:' + _gravatar2['default'].url(email, { s: size });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.setVisible(false);
      this.gutter.destroy();
      if (this.disposables) {
        this.disposables.dispose();
      }
    }
  }]);

  return BlameGutterView;
})();

exports['default'] = BlameGutterView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2JsYW1lL2xpYi9ibGFtZS1ndXR0ZXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7d0JBRXFCLFVBQVU7Ozs7b0JBQ2QsTUFBTTs7OztzQkFDSixRQUFROzs7O29CQUNTLE1BQU07OytCQUNkLG9CQUFvQjs7OztrQ0FDdEIsd0JBQXdCOzs7OzZCQUM3QixrQkFBa0I7Ozs7NEJBQ25CLGVBQWU7Ozs7QUFUbkMsV0FBVyxDQUFBOztJQVdMLGVBQWU7QUFDUCxXQURSLGVBQWUsQ0FDTixLQUFLLEVBQUUsTUFBTSxFQUFFOzBCQUR4QixlQUFlOztBQUVqQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQTs7QUFFbkIsUUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUN4RCxRQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRXJDLFFBQUksQ0FBQyxRQUFRLEdBQUcsa0NBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTs7QUFFdEQsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0FBQ3RELFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBOztBQUVqQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFcEQsUUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENB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Q0FBQyxDQUFDLENBQUE7U0FDSixDQUFDLENBQUE7T0FDSDtLQUNGOzs7V0FFUyxtQkFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3RCLFVBQUksS0FBSyxLQUFLLG9CQUFvQixFQUFFO0FBQ2xDLHVEQUE2QyxJQUFJLENBQUU7T0FDcEQ7O0FBRUQsVUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0FBQy9ELFVBQUksS0FBSyxFQUFFO0FBQ1QsdUNBQTZCLEtBQUssQ0FBQyxDQUFDLENBQUMsa0JBQWEsSUFBSSxDQUFFO09BQ3pEOztBQUVELHdCQUFnQixzQkFBUyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUU7S0FDbkQ7OztXQUVPLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN0QixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3JCLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUFFLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7T0FBRTtLQUNyRDs7O1NBcldHLGVBQWU7OztxQkF3V04sZUFBZSIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvYmxhbWUtZ3V0dGVyLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgZ3JhdmF0YXIgZnJvbSAnZ3JhdmF0YXInXG5pbXBvcnQgb3BlbiBmcm9tICdvcGVuJ1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBwcm92aWRlckZhY3RvcnkgZnJvbSAnLi9wcm92aWRlci9mYWN0b3J5J1xuaW1wb3J0IGNyZWF0ZUVsZW1lbnQgZnJvbSAnLi91dGlscy9jcmVhdGUtZWxlbWVudCdcbmltcG9ydCB0aHJvdHRsZSBmcm9tICcuL3V0aWxzL3Rocm90dGxlJ1xuaW1wb3J0IFJhaW5ib3cgZnJvbSAnY29sb3ItcmFpbmJvdydcblxuY2xhc3MgQmxhbWVHdXR0ZXJWaWV3IHtcbiAgY29uc3RydWN0b3IgKHN0YXRlLCBlZGl0b3IpIHtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGVcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIHRoaXMubGlzdGVuZXJzID0ge31cblxuICAgIHRoaXMuc3RhdGUud2lkdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2JsYW1lLmRlZmF1bHRXaWR0aCcpXG4gICAgdGhpcy5zZXRHdXR0ZXJXaWR0aCh0aGlzLnN0YXRlLndpZHRoKVxuXG4gICAgdGhpcy5wcm92aWRlciA9IHByb3ZpZGVyRmFjdG9yeSh0aGlzLmVkaXRvci5nZXRQYXRoKCkpXG5cbiAgICB0aGlzLmd1dHRlciA9IHRoaXMuZWRpdG9yLmFkZEd1dHRlcih7IG5hbWU6ICdibGFtZScgfSlcbiAgICB0aGlzLm1hcmtlcnMgPSBbXVxuXG4gICAgdGhpcy5lZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMuZWRpdG9yKVxuXG4gICAgdGhpcy5zZXRWaXNpYmxlKHRydWUpXG4gIH1cblxuICB0b2dnbGVWaXNpYmxlICgpIHtcbiAgICB0aGlzLnNldFZpc2libGUoIXRoaXMudmlzaWJsZSlcbiAgfVxuXG4gIHNldFZpc2libGUgKHZpc2libGUpIHtcbiAgICBpZiAoIXRoaXMucHJvdmlkZXIpIHtcbiAgICAgIHZpc2libGUgPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGVcblxuICAgIGlmICh0aGlzLmVkaXRvci5pc01vZGlmaWVkKCkpIHsgdGhpcy52aXNpYmxlID0gZmFsc2UgfVxuXG4gICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgdGhpcy51cGRhdGUoKVxuXG4gICAgICBpZiAoIXRoaXMuZGlzcG9zYWJsZXMpIHsgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5lZGl0b3Iub25EaWRTYXZlKCgpID0+IHRoaXMudXBkYXRlKCkpKVxuXG4gICAgICB0aGlzLmd1dHRlci5zaG93KClcblxuICAgICAgdGhpcy5zY3JvbGxMaXN0ZW5lciA9IHRoaXMuZWRpdG9yRWxlbWVudC5vbkRpZENoYW5nZVNjcm9sbFRvcChcbiAgICAgICAgdGhyb3R0bGUoKCkgPT4gdGhpcy5oaWRlVG9vbHRpcHMoKSwgNTAwKVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5zY3JvbGxMaXN0ZW5lcikgeyB0aGlzLnNjcm9sbExpc3RlbmVyLmRpc3Bvc2UoKSB9XG4gICAgICB0aGlzLmd1dHRlci5oaWRlKClcblxuICAgICAgaWYgKHRoaXMuZGlzcG9zYWJsZXMpIHsgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCkgfVxuICAgICAgdGhpcy5kaXNwb3NhYmxlcyA9IG51bGxcbiAgICAgIHRoaXMucmVtb3ZlQWxsTWFya2VycygpXG4gICAgfVxuICB9XG5cbiAgaGlkZVRvb2x0aXBzICgpIHtcbiAgICAvLyBUcmlnZ2VyIHJlc2l6ZSBldmVudCBvbiB3aW5kb3cgdG8gaGlkZSB0b29sdGlwc1xuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyB3aW5kb3cuRXZlbnQoJ3Jlc2l6ZScpKVxuICB9XG5cbiAgdXBkYXRlICgpIHtcbiAgICB0aGlzLnByb3ZpZGVyLmJsYW1lKChyZXN1bHQpID0+IHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbW92ZUFsbE1hcmtlcnMoKVxuXG4gICAgICBsZXQgbGFzdEhhc2ggPSBudWxsXG4gICAgICBsZXQgY29tbWl0Q291bnQgPSAwXG5cbiAgICAgIGlmICghcmVzdWx0KSB7IHJldHVybiB9XG5cbiAgICAgIGNvbnN0IGhhc2hlcyA9IE9iamVjdC5rZXlzKHJlc3VsdClcbiAgICAgICAgLnJlZHVjZSgoaGFzaGVzLCBrZXkpID0+IHtcbiAgICAgICAgICBjb25zdCBsaW5lID0gcmVzdWx0W2tleV1cbiAgICAgICAgICBjb25zdCBoYXNoID0gbGluZS5yZXYucmVwbGFjZSgvXFxzLiovLCAnJylcblxuICAgICAgICAgIGlmIChoYXNoZXMuaW5kZXhPZihoYXNoKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGhhc2hlcy5wdXNoKGhhc2gpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBoYXNoZXNcbiAgICAgICAgfSwgW10pXG5cbiAgICAgIGNvbnN0IHJhaW5ib3cgPSBuZXcgUmFpbmJvdyhoYXNoZXMubGVuZ3RoKVxuICAgICAgY29uc3QgaGFzaENvbG9ycyA9IGhhc2hlcy5yZWR1Y2UoKGNvbG9ycywgaGFzaCkgPT4ge1xuICAgICAgICBjb2xvcnNbaGFzaF0gPSBgcmdiYSgke3JhaW5ib3cubmV4dCgpLnZhbHVlcy5yZ2Iuam9pbignLCcpfSwgMC40KWBcbiAgICAgICAgcmV0dXJuIGNvbG9yc1xuICAgICAgfSwge30pXG5cbiAgICAgIE9iamVjdC5rZXlzKHJlc3VsdCkuZm9yRWFjaCgobGluZU51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBsaW5lID0gcmVzdWx0W2xpbmVOdW1iZXJdXG5cbiAgICAgICAgbGV0IGxpbmVTdHIsIHJvd0Nsc1xuICAgICAgICBjb25zdCBoYXNoID0gbGluZS5yZXYucmVwbGFjZSgvXFxzLiovLCAnJylcblxuICAgICAgICBpZiAobGFzdEhhc2ggIT09IGhhc2gpIHtcbiAgICAgICAgICBsaW5lU3RyID0gdGhpcy5mb3JtYXRHdXR0ZXIoaGFzaCwgbGluZSwgaGFzaENvbG9yc1toYXNoXSlcbiAgICAgICAgICByb3dDbHMgPSBgYmxhbWUtJHsoY29tbWl0Q291bnQrKyAlIDIgPT09IDApID8gJ2V2ZW4nIDogJ29kZCd9YFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmVTdHIgPSAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdEhhc2ggPSBoYXNoXG5cbiAgICAgICAgdGhpcy5hZGRNYXJrZXIoTnVtYmVyKGxpbmVOdW1iZXIpIC0gMSwgaGFzaCwgcm93Q2xzLCBsaW5lU3RyLCBoYXNoQ29sb3JzW2hhc2hdKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZm9ybWF0R3V0dGVyIChoYXNoLCBsaW5lLCBjb2xvcikge1xuICAgIGNvbnN0IGRhdGVGb3JtYXQgPSBhdG9tLmNvbmZpZy5nZXQoJ2JsYW1lLmRhdGVGb3JtYXQnKVxuICAgIGNvbnN0IGRhdGVTdHIgPSBtb21lbnQobGluZS5kYXRlKVxuICAgICAgLmZvcm1hdChkYXRlRm9ybWF0KVxuXG4gICAgaWYgKHRoaXMuaXNDb21taXR0ZWQoaGFzaCkpIHtcbiAgICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2JsYW1lLmd1dHRlckZvcm1hdCcpXG4gICAgICAgIC5yZXBsYWNlKCd7aGFzaH0nLCBgPHNwYW4gY2xhc3M9XCJoYXNoXCI+JHtoYXNoLnN1YnN0cigwLCA4KX08L3NwYW4+YClcbiAgICAgICAgLnJlcGxhY2UoJ3tsb25nLWhhc2h9JywgYDxzcGFuIGNsYXNzPVwiaGFzaFwiPiR7aGFzaH08L3NwYW4+YClcbiAgICAgICAgLnJlcGxhY2UoJ3tkYXRlfScsIGA8c3BhbiBjbGFzcz1cImRhdGVcIj4ke2RhdGVTdHJ9PC9zcGFuPmApXG4gICAgICAgIC5yZXBsYWNlKCd7YXV0aG9yfScsIGA8c3BhbiBjbGFzcz1cImF1dGhvclwiPiR7bGluZS5hdXRob3IubmFtZX08L3NwYW4+YClcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7bGluZS5hdXRob3J9YFxuICB9XG5cbiAgbGlua0NsaWNrZWQgKGhhc2gpIHtcbiAgICB0aGlzLnByb3ZpZGVyLmdldENvbW1pdExpbmsoaGFzaC5yZXBsYWNlKC9eW1xcXl0vLCAnJyksIChsaW5rKSA9PiB7XG4gICAgICBpZiAobGluaykge1xuICAgICAgICByZXR1cm4gb3BlbihsaW5rKVxuICAgICAgfVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ1Vua25vd24gdXJsLicpXG4gICAgfSlcbiAgfVxuXG4gIGNvcHlDbGlja2VkIChoYXNoKSB7XG4gICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoaGFzaClcbiAgfVxuXG4gIGFkZE1hcmtlciAobGluZU5vLCBoYXNoLCByb3dDbHMsIGxpbmVTdHIsIGNvbG9yKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMubWFya2VySW5uZXJEaXYocm93Q2xzLCBoYXNoLCBjb2xvcilcblxuICAgIC8vIG5vIG5lZWQgdG8gY3JlYXRlIG9iamVjdHMgYW5kIGV2ZW50cyBvbiBibGFuayBsaW5lc1xuICAgIGlmIChsaW5lU3RyLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBhY3Rpb25zQ291bnQgPSAwXG4gICAgICBpZiAodGhpcy5pc0NvbW1pdHRlZChoYXNoKSkge1xuICAgICAgICBpZiAodGhpcy5wcm92aWRlci5zdXBwb3J0cygnY29weScpKSB7XG4gICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZCh0aGlzLmNvcHlTcGFuKGhhc2gpKVxuICAgICAgICAgIGFjdGlvbnNDb3VudCsrXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvdmlkZXIuc3VwcG9ydHMoJ2xpbmsnKSkge1xuICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQodGhpcy5saW5rU3BhbihoYXNoKSlcbiAgICAgICAgICBhY3Rpb25zQ291bnQrK1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQodGhpcy5saW5lU3BhbihsaW5lU3RyLCBoYXNoKSlcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZChgYWN0aW9uLWNvdW50LSR7YWN0aW9uc0NvdW50fWApXG5cbiAgICAgIGlmICh0aGlzLmlzQ29tbWl0dGVkKGhhc2gpKSB7XG4gICAgICAgIHRoaXMuYWRkVG9vbHRpcChpdGVtLCBoYXNoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGl0ZW0uYXBwZW5kQ2hpbGQodGhpcy5yZXNpemVIYW5kbGVEaXYoKSlcblxuICAgIGNvbnN0IG1hcmtlciA9IHRoaXMuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbW2xpbmVObywgMF0sIFtsaW5lTm8sIDBdXSlcbiAgICB0aGlzLmVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgIHR5cGU6ICdndXR0ZXInLFxuICAgICAgZ3V0dGVyTmFtZTogJ2JsYW1lJyxcbiAgICAgIGNsYXNzOiAnYmxhbWUtZ3V0dGVyJyxcbiAgICAgIGl0ZW06IGl0ZW1cbiAgICB9KVxuICAgIHRoaXMubWFya2Vycy5wdXNoKG1hcmtlcilcbiAgfVxuXG4gIG1hcmtlcklubmVyRGl2IChyb3dDbHMsIGhhc2gsIGNvbG9yKSB7XG4gICAgY29uc3QgaXRlbSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgIGNsYXNzZXM6IFsgJ2JsYW1lLWd1dHRlci1pbm5lcicsIHJvd0NscyBdLFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIG1vdXNlb3ZlcjogKCkgPT4gdGhpcy5oaWdobGlnaHQoaGFzaCksXG4gICAgICAgIG1vdXNlb3V0OiAoKSA9PiB0aGlzLmhpZ2hsaWdodCgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0ZW0uc3R5bGUuYm9yZGVyTGVmdCA9IGA2cHggc29saWQgJHtjb2xvcn1gXG4gICAgaXRlbS5kYXRhc2V0Lmhhc2ggPSBoYXNoXG5cbiAgICByZXR1cm4gaXRlbVxuICB9XG5cbiAgaGlnaGxpZ2h0IChoYXNoID0gbnVsbCkge1xuICAgIFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdibGFtZS1ndXR0ZXItaW5uZXInKV0uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0uZGF0YXNldC5oYXNoID09PSBoYXNoKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0JylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmVzaXplSGFuZGxlRGl2ICgpIHtcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgY2xhc3NlczogWyAnYmxhbWUtZ3V0dGVyLWhhbmRsZScgXSxcbiAgICAgIGV2ZW50czogeyBtb3VzZWRvd246IHRoaXMucmVzaXplU3RhcnRlZC5iaW5kKHRoaXMpIH1cbiAgICB9KVxuICB9XG5cbiAgbGluZVNwYW4gKHN0ciwgaGFzaCkge1xuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KCdzcGFuJywgeyBpbm5lcjogc3RyIH0pXG4gIH1cblxuICBjb3B5U3BhbiAoaGFzaCkge1xuICAgIHJldHVybiB0aGlzLmljb25TcGFuKGhhc2gsICdjb3B5JywgKCkgPT4ge1xuICAgICAgdGhpcy5jb3B5Q2xpY2tlZChoYXNoKVxuICAgIH0pXG4gIH1cblxuICBsaW5rU3BhbiAoaGFzaCkge1xuICAgIHJldHVybiB0aGlzLmljb25TcGFuKGhhc2gsICdsaW5rJywgKCkgPT4ge1xuICAgICAgdGhpcy5saW5rQ2xpY2tlZChoYXNoKVxuICAgIH0pXG4gIH1cblxuICBpY29uU3BhbiAoaGFzaCwga2V5LCBsaXN0ZW5lcikge1xuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgY2xhc3NlczogWyAnaWNvbicsIGBpY29uLSR7a2V5fWAgXSxcbiAgICAgIGF0dHJpYnV0ZXM6IHsgJ2RhdGEtaGFzaCc6IGhhc2ggfSxcbiAgICAgIGV2ZW50czogeyBjbGljazogbGlzdGVuZXIgfVxuICAgIH0pXG4gIH1cblxuICByZW1vdmVBbGxNYXJrZXJzICgpIHtcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChtYXJrZXIgPT4gbWFya2VyLmRlc3Ryb3koKSlcbiAgICB0aGlzLm1hcmtlcnMgPSBbXVxuICB9XG5cbiAgcmVzaXplU3RhcnRlZCAoZSkge1xuICAgIHRoaXMuYmluZCgnbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVNb3ZlKVxuICAgIHRoaXMuYmluZCgnbW91c2V1cCcsIHRoaXMucmVzaXplU3RvcHBlZClcblxuICAgIHRoaXMucmVzaXplU3RhcnRlZEF0WCA9IGUucGFnZVhcbiAgICB0aGlzLnJlc2l6ZVdpZHRoID0gdGhpcy5zdGF0ZS53aWR0aFxuICB9XG5cbiAgcmVzaXplU3RvcHBlZCAoZSkge1xuICAgIHRoaXMudW5iaW5kKCdtb3VzZW1vdmUnKVxuICAgIHRoaXMudW5iaW5kKCdtb3VzZXVwJylcblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gIGJpbmQgKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgIHRoaXMudW5iaW5kKGV2ZW50KVxuICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XSA9IGxpc3RlbmVyLmJpbmQodGhpcylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLmxpc3RlbmVyc1tldmVudF0pXG4gIH1cblxuICB1bmJpbmQgKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXJzW2V2ZW50XSkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5saXN0ZW5lcnNbZXZlbnRdKVxuICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICByZXNpemVNb3ZlIChlKSB7XG4gICAgY29uc3QgZGlmZiA9IGUucGFnZVggLSB0aGlzLnJlc2l6ZVN0YXJ0ZWRBdFhcbiAgICB0aGlzLnNldEd1dHRlcldpZHRoKHRoaXMucmVzaXplV2lkdGggKyBkaWZmKVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgZ3V0dGVyU3R5bGUgKCkge1xuICAgIGNvbnN0IHNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICAgIHNoZWV0LnR5cGUgPSAndGV4dC9jc3MnXG4gICAgc2hlZXQuaWQgPSAnYmxhbWUtZ3V0dGVyLXN0eWxlJ1xuXG4gICAgcmV0dXJuIHNoZWV0XG4gIH1cblxuICBzZXRHdXR0ZXJXaWR0aCAod2lkdGgpIHtcbiAgICB0aGlzLnN0YXRlLndpZHRoID0gTWF0aC5tYXgoNTAsIE1hdGgubWluKHdpZHRoLCA1MDApKVxuXG4gICAgbGV0IHNoZWV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JsYW1lLWd1dHRlci1zdHlsZScpXG4gICAgaWYgKCFzaGVldCkge1xuICAgICAgc2hlZXQgPSB0aGlzLmd1dHRlclN0eWxlKClcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2hlZXQpXG4gICAgfVxuXG4gICAgc2hlZXQuaW5uZXJIVE1MID0gYFxuICAgICAgYXRvbS10ZXh0LWVkaXRvciAuZ3V0dGVyW2d1dHRlci1uYW1lPVwiYmxhbWVcIl0ge1xuICAgICAgICB3aWR0aDogJHt0aGlzLnN0YXRlLndpZHRofXB4XG4gICAgICB9XG4gICAgYFxuICB9XG5cbiAgaXNDb21taXR0ZWQgKGhhc2gpIHtcbiAgICByZXR1cm4gIS9eWzBdKyQvLnRlc3QoaGFzaClcbiAgfVxuXG4gIGFkZFRvb2x0aXAgKGl0ZW0sIGhhc2gpIHtcbiAgICBpZiAoIWl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWhhcy10b29sdGlwJykpIHtcbiAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdkYXRhLWhhcy10b29sdGlwJywgdHJ1ZSlcblxuICAgICAgdGhpcy5wcm92aWRlci5nZXRDb21taXQoaGFzaC5yZXBsYWNlKC9eW1xcXl0vLCAnJyksIChtc2cpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhdmF0YXIgPSB0aGlzLmF2YXRhclVSTChtc2cuYXV0aG9yLmVtYWlsLCA4MClcbiAgICAgICAgbGV0IGF2YXRhckNvbW1pdHRlclN0ciA9ICcnXG5cbiAgICAgICAgbGV0IGF1dGhvclN0ciA9IG1zZy5hdXRob3IubmFtZVxuXG4gICAgICAgIGlmIChtc2cuY29tbWl0dGVyKSB7XG4gICAgICAgICAgaWYgKG1zZy5hdXRob3IubmFtZSAhPT0gbXNnLmNvbW1pdHRlci5uYW1lKSB7XG4gICAgICAgICAgICBhdXRob3JTdHIgKz0gYCB8IENvbW1pdHRlcjogJHttc2cuY29tbWl0dGVyLm5hbWV9YFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChtc2cuYXV0aG9yLmVtYWlsICE9PSBtc2cuY29tbWl0dGVyLmVtYWlsKSB7XG4gICAgICAgICAgICBhdmF0YXJDb21taXR0ZXJTdHIgPSBgPGltZyBjbGFzcz1cImNvbW1pdHRlci1hdmF0YXJcIiBzcmM9XCIke3RoaXMuYXZhdGFyVVJMKG1zZy5jb21taXR0ZXIuZW1haWwsIDQwKX1cIi8+YFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20udG9vbHRpcHMuYWRkKGl0ZW0sIHtcbiAgICAgICAgICB0aXRsZTogYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsYW1lLXRvb2x0aXBcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiYXZhdGFyXCIgc3JjPVwiJHthdmF0YXJ9XCIvPlxuICAgICAgICAgICAgICAgICR7YXZhdGFyQ29tbWl0dGVyU3RyfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdWJqZWN0XCI+JHttc2cuc3ViamVjdH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXV0aG9yXCI+JHthdXRob3JTdHJ9PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYm9keVwiPiR7bXNnLm1lc3NhZ2UucmVwbGFjZSgnXFxuJywgJzxicj4nKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGBcbiAgICAgICAgfSkpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGF2YXRhclVSTCAoZW1haWwsIHNpemUpIHtcbiAgICBpZiAoZW1haWwgPT09ICdub3JlcGx5QGdpdGh1Yi5jb20nKSB7XG4gICAgICByZXR1cm4gYGh0dHBzOi8vZ2l0aHViLmNvbS9naXRodWIucG5nP3NpemU9JHtzaXplfWBcbiAgICB9XG5cbiAgICBjb25zdCBtYXRjaCA9IGVtYWlsLm1hdGNoKC9eKC4rKUB1c2Vyc1xcLm5vcmVwbHlcXC5naXRodWJcXC5jb20kLylcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tLyR7bWF0Y2hbMV19LnBuZz9zaXplPSR7c2l6ZX1gXG4gICAgfVxuXG4gICAgcmV0dXJuIGBodHRwczoke2dyYXZhdGFyLnVybChlbWFpbCwgeyBzOiBzaXplIH0pfWBcbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIHRoaXMuc2V0VmlzaWJsZShmYWxzZSlcbiAgICB0aGlzLmd1dHRlci5kZXN0cm95KClcbiAgICBpZiAodGhpcy5kaXNwb3NhYmxlcykgeyB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKSB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxhbWVHdXR0ZXJWaWV3XG4iXX0=