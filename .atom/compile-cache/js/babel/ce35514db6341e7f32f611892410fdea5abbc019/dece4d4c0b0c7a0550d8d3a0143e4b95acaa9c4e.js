'use babel';

// More types support please refer to esprima source code
Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var SINGLE_TAG_TYPE = ['ClassDeclaration', 'ExpressionStatement', 'ExportDefaultDeclaration', 'ExportNamedDeclaration', 'FunctionDeclaration', 'MethodDefinition'];
var MULTI_TAGS_TYPE = ['ImportDeclaration', 'VariableDeclaration'];

exports['default'] = {

  init: function init() {
    this.esprima = require('esprima');
  },

  parseFile: _asyncToGenerator(function* (ctx) {
    if (!this.esprima) this.init();

    var self = this,
        esprima = this.esprima,
        tags = {};

    var ast = undefined;
    try {
      ast = esprima.parseScript(ctx.content, {
        loc: true,
        tolerant: true
      });
    } catch (e) {
      console.error(e + '\n\nTry to use other parsing solution...');
      // return {
      //     err: `Error!!!\nLine number: ${e.lineNumber}\nDescription: ${e.description}`
      // };
      var jsctags = require('./javascript-sub');
      return yield jsctags.parseFile(ctx);
    }

    this.parseDeclar(tags, ast.body);
    // Parent of first level node is script
    for (var i in tags) {
      tags[i].parent = null;
    }return {
      list: {},
      tree: tags
    };
  }),

  parseDeclar: function parseDeclar(tags, ast) {
    var self = this;
    ast.forEach(function (i) {
      var type = i.type,
          child = null,
          name = undefined,
          id = undefined;

      if (SINGLE_TAG_TYPE.includes(type)) {
        var line = i.loc.start.line;

        if ('ClassDeclaration' === type) {
          name = i.id.name;
          id = line + '-' + name;
          type = 'class';

          if (i.body.body.length > 0) {
            child = {};
            self.parseDeclar(child, i.body.body);
          }
        }

        // Only for `module.exports` now
        else if ('ExpressionStatement' === type) {
            var left = i.expression.left,
                right = i.expression.right;
            if (!left || !left.object || !left.property || !right) return;

            if ('module' !== left.object.name || 'exports' !== left.property.name) return;
            if ('ClassExpression' !== right.type && 'ObjectExpression' !== right.type) return;

            name = 'exports';
            id = line + '-' + name;
            type = 'class';
            child = {};

            if ('ClassExpression' === right.type) self.parseDeclar(child, right.body.body);else if ('ObjectExpression' === right.type) self.parseExpr(child, right.properties);
          }

          /*
           *  Pattern: export default expression;
           */
          else if ('ExportDefaultDeclaration' === type) {
              name = 'export default';
              id = line + '-' + name;
              type = 'class';

              var dec = i.declaration;

              // Ignore 'export default XXX;', XXX should have been parsed before
              if ('ObjectExpression' === dec.type && dec.properties.length > 0) {
                child = {};
                self.parseExpr(child, dec.properties);
              } else if ('ClassDeclaration' === dec.type && dec.body.body.length > 0) {
                child = {};
                self.parseExpr(child, dec.body.body);
              } else if ('FunctionDeclaration' === dec.type && dec.body.body.length > 0) {
                type = 'function';
                child = {};
                self.parseDeclar(child, dec.body.body);
              }
            }

            /*
             *  Pattern: export declaration. Declarations could be:
             *    - class Foo {}
             *    - function Foo {}
             */
            else if ('ExportNamedDeclaration' === type) {
                var dec = i.declaration;

                if (!dec) {
                  return;

                  // TODO: for the case 'export { A, B }'
                  if (dec.specifiers.length) {}
                }

                name = dec.id.name;
                id = line + '-' + name;
                type = 'class';

                // Do not support variables now
                if (!name) return;

                if ('ClassDeclaration' === dec.type && dec.body.body.length > 0) {
                  child = {};
                  self.parseExpr(child, dec.body.body);
                } else if ('FunctionDeclaration' === dec.type && dec.body.body.length > 0) {
                  type = 'function';
                  child = {};
                  self.parseDeclar(child, dec.body.body);
                }
              } else if ('FunctionDeclaration' === type) {
                (function () {
                  var params = [];
                  i.params.forEach(function (p) {
                    params.push(p.name);
                  });
                  name = i.id.name + '(' + params.join(', ') + ')';
                  id = line + '-' + i.id.name + '()';
                  type = 'function';

                  if (i.body.body.length > 0) {
                    child = {};
                    self.parseDeclar(child, i.body.body);
                  }
                })();
              } else if ('MethodDefinition' === type) {
                (function () {
                  var params = [];
                  i.value.params.forEach(function (p) {
                    params.push(p.name);
                  });
                  name = i.key.name + '(' + params.join(', ') + ')';
                  id = line + '-' + i.key.name + '()';
                  type = 'method';

                  if (i.value.body.body.length > 0) {
                    child = {};
                    self.parseDeclar(child, i.value.body.body);
                  }
                })();
              }

        tags[id] = {
          name: name,
          type: type,
          lineno: line,
          parent: ast,
          child: child,
          id: id
        };
      } else if (MULTI_TAGS_TYPE.includes(type)) {

        if ('ImportDeclaration' === type) {
          i.specifiers.forEach(function (sp) {
            var line = sp.loc.start.line;
            name = sp.local.name;
            id = line + '-' + name;
            type = 'import';

            tags[id] = {
              name: name,
              type: type,
              lineno: line,
              parent: ast,
              child: child,
              id: id
            };
          });
        } else if ('VariableDeclaration' === type) {
          i.declarations.forEach(function (v) {
            var line = v.loc.start.line;
            name = v.id.name;
            id = line + '-' + name;
            type = 'var';

            if (v.init && 'CallExpression' === v.init.type) {
              var method = v.init.callee.property;
              if (method && method.name === 'extend') {
                child = {};
                v.init.arguments.forEach(function (i) {
                  if (i.properties) self.parseExpr(child, i.properties);
                });
              }
            } else if (v.init && 'ObjectExpression' === v.init.type) {
              if (v.init.properties.length > 0) {
                child = {};
                self.parseExpr(child, v.init.properties);
              }
            }

            tags[id] = {
              name: name,
              type: type,
              lineno: line,
              parent: ast,
              child: child,
              id: id
            };
          });
        }
      }
    });
  },

  parseExpr: function parseExpr(tags, ast) {
    var self = this;
    ast.forEach(function (i) {
      var type = i.value.type,
          line = i.loc.start.line,
          child = null,
          name = undefined,
          id = undefined;

      if ('FunctionExpression' === type) {
        (function () {
          var params = [];
          i.value.params.forEach(function (p) {
            params.push(p.name);
          });

          name = i.key.name + '(' + params.join(', ') + ')';
          id = line + '-' + i.key.name + '()';
          type = 'function';

          if (i.value.body.body.length > 0) {
            child = {};
            self.parseDeclar(child, i.value.body.body);
          }

          tags[id] = {
            name: name,
            type: type,
            lineno: line,
            parent: ast,
            child: child,
            id: id
          };
        })();
      } else {
        type = 'prop';
        name = i.key.value;
        if (i.key.value) name = i.key.value;else name = i.key.name;
        id = line + '-' + name;

        if (i.value.properties && i.value.properties.length > 0) {
          child = {};
          self.parseExpr(child, i.value.properties);
        }

        tags[id] = {
          name: name,
          type: type,
          lineno: line,
          parent: ast,
          child: child,
          id: id
        };
      }
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi90YWctZ2VuZXJhdG9ycy9qYXZhc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7O0FBR1osSUFBTSxlQUFlLEdBQUcsQ0FDdEIsa0JBQWtCLEVBQ2xCLHFCQUFxQixFQUNyQiwwQkFBMEIsRUFDMUIsd0JBQXdCLEVBQ3hCLHFCQUFxQixFQUNyQixrQkFBa0IsQ0FDbkIsQ0FBQztBQUNGLElBQU0sZUFBZSxHQUFHLENBQ3RCLG1CQUFtQixFQUNuQixxQkFBcUIsQ0FDdEIsQ0FBQzs7cUJBRWE7O0FBRWIsTUFBSSxFQUFBLGdCQUFHO0FBQ0wsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDbkM7O0FBRUQsQUFBTSxXQUFTLG9CQUFBLFdBQUMsR0FBRyxFQUFFO0FBQ25CLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFL0IsUUFBTSxJQUFJLEdBQUcsSUFBSTtRQUNmLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTztRQUN0QixJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVaLFFBQUksR0FBRyxZQUFBLENBQUM7QUFDUixRQUFJO0FBQ0YsU0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtBQUNyQyxXQUFHLEVBQUUsSUFBSTtBQUNULGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUMsQ0FBQztLQUNKLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixhQUFPLENBQUMsS0FBSyxDQUFJLENBQUMsOENBQTJDLENBQUM7Ozs7QUFJOUQsVUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUMsYUFBUSxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUU7S0FDdkM7O0FBRUQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVqQyxTQUFLLElBQUksQ0FBQyxJQUFJLElBQUk7QUFBRSxVQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztLQUFBLEFBRTFDLE9BQU87QUFDTCxVQUFJLEVBQUUsRUFBRTtBQUNSLFVBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQztHQUNILENBQUE7O0FBRUQsYUFBVyxFQUFBLHFCQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDckIsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLE9BQUcsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDZixVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTtVQUNmLEtBQUssR0FBRyxJQUFJO1VBQ1osSUFBSSxZQUFBO1VBQUUsRUFBRSxZQUFBLENBQUM7O0FBRVgsVUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ2xDLFlBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs7QUFFOUIsWUFBSSxrQkFBa0IsS0FBSyxJQUFJLEVBQUU7QUFDL0IsY0FBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQ2pCLFlBQUUsR0FBTSxJQUFJLFNBQUksSUFBSSxBQUFFLENBQUM7QUFDdkIsY0FBSSxHQUFHLE9BQU8sQ0FBQzs7QUFFZixjQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDMUIsaUJBQUssR0FBRyxFQUFFLENBQUM7QUFDWCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUN0QztTQUNGOzs7YUFHSSxJQUFJLHFCQUFxQixLQUFLLElBQUksRUFBRTtBQUN2QyxnQkFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJO2dCQUMxQixLQUFLLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7QUFDN0IsZ0JBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPOztBQUU5RCxnQkFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksU0FBUyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU87QUFDOUUsZ0JBQUksaUJBQWlCLEtBQUssS0FBSyxDQUFDLElBQUksSUFBSSxrQkFBa0IsS0FBSyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU87O0FBRWxGLGdCQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ2pCLGNBQUUsR0FBTSxJQUFJLFNBQUksSUFBSSxBQUFFLENBQUM7QUFDdkIsZ0JBQUksR0FBRyxPQUFPLENBQUM7QUFDZixpQkFBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFWCxnQkFBSSxpQkFBaUIsS0FBSyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FDMUUsSUFBSSxrQkFBa0IsS0FBSyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztXQUNyRjs7Ozs7ZUFLSSxJQUFJLDBCQUEwQixLQUFLLElBQUksRUFBRTtBQUM1QyxrQkFBSSxHQUFHLGdCQUFnQixDQUFDO0FBQ3hCLGdCQUFFLEdBQU0sSUFBSSxTQUFJLElBQUksQUFBRSxDQUFDO0FBQ3ZCLGtCQUFJLEdBQUcsT0FBTyxDQUFDOztBQUVmLGtCQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDOzs7QUFHeEIsa0JBQUksa0JBQWtCLEtBQUssR0FBRyxDQUFDLElBQUksSUFDL0IsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUM3QjtBQUNFLHFCQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ1gsb0JBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztlQUN2QyxNQUNJLElBQUksa0JBQWtCLEtBQUssR0FBRyxDQUFDLElBQUksSUFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDbEM7QUFDRSxxQkFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLG9CQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2VBQ3RDLE1BQ0ksSUFBSSxxQkFBcUIsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNsQztBQUNFLG9CQUFJLEdBQUcsVUFBVSxDQUFDO0FBQ2xCLHFCQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ1gsb0JBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7ZUFDeEM7YUFDRjs7Ozs7OztpQkFPSSxJQUFJLHdCQUF3QixLQUFLLElBQUksRUFBRTtBQUMxQyxvQkFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQzs7QUFFeEIsb0JBQUksQ0FBQyxHQUFHLEVBQUU7QUFDUix5QkFBTzs7O0FBR1Asc0JBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtpQkFDOUI7O0FBRUQsb0JBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztBQUNuQixrQkFBRSxHQUFNLElBQUksU0FBSSxJQUFJLEFBQUUsQ0FBQztBQUN2QixvQkFBSSxHQUFHLE9BQU8sQ0FBQzs7O0FBR2Ysb0JBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFbEIsb0JBQUksa0JBQWtCLEtBQUssR0FBRyxDQUFDLElBQUksSUFDL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDNUI7QUFDRSx1QkFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLHNCQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN0QyxNQUNJLElBQUkscUJBQXFCLEtBQUssR0FBRyxDQUFDLElBQUksSUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDbEM7QUFDRSxzQkFBSSxHQUFHLFVBQVUsQ0FBQztBQUNsQix1QkFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLHNCQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN4QztlQUVGLE1BRUksSUFBSSxxQkFBcUIsS0FBSyxJQUFJLEVBQUU7O0FBQ3ZDLHNCQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsbUJBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxFQUFJO0FBQ3BCLDBCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzttQkFDckIsQ0FBQyxDQUFDO0FBQ0gsc0JBQUksR0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksU0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUM7QUFDNUMsb0JBQUUsR0FBTSxJQUFJLFNBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE9BQUksQ0FBQztBQUM5QixzQkFBSSxHQUFHLFVBQVUsQ0FBQzs7QUFFbEIsc0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMxQix5QkFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLHdCQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO21CQUN0Qzs7ZUFDRixNQUVJLElBQUksa0JBQWtCLEtBQUssSUFBSSxFQUFFOztBQUNwQyxzQkFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLG1CQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDMUIsMEJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO21CQUNyQixDQUFDLENBQUM7QUFDSCxzQkFBSSxHQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQztBQUM3QyxvQkFBRSxHQUFNLElBQUksU0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksT0FBSSxDQUFDO0FBQy9CLHNCQUFJLEdBQUcsUUFBUSxDQUFDOztBQUVoQixzQkFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyx5QkFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLHdCQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzttQkFDNUM7O2VBQ0Y7O0FBRUQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsY0FBSSxFQUFFLElBQUk7QUFDVixjQUFJLEVBQUUsSUFBSTtBQUNWLGdCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFNLEVBQUUsR0FBRztBQUNYLGVBQUssRUFBRSxLQUFLO0FBQ1osWUFBRSxFQUFFLEVBQUU7U0FDUCxDQUFDO09BRUgsTUFBTSxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7O0FBRXpDLFlBQUksbUJBQW1CLEtBQUssSUFBSSxFQUFFO0FBQ2hDLFdBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxFQUFJO0FBQ3pCLGdCQUFJLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDN0IsZ0JBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUNyQixjQUFFLEdBQU0sSUFBSSxTQUFJLElBQUksQUFBRSxDQUFDO0FBQ3ZCLGdCQUFJLEdBQUcsUUFBUSxDQUFDOztBQUVoQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1Qsa0JBQUksRUFBRSxJQUFJO0FBQ1Ysa0JBQUksRUFBRSxJQUFJO0FBQ1Ysb0JBQU0sRUFBRSxJQUFJO0FBQ1osb0JBQU0sRUFBRSxHQUFHO0FBQ1gsbUJBQUssRUFBRSxLQUFLO0FBQ1osZ0JBQUUsRUFBRSxFQUFFO2FBQ1AsQ0FBQTtXQUNGLENBQUMsQ0FBQztTQUNKLE1BRUksSUFBSSxxQkFBcUIsS0FBSyxJQUFJLEVBQUU7QUFDdkMsV0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDMUIsZ0JBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUM1QixnQkFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQ2pCLGNBQUUsR0FBTSxJQUFJLFNBQUksSUFBSSxBQUFFLENBQUM7QUFDdkIsZ0JBQUksR0FBRyxLQUFLLENBQUM7O0FBRWIsZ0JBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUM5QyxrQkFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3BDLGtCQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUN0QyxxQkFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLGlCQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDNUIsc0JBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ3ZELENBQUMsQ0FBQztlQUNKO2FBQ0YsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksa0JBQWtCLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDdkQsa0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxxQkFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLG9CQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2VBQzFDO2FBQ0Y7O0FBRUQsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRztBQUNULGtCQUFJLEVBQUUsSUFBSTtBQUNWLGtCQUFJLEVBQUUsSUFBSTtBQUNWLG9CQUFNLEVBQUUsSUFBSTtBQUNaLG9CQUFNLEVBQUUsR0FBRztBQUNYLG1CQUFLLEVBQUUsS0FBSztBQUNaLGdCQUFFLEVBQUUsRUFBRTthQUNQLENBQUE7V0FDRixDQUFDLENBQUM7U0FDSjtPQUNGO0tBQ0YsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQsV0FBUyxFQUFBLG1CQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDbkIsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLE9BQUcsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDZixVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUk7VUFDckIsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUk7VUFDdkIsS0FBSyxHQUFHLElBQUk7VUFDWixJQUFJLFlBQUE7VUFBRSxFQUFFLFlBQUEsQ0FBQzs7QUFFWCxVQUFJLG9CQUFvQixLQUFLLElBQUksRUFBRTs7QUFDakMsY0FBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFdBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUMxQixrQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDckIsQ0FBQyxDQUFDOztBQUVILGNBQUksR0FBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksU0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUM7QUFDN0MsWUFBRSxHQUFNLElBQUksU0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksT0FBSSxDQUFDO0FBQy9CLGNBQUksR0FBRyxVQUFVLENBQUM7O0FBRWxCLGNBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDaEMsaUJBQUssR0FBRyxFQUFFLENBQUM7QUFDWCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDNUM7O0FBRUQsY0FBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsZ0JBQUksRUFBRSxJQUFJO0FBQ1YsZ0JBQUksRUFBRSxJQUFJO0FBQ1Ysa0JBQU0sRUFBRSxJQUFJO0FBQ1osa0JBQU0sRUFBRSxHQUFHO0FBQ1gsaUJBQUssRUFBRSxLQUFLO0FBQ1osY0FBRSxFQUFFLEVBQUU7V0FDUCxDQUFDOztPQUNILE1BQU07QUFDTCxZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsWUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ25CLFlBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQy9CLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztBQUN2QixVQUFFLEdBQU0sSUFBSSxTQUFJLElBQUksQUFBRSxDQUFDOztBQUV2QixZQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdkQsZUFBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLGNBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDM0M7O0FBRUQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHO0FBQ1QsY0FBSSxFQUFFLElBQUk7QUFDVixjQUFJLEVBQUUsSUFBSTtBQUNWLGdCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFNLEVBQUUsR0FBRztBQUNYLGVBQUssRUFBRSxLQUFLO0FBQ1osWUFBRSxFQUFFLEVBQUU7U0FDUCxDQUFDO09BQ0g7S0FDRixDQUFDLENBQUM7R0FDSjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi90YWctZ2VuZXJhdG9ycy9qYXZhc2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIE1vcmUgdHlwZXMgc3VwcG9ydCBwbGVhc2UgcmVmZXIgdG8gZXNwcmltYSBzb3VyY2UgY29kZVxuY29uc3QgU0lOR0xFX1RBR19UWVBFID0gW1xuICAnQ2xhc3NEZWNsYXJhdGlvbicsXG4gICdFeHByZXNzaW9uU3RhdGVtZW50JyxcbiAgJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbicsXG4gICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJyxcbiAgJ0Z1bmN0aW9uRGVjbGFyYXRpb24nLFxuICAnTWV0aG9kRGVmaW5pdGlvbidcbl07XG5jb25zdCBNVUxUSV9UQUdTX1RZUEUgPSBbXG4gICdJbXBvcnREZWNsYXJhdGlvbicsXG4gICdWYXJpYWJsZURlY2xhcmF0aW9uJ1xuXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5lc3ByaW1hID0gcmVxdWlyZSgnZXNwcmltYScpO1xuICB9LFxuXG4gIGFzeW5jIHBhcnNlRmlsZShjdHgpIHtcbiAgICBpZiAoIXRoaXMuZXNwcmltYSkgdGhpcy5pbml0KCk7XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcyxcbiAgICAgIGVzcHJpbWEgPSB0aGlzLmVzcHJpbWEsXG4gICAgICB0YWdzID0ge307XG5cbiAgICBsZXQgYXN0O1xuICAgIHRyeSB7XG4gICAgICBhc3QgPSBlc3ByaW1hLnBhcnNlU2NyaXB0KGN0eC5jb250ZW50LCB7XG4gICAgICAgIGxvYzogdHJ1ZSxcbiAgICAgICAgdG9sZXJhbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYCR7ZX1cXG5cXG5UcnkgdG8gdXNlIG90aGVyIHBhcnNpbmcgc29sdXRpb24uLi5gKTtcbiAgICAgIC8vIHJldHVybiB7XG4gICAgICAvLyAgICAgZXJyOiBgRXJyb3IhISFcXG5MaW5lIG51bWJlcjogJHtlLmxpbmVOdW1iZXJ9XFxuRGVzY3JpcHRpb246ICR7ZS5kZXNjcmlwdGlvbn1gXG4gICAgICAvLyB9O1xuICAgICAgY29uc3QganNjdGFncyA9IHJlcXVpcmUoJy4vamF2YXNjcmlwdC1zdWInKTtcbiAgICAgIHJldHVybiAoYXdhaXQganNjdGFncy5wYXJzZUZpbGUoY3R4KSk7XG4gICAgfVxuXG4gICAgdGhpcy5wYXJzZURlY2xhcih0YWdzLCBhc3QuYm9keSk7XG4gICAgLy8gUGFyZW50IG9mIGZpcnN0IGxldmVsIG5vZGUgaXMgc2NyaXB0XG4gICAgZm9yIChsZXQgaSBpbiB0YWdzKSB0YWdzW2ldLnBhcmVudCA9IG51bGw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGlzdDoge30sXG4gICAgICB0cmVlOiB0YWdzXG4gICAgfTtcbiAgfSxcblxuICBwYXJzZURlY2xhcih0YWdzLCBhc3QpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBhc3QuZm9yRWFjaChpID0+IHtcbiAgICAgIGxldCB0eXBlID0gaS50eXBlLFxuICAgICAgICBjaGlsZCA9IG51bGwsXG4gICAgICAgIG5hbWUsIGlkO1xuXG4gICAgICBpZiAoU0lOR0xFX1RBR19UWVBFLmluY2x1ZGVzKHR5cGUpKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBpLmxvYy5zdGFydC5saW5lO1xuXG4gICAgICAgIGlmICgnQ2xhc3NEZWNsYXJhdGlvbicgPT09IHR5cGUpIHtcbiAgICAgICAgICBuYW1lID0gaS5pZC5uYW1lO1xuICAgICAgICAgIGlkID0gYCR7bGluZX0tJHtuYW1lfWA7XG4gICAgICAgICAgdHlwZSA9ICdjbGFzcyc7XG5cbiAgICAgICAgICBpZiAoaS5ib2R5LmJvZHkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY2hpbGQgPSB7fTtcbiAgICAgICAgICAgIHNlbGYucGFyc2VEZWNsYXIoY2hpbGQsIGkuYm9keS5ib2R5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPbmx5IGZvciBgbW9kdWxlLmV4cG9ydHNgIG5vd1xuICAgICAgICBlbHNlIGlmICgnRXhwcmVzc2lvblN0YXRlbWVudCcgPT09IHR5cGUpIHtcbiAgICAgICAgICBsZXQgbGVmdCA9IGkuZXhwcmVzc2lvbi5sZWZ0LFxuICAgICAgICAgICAgcmlnaHQgPSBpLmV4cHJlc3Npb24ucmlnaHQ7XG4gICAgICAgICAgaWYgKCFsZWZ0IHx8ICFsZWZ0Lm9iamVjdCB8fCAhbGVmdC5wcm9wZXJ0eSB8fCAhcmlnaHQpIHJldHVybjtcblxuICAgICAgICAgIGlmICgnbW9kdWxlJyAhPT0gbGVmdC5vYmplY3QubmFtZSB8fCAnZXhwb3J0cycgIT09IGxlZnQucHJvcGVydHkubmFtZSkgcmV0dXJuO1xuICAgICAgICAgIGlmICgnQ2xhc3NFeHByZXNzaW9uJyAhPT0gcmlnaHQudHlwZSAmJiAnT2JqZWN0RXhwcmVzc2lvbicgIT09IHJpZ2h0LnR5cGUpIHJldHVybjtcblxuICAgICAgICAgIG5hbWUgPSAnZXhwb3J0cyc7XG4gICAgICAgICAgaWQgPSBgJHtsaW5lfS0ke25hbWV9YDtcbiAgICAgICAgICB0eXBlID0gJ2NsYXNzJztcbiAgICAgICAgICBjaGlsZCA9IHt9O1xuXG4gICAgICAgICAgaWYgKCdDbGFzc0V4cHJlc3Npb24nID09PSByaWdodC50eXBlKSBzZWxmLnBhcnNlRGVjbGFyKGNoaWxkLCByaWdodC5ib2R5LmJvZHkpO1xuICAgICAgICAgIGVsc2UgaWYgKCdPYmplY3RFeHByZXNzaW9uJyA9PT0gcmlnaHQudHlwZSkgc2VsZi5wYXJzZUV4cHIoY2hpbGQsIHJpZ2h0LnByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogIFBhdHRlcm46IGV4cG9ydCBkZWZhdWx0IGV4cHJlc3Npb247XG4gICAgICAgICAqL1xuICAgICAgICBlbHNlIGlmICgnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJyA9PT0gdHlwZSkge1xuICAgICAgICAgIG5hbWUgPSAnZXhwb3J0IGRlZmF1bHQnO1xuICAgICAgICAgIGlkID0gYCR7bGluZX0tJHtuYW1lfWA7XG4gICAgICAgICAgdHlwZSA9ICdjbGFzcyc7XG5cbiAgICAgICAgICBsZXQgZGVjID0gaS5kZWNsYXJhdGlvbjtcblxuICAgICAgICAgIC8vIElnbm9yZSAnZXhwb3J0IGRlZmF1bHQgWFhYOycsIFhYWCBzaG91bGQgaGF2ZSBiZWVuIHBhcnNlZCBiZWZvcmVcbiAgICAgICAgICBpZiAoJ09iamVjdEV4cHJlc3Npb24nID09PSBkZWMudHlwZSAmJlxuICAgICAgICAgICAgICBkZWMucHJvcGVydGllcy5sZW5ndGggPiAwKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNoaWxkID0ge307XG4gICAgICAgICAgICBzZWxmLnBhcnNlRXhwcihjaGlsZCwgZGVjLnByb3BlcnRpZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmICgnQ2xhc3NEZWNsYXJhdGlvbicgPT09IGRlYy50eXBlICYmXG4gICAgICAgICAgICAgICAgICAgIGRlYy5ib2R5LmJvZHkubGVuZ3RoID4gMClcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjaGlsZCA9IHt9O1xuICAgICAgICAgICAgc2VsZi5wYXJzZUV4cHIoY2hpbGQsIGRlYy5ib2R5LmJvZHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmICgnRnVuY3Rpb25EZWNsYXJhdGlvbicgPT09IGRlYy50eXBlICYmXG4gICAgICAgICAgICAgICAgICAgIGRlYy5ib2R5LmJvZHkubGVuZ3RoID4gMClcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlID0gJ2Z1bmN0aW9uJztcbiAgICAgICAgICAgIGNoaWxkID0ge307XG4gICAgICAgICAgICBzZWxmLnBhcnNlRGVjbGFyKGNoaWxkLCBkZWMuYm9keS5ib2R5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgUGF0dGVybjogZXhwb3J0IGRlY2xhcmF0aW9uLiBEZWNsYXJhdGlvbnMgY291bGQgYmU6XG4gICAgICAgICAqICAgIC0gY2xhc3MgRm9vIHt9XG4gICAgICAgICAqICAgIC0gZnVuY3Rpb24gRm9vIHt9XG4gICAgICAgICAqL1xuICAgICAgICBlbHNlIGlmICgnRXhwb3J0TmFtZWREZWNsYXJhdGlvbicgPT09IHR5cGUpIHtcbiAgICAgICAgICBsZXQgZGVjID0gaS5kZWNsYXJhdGlvbjtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoIWRlYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBUT0RPOiBmb3IgdGhlIGNhc2UgJ2V4cG9ydCB7IEEsIEIgfSdcbiAgICAgICAgICAgIGlmIChkZWMuc3BlY2lmaWVycy5sZW5ndGgpIHt9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmFtZSA9IGRlYy5pZC5uYW1lO1xuICAgICAgICAgIGlkID0gYCR7bGluZX0tJHtuYW1lfWA7XG4gICAgICAgICAgdHlwZSA9ICdjbGFzcyc7XG5cbiAgICAgICAgICAvLyBEbyBub3Qgc3VwcG9ydCB2YXJpYWJsZXMgbm93XG4gICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XG5cbiAgICAgICAgICBpZiAoJ0NsYXNzRGVjbGFyYXRpb24nID09PSBkZWMudHlwZSAmJlxuICAgICAgICAgICAgICBkZWMuYm9keS5ib2R5Lmxlbmd0aCA+IDApXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2hpbGQgPSB7fTtcbiAgICAgICAgICAgIHNlbGYucGFyc2VFeHByKGNoaWxkLCBkZWMuYm9keS5ib2R5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoJ0Z1bmN0aW9uRGVjbGFyYXRpb24nID09PSBkZWMudHlwZSAmJlxuICAgICAgICAgICAgICAgICAgICBkZWMuYm9keS5ib2R5Lmxlbmd0aCA+IDApXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZSA9ICdmdW5jdGlvbic7XG4gICAgICAgICAgICBjaGlsZCA9IHt9O1xuICAgICAgICAgICAgc2VsZi5wYXJzZURlY2xhcihjaGlsZCwgZGVjLmJvZHkuYm9keSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIGlmICgnRnVuY3Rpb25EZWNsYXJhdGlvbicgPT09IHR5cGUpIHtcbiAgICAgICAgICBsZXQgcGFyYW1zID0gW107XG4gICAgICAgICAgaS5wYXJhbXMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKHAubmFtZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbmFtZSA9IGAke2kuaWQubmFtZX0oJHtwYXJhbXMuam9pbignLCAnKX0pYDtcbiAgICAgICAgICBpZCA9IGAke2xpbmV9LSR7aS5pZC5uYW1lfSgpYDtcbiAgICAgICAgICB0eXBlID0gJ2Z1bmN0aW9uJztcblxuICAgICAgICAgIGlmIChpLmJvZHkuYm9keS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHt9O1xuICAgICAgICAgICAgc2VsZi5wYXJzZURlY2xhcihjaGlsZCwgaS5ib2R5LmJvZHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2UgaWYgKCdNZXRob2REZWZpbml0aW9uJyA9PT0gdHlwZSkge1xuICAgICAgICAgIGxldCBwYXJhbXMgPSBbXTtcbiAgICAgICAgICBpLnZhbHVlLnBhcmFtcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgcGFyYW1zLnB1c2gocC5uYW1lKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBuYW1lID0gYCR7aS5rZXkubmFtZX0oJHtwYXJhbXMuam9pbignLCAnKX0pYDtcbiAgICAgICAgICBpZCA9IGAke2xpbmV9LSR7aS5rZXkubmFtZX0oKWA7XG4gICAgICAgICAgdHlwZSA9ICdtZXRob2QnO1xuXG4gICAgICAgICAgaWYgKGkudmFsdWUuYm9keS5ib2R5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNoaWxkID0ge307XG4gICAgICAgICAgICBzZWxmLnBhcnNlRGVjbGFyKGNoaWxkLCBpLnZhbHVlLmJvZHkuYm9keSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGFnc1tpZF0gPSB7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgIGxpbmVubzogbGluZSxcbiAgICAgICAgICBwYXJlbnQ6IGFzdCxcbiAgICAgICAgICBjaGlsZDogY2hpbGQsXG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG5cbiAgICAgIH0gZWxzZSBpZiAoTVVMVElfVEFHU19UWVBFLmluY2x1ZGVzKHR5cGUpKSB7XG5cbiAgICAgICAgaWYgKCdJbXBvcnREZWNsYXJhdGlvbicgPT09IHR5cGUpIHtcbiAgICAgICAgICBpLnNwZWNpZmllcnMuZm9yRWFjaChzcCA9PiB7XG4gICAgICAgICAgICBsZXQgbGluZSA9IHNwLmxvYy5zdGFydC5saW5lO1xuICAgICAgICAgICAgbmFtZSA9IHNwLmxvY2FsLm5hbWU7XG4gICAgICAgICAgICBpZCA9IGAke2xpbmV9LSR7bmFtZX1gO1xuICAgICAgICAgICAgdHlwZSA9ICdpbXBvcnQnO1xuXG4gICAgICAgICAgICB0YWdzW2lkXSA9IHtcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgbGluZW5vOiBsaW5lLFxuICAgICAgICAgICAgICBwYXJlbnQ6IGFzdCxcbiAgICAgICAgICAgICAgY2hpbGQ6IGNoaWxkLFxuICAgICAgICAgICAgICBpZDogaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2UgaWYgKCdWYXJpYWJsZURlY2xhcmF0aW9uJyA9PT0gdHlwZSkge1xuICAgICAgICAgIGkuZGVjbGFyYXRpb25zLmZvckVhY2godiA9PiB7XG4gICAgICAgICAgICBsZXQgbGluZSA9IHYubG9jLnN0YXJ0LmxpbmU7XG4gICAgICAgICAgICBuYW1lID0gdi5pZC5uYW1lO1xuICAgICAgICAgICAgaWQgPSBgJHtsaW5lfS0ke25hbWV9YDtcbiAgICAgICAgICAgIHR5cGUgPSAndmFyJztcblxuICAgICAgICAgICAgaWYgKHYuaW5pdCAmJiAnQ2FsbEV4cHJlc3Npb24nID09PSB2LmluaXQudHlwZSkge1xuICAgICAgICAgICAgICBsZXQgbWV0aG9kID0gdi5pbml0LmNhbGxlZS5wcm9wZXJ0eTtcbiAgICAgICAgICAgICAgaWYgKG1ldGhvZCAmJiBtZXRob2QubmFtZSA9PT0gJ2V4dGVuZCcpIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IHt9O1xuICAgICAgICAgICAgICAgIHYuaW5pdC5hcmd1bWVudHMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChpLnByb3BlcnRpZXMpIHNlbGYucGFyc2VFeHByKGNoaWxkLCBpLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHYuaW5pdCAmJiAnT2JqZWN0RXhwcmVzc2lvbicgPT09IHYuaW5pdC50eXBlKSB7XG4gICAgICAgICAgICAgIGlmICh2LmluaXQucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSB7fTtcbiAgICAgICAgICAgICAgICBzZWxmLnBhcnNlRXhwcihjaGlsZCwgdi5pbml0LnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhZ3NbaWRdID0ge1xuICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICBsaW5lbm86IGxpbmUsXG4gICAgICAgICAgICAgIHBhcmVudDogYXN0LFxuICAgICAgICAgICAgICBjaGlsZDogY2hpbGQsXG4gICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgcGFyc2VFeHByKHRhZ3MsIGFzdCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGFzdC5mb3JFYWNoKGkgPT4ge1xuICAgICAgbGV0IHR5cGUgPSBpLnZhbHVlLnR5cGUsXG4gICAgICAgIGxpbmUgPSBpLmxvYy5zdGFydC5saW5lLFxuICAgICAgICBjaGlsZCA9IG51bGwsXG4gICAgICAgIG5hbWUsIGlkO1xuXG4gICAgICBpZiAoJ0Z1bmN0aW9uRXhwcmVzc2lvbicgPT09IHR5cGUpIHtcbiAgICAgICAgbGV0IHBhcmFtcyA9IFtdO1xuICAgICAgICBpLnZhbHVlLnBhcmFtcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgIHBhcmFtcy5wdXNoKHAubmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5hbWUgPSBgJHtpLmtleS5uYW1lfSgke3BhcmFtcy5qb2luKCcsICcpfSlgO1xuICAgICAgICBpZCA9IGAke2xpbmV9LSR7aS5rZXkubmFtZX0oKWA7XG4gICAgICAgIHR5cGUgPSAnZnVuY3Rpb24nO1xuXG4gICAgICAgIGlmIChpLnZhbHVlLmJvZHkuYm9keS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY2hpbGQgPSB7fTtcbiAgICAgICAgICBzZWxmLnBhcnNlRGVjbGFyKGNoaWxkLCBpLnZhbHVlLmJvZHkuYm9keSk7XG4gICAgICAgIH1cblxuICAgICAgICB0YWdzW2lkXSA9IHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgbGluZW5vOiBsaW5lLFxuICAgICAgICAgIHBhcmVudDogYXN0LFxuICAgICAgICAgIGNoaWxkOiBjaGlsZCxcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHR5cGUgPSAncHJvcCc7XG4gICAgICAgIG5hbWUgPSBpLmtleS52YWx1ZTtcbiAgICAgICAgaWYgKGkua2V5LnZhbHVlKSBuYW1lID0gaS5rZXkudmFsdWU7XG4gICAgICAgIGVsc2UgbmFtZSA9IGkua2V5Lm5hbWU7XG4gICAgICAgIGlkID0gYCR7bGluZX0tJHtuYW1lfWA7XG5cbiAgICAgICAgaWYgKGkudmFsdWUucHJvcGVydGllcyAmJiBpLnZhbHVlLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNoaWxkID0ge307XG4gICAgICAgICAgc2VsZi5wYXJzZUV4cHIoY2hpbGQsIGkudmFsdWUucHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0YWdzW2lkXSA9IHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgbGluZW5vOiBsaW5lLFxuICAgICAgICAgIHBhcmVudDogYXN0LFxuICAgICAgICAgIGNoaWxkOiBjaGlsZCxcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcbiJdfQ==