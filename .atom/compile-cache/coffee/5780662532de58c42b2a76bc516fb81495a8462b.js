(function() {
  var CompositeDisposable, Point, createElementsForGuides, getGuides, ref, ref1, styleGuide;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Point = ref.Point;

  ref1 = require('./indent-guide-improved-element'), createElementsForGuides = ref1.createElementsForGuides, styleGuide = ref1.styleGuide;

  getGuides = require('./guides.coffee').getGuides;

  module.exports = {
    activate: function(state) {
      var createPoint, handleEvents, updateGuide;
      this.currentSubscriptions = [];
      this.busy = false;
      atom.config.set('editor.showIndentGuide', false);
      createPoint = function(x, y) {
        x = isNaN(x) ? 0 : x;
        y = isNaN(y) ? 0 : y;
        return new Point(x, y);
      };
      updateGuide = function(editor, editorElement) {
        var basePixelPos, getIndent, guides, lineHeightPixel, scrollLeft, scrollTop, visibleRange, visibleScreenRange;
        visibleScreenRange = editorElement.getVisibleRowRange();
        if (!((visibleScreenRange != null) && editorElement.component.visible)) {
          return;
        }
        basePixelPos = editorElement.pixelPositionForScreenPosition(createPoint(visibleScreenRange[0], 0)).top;
        visibleRange = visibleScreenRange.map(function(row) {
          return editor.bufferPositionForScreenPosition(createPoint(row, 0)).row;
        });
        getIndent = function(row) {
          if (editor.lineTextForBufferRow(row).match(/^\s*$/)) {
            return null;
          } else {
            return editor.indentationForBufferRow(row);
          }
        };
        scrollTop = editorElement.getScrollTop();
        scrollLeft = editorElement.getScrollLeft();
        guides = getGuides(visibleRange[0], visibleRange[1], editor.getLastBufferRow(), editor.getCursorBufferPositions().map(function(point) {
          return point.row;
        }), getIndent);
        lineHeightPixel = editor.getLineHeightInPixels();
        return createElementsForGuides(editorElement, guides.map(function(g) {
          return function(el) {
            return styleGuide(el, g.point.translate(createPoint(visibleRange[0], 0)), g.length, g.stack, g.active, editor, basePixelPos, lineHeightPixel, visibleScreenRange[0], scrollTop, scrollLeft);
          };
        }));
      };
      handleEvents = (function(_this) {
        return function(editor, editorElement) {
          var delayedUpdate, subscriptions, up;
          up = function() {
            updateGuide(editor, editorElement);
            return _this.busy = false;
          };
          delayedUpdate = function() {
            if (!_this.busy) {
              _this.busy = true;
              return requestAnimationFrame(up);
            }
          };
          subscriptions = new CompositeDisposable;
          subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(function(item) {
            if (item === editor) {
              return delayedUpdate();
            }
          }));
          subscriptions.add(atom.config.onDidChange('editor.fontSize', delayedUpdate));
          subscriptions.add(atom.config.onDidChange('editor.fontFamily', delayedUpdate));
          subscriptions.add(atom.config.onDidChange('editor.lineHeight', delayedUpdate));
          subscriptions.add(editor.onDidChangeCursorPosition(delayedUpdate));
          subscriptions.add(editorElement.onDidChangeScrollTop(delayedUpdate));
          subscriptions.add(editorElement.onDidChangeScrollLeft(delayedUpdate));
          subscriptions.add(editor.onDidStopChanging(delayedUpdate));
          subscriptions.add(editor.onDidDestroy(function() {
            _this.currentSubscriptions.splice(_this.currentSubscriptions.indexOf(subscriptions), 1);
            return subscriptions.dispose();
          }));
          return _this.currentSubscriptions.push(subscriptions);
        };
      })(this);
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement;
        if (editor == null) {
          return;
        }
        editorElement = atom.views.getView(editor);
        if (editorElement == null) {
          return;
        }
        handleEvents(editor, editorElement);
        return updateGuide(editor, editorElement);
      });
    },
    deactivate: function() {
      this.currentSubscriptions.forEach(function(s) {
        return s.dispose();
      });
      return atom.workspace.getTextEditors().forEach(function(te) {
        var v;
        v = atom.views.getView(te);
        if (!v) {
          return;
        }
        return Array.prototype.forEach.call(v.querySelectorAll('.indent-guide-improved'), function(e) {
          return e.parentNode.removeChild(e);
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvaW5kZW50LWd1aWRlLWltcHJvdmVkL2xpYi9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLDZDQUFELEVBQXNCOztFQUV0QixPQUF3QyxPQUFBLENBQVEsaUNBQVIsQ0FBeEMsRUFBQyxzREFBRCxFQUEwQjs7RUFDekIsWUFBYSxPQUFBLENBQVEsaUJBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLG9CQUFELEdBQXdCO01BQ3hCLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFHUixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDLEtBQTFDO01BRUEsV0FBQSxHQUFjLFNBQUMsQ0FBRCxFQUFJLENBQUo7UUFDYixDQUFBLEdBQU8sS0FBQSxDQUFNLENBQU4sQ0FBSCxHQUFpQixDQUFqQixHQUF3QjtRQUM1QixDQUFBLEdBQU8sS0FBQSxDQUFNLENBQU4sQ0FBSCxHQUFpQixDQUFqQixHQUF3QjtlQUM1QixJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYjtNQUhhO01BS2QsV0FBQSxHQUFjLFNBQUMsTUFBRCxFQUFTLGFBQVQ7QUFDWixZQUFBO1FBQUEsa0JBQUEsR0FBcUIsYUFBYSxDQUFDLGtCQUFkLENBQUE7UUFDckIsSUFBQSxDQUFBLENBQWMsNEJBQUEsSUFBd0IsYUFBYSxDQUFDLFNBQVMsQ0FBQyxPQUE5RCxDQUFBO0FBQUEsaUJBQUE7O1FBQ0EsWUFBQSxHQUFlLGFBQWEsQ0FBQyw4QkFBZCxDQUNiLFdBQUEsQ0FBWSxrQkFBbUIsQ0FBQSxDQUFBLENBQS9CLEVBQW1DLENB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QVMsQ0FBQyxPQUFPLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQyxDQUFDLGdCQUFGLENBQW1CLHdCQUFuQixDQUE3QixFQUEyRSxTQUFDLENBQUQ7aUJBQ3pFLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBYixDQUF5QixDQUF6QjtRQUR5RSxDQUEzRTtNQUhzQyxDQUF4QztJQUhVLENBakZaOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIFBvaW50fSA9IHJlcXVpcmUgJ2F0b20nXG5cbntjcmVhdGVFbGVtZW50c0Zvckd1aWRlcywgc3R5bGVHdWlkZX0gPSByZXF1aXJlICcuL2luZGVudC1ndWlkZS1pbXByb3ZlZC1lbGVtZW50J1xue2dldEd1aWRlc30gPSByZXF1aXJlICcuL2d1aWRlcy5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAY3VycmVudFN1YnNjcmlwdGlvbnMgPSBbXVxuICAgIEBidXN5ID0gZmFsc2VcblxuICAgICMgVGhlIG9yaWdpbmFsIGluZGVudCBndWlkZXMgaW50ZXJmZXJlIHdpdGggdGhpcyBwYWNrYWdlLlxuICAgIGF0b20uY29uZmlnLnNldCgnZWRpdG9yLnNob3dJbmRlbnRHdWlkZScsIGZhbHNlKVxuXG4gICAgY3JlYXRlUG9pbnQgPSAoeCwgeSkgLT5cbiAgICBcdHggPSBpZiBpc05hTih4KSB0aGVuIDAgZWxzZSB4XG4gICAgXHR5ID0gaWYgaXNOYU4oeSkgdGhlbiAwIGVsc2UgeVxuICAgIFx0bmV3IFBvaW50KHgsIHkpXG5cbiAgICB1cGRhdGVHdWlkZSA9IChlZGl0b3IsIGVkaXRvckVsZW1lbnQpIC0+XG4gICAgICB2aXNpYmxlU2NyZWVuUmFuZ2UgPSBlZGl0b3JFbGVtZW50LmdldFZpc2libGVSb3dSYW5nZSgpXG4gICAgICByZXR1cm4gdW5sZXNzIHZpc2libGVTY3JlZW5SYW5nZT8gYW5kIGVkaXRvckVsZW1lbnQuY29tcG9uZW50LnZpc2libGVcbiAgICAgIGJhc2VQaXhlbFBvcyA9IGVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKFxuICAgICAgICBjcmVhdGVQb2ludCh2aXNpYmxlU2NyZWVuUmFuZ2VbMF0sIDApKS50b3BcbiAgICAgIHZpc2libGVSYW5nZSA9IHZpc2libGVTY3JlZW5SYW5nZS5tYXAgKHJvdykgLT5cbiAgICAgICAgZWRpdG9yLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oY3JlYXRlUG9pbnQocm93LCAwKSkucm93XG4gICAgICBnZXRJbmRlbnQgPSAocm93KSAtPlxuICAgICAgICBpZiBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KS5tYXRjaCgvXlxccyokLylcbiAgICAgICAgICBudWxsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cocm93KVxuICAgICAgc2Nyb2xsVG9wID0gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3AoKVxuICAgICAgc2Nyb2xsTGVmdCA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpXG4gICAgICBndWlkZXMgPSBnZXRHdWlkZXMoXG4gICAgICAgIHZpc2libGVSYW5nZVswXSxcbiAgICAgICAgdmlzaWJsZVJhbmdlWzFdLFxuICAgICAgICBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpLFxuICAgICAgICBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkubWFwKChwb2ludCkgLT4gcG9pbnQucm93KSxcbiAgICAgICAgZ2V0SW5kZW50KVxuICAgICAgbGluZUhlaWdodFBpeGVsID0gZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gICAgICBjcmVhdGVFbGVtZW50c0Zvckd1aWRlcyhlZGl0b3JFbGVtZW50LCBndWlkZXMubWFwIChnKSAtPlxuICAgICAgICAoZWwpIC0+IHN0eWxlR3VpZGUoXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgZy5wb2ludC50cmFuc2xhdGUoY3JlYXRlUG9pbnQodmlzaWJsZVJhbmdlWzBdLCAwKSksXG4gICAgICAgICAgZy5sZW5ndGgsXG4gICAgICAgICAgZy5zdGFjayxcbiAgICAgICAgICBnLmFjdGl2ZSxcbiAgICAgICAgICBlZGl0b3IsXG4gICAgICAgICAgYmFzZVBpeGVsUG9zLFxuICAgICAgICAgIGxpbmVIZWlnaHRQaXhlbCxcbiAgICAgICAgICB2aXNpYmxlU2NyZWVuUmFuZ2VbMF0sXG4gICAgICAgICAgc2Nyb2xsVG9wLFxuICAgICAgICAgIHNjcm9sbExlZnQpKVxuXG5cbiAgICBoYW5kbGVFdmVudHMgPSAoZWRpdG9yLCBlZGl0b3JFbGVtZW50KSA9PlxuICAgICAgdXAgPSAoKSA9PlxuICAgICAgICB1cGRhdGVHdWlkZShlZGl0b3IsIGVkaXRvckVsZW1lbnQpXG4gICAgICAgIEBidXN5ID0gZmFsc2VcblxuICAgICAgZGVsYXllZFVwZGF0ZSA9ID0+XG4gICAgICAgIHVubGVzcyBAYnVzeVxuICAgICAgICAgIEBidXN5ID0gdHJ1ZVxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cClcblxuICAgICAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtKChpdGVtKSAtPlxuICAgICAgICBkZWxheWVkVXBkYXRlKCkgaWYgaXRlbSA9PSBlZGl0b3JcbiAgICAgIClcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdlZGl0b3IuZm9udFNpemUnLCBkZWxheWVkVXBkYXRlKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2VkaXRvci5mb250RmFtaWx5JywgZGVsYXllZFVwZGF0ZSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdlZGl0b3IubGluZUhlaWdodCcsIGRlbGF5ZWRVcGRhdGUpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihkZWxheWVkVXBkYXRlKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yRWxlbWVudC5vbkRpZENoYW5nZVNjcm9sbFRvcChkZWxheWVkVXBkYXRlKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yRWxlbWVudC5vbkRpZENoYW5nZVNjcm9sbExlZnQoZGVsYXllZFVwZGF0ZSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyhkZWxheWVkVXBkYXRlKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLm9uRGlkRGVzdHJveSA9PlxuICAgICAgICBAY3VycmVudFN1YnNjcmlwdGlvbnMuc3BsaWNlKEBjdXJyZW50U3Vic2NyaXB0aW9ucy5pbmRleE9mKHN1YnNjcmlwdGlvbnMpLCAxKVxuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgQGN1cnJlbnRTdWJzY3JpcHRpb25zLnB1c2goc3Vic2NyaXB0aW9ucylcblxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG4gICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgIHJldHVybiB1bmxlc3MgZWRpdG9yRWxlbWVudD9cbiAgICAgIGhhbmRsZUV2ZW50cyhlZGl0b3IsIGVkaXRvckVsZW1lbnQpXG4gICAgICB1cGRhdGVHdWlkZShlZGl0b3IsIGVkaXRvckVsZW1lbnQpXG5cbiAgZGVhY3RpdmF0ZTogKCkgLT5cbiAgICBAY3VycmVudFN1YnNjcmlwdGlvbnMuZm9yRWFjaCAocykgLT5cbiAgICAgIHMuZGlzcG9zZSgpXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoICh0ZSkgLT5cbiAgICAgIHYgPSBhdG9tLnZpZXdzLmdldFZpZXcodGUpXG4gICAgICByZXR1cm4gdW5sZXNzIHZcbiAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwodi5xdWVyeVNlbGVjdG9yQWxsKCcuaW5kZW50LWd1aWRlLWltcHJvdmVkJyksIChlKSAtPlxuICAgICAgICBlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZSlcbiAgICAgIClcbiJdfQ==
