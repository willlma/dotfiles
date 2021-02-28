(function() {
  var IndentGuideImprovedElement, Point, createElementsForGuides, realLength, styleGuide;

  Point = require('atom').Point;

  styleGuide = function(element, point, length, stack, active, editor, basePixelPos, lineHeightPixel, baseScreenRow, scrollTop, scrollLeft) {
    var indentSize, left, row, top;
    element.classList.add('indent-guide-improved');
    element.classList[stack ? 'add' : 'remove']('indent-guide-stack');
    element.classList[active ? 'add' : 'remove']('indent-guide-active');
    if (editor.isFoldedAtBufferRow(Math.max(point.row - 1, 0))) {
      element.style.height = '0px';
      return;
    }
    row = editor.screenRowForBufferRow(point.row);
    indentSize = editor.getTabLength();
    left = point.column * indentSize * editor.getDefaultCharWidth() - scrollLeft;
    top = basePixelPos + lineHeightPixel * (row - baseScreenRow) - scrollTop;
    element.style.left = left + "px";
    element.style.top = top + "px";
    element.style.height = (editor.getLineHeightInPixels() * realLength(point.row, length, editor)) + "px";
    element.style.display = 'block';
    return element.style['z-index'] = 1;
  };

  realLength = function(row, length, editor) {
    var row1, row2;
    row1 = editor.screenRowForBufferRow(row);
    row2 = editor.screenRowForBufferRow(row + length);
    return row2 - row1;
  };

  IndentGuideImprovedElement = document.registerElement('indent-guide-improved');

  createElementsForGuides = function(editorElement, fns) {
    var count, createNum, existNum, itemParent, items, j, k, neededNum, recycleNum, results, results1;
    itemParent = editorElement.querySelector('.scroll-view');
    items = itemParent.querySelectorAll('.indent-guide-improved');
    existNum = items.length;
    neededNum = fns.length;
    createNum = Math.max(neededNum - existNum, 0);
    recycleNum = Math.min(neededNum, existNum);
    count = 0;
    (function() {
      results = [];
      for (var j = 0; 0 <= existNum ? j < existNum : j > existNum; 0 <= existNum ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).forEach(function(i) {
      var node;
      node = items.item(i);
      if (i < recycleNum) {
        return fns[count++](node);
      } else {
        return node.parentNode.removeChild(node);
      }
    });
    (function() {
      results1 = [];
      for (var k = 0; 0 <= createNum ? k < createNum : k > createNum; 0 <= createNum ? k++ : k--){ results1.push(k); }
      return results1;
    }).apply(this).forEach(function(i) {
      var newNode;
      newNode = new IndentGuideImprovedElement();
      newNode.classList.add('overlayer');
      fns[count++](newNode);
      return itemParent.appendChild(newNode);
    });
    if (count !== neededNum) {
      throw 'System Error';
    }
  };

  module.exports = {
    createElementsForGuides: createElementsForGuides,
    styleGuide: styleGuide
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvaW5kZW50LWd1aWRlLWltcHJvdmVkL2xpYi9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQtZWxlbWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBRVYsVUFBQSxHQUFhLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUIsS0FBekIsRUFBZ0MsTUFBaEMsRUFBd0MsTUFBeEMsRUFBZ0QsWUFBaEQsRUFBOEQsZUFBOUQsRUFBK0UsYUFBL0UsRUFBOEYsU0FBOUYsRUFBeUcsVUFBekc7QUFDWCxRQUFBO0lBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQix1QkFBdEI7SUFDQSxPQUFPLENBQUMsU0FBVSxDQUFHLEtBQUgsR0FBYyxLQUFkLEdBQXlCLFFBQXpCLENBQWxCLENBQXFELG9CQUFyRDtJQUNBLE9BQU8sQ0FBQyxTQUFVLENBQUcsTUFBSCxHQUFlLEtBQWYsR0FBMEIsUUFBMUIsQ0FBbEIsQ0FBc0QscUJBQXREO0lBRUEsSUFBRyxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFLLENBQUMsR0FBTixHQUFZLENBQXJCLEVBQXdCLENBQXhCLENBQTNCLENBQUg7TUFDRSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQWQsR0FBdUI7QUFDdkIsYUFGRjs7SUFJQSxHQUFBLEdBQU0sTUFBTSxDQUFDLHFCQUFQLENBQTZCLEtBQUssQ0FBQyxHQUFuQztJQUNOLFVBQUEsR0FBYSxNQUFNLENBQUMsWUFBUCxDQUFBO0lBQ2IsSUFBQSxHQUFPLEtBQUssQ0FBQyxNQUFOLEdBQWUsVUFBZixHQUE0QixNQUFNLENBQUMsbUJBQVAsQ0FBQSxDQUE1QixHQUEyRDtJQUNsRSxHQUFBLEdBQU0sWUFBQSxHQUFlLGVBQUEsR0FBa0IsQ0FBQyxHQUFBLEdBQU0sYUFBUCxDQUFqQyxHQUF5RDtJQUUvRCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQWQsR0FBd0IsSUFBRCxHQUFNO0lBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZCxHQUF1QixHQUFELEdBQUs7SUFDM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFkLEdBQ0ksQ0FBQyxNQUFNLENBQUMscUJBQVAsQ0FBQSxDQUFBLEdBQWlDLFVBQUEsQ0FBVyxLQUFLLENBQUMsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsTUFBOUIsQ0FBbEMsQ0FBQSxHQUF3RTtJQUM1RSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQWQsR0FBd0I7V0FDeEIsT0FBTyxDQUFDLEtBQU0sQ0FBQSxTQUFBLENBQWQsR0FBMkI7RUFuQmhCOztFQXFCYixVQUFBLEdBQWEsU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLE1BQWQ7QUFDWCxRQUFBO0lBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxxQkFBUCxDQUE2QixHQUE3QjtJQUNQLElBQUEsR0FBTyxNQUFNLENBQUMscUJBQVAsQ0FBNkIsR0FBQSxHQUFNLE1BQW5DO1dBQ1AsSUFBQSxHQUFPO0VBSEk7O0VBS2IsMEJBQUEsR0FBNkIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsdUJBQXpCOztFQUU3Qix1QkFBQSxHQUEwQixTQUFDLGFBQUQsRUFBZ0IsR0FBaEI7QUFDeEIsUUFBQTtJQUFBLFVBQUEsR0FBYSxhQUFhLENBQUMsYUFBZCxDQUE0QixjQUE1QjtJQUNiLEtBQUEsR0FBUSxVQUFVLENBQUMsZ0JBQVgsQ0FBNEIsd0JBQTVCO0lBQ1IsUUFBQSxHQUFXLEtBQUssQ0FBQztJQUNqQixTQUFBLEdBQVksR0FBRyxDQUFDO0lBQ2hCLFNBQUEsR0FBWSxJQUFJLENBQUMsR0FBTCxDQUFTLFNBQUEsR0FBWSxRQUFyQixFQUErQixDQUEvQjtJQUNaLFVBQUEsR0FBYSxJQUFJLENBQUMsR0FBTCxDQUFTLFNBQVQsRUFBb0IsUUFBcEI7SUFDYixLQUFBLEdBQVE7SUFDUjs7OztrQkFBYyxDQUFDLE9BQWYsQ0FBdUIsU0FBQyxDQUFEO0FBQ3JCLFVBQUE7TUFBQSxJQUFBLEdBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYO01BQ1AsSUFBRyxDQUFBLEdBQUksVUFBUDtlQUNFLEdBQUksQ0FBQSxLQUFBLEVBQUEsQ0FBSixDQUFhLElBQWIsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQWhCLENBQTRCLElBQTVCLEVBSEY7O0lBRnFCLENBQXZCO0lBTUE7Ozs7a0JBQWUsQ0FBQyxPQUFoQixDQUF3QixTQUFDLENBQUQ7QUFDdEIsVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFJLDBCQUFKLENBQUE7TUFDVixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQWxCLENBQXNCLFdBQXRCO01BQ0EsR0FBSSxDQUFBLEtBQUEsRUFBQSxDQUFKLENBQWEsT0FBYjthQUNBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLE9BQXZCO0lBSnNCLENBQXhCO0lBS0EsSUFBNEIsS0FBQSxLQUFTLFNBQXJDO0FBQUEsWUFBTSxlQUFOOztFQW5Cd0I7O0VBcUIxQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsdUJBQUEsRUFBeUIsdUJBQXpCO0lBQ0EsVUFBQSxFQUFZLFVBRFo7O0FBcERGIiwic291cmNlc0NvbnRlbnQiOlsie1BvaW50fSA9IHJlcXVpcmUgJ2F0b20nXG5cbnN0eWxlR3VpZGUgPSAoZWxlbWVudCwgcG9pbnQsIGxlbmd0aCwgc3RhY2ssIGFjdGl2ZSwgZWRpdG9yLCBiYXNlUGl4ZWxQb3MsIGxpbmVIZWlnaHRQaXhlbCwgYmFzZVNjcmVlblJvdywgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0KSAtPlxuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2luZGVudC1ndWlkZS1pbXByb3ZlZCcpXG4gIGVsZW1lbnQuY2xhc3NMaXN0W2lmIHN0YWNrIHRoZW4gJ2FkZCcgZWxzZSAncmVtb3ZlJ10oJ2luZGVudC1ndWlkZS1zdGFjaycpXG4gIGVsZW1lbnQuY2xhc3NMaXN0W2lmIGFjdGl2ZSB0aGVuICdhZGQnIGVsc2UgJ3JlbW92ZSddKCdpbmRlbnQtZ3VpZGUtYWN0aXZlJylcblxuICBpZiBlZGl0b3IuaXNGb2xkZWRBdEJ1ZmZlclJvdyhNYXRoLm1heChwb2ludC5yb3cgLSAxLCAwKSlcbiAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnXG4gICAgcmV0dXJuXG5cbiAgcm93ID0gZWRpdG9yLnNjcmVlblJvd0ZvckJ1ZmZlclJvdyhwb2ludC5yb3cpXG4gIGluZGVudFNpemUgPSBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcbiAgbGVmdCA9IHBvaW50LmNvbHVtbiAqIGluZGVudFNpemUgKiBlZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpIC0gc2Nyb2xsTGVmdFxuICB0b3AgPSBiYXNlUGl4ZWxQb3MgKyBsaW5lSGVpZ2h0UGl4ZWwgKiAocm93IC0gYmFzZVNjcmVlblJvdykgLSBzY3JvbGxUb3BcblxuICBlbGVtZW50LnN0eWxlLmxlZnQgPSBcIiN7bGVmdH1weFwiXG4gIGVsZW1lbnQuc3R5bGUudG9wID0gXCIje3RvcH1weFwiXG4gIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID1cbiAgICBcIiN7ZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpICogcmVhbExlbmd0aChwb2ludC5yb3csIGxlbmd0aCwgZWRpdG9yKX1weFwiXG4gIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgZWxlbWVudC5zdHlsZVsnei1pbmRleCddID0gMVxuXG5yZWFsTGVuZ3RoID0gKHJvdywgbGVuZ3RoLCBlZGl0b3IpIC0+XG4gIHJvdzEgPSBlZGl0b3Iuc2NyZWVuUm93Rm9yQnVmZmVyUm93KHJvdylcbiAgcm93MiA9IGVkaXRvci5zY3JlZW5Sb3dGb3JCdWZmZXJSb3cocm93ICsgbGVuZ3RoKVxuICByb3cyIC0gcm93MVxuXG5JbmRlbnRHdWlkZUltcHJvdmVkRWxlbWVudCA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnaW5kZW50LWd1aWRlLWltcHJvdmVkJylcblxuY3JlYXRlRWxlbWVudHNGb3JHdWlkZXMgPSAoZWRpdG9yRWxlbWVudCwgZm5zKSAtPlxuICBpdGVtUGFyZW50ID0gZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2Nyb2xsLXZpZXcnKVxuICBpdGVtcyA9IGl0ZW1QYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnLmluZGVudC1ndWlkZS1pbXByb3ZlZCcpXG4gIGV4aXN0TnVtID0gaXRlbXMubGVuZ3RoXG4gIG5lZWRlZE51bSA9IGZucy5sZW5ndGhcbiAgY3JlYXRlTnVtID0gTWF0aC5tYXgobmVlZGVkTnVtIC0gZXhpc3ROdW0sIDApXG4gIHJlY3ljbGVOdW0gPSBNYXRoLm1pbihuZWVkZWROdW0sIGV4aXN0TnVtKVxuICBjb3VudCA9IDBcbiAgWzAuLi5leGlzdE51bV0uZm9yRWFjaCAoaSkgLT5cbiAgICBub2RlID0gaXRlbXMuaXRlbShpKVxuICAgIGlmIGkgPCByZWN5Y2xlTnVtXG4gICAgICBmbnNbY291bnQrK10obm9kZSlcbiAgICBlbHNlXG4gICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSlcbiAgWzAuLi5jcmVhdGVOdW1dLmZvckVhY2ggKGkpIC0+XG4gICAgbmV3Tm9kZSA9IG5ldyBJbmRlbnRHdWlkZUltcHJvdmVkRWxlbWVudCgpXG4gICAgbmV3Tm9kZS5jbGFzc0xpc3QuYWRkKCdvdmVybGF5ZXInKVxuICAgIGZuc1tjb3VudCsrXShuZXdOb2RlKVxuICAgIGl0ZW1QYXJlbnQuYXBwZW5kQ2hpbGQobmV3Tm9kZSlcbiAgdGhyb3cgJ1N5c3RlbSBFcnJvcicgdW5sZXNzIGNvdW50IGlzIG5lZWRlZE51bVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNyZWF0ZUVsZW1lbnRzRm9yR3VpZGVzOiBjcmVhdGVFbGVtZW50c0Zvckd1aWRlc1xuICBzdHlsZUd1aWRlOiBzdHlsZUd1aWRlXG4iXX0=
