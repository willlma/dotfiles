(function() {
  atom.workspace.observeTextEditors(function(editor) {
    var original;
    original = editor.getGrammar();
    if ((original != null) && original === atom.grammars.grammarForScopeName('text.plain.null-grammar')) {
      return editor.setGrammar(atom.grammars.grammarForScopeName('source.shell'));
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBWUE7RUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRDtBQUNoQyxRQUFBO0lBQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxVQUFQLENBQUE7SUFDWCxJQUFHLGtCQUFBLElBQWMsUUFBQSxLQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MseUJBQWxDLENBQTdCO2FBQ0UsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxjQUFsQyxDQUFsQixFQURGOztFQUZnQyxDQUFsQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyBZb3VyIGluaXQgc2NyaXB0XG4jXG4jIEF0b20gd2lsbCBldmFsdWF0ZSB0aGlzIGZpbGUgZWFjaCB0aW1lIGEgbmV3IHdpbmRvdyBpcyBvcGVuZWQuIEl0IGlzIHJ1blxuIyBhZnRlciBwYWNrYWdlcyBhcmUgbG9hZGVkL2FjdGl2YXRlZCBhbmQgYWZ0ZXIgdGhlIHByZXZpb3VzIGVkaXRvciBzdGF0ZVxuIyBoYXMgYmVlbiByZXN0b3JlZC5cbiNcbiMgQW4gZXhhbXBsZSBoYWNrIHRvIGxvZyB0byB0aGUgY29uc29sZSB3aGVuIGVhY2ggdGV4dCBlZGl0b3IgaXMgc2F2ZWQuXG4jXG4jIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuIyAgIGVkaXRvci5vbkRpZFNhdmUgLT5cbiMgICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQhICN7ZWRpdG9yLmdldFBhdGgoKX1cIlxuXG5hdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgLT5cbiAgb3JpZ2luYWwgPSBlZGl0b3IuZ2V0R3JhbW1hcigpXG4gIGlmIG9yaWdpbmFsPyBhbmQgb3JpZ2luYWwgaXMgYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCd0ZXh0LnBsYWluLm51bGwtZ3JhbW1hcicpXG4gICAgZWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCdzb3VyY2Uuc2hlbGwnKSlcbiJdfQ==
