(function() {
  var IS_WIN32, RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-ruby-client.coffee');

  IS_WIN32 = process.platform === 'win32';

  String.prototype.regExpEscape = function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.selector = '.source.ruby';

    RsenseProvider.prototype.disableForSelector = '.source.ruby .comment';

    RsenseProvider.suggestionPriority = atom.config.get('autocomplete-ruby.suggestionPriority');

    RsenseProvider.prototype.inclusionPriority = 1;

    RsenseProvider.prototype.suggestionPriority = RsenseProvider.suggestionPriority === true ? 2 : void 0;

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
      if (!IS_WIN32) {
        this.rsenseClient.startRsenseUnix();
      }
      this.lastSuggestions = [];
    }

    RsenseProvider.prototype.getSuggestions = function(arg) {
      var bufferPosition, editor, prefix, scopeDescriptor;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      if (IS_WIN32) {
        this.rsenseClient.startRsenseWin32();
      }
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, row;
          row = bufferPosition.row + 1;
          col = bufferPosition.column + 1;
          return completions = _this.rsenseClient.checkCompletion(editor, editor.buffer, row, col, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(prefix, completions);
            if ((suggestions != null ? suggestions.length : void 0)) {
              _this.lastSuggestions = suggestions;
            }
            if (prefix === '.' || prefix === '::') {
              resolve(_this.lastSuggestions);
            }
            return resolve(_this.filterSuggestions(prefix, _this.lastSuggestions));
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, completions) {
      var completion, i, kind, len, suggestion, suggestions;
      if (completions != null) {
        suggestions = [];
        for (i = 0, len = completions.length; i < len; i++) {
          completion = completions[i];
          kind = completion.kind.toLowerCase();
          if (kind === "module") {
            kind = "import";
          }
          suggestion = {
            text: completion.name,
            type: kind,
            leftLabel: completion.base_name
          };
          suggestions.push(suggestion);
        }
        suggestions.sort(function(x, y) {
          if (x.text > y.text) {
            return 1;
          } else if (x.text < y.text) {
            return -1;
          } else {
            return 0;
          }
        });
        return suggestions;
      }
      return [];
    };

    RsenseProvider.prototype.filterSuggestions = function(prefix, suggestions) {
      var expression, i, len, suggestion, suggestionBuffer;
      suggestionBuffer = [];
      if (!(prefix != null ? prefix.length : void 0) || !(suggestions != null ? suggestions.length : void 0)) {
        return [];
      }
      expression = new RegExp("^" + prefix.regExpEscape(), "i");
      for (i = 0, len = suggestions.length; i < len; i++) {
        suggestion = suggestions[i];
        if (expression.test(suggestion.text)) {
          suggestion.replacementPrefix = prefix;
          suggestionBuffer.push(suggestion);
        }
      }
      return suggestionBuffer;
    };

    RsenseProvider.prototype.dispose = function() {
      if (IS_WIN32) {
        return this.rsenseClient.stopRsense();
      }
      return this.rsenseClient.stopRsenseUnix();
    };

    return RsenseProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXJ1YnkvbGliL2F1dG9jb21wbGV0ZS1ydWJ5LXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxtQ0FBUjs7RUFDZixRQUFBLEdBQVcsT0FBTyxDQUFDLFFBQVIsS0FBb0I7O0VBRS9CLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBakIsR0FBZ0MsU0FBQTtBQUM5QixXQUFPLElBQUMsQ0FBQSxPQUFELENBQVMscUNBQVQsRUFBZ0QsTUFBaEQ7RUFEdUI7O0VBR2hDLE1BQU0sQ0FBQyxPQUFQLEdBQ007NkJBQ0osUUFBQSxHQUFVOzs2QkFDVixrQkFBQSxHQUFvQjs7SUFDcEIsY0FBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEI7OzZCQUV0QixpQkFBQSxHQUFtQjs7NkJBQ25CLGtCQUFBLEdBQXlCLGNBQUMsQ0FBQSxrQkFBRCxLQUF1QixJQUE1QixHQUFBLENBQUEsR0FBQTs7NkJBRXBCLFlBQUEsR0FBYzs7SUFFRCx3QkFBQTtNQUNYLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUksWUFBSixDQUFBO01BQ2hCLElBQW1DLENBQUMsUUFBcEM7UUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLGVBQWQsQ0FBQSxFQUFBOztNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBSFI7OzZCQUtiLGNBQUEsR0FBZ0IsU0FBQyxHQUFEO0FBQ2QsVUFBQTtNQURnQixxQkFBUSxxQ0FBZ0IsdUNBQWlCO01BQ3pELElBQW9DLFFBQXBDO1FBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxnQkFBZCxDQUFBLEVBQUE7O2FBQ0EsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7QUFFVixjQUFBO1VBQUEsR0FBQSxHQUFNLGNBQWMsQ0FBQyxHQUFmLEdBQXFCO1VBQzNCLEdBQUEsR0FBTSxjQUFjLENBQUMsTUFBZixHQUF3QjtpQkFDOUIsV0FBQSxHQUFjLEtBQUMsQ0FBQSxZQUFZLENBQUMsZUFBZCxDQUE4QixNQUE5QixFQUNkLE1BQU0sQ0FBQyxNQURPLEVBQ0MsR0FERCxFQUNNLEdBRE4sRUFDVyxTQUFDLFdBQUQ7QUFDdkIsZ0JBQUE7WUFBQSxXQUFBLEdBQWMsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBakIsRUFBeUIsV0FBekI7WUFDZCxJQUFFLHVCQUFDLFdBQVcsQ0FBRSxlQUFkLENBQUY7Y0FDRSxLQUFDLENBQUEsZUFBRCxHQUFtQixZQURyQjs7WUFJQSxJQUE2QixNQUFBLEtBQVUsR0FBVixJQUFpQixNQUFBLEtBQVUsSUFBeEQ7Y0FBQSxPQUFBLENBQVEsS0FBQyxDQUFBLGVBQVQsRUFBQTs7bUJBRUEsT0FBQSxDQUFRLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixNQUFuQixFQUEyQixLQUFDLENBQUEsZUFBNUIsQ0FBUjtVQVJ1QixDQURYO1FBSko7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUFGYzs7NkJBa0JoQixlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLFdBQVQ7QUFDZixVQUFBO01BQUEsSUFBRyxtQkFBSDtRQUNFLFdBQUEsR0FBYztBQUNkLGFBQUEsNkNBQUE7O1VBQ0UsSUFBQSxHQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBaEIsQ0FBQTtVQUNQLElBQW1CLElBQUEsS0FBUSxRQUEzQjtZQUFBLElBQUEsR0FBTyxTQUFQOztVQUNBLFVBQUEsR0FDRTtZQUFBLElBQUEsRUFBTSxVQUFVLENBQUMsSUFBakI7WUFDQSxJQUFBLEVBQU0sSUFETjtZQUVBLFNBQUEsRUFBVyxVQUFVLENBQUMsU0FGdEI7O1VBR0YsV0FBVyxDQUFDLElBQVosQ0FBaUIsVUFBakI7QUFQRjtRQVFBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsQ0FBRCxFQUFJLENBQUo7VUFDZixJQUFHLENBQUMsQ0FBQyxJQUFGLEdBQU8sQ0FBQyxDQUFDLElBQVo7bUJBQ0UsRUFERjtXQUFBLE1BRUssSUFBRyxDQUFDLENBQUMsSUFBRixHQUFPLENBQUMsQ0FBQyxJQUFaO21CQUNILENBQUMsRUFERTtXQUFBLE1BQUE7bUJBR0gsRUFIRzs7UUFIVSxDQUFqQjtBQVFBLGVBQU8sWUFsQlQ7O0FBbUJBLGFBQU87SUFwQlE7OzZCQXVCakIsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEVBQVMsV0FBVDtBQUNqQixVQUFBO01BQUEsZ0JBQUEsR0FBbUI7TUFFbkIsSUFBRyxtQkFBQyxNQUFNLENBQUUsZ0JBQVQsSUFBbUIsd0JBQUMsV0FBVyxDQUFFLGdCQUFwQztBQUNFLGVBQU8sR0FEVDs7TUFHQSxVQUFBLEdBQWEsSUFBSSxNQUFKLENBQVcsR0FBQSxHQUFJLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBZixFQUFzQyxHQUF0QztBQUViLFdBQUEsNkNBQUE7O1FBQ0UsSUFBRyxVQUFVLENBQUMsSUFBWCxDQUFnQixVQUFVLENBQUMsSUFBM0IsQ0FBSDtVQUNFLFVBQVUsQ0FBQyxpQkFBWCxHQUErQjtVQUMvQixnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixVQUF0QixFQUZGOztBQURGO0FBS0EsYUFBTztJQWJVOzs2QkFlbkIsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFxQyxRQUFyQztBQUFBLGVBQU8sSUFBQyxDQUFBLFlBQVksQ0FBQyxVQUFkLENBQUEsRUFBUDs7YUFDQSxJQUFDLENBQUEsWUFBWSxDQUFDLGNBQWQsQ0FBQTtJQUZPOzs7OztBQTlFWCIsInNvdXJjZXNDb250ZW50IjpbIlJzZW5zZUNsaWVudCA9IHJlcXVpcmUgJy4vYXV0b2NvbXBsZXRlLXJ1YnktY2xpZW50LmNvZmZlZSdcbklTX1dJTjMyID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PSAnd2luMzInXG5cblN0cmluZy5wcm90b3R5cGUucmVnRXhwRXNjYXBlID0gKCkgLT5cbiAgcmV0dXJuIEByZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIilcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUnNlbnNlUHJvdmlkZXJcbiAgc2VsZWN0b3I6ICcuc291cmNlLnJ1YnknXG4gIGRpc2FibGVGb3JTZWxlY3RvcjogJy5zb3VyY2UucnVieSAuY29tbWVudCdcbiAgQHN1Z2dlc3Rpb25Qcmlvcml0eSA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXJ1Ynkuc3VnZ2VzdGlvblByaW9yaXR5JylcblxuICBpbmNsdXNpb25Qcmlvcml0eTogMVxuICBzdWdnZXN0aW9uUHJpb3JpdHk6IDIgaWYgQHN1Z2dlc3Rpb25Qcmlvcml0eSA9PSB0cnVlXG5cbiAgcnNlbnNlQ2xpZW50OiBudWxsXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHJzZW5zZUNsaWVudCA9IG5ldyBSc2Vuc2VDbGllbnQoKVxuICAgIEByc2Vuc2VDbGllbnQuc3RhcnRSc2Vuc2VVbml4KCkgaWYgIUlTX1dJTjMyXG4gICAgQGxhc3RTdWdnZXN0aW9ucyA9IFtdXG5cbiAgZ2V0U3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXh9KSAtPlxuICAgIEByc2Vuc2VDbGllbnQuc3RhcnRSc2Vuc2VXaW4zMigpIGlmIElTX1dJTjMyXG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUpID0+XG4gICAgICAjIHJzZW5zZSBleHBlY3RzIDEtYmFzZWQgcG9zaXRpb25zXG4gICAgICByb3cgPSBidWZmZXJQb3NpdGlvbi5yb3cgKyAxXG4gICAgICBjb2wgPSBidWZmZXJQb3NpdGlvbi5jb2x1bW4gKyAxXG4gICAgICBjb21wbGV0aW9ucyA9IEByc2Vuc2VDbGllbnQuY2hlY2tDb21wbGV0aW9uKGVkaXRvcixcbiAgICAgIGVkaXRvci5idWZmZXIsIHJvdywgY29sLCAoY29tcGxldGlvbnMpID0+XG4gICAgICAgIHN1Z2dlc3Rpb25zID0gQGZpbmRTdWdnZXN0aW9ucyhwcmVmaXgsIGNvbXBsZXRpb25zKVxuICAgICAgICBpZihzdWdnZXN0aW9ucz8ubGVuZ3RoKVxuICAgICAgICAgIEBsYXN0U3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9uc1xuXG4gICAgICAgICMgcmVxdWVzdCBjb21wbGV0aW9uIG9uIGAuYCBhbmQgYDo6YFxuICAgICAgICByZXNvbHZlKEBsYXN0U3VnZ2VzdGlvbnMpIGlmIHByZWZpeCA9PSAnLicgfHwgcHJlZml4ID09ICc6OidcblxuICAgICAgICByZXNvbHZlKEBmaWx0ZXJTdWdnZXN0aW9ucyhwcmVmaXgsIEBsYXN0U3VnZ2VzdGlvbnMpKVxuICAgICAgKVxuXG4gIGZpbmRTdWdnZXN0aW9uczogKHByZWZpeCwgY29tcGxldGlvbnMpIC0+XG4gICAgaWYgY29tcGxldGlvbnM/XG4gICAgICBzdWdnZXN0aW9ucyA9IFtdXG4gICAgICBmb3IgY29tcGxldGlvbiBpbiBjb21wbGV0aW9uc1xuICAgICAgICBraW5kID0gY29tcGxldGlvbi5raW5kLnRvTG93ZXJDYXNlKClcbiAgICAgICAga2luZCA9IFwiaW1wb3J0XCIgaWYga2luZCA9PSBcIm1vZHVsZVwiXG4gICAgICAgIHN1Z2dlc3Rpb24gPVxuICAgICAgICAgIHRleHQ6IGNvbXBsZXRpb24ubmFtZVxuICAgICAgICAgIHR5cGU6IGtpbmRcbiAgICAgICAgICBsZWZ0TGFiZWw6IGNvbXBsZXRpb24uYmFzZV9uYW1lXG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2goc3VnZ2VzdGlvbilcbiAgICAgIHN1Z2dlc3Rpb25zLnNvcnQgKHgsIHkpIC0+XG4gICAgICAgIGlmIHgudGV4dD55LnRleHRcbiAgICAgICAgICAxXG4gICAgICAgIGVsc2UgaWYgeC50ZXh0PHkudGV4dFxuICAgICAgICAgIC0xXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAwXG5cbiAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuICAgIHJldHVybiBbXVxuXG5cbiAgZmlsdGVyU3VnZ2VzdGlvbnM6IChwcmVmaXgsIHN1Z2dlc3Rpb25zKSAtPlxuICAgIHN1Z2dlc3Rpb25CdWZmZXIgPSBbXVxuXG4gICAgaWYoIXByZWZpeD8ubGVuZ3RoIHx8ICFzdWdnZXN0aW9ucz8ubGVuZ3RoKVxuICAgICAgcmV0dXJuIFtdXG5cbiAgICBleHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIitwcmVmaXgucmVnRXhwRXNjYXBlKCksIFwiaVwiKVxuXG4gICAgZm9yIHN1Z2dlc3Rpb24gaW4gc3VnZ2VzdGlvbnNcbiAgICAgIGlmIGV4cHJlc3Npb24udGVzdChzdWdnZXN0aW9uLnRleHQpXG4gICAgICAgIHN1Z2dlc3Rpb24ucmVwbGFjZW1lbnRQcmVmaXggPSBwcmVmaXhcbiAgICAgICAgc3VnZ2VzdGlvbkJ1ZmZlci5wdXNoKHN1Z2dlc3Rpb24pXG5cbiAgICByZXR1cm4gc3VnZ2VzdGlvbkJ1ZmZlclxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgcmV0dXJuIEByc2Vuc2VDbGllbnQuc3RvcFJzZW5zZSgpIGlmIElTX1dJTjMyXG4gICAgQHJzZW5zZUNsaWVudC5zdG9wUnNlbnNlVW5peCgpXG4iXX0=
