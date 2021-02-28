(function() {
  var CompositeDisposable, SmartTabName, basename, ellipsis, log, parsePath, paths, processAllTabs, sep,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  sep = require("path").sep;

  basename = require("path").basename;

  ellipsis = "…";

  log = require("atom-simple-logger")({
    pkg: "smart-tab-name",
    nsp: "core"
  });

  CompositeDisposable = require('atom').CompositeDisposable;

  paths = {};

  parsePath = function(path) {
    var last, pathIdentifier, projectPaths, relativePath, result, splitted;
    result = {};
    relativePath = atom.project.relativizePath(path);
    if ((relativePath != null ? relativePath[0] : void 0) != null) {
      splitted = relativePath[1].split(sep);
      result.filename = splitted.pop();
      projectPaths = atom.project.getPaths();
      pathIdentifier = "";
      if (projectPaths.length > 1) {
        pathIdentifier += "" + (basename(projectPaths[projectPaths.indexOf(relativePath[0])]));
        if (splitted.length > 0) {
          pathIdentifier += sep;
        }
      }
      last = "";
      if (splitted.length > 0) {
        last = splitted.pop();
      }
      if (splitted.length > 0) {
        if (pathIdentifier !== "") {
          result.foldername = pathIdentifier + ellipsis + sep + last + sep;
        } else {
          result.foldername = last + sep;
          result.ellipsis = "" + sep + ellipsis;
        }
      } else {
        result.foldername = pathIdentifier + last + sep;
      }
    } else {
      splitted = path.split(sep);
      result.filename = splitted.pop();
      if (splitted.length) {
        result.foldername = splitted.pop() + sep;
        result.ellipsis = "" + sep + ellipsis;
      }
    }
    return result;
  };

  processAllTabs = function(revert) {
    var container, ellipsisElement, filenameElement, foldernameElement, i, j, k, len, len1, len2, paneItem, paneItems, path, tab, tabs;
    if (revert == null) {
      revert = false;
    }
    log("processing all tabs, reverting:" + revert);
    paths = [];
    paneItems = atom.workspace.getPaneItems();
    for (i = 0, len = paneItems.length; i < len; i++) {
      paneItem = paneItems[i];
      if (paneItem.getPath != null) {
        path = paneItem.getPath();
        if ((path != null) && paths.indexOf(path) === -1) {
          paths.push(path);
        }
      }
    }
    log("found " + paths.length + " different paths of total " + paneItems.length + " paneItems", 2);
    for (j = 0, len1 = paths.length; j < len1; j++) {
      path = paths[j];
      tabs = atom.views.getView(atom.workspace).querySelectorAll("ul.tab-bar> li.tab[data-type='TextEditor']> div.title[data-path='" + (path.replace(/\\/g, "\\\\")) + "']");
      log("found " + tabs.length + " tabs for " + path, 2);
      for (k = 0, len2 = tabs.length; k < len2; k++) {
        tab = tabs[k];
        container = tab.querySelector("div.smart-tab-name");
        if ((container != null) && revert) {
          log("reverting " + path, 2);
          tab.removeChild(container);
          tab.innerHTML = path.split(sep).pop();
        } else if ((container == null) && !revert) {
          log("applying " + path, 2);
          if (paths[path] == null) {
            paths[path] = parsePath(path);
          }
          tab.innerHTML = "";
          container = document.createElement("div");
          container.classList.add("smart-tab-name");
          if (paths[path].foldername && paths[path].foldername !== "/") {
            foldernameElement = document.createElement("span");
            foldernameElement.classList.add("folder");
            foldernameElement.innerHTML = paths[path].foldername;
            container.appendChild(foldernameElement);
          }
          if (paths[path].foldername === "") {
            filenameElement.classList.add("file-only");
          }
          filenameElement = document.createElement("span");
          filenameElement.classList.add("file");
          filenameElement.innerHTML = paths[path].filename;
          container.appendChild(filenameElement);
          if (paths[path].filename.match(/^index\.[a-z]+/)) {
            filenameElement.classList.add("index-filename");
          }
          if (paths[path].ellipsis) {
            ellipsisElement = document.createElement("span");
            ellipsisElement.classList.add("ellipsis");
            ellipsisElement.innerHTML = paths[path].ellipsis;
            container.appendChild(ellipsisElement);
          }
          tab.appendChild(container);
        }
      }
    }
    return !revert;
  };

  module.exports = SmartTabName = (function() {
    SmartTabName.prototype.disposables = null;

    SmartTabName.prototype.processed = false;

    function SmartTabName() {
      this.destroy = bind(this.destroy, this);
      this.toggle = bind(this.toggle, this);
      var i, len, pane, ref;
      this.processed = processAllTabs();
      if (this.disposables == null) {
        this.disposables = new CompositeDisposable;
        this.disposables.add(atom.workspace.onDidAddTextEditor(function() {
          return setTimeout(processAllTabs, 10);
        }));
        this.disposables.add(atom.workspace.onDidDestroyPaneItem(function() {
          return setTimeout(processAllTabs, 10);
        }));
        this.disposables.add(atom.workspace.onDidAddPane((function(_this) {
          return function(event) {
            return _this.disposables.add(event.pane.onDidMoveItem(function() {
              return setTimeout(processAllTabs, 10);
            }));
          };
        })(this)));
        this.disposables.add(atom.commands.add('atom-workspace', {
          'smart-tab-name:toggle': this.toggle
        }));
        ref = atom.workspace.getPanes();
        for (i = 0, len = ref.length; i < len; i++) {
          pane = ref[i];
          this.disposables.add(pane.onDidMoveItem(function() {
            return setTimeout(processAllTabs, 10);
          }));
        }
      }
      log("loaded");
    }

    SmartTabName.prototype.toggle = function() {
      return this.processed = processAllTabs(this.processed);
    };

    SmartTabName.prototype.destroy = function() {
      var ref;
      this.processed = processAllTabs(true);
      if ((ref = this.disposables) != null) {
        ref.dispose();
      }
      return this.disposables = null;
    };

    return SmartTabName;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvc21hcnQtdGFiLW5hbWUvbGliL3NtYXJ0LXRhYi1uYW1lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaUdBQUE7SUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDOztFQUN0QixRQUFBLEdBQVcsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDOztFQUMzQixRQUFBLEdBQVc7O0VBQ1gsR0FBQSxHQUFNLE9BQUEsQ0FBUSxvQkFBUixDQUFBLENBQThCO0lBQUEsR0FBQSxFQUFJLGdCQUFKO0lBQXFCLEdBQUEsRUFBSSxNQUF6QjtHQUE5Qjs7RUFHTCxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLEtBQUEsR0FBUTs7RUFFUixTQUFBLEdBQVksU0FBQyxJQUFEO0FBQ1YsUUFBQTtJQUFBLE1BQUEsR0FBUztJQUNULFlBQUEsR0FBZSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsSUFBNUI7SUFFZixJQUFHLHlEQUFIO01BQ0UsUUFBQSxHQUFXLFlBQWEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFoQixDQUFzQixHQUF0QjtNQUNYLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFFBQVEsQ0FBQyxHQUFULENBQUE7TUFDbEIsWUFBQSxHQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBO01BQ2YsY0FBQSxHQUFpQjtNQUVqQixJQUFHLFlBQVksQ0FBQyxNQUFiLEdBQXNCLENBQXpCO1FBQ0UsY0FBQSxJQUFrQixFQUFBLEdBQUUsQ0FBQyxRQUFBLENBQVMsWUFBYSxDQUFBLFlBQVksQ0FBQyxPQUFiLENBQXFCLFlBQWEsQ0FBQSxDQUFBLENBQWxDLENBQUEsQ0FBdEIsQ0FBRDtRQUNwQixJQUF5QixRQUFRLENBQUMsTUFBVCxHQUFrQixDQUEzQztVQUFBLGNBQUEsSUFB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QUdBO0FBQUEsYUFBQSxxQ0FBQTs7VUFDRSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsU0FBQTttQkFDbEMsVUFBQSxDQUFXLGNBQVgsRUFBMkIsRUFBM0I7VUFEa0MsQ0FBbkIsQ0FBakI7QUFERixTQVpGOztNQWVBLEdBQUEsQ0FBSSxRQUFKO0lBakJZOzsyQkFrQmQsTUFBQSxHQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsU0FBRCxHQUFhLGNBQUEsQ0FBZSxJQUFDLENBQUEsU0FBaEI7SUFEUDs7MkJBRVIsT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxjQUFBLENBQWUsSUFBZjs7V0FDRCxDQUFFLE9BQWQsQ0FBQTs7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlO0lBSFI7Ozs7O0FBaklYIiwic291cmNlc0NvbnRlbnQiOlsic2VwID0gcmVxdWlyZShcInBhdGhcIikuc2VwXG5iYXNlbmFtZSA9IHJlcXVpcmUoXCJwYXRoXCIpLmJhc2VuYW1lXG5lbGxpcHNpcyA9IFwi4oCmXCJcbmxvZyA9IHJlcXVpcmUoXCJhdG9tLXNpbXBsZS1sb2dnZXJcIikocGtnOlwic21hcnQtdGFiLW5hbWVcIixuc3A6XCJjb3JlXCIpXG5cblxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGhzID0ge31cblxucGFyc2VQYXRoID0gKHBhdGgpIC0+XG4gIHJlc3VsdCA9IHt9XG4gIHJlbGF0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aCBwYXRoXG5cbiAgaWYgcmVsYXRpdmVQYXRoP1swXT9cbiAgICBzcGxpdHRlZCA9IHJlbGF0aXZlUGF0aFsxXS5zcGxpdChzZXApXG4gICAgcmVzdWx0LmZpbGVuYW1lID0gc3BsaXR0ZWQucG9wKClcbiAgICBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIHBhdGhJZGVudGlmaWVyID0gXCJcIlxuXG4gICAgaWYgcHJvamVjdFBhdGhzLmxlbmd0aCA+IDFcbiAgICAgIHBhdGhJZGVudGlmaWVyICs9IFwiI3tiYXNlbmFtZShwcm9qZWN0UGF0aHNbcHJvamVjdFBhdGhzLmluZGV4T2YocmVsYXRpdmVQYXRoWzBdKV0pfVwiXG4gICAgICBwYXRoSWRlbnRpZmllciArPSBzZXAgaWYgc3BsaXR0ZWQubGVuZ3RoID4gMFxuXG4gICAgbGFzdCA9IFwiXCJcbiAgICBpZiBzcGxpdHRlZC5sZW5ndGggPiAwXG4gICAgICBsYXN0ID0gc3BsaXR0ZWQucG9wKClcblxuICAgIGlmIHNwbGl0dGVkLmxlbmd0aCA+IDBcbiAgICAgIGlmIHBhdGhJZGVudGlmaWVyICE9IFwiXCJcbiAgICAgICAgcmVzdWx0LmZvbGRlcm5hbWUgPSBwYXRoSWRlbnRpZmllciArIGVsbGlwc2lzICsgc2VwICsgbGFzdCArIHNlcFxuICAgICAgZWxzZVxuICAgICAgICByZXN1bHQuZm9sZGVybmFtZSA9IGxhc3QgKyBzZXBcbiAgICAgICAgIyBydGwgdHJpY2tcbiAgICAgICAgcmVzdWx0LmVsbGlwc2lzID0gXCIje3NlcH0je2VsbGlwc2lzfVwiXG4gICAgZWxzZVxuICAgICAgcmVzdWx0LmZvbGRlcm5hbWUgPSBwYXRoSWRlbnRpZmllciArIGxhc3QgKyBzZXBcblxuICBlbHNlXG4gICAgc3BsaXR0ZWQgPSBwYXRoLnNwbGl0KHNlcClcbiAgICByZXN1bHQuZmlsZW5hbWUgPSBzcGxpdHRlZC5wb3AoKVxuICAgIGlmIHNwbGl0dGVkLmxlbmd0aFxuICAgICAgcmVzdWx0LmZvbGRlcm5hbWUgPSBzcGxpdHRlZC5wb3AoKSArIHNlcFxuICAgICAgIyBydGwgdHJpY2tcbiAgICAgIHJlc3VsdC5lbGxpcHNpcyA9IFwiI3tzZXB9I3tlbGxpcHNpc31cIlxuXG4gIHJldHVybiByZXN1bHRcblxucHJvY2Vzc0FsbFRhYnMgPSAocmV2ZXJ0PWZhbHNlKS0+XG4gIGxvZyBcInByb2Nlc3NpbmcgYWxsIHRhYnMsIHJldmVydGluZzoje3JldmVydH1cIlxuICBwYXRocyA9IFtdXG4gIHBhbmVJdGVtcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpXG4gIGZvciBwYW5lSXRlbSBpbiBwYW5lSXRlbXNcblxuICAgIGlmIHBhbmVJdGVtLmdldFBhdGg/XG4gICAgICBwYXRoID0gcGFuZUl0ZW0uZ2V0UGF0aCgpXG5cbiAgICAgIGlmIHBhdGg/IGFuZCBwYXRocy5pbmRleE9mKHBhdGgpID09IC0xXG4gICAgICAgIHBhdGhzLnB1c2ggcGF0aFxuXG4gIGxvZyBcImZvdW5kICN7cGF0aHMubGVuZ3RofSBkaWZmZXJlbnQgcGF0aHMgb2ZcbiAgICB0b3RhbCAje3BhbmVJdGVtcy5sZW5ndGh9IHBhbmVJdGVtc1wiLDJcbiAgZm9yIHBhdGggaW4gcGF0aHNcbiAgICB0YWJzID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKS5xdWVyeVNlbGVjdG9yQWxsIFwidWwudGFiLWJhcj5cbiAgICAgIGxpLnRhYltkYXRhLXR5cGU9J1RleHRFZGl0b3InXT5cbiAgICAgIGRpdi50aXRsZVtkYXRhLXBhdGg9JyN7cGF0aC5yZXBsYWNlKC9cXFxcL2csXCJcXFxcXFxcXFwiKX0nXVwiXG4gICAgbG9nIFwiZm91bmQgI3t0YWJzLmxlbmd0aH0gdGFicyBmb3IgI3twYXRofVwiLDJcbiAgICBmb3IgdGFiIGluIHRhYnNcbiAgICAgIGNvbnRhaW5lciA9IHRhYi5xdWVyeVNlbGVjdG9yIFwiZGl2LnNtYXJ0LXRhYi1uYW1lXCJcbiAgICAgIGlmIGNvbnRhaW5lcj8gYW5kIHJldmVydFxuICAgICAgICBsb2cgXCJyZXZlcnRpbmcgI3twYXRofVwiLDJcbiAgICAgICAgdGFiLnJlbW92ZUNoaWxkIGNvbnRhaW5lclxuICAgICAgICB0YWIuaW5uZXJIVE1MID0gcGF0aC5zcGxpdChzZXApLnBvcCgpXG4gICAgICBlbHNlIGlmIG5vdCBjb250YWluZXI/IGFuZCBub3QgcmV2ZXJ0XG4gICAgICAgIGxvZyBcImFwcGx5aW5nICN7cGF0aH1cIiwyXG4gICAgICAgIHBhdGhzW3BhdGhdID89IHBhcnNlUGF0aCBwYXRoXG4gICAgICAgIHRhYi5pbm5lckhUTUwgPSBcIlwiXG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQgXCJzbWFydC10YWItbmFtZVwiXG5cbiAgICAgICAgaWYgcGF0aHNbcGF0aF0uZm9sZGVybmFtZSBhbmQgcGF0aHNbcGF0aF0uZm9sZGVybmFtZSAhPSBcIi9cIlxuICAgICAgICAgIGZvbGRlcm5hbWVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIilcbiAgICAgICAgICBmb2xkZXJuYW1lRWxlbWVudC5jbGFzc0xpc3QuYWRkIFwiZm9sZGVyXCJcbiAgICAgICAgICBmb2xkZXJuYW1lRWxlbWVudC5pbm5lckhUTUwgPSBwYXRoc1twYXRoXS5mb2xkZXJuYW1lXG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkIGZvbGRlcm5hbWVFbGVtZW50XG5cbiAgICAgICAgaWYgcGF0aHNbcGF0aF0uZm9sZGVybmFtZSA9PSBcIlwiXG4gICAgICAgICAgZmlsZW5hbWVFbGVtZW50LmNsYXNzTGlzdC5hZGQgXCJmaWxlLW9ubHlcIlxuXG4gICAgICAgIGZpbGVuYW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpXG4gICAgICAgIGZpbGVuYW1lRWxlbWVudC5jbGFzc0xpc3QuYWRkIFwiZmlsZVwiXG4gICAgICAgIGZpbGVuYW1lRWxlbWVudC5pbm5lckhUTUwgPSBwYXRoc1twYXRoXS5maWxlbmFtZVxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQgZmlsZW5hbWVFbGVtZW50XG5cbiAgICAgICAgaWYgcGF0aHNbcGF0aF0uZmlsZW5hbWUubWF0Y2goL15pbmRleFxcLlthLXpdKy8pXG4gICAgICAgICAgZmlsZW5hbWVFbGVtZW50LmNsYXNzTGlzdC5hZGQgXCJpbmRleC1maWxlbmFtZVwiXG5cbiAgICAgICAgaWYgcGF0aHNbcGF0aF0uZWxsaXBzaXNcbiAgICAgICAgICBlbGxpcHNpc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKVxuICAgICAgICAgIGVsbGlwc2lzRWxlbWVudC5jbGFzc0xpc3QuYWRkIFwiZWxsaXBzaXNcIlxuICAgICAgICAgIGVsbGlwc2lzRWxlbWVudC5pbm5lckhUTUwgPSBwYXRoc1twYXRoXS5lbGxpcHNpc1xuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCBlbGxpcHNpc0VsZW1lbnRcblxuICAgICAgICB0YWIuYXBwZW5kQ2hpbGQgY29udGFpbmVyXG4gIHJldHVybiAhcmV2ZXJ0XG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNtYXJ0VGFiTmFtZVxuICBkaXNwb3NhYmxlczogbnVsbFxuICBwcm9jZXNzZWQ6IGZhbHNlXG4gIGNvbnN0cnVjdG9yOiAgLT5cbiAgICBAcHJvY2Vzc2VkID0gcHJvY2Vzc0FsbFRhYnMoKVxuICAgIHVubGVzcyBAZGlzcG9zYWJsZXM/XG4gICAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFRleHRFZGl0b3IgLT5cbiAgICAgICAgc2V0VGltZW91dCBwcm9jZXNzQWxsVGFicywgMTBcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0gLT5cbiAgICAgICAgc2V0VGltZW91dCBwcm9jZXNzQWxsVGFicywgMTBcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRBZGRQYW5lIChldmVudCkgPT5cbiAgICAgICAgQGRpc3Bvc2FibGVzLmFkZCBldmVudC5wYW5lLm9uRGlkTW92ZUl0ZW0gLT5cbiAgICAgICAgICBzZXRUaW1lb3V0IHByb2Nlc3NBbGxUYWJzLCAxMFxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ3NtYXJ0LXRhYi1uYW1lOnRvZ2dsZSc6IEB0b2dnbGVcblxuICAgICAgZm9yIHBhbmUgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVxuICAgICAgICBAZGlzcG9zYWJsZXMuYWRkIHBhbmUub25EaWRNb3ZlSXRlbSAtPlxuICAgICAgICAgIHNldFRpbWVvdXQgcHJvY2Vzc0FsbFRhYnMsIDEwXG4gICAgbG9nIFwibG9hZGVkXCJcbiAgdG9nZ2xlOiA9PlxuICAgIEBwcm9jZXNzZWQgPSBwcm9jZXNzQWxsVGFicyhAcHJvY2Vzc2VkKVxuICBkZXN0cm95OiA9PlxuICAgIEBwcm9jZXNzZWQgPSBwcm9jZXNzQWxsVGFicyh0cnVlKVxuICAgIEBkaXNwb3NhYmxlcz8uZGlzcG9zZSgpXG4gICAgQGRpc3Bvc2FibGVzID0gbnVsbFxuIl19
