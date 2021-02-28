(function() {
  var Point, fillInNulls, getGuides, getVirtualIndent, mergeCropped, statesAboveVisible, statesBelowVisible, statesInvisible, supportingIndents, toG, toGuides, uniq,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Point = require('atom').Point;

  toG = function(indents, begin, depth, cursorRows) {
    var gs, isActive, isStack, ptr, r, ref;
    ptr = begin;
    isActive = false;
    isStack = false;
    gs = [];
    while (ptr < indents.length && depth <= indents[ptr]) {
      if (depth < indents[ptr]) {
        r = toG(indents, ptr, depth + 1, cursorRows);
        if ((ref = r.guides[0]) != null ? ref.stack : void 0) {
          isStack = true;
        }
        Array.prototype.push.apply(gs, r.guides);
        ptr = r.ptr;
      } else {
        if (indexOf.call(cursorRows, ptr) >= 0) {
          isActive = true;
          isStack = true;
        }
        ptr++;
      }
    }
    if (depth !== 0) {
      gs.unshift({
        length: ptr - begin,
        point: new Point(begin, depth - 1),
        active: isActive,
        stack: isStack
      });
    }
    return {
      guides: gs,
      ptr: ptr
    };
  };

  fillInNulls = function(indents) {
    var res;
    res = indents.reduceRight(function(acc, cur) {
      if (cur === null) {
        acc.r.unshift(acc.i);
        return {
          r: acc.r,
          i: acc.i
        };
      } else {
        acc.r.unshift(cur);
        return {
          r: acc.r,
          i: cur
        };
      }
    }, {
      r: [],
      i: 0
    });
    return res.r;
  };

  toGuides = function(indents, cursorRows) {
    var ind;
    ind = fillInNulls(indents.map(function(i) {
      if (i === null) {
        return null;
      } else {
        return Math.floor(i);
      }
    }));
    return toG(ind, 0, 0, cursorRows).guides;
  };

  getVirtualIndent = function(getIndentFn, row, lastRow) {
    var i, ind, j, ref, ref1;
    for (i = j = ref = row, ref1 = lastRow; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      ind = getIndentFn(i);
      if (ind != null) {
        return ind;
      }
    }
    return 0;
  };

  uniq = function(values) {
    var j, last, len, newVals, v;
    newVals = [];
    last = null;
    for (j = 0, len = values.length; j < len; j++) {
      v = values[j];
      if (newVals.length === 0 || last !== v) {
        newVals.push(v);
      }
      last = v;
    }
    return newVals;
  };

  mergeCropped = function(guides, above, below, height) {
    guides.forEach(function(g) {
      var ref, ref1, ref2, ref3;
      if (g.point.row === 0) {
        if (ref = g.point.column, indexOf.call(above.active, ref) >= 0) {
          g.active = true;
        }
        if (ref1 = g.point.column, indexOf.call(above.stack, ref1) >= 0) {
          g.stack = true;
        }
      }
      if (height < g.point.row + g.length) {
        if (ref2 = g.point.column, indexOf.call(below.active, ref2) >= 0) {
          g.active = true;
        }
        if (ref3 = g.point.column, indexOf.call(below.stack, ref3) >= 0) {
          return g.stack = true;
        }
      }
    });
    return guides;
  };

  supportingIndents = function(visibleLast, lastRow, getIndentFn) {
    var count, indent, indents;
    if (getIndentFn(visibleLast) != null) {
      return [];
    }
    indents = [];
    count = visibleLast + 1;
    while (count <= lastRow) {
      indent = getIndentFn(count);
      indents.push(indent);
      if (indent != null) {
        break;
      }
      count++;
    }
    return indents;
  };

  getGuides = function(visibleFrom, visibleTo, lastRow, cursorRows, getIndentFn) {
    var above, below, guides, j, results, support, visibleIndents, visibleLast;
    visibleLast = Math.min(visibleTo, lastRow);
    visibleIndents = (function() {
      results = [];
      for (var j = visibleFrom; visibleFrom <= visibleLast ? j <= visibleLast : j >= visibleLast; visibleFrom <= visibleLast ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).map(getIndentFn);
    support = supportingIndents(visibleLast, lastRow, getIndentFn);
    guides = toGuides(visibleIndents.concat(support), cursorRows.map(function(c) {
      return c - visibleFrom;
    }));
    above = statesAboveVisible(cursorRows, visibleFrom - 1, getIndentFn, lastRow);
    below = statesBelowVisible(cursorRows, visibleLast + 1, getIndentFn, lastRow);
    return mergeCropped(guides, above, below, visibleLast - visibleFrom);
  };

  statesInvisible = function(cursorRows, start, getIndentFn, lastRow, isAbove) {
    var active, cursors, i, ind, j, k, l, len, m, minIndent, ref, ref1, results, results1, results2, stack, vind;
    if ((isAbove ? start < 0 : lastRow < start)) {
      return {
        stack: [],
        active: []
      };
    }
    cursors = isAbove ? uniq(cursorRows.filter(function(r) {
      return r <= start;
    }).sort(), true).reverse() : uniq(cursorRows.filter(function(r) {
      return start <= r;
    }).sort(), true);
    active = [];
    stack = [];
    minIndent = Number.MAX_VALUE;
    ref = (isAbove ? (function() {
      results = [];
      for (var k = start; start <= 0 ? k <= 0 : k >= 0; start <= 0 ? k++ : k--){ results.push(k); }
      return results;
    }).apply(this) : (function() {
      results1 = [];
      for (var l = start; start <= lastRow ? l <= lastRow : l >= lastRow; start <= lastRow ? l++ : l--){ results1.push(l); }
      return results1;
    }).apply(this));
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      ind = getIndentFn(i);
      if (ind != null) {
        minIndent = Math.min(minIndent, ind);
      }
      if (cursors.length === 0 || minIndent === 0) {
        break;
      }
      if (cursors[0] === i) {
        cursors.shift();
        vind = getVirtualIndent(getIndentFn, i, lastRow);
        minIndent = Math.min(minIndent, vind);
        if (vind === minIndent) {
          active.push(vind - 1);
        }
        if (stack.length === 0) {
          stack = (function() {
            results2 = [];
            for (var m = 0, ref1 = minIndent - 1; 0 <= ref1 ? m <= ref1 : m >= ref1; 0 <= ref1 ? m++ : m--){ results2.push(m); }
            return results2;
          }).apply(this);
        }
      }
    }
    return {
      stack: uniq(stack.sort()),
      active: uniq(active.sort())
    };
  };

  statesAboveVisible = function(cursorRows, start, getIndentFn, lastRow) {
    return statesInvisible(cursorRows, start, getIndentFn, lastRow, true);
  };

  statesBelowVisible = function(cursorRows, start, getIndentFn, lastRow) {
    return statesInvisible(cursorRows, start, getIndentFn, lastRow, false);
  };

  module.exports = {
    toGuides: toGuides,
    getGuides: getGuides,
    uniq: uniq,
    statesAboveVisible: statesAboveVisible,
    statesBelowVisible: statesBelowVisible
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvaW5kZW50LWd1aWRlLWltcHJvdmVkL2xpYi9ndWlkZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw4SkFBQTtJQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBRVYsR0FBQSxHQUFNLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsVUFBeEI7QUFDSixRQUFBO0lBQUEsR0FBQSxHQUFNO0lBQ04sUUFBQSxHQUFXO0lBQ1gsT0FBQSxHQUFVO0lBRVYsRUFBQSxHQUFLO0FBQ0wsV0FBTSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQWQsSUFBd0IsS0FBQSxJQUFTLE9BQVEsQ0FBQSxHQUFBLENBQS9DO01BQ0UsSUFBRyxLQUFBLEdBQVEsT0FBUSxDQUFBLEdBQUEsQ0FBbkI7UUFDRSxDQUFBLEdBQUksR0FBQSxDQUFJLE9BQUosRUFBYSxHQUFiLEVBQWtCLEtBQUEsR0FBUSxDQUExQixFQUE2QixVQUE3QjtRQUNKLHFDQUFjLENBQUUsY0FBaEI7VUFDRSxPQUFBLEdBQVUsS0FEWjs7UUFFQSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFyQixDQUEyQixFQUEzQixFQUErQixDQUFDLENBQUMsTUFBakM7UUFDQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBTFY7T0FBQSxNQUFBO1FBT0UsSUFBRyxhQUFPLFVBQVAsRUFBQSxHQUFBLE1BQUg7VUFDRSxRQUFBLEdBQVc7VUFDWCxPQUFBLEdBQVUsS0FGWjs7UUFHQSxHQUFBLEdBVkY7O0lBREY7SUFZQSxJQUFPLEtBQUEsS0FBUyxDQUFoQjtNQUNFLEVBQUUsQ0FBQyxPQUFILENBQ0U7UUFBQSxNQUFBLEVBQVEsR0FBQSxHQUFNLEtBQWQ7UUFDQSxLQUFBLEVBQU8sSUFBSSxLQUFKLENBQVUsS0FBVixFQUFpQixLQUFBLEdB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WSxJQUFJLENBQUMsR0FBTCxDQUFTLFNBQVQsRUFBb0IsSUFBcEI7UUFDWixJQUF5QixJQUFBLEtBQVEsU0FBakM7VUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQUEsR0FBTyxDQUFuQixFQUFBOztRQUNBLElBQThCLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQTlDO1VBQUEsS0FBQSxHQUFROzs7O3lCQUFSO1NBTEY7O0FBSkY7V0FVQTtNQUFBLEtBQUEsRUFBTyxJQUFBLENBQUssS0FBSyxDQUFDLElBQU4sQ0FBQSxDQUFMLENBQVA7TUFDQSxNQUFBLEVBQVEsSUFBQSxDQUFLLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBTCxDQURSOztFQXZCZ0I7O0VBMEJsQixrQkFBQSxHQUFxQixTQUFDLFVBQUQsRUFBYSxLQUFiLEVBQW9CLFdBQXBCLEVBQWlDLE9BQWpDO1dBQ25CLGVBQUEsQ0FBZ0IsVUFBaEIsRUFBNEIsS0FBNUIsRUFBbUMsV0FBbkMsRUFBZ0QsT0FBaEQsRUFBeUQsSUFBekQ7RUFEbUI7O0VBR3JCLGtCQUFBLEdBQXFCLFNBQUMsVUFBRCxFQUFhLEtBQWIsRUFBb0IsV0FBcEIsRUFBaUMsT0FBakM7V0FDbkIsZUFBQSxDQUFnQixVQUFoQixFQUE0QixLQUE1QixFQUFtQyxXQUFuQyxFQUFnRCxPQUFoRCxFQUF5RCxLQUF6RDtFQURtQjs7RUFHckIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxRQUFWO0lBQ0EsU0FBQSxFQUFXLFNBRFg7SUFFQSxJQUFBLEVBQU0sSUFGTjtJQUdBLGtCQUFBLEVBQW9CLGtCQUhwQjtJQUlBLGtCQUFBLEVBQW9CLGtCQUpwQjs7QUFySUYiLCJzb3VyY2VzQ29udGVudCI6WyJ7UG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcblxudG9HID0gKGluZGVudHMsIGJlZ2luLCBkZXB0aCwgY3Vyc29yUm93cykgLT5cbiAgcHRyID0gYmVnaW5cbiAgaXNBY3RpdmUgPSBmYWxzZVxuICBpc1N0YWNrID0gZmFsc2VcblxuICBncyA9IFtdXG4gIHdoaWxlIHB0ciA8IGluZGVudHMubGVuZ3RoICYmIGRlcHRoIDw9IGluZGVudHNbcHRyXVxuICAgIGlmIGRlcHRoIDwgaW5kZW50c1twdHJdXG4gICAgICByID0gdG9HKGluZGVudHMsIHB0ciwgZGVwdGggKyAxLCBjdXJzb3JSb3dzKVxuICAgICAgaWYgci5ndWlkZXNbMF0/LnN0YWNrXG4gICAgICAgIGlzU3RhY2sgPSB0cnVlXG4gICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShncywgci5ndWlkZXMpXG4gICAgICBwdHIgPSByLnB0clxuICAgIGVsc2VcbiAgICAgIGlmIHB0ciBpbiBjdXJzb3JSb3dzXG4gICAgICAgIGlzQWN0aXZlID0gdHJ1ZVxuICAgICAgICBpc1N0YWNrID0gdHJ1ZVxuICAgICAgcHRyKytcbiAgdW5sZXNzIGRlcHRoIGlzIDBcbiAgICBncy51bnNoaWZ0XG4gICAgICBsZW5ndGg6IHB0ciAtIGJlZ2luXG4gICAgICBwb2ludDogbmV3IFBvaW50KGJlZ2luLCBkZXB0aCAtIDEpXG4gICAgICBhY3RpdmU6IGlzQWN0aXZlXG4gICAgICBzdGFjazogaXNTdGFja1xuICBndWlkZXM6IGdzXG4gIHB0cjogcHRyXG5cbmZpbGxJbk51bGxzID0gKGluZGVudHMpIC0+XG4gIHJlcyA9IGluZGVudHMucmVkdWNlUmlnaHQoXG4gICAgKGFjYywgY3VyKSAtPlxuICAgICAgaWYgY3VyIGlzIG51bGxcbiAgICAgICAgYWNjLnIudW5zaGlmdChhY2MuaSlcblxuICAgICAgICByOiBhY2MuclxuICAgICAgICBpOiBhY2MuaVxuICAgICAgZWxzZVxuICAgICAgICBhY2Muci51bnNoaWZ0KGN1cilcblxuICAgICAgICByOiBhY2MuclxuICAgICAgICBpOiBjdXJcbiAgICByOiBbXVxuICAgIGk6IDApXG4gIHJlcy5yXG5cbnRvR3VpZGVzID0gKGluZGVudHMsIGN1cnNvclJvd3MpIC0+XG4gIGluZCA9IGZpbGxJbk51bGxzIGluZGVudHMubWFwIChpKSAtPiBpZiBpIGlzIG51bGwgdGhlbiBudWxsIGVsc2UgTWF0aC5mbG9vcihpKVxuICB0b0coaW5kLCAwLCAwLCBjdXJzb3JSb3dzKS5ndWlkZXNcblxuZ2V0VmlydHVhbEluZGVudCA9IChnZXRJbmRlbnRGbiwgcm93LCBsYXN0Um93KSAtPlxuICBmb3IgaSBpbiBbcm93Li5sYXN0Um93XVxuICAgIGluZCA9IGdldEluZGVudEZuKGkpXG4gICAgcmV0dXJuIGluZCBpZiBpbmQ/XG4gIDBcblxudW5pcSA9ICh2YWx1ZXMpIC0+XG4gIG5ld1ZhbHMgPSBbXVxuICBsYXN0ID0gbnVsbFxuICBmb3IgdiBpbiB2YWx1ZXNcbiAgICBpZiBuZXdWYWxzLmxlbmd0aCBpcyAwIG9yIGxhc3QgaXNudCB2XG4gICAgICBuZXdWYWxzLnB1c2godilcbiAgICBsYXN0ID0gdlxuICBuZXdWYWxzXG5cbm1lcmdlQ3JvcHBlZCA9IChndWlkZXMsIGFib3ZlLCBiZWxvdywgaGVpZ2h0KSAtPlxuICBndWlkZXMuZm9yRWFjaCAoZykgLT5cbiAgICBpZiBnLnBvaW50LnJvdyBpcyAwXG4gICAgICBpZiBnLnBvaW50LmNvbHVtbiBpbiBhYm92ZS5hY3RpdmVcbiAgICAgICAgZy5hY3RpdmUgPSB0cnVlXG4gICAgICBpZiBnLnBvaW50LmNvbHVtbiBpbiBhYm92ZS5zdGFja1xuICAgICAgICBnLnN0YWNrID0gdHJ1ZVxuICAgIGlmIGhlaWdodCA8IGcucG9pbnQucm93ICsgZy5sZW5ndGhcbiAgICAgIGlmIGcucG9pbnQuY29sdW1uIGluIGJlbG93LmFjdGl2ZVxuICAgICAgICBnLmFjdGl2ZSA9IHRydWVcbiAgICAgIGlmIGcucG9pbnQuY29sdW1uIGluIGJlbG93LnN0YWNrXG4gICAgICAgIGcuc3RhY2sgPSB0cnVlXG4gIGd1aWRlc1xuXG5zdXBwb3J0aW5nSW5kZW50cyA9ICh2aXNpYmxlTGFzdCwgbGFzdFJvdywgZ2V0SW5kZW50Rm4pIC0+XG4gIHJldHVybiBbXSBpZiBnZXRJbmRlbnRGbih2aXNpYmxlTGFzdCk/XG4gIGluZGVudHMgPSBbXVxuICBjb3VudCA9IHZpc2libGVMYXN0ICsgMVxuICB3aGlsZSBjb3VudCA8PSBsYXN0Um93XG4gICAgaW5kZW50ID0gZ2V0SW5kZW50Rm4oY291bnQpXG4gICAgaW5kZW50cy5wdXNoKGluZGVudClcbiAgICBicmVhayBpZiBpbmRlbnQ/XG4gICAgY291bnQrK1xuICBpbmRlbnRzXG5cbmdldEd1aWRlcyA9ICh2aXNpYmxlRnJvbSwgdmlzaWJsZVRvLCBsYXN0Um93LCBjdXJzb3JSb3dzLCBnZXRJbmRlbnRGbikgLT5cbiAgdmlzaWJsZUxhc3QgPSBNYXRoLm1pbih2aXNpYmxlVG8sIGxhc3RSb3cpXG4gIHZpc2libGVJbmRlbnRzID0gW3Zpc2libGVGcm9tLi52aXNpYmxlTGFzdF0ubWFwIGdldEluZGVudEZuXG4gIHN1cHBvcnQgPSBzdXBwb3J0aW5nSW5kZW50cyh2aXNpYmxlTGFzdCwgbGFzdFJvdywgZ2V0SW5kZW50Rm4pXG4gIGd1aWRlcyA9IHRvR3VpZGVzKFxuICAgIHZpc2libGVJbmRlbnRzLmNvbmNhdChzdXBwb3J0KSwgY3Vyc29yUm93cy5tYXAoKGMpIC0+IGMgLSB2aXNpYmxlRnJvbSkpXG4gIGFib3ZlID0gc3RhdGVzQWJvdmVWaXNpYmxlKGN1cnNvclJvd3MsIHZpc2libGVGcm9tIC0gMSwgZ2V0SW5kZW50Rm4sIGxhc3RSb3cpXG4gIGJlbG93ID0gc3RhdGVzQmVsb3dWaXNpYmxlKGN1cnNvclJvd3MsIHZpc2libGVMYXN0ICsgMSwgZ2V0SW5kZW50Rm4sIGxhc3RSb3cpXG4gIG1lcmdlQ3JvcHBlZChndWlkZXMsIGFib3ZlLCBiZWxvdywgdmlzaWJsZUxhc3QgLSB2aXNpYmxlRnJvbSlcblxuc3RhdGVzSW52aXNpYmxlID0gKGN1cnNvclJvd3MsIHN0YXJ0LCBnZXRJbmRlbnRGbiwgbGFzdFJvdywgaXNBYm92ZSkgLT5cbiAgaWYgKGlmIGlzQWJvdmUgdGhlbiBzdGFydCA8IDAgZWxzZSBsYXN0Um93IDwgc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YWNrOiBbXVxuICAgICAgYWN0aXZlOiBbXVxuICAgIH1cbiAgY3Vyc29ycyA9IGlmIGlzQWJvdmVcbiAgICB1bmlxKGN1cnNvclJvd3MuZmlsdGVyKChyKSAtPiByIDw9IHN0YXJ0KS5zb3J0KCksIHRydWUpLnJldmVyc2UoKVxuICBlbHNlXG4gICAgdW5pcShjdXJzb3JSb3dzLmZpbHRlcigocikgLT4gc3RhcnQgPD0gcikuc29ydCgpLCB0cnVlKVxuICBhY3RpdmUgPSBbXVxuICBzdGFjayA9IFtdXG4gIG1pbkluZGVudCA9IE51bWJlci5NQVhfVkFMVUVcbiAgZm9yIGkgaW4gKGlmIGlzQWJvdmUgdGhlbiBbc3RhcnQuLjBdIGVsc2UgW3N0YXJ0Li5sYXN0Um93XSlcbiAgICBpbmQgPSBnZXRJbmRlbnRGbihpKVxuICAgIG1pbkluZGVudCA9IE1hdGgubWluKG1pbkluZGVudCwgaW5kKSBpZiBpbmQ/XG4gICAgYnJlYWsgaWYgY3Vyc29ycy5sZW5ndGggaXMgMCBvciBtaW5JbmRlbnQgaXMgMFxuICAgIGlmIGN1cnNvcnNbMF0gaXMgaVxuICAgICAgY3Vyc29ycy5zaGlmdCgpXG4gICAgICB2aW5kID0gZ2V0VmlydHVhbEluZGVudChnZXRJbmRlbnRGbiwgaSwgbGFzdFJvdylcbiAgICAgIG1pbkluZGVudCA9IE1hdGgubWluKG1pbkluZGVudCwgdmluZClcbiAgICAgIGFjdGl2ZS5wdXNoKHZpbmQgLSAxKSBpZiB2aW5kIGlzIG1pbkluZGVudFxuICAgICAgc3RhY2sgPSBbMC4ubWluSW5kZW50IC0gMV0gaWYgc3RhY2subGVuZ3RoIGlzIDBcbiAgc3RhY2s6IHVuaXEoc3RhY2suc29ydCgpKVxuICBhY3RpdmU6IHVuaXEoYWN0aXZlLnNvcnQoKSlcblxuc3RhdGVzQWJvdmVWaXNpYmxlID0gKGN1cnNvclJvd3MsIHN0YXJ0LCBnZXRJbmRlbnRGbiwgbGFzdFJvdykgLT5cbiAgc3RhdGVzSW52aXNpYmxlKGN1cnNvclJvd3MsIHN0YXJ0LCBnZXRJbmRlbnRGbiwgbGFzdFJvdywgdHJ1ZSlcblxuc3RhdGVzQmVsb3dWaXNpYmxlID0gKGN1cnNvclJvd3MsIHN0YXJ0LCBnZXRJbmRlbnRGbiwgbGFzdFJvdykgLT5cbiAgc3RhdGVzSW52aXNpYmxlKGN1cnNvclJvd3MsIHN0YXJ0LCBnZXRJbmRlbnRGbiwgbGFzdFJvdywgZmFsc2UpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgdG9HdWlkZXM6IHRvR3VpZGVzXG4gIGdldEd1aWRlczogZ2V0R3VpZGVzXG4gIHVuaXE6IHVuaXFcbiAgc3RhdGVzQWJvdmVWaXNpYmxlOiBzdGF0ZXNBYm92ZVZpc2libGVcbiAgc3RhdGVzQmVsb3dWaXNpYmxlOiBzdGF0ZXNCZWxvd1Zpc2libGVcbiJdfQ==
