(function() {
  var CSON, PackageList, fs, path;

  CSON = require('season');

  fs = require('fs');

  path = require('path');

  module.exports = PackageList = (function() {
    function PackageList() {}

    PackageList.prototype.getPackages = function() {
      var obj;
      if (fs.existsSync(PackageList.getPackageListPath())) {
        obj = CSON.readFileSync(PackageList.getPackageListPath());
        return obj['packages'];
      } else {
        return [];
      }
    };

    PackageList.prototype.setPackages = function() {
      var available, name, packages;
      if (atom.config.get('package-sync.forceOverwrite') || !fs.existsSync(PackageList.getPackageListPath())) {
        available = atom.packages.getAvailablePackageNames();
        packages = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = available.length; i < len; i++) {
            name = available[i];
            if (!atom.packages.isBundledPackage(name)) {
              results.push(name);
            }
          }
          return results;
        })();
        return CSON.writeFileSync(PackageList.getPackageListPath(), {
          'packages': packages
        });
      }
    };

    PackageList.getPackageListPath = function() {
      return this.packageListPath != null ? this.packageListPath : this.packageListPath = path.join(atom.getConfigDirPath(), 'packages.cson');
    };

    return PackageList;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGFja2FnZS1zeW5jL2xpYi9wYWNrYWdlLWxpc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFPUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7MEJBSUosV0FBQSxHQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFdBQVcsQ0FBQyxrQkFBWixDQUFBLENBQWQsQ0FBSDtRQUNFLEdBQUEsR0FBTSxJQUFJLENBQUMsWUFBTCxDQUFrQixXQUFXLENBQUMsa0JBQVosQ0FBQSxDQUFsQjtlQUNOLEdBQUksQ0FBQSxVQUFBLEVBRk47T0FBQSxNQUFBO2VBSUUsR0FKRjs7SUFEVzs7MEJBUWIsV0FBQSxHQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQUEsSUFBa0QsQ0FBSSxFQUFFLENBQUMsVUFBSCxDQUFjLFdBQVcsQ0FBQyxrQkFBWixDQUFBLENBQWQsQ0FBekQ7UUFDRSxTQUFBLEdBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBZCxDQUFBO1FBQ1osUUFBQTs7QUFBWTtlQUFBLDJDQUFBOztnQkFBZ0MsQ0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLElBQS9COzJCQUFwQzs7QUFBQTs7O2VBQ1osSUFBSSxDQUFDLGFBQUwsQ0FBbUIsV0FBVyxDQUFDLGtCQUFaLENBQUEsQ0FBbkIsRUFBcUQ7VUFBQyxVQUFBLEVBQVksUUFBYjtTQUFyRCxFQUhGOztJQURXOztJQVNiLFdBQUMsQ0FBQSxrQkFBRCxHQUFxQixTQUFBOzRDQUNuQixJQUFDLENBQUEsa0JBQUQsSUFBQyxDQUFBLGtCQUFtQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBQVYsRUFBbUMsZUFBbkM7SUFERDs7Ozs7QUEvQnZCIiwic291cmNlc0NvbnRlbnQiOlsiQ1NPTiA9IHJlcXVpcmUgJ3NlYXNvbidcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuIyBQdWJsaWM6IFJlcHJlc2VudHMgdGhlIGxpc3Qgb2YgcGFja2FnZXMgdGhhdCB0aGUgdXNlciB3YW50cyBzeW5jaHJvbml6ZWQuXG4jXG4jICMjIEV2ZW50c1xuI1xuIyBUaGlzIGNsYXNzIGhhcyBubyBldmVudHMuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBQYWNrYWdlTGlzdFxuICAjIFB1YmxpYzogR2V0cyB0aGUgbGlzdCBvZiBwYWNrYWdlcyB0aGF0IHRoZSB1c2VyIHdhbnRzIHN5bmNocm9uaXplZC5cbiAgI1xuICAjIFJldHVybnMgYW4ge0FycmF5fSBjb250YWluaW5nIHRoZSBwYWNrYWdlIG5hbWVzLlxuICBnZXRQYWNrYWdlczogLT5cbiAgICBpZiBmcy5leGlzdHNTeW5jKFBhY2thZ2VMaXN0LmdldFBhY2thZ2VMaXN0UGF0aCgpKVxuICAgICAgb2JqID0gQ1NPTi5yZWFkRmlsZVN5bmMoUGFja2FnZUxpc3QuZ2V0UGFja2FnZUxpc3RQYXRoKCkpXG4gICAgICBvYmpbJ3BhY2thZ2VzJ11cbiAgICBlbHNlXG4gICAgICBbXVxuXG4gICMgUHVibGljOiBTZXRzIHRoZSBsaXN0IG9mIHBhY2thZ2VzIHRvIHRoZSBsaXN0IG9mIGF2YWlsYWJsZSBwYWNrYWdlcy5cbiAgc2V0UGFja2FnZXM6IC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdwYWNrYWdlLXN5bmMuZm9yY2VPdmVyd3JpdGUnKSBvciBub3QgZnMuZXhpc3RzU3luYyhQYWNrYWdlTGlzdC5nZXRQYWNrYWdlTGlzdFBhdGgoKSlcbiAgICAgIGF2YWlsYWJsZSA9IGF0b20ucGFja2FnZXMuZ2V0QXZhaWxhYmxlUGFja2FnZU5hbWVzKClcbiAgICAgIHBhY2thZ2VzID0gKG5hbWUgZm9yIG5hbWUgaW4gYXZhaWxhYmxlIHdoZW4gbm90IGF0b20ucGFja2FnZXMuaXNCdW5kbGVkUGFja2FnZShuYW1lKSlcbiAgICAgIENTT04ud3JpdGVGaWxlU3luYyhQYWNrYWdlTGlzdC5nZXRQYWNrYWdlTGlzdFBhdGgoKSwgeydwYWNrYWdlcyc6IHBhY2thZ2VzfSlcblxuICAjIEludGVybmFsOiBHZXRzIHRoZSBwYXRoIHRvIHRoZSBwYWNrYWdlIGxpc3QuXG4gICNcbiAgIyBSZXR1cm5zIGEge1N0cmluZ30gY29udGFpbmluZyB0aGUgcGF0aCB0byB0aGUgbGlzdCBvZiBhdmFpbGFibGUgcGFja2FnZXMuXG4gIEBnZXRQYWNrYWdlTGlzdFBhdGg6IC0+XG4gICAgQHBhY2thZ2VMaXN0UGF0aCA/PSBwYXRoLmpvaW4oYXRvbS5nZXRDb25maWdEaXJQYXRoKCksICdwYWNrYWdlcy5jc29uJylcbiJdfQ==
