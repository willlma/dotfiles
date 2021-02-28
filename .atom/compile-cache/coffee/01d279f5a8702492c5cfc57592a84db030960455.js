(function() {
  var CompositeDisposable, ERB_BLOCKS, ERB_CLOSER_REGEX, ERB_OPENER_REGEX, ERB_REGEX, ErbSnippets, Range;

  Range = require('atom').Range;

  CompositeDisposable = require('atom').CompositeDisposable;

  ERB_BLOCKS = [['<%=', '%>'], ['<%', '%>'], ['<%-', '-%>'], ['<%=', '-%>'], ['<%#', '%>'], ['<%', '-%>']];

  ERB_REGEX = '<%(=?|-?|#?)\s{2}(-?)%>';

  ERB_OPENER_REGEX = '<%[\\=\\-\\#]?';

  ERB_CLOSER_REGEX = "-?%>";

  module.exports = ErbSnippets = {
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'erb-snippets:erb_tags': (function(_this) {
          return function() {
            return _this.erb_tags();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    erb_tags: function() {
      var closer, current_cursor, editor, j, len, opener, ref, ref1, restore_text_range, results, selection, selection_text, selection_was_empty;
      editor = atom.workspace.getActiveTextEditor();
      ref = editor.getSelections();
      results = [];
      for (j = 0, len = ref.length; j < len; j += 1) {
        selection = ref[j];
        selection_was_empty = selection.isEmpty();
        selection_text = selection.getText();
        selection.deleteSelectedText();
        current_cursor = selection.cursor;
        ref1 = this.find_surrounding_blocks(editor, current_cursor), opener = ref1[0], closer = ref1[1];
        if ((opener != null) && (closer != null)) {
          this.replace_erb_block(editor, opener, closer, current_cursor);
        } else {
          this.insert_erb_block(editor, current_cursor);
        }
        if (!selection_was_empty) {
          restore_text_range = editor.getBuffer().insert(current_cursor.getBufferPosition(), selection_text);
          results.push(selection.setBufferRange(restore_text_range));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    find_surrounding_blocks: function(editor, current_cursor) {
      var closer, current_line, found_closers, found_openers, left_range, opener, right_range;
      opener = closer = null;
      current_line = current_cursor.getCurrentLineBufferRange();
      left_range = new Range(current_line.start, current_cursor.getBufferPosition());
      right_range = new Range(current_cursor.getBufferPosition(), current_line.end);
      found_openers = [];
      editor.getBuffer().scanInRange(new RegExp(ERB_OPENER_REGEX, 'g'), left_range, function(result) {
        return found_openers.push(result.range);
      });
      if (found_openers) {
        opener = found_openers[found_openers.length - 1];
      }
      found_closers = [];
      editor.getBuffer().scanInRange(new RegExp(ERB_CLOSER_REGEX, 'g'), right_range, function(result) {
        return found_closers.push(result.range);
      });
      if (found_closers) {
        closer = found_closers[0];
      }
      return [opener, closer];
    },
    insert_erb_block: function(editor, current_cursor) {
      var closing_tag, default_block, desired_position, opening_tag;
      default_block = ERB_BLOCKS[0];
      opening_tag = editor.getBuffer().insert(current_cursor.getBufferPosition(), default_block[0] + ' ');
      desired_position = current_cursor.getBufferPosition();
      closing_tag = editor.getBuffer().insert(current_cursor.getBufferPosition(), ' ' + default_block[1]);
      return current_cursor.setBufferPosition(desired_position);
    },
    replace_erb_block: function(editor, opener, closer, current_cursor) {
      var closing_bracket, next_block, opening_bracket;
      opening_bracket = editor.getBuffer().getTextInRange(opener);
      closing_bracket = editor.getBuffer().getTextInRange(closer);
      next_block = this.get_next_erb_block(editor, opening_bracket, closing_bracket);
      editor.getBuffer().setTextInRange(closer, next_block[1]);
      return editor.getBuffer().setTextInRange(opener, next_block[0]);
    },
    get_next_erb_block: function(editor, opening_bracket, closing_bracket) {
      var block, i, j, len;
      for (i = j = 0, len = ERB_BLOCKS.length; j < len; i = ++j) {
        block = ERB_BLOCKS[i];
        if (JSON.stringify([opening_bracket, closing_bracket]) === JSON.stringify(block)) {
          if (i + 1 >= ERB_BLOCKS.length) {
            return ERB_BLOCKS[0];
          } else {
            return ERB_BLOCKS[i + 1];
          }
        }
      }
      return ERB_BLOCKS[0];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvZXJiLXNuaXBwZXRzL2xpYi9lcmItc25pcHBldHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSOztFQUNULHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFHeEIsVUFBQSxHQUFhLENBQUMsQ0FBQyxLQUFELEVBQVEsSUFBUixDQUFELEVBQWdCLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBaEIsRUFBOEIsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUE5QixFQUE4QyxDQUFDLEtBQUQsRUFBUSxLQUFSLENBQTlDLEVBQThELENBQUMsS0FBRCxFQUFRLElBQVIsQ0FBOUQsRUFBNkUsQ0FBQyxJQUFELEVBQU8sS0FBUCxDQUE3RTs7RUFDYixTQUFBLEdBQVk7O0VBRVosZ0JBQUEsR0FBbUI7O0VBRW5CLGdCQUFBLEdBQW1COztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUFpQixXQUFBLEdBQ2Y7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFFUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO2FBR3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsdUJBQUEsRUFBeUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCO09BQXBDLENBQW5CO0lBTFEsQ0FGVjtJQVNBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFEVSxDQVRaO0lBWUEsUUFBQSxFQUFVLFNBQUE7QUFFUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtBQUdUO0FBQUE7V0FBQSx3Q0FBQTs7UUFFRSxtQkFBQSxHQUFzQixTQUFTLENBQUMsT0FBVixDQUFBO1FBRXRCLGNBQUEsR0FBaUIsU0FBUyxDQUFDLE9BQVYsQ0FBQTtRQUVqQixTQUFTLENBQUMsa0JBQVYsQ0FBQTtRQUVBLGNBQUEsR0FBaUIsU0FBUyxDQUFDO1FBRzNCLE9BQW1CLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixNQUF6QixFQUFpQyxjQUFqQyxDQUFuQixFQUFDLGdCQUFELEVBQVM7UUFDVCxJQUFHLGdCQUFBLElBQVksZ0JBQWY7VUFFRSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsTUFBbkIsRUFBMkIsTUFBM0IsRUFBbUMsTUFBbkMsRUFBMkMsY0FBM0MsRUFGRjtTQUFBLE1BQUE7VUFLRSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsTUFBbEIsRUFBMEIsY0FBMUIsRUFMRjs7UUFRQSxJQUFHLENBQUMsbUJBQUo7VUFDRSxrQkFBQSxHQUFxQixNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsTUFBbkIsQ0FBMEIsY0FBYyxDQUFDLGlCQUFmLENBQUEsQ0FBMUIsRUFBOEQsY0FBOUQ7dUJBQ3JCLFNBQVMsQ0FBQyxjQUFWLENBQXlCLGtCQUF6QixHQUZGO1NBQUEsTUFBQTsrQkFBQTs7QUFwQkY7O0lBTFEsQ0FaVjtJQXlDQSx1QkFBQSxFQUF5QixTQUFDLE1BQUQsRUFBUyxjQUFUO0FBQ3ZCLFVBQUE7TUFBQSxNQUFBLEdBQVMsTUFBQSxHQUFTO01BR2xCLFlBQUEsR0FBZSxjQUFjLENBQUMseUJBQWYsQ0FBQTtNQUdmLFVBQUEsR0FBYyxJQUFJLEtBQUosQ0FBVSxZQUFZLENBQUMsS0FBdkIsRUFBOEIsY0FBYyxDQUFDLGlCQUFmLENBQUEsQ0FBOUI7TUFDZCxXQUFBLEdBQWMsSUFBSSxLQUFKLENBQVUsY0FBYyxDQUFDLGlCQUFmLENBQUEsQ0FBVixFQUE4QyxZQUFZLENBQUMsR0FBM0Q7TUFHZCxhQUFBLEdBQWdCO01BQ2hCLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxXQUFuQixDQUErQixJQUFJLE1BQUosQ0FBVyxnQkFBWCxFQUE2QixHQUE3QixDQUEvQixFQUFrRSxVQUFsRSxFQUE4RSxTQUFDLE1BQUQ7ZUFDNUUsYUFBYSxDQUFDLElBQWQsQ0FBbUIsTUFBTSxDQUFDLEtBQTFCO01BRDRFLENBQTlFO01BR0EsSUFBa0QsYUFBbEQ7UUFBQSxNQUFBLEdBQVMsYUFBYyxDQUFBLGFBQWEsQ0FBQyxNQUFkLEdBQXFCLENBQXJCLEVBQXZCOztNQUdBLGFBQUEsR0FBZ0I7TUFDaEIsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLFdBQW5CLENBQStCLElBQUksTUFBSixDQUFXLGdCQUFYLEVBQTZCLEdBQTdCLENBQS9CLEVBQWtFLFdBQWxFLEVBQStFLFNBQUMsTUFBRDtlQUM3RSxhQUFhLENBQUMsSUFBZCxDQUFtQixNQUFNLENBQUMsS0FBMUI7TUFENkUsQ0FBL0U7TUFHQSxJQUE2QixhQUE3QjtRQUFBLE1BQUEsR0FBUyxhQUFjLENBQUEsQ0FBQSxFQUF2Qjs7QUFFQSxhQUFPLENBQUMsTUFBRCxFQUFTLE1BQVQ7SUF4QmdCLENBekN6QjtJQW1FQSxnQkFBQSxFQUFrQixTQUFDLE1BQUQsRUFBUyxjQUFUO0FBRWhCLFVBQUE7TUFBQSxhQUFBLEdBQWdCLFVBQVcsQ0FBQSxDQUFBO01BRzNCLFdBQUEsR0FBYyxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsTUFBbkIsQ0FBMEIsY0FBYyxDQUFDLGlCQUFmLENBQUEsQ0FBMUIsRUFBOEQsYUFBYyxDQUFBLENBQUEsQ0FBZCxHQUFpQixHQUEvRTtNQUVkLGdCQUFBLEdBQW1CLGNBQWMsQ0FBQyxpQkFBZixDQUFBO01BRW5CLFdBQUEsR0FBYyxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsTUFBbkIsQ0FBMEIsY0FBYyxDQUFDLGlCQUFmLENBQUEsQ0FBMUIsRUFBOEQsR0FBQSxHQUFJLGFBQWMsQ0FBQSxDQUFBLENBQWhGO2FBRWQsY0FBYyxDQUFDLGlCQUFmLENBQWtDLGdCQUFsQztJQVhnQixDQW5FbEI7SUFpRkEsaUJBQUEsRUFBbUIsU0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixFQUF5QixjQUF6QjtBQUVqQixVQUFBO01BQUEsZUFBQSxHQUFrQixNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsY0FBbkIsQ0FBa0MsTUFBbEM7TUFDbEIsZUFBQSxHQUFrQixNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsY0FBbkIsQ0FBa0MsTUFBbEM7TUFDbEIsVUFBQSxHQUFhLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixNQUFwQixFQUE0QixlQUE1QixFQUE2QyxlQUE3QztNQUdiLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxjQUFuQixDQUFrQyxNQUFsQyxFQUEwQyxVQUFXLENBQUEsQ0FBQSxDQUFyRDthQUNBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxjQUFuQixDQUFrQyxNQUFsQyxFQUEwQyxVQUFXLENBQUEsQ0FBQSxDQUFyRDtJQVJpQixDQWpGbkI7SUEyRkEsa0JBQUEsRUFBb0IsU0FBQyxNQUFELEVBQVMsZUFBVCxFQUEwQixlQUExQjtBQUNsQixVQUFBO0FBQUEsV0FBQSxvREFBQTs7UUFDRSxJQUFHLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBQyxlQUFELEVBQWtCLGVBQWxCLENBQWYsQ0FBQSxLQUFzRCxJQUFJLENBQUMsU0FBTCxDQUFlLEtBQWYsQ0FBekQ7VUFFUyxJQUFHLENBQUEsR0FBRSxDQUFGLElBQU8sVUFBVSxDQUFDLE1BQXJCO21CQUFpQyxVQUFXLENBQUEsQ0FBQSxFQUE1QztXQUFBLE1BQUE7bUJBQW9ELFVBQVcsQ0FBQSxDQUFBLEdBQUUsQ0FBRixFQUEvRDtXQUZUOztBQURGO0FBTUEsYUFBTyxVQUFXLENBQUEsQ0FBQTtJQVBBLENBM0ZwQjs7QUFaRiIsInNvdXJjZXNDb250ZW50IjpbIntSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuIyBlcmIgc3VwcG9ydGVkIGJsb2Nrc1xuRVJCX0JMT0NLUyA9IFtbJzwlPScsICclPiddLCBbJzwlJywgJyU+J10sIFsnPCUtJywgJy0lPiddLCBbJzwlPScsICctJT4nXSwgWyc8JSMnLCAnJT4nXSwgWyc8JScsICctJT4nXV1cbkVSQl9SRUdFWCA9ICc8JSg9P3wtP3wjPylcXHN7Mn0oLT8pJT4nXG4jIG1hdGNoZXMgb3BlbmluZyBicmFja2V0IHRoYXQgaXMgbm90IGZvbGxvd2VkIGJ5IHRoZSBjbG9zaW5nIG9uZVxuRVJCX09QRU5FUl9SRUdFWCA9ICc8JVtcXFxcPVxcXFwtXFxcXCNdPycgIycoPyEuKiU+KScgPC0tIGNvbW1lbnRlZCBvdXQgZm9yIHRoZSBtb21lbnQuLi5cbiMgbWF0Y2hlcyB0aGUgY2xvc2luZyBicmFja2V0LlxuRVJCX0NMT1NFUl9SRUdFWCA9IFwiLT8lPlwiXG5cbm1vZHVsZS5leHBvcnRzID0gRXJiU25pcHBldHMgPVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2VyYi1zbmlwcGV0czplcmJfdGFncyc6ID0+IEBlcmJfdGFncygpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBlcmJfdGFnczogLT5cbiAgICAjIFRoaXMgYXNzdW1lcyB0aGUgYWN0aXZlIHBhbmUgaXRlbSBpcyBhbiBlZGl0b3JcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICMgbG9vcGluZyB0aHJvdWdoIGVhY2ggc2VsZWN0aW9uXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpIGJ5IDFcbiAgICAgICMgZmxhZyBpZiBvcmlnaW5hbCBzZWxlY3Rpb24gd2FzIGVtcHR5XG4gICAgICBzZWxlY3Rpb25fd2FzX2VtcHR5ID0gc2VsZWN0aW9uLmlzRW1wdHkoKVxuICAgICAgIyBzdG9yZSB0aGUgc2VsZWN0aW9uIHRleHRcbiAgICAgIHNlbGVjdGlvbl90ZXh0ID0gc2VsZWN0aW9uLmdldFRleHQoKVxuICAgICAgIyByZW1vdmUgdGhlIHNlbGVjdGlvbiB0ZXh0IGZyb20gYnVmZmVyXG4gICAgICBzZWxlY3Rpb24uZGVsZXRlU2VsZWN0ZWRUZXh0KClcbiAgICAgICMgZ2V0IHRoZSBjdXJyZW50IGN1cnNvclxuICAgICAgY3VycmVudF9jdXJzb3IgPSBzZWxlY3Rpb24uY3Vyc29yXG5cbiAgICAgICMgc2VhcmNoaW5nIGZvciBvcGVuaW5nIGFuZCBjbG9zaW5nIGJyYWNrZXRzXG4gICAgICBbb3BlbmVyLCBjbG9zZXJdID0gQGZpbmRfc3Vycm91bmRpbmdfYmxvY2tzIGVkaXRvciwgY3VycmVudF9jdXJzb3JcbiAgICAgIGlmIG9wZW5lcj8gYW5kIGNsb3Nlcj9cbiAgICAgICAgIyBpZiBicmFja2V0cyBmb3VuZCAtIHJlcGxhY2luZyB0aGVtIHdpdGggdGhlIG5leHQgb25lcy5cbiAgICAgICAgQHJlcGxhY2VfZXJiX2Jsb2NrKGVkaXRvciwgb3BlbmVyLCBjbG9zZXIsIGN1cnJlbnRfY3Vyc29yKVxuICAgICAgZWxzZVxuICAgICAgICAgIyBpZiB0aGUgYnJhY2tldHMgd2VyZSd0IGZvdW5kIC0gaW5zZXJ0aW5nIG5ldyBvbmVzLlxuICAgICAgICBAaW5zZXJ0X2VyYl9ibG9jayhlZGl0b3IsIGN1cnJlbnRfY3Vyc29yKVxuXG4gICAgICAjIHJlc3RvcmUgc2VsZWN0aW9uIHRleHQgaWYgbmVlZGVkXG4gICAgICBpZiAhc2VsZWN0aW9uX3dhc19lbXB0eVxuICAgICAgICByZXN0b3JlX3RleHRfcmFuZ2UgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0IGN1cnJlbnRfY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCksIHNlbGVjdGlvbl90ZXh0XG4gICAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZSByZXN0b3JlX3RleHRfcmFuZ2VcblxuICBmaW5kX3N1cnJvdW5kaW5nX2Jsb2NrczogKGVkaXRvciwgY3VycmVudF9jdXJzb3IpIC0+XG4gICAgb3BlbmVyID0gY2xvc2VyID0gbnVsbFxuXG4gICAgIyBncmFiYmluZyB0aGUgd2hvbGUgbGluZVxuICAgIGN1cnJlbnRfbGluZSA9IGN1cnJlbnRfY3Vyc29yLmdldEN1cnJlbnRMaW5lQnVmZmVyUmFuZ2UoKVxuXG4gICAgIyBvbmUgcmVnaW9uIHRvIHRoZSBsZWZ0IG9mIHRoZSBjdXJzb3IgYW5kIG9uZSB0byB0aGUgcmlnaHRcbiAgICBsZWZ0X3JhbmdlICA9IG5ldyBSYW5nZSBjdXJyZW50X2xpbmUuc3RhcnQsIGN1cnJlbnRfY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICByaWdodF9yYW5nZSA9IG5ldyBSYW5nZSBjdXJyZW50X2N1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLCBjdXJyZW50X2xpbmUuZW5kXG5cbiAgICAjIHNlYXJjaGluZyBpbiB0aGUgbGVmdCByYW5nZSBmb3IgYW4gb3BlbmluZyBicmFja2V0XG4gICAgZm91bmRfb3BlbmVycyA9IFtdXG4gICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNjYW5JblJhbmdlIG5ldyBSZWdFeHAoRVJCX09QRU5FUl9SRUdFWCwgJ2cnKSwgbGVmdF9yYW5nZSwgKHJlc3VsdCkgLT5cbiAgICAgIGZvdW5kX29wZW5lcnMucHVzaCByZXN1bHQucmFuZ2VcbiAgICAjIGlmIGZvdW5kLCBzZXR0aW5nIGEgcmFuZ2UgZm9yIGl0LCB1c2luZyB0aGUgbGFzdCBtYXRjaCAtIHRoZSByaWdodG1vc3QgYnJhY2tldCBmb3VuZFxuICAgIG9wZW5lciA9IGZvdW5kX29wZW5lcnNbZm91bmRfb3BlbmVycy5sZW5ndGgtMV0gaWYgZm91bmRfb3BlbmVyc1xuXG4gICAgIyBzZWFyY2hpbmcgaW4gdGhlIHJpZ2h0IHJhbmdlIGZvciBhbiBvcGVuaW5nIGJyYWNrZXRcbiAgICBmb3VuZF9jbG9zZXJzID0gW11cbiAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2NhbkluUmFuZ2UgbmV3IFJlZ0V4cChFUkJfQ0xPU0VSX1JFR0VYLCAnZycpLCByaWdodF9yYW5nZSwgKHJlc3VsdCkgLT5cbiAgICAgIGZvdW5kX2Nsb3NlcnMucHVzaCByZXN1bHQucmFuZ2VcbiAgICAjIGlmIGZvdW5kLCBzZXR0aW5nIGEgbmV3IHJhbmdlLCB1c2luZyB0aGUgZmlyc3QgbWF0Y2ggLSB0aGUgbGVmdG1vc3QgYnJhY2tldCBmb3VuZFxuICAgIGNsb3NlciA9IGZvdW5kX2Nsb3NlcnNbMF0gaWYgZm91bmRfY2xvc2Vyc1xuXG4gICAgcmV0dXJuIFtvcGVuZXIsIGNsb3Nlcl1cblxuICBpbnNlcnRfZXJiX2Jsb2NrOiAoZWRpdG9yLCBjdXJyZW50X2N1cnNvcikgLT5cbiAgICAjIGluc2VydGluZyB0aGUgZmlyc3QgYmxvY2sgaW4gdGhlIGxpc3RcbiAgICBkZWZhdWx0X2Jsb2NrID0gRVJCX0JMT0NLU1swXVxuXG4gICAgIyBpbnNlcnRpbmcgb3BlbmluZyBicmFja2V0XG4gICAgb3BlbmluZ190YWcgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0IGN1cnJlbnRfY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCksIGRlZmF1bHRfYmxvY2tbMF0rJyAnXG4gICAgIyBzdG9yaW5nIHBvc2l0aW9uIGJldHdlZW4gYnJhY2tldHNcbiAgICBkZXNpcmVkX3Bvc2l0aW9uID0gY3VycmVudF9jdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICMgaW5zZXJ0aW5nIGNsb3NpbmcgYnJhY2tldFxuICAgIGNsb3NpbmdfdGFnID0gZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydCBjdXJyZW50X2N1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLCAnICcrZGVmYXVsdF9ibG9ja1sxXVxuICAgICMgc2V0dGluZyBkZXNpcmVkIGN1cnNvciBwb3NpdGlvblxuICAgIGN1cnJlbnRfY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKCBkZXNpcmVkX3Bvc2l0aW9uIClcblxuXG4gIHJlcGxhY2VfZXJiX2Jsb2NrOiAoZWRpdG9yLCBvcGVuZXIsIGNsb3NlciwgY3VycmVudF9jdXJzb3IpIC0+XG4gICAgIyBnZXR0aW5nIHRoZSBuZXh0IGJsb2NrIGluIHRoZSBsaXN0XG4gICAgb3BlbmluZ19icmFja2V0ID0gZWRpdG9yLmdldEJ1ZmZlcigpLmdldFRleHRJblJhbmdlKG9wZW5lcilcbiAgICBjbG9zaW5nX2JyYWNrZXQgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0VGV4dEluUmFuZ2UoY2xvc2VyKVxuICAgIG5leHRfYmxvY2sgPSBAZ2V0X25leHRfZXJiX2Jsb2NrIGVkaXRvciwgb3BlbmluZ19icmFja2V0LCBjbG9zaW5nX2JyYWNrZXRcblxuICAgICMgcmVwbGFjaW5nIGluIHJldmVyc2Ugb3JkZXIgYmVjYXVzZSBsaW5lIGxlbmd0aCBtaWdodCBjaGFuZ2VcbiAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dEluUmFuZ2UoY2xvc2VyLCBuZXh0X2Jsb2NrWzFdKVxuICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zZXRUZXh0SW5SYW5nZShvcGVuZXIsIG5leHRfYmxvY2tbMF0pXG5cbiAgZ2V0X25leHRfZXJiX2Jsb2NrOiAoZWRpdG9yLCBvcGVuaW5nX2JyYWNrZXQsIGNsb3NpbmdfYnJhY2tldCkgLT5cbiAgICBmb3IgYmxvY2ssIGkgaW4gRVJCX0JMT0NLU1xuICAgICAgaWYgSlNPTi5zdHJpbmdpZnkoW29wZW5pbmdfYnJhY2tldCwgY2xvc2luZ19icmFja2V0XSkgPT0gSlNPTi5zdHJpbmdpZnkoYmxvY2spXG4gICAgICAgICMgaWYgb3V0c2lkZSBvZiBzY29wZSAtIHJldHVybmluZyB0aGUgZmlyc3QgYmxvY2tcbiAgICAgICAgcmV0dXJuIGlmIGkrMSA+PSBFUkJfQkxPQ0tTLmxlbmd0aCB0aGVuIEVSQl9CTE9DS1NbMF0gZWxzZSBFUkJfQkxPQ0tTW2krMV1cblxuICAgICMgaW4gY2FzZSB3ZSBoYXZlbid0IGZvdW5kIHRoZSBibG9jayBpbiB0aGUgbGlzdCwgcmV0dXJuaW5nIHRoZSBmaXJzdCBvbmVcbiAgICByZXR1cm4gRVJCX0JMT0NLU1swXVxuIl19
