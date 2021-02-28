(function() {
  var Emitter, TodoModel, _, maxLength, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, arg) {
      var plain;
      plain = (arg != null ? arg : []).plain;
      if (plain) {
        return _.extend(this, match);
      }
      this.handleScanMatch(match);
    }

    TodoModel.prototype.getAllKeys = function() {
      return atom.config.get('todo-show.showInTable') || ['Text'];
    };

    TodoModel.prototype.get = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if ((value = this[key.toLowerCase()]) || value === '') {
        return value;
      }
      return this.text || 'No details';
    };

    TodoModel.prototype.getMarkdown = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (!(value = this[key.toLowerCase()])) {
        return '';
      }
      switch (key) {
        case 'All':
        case 'Text':
          return " " + value;
        case 'Type':
        case 'Project':
          return " __" + value + "__";
        case 'Range':
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'Path':
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
        case 'Id':
          return " _" + value + "_";
      }
    };

    TodoModel.prototype.getMarkdownArray = function(keys) {
      var i, key, len, ref, results;
      ref = keys || this.getAllKeys();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(this.getMarkdown(key));
      }
      return results;
    };

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
    };

    TodoModel.prototype.contains = function(string) {
      var i, item, key, len, ref;
      if (string == null) {
        string = '';
      }
      ref = this.getAllKeys();
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if (!(item = this.get(key))) {
          break;
        }
        if (item.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var _matchText, loc, matchText, matches, pos, project, ref, ref1, ref2, ref3, relativePath, tag;
      matchText = match.text || match.all || '';
      if (matchText.length > ((ref = match.all) != null ? ref.length : void 0)) {
        match.all = matchText;
      }
      while ((_matchText = (ref1 = match.regexp) != null ? ref1.exec(matchText) : void 0)) {
        if (!match.type) {
          match.type = _matchText[1];
        }
        matchText = _matchText.pop();
      }
      if (matchText.indexOf('(') === 0) {
        if (matches = matchText.match(/\((.*?)\):?(.*)/)) {
          matchText = matches.pop();
          match.id = matches.pop();
        }
      }
      matchText = this.stripCommentEnd(matchText);
      match.tags = ((function() {
        var results;
        results = [];
        while ((tag = /\s*#([\w.|]+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          results.push(tag.shift().trim().replace(/[\.,]\s*$/, ''));
        }
        return results;
      })()).sort().join(', ');
      if (!matchText && match.all && (pos = (ref2 = match.position) != null ? (ref3 = ref2[0]) != null ? ref3[1] : void 0 : void 0)) {
        matchText = match.all.substr(0, pos);
        matchText = this.stripCommentStart(matchText);
      }
      if (matchText.length >= maxLength) {
        matchText = (matchText.substr(0, maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      relativePath = atom.project.relativizePath(match.loc);
      if (relativePath[0] == null) {
        relativePath[0] = '';
      }
      match.path = relativePath[1] || '';
      if ((match.loc && (loc = path.basename(match.loc))) !== 'undefined') {
        match.file = loc;
      } else {
        match.file = 'untitled';
      }
      if ((project = path.basename(relativePath[0])) !== 'null') {
        match.project = project;
      } else {
        match.project = '';
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      match.regex = match.regex.replace('${TODOS}', match.type);
      match.id = match.id || '';
      return _.extend(this, match);
    };

    TodoModel.prototype.stripCommentStart = function(text) {
      var startRegex;
      if (text == null) {
        text = '';
      }
      startRegex = /(\/\*|<\?|<!--|<#|{-|\[\[|\/\/|#)\s*$/;
      return text.replace(startRegex, '').trim();
    };

    TodoModel.prototype.stripCommentEnd = function(text) {
      var endRegex;
      if (text == null) {
        text = '';
      }
      endRegex = /(\*\/}?|\?>|-->|#>|-}|\]\])\s*$/;
      return text.replace(endRegex, '').trim();
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLW1vZGVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVOLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBQ1osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFFSixTQUFBLEdBQVk7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLG1CQUFDLEtBQUQsRUFBUSxHQUFSO0FBQ1gsVUFBQTtNQURvQix1QkFBRCxNQUFVO01BQzdCLElBQWdDLEtBQWhDO0FBQUEsZUFBTyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxLQUFmLEVBQVA7O01BQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsS0FBakI7SUFGVzs7d0JBSWIsVUFBQSxHQUFZLFNBQUE7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQUEsSUFBNEMsQ0FBQyxNQUFEO0lBRGxDOzt3QkFHWixHQUFBLEdBQUssU0FBQyxHQUFEO0FBQ0gsVUFBQTs7UUFESSxNQUFNOztNQUNWLElBQWdCLENBQUMsS0FBQSxHQUFRLElBQUUsQ0FBQSxHQUFHLENBQUMsV0FBSixDQUFBLENBQUEsQ0FBWCxDQUFBLElBQWtDLEtBQUEsS0FBUyxFQUEzRDtBQUFBLGVBQU8sTUFBUDs7YUFDQSxJQUFDLENBQUEsSUFBRCxJQUFTO0lBRk47O3dCQUlMLFdBQUEsR0FBYSxTQUFDLEdBQUQ7QUFDWCxVQUFBOztRQURZLE1BQU07O01BQ2xCLElBQUEsQ0FBaUIsQ0FBQSxLQUFBLEdBQVEsSUFBRSxDQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBQSxDQUFWLENBQWpCO0FBQUEsZUFBTyxHQUFQOztBQUNBLGNBQU8sR0FBUDtBQUFBLGFBQ08sS0FE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aCdcblxue0VtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbm1heExlbmd0aCA9IDEyMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUb2RvTW9kZWxcbiAgY29uc3RydWN0b3I6IChtYXRjaCwge3BsYWlufSA9IFtdKSAtPlxuICAgIHJldHVybiBfLmV4dGVuZCh0aGlzLCBtYXRjaCkgaWYgcGxhaW5cbiAgICBAaGFuZGxlU2Nhbk1hdGNoIG1hdGNoXG5cbiAgZ2V0QWxsS2V5czogLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScpIG9yIFsnVGV4dCddXG5cbiAgZ2V0OiAoa2V5ID0gJycpIC0+XG4gICAgcmV0dXJuIHZhbHVlIGlmICh2YWx1ZSA9IEBba2V5LnRvTG93ZXJDYXNlKCldKSBvciB2YWx1ZSBpcyAnJ1xuICAgIEB0ZXh0IG9yICdObyBkZXRhaWxzJ1xuXG4gIGdldE1hcmtkb3duOiAoa2V5ID0gJycpIC0+XG4gICAgcmV0dXJuICcnIHVubGVzcyB2YWx1ZSA9IEBba2V5LnRvTG93ZXJDYXNlKCldXG4gICAgc3dpdGNoIGtleVxuICAgICAgd2hlbiAnQWxsJywgJ1RleHQnIHRoZW4gXCIgI3t2YWx1ZX1cIlxuICAgICAgd2hlbiAnVHlwZScsICdQcm9qZWN0JyB0aGVuIFwiIF9fI3t2YWx1ZX1fX1wiXG4gICAgICB3aGVuICdSYW5nZScsICdMaW5lJyB0aGVuIFwiIF86I3t2YWx1ZX1fXCJcbiAgICAgIHdoZW4gJ1JlZ2V4JyB0aGVuIFwiIF8nI3t2YWx1ZX0nX1wiXG4gICAgICB3aGVuICdQYXRoJywgJ0ZpbGUnIHRoZW4gXCIgWyN7dmFsdWV9XSgje3ZhbHVlfSlcIlxuICAgICAgd2hlbiAnVGFncycsICdJZCcgdGhlbiBcIiBfI3t2YWx1ZX1fXCJcblxuICBnZXRNYXJrZG93bkFycmF5OiAoa2V5cykgLT5cbiAgICBmb3Iga2V5IGluIGtleXMgb3IgQGdldEFsbEtleXMoKVxuICAgICAgQGdldE1hcmtkb3duKGtleSlcblxuICBrZXlJc051bWJlcjogKGtleSkgLT5cbiAgICBrZXkgaW4gWydSYW5nZScsICdMaW5lJ11cblxuICBjb250YWluczogKHN0cmluZyA9ICcnKSAtPlxuICAgIGZvciBrZXkgaW4gQGdldEFsbEtleXMoKVxuICAgICAgYnJlYWsgdW5sZXNzIGl0ZW0gPSBAZ2V0KGtleSlcbiAgICAgIHJldHVybiB0cnVlIGlmIGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHN0cmluZy50b0xvd2VyQ2FzZSgpKSBpc250IC0xXG4gICAgZmFsc2VcblxuICBoYW5kbGVTY2FuTWF0Y2g6IChtYXRjaCkgLT5cbiAgICBtYXRjaFRleHQgPSBtYXRjaC50ZXh0IG9yIG1hdGNoLmFsbCBvciAnJ1xuICAgIGlmIG1hdGNoVGV4dC5sZW5ndGggPiBtYXRjaC5hbGw/Lmxlbmd0aFxuICAgICAgbWF0Y2guYWxsID0gbWF0Y2hUZXh0XG5cbiAgICAjIFN0cmlwIG91dCB0aGUgcmVnZXggdG9rZW4gZnJvbSB0aGUgZm91bmQgYW5ub3RhdGlvblxuICAgICMgbm90IGFsbCBvYmplY3RzIHdpbGwgaGF2ZSBhbiBleGVjIG1hdGNoXG4gICAgd2hpbGUgKF9tYXRjaFRleHQgPSBtYXRjaC5yZWdleHA/LmV4ZWMobWF0Y2hUZXh0KSlcbiAgICAgICMgRmluZCBtYXRjaCB0eXBlXG4gICAgICBtYXRjaC50eXBlID0gX21hdGNoVGV4dFsxXSB1bmxlc3MgbWF0Y2gudHlwZVxuICAgICAgIyBFeHRyYWN0IHRvZG8gdGV4dFxuICAgICAgbWF0Y2hUZXh0ID0gX21hdGNoVGV4dC5wb3AoKVxuXG4gICAgIyBFeHRyYWN0IGdvb2dsZSBzdHlsZSBndWlkZSB0b2RvIGlkXG4gICAgaWYgbWF0Y2hUZXh0LmluZGV4T2YoJygnKSBpcyAwXG4gICAgICBpZiBtYXRjaGVzID0gbWF0Y2hUZXh0Lm1hdGNoKC9cXCgoLio/KVxcKTo/KC4qKS8pXG4gICAgICAgIG1hdGNoVGV4dCA9IG1hdGNoZXMucG9wKClcbiAgICAgICAgbWF0Y2guaWQgPSBtYXRjaGVzLnBvcCgpXG5cbiAgICBtYXRjaFRleHQgPSBAc3RyaXBDb21tZW50RW5kKG1hdGNoVGV4dClcblxuICAgICMgRXh0cmFjdCB0b2RvIHRhZ3NcbiAgICBtYXRjaC50YWdzID0gKHdoaWxlICh0YWcgPSAvXFxzKiMoW1xcdy58XSspWywuXT8kLy5leGVjKG1hdGNoVGV4dCkpXG4gICAgICBicmVhayBpZiB0YWcubGVuZ3RoIGlzbnQgMlxuICAgICAgbWF0Y2hUZXh0ID0gbWF0Y2hUZXh0LnNsaWNlKDAsIC10YWcuc2hpZnQoKS5sZW5ndGgpXG4gICAgICB0YWcuc2hpZnQoKS50cmltKCkucmVwbGFjZSgvW1xcLixdXFxzKiQvLCAnJylcbiAgICApLnNvcnQoKS5qb2luKCcsICcpXG5cbiAgICAjIFVzZSB0ZXh0IGJlZm9yZSB0b2RvIGlmIG5vIGNvbnRlbnQgYWZ0ZXJcbiAgICBpZiBub3QgbWF0Y2hUZXh0IGFuZCBtYXRjaC5hbGwgYW5kIHBvcyA9IG1hdGNoLnBvc2l0aW9uP1swXT9bMV1cbiAgICAgIG1hdGNoVGV4dCA9IG1hdGNoLmFsbC5zdWJzdHIoMCwgcG9zKVxuICAgICAgbWF0Y2hUZXh0ID0gQHN0cmlwQ29tbWVudFN0YXJ0KG1hdGNoVGV4dClcblxuICAgICMgVHJ1bmNhdGUgbG9uZyBtYXRjaCBzdHJpbmdzXG4gICAgaWYgbWF0Y2hUZXh0Lmxlbmd0aCA+PSBtYXhMZW5ndGhcbiAgICAgIG1hdGNoVGV4dCA9IFwiI3ttYXRjaFRleHQuc3Vic3RyKDAsIG1heExlbmd0aCAtIDMpfS4uLlwiXG5cbiAgICAjIE1ha2Ugc3VyZSByYW5nZSBpcyBzZXJpYWxpemVkIHRvIHByb2R1Y2UgY29ycmVjdCByZW5kZXJlZCBmb3JtYXRcbiAgICBtYXRjaC5wb3NpdGlvbiA9IFtbMCwwXV0gdW5sZXNzIG1hdGNoLnBvc2l0aW9uIGFuZCBtYXRjaC5wb3NpdGlvbi5sZW5ndGggPiAwXG4gICAgaWYgbWF0Y2gucG9zaXRpb24uc2VyaWFsaXplXG4gICAgICBtYXRjaC5yYW5nZSA9IG1hdGNoLnBvc2l0aW9uLnNlcmlhbGl6ZSgpLnRvU3RyaW5nKClcbiAgICBlbHNlXG4gICAgICBtYXRjaC5yYW5nZSA9IG1hdGNoLnBvc2l0aW9uLnRvU3RyaW5nKClcblxuICAgICMgRXh0cmFjdCBwYXRocyBhbmQgcHJvamVjdFxuICAgIHJlbGF0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChtYXRjaC5sb2MpXG4gICAgcmVsYXRpdmVQYXRoWzBdID89ICcnXG4gICAgbWF0Y2gucGF0aCA9IHJlbGF0aXZlUGF0aFsxXSBvciAnJ1xuXG4gICAgaWYgKG1hdGNoLmxvYyBhbmQgbG9jID0gcGF0aC5iYXNlbmFtZShtYXRjaC5sb2MpKSBpc250ICd1bmRlZmluZWQnXG4gICAgICBtYXRjaC5maWxlID0gbG9jXG4gICAgZWxzZVxuICAgICAgbWF0Y2guZmlsZSA9ICd1bnRpdGxlZCdcblxuICAgIGlmIChwcm9qZWN0ID0gcGF0aC5iYXNlbmFtZShyZWxhdGl2ZVBhdGhbMF0pKSBpc250ICdudWxsJ1xuICAgICAgbWF0Y2gucHJvamVjdCA9IHByb2plY3RcbiAgICBlbHNlXG4gICAgICBtYXRjaC5wcm9qZWN0ID0gJydcblxuICAgIG1hdGNoLnRleHQgPSBtYXRjaFRleHQgb3IgXCJObyBkZXRhaWxzXCJcbiAgICBtYXRjaC5saW5lID0gKHBhcnNlSW50KG1hdGNoLnJhbmdlLnNwbGl0KCcsJylbMF0pICsgMSkudG9TdHJpbmcoKVxuICAgIG1hdGNoLnJlZ2V4ID0gbWF0Y2gucmVnZXgucmVwbGFjZSgnJHtUT0RPU30nLCBtYXRjaC50eXBlKVxuICAgIG1hdGNoLmlkID0gbWF0Y2guaWQgb3IgJydcblxuICAgIF8uZXh0ZW5kKHRoaXMsIG1hdGNoKVxuXG4gIHN0cmlwQ29tbWVudFN0YXJ0OiAodGV4dCA9ICcnKSAtPlxuICAgIHN0YXJ0UmVnZXggPSAvKFxcL1xcKnw8XFw/fDwhLS18PCN8ey18XFxbXFxbfFxcL1xcL3wjKVxccyokL1xuICAgIHRleHQucmVwbGFjZShzdGFydFJlZ2V4LCAnJykudHJpbSgpXG5cbiAgc3RyaXBDb21tZW50RW5kOiAodGV4dCA9ICcnKSAtPlxuICAgIGVuZFJlZ2V4ID0gLyhcXCpcXC99P3xcXD8+fC0tPnwjPnwtfXxcXF1cXF0pXFxzKiQvXG4gICAgdGV4dC5yZXBsYWNlKGVuZFJlZ2V4LCAnJykudHJpbSgpXG4iXX0=
