(function() {
  var CompositeDisposable, HighlightedAreaView;

  CompositeDisposable = require("atom").CompositeDisposable;

  HighlightedAreaView = require('./highlighted-area-view');

  module.exports = {
    config: {
      onlyHighlightWholeWords: {
        type: 'boolean',
        "default": true
      },
      hideHighlightOnSelectedWord: {
        type: 'boolean',
        "default": false
      },
      ignoreCase: {
        type: 'boolean',
        "default": false
      },
      lightTheme: {
        type: 'boolean',
        "default": false
      },
      highlightBackground: {
        type: 'boolean',
        "default": false
      },
      minimumLength: {
        type: 'integer',
        "default": 2
      },
      maximumHighlights: {
        type: 'integer',
        "default": 500,
        description: 'For performance purposes, the number of highlights is limited'
      },
      timeout: {
        type: 'integer',
        "default": 20,
        description: 'Defers searching for matching strings for X ms'
      },
      showInStatusBar: {
        type: 'boolean',
        "default": true,
        description: 'Show how many matches there are'
      },
      highlightInPanes: {
        type: 'boolean',
        "default": true,
        description: 'Highlight selection in another panes'
      },
      statusBarString: {
        type: 'string',
        "default": 'Highlighted: %c',
        description: 'The text to show in the status bar. %c = number of occurrences'
      },
      allowedCharactersToSelect: {
        type: 'string',
        "default": '$@%-',
        description: 'Non Word Characters that are allowed to be selected'
      },
      showResultsOnScrollBar: {
        type: 'boolean',
        "default": false,
        description: 'Show highlight on the scroll bar'
      }
    },
    areaView: null,
    activate: function(state) {
      this.areaView = new HighlightedAreaView();
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-selected:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'highlight-selected:select-all': (function(_this) {
          return function() {
            return _this.selectAll();
          };
        })(this)
      }));
    },
    deactivate: function() {
      var ref, ref1;
      if ((ref = this.areaView) != null) {
        ref.destroy();
      }
      this.areaView = null;
      if ((ref1 = this.subscriptions) != null) {
        ref1.dispose();
      }
      return this.subscriptions = null;
    },
    provideHighlightSelectedV1Deprecated: function() {
      return this.areaView;
    },
    provideHighlightSelectedV2: function() {
      return this.areaView;
    },
    consumeStatusBar: function(statusBar) {
      return this.areaView.setStatusBar(statusBar);
    },
    toggle: function() {
      if (this.areaView.disabled) {
        return this.areaView.enable();
      } else {
        return this.areaView.disable();
      }
    },
    selectAll: function() {
      return this.areaView.selectAll();
    },
    consumeScrollMarker: function(scrollMarkerAPI) {
      return this.areaView.setScrollMarker(scrollMarkerAPI);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9oaWdobGlnaHQtc2VsZWN0ZWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUjs7RUFFdEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLHVCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQURGO01BR0EsMkJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BSkY7TUFNQSxVQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQVBGO01BU0EsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FWRjtNQVlBLG1CQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQWJGO01BZUEsYUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBRFQ7T0FoQkY7TUFrQkEsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxHQURUO1FBRUEsV0FBQSxFQUFhLCtEQUZiO09BbkJGO01Bc0JBLE9BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLGdEQUZiO09BdkJGO01BMEJBLGVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLGlDQUZiO09BM0JGO01BOEJBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxzQ0FGYjtPQS9CRjtNQWtDQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBRFQ7UUFFQSxXQUFBLEVBQWEsZ0VBRmI7T0FuQ0Y7TUFzQ0EseUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQURUO1FBRUEsV0FBQSxFQUFhLHFEQUZiO09BdkNGO01BMENBLHNCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxrQ0FGYjtPQTNDRjtLQURGO0lBZ0RBLFFBQUEsRUFBVSxJQWhEVjtJQWtEQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLG1CQUFKLENBQUE7TUFDWixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO2FBRXJCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2Y7UUFBQSwyQkFBQSxFQUE2QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0I7UUFDQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEakM7T0FEZSxDQUFuQjtJQUpRLENBbERWO0lBMERBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTs7V0FBUyxDQUFFLE9BQVgsQ0FBQTs7TUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZOztZQUNFLENBQUUsT0FBaEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUpQLENBMURaO0lBZ0VBLG9DQUFBLEVBQXNDLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQWhFdEM7SUFrRUEsMEJBQUEsRUFBNEIsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBbEU1QjtJQW9FQSxnQkFBQSxFQUFrQixTQUFDLFNBQUQ7YUFDaEIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxZQUFWLENBQXVCLFNBQXZCO0lBRGdCLENBcEVsQjtJQXVFQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFiO2VBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxFQUhGOztJQURNLENBdkVSO0lBNkVBLFNBQUEsRUFBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQUE7SUFEUyxDQTdFWDtJQWdGQSxtQkFBQSxFQUFxQixTQUFDLGVBQUQ7YUFDbkIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxlQUFWLENBQTBCLGVBQTFCO0lBRG1CLENBaEZyQjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcbkhpZ2hsaWdodGVkQXJlYVZpZXcgPSByZXF1aXJlICcuL2hpZ2hsaWdodGVkLWFyZWEtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgb25seUhpZ2hsaWdodFdob2xlV29yZHM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBoaWRlSGlnaGxpZ2h0T25TZWxlY3RlZFdvcmQ6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgaWdub3JlQ2FzZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBsaWdodFRoZW1lOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGhpZ2hsaWdodEJhY2tncm91bmQ6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgbWluaW11bUxlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMlxuICAgIG1heGltdW1IaWdobGlnaHRzOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiA1MDBcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yIHBlcmZvcm1hbmNlIHB1cnBvc2VzLCB0aGUgbnVtYmVyIG9mIGhpZ2hsaWdodHMgaXMgbGltaXRlZCdcbiAgICB0aW1lb3V0OlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAyMFxuICAgICAgZGVzY3JpcHRpb246ICdEZWZlcnMgc2VhcmNoaW5nIGZvciBtYXRjaGluZyBzdHJpbmdzIGZvciBYIG1zJ1xuICAgIHNob3dJblN0YXR1c0JhcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgZGVzY3JpcHRpb246ICdTaG93IGhvdyBtYW55IG1hdGNoZXMgdGhlcmUgYXJlJ1xuICAgIGhpZ2hsaWdodEluUGFuZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiAnSGlnaGxpZ2h0IHNlbGVjdGlvbiBpbiBhbm90aGVyIHBhbmVzJ1xuICAgIHN0YXR1c0JhclN0cmluZzpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnSGlnaGxpZ2h0ZWQ6ICVjJ1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdGV4dCB0byBzaG93IGluIHRoZSBzdGF0dXMgYmFyLiAlYyA9IG51bWJlciBvZiBvY2N1cnJlbmNlcydcbiAgICBhbGxvd2VkQ2hhcmFjdGVyc1RvU2VsZWN0OlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICckQCUtJ1xuICAgICAgZGVzY3JpcHRpb246ICdOb24gV29yZCBDaGFyYWN0ZXJzIHRoYXQgYXJlIGFsbG93ZWQgdG8gYmUgc2VsZWN0ZWQnXG4gICAgc2hvd1Jlc3VsdHNPblNjcm9sbEJhcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvdyBoaWdobGlnaHQgb24gdGhlIHNjcm9sbCBiYXInXG5cbiAgYXJlYVZpZXc6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBhcmVhVmlldyA9IG5ldyBIaWdobGlnaHRlZEFyZWFWaWV3KClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkOnRvZ2dsZSc6ID0+IEB0b2dnbGUoKVxuICAgICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkOnNlbGVjdC1hbGwnOiA9PiBAc2VsZWN0QWxsKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBhcmVhVmlldz8uZGVzdHJveSgpXG4gICAgQGFyZWFWaWV3ID0gbnVsbFxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcblxuICBwcm92aWRlSGlnaGxpZ2h0U2VsZWN0ZWRWMURlcHJlY2F0ZWQ6IC0+IEBhcmVhVmlld1xuXG4gIHByb3ZpZGVIaWdobGlnaHRTZWxlY3RlZFYyOiAtPiBAYXJlYVZpZXdcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIEBhcmVhVmlldy5zZXRTdGF0dXNCYXIgc3RhdHVzQmFyXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBhcmVhVmlldy5kaXNhYmxlZFxuICAgICAgQGFyZWFWaWV3LmVuYWJsZSgpXG4gICAgZWxzZVxuICAgICAgQGFyZWFWaWV3LmRpc2FibGUoKVxuXG4gIHNlbGVjdEFsbDogLT5cbiAgICBAYXJlYVZpZXcuc2VsZWN0QWxsKClcblxuICBjb25zdW1lU2Nyb2xsTWFya2VyOiAoc2Nyb2xsTWFya2VyQVBJKSAtPlxuICAgIEBhcmVhVmlldy5zZXRTY3JvbGxNYXJrZXIgc2Nyb2xsTWFya2VyQVBJXG4iXX0=
