(function() {
  var CSON, filter;

  CSON = require('season');

  filter = require('fuzzaldrin').filter;

  module.exports = {
    selector: '.text.html.basic, .source.gfm',
    getSuggestions: function(arg) {
      var bufferPosition, editor, prefix;
      editor = arg.editor, bufferPosition = arg.bufferPosition;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!(prefix.length > 0)) {
        return [];
      }
      return new Promise((function(_this) {
        return function(resolve) {
          return resolve(_this.buildSuggestions(prefix));
        };
      })(this));
    },
    loadCompletions: function() {
      var path;
      this.completions = [];
      path = CSON.resolve(__dirname + "/../data/completions");
      return CSON.readFile(path, (function(_this) {
        return function(error, object) {
          var completions, description, entity;
          if (error != null) {
            return;
          }
          completions = object.completions;
          return _this.completions = (function() {
            var results;
            results = [];
            for (description in completions) {
              entity = completions[description];
              results.push({
                text: entity,
                rightLabelHTML: entity,
                description: description,
                type: 'constant'
              });
            }
            return results;
          })();
        };
      })(this));
    },
    buildSuggestions: function(prefix) {
      var completion, i, len, ref, suggestions;
      suggestions = [];
      ref = this.completions;
      for (i = 0, len = ref.length; i < len; i++) {
        completion = ref[i];
        completion.replacementPrefix = prefix;
        suggestions.push(completion);
      }
      return filter(suggestions, prefix, {
        key: 'text'
      });
    },
    getPrefix: function(editor, bufferPosition) {
      var line, ref;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((ref = line.match(/&[A-Za-z0-9]+$/)) != null ? ref[0] : void 0) || '';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWh0bWwtZW50aXRpZXMvbGliL3Byb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFNBQVUsT0FBQSxDQUFRLFlBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSwrQkFBVjtJQWFBLGNBQUEsRUFBZ0IsU0FBQyxHQUFEO0FBQ2QsVUFBQTtNQURnQixxQkFBUTtNQUN4QixNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQW1CLGNBQW5CO01BQ1QsSUFBQSxDQUFBLENBQWlCLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQWpDLENBQUE7QUFBQSxlQUFPLEdBQVA7O2FBRUEsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQ1YsT0FBQSxDQUFRLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQixNQUFsQixDQUFSO1FBRFU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUFKYyxDQWJoQjtJQXFCQSxlQUFBLEVBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFnQixTQUFELEdBQVcsc0JBQTFCO2FBQ1AsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsTUFBUjtBQUNsQixjQUFBO1VBQUEsSUFBVSxhQUFWO0FBQUEsbUJBQUE7O1VBRUMsY0FBZTtpQkFDaEIsS0FBQyxDQUFBLFdBQUQ7O0FBQWU7aUJBQUEsMEJBQUE7OzJCQUNiO2dCQUNFLElBQUEsRUFBTSxNQURSO2dCQUVFLGNBQUEsRUFBZ0IsTUFGbEI7Z0JBR0UsV0FBQSxFQUFhLFdBSGY7Z0JBSUUsSUFBQSxFQUFNLFVBSlI7O0FBRGE7OztRQUpHO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtJQUhlLENBckJqQjtJQTJDQSxnQkFBQSxFQUFrQixTQUFDLE1BQUQ7QUFDaEIsVUFBQTtNQUFBLFdBQUEsR0FBYztBQUNkO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxVQUFVLENBQUMsaUJBQVgsR0FBK0I7UUFDL0IsV0FBVyxDQUFDLElBQVosQ0FBaUIsVUFBakI7QUFGRjthQUlBLE1BQUEsQ0FBTyxXQUFQLEVBQW9CLE1BQXBCLEVBQTRCO1FBQUEsR0FBQSxFQUFLLE1BQUw7T0FBNUI7SUFOZ0IsQ0EzQ2xCO0lBeURBLFNBQUEsRUFBVyxTQUFDLE1BQUQsRUFBUyxjQUFUO0FBQ1QsVUFBQTtNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsY0FBMUIsQ0FBdEI7Z0VBRXVCLENBQUEsQ0FBQSxXQUE5QixJQUFvQztJQUgzQixDQXpEWDs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIkNTT04gPSByZXF1aXJlICdzZWFzb24nXG57ZmlsdGVyfSA9IHJlcXVpcmUgJ2Z1enphbGRyaW4nXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc2VsZWN0b3I6ICcudGV4dC5odG1sLmJhc2ljLCAuc291cmNlLmdmbSdcblxuICAjIFB1YmxpYzogR2V0cyB0aGUgY3VycmVudCBzZXQgb2Ygc3VnZ2VzdGlvbnMuXG4gICNcbiAgIyAqIGByZXF1ZXN0YCBSZWxldmFudCBlZGl0b3Igc3RhdGUgdG8gaW5mb3JtIHRoZSBsaXN0IG9mIHN1Z2dlc3Rpb25zIHJldHVybmVkLiBJdCBjb25zaXN0cyBvZjpcbiAgIyAgICogYGVkaXRvcmAge1RleHRFZGl0b3J9IHRoZSBzdWdnZXN0aW9ucyBhcmUgYmVpbmcgcmVxdWVzdGVkIGZvci5cbiAgIyAgICogYGJ1ZmZlclBvc2l0aW9uYCBQb3NpdGlvbiB7UG9pbnR9IG9mIHRoZSBjdXJzb3IgaW4gdGhlIGZpbGUuXG4gICMgICAqIGBzY29wZURlc2NyaXB0b3JgIFRoZSBbc2NvcGUgZGVzY3JpcHRvcl0oaHR0cHM6Ly9hdG9tLmlvL2RvY3MvbGF0ZXN0L2JlaGluZC1hdG9tLXNjb3BlZC1zZXR0aW5ncy1zY29wZXMtYW5kLXNjb3BlLWRlc2NyaXB0b3JzI3Njb3BlLWRlc2NyaXB0b3JzKVxuICAjICAgICBmb3IgdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uLlxuICAjICAgKiBgcHJlZml4YCBQcmVmaXggdGhhdCB0cmlnZ2VyZWQgdGhlIHJlcXVlc3QgZm9yIHN1Z2dlc3Rpb25zLlxuICAjXG4gICMgUmV0dXJucyBhIHtQcm9taXNlfSB0aGF0IHJlc29sdmVzIHRvIHRoZSBsaXN0IG9mIHN1Z2dlc3Rpb25zIG9yIHJldHVybnMgYW4gZW1wdHkgbGlzdFxuICAjIGltbWVkaWF0ZWx5LlxuICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9ufSkgLT5cbiAgICBwcmVmaXggPSBAZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgcmV0dXJuIFtdIHVubGVzcyBwcmVmaXgubGVuZ3RoID4gMFxuXG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUpID0+XG4gICAgICByZXNvbHZlKEBidWlsZFN1Z2dlc3Rpb25zKHByZWZpeCkpXG5cbiAgIyBQdWJsaWM6IExvYWRzIHRoZSBmdWxsIHNldCBvZiBjb21wbGV0aW9ucy5cbiAgbG9hZENvbXBsZXRpb25zOiAtPlxuICAgIEBjb21wbGV0aW9ucyA9IFtdXG4gICAgcGF0aCA9IENTT04ucmVzb2x2ZShcIiN7X19kaXJuYW1lfS8uLi9kYXRhL2NvbXBsZXRpb25zXCIpXG4gICAgQ1NPTi5yZWFkRmlsZSBwYXRoLCAoZXJyb3IsIG9iamVjdCkgPT5cbiAgICAgIHJldHVybiBpZiBlcnJvcj9cblxuICAgICAge2NvbXBsZXRpb25zfSA9IG9iamVjdFxuICAgICAgQGNvbXBsZXRpb25zID0gZm9yIGRlc2NyaXB0aW9uLCBlbnRpdHkgb2YgY29tcGxldGlvbnNcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IGVudGl0eVxuICAgICAgICAgIHJpZ2h0TGFiZWxIVE1MOiBlbnRpdHlcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25cbiAgICAgICAgICB0eXBlOiAnY29uc3RhbnQnXG4gICAgICAgIH1cblxuICAjIFByaXZhdGU6IEJ1aWxkcyB0aGUgbGlzdCBvZiBzdWdnZXN0aW9ucyBmcm9tIHRoZSBjdXJyZW50IHNldCBvZiBjb21wbGV0aW9ucyBhbmQgdGhlIGBwcmVmaXhgLlxuICAjXG4gICMgT25jZSB0aGUgbGlzdCBvZiBzdWdnZXN0aW9ucyBpcyBidWlsdCwgaXQgaXMgcmFua2VkIGFuZCBmaWx0ZXJlZCB1c2luZyB0aGUgZnV6emFsZHJpbiBsaWJyYXJ5LlxuICAjXG4gICMgKiBgcHJlZml4YCB7U3RyaW5nfSBjb250YWluaW5nIHRoZSB0ZXh0IHRvIG1hdGNoIGFuZCByZXBsYWNlLlxuICAjXG4gICMgUmV0dXJucyBhIGxpc3Qgb2YgYXBwbGljYWJsZSBzdWdnZXN0aW9ucy5cbiAgYnVpbGRTdWdnZXN0aW9uczogKHByZWZpeCkgLT5cbiAgICBzdWdnZXN0aW9ucyA9IFtdXG4gICAgZm9yIGNvbXBsZXRpb24gaW4gQGNvbXBsZXRpb25zXG4gICAgICBjb21wbGV0aW9uLnJlcGxhY2VtZW50UHJlZml4ID0gcHJlZml4XG4gICAgICBzdWdnZXN0aW9ucy5wdXNoKGNvbXBsZXRpb24pXG5cbiAgICBmaWx0ZXIoc3VnZ2VzdGlvbnMsIHByZWZpeCwga2V5OiAndGV4dCcpXG5cbiAgIyBQcml2YXRlOiBHZXRzIHRoZSBhcHByb3ByaWF0ZSBwcmVmaXggdGV4dCB0byBzZWFyY2ggZm9yLlxuICAjXG4gICMgKiBgZWRpdG9yYCB7VGV4dEVkaXRvcn0gd2hlcmUgdGhlIGF1dG9jb21wbGV0aW9uIHdhcyByZXF1ZXN0ZWQuXG4gICMgKiBgYnVmZmVyUG9zaXRpb25gIEEge1BvaW50fSBvciBwb2ludC1jb21wYXRpYmxlIHtBcnJheX0gaW5kaWNhdGluZyB3aGVyZSB0aGUgY3Vyc29yIGlzIGxvY2F0ZWQuXG4gICNcbiAgIyBSZXR1cm5zIGEge1N0cmluZ30gY29udGFpbmluZyB0aGUgcHJlZml4IHRleHQuXG4gIGdldFByZWZpeDogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcblxuICAgIGxpbmUubWF0Y2goLyZbQS1aYS16MC05XSskLyk/WzBdIG9yICcnXG4iXX0=
