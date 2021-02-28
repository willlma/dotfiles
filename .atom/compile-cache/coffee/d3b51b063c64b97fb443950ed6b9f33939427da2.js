(function() {
  var BufferedProcess, PackageList, PackageSync, StatusMessage, fs,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  BufferedProcess = require('atom').BufferedProcess;

  PackageList = require('./package-list');

  StatusMessage = require('./status-message');

  module.exports = PackageSync = (function() {
    function PackageSync() {}

    PackageSync.prototype.apmPath = atom.packages.getApmPath();

    PackageSync.prototype.currentInstall = null;

    PackageSync.prototype.longMessageTimeout = 15000;

    PackageSync.prototype.message = null;

    PackageSync.prototype.packagesToInstall = [];

    PackageSync.prototype.shortMessageTimeout = 1000;

    PackageSync.prototype.timeout = null;

    PackageSync.prototype.createPackageList = function() {
      return new PackageList().setPackages();
    };

    PackageSync.prototype.openPackageList = function() {
      return atom.workspace.open(PackageList.getPackageListPath());
    };

    PackageSync.prototype.sync = function() {
      var missing;
      missing = this.getMissingPackages();
      return this.installPackages(missing);
    };

    PackageSync.prototype.displayMessage = function(message, timeout) {
      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
      if (this.message != null) {
        this.message.setText(message);
      } else {
        this.message = new StatusMessage(message);
      }
      if (timeout != null) {
        return this.setMessageTimeout(timeout);
      }
    };

    PackageSync.prototype.executeApm = function(pkg) {
      var args, command, exit, stderr, stdout;
      this.displayMessage("Installing " + pkg);
      command = this.apmPath;
      args = ['install', pkg];
      stdout = function(output) {};
      stderr = function(output) {};
      exit = (function(_this) {
        return function(exitCode) {
          if (exitCode === 0) {
            if (_this.packagesToInstall.length > 0) {
              _this.displayMessage(pkg + " installed!", _this.shortMessageTimeout);
            } else {
              _this.displayMessage('Package Sync complete!', _this.longMessageTimeout);
            }
          } else {
            _this.displayMessage("An error occurred installing " + pkg, _this.longMessageTimeout);
          }
          _this.currentInstall = null;
          return _this.installPackage();
        };
      })(this);
      return this.currentInstall = new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    };

    PackageSync.prototype.getMissingPackages = function() {
      var availablePackages, i, len, list, results, syncPackages, value;
      list = new PackageList();
      syncPackages = list.getPackages();
      availablePackages = atom.packages.getAvailablePackageNames();
      results = [];
      for (i = 0, len = syncPackages.length; i < len; i++) {
        value = syncPackages[i];
        if (indexOf.call(availablePackages, value) < 0) {
          results.push(value);
        }
      }
      return results;
    };

    PackageSync.prototype.installPackage = function() {
      if ((this.currentInstall != null) || this.packagesToInstall.length === 0) {
        return;
      }
      return this.executeApm(this.packagesToInstall.shift());
    };

    PackageSync.prototype.installPackages = function(packages) {
      var ref;
      (ref = this.packagesToInstall).push.apply(ref, packages);
      return this.installPackage();
    };

    PackageSync.prototype.setMessageTimeout = function(timeout) {
      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
      return this.timeout = setTimeout((function(_this) {
        return function() {
          _this.message.remove();
          return _this.message = null;
        };
      })(this), timeout);
    };

    return PackageSync;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGFja2FnZS1zeW5jL2xpYi9wYWNrYWdlLXN5bmMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0REFBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFSixrQkFBbUIsT0FBQSxDQUFRLE1BQVI7O0VBRXBCLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBQ2QsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVI7O0VBT2hCLE1BQU0sQ0FBQyxPQUFQLEdBQ007OzswQkFFSixPQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFkLENBQUE7OzBCQUdULGNBQUEsR0FBZ0I7OzBCQUdoQixrQkFBQSxHQUFvQjs7MEJBR3BCLE9BQUEsR0FBUzs7MEJBR1QsaUJBQUEsR0FBbUI7OzBCQUduQixtQkFBQSxHQUFxQjs7MEJBR3JCLE9BQUEsR0FBUzs7MEJBR1QsaUJBQUEsR0FBbUIsU0FBQTthQUNqQixJQUFJLFdBQUosQ0FBQSxDQUFpQixDQUFDLFdBQWxCLENBQUE7SUFEaUI7OzBCQUluQixlQUFBLEdBQWlCLFNBQUE7YUFDZixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBVyxDQUFDLGtCQUFaLENBQUEsQ0FBcEI7SUFEZTs7MEJBSWpCLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsa0JBQUQsQ0FBQTthQUNWLElBQUMsQ0FBQSxlQUFELENBQWlCLE9BQWpCO0lBRkk7OzBCQVdOLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEVBQVUsT0FBVjtNQUNkLElBQTBCLG9CQUExQjtRQUFBLFlBQUEsQ0FBYSxJQUFDLENBQUEsT0FBZCxFQUFBOztNQUNBLElBQUcsb0JBQUg7UUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBaUIsT0FBakIsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksYUFBSixDQUFrQixPQUFsQixFQUhiOztNQUtBLElBQStCLGVBQS9CO2VBQUEsSUFBQyxDQUFBLGlCQUFELENBQW1CLE9BQW5CLEVBQUE7O0lBUGM7OzBCQVloQixVQUFBLEdBQVksU0FBQyxHQUFEO0FBQ1YsVUFBQTtNQUFBLElBQUMsQ0FBQSxjQUFELENBQWdCLGFBQUEsR0FBYyxHQUE5QjtNQUNBLE9BQUEsR0FBVSxJQUFDLENBQUE7TUFDWCxJQUFBLEdBQU8sQ0FBQyxTQUFELEVBQVksR0FBWjtNQUNQLE1BQUEsR0FBUyxTQUFDLE1BQUQsR0FBQTtNQUNULE1BQUEsR0FBUyxTQUFDLE1BQUQsR0FBQTtNQUNULElBQUEsR0FBTyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtVQUNMLElBQUcsUUFBQSxLQUFZLENBQWY7WUFDRSxJQUFHLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFuQixHQUE0QixDQUEvQjtjQUNFLEtBQUMsQ0FBQSxjQUFELENBQW1CLEdBQUQsR0FBSyxhQUF2QixFQUFxQyxLQUFDLENBQUEsbUJBQXRDLEVBREY7YUFBQSxNQUFBO2NBR0UsS0FBQyxDQUFBLGNBQUQsQ0FBZ0Isd0JBQWhCLEVBQTBDLEtBQUMsQ0FBQSxrQkFBM0MsRUFIRjthQURGO1dBQUEsTUFBQTtZQU1FLEtBQUMsQ0FBQSxjQUFELENBQWdCLCtCQUFBLEdBQWdDLEdBQWhELEVBQXVELEtBQUMsQ0FBQSxrQkFBeEQsRUFORjs7VUFRQSxLQUFDLENBQUEsY0FBRCxHQUFrQjtpQkFDbEIsS0FBQyxDQUFBLGNBQUQsQ0FBQTtRQVZLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQVlQLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksZUFBSixDQUFvQjtRQUFDLFNBQUEsT0FBRDtRQUFVLE1BQUEsSUFBVjtRQUFnQixRQUFBLE1BQWhCO1FBQXdCLFFBQUEsTUFBeEI7UUFBZ0MsTUFBQSxJQUFoQztPQUFwQjtJQWxCUjs7MEJBdUJaLGtCQUFBLEdBQW9CLFNBQUE7QUFDbEIsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFJLFdBQUosQ0FBQTtNQUNQLFlBQUEsR0FBZSxJQUFJLENBQUMsV0FBTCxDQUFBO01BQ2YsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBZCxDQUFBO0FBQ3BCO1dBQUEsOENBQUE7O1lBQXFDLGFBQWEsaUJBQWIsRUFBQSxLQUFBO3VCQUFyQzs7QUFBQTs7SUFKa0I7OzBCQU9wQixjQUFBLEdBQWdCLFNBQUE7TUFHZCxJQUFVLDZCQUFBLElBQW9CLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFuQixLQUE2QixDQUEzRDtBQUFBLGVBQUE7O2FBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsaUJBQWlCLENBQUMsS0FBbkIsQ0FBQSxDQUFaO0lBSmM7OzBCQVNoQixlQUFBLEdBQWlCLFNBQUMsUUFBRDtBQUNmLFVBQUE7TUFBQSxPQUFBLElBQUMsQ0FBQSxpQkFBRCxDQUFrQixDQUFDLElBQW5CLFlBQXdCLFFBQXhCO2FBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBQTtJQUZlOzswQkFPakIsaUJBQUEsR0FBbUIsU0FBQyxPQUFEO01BQ2pCLElBQTBCLG9CQUExQjtRQUFBLFlBQUEsQ0FBYSxJQUFDLENBQUEsT0FBZCxFQUFBOzthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNwQixLQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsT0FBRCxHQUFXO1FBRlM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFHVCxPQUhTO0lBRk07Ozs7O0FBakhyQiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5cbntCdWZmZXJlZFByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcblxuUGFja2FnZUxpc3QgPSByZXF1aXJlICcuL3BhY2thZ2UtbGlzdCdcblN0YXR1c01lc3NhZ2UgPSByZXF1aXJlICcuL3N0YXR1cy1tZXNzYWdlJ1xuXG4jIFB1YmxpYzogUGVyZm9ybXMgdGhlIHBhY2thZ2Ugc3luY2hyb25pemF0aW9uLlxuI1xuIyAjIyBFdmVudHNcbiNcbiMgVGhpcyBjbGFzcyBoYXMgbm8gZXZlbnRzLlxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUGFja2FnZVN5bmNcbiAgIyBJbnRlcm5hbDogUGF0aCB0byBgYXBtYC5cbiAgYXBtUGF0aDogYXRvbS5wYWNrYWdlcy5nZXRBcG1QYXRoKClcblxuICAjIEludGVybmFsOiBQcm9jZXNzIG9iamVjdCBvZiB0aGUgY3VycmVudCBpbnN0YWxsLlxuICBjdXJyZW50SW5zdGFsbDogbnVsbFxuXG4gICMgSW50ZXJuYWw6IFRpbWVvdXQgZm9yIG1lc3NhZ2VzIHRoYXQgc2hvdWxkIGJlIHVwIGxvbmdlci5cbiAgbG9uZ01lc3NhZ2VUaW1lb3V0OiAxNTAwMFxuXG4gICMgSW50ZXJuYWw6IFN0YXR1cyBiYXIgbWVzc2FnZS5cbiAgbWVzc2FnZTogbnVsbFxuXG4gICMgSW50ZXJuYWw6IFBhY2thZ2VzIGluIHRoZSBwcm9jZXNzIG9mIGJlaW5nIGluc3RhbGxlZC5cbiAgcGFja2FnZXNUb0luc3RhbGw6IFtdXG5cbiAgIyBJbnRlcm5hbDogVGltZW91dCBmb3IgbWVzc2FnZXMgdGhhdCBzaG91bGQgYmUgdXAgZm9yIG9ubHkgYSBzaG9ydCB0aW1lLlxuICBzaG9ydE1lc3NhZ2VUaW1lb3V0OiAxMDAwXG5cbiAgIyBJbnRlcm5hbDogVGltZW91dCBmb3Igc3RhdHVzIGJhciBtZXNzYWdlLlxuICB0aW1lb3V0OiBudWxsXG5cbiAgIyBQdWJsaWM6IENyZWF0ZXMgdGhlIHBhY2thZ2UgbGlzdCBmb3IgdGhlIHVzZXIgZnJvbSB0aGUgbGlzdCBvZiBhdmFpbGFibGUgcGFja2FnZXMuXG4gIGNyZWF0ZVBhY2thZ2VMaXN0OiAtPlxuICAgIG5ldyBQYWNrYWdlTGlzdCgpLnNldFBhY2thZ2VzKClcblxuICAjIFB1YmxpYzogT3BlbnMgdGhlIHBhY2thZ2UgbGlzdC5cbiAgb3BlblBhY2thZ2VMaXN0OiAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oUGFja2FnZUxpc3QuZ2V0UGFja2FnZUxpc3RQYXRoKCkpXG5cbiAgIyBQdWJsaWM6IEluc3RhbGxzIGFueSBwYWNrYWdlcyB0aGF0IGFyZSBtaXNzaW5nIGZyb20gdGhlIGBwYWNrYWdlcy5jc29uYCBjb25maWd1cmF0aW9uIGZpbGUuXG4gIHN5bmM6IC0+XG4gICAgbWlzc2luZyA9IEBnZXRNaXNzaW5nUGFja2FnZXMoKVxuICAgIEBpbnN0YWxsUGFja2FnZXMobWlzc2luZylcblxuICAjIEludGVybmFsOiBEaXNwbGF5cyBhIG1lc3NhZ2UgaW4gdGhlIHN0YXR1cyBiYXIuXG4gICNcbiAgIyBJZiBgdGltZW91dGAgaXMgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY2xlYXJlZCBpbiBgdGltZW91dGAgbWlsbGlzZWNvbmRzLlxuICAjXG4gICMgbWVzc2FnZSAtIEEge1N0cmluZ30gY29udGFpbmluZyB0aGUgbWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQuXG4gICMgdGltZW91dCAtIEFuIG9wdGlvbmFsIHtOdW1iZXJ9IHNwZWNpZnlpbmcgdGhlIHRpbWUgaW4gbWlsbGlzZWNvbmRzIHVudGlsIHRoZSBtZXNzYWdlIHdpbGwgYmVcbiAgIyAgICAgICAgICAgY2xlYXJlZC5cbiAgZGlzcGxheU1lc3NhZ2U6IChtZXNzYWdlLCB0aW1lb3V0KSAtPlxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgaWYgQG1lc3NhZ2U/XG4gICAgICBAbWVzc2FnZS5zZXRUZXh0KG1lc3NhZ2UpXG4gICAgZWxzZVxuICAgICAgQG1lc3NhZ2UgPSBuZXcgU3RhdHVzTWVzc2FnZShtZXNzYWdlKVxuXG4gICAgQHNldE1lc3NhZ2VUaW1lb3V0KHRpbWVvdXQpIGlmIHRpbWVvdXQ/XG5cbiAgIyBJbnRlcm5hbDogRXhlY3V0ZSBBUE0gdG8gaW5zdGFsbCB0aGUgZ2l2ZW4gcGFja2FnZS5cbiAgI1xuICAjIHBrZyAtIEEge1N0cmluZ30gY29udGFpbmluZyB0aGUgbmFtZSBvZiB0aGUgcGFja2FnZSB0byBpbnN0YWxsLlxuICBleGVjdXRlQXBtOiAocGtnKSAtPlxuICAgIEBkaXNwbGF5TWVzc2FnZShcIkluc3RhbGxpbmcgI3twa2d9XCIpXG4gICAgY29tbWFuZCA9IEBhcG1QYXRoXG4gICAgYXJncyA9IFsnaW5zdGFsbCcsIHBrZ11cbiAgICBzdGRvdXQgPSAob3V0cHV0KSAtPlxuICAgIHN0ZGVyciA9IChvdXRwdXQpIC0+XG4gICAgZXhpdCA9IChleGl0Q29kZSkgPT5cbiAgICAgIGlmIGV4aXRDb2RlIGlzIDBcbiAgICAgICAgaWYgQHBhY2thZ2VzVG9JbnN0YWxsLmxlbmd0aCA+IDBcbiAgICAgICAgICBAZGlzcGxheU1lc3NhZ2UoXCIje3BrZ30gaW5zdGFsbGVkIVwiLCBAc2hvcnRNZXNzYWdlVGltZW91dClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBkaXNwbGF5TWVzc2FnZSgnUGFja2FnZSBTeW5jIGNvbXBsZXRlIScsIEBsb25nTWVzc2FnZVRpbWVvdXQpXG4gICAgICBlbHNlXG4gICAgICAgIEBkaXNwbGF5TWVzc2FnZShcIkFuIGVycm9yIG9jY3VycmVkIGluc3RhbGxpbmcgI3twa2d9XCIsIEBsb25nTWVzc2FnZVRpbWVvdXQpXG5cbiAgICAgIEBjdXJyZW50SW5zdGFsbCA9IG51bGxcbiAgICAgIEBpbnN0YWxsUGFja2FnZSgpXG5cbiAgICBAY3VycmVudEluc3RhbGwgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKHtjb21tYW5kLCBhcmdzLCBzdGRvdXQsIHN0ZGVyciwgZXhpdH0pXG5cbiAgIyBJbnRlcm5hbDogR2V0cyB0aGUgbGlzdCBvZiBwYWNrYWdlcyB0aGF0IGFyZSBtaXNzaW5nLlxuICAjXG4gICMgUmV0dXJucyBhbiB7QXJyYXl9IG9mIG5hbWVzIG9mIHBhY2thZ2VzIHRoYXQgbmVlZCB0byBiZSBpbnN0YWxsZWQuXG4gIGdldE1pc3NpbmdQYWNrYWdlczogLT5cbiAgICBsaXN0ID0gbmV3IFBhY2thZ2VMaXN0KClcbiAgICBzeW5jUGFja2FnZXMgPSBsaXN0LmdldFBhY2thZ2VzKClcbiAgICBhdmFpbGFibGVQYWNrYWdlcyA9IGF0b20ucGFja2FnZXMuZ2V0QXZhaWxhYmxlUGFja2FnZU5hbWVzKClcbiAgICB2YWx1ZSBmb3IgdmFsdWUgaW4gc3luY1BhY2thZ2VzIHdoZW4gdmFsdWUgbm90IGluIGF2YWlsYWJsZVBhY2thZ2VzXG5cbiAgIyBJbnRlcm5hbDogSW5zdGFsbHMgdGhlIG5leHQgcGFja2FnZSBpbiB0aGUgbGlzdC5cbiAgaW5zdGFsbFBhY2thZ2U6IC0+XG4gICAgIyBFeGl0IGlmIHRoZXJlIGlzIGFscmVhZHkgYW4gaW5zdGFsbGF0aW9uIHJ1bm5pbmcgb3IgaWYgdGhlcmUgYXJlIG5vIG1vcmVcbiAgICAjIHBhY2thZ2VzIHRvIGluc3RhbGwuXG4gICAgcmV0dXJuIGlmIEBjdXJyZW50SW5zdGFsbD8gb3IgQHBhY2thZ2VzVG9JbnN0YWxsLmxlbmd0aCBpcyAwXG4gICAgQGV4ZWN1dGVBcG0oQHBhY2thZ2VzVG9JbnN0YWxsLnNoaWZ0KCkpXG5cbiAgIyBJbnRlcm5hbDogSW5zdGFsbHMgZWFjaCBvZiB0aGUgcGFja2FnZXMgaW4gdGhlIGdpdmVuIGxpc3QuXG4gICNcbiAgIyBwYWNrYWdlcyAtIEFuIHtBcnJheX0gY29udGFpbmluZyB0aGUgbmFtZXMgb2YgcGFja2FnZXMgdG8gaW5zdGFsbC5cbiAgaW5zdGFsbFBhY2thZ2VzOiAocGFja2FnZXMpIC0+XG4gICAgQHBhY2thZ2VzVG9JbnN0YWxsLnB1c2gocGFja2FnZXMuLi4pXG4gICAgQGluc3RhbGxQYWNrYWdlKClcblxuICAjIEludGVybmFsOiBTZXRzIGEgdGltZW91dCB0byByZW1vdmUgdGhlIHN0YXR1cyBiYXIgbWVzc2FnZS5cbiAgI1xuICAjIHRpbWVvdXQgLSBUaGUge051bWJlcn0gb2YgbWlsbGlzZWNvbmRzIHVudGlsIHRoZSBtZXNzYWdlIHNob3VsZCBiZSByZW1vdmVkLlxuICBzZXRNZXNzYWdlVGltZW91dDogKHRpbWVvdXQpIC0+XG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAdGltZW91dCA9IHNldFRpbWVvdXQoPT5cbiAgICAgIEBtZXNzYWdlLnJlbW92ZSgpXG4gICAgICBAbWVzc2FnZSA9IG51bGxcbiAgICAsIHRpbWVvdXQpXG4iXX0=
