(function() {
  var Main, SmartTabName, log, pkgName, reloader;

  SmartTabName = null;

  log = null;

  reloader = null;

  pkgName = "smart-tab-name";

  module.exports = new (Main = (function() {
    function Main() {}

    Main.prototype.subscriptions = null;

    Main.prototype.SmartTabName = null;

    Main.prototype.config = {
      debug: {
        type: "integer",
        "default": 0,
        minimum: 0
      }
    };

    Main.prototype.activate = function() {
      var load;
      setTimeout((function() {
        var reloaderSettings;
        reloaderSettings = {
          pkg: pkgName,
          folders: ["lib", "styles"]
        };
        try {
          return reloader != null ? reloader : reloader = require("atom-package-reloader")(reloaderSettings);
        } catch (error) {

        }
      }), 500);
      if (log == null) {
        log = require("atom-simple-logger")({
          pkg: pkgName,
          nsp: "main"
        });
        log("activating");
      }
      if (this.SmartTabName == null) {
        log("loading core");
        load = (function(_this) {
          return function() {
            try {
              if (SmartTabName == null) {
                SmartTabName = require("./" + pkgName);
              }
              return _this.SmartTabName = new SmartTabName;
            } catch (error) {
              return log("loading core failed");
            }
          };
        })(this);
        if (atom.packages.isPackageActive("tabs")) {
          return load();
        } else {
          return this.onceActivated = atom.packages.onDidActivatePackage((function(_this) {
            return function(p) {
              if (p.name === "tabs") {
                load();
                return _this.onceActivated.dispose();
              }
            };
          })(this));
        }
      }
    };

    Main.prototype.deactivate = function() {
      var ref, ref1;
      log("deactivating");
      if ((ref = this.onceActivated) != null) {
        if (typeof ref.dispose === "function") {
          ref.dispose();
        }
      }
      if ((ref1 = this.SmartTabName) != null) {
        if (typeof ref1.destroy === "function") {
          ref1.destroy();
        }
      }
      this.SmartTabName = null;
      log = null;
      SmartTabName = null;
      if (reloader != null) {
        reloader.dispose();
      }
      return reloader = null;
    };

    return Main;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvc21hcnQtdGFiLW5hbWUvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxZQUFBLEdBQWU7O0VBQ2YsR0FBQSxHQUFNOztFQUNOLFFBQUEsR0FBVzs7RUFFWCxPQUFBLEdBQVU7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBVTs7O21CQUN6QixhQUFBLEdBQWU7O21CQUNmLFlBQUEsR0FBYzs7bUJBQ2QsTUFBQSxHQUNFO01BQUEsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtPQURGOzs7bUJBS0YsUUFBQSxHQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsVUFBQSxDQUFXLENBQUMsU0FBQTtBQUNWLFlBQUE7UUFBQSxnQkFBQSxHQUFtQjtVQUFBLEdBQUEsRUFBSSxPQUFKO1VBQVksT0FBQSxFQUFRLENBQUMsS0FBRCxFQUFPLFFBQVAsQ0FBcEI7O0FBQ25CO29DQUNFLFdBQUEsV0FBWSxPQUFBLENBQVEsdUJBQVIsQ0FBQSxDQUFpQyxnQkFBakMsRUFEZDtTQUFBLGFBQUE7QUFBQTs7TUFGVSxDQUFELENBQVgsRUFNSSxHQU5KO01BT0EsSUFBTyxXQUFQO1FBQ0UsR0FBQSxHQUFNLE9BQUEsQ0FBUSxvQkFBUixDQUFBLENBQThCO1VBQUEsR0FBQSxFQUFJLE9BQUo7VUFBWSxHQUFBLEVBQUksTUFBaEI7U0FBOUI7UUFDTixHQUFBLENBQUksWUFBSixFQUZGOztNQUdBLElBQU8seUJBQVA7UUFDRSxHQUFBLENBQUksY0FBSjtRQUNBLElBQUEsR0FBTyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ0w7O2dCQUNFLGVBQWdCLE9BQUEsQ0FBUSxJQUFBLEdBQUssT0FBYjs7cUJBQ2hCLEtBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUksYUFGdEI7YUFBQSxhQUFBO3FCQUlFLEdBQUEsQ0FBSSxxQkFBSixFQUpGOztVQURLO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtRQU1QLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE1BQTlCLENBQUg7aUJBQ0UsSUFBQSxDQUFBLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQWQsQ0FBbUMsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQyxDQUFEO2NBQ2xELElBQUcsQ0FBQyxDQUFDLElBQUYsS0FBVSxNQUFiO2dCQUNFLElBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQUZGOztZQURrRDtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkMsRUFIbkI7U0FSRjs7SUFYUTs7bUJBNEJWLFVBQUEsR0FBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLEdBQUEsQ0FBSSxjQUFKOzs7YUFDYyxDQUFFOzs7OztjQUNILENBQUU7OztNQUNmLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQ2hCLEdBQUEsR0FBTTtNQUNOLFlBQUEsR0FBZTs7UUFDZixRQUFRLENBQUUsT0FBVixDQUFBOzthQUNBLFFBQUEsR0FBVztJQVJEOzs7OztBQTNDZCIsInNvdXJjZXNDb250ZW50IjpbIlNtYXJ0VGFiTmFtZSA9IG51bGxcbmxvZyA9IG51bGxcbnJlbG9hZGVyID0gbnVsbFxuXG5wa2dOYW1lID0gXCJzbWFydC10YWItbmFtZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IGNsYXNzIE1haW5cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBTbWFydFRhYk5hbWU6IG51bGxcbiAgY29uZmlnOlxuICAgIGRlYnVnOlxuICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICAgIG1pbmltdW06IDBcblxuICBhY3RpdmF0ZTogLT5cbiAgICBzZXRUaW1lb3V0ICgtPlxuICAgICAgcmVsb2FkZXJTZXR0aW5ncyA9IHBrZzpwa2dOYW1lLGZvbGRlcnM6W1wibGliXCIsXCJzdHlsZXNcIl1cbiAgICAgIHRyeVxuICAgICAgICByZWxvYWRlciA/PSByZXF1aXJlKFwiYXRvbS1wYWNrYWdlLXJlbG9hZGVyXCIpKHJlbG9hZGVyU2V0dGluZ3MpXG4gICAgICBjYXRjaFxuXG4gICAgICApLDUwMFxuICAgIHVubGVzcyBsb2c/XG4gICAgICBsb2cgPSByZXF1aXJlKFwiYXRvbS1zaW1wbGUtbG9nZ2VyXCIpKHBrZzpwa2dOYW1lLG5zcDpcIm1haW5cIilcbiAgICAgIGxvZyBcImFjdGl2YXRpbmdcIlxuICAgIHVubGVzcyBAU21hcnRUYWJOYW1lP1xuICAgICAgbG9nIFwibG9hZGluZyBjb3JlXCJcbiAgICAgIGxvYWQgPSA9PlxuICAgICAgICB0cnlcbiAgICAgICAgICBTbWFydFRhYk5hbWUgPz0gcmVxdWlyZSBcIi4vI3twa2dOYW1lfVwiXG4gICAgICAgICAgQFNtYXJ0VGFiTmFtZSA9IG5ldyBTbWFydFRhYk5hbWVcbiAgICAgICAgY2F0Y2hcbiAgICAgICAgICBsb2cgXCJsb2FkaW5nIGNvcmUgZmFpbGVkXCJcbiAgICAgIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlQWN0aXZlKFwidGFic1wiKVxuICAgICAgICBsb2FkKClcbiAgICAgIGVsc2VcbiAgICAgICAgQG9uY2VBY3RpdmF0ZWQgPSBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVQYWNrYWdlIChwKSA9PlxuICAgICAgICAgIGlmIHAubmFtZSA9PSBcInRhYnNcIlxuICAgICAgICAgICAgbG9hZCgpXG4gICAgICAgICAgICBAb25jZUFjdGl2YXRlZC5kaXNwb3NlKClcblxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgbG9nIFwiZGVhY3RpdmF0aW5nXCJcbiAgICBAb25jZUFjdGl2YXRlZD8uZGlzcG9zZT8oKVxuICAgIEBTbWFydFRhYk5hbWU/LmRlc3Ryb3k/KClcbiAgICBAU21hcnRUYWJOYW1lID0gbnVsbFxuICAgIGxvZyA9IG51bGxcbiAgICBTbWFydFRhYk5hbWUgPSBudWxsXG4gICAgcmVsb2FkZXI/LmRpc3Bvc2UoKVxuICAgIHJlbG9hZGVyID0gbnVsbFxuIl19
