(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    positionHistory: [],
    positionFuture: [],
    wasrewinding: false,
    rewinding: false,
    wasforwarding: false,
    forwarding: false,
    editorSubscription: null,
    activate: function() {
      var ed, pane, pos;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(activeEd) {
          return activeEd.onDidChangeCursorPosition(function(event) {
            var activePane, lastEd, lastPane, lastPos, ref;
            activePane = atom.workspace.getActivePane();
            if (_this.rewinding === false && _this.forwarding === false) {
              if (_this.positionHistory.length) {
                ref = _this.positionHistory.slice(-1)[0], lastPane = ref.pane, lastEd = ref.editor, lastPos = ref.position;
                if (activePane === lastPane && activeEd === lastEd && Math.abs(lastPos.serialize()[0] - event.newBufferPosition.serialize()[0]) < 3) {
                  return;
                }
              }
              _this.positionHistory.push({
                pane: activePane,
                editor: activeEd,
                position: event.newBufferPosition
              });
              _this.positionFuture = [];
              _this.wasrewinding = false;
              _this.wasforwarding = false;
            }
            _this.rewinding = false;
            return _this.forwarding = false;
          });
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPane((function(_this) {
        return function(event) {
          var pos;
          _this.positionHistory = (function() {
            var i, len, ref, results;
            ref = this.positionHistory;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              pos = ref[i];
              if (pos.pane !== event.pane) {
                results.push(pos);
              }
            }
            return results;
          }).call(_this);
          return _this.positionFuture = (function() {
            var i, len, ref, results;
            ref = this.positionFuture;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              pos = ref[i];
              if (pos.pane !== event.pane) {
                results.push(pos);
              }
            }
            return results;
          }).call(_this);
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(event) {
          var pos;
          _this.positionHistory = (function() {
            var i, len, ref, results;
            ref = this.positionHistory;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              pos = ref[i];
              if (pos.editor !== event.item) {
                results.push(pos);
              }
            }
            return results;
          }).call(_this);
          return _this.positionFuture = (function() {
            var i, len, ref, results;
            ref = this.positionFuture;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              pos = ref[i];
              if (pos.editor !== event.item) {
                results.push(pos);
              }
            }
            return results;
          }).call(_this);
        };
      })(this)));
      ed = atom.workspace.getActiveTextEditor();
      pane = atom.workspace.getActivePane();
      if ((pane != null) && (ed != null)) {
        pos = ed.getCursorBufferPosition();
        this.positionHistory.push({
          pane: pane,
          editor: ed,
          position: pos
        });
      }
      return this.disposables.add(atom.commands.add('atom-workspace', {
        'last-cursor-position:previous': (function(_this) {
          return function() {
            return _this.previous();
          };
        })(this),
        'last-cursor-position:next': (function(_this) {
          return function() {
            return _this.next();
          };
        })(this),
        'last-cursor-position:push': (function(_this) {
          return function() {
            return _this.push();
          };
        })(this)
      }));
    },
    push: function() {
      var activeEd;
      activeEd = atom.workspace.getActiveTextEditor();
      return this.positionHistory.push({
        pane: atom.workspace.getActivePane(),
        editor: activeEd,
        position: activeEd.getCursorBufferPosition()
      });
    },
    previous: function() {
      var activePane, editorIdx, foundeditor, pos, temp;
      if (this.wasforwarding || this.wasrewinding === false) {
        temp = this.positionHistory.pop();
        if (temp != null) {
          this.positionFuture.push(temp);
        }
      }
      pos = this.positionHistory.pop();
      if (pos != null) {
        this.positionFuture.push(pos);
        this.rewinding = true;
        this.wasrewinding = true;
        this.wasforwarding = false;
        foundeditor = true;
        if (pos.pane !== atom.workspace.getActivePane()) {
          pos.pane.activate();
        }
        if (pos.editor !== atom.workspace.getActiveTextEditor()) {
          activePane = atom.workspace.getActivePane();
          editorIdx = activePane.getItems().indexOf(pos.editor);
          activePane.activateItemAtIndex(editorIdx);
        }
        if (pos.position) {
          atom.workspace.getActiveTextEditor().setCursorBufferPosition(pos.position, {
            autoscroll: false
          });
          return atom.workspace.getActiveTextEditor().scrollToCursorPosition({
            center: true
          });
        }
      }
    },
    next: function() {
      var activePane, editorIdx, foundeditor, pos, temp;
      if (this.wasrewinding || this.wasforwarding === false) {
        temp = this.positionFuture.pop();
        if (temp != null) {
          this.positionHistory.push(temp);
        }
      }
      pos = this.positionFuture.pop();
      if (pos != null) {
        this.positionHistory.push(pos);
        this.forwarding = true;
        this.wasforwarding = true;
        this.wasrewinding = false;
        foundeditor = true;
        if (pos.pane !== atom.workspace.getActivePane) {
          pos.pane.activate();
        }
        if (pos.editor !== atom.workspace.getActiveTextEditor()) {
          activePane = atom.workspace.getActivePane();
          editorIdx = activePane.getItems().indexOf(pos.editor);
          activePane.activateItemAtIndex(editorIdx);
        }
        if (pos.position) {
          atom.workspace.getActiveTextEditor().setCursorBufferPosition(pos.position, {
            autoscroll: false
          });
          return atom.workspace.getActiveTextEditor().scrollToCursorPosition({
            center: true
          });
        }
      }
    },
    deactivate: function() {
      return this.disposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvbGFzdC1jdXJzb3ItcG9zaXRpb24vbGliL2xhc3QtY3Vyc29yLXBvc2l0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNHO0lBQUEsZUFBQSxFQUFpQixFQUFqQjtJQUNBLGNBQUEsRUFBZ0IsRUFEaEI7SUFFQSxZQUFBLEVBQWMsS0FGZDtJQUdBLFNBQUEsRUFBVyxLQUhYO0lBSUEsYUFBQSxFQUFjLEtBSmQ7SUFLQSxVQUFBLEVBQVksS0FMWjtJQU1BLGtCQUFBLEVBQW9CLElBTnBCO0lBUUEsUUFBQSxFQUFVLFNBQUE7QUFDUCxVQUFBO01BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BR25CLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO2lCQUdoRCxRQUFRLENBQUMseUJBQVQsQ0FBbUMsU0FBQyxLQUFEO0FBRWhDLGdCQUFBO1lBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO1lBRWIsSUFBRyxLQUFDLENBQUEsU0FBRCxLQUFjLEtBQWQsSUFBd0IsS0FBQyxDQUFBLFVBQUQsS0FBZSxLQUExQztjQUNHLElBQUcsS0FBQyxDQUFBLGVBQWUsQ0FBQyxNQUFwQjtnQkFDRyxNQUFzRCxLQUFDLENBQUEsZUFBZ0IsVUFBUSxDQUFBLENBQUEsQ0FBL0UsRUFBTyxlQUFOLElBQUQsRUFBeUIsYUFBUixNQUFqQixFQUEyQyxjQUFWO2dCQUNqQyxJQUFHLFVBQUEsS0FBYyxRQUFkLElBQTJCLFFBQUEsS0FBWSxNQUF2QyxJQUVHLElBQUksQ0FBQyxHQUFM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U0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBbkI7VUFFRyxVQUFBLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUE7VUFDYixTQUFBLEdBQVksVUFBVSxDQUFDLFFBQVgsQ0FBQSxDQUFxQixDQUFDLE9BQXRCLENBQThCLEdBQUcsQ0FBQyxNQUFsQztVQUNaLFVBQVUsQ0FBQyxtQkFBWCxDQUErQixTQUEvQixFQUpIOztRQU9BLElBQUcsR0FBRyxDQUFDLFFBQVA7VUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyx1QkFBckMsQ0FBNkQsR0FBRyxDQUFDLFFBQWpFLEVBQTJFO1lBQUEsVUFBQSxFQUFXLEtBQVg7V0FBM0U7aUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW9DLENBQUMsc0JBQXJDLENBQTREO1lBQUEsTUFBQSxFQUFPLElBQVA7V0FBNUQsRUFGRjtTQWxCSDs7SUFWRyxDQWhHTjtJQWdJQSxVQUFBLEVBQVksU0FBQTthQUNULElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBRFMsQ0FoSVo7O0FBSEgiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICBwb3NpdGlvbkhpc3Rvcnk6IFtdXG4gICBwb3NpdGlvbkZ1dHVyZTogW11cbiAgIHdhc3Jld2luZGluZzogZmFsc2VcbiAgIHJld2luZGluZzogZmFsc2VcbiAgIHdhc2ZvcndhcmRpbmc6ZmFsc2VcbiAgIGZvcndhcmRpbmc6IGZhbHNlXG4gICBlZGl0b3JTdWJzY3JpcHRpb246IG51bGxcblxuICAgYWN0aXZhdGU6IC0+XG4gICAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgICAjYXNrIHRvIGJlIGNhbGxlZCBmb3IgZXZlcnkgZXhpc3RpbmcgdGV4dCBlZGl0b3IsIGFzIHdlbGwgYXMgZm9yIGFueSBmdXR1cmUgb25lXG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoYWN0aXZlRWQpID0+XG4gICAgICAgICAjY29uc29sZS5sb2coXCJhZGRpbmcgb2JzZXJ2ZWQgZWRpdG9yIFwiICsgYWN0aXZlRWQuaWQpXG4gICAgICAgICAjYXNrIHRvIGJlIGNhbGxlZCBmb3IgZXZlcnkgY3Vyc29yIGNoYW5nZSBpbiB0aGF0IGVkaXRvclxuICAgICAgICAgYWN0aXZlRWQub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICAgICAgICAjY29uc29sZS5sb2coXCJjdXJzb3IgbW92ZWRcIilcbiAgICAgICAgICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblxuICAgICAgICAgICAgaWYgQHJld2luZGluZyBpcyBmYWxzZSBhbmQgQGZvcndhcmRpbmcgaXMgZmFsc2VcbiAgICAgICAgICAgICAgIGlmIEBwb3NpdGlvbkhpc3RvcnkubGVuZ3RoXG4gICAgICAgICAgICAgICAgICB7cGFuZTogbGFzdFBhbmUsIGVkaXRvcjogbGFzdEVkLCBwb3NpdGlvbjogbGFzdFBvc30gPSBAcG9zaXRpb25IaXN0b3J5Wy0xLi4tMV1bMF1cbiAgICAgICAgICAgICAgICAgIGlmIGFjdGl2ZVBhbmUgaXMgbGFzdFBhbmUgYW5kIGFjdGl2ZUVkIGlzIGxhc3RFZCBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICNpZ25vcmUgY3Vyc29yIHBvcyBjaGFuZ2VzIDwgMyBsaW5lc1xuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5hYnMobGFzdFBvcy5zZXJpYWxpemUoKVswXSAtIGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uLnNlcmlhbGl6ZSgpWzBdKSA8IDNcbiAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKFwiQWN0aXZlUGFuZSBpZCBcIiArIGFjdGl2ZVBhbmUuaWQpXG4gICAgICAgICAgICAgICBAcG9zaXRpb25IaXN0b3J5LnB1c2goe3BhbmU6IGFjdGl2ZVBhbmUsIGVkaXRvcjogYWN0aXZlRWQsIHBvc2l0aW9uOiBldmVudC5uZXdCdWZmZXJQb3NpdGlvbn0pXG5cbiAgICAgICAgICAgICAgICNmdXR1cmUgcG9zaXRpb25zIGdldCBpbnZhbGlkYXRlZCB3aGVuIGN1cnNvciBtb3ZlcyB0byBhIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICAgQHBvc2l0aW9uRnV0dXJlID0gW11cbiAgICAgICAgICAgICAgIEB3YXNyZXdpbmRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgICAgQHdhc2ZvcndhcmRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgQHJld2luZGluZyA9IGZhbHNlXG4gICAgICAgICAgICBAZm9yd2FyZGluZyA9IGZhbHNlXG5cbiAgICAgICNjbGVhbiBoaXN0b3J5IHdoZW4gcGFuZSBpcyByZW1vdmVkXG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmUgKGV2ZW50KSA9PlxuICAgICAgICAgQHBvc2l0aW9uSGlzdG9yeSA9IChwb3MgZm9yIHBvcyBpbiBAcG9zaXRpb25IaXN0b3J5IHdoZW4gcG9zLnBhbmUgIT0gZXZlbnQucGFuZSlcbiAgICAgICAgIEBwb3NpdGlvbkZ1dHVyZSA9IChwb3MgZm9yIHBvcyBpbiBAcG9zaXRpb25GdXR1cmUgd2hlbiBwb3MucGFuZSAhPSBldmVudC5wYW5lKVxuXG4gICAgICAjY2xlYW4gaGlzdG9yeSB3aGVuIHBhbmVJdGVtICh0YWIpIGlzIHJlbW92ZWRcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0gKGV2ZW50KSA9PlxuICAgICAgICAgQHBvc2l0aW9uSGlzdG9yeSA9IChwb3MgZm9yIHBvcyBpbiBAcG9zaXRpb25IaXN0b3J5IHdoZW4gcG9zLmVkaXRvciAhPSBldmVudC5pdGVtKVxuICAgICAgICAgQHBvc2l0aW9uRnV0dXJlID0gKHBvcyBmb3IgcG9zIGluIEBwb3NpdGlvbkZ1dHVyZSB3aGVuIHBvcy5lZGl0b3IgIT0gZXZlbnQuaXRlbSlcblxuICAgICAgI3JlY29yZCBzdGFydGluZyBwb3NpdGlvblxuICAgICAgZWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIGlmIHBhbmU/IGFuZCBlZD9cbiAgICAgICAgIHBvcyA9IGVkLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgIEBwb3NpdGlvbkhpc3RvcnkucHVzaCh7cGFuZTogcGFuZSwgZWRpdG9yOiBlZCwgcG9zaXRpb246IHBvc30pXG5cbiAgICAgICNiaW5kIGV2ZW50cyB0byBjYWxsYmFja3NcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgJ2xhc3QtY3Vyc29yLXBvc2l0aW9uOnByZXZpb3VzJzogPT4gQHByZXZpb3VzKClcbiAgICAgICAgJ2xhc3QtY3Vyc29yLXBvc2l0aW9uOm5leHQnOiA9PiBAbmV4dCgpXG4gICAgICAgICdsYXN0LWN1cnNvci1wb3NpdGlvbjpwdXNoJzogPT4gQHB1c2goKVxuXG4gICBwdXNoOiAtPlxuICAgICAgYWN0aXZlRWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIEBwb3NpdGlvbkhpc3RvcnkucHVzaCh7cGFuZTogYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLCBlZGl0b3I6IGFjdGl2ZUVkLCBwb3NpdGlvbjogYWN0aXZlRWQuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKX0pXG5cbiAgIHByZXZpb3VzOiAtPlxuICAgICAgI2NvbnNvbGUubG9nKFwiUHJldmlvdXMgY2FsbGVkXCIpXG4gICAgICAjd2hlbiBjaGFuZ2luZyBkaXJlY3Rpb24sIHdlIG5lZWQgdG8gc3RvcmUgbGFzdCBwb3NpdGlvbiwgYnV0IG5vdCBtb3ZlIHRvIGl0XG4gICAgICBpZiBAd2FzZm9yd2FyZGluZyBvciBAd2FzcmV3aW5kaW5nIGlzIGZhbHNlXG4gICAgICAgICAjY29uc29sZS5sb2coXCItLUNoYW5naW5nIGRpcmVjdGlvblwiKVxuICAgICAgICAgdGVtcCA9IEBwb3NpdGlvbkhpc3RvcnkucG9wKClcbiAgICAgICAgIGlmIHRlbXA/XG4gICAgICAgICAgICBAcG9zaXRpb25GdXR1cmUucHVzaCh0ZW1wKVxuXG4gICAgICAjZ2V0IGxhc3QgcG9zaXRpb24gaW4gdGhlIGxpc3RcbiAgICAgIHBvcyA9IEBwb3NpdGlvbkhpc3RvcnkucG9wKClcbiAgICAgIGlmIHBvcz9cbiAgICAgICAgICNrZWVwIHRoZSBwb3NpdGlvbiBmb3Igb3Bwb3NpdGUgZGlyZWN0aW9uXG4gICAgICAgICBAcG9zaXRpb25GdXR1cmUucHVzaChwb3MpXG4gICAgICAgICBAcmV3aW5kaW5nID0gdHJ1ZVxuICAgICAgICAgQHdhc3Jld2luZGluZyA9IHRydWVcbiAgICAgICAgIEB3YXNmb3J3YXJkaW5nID0gZmFsc2VcbiAgICAgICAgIGZvdW5kZWRpdG9yID0gdHJ1ZVxuICAgICAgICAgI21vdmUgdG8gcmlnaHQgZWRpdG9yXG4gICAgICAgICBpZiBwb3MucGFuZSBpc250IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgICAgI2NvbnNvbGUubG9nKFwiLS1BY3RpdmF0aW5nIHBhbmUgXCIgKyBwb3MucGFuZS5pZClcbiAgICAgICAgICAgIHBvcy5wYW5lLmFjdGl2YXRlKClcbiAgICAgICAgIGlmIHBvcy5lZGl0b3IgaXNudCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICAgICNjb25zb2xlLmxvZyhcIi0tQWN0aXZhdGluZyBlZGl0b3IgXCIgKyBwb3MuZWRpdG9yLmlkKVxuICAgICAgICAgICAgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgICAgZWRpdG9ySWR4ID0gYWN0aXZlUGFuZS5nZXRJdGVtcygpLmluZGV4T2YocG9zLmVkaXRvcilcbiAgICAgICAgICAgIGFjdGl2ZVBhbmUuYWN0aXZhdGVJdGVtQXRJbmRleChlZGl0b3JJZHgpXG4gICAgICAgICAjbW92ZSBjdXJzb3IgdG8gbGFzdCBwb3NpdGlvbiBhbmQgc2Nyb2xsIHRvIGl0XG4gICAgICAgICAjY29uc29sZS5sb2coXCItLU1vdmluZyBjdXJzb3IgdG8gbmV3IHBvc2l0aW9uXCIpXG4gICAgICAgICBpZiBwb3MucG9zaXRpb25cbiAgICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvcy5wb3NpdGlvbiwgYXV0b3Njcm9sbDpmYWxzZSlcbiAgICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oY2VudGVyOnRydWUpXG5cbiAgIG5leHQ6IC0+XG4gICAgICAjY29uc29sZS5sb2coXCJOZXh0IGNhbGxlZFwiKVxuICAgICAgI3doZW4gY2hhbmdpbmcgZGlyZWN0aW9uLCB3ZSBuZWVkIHRvIHN0b3JlIGxhc3QgcG9zaXRpb24sIGJ1dCBub3QgbW92ZSB0byBpdFxuICAgICAgaWYgQHdhc3Jld2luZGluZyBvciBAd2FzZm9yd2FyZGluZyBpcyBmYWxzZVxuICAgICAgICAgI2NvbnNvbGUubG9nKFwiLS1DaGFuZ2luZyBkaXJlY3Rpb25cIilcbiAgICAgICAgIHRlbXAgPSBAcG9zaXRpb25GdXR1cmUucG9wKClcbiAgICAgICAgIGlmIHRlbXA/XG4gICAgICAgICAgICBAcG9zaXRpb25IaXN0b3J5LnB1c2godGVtcClcbiAgICAgICNnZXQgbGFzdCBwb3NpdGlvbiBpbiB0aGUgbGlzdFxuICAgICAgcG9zID0gQHBvc2l0aW9uRnV0dXJlLnBvcCgpXG4gICAgICBpZiBwb3M/XG4gICAgICAgICAja2VlcCB0aGUgcG9zaXRpb24gZm9yIG9wcG9zaXRlIGRpcmVjdGlvblxuICAgICAgICAgQHBvc2l0aW9uSGlzdG9yeS5wdXNoKHBvcylcbiAgICAgICAgIEBmb3J3YXJkaW5nID0gdHJ1ZVxuICAgICAgICAgQHdhc2ZvcndhcmRpbmcgPSB0cnVlXG4gICAgICAgICBAd2FzcmV3aW5kaW5nID0gZmFsc2VcbiAgICAgICAgIGZvdW5kZWRpdG9yID0gdHJ1ZVxuICAgICAgICAgI21vdmUgdG8gcmlnaHQgZWRpdG9yXG4gICAgICAgICBpZiBwb3MucGFuZSBpc250IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVcbiAgICAgICAgICAgICNjb25zb2xlLmxvZyhcIi0tQWN0aXZhdGluZyBwYW5lIFwiICsgcG9zLnBhbmUuaWQpXG4gICAgICAgICAgICBwb3MucGFuZS5hY3RpdmF0ZSgpXG4gICAgICAgICBpZiBwb3MuZWRpdG9yIGlzbnQgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgICAjY29uc29sZS5sb2coXCItLUFjdGl2YXRpbmcgZWRpdG9yIFwiICsgcG9zLmVkaXRvci5pZClcbiAgICAgICAgICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgICAgIGVkaXRvcklkeCA9IGFjdGl2ZVBhbmUuZ2V0SXRlbXMoKS5pbmRleE9mKHBvcy5lZGl0b3IpXG4gICAgICAgICAgICBhY3RpdmVQYW5lLmFjdGl2YXRlSXRlbUF0SW5kZXgoZWRpdG9ySWR4KVxuICAgICAgICAgI21vdmUgY3Vyc29yIHRvIGxhc3QgcG9zaXRpb24gYW5kIHNjcm9sbCB0byBpdFxuICAgICAgICAgI2NvbnNvbGUubG9nKFwiLS1Nb3ZpbmcgY3Vyc29yIHRvIG5ldyBwb3NpdGlvblwiKVxuICAgICAgICAgaWYgcG9zLnBvc2l0aW9uXG4gICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3MucG9zaXRpb24sIGF1dG9zY3JvbGw6ZmFsc2UpXG4gICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKGNlbnRlcjp0cnVlKVxuXG4gICBkZWFjdGl2YXRlOiAtPlxuICAgICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuIl19
