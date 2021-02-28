'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var RULE_INDEX_REGEX = /===.*\[\[(.*)\]\]/g;
var DOC_URL = 'https://raw.githubusercontent.com/bbatsov/ruby-style-guide/master/README.adoc';
var DOCUMENTATION_LIFETIME = 86400 * 1000;
var NO_DOC_MSG = 'No documentation available yet.';

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
exports['default'] = _asyncToGenerator(function* (rule) {
  if (rule == null) {
    return NO_DOC_MSG;
  }

  if (docsRuleCache.has(rule)) {
    var cachedRule = docsRuleCache.get(rule);

    if (new Date().getTime() >= cachedRule.expires) {
      // If documentation is stale, clear cache
      docsRuleCache['delete'](rule);
    } else {
      return cachedRule.documentation;
    }
  }

  var rawRulesDoc = undefined;
  var response = yield fetch(DOC_URL);
  if (response.ok) {
    rawRulesDoc = yield response.text();
  } else {
    return '***\nError retrieving documentation: ' + response.statusText;
  }

  var byLine = rawRulesDoc.split('\n');
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
    var rawRuleDoc = takeWhile(beginSearch, function (x) {
      return !x.match(RULE_INDEX_REGEX);
    });
    var documentation = '\n'.concat(rawRuleDoc.join('\n'));

    docsRuleCache.set(ruleName, {
      documentation: documentation,
      expires: new Date().getTime() + DOCUMENTATION_LIFETIME
    });
  });

  if (!docsRuleCache.has(rule)) {
    return NO_DOC_MSG;
  }

  return docsRuleCache.get(rule).documentation;
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWJvY29wL2hlbHBlcnMvZG9jLWNhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7OztBQUVYLElBQU0sZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUE7QUFDN0MsSUFBTSxPQUFPLEdBQUcsK0VBQStFLENBQUE7QUFDL0YsSUFBTSxzQkFBc0IsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQzNDLElBQU0sVUFBVSxHQUFHLGlDQUFpQyxDQUFBOztBQUVwRCxJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUUvQixTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ3BDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtNQUNULE1BQU0sR0FBSyxNQUFNLENBQWpCLE1BQU07O0FBQ2QsTUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUVULFNBQU8sQ0FBQyxHQUFHLE1BQU0sSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQzVDLFVBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEIsS0FBQyxJQUFJLENBQUMsQ0FBQTtHQUNQOztBQUVELFNBQU8sTUFBTSxDQUFBO0NBQ2Q7Ozt1Q0FHYyxXQUFvQyxJQUFJLEVBQUU7QUFDdkQsTUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQ2hCLFdBQU8sVUFBVSxDQUFBO0dBQ2xCOztBQUVELE1BQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMzQixRQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUUxQyxRQUFJLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTs7QUFFOUMsbUJBQWEsVUFBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzNCLE1BQU07QUFDTCxhQUFPLFVBQVUsQ0FBQyxhQUFhLENBQUE7S0FDaEM7R0FDRjs7QUFFRCxNQUFJLFdBQVcsWUFBQSxDQUFBO0FBQ2YsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDckMsTUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFO0FBQ2YsZUFBVyxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO0dBQ3BDLE1BQU07QUFDTCxxREFBK0MsUUFBUSxDQUFDLFVBQVUsQ0FBRTtHQUNyRTs7QUFFRCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3RDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQy9CLFVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHO1dBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRztHQUFDLEVBQ3BGLEVBQUUsQ0FDSCxDQUFBOztBQUVELGFBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUE2QixFQUFLOytCQUFsQyxJQUE2Qjs7UUFBNUIsYUFBYTtRQUFFLFlBQVk7O0FBQy9DLFFBQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFdkQsUUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO0FBQUUsYUFBTTtLQUFFOztBQUVoQyxRQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQTs7O0FBR25ELFFBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsVUFBQyxDQUFDO2FBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQzVFLFFBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBOztBQUV4RCxpQkFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7QUFDMUIsbUJBQWEsRUFBYixhQUFhO0FBQ2IsYUFBTyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsc0JBQXNCO0tBQ3ZELENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixNQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM1QixXQUFPLFVBQVUsQ0FBQTtHQUNsQjs7QUFFRCxTQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFBO0NBQzdDIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL3NyYy9ydWJvY29wL2hlbHBlcnMvZG9jLWNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY29uc3QgUlVMRV9JTkRFWF9SRUdFWCA9IC89PT0uKlxcW1xcWyguKilcXF1cXF0vZ1xuY29uc3QgRE9DX1VSTCA9ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vYmJhdHNvdi9ydWJ5LXN0eWxlLWd1aWRlL21hc3Rlci9SRUFETUUuYWRvYydcbmNvbnN0IERPQ1VNRU5UQVRJT05fTElGRVRJTUUgPSA4NjQwMCAqIDEwMDBcbmNvbnN0IE5PX0RPQ19NU0cgPSAnTm8gZG9jdW1lbnRhdGlvbiBhdmFpbGFibGUgeWV0LidcblxuY29uc3QgZG9jc1J1bGVDYWNoZSA9IG5ldyBNYXAoKVxuXG5mdW5jdGlvbiB0YWtlV2hpbGUoc291cmNlLCBwcmVkaWNhdGUpIHtcbiAgY29uc3QgcmVzdWx0ID0gW11cbiAgY29uc3QgeyBsZW5ndGggfSA9IHNvdXJjZVxuICBsZXQgaSA9IDBcblxuICB3aGlsZSAoaSA8IGxlbmd0aCAmJiBwcmVkaWNhdGUoc291cmNlW2ldLCBpKSkge1xuICAgIHJlc3VsdC5wdXNoKHNvdXJjZVtpXSlcbiAgICBpICs9IDFcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuLy8gUmV0cmlldmVzIHN0eWxlIGd1aWRlIGRvY3VtZW50YXRpb24gd2l0aCBjYWNoZWQgcmVzcG9uc2VzXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBnZXRSdWxlRG9jdW1lbnRhdGlvbihydWxlKSB7XG4gIGlmIChydWxlID09IG51bGwpIHtcbiAgICByZXR1cm4gTk9fRE9DX01TR1xuICB9XG5cbiAgaWYgKGRvY3NSdWxlQ2FjaGUuaGFzKHJ1bGUpKSB7XG4gICAgY29uc3QgY2FjaGVkUnVsZSA9IGRvY3NSdWxlQ2FjaGUuZ2V0KHJ1bGUpXG5cbiAgICBpZiAobmV3IERhdGUoKS5nZXRUaW1lKCkgPj0gY2FjaGVkUnVsZS5leHBpcmVzKSB7XG4gICAgICAvLyBJZiBkb2N1bWVudGF0aW9uIGlzIHN0YWxlLCBjbGVhciBjYWNoZVxuICAgICAgZG9jc1J1bGVDYWNoZS5kZWxldGUocnVsZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNhY2hlZFJ1bGUuZG9jdW1lbnRhdGlvblxuICAgIH1cbiAgfVxuXG4gIGxldCByYXdSdWxlc0RvY1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKERPQ19VUkwpXG4gIGlmIChyZXNwb25zZS5vaykge1xuICAgIHJhd1J1bGVzRG9jID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGAqKipcXG5FcnJvciByZXRyaWV2aW5nIGRvY3VtZW50YXRpb246ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gXG4gIH1cblxuICBjb25zdCBieUxpbmUgPSByYXdSdWxlc0RvYy5zcGxpdCgnXFxuJylcbiAgY29uc3QgcnVsZUluZGV4ZXMgPSBieUxpbmUucmVkdWNlKFxuICAgIChhY2MsIGxpbmUsIGlkeCkgPT4gKGxpbmUubWF0Y2goUlVMRV9JTkRFWF9SRUdFWCkgPyBhY2MuY29uY2F0KFtbaWR4LCBsaW5lXV0pIDogYWNjKSxcbiAgICBbXSxcbiAgKVxuXG4gIHJ1bGVJbmRleGVzLmZvckVhY2goKFtzdGFydGluZ0luZGV4LCBzdGFydGluZ0xpbmVdKSA9PiB7XG4gICAgY29uc3QgcnVsZU5hbWUgPSBSVUxFX0lOREVYX1JFR0VYLmV4ZWMoc3RhcnRpbmdMaW5lKVsxXVxuXG4gICAgaWYgKHJ1bGVOYW1lID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IGJlZ2luU2VhcmNoID0gYnlMaW5lLnNsaWNlKHN0YXJ0aW5nSW5kZXggKyAxKVxuXG4gICAgLy8gZ29iYmxlIGFsbCB0aGUgZG9jdW1lbnRhdGlvbiB1bnRpbCB5b3UgcmVhY2ggdGhlIG5leHQgcnVsZVxuICAgIGNvbnN0IHJhd1J1bGVEb2MgPSB0YWtlV2hpbGUoYmVnaW5TZWFyY2gsICh4KSA9PiAheC5tYXRjaChSVUxFX0lOREVYX1JFR0VYKSlcbiAgICBjb25zdCBkb2N1bWVudGF0aW9uID0gJ1xcbicuY29uY2F0KHJhd1J1bGVEb2Muam9pbignXFxuJykpXG5cbiAgICBkb2NzUnVsZUNhY2hlLnNldChydWxlTmFtZSwge1xuICAgICAgZG9jdW1lbnRhdGlvbixcbiAgICAgIGV4cGlyZXM6IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgRE9DVU1FTlRBVElPTl9MSUZFVElNRSxcbiAgICB9KVxuICB9KVxuXG4gIGlmICghZG9jc1J1bGVDYWNoZS5oYXMocnVsZSkpIHtcbiAgICByZXR1cm4gTk9fRE9DX01TR1xuICB9XG5cbiAgcmV0dXJuIGRvY3NSdWxlQ2FjaGUuZ2V0KHJ1bGUpLmRvY3VtZW50YXRpb25cbn1cbiJdfQ==