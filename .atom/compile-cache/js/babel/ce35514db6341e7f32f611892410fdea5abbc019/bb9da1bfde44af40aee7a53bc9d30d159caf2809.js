'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var RULE_INDEX_REGEX = /===.*\[\[(.*)\]\]/g;
var DOCUMENTATION_LIFETIME = 86400 * 1000;
var docsRuleCache = new Map();

function takeWhile(source, predicate) {
  var result = [];
  var length = source.length;

  var i = 0;

  while (i < length && predicate(source[i], i)) {
    result.push(source[i]);
    i += 1;
  }

  return result;
}

// Retrieves style guide documentation with cached responses
exports['default'] = _asyncToGenerator(function* (url) {
  if (url == null) {
    return null;
  }
  var ruleMatch = /https:\/\/github.com\/.*\/ruby-style-guide#(.*)/g.exec(url);
  if (ruleMatch == null) {
    return null;
  }

  var rule = ruleMatch[1];
  if (docsRuleCache.has(rule)) {
    var cachedRule = docsRuleCache.get(rule);
    if (new Date().getTime() >= cachedRule.expires) {
      // If documentation is stale, clear cache
      docsRuleCache['delete'](rule);
    } else {
      return cachedRule.markdown;
    }
  }

  var rawRulesMarkdown = undefined;
  var response = yield fetch('https://raw.githubusercontent.com/bbatsov/ruby-style-guide/master/README.adoc');
  if (response.ok) {
    rawRulesMarkdown = yield response.text();
  } else {
    return '***\nError retrieving documentation: ' + response.statusText;
  }

  var byLine = rawRulesMarkdown.split('\n');
  var ruleIndexes = byLine.reduce(function (acc, line, idx) {
    return line.match(RULE_INDEX_REGEX) ? acc.concat([[idx, line]]) : acc;
  }, []);

  ruleIndexes.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var startingIndex = _ref2[0];
    var startingLine = _ref2[1];

    var ruleName = RULE_INDEX_REGEX.exec(startingLine)[1];

    if (ruleName == null) {
      return;
    }

    var beginSearch = byLine.slice(startingIndex + 1);

    // gobble all the documentation until you reach the next rule
    var documentationForRule = takeWhile(beginSearch, function (x) {
      return !x.match(RULE_INDEX_REGEX);
    });
    var markdownOutput = '\n'.concat(documentationForRule.join('\n'));

    docsRuleCache.set(ruleName, {
      markdown: markdownOutput,
      expires: new Date().getTime() + DOCUMENTATION_LIFETIME
    });
  });

  return docsRuleCache.get(rule).markdown;
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWxlLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7O0FBRVgsSUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQTtBQUM3QyxJQUFNLHNCQUFzQixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDM0MsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFL0IsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUNwQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7TUFDVCxNQUFNLEdBQUssTUFBTSxDQUFqQixNQUFNOztBQUNkLE1BQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFVCxTQUFPLENBQUMsR0FBRyxNQUFNLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUM1QyxVQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RCLEtBQUMsSUFBSSxDQUFDLENBQUE7R0FDUDs7QUFFRCxTQUFPLE1BQU0sQ0FBQTtDQUNkOzs7dUNBR2MsV0FBK0IsR0FBRyxFQUFFO0FBQ2pELE1BQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUNmLFdBQU8sSUFBSSxDQUFBO0dBQ1o7QUFDRCxNQUFNLFNBQVMsR0FBRyxrREFBa0QsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDOUUsTUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQ3JCLFdBQU8sSUFBSSxDQUFBO0dBQ1o7O0FBRUQsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLE1BQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMzQixRQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzFDLFFBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFOztBQUU5QyxtQkFBYSxVQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDM0IsTUFBTTtBQUNMLGFBQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQTtLQUMzQjtHQUNGOztBQUVELE1BQUksZ0JBQWdCLFlBQUEsQ0FBQTtBQUNwQixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQywrRUFBK0UsQ0FBQyxDQUFBO0FBQzdHLE1BQUksUUFBUSxDQUFDLEVBQUUsRUFBRTtBQUNmLG9CQUFnQixHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO0dBQ3pDLE1BQU07QUFDTCxxREFBK0MsUUFBUSxDQUFDLFVBQVUsQ0FBRTtHQUNyRTs7QUFFRCxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0MsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDL0IsVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUc7V0FBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHO0dBQUMsRUFDcEYsRUFBRSxDQUNILENBQUE7O0FBRUQsYUFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQTZCLEVBQUs7K0JBQWxDLElBQTZCOztRQUE1QixhQUFhO1FBQUUsWUFBWTs7QUFDL0MsUUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV2RCxRQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7QUFBRSxhQUFNO0tBQUU7O0FBRWhDLFFBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFBOzs7QUFHbkQsUUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztLQUFBLENBQUMsQ0FBQTtBQUNwRixRQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBOztBQUVuRSxpQkFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7QUFDMUIsY0FBUSxFQUFFLGNBQWM7QUFDeEIsYUFBTyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsc0JBQXNCO0tBQ3ZELENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixTQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFBO0NBQ3hDIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWxlLWhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCBSVUxFX0lOREVYX1JFR0VYID0gLz09PS4qXFxbXFxbKC4qKVxcXVxcXS9nXG5jb25zdCBET0NVTUVOVEFUSU9OX0xJRkVUSU1FID0gODY0MDAgKiAxMDAwXG5jb25zdCBkb2NzUnVsZUNhY2hlID0gbmV3IE1hcCgpXG5cbmZ1bmN0aW9uIHRha2VXaGlsZShzb3VyY2UsIHByZWRpY2F0ZSkge1xuICBjb25zdCByZXN1bHQgPSBbXVxuICBjb25zdCB7IGxlbmd0aCB9ID0gc291cmNlXG4gIGxldCBpID0gMFxuXG4gIHdoaWxlIChpIDwgbGVuZ3RoICYmIHByZWRpY2F0ZShzb3VyY2VbaV0sIGkpKSB7XG4gICAgcmVzdWx0LnB1c2goc291cmNlW2ldKVxuICAgIGkgKz0gMVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vLyBSZXRyaWV2ZXMgc3R5bGUgZ3VpZGUgZG9jdW1lbnRhdGlvbiB3aXRoIGNhY2hlZCByZXNwb25zZXNcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGdldFJ1bGVNYXJrRG93bih1cmwpIHtcbiAgaWYgKHVybCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBjb25zdCBydWxlTWF0Y2ggPSAvaHR0cHM6XFwvXFwvZ2l0aHViLmNvbVxcLy4qXFwvcnVieS1zdHlsZS1ndWlkZSMoLiopL2cuZXhlYyh1cmwpXG4gIGlmIChydWxlTWF0Y2ggPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBydWxlID0gcnVsZU1hdGNoWzFdXG4gIGlmIChkb2NzUnVsZUNhY2hlLmhhcyhydWxlKSkge1xuICAgIGNvbnN0IGNhY2hlZFJ1bGUgPSBkb2NzUnVsZUNhY2hlLmdldChydWxlKVxuICAgIGlmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSA+PSBjYWNoZWRSdWxlLmV4cGlyZXMpIHtcbiAgICAgIC8vIElmIGRvY3VtZW50YXRpb24gaXMgc3RhbGUsIGNsZWFyIGNhY2hlXG4gICAgICBkb2NzUnVsZUNhY2hlLmRlbGV0ZShydWxlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2FjaGVkUnVsZS5tYXJrZG93blxuICAgIH1cbiAgfVxuXG4gIGxldCByYXdSdWxlc01hcmtkb3duXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9iYmF0c292L3J1Ynktc3R5bGUtZ3VpZGUvbWFzdGVyL1JFQURNRS5hZG9jJylcbiAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgcmF3UnVsZXNNYXJrZG93biA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBgKioqXFxuRXJyb3IgcmV0cmlldmluZyBkb2N1bWVudGF0aW9uOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YFxuICB9XG5cbiAgY29uc3QgYnlMaW5lID0gcmF3UnVsZXNNYXJrZG93bi5zcGxpdCgnXFxuJylcbiAgY29uc3QgcnVsZUluZGV4ZXMgPSBieUxpbmUucmVkdWNlKFxuICAgIChhY2MsIGxpbmUsIGlkeCkgPT4gKGxpbmUubWF0Y2goUlVMRV9JTkRFWF9SRUdFWCkgPyBhY2MuY29uY2F0KFtbaWR4LCBsaW5lXV0pIDogYWNjKSxcbiAgICBbXSxcbiAgKVxuXG4gIHJ1bGVJbmRleGVzLmZvckVhY2goKFtzdGFydGluZ0luZGV4LCBzdGFydGluZ0xpbmVdKSA9PiB7XG4gICAgY29uc3QgcnVsZU5hbWUgPSBSVUxFX0lOREVYX1JFR0VYLmV4ZWMoc3RhcnRpbmdMaW5lKVsxXVxuXG4gICAgaWYgKHJ1bGVOYW1lID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IGJlZ2luU2VhcmNoID0gYnlMaW5lLnNsaWNlKHN0YXJ0aW5nSW5kZXggKyAxKVxuXG4gICAgLy8gZ29iYmxlIGFsbCB0aGUgZG9jdW1lbnRhdGlvbiB1bnRpbCB5b3UgcmVhY2ggdGhlIG5leHQgcnVsZVxuICAgIGNvbnN0IGRvY3VtZW50YXRpb25Gb3JSdWxlID0gdGFrZVdoaWxlKGJlZ2luU2VhcmNoLCB4ID0+ICF4Lm1hdGNoKFJVTEVfSU5ERVhfUkVHRVgpKVxuICAgIGNvbnN0IG1hcmtkb3duT3V0cHV0ID0gJ1xcbicuY29uY2F0KGRvY3VtZW50YXRpb25Gb3JSdWxlLmpvaW4oJ1xcbicpKVxuXG4gICAgZG9jc1J1bGVDYWNoZS5zZXQocnVsZU5hbWUsIHtcbiAgICAgIG1hcmtkb3duOiBtYXJrZG93bk91dHB1dCxcbiAgICAgIGV4cGlyZXM6IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgRE9DVU1FTlRBVElPTl9MSUZFVElNRSxcbiAgICB9KVxuICB9KVxuXG4gIHJldHVybiBkb2NzUnVsZUNhY2hlLmdldChydWxlKS5tYXJrZG93blxufVxuIl19