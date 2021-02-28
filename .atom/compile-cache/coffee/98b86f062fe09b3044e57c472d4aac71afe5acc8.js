(function() {
  var PackageSync, loadModule, packageSync;

  PackageSync = null;

  packageSync = null;

  loadModule = function() {
    if (PackageSync == null) {
      PackageSync = require('./package-sync');
    }
    return packageSync != null ? packageSync : packageSync = new PackageSync();
  };

  module.exports = {
    activate: function() {
      atom.commands.add('atom-workspace', 'package-sync:create-package-list', function() {
        loadModule();
        return packageSync.createPackageList();
      });
      atom.commands.add('atom-workspace', 'package-sync:open-package-list', function() {
        loadModule();
        return packageSync.openPackageList();
      });
      atom.commands.add('atom-workspace', 'package-sync:sync', function() {
        loadModule();
        return packageSync.sync();
      });
      return atom.packages.onDidActivateInitialPackages(function() {
        atom.packages.onDidLoadPackage(function() {
          if (atom.config.get('package-sync.createOnChange')) {
            loadModule();
            return packageSync.createPackageList();
          }
        });
        return atom.packages.onDidUnloadPackage(function() {
          if (atom.config.get('package-sync.createOnChange')) {
            loadModule();
            return packageSync.createPackageList();
          }
        });
      });
    },
    config: {
      forceOverwrite: {
        title: 'Overwrite packages.cson',
        description: 'Overwrite packages.cson even when it is present.',
        type: 'boolean',
        "default": false
      },
      createOnChange: {
        title: 'Create on change',
        description: 'Create package list when packages are installed or removed.',
        type: 'boolean',
        "default": false
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGFja2FnZS1zeW5jL2xpYi9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYzs7RUFDZCxXQUFBLEdBQWM7O0VBR2QsVUFBQSxHQUFhLFNBQUE7O01BQ1gsY0FBZSxPQUFBLENBQVEsZ0JBQVI7O2lDQUNmLGNBQUEsY0FBZSxJQUFJLFdBQUosQ0FBQTtFQUZKOztFQUliLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msa0NBQXBDLEVBQXdFLFNBQUE7UUFDdEUsVUFBQSxDQUFBO2VBQ0EsV0FBVyxDQUFDLGlCQUFaLENBQUE7TUFGc0UsQ0FBeEU7TUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGdDQUFwQyxFQUFzRSxTQUFBO1FBQ3BFLFVBQUEsQ0FBQTtlQUNBLFdBQVcsQ0FBQyxlQUFaLENBQUE7TUFGb0UsQ0FBdEU7TUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG1CQUFwQyxFQUF5RCxTQUFBO1FBQ3ZELFVBQUEsQ0FBQTtlQUNBLFdBQVcsQ0FBQyxJQUFaLENBQUE7TUFGdUQsQ0FBekQ7YUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUFkLENBQTJDLFNBQUE7UUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixTQUFBO1VBQzdCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFIO1lBQ0UsVUFBQSxDQUFBO21CQUNBLFdBQVcsQ0FBQyxpQkFBWixDQUFBLEVBRkY7O1FBRDZCLENBQS9CO2VBS0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxTQUFBO1VBQy9CLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFIO1lBQ0UsVUFBQSxDQUFBO21CQUNBLFdBQVcsQ0FBQyxpQkFBWixDQUFBLEVBRkY7O1FBRCtCLENBQWpDO01BTnlDLENBQTNDO0lBYlEsQ0FBVjtJQXdCQSxNQUFBLEVBQ0U7TUFBQSxjQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8seUJBQVA7UUFDQSxXQUFBLEVBQWEsa0RBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtPQURGO01BS0EsY0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGtCQUFQO1FBQ0EsV0FBQSxFQUFhLDZEQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7T0FORjtLQXpCRjs7QUFURiIsInNvdXJjZXNDb250ZW50IjpbIlBhY2thZ2VTeW5jID0gbnVsbFxucGFja2FnZVN5bmMgPSBudWxsXG5cbiMgTG9hZHMgdGhlIG1vZHVsZSBvbi1kZW1hbmQuXG5sb2FkTW9kdWxlID0gLT5cbiAgUGFja2FnZVN5bmMgPz0gcmVxdWlyZSAnLi9wYWNrYWdlLXN5bmMnXG4gIHBhY2thZ2VTeW5jID89IG5ldyBQYWNrYWdlU3luYygpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3BhY2thZ2Utc3luYzpjcmVhdGUtcGFja2FnZS1saXN0JywgLT5cbiAgICAgIGxvYWRNb2R1bGUoKVxuICAgICAgcGFja2FnZVN5bmMuY3JlYXRlUGFja2FnZUxpc3QoKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3BhY2thZ2Utc3luYzpvcGVuLXBhY2thZ2UtbGlzdCcsIC0+XG4gICAgICBsb2FkTW9kdWxlKClcbiAgICAgIHBhY2thZ2VTeW5jLm9wZW5QYWNrYWdlTGlzdCgpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAncGFja2FnZS1zeW5jOnN5bmMnLCAtPlxuICAgICAgbG9hZE1vZHVsZSgpXG4gICAgICBwYWNrYWdlU3luYy5zeW5jKClcblxuICAgIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZUluaXRpYWxQYWNrYWdlcyAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5vbkRpZExvYWRQYWNrYWdlIC0+XG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgncGFja2FnZS1zeW5jLmNyZWF0ZU9uQ2hhbmdlJylcbiAgICAgICAgICBsb2FkTW9kdWxlKClcbiAgICAgICAgICBwYWNrYWdlU3luYy5jcmVhdGVQYWNrYWdlTGlzdCgpXG5cbiAgICAgIGF0b20ucGFja2FnZXMub25EaWRVbmxvYWRQYWNrYWdlIC0+XG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgncGFja2FnZS1zeW5jLmNyZWF0ZU9uQ2hhbmdlJylcbiAgICAgICAgICBsb2FkTW9kdWxlKClcbiAgICAgICAgICBwYWNrYWdlU3luYy5jcmVhdGVQYWNrYWdlTGlzdCgpXG5cbiAgY29uZmlnOlxuICAgIGZvcmNlT3ZlcndyaXRlOlxuICAgICAgdGl0bGU6ICdPdmVyd3JpdGUgcGFja2FnZXMuY3NvbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnT3ZlcndyaXRlIHBhY2thZ2VzLmNzb24gZXZlbiB3aGVuIGl0IGlzIHByZXNlbnQuJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGNyZWF0ZU9uQ2hhbmdlOlxuICAgICAgdGl0bGU6ICdDcmVhdGUgb24gY2hhbmdlJ1xuICAgICAgZGVzY3JpcHRpb246ICdDcmVhdGUgcGFja2FnZSBsaXN0IHdoZW4gcGFja2FnZXMgYXJlIGluc3RhbGxlZCBvciByZW1vdmVkLidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiJdfQ==
