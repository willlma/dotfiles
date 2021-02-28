(function() {
  var BufferedProcess, CompositeDisposable, RubocopAutoCorrect, fs, path, ref, spawnSync, temp, which;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, BufferedProcess = ref.BufferedProcess;

  spawnSync = require('child_process').spawnSync;

  which = require('which');

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  module.exports = RubocopAutoCorrect = (function() {
    function RubocopAutoCorrect() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          if (editor.getGrammar().scopeName.match("ruby")) {
            return _this.handleEvents(editor);
          }
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'rubocop-auto-correct:current-file': (function(_this) {
          return function() {
            return _this.run(atom.workspace.getActiveTextEditor());
          };
        })(this),
        'rubocop-auto-correct:toggle-auto-run': (function(_this) {
          return function() {
            return _this.toggleAutoRun();
          };
        })(this),
        'rubocop-auto-correct:toggle-notification': (function(_this) {
          return function() {
            return _this.toggleNotification();
          };
        })(this),
        'rubocop-auto-correct:toggle-only-fixes-notification': (function(_this) {
          return function() {
            return _this.toggleOnlyFixesNotification();
          };
        })(this),
        'rubocop-auto-correct:toggle-correct-file': (function(_this) {
          return function() {
            return _this.toggleCorrectFile();
          };
        })(this),
        'rubocop-auto-correct:toggle-debug-mode': (function(_this) {
          return function() {
            return _this.toggleDebugMode();
          };
        })(this)
      }));
    }

    RubocopAutoCorrect.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    RubocopAutoCorrect.prototype.handleEvents = function(editor) {
      var buffer, bufferSavedSubscription, editorDestroyedSubscription;
      buffer = editor.getBuffer();
      bufferSavedSubscription = buffer.onDidSave((function(_this) {
        return function() {
          return buffer.transact(function() {
            if (atom.config.get('rubocop-auto-correct.autoRun')) {
              return _this.run(editor);
            }
          });
        };
      })(this));
      editorDestroyedSubscription = editor.onDidDestroy(function() {
        bufferSavedSubscription.dispose();
        return editorDestroyedSubscription.dispose();
      });
      this.subscriptions.add(bufferSavedSubscription);
      return this.subscriptions.add(editorDestroyedSubscription);
    };

    RubocopAutoCorrect.prototype.toggleMessage = function(messagePrepend, enabled) {
      return "Rubocop Auto Correct: " + messagePrepend + " " + (enabled ? "ON" : "OFF");
    };

    RubocopAutoCorrect.prototype.toggleAutoRun = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.autoRun');
      atom.config.set('rubocop-auto-correct.autoRun', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Auto Run", !setting));
    };

    RubocopAutoCorrect.prototype.toggleNotification = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.notification');
      atom.config.set('rubocop-auto-correct.notification', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Notifications", !setting));
    };

    RubocopAutoCorrect.prototype.toggleOnlyFixesNotification = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.onlyFixesNotification');
      atom.config.set('rubocop-auto-correct.onlyFixesNotification', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Only fixes notification", !setting));
    };

    RubocopAutoCorrect.prototype.toggleCorrectFile = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.correctFile');
      atom.config.set('rubocop-auto-correct.correctFile', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Correct File", !setting));
    };

    RubocopAutoCorrect.prototype.toggleDebugMode = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.debugMode');
      atom.config.set('rubocop-auto-correct.debugMode', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Debug Mode", !setting));
    };

    RubocopAutoCorrect.prototype.run = function(editor) {
      if (!editor) {
        return;
      }
      if (!editor.getGrammar().scopeName.match("ruby")) {
        return atom.notifications.addError("Only use source.ruby");
      }
      if (atom.config.get('rubocop-auto-correct.correctFile')) {
        if (editor.isModified()) {
          editor.save();
        }
        return this.autoCorrectFile(editor);
      } else {
        return this.autoCorrectBuffer(editor);
      }
    };

    RubocopAutoCorrect.prototype.rubocopConfigPath = function(filePath) {
      var configFile, homeConfigPath, projectConfigPath, projectPath, ref1, relativePath;
      configFile = '/.rubocop.yml';
      ref1 = atom.project.relativizePath(filePath), projectPath = ref1[0], relativePath = ref1[1];
      projectConfigPath = projectPath + configFile;
      homeConfigPath = fs.getHomeDirectory() + configFile;
      if (fs.existsSync(projectConfigPath)) {
        return ['--config', projectConfigPath];
      }
      if (fs.existsSync(homeConfigPath)) {
        return ['--config', homeConfigPath];
      }
      return [];
    };

    RubocopAutoCorrect.prototype.rubocopCommand = function() {
      var commandWithArgs;
      commandWithArgs = atom.config.get('rubocop-auto-correct.rubocopCommandPath').concat(" --format json").replace(/--format\s[^(\sj)]+/, "").split(/\s+/).filter(function(i) {
        return i;
      });
      return [commandWithArgs[0], commandWithArgs.slice(1)];
    };

    RubocopAutoCorrect.prototype.autoCorrectBuffer = function(editor) {
      var args, buffer, command, rubocopCommand, tempFilePath;
      buffer = editor.getBuffer();
      tempFilePath = this.makeTempFile("rubocop.rb");
      fs.writeFileSync(tempFilePath, buffer.getText());
      rubocopCommand = this.rubocopCommand();
      command = rubocopCommand[0];
      args = rubocopCommand[1].concat(['-a', tempFilePath]).concat(this.rubocopConfigPath(buffer.getPath()));
      return which(command, (function(_this) {
        return function(err) {
          var rubocop;
          if (err) {
            return _this.rubocopNotFoundError();
          }
          rubocop = spawnSync(command, args, {
            encoding: 'utf-8',
            timeout: 5000
          });
          if (rubocop.stderr) {
            return _this.rubocopOutput({
              "stderr": "" + rubocop.stderr
            });
          }
          buffer.setTextViaDiff(fs.readFileSync(tempFilePath, 'utf-8'));
          return _this.rubocopOutput(JSON.parse(rubocop.stdout));
        };
      })(this));
    };

    RubocopAutoCorrect.prototype.autoCorrectFile = function(editor) {
      var args, buffer, command, filePath, rubocopCommand, stderr, stdout;
      filePath = editor.getPath();
      buffer = editor.getBuffer();
      rubocopCommand = this.rubocopCommand();
      command = rubocopCommand[0];
      args = rubocopCommand[1].concat(['-a', filePath]).concat(this.rubocopConfigPath(filePath));
      stdout = (function(_this) {
        return function(output) {
          _this.rubocopOutput(JSON.parse(output));
          return buffer.reload();
        };
      })(this);
      stderr = (function(_this) {
        return function(output) {
          return _this.rubocopOutput({
            "stderr": "" + output
          });
        };
      })(this);
      return which(command, (function(_this) {
        return function(err) {
          if (err) {
            return _this.rubocopNotFoundError();
          }
          return new BufferedProcess({
            command: command,
            args: args,
            stdout: stdout,
            stderr: stderr
          });
        };
      })(this));
    };

    RubocopAutoCorrect.prototype.rubocopNotFoundError = function() {
      return atom.notifications.addError("Rubocop command is not found.", {
        detail: 'When you don\'t install rubocop yet, Run `gem install rubocop` first.\n\nIf you already installed rubocop,\nPlease check package setting at `Rubocop Command Path`.'
      });
    };

    RubocopAutoCorrect.prototype.rubocopOutput = function(data) {
      var debug, file, j, len, notification, offense, onlyFixesNotification, ref1, results;
      debug = atom.config.get('rubocop-auto-correct.debugMode');
      notification = atom.config.get('rubocop-auto-correct.notification');
      onlyFixesNotification = atom.config.get('rubocop-auto-correct.onlyFixesNotification');
      if (debug) {
        console.log(data);
      }
      if (data.stderr) {
        if (notification) {
          atom.notifications.addError(data.stderr);
        }
        return;
      }
      if (data.summary.offense_count === 0) {
        if (!onlyFixesNotification) {
          if (notification) {
            atom.notifications.addSuccess("No offenses found");
          }
        }
        return;
      }
      if (!onlyFixesNotification) {
        if (notification) {
          atom.notifications.addWarning(data.summary.offense_count + " offenses found!");
        }
      }
      ref1 = data.files;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        file = ref1[j];
        results.push((function() {
          var k, len1, ref2, results1;
          ref2 = file.offenses;
          results1 = [];
          for (k = 0, len1 = ref2.length; k < len1; k++) {
            offense = ref2[k];
            if (offense.corrected) {
              if (notification) {
                results1.push(atom.notifications.addSuccess("Line: " + offense.location.line + ", Col:" + offense.location.column + " (FIXED)", {
                  detail: "" + offense.message
                }));
              } else {
                results1.push(void 0);
              }
            } else {
              if (!onlyFixesNotification) {
                if (notification) {
                  results1.push(atom.notifications.addWarning("Line: " + offense.location.line + ", Col:" + offense.location.column, {
                    detail: "" + offense.message
                  }));
                } else {
                  results1.push(void 0);
                }
              } else {
                results1.push(void 0);
              }
            }
          }
          return results1;
        })());
      }
      return results;
    };

    RubocopAutoCorrect.prototype.makeTempFile = function(filename) {
      var directory, filePath;
      directory = temp.mkdirSync();
      filePath = path.join(directory, filename);
      fs.writeFileSync(filePath, '');
      return filePath;
    };

    return RubocopAutoCorrect;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcnVib2NvcC1hdXRvLWNvcnJlY3QvbGliL3J1Ym9jb3AtYXV0by1jb3JyZWN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDckIsWUFBYSxPQUFBLENBQVEsZUFBUjs7RUFDZCxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0VBQ1IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLDRCQUFBO01BQ1gsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtVQUNuRCxJQUFHLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFTLENBQUMsS0FBOUIsQ0FBb0MsTUFBcEMsQ0FBSDttQkFDRSxLQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFERjs7UUFEbUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQW5CO01BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7UUFBQSxtQ0FBQSxFQUFxQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNuQyxLQUFDLENBQUEsR0FBRCxDQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFMO1VBRG1DO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQztRQUVBLHNDQUFBLEVBQXdDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGFBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZ4QztRQUdBLDBDQUFBLEVBQTRDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGtCQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FINUM7UUFJQSxxREFBQSxFQUF1RCxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNyRCxLQUFDLENBQUEsMkJBQUQsQ0FBQTtVQURxRDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKdkQ7UUFNQSwwQ0FBQSxFQUE0QyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxpQkFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTjVDO1FBT0Esd0NBQUEsRUFBMEMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUDFDO09BRGlCLENBQW5CO0lBTlc7O2lDQWdCYixPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRE87O2lDQUdULFlBQUEsR0FBYyxTQUFDLE1BQUQ7QUFDWixVQUFBO01BQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFDVCx1QkFBQSxHQUEwQixNQUFNLENBQUMsU0FBUCxDQUFpQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3pDLE1BQU0sQ0FBQyxRQUFQLENBQWdCLFNBQUE7WUFDZCxJQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQWhCO3FCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxFQUFBOztVQURjLENBQWhCO1FBRHlDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtNQUkxQiwyQkFBQSxHQUE4QixNQUFNLENBQUMsWUFBUCxDQUFvQixTQUFBO1FBQ2hELHVCQUF1QixDQUFDLE9BQXhCLENBQUE7ZUFDQSwyQkFBMkIsQ0FBQyxPQUE1QixDQUFBO01BRmdELENBQXBCO01BSTlCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQix1QkFBbkI7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsMkJBQW5CO0lBWFk7O2lDQWFkLGFBQUEsR0FBZSxTQUFDLGNBQUQsRUFBaUIsT0FBakI7YUFDYix3QkFBQSxHQUEwQixjQUExQixHQUEyQyxHQUEzQyxHQUNFLENBQUksT0FBSCxHQUFnQixJQUFoQixHQUEwQixLQUEzQjtJQUZXOztpQ0FJZixhQUFBLEdBQWUsU0FBQTtBQUNiLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQjtNQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsQ0FBQyxPQUFqRDthQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFmLEVBQTJCLENBQUMsT0FBNUIsQ0FBOUI7SUFIYTs7aUNBS2Ysa0JBQUEsR0FBb0IsU0FBQTtBQUNsQixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQ0FBaEI7TUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLEVBQXFELENBQUMsT0FBdEQ7YUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLElBQUMsQ0FBQSxhQUFELENBQWUsZUFBZixFQUFnQyxDQUFDLE9BQWpDLENBQTlCO0lBSGtCOztpQ0FLcEIsMkJBQUEsR0FBNkIsU0FBQTtBQUMzQixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0Q0FBaEI7TUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNENBQWhCLEVBQThELENBQUMsT0FBL0Q7YUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQ0UsSUFBQyxDQUFBLGFBQUQsQ0FBZSx5QkFBZixFQUEwQyxDQUFDLE9BQTNDLENBREY7SUFIMkI7O2lDQU83QixpQkFBQSxHQUFtQixTQUFBO0FBQ2pCLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQjtNQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsRUFBb0QsQ0FBQyxPQUFyRDthQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsSUFBQyxDQUFBLGFBQUQsQ0FBZSxjQUFmLEVBQStCLENBQUMsT0FBaEMsQ0FBOUI7SUFIaUI7O2lDQUtuQixlQUFBLEdBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEI7TUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLEVBQWtELENBQUMsT0FBbkQ7YUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLElBQUMsQ0FBQSxhQUFELENBQWUsWUFBZixFQUE2QixDQUFDLE9BQTlCLENBQTlCO0lBSGU7O2lDQUtqQixHQUFBLEdBQUssU0FBQyxNQUFEO01BQ0gsSUFBVSxDQUFDLE1BQVg7QUFBQSxlQUFBOztNQUNBLElBQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBUyxDQUFDLEtBQTlCLENBQW9DLE1BQXBDLENBQVA7QUFDRSxlQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsc0JBQTVCLEVBRFQ7O01BRUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBQUg7UUFDRSxJQUFpQixNQUFNLENBQUMsVUFBUCxDQUFBLENBQWpCO1VBQUEsTUFBTSxDQUFDLElBQVAsQ0FBQSxFQUFBOztlQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQWpCLEVBRkY7T0FBQSxNQUFBO2VBSUUsSUFBQyxDQUFBLGlCQUFELENBQW1CLE1BQW5CLEVBSkY7O0lBSkc7O2lDQVVMLGlCQUFBLEdBQW1CLFNBQUMsUUFBRDtBQUNqQixVQUFBO01BQUEsVUFBQSxHQUFhO01BQ2IsT0FBOEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQTlCLEVBQUMscUJBQUQsRUFBYztNQUNkLGlCQUFBLEdBQW9CLFdBQUEsR0FBYztNQUNsQyxjQUFBLEdBQWlCLEVBQUUsQ0FBQyxnQkFBSCxDQUFBLENBQUEsR0FBd0I7TUFDekMsSUFBMkMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxpQkFBZCxDQUEzQztBQUFBLGVBQU8sQ0FBQyxVQUFELEVBQWEsaUJBQWIsRUFBUDs7TUFDQSxJQUF3QyxFQUFFLENBQUMsVUFBSCxDQUFjLGNBQWQsQ0FBeEM7QUFBQSxlQUFPLENBQUMsVUFBRCxFQUFhLGNBQWIsRUFBUDs7YUFDQTtJQVBpQjs7aUNBU25CLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxlQUFBLEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsQ0FDVSxDQUFDLE1BRFgsQ0FDa0IsZ0JBRGxCLENBRVUsQ0FBQyxPQUZYLENBRW1CLHFCQUZuQixFQUUwQyxFQUYxQyxDQUdVLENBQUMsS0FIWCxDQUdpQixLQUhqQixDQUd1QixDQUFDLE1BSHhCLENBRytCLFNBQUMsQ0FBRDtlQUFPO01BQVAsQ0FIL0I7YUFJbEIsQ0FBQyxlQUFnQixDQUFBLENBQUEsQ0FBakIsRUFBcUIsZUFBZ0IsU0FBckM7SUFMYzs7aUNBT2hCLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDtBQUNqQixVQUFBO01BQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFFVCxZQUFBLEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFkO01BQ2YsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsWUFBakIsRUFBK0IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUEvQjtNQUVBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLGNBQUQsQ0FBQTtNQUNqQixPQUFBLEdBQVUsY0FBZSxDQUFBLENBQUE7TUFDekIsSUFBQSxHQUFPLGNBQWUsQ0FBQSxDQUFBLENBQ3BCLENBQUMsTUFESSxDQUNHLENBQUMsSUFBRCxFQUFPLFlBQVAsQ0FESCxDQUVMLENBQUMsTUFGSSxDQUVHLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQW5CLENBRkg7YUFJUCxLQUFBLENBQU0sT0FBTixFQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQ2IsY0FBQTtVQUFBLElBQW1DLEdBQW5DO0FBQUEsbUJBQU8sS0FBQyxDQUFBLG9CQUFELENBQUEsRUFBUDs7VUFDQSxPQUFBLEdBQVUsU0FBQSxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUI7WUFBRSxRQUFBLEVBQVUsT0FBWjtZQUFxQixPQUFBLEVBQVMsSUFBOUI7V0FBekI7VUFDVixJQUEyRCxPQUFPLENBQUMsTUFBbkU7QUFBQSxtQkFBTyxLQUFDLENBQUEsYUFBRCxDQUFlO2NBQUMsUUFBQSxFQUFVLEVBQUEsR0FBRyxPQUFPLENBQUMsTUFBdEI7YUFBZixFQUFQOztVQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEVBQUUsQ0FBQyxZQUFILENBQWdCLFlBQWhCLEVBQThCLE9BQTlCLENBQXRCO2lCQUNBLEtBQUMsQ0FBQSxhQUFELENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFPLENBQUMsTUFBbkIsQ0FBZjtRQUxhO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO0lBWmlCOztpQ0FtQm5CLGVBQUEsR0FBaUIsU0FBQyxNQUFEO0FBQ2YsVUFBQTtNQUFBLFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBUCxDQUFBO01BQ1gsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFFVCxjQUFBLEdBQWlCLElBQUMsQ0FBQSxjQUFELENBQUE7TUFDakIsT0FBQSxHQUFVLGNBQWUsQ0FBQSxDQUFBO01BQ3pCLElBQUEsR0FBTyxjQUFlLENBQUEsQ0FBQSxDQUNwQixDQUFDLE1BREksQ0FDRyxDQUFDLElBQUQsRUFBTyxRQUFQLENBREgsQ0FFTCxDQUFDLE1BRkksQ0FFRyxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsUUFBbkIsQ0FGSDtNQUlQLE1BQUEsR0FBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtVQUNQLEtBQUMsQ0FBQSxhQUFELENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFYLENBQWY7aUJBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBQTtRQUZPO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUdULE1BQUEsR0FBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtpQkFDUCxLQUFDLENBQUEsYUFBRCxDQUFlO1lBQUMsUUFBQSxFQUFVLEVBQUEsR0FBRyxNQUFkO1dBQWY7UUFETztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7YUFHVCxLQUFBLENBQU0sT0FBTixFQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO1VBQ2IsSUFBbUMsR0FBbkM7QUFBQSxtQkFBTyxLQUFDLENBQUEsb0JBQUQsQ0FBQSxFQUFQOztpQkFDQSxJQUFJLGVBQUosQ0FBb0I7WUFBQyxTQUFBLE9BQUQ7WUFBVSxNQUFBLElBQVY7WUFBZ0IsUUFBQSxNQUFoQjtZQUF3QixRQUFBLE1BQXhCO1dBQXBCO1FBRmE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWY7SUFoQmU7O2lDQW9CakIsb0JBQUEsR0FBc0IsU0FBQTthQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQ0UsK0JBREYsRUFFRTtRQUFFLE1BQUEsRUFBUSxxS0FBVjtPQUZGO0lBRG9COztpQ0FVdEIsYUFBQSxHQUFlLFNBQUMsSUFBRDtBQUNiLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQjtNQUNSLFlBQUEsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCO01BQ2YscUJBQUEsR0FDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNENBQWhCO01BRUYsSUFBcUIsS0FBckI7UUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVosRUFBQTs7TUFFQSxJQUFJLElBQUksQ0FBQyxNQUFUO1FBQ0UsSUFBNEMsWUFBNUM7VUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLElBQUksQ0FBQyxNQUFqQyxFQUFBOztBQUNBLGVBRkY7O01BSUEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWIsS0FBOEIsQ0FBbEM7UUFDRSxJQUFHLENBQUMscUJBQUo7VUFDRSxJQUFzRCxZQUF0RDtZQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsbUJBQTlCLEVBQUE7V0FERjs7QUFFQSxlQUhGOztNQUtBLElBQUcsQ0FBQyxxQkFBSjtRQUNFLElBRUssWUFGTDtVQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FDSyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWQsR0FBNEIsa0JBRGhDLEVBQUE7U0FERjs7QUFLQTtBQUFBO1dBQUEsc0NBQUE7Ozs7QUFDRTtBQUFBO2VBQUEsd0NBQUE7O1lBQ0UsSUFBRyxPQUFPLENBQUMsU0FBWDtjQUNFLElBSUssWUFKTDs4QkFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQ0UsUUFBQSxHQUFTLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBMUIsR0FBK0IsUUFBL0IsR0FDTSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BRHZCLEdBQzhCLFVBRmhDLEVBR0U7a0JBQUUsTUFBQSxFQUFRLEVBQUEsR0FBRyxPQUFPLENBQUMsT0FBckI7aUJBSEYsR0FBQTtlQUFBLE1BQUE7c0NBQUE7ZUFERjthQUFBLE1BQUE7Y0FPRSxJQUFHLENBQUMscUJBQUo7Z0JBQ0UsSUFJSyxZQUpMO2dDQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FDRSxRQUFBLEdBQVMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUExQixHQUErQixRQUEvQixHQUNNLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFGekIsRUFHRTtvQkFBRSxNQUFBLEVBQVEsRUFBQSxHQUFHLE9BQU8sQ0FBQyxPQUFyQjttQkFIRixHQUFBO2lCQUFBLE1BQUE7d0NBQUE7aUJBREY7ZUFBQSxNQUFBO3NDQUFBO2VBUEY7O0FBREY7OztBQURGOztJQXRCYTs7aUNBc0NmLFlBQUEsR0FBYyxTQUFDLFFBQUQ7QUFDWixVQUFBO01BQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxTQUFMLENBQUE7TUFDWixRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFFBQXJCO01BQ1gsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsRUFBM0I7YUFDQTtJQUpZOzs7OztBQXpMaEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgQnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUgJ2F0b20nXG57c3Bhd25TeW5jfSA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG53aGljaCA9IHJlcXVpcmUgJ3doaWNoJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG50ZW1wID0gcmVxdWlyZSAndGVtcCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUnVib2NvcEF1dG9Db3JyZWN0XG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBpZiBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZS5tYXRjaChcInJ1YnlcIilcbiAgICAgICAgQGhhbmRsZUV2ZW50cyhlZGl0b3IpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdydWJvY29wLWF1dG8tY29ycmVjdDpjdXJyZW50LWZpbGUnOiA9PlxuICAgICAgICBAcnVuKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgICAgICdydWJvY29wLWF1dG8tY29ycmVjdDp0b2dnbGUtYXV0by1ydW4nOiA9PiBAdG9nZ2xlQXV0b1J1bigpXG4gICAgICAncnVib2NvcC1hdXRvLWNvcnJlY3Q6dG9nZ2xlLW5vdGlmaWNhdGlvbic6ID0+IEB0b2dnbGVOb3RpZmljYXRpb24oKVxuICAgICAgJ3J1Ym9jb3AtYXV0by1jb3JyZWN0OnRvZ2dsZS1vbmx5LWZpeGVzLW5vdGlmaWNhdGlvbic6ID0+XG4gICAgICAgIEB0b2dnbGVPbmx5Rml4ZXNOb3RpZmljYXRpb24oKVxuICAgICAgJ3J1Ym9jb3AtYXV0by1jb3JyZWN0OnRvZ2dsZS1jb3JyZWN0LWZpbGUnOiA9PiBAdG9nZ2xlQ29ycmVjdEZpbGUoKVxuICAgICAgJ3J1Ym9jb3AtYXV0by1jb3JyZWN0OnRvZ2dsZS1kZWJ1Zy1tb2RlJzogPT4gQHRvZ2dsZURlYnVnTW9kZSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBoYW5kbGVFdmVudHM6IChlZGl0b3IpIC0+XG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgYnVmZmVyU2F2ZWRTdWJzY3JpcHRpb24gPSBidWZmZXIub25EaWRTYXZlID0+XG4gICAgICBidWZmZXIudHJhbnNhY3QgPT5cbiAgICAgICAgQHJ1bihlZGl0b3IpIGlmIGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QuYXV0b1J1bicpXG5cbiAgICBlZGl0b3JEZXN0cm95ZWRTdWJzY3JpcHRpb24gPSBlZGl0b3Iub25EaWREZXN0cm95IC0+XG4gICAgICBidWZmZXJTYXZlZFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIGVkaXRvckRlc3Ryb3llZFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChidWZmZXJTYXZlZFN1YnNjcmlwdGlvbilcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yRGVzdHJveWVkU3Vic2NyaXB0aW9uKVxuXG4gIHRvZ2dsZU1lc3NhZ2U6IChtZXNzYWdlUHJlcGVuZCwgZW5hYmxlZCkgLT5cbiAgICBcIlJ1Ym9jb3AgQXV0byBDb3JyZWN0OiBcIisgbWVzc2FnZVByZXBlbmQgKyBcIiBcIiArXG4gICAgICAoaWYgZW5hYmxlZCB0aGVuIFwiT05cIiBlbHNlIFwiT0ZGXCIpXG5cbiAgdG9nZ2xlQXV0b1J1bjogLT5cbiAgICBzZXR0aW5nID0gYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5hdXRvUnVuJylcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmF1dG9SdW4nLCAhc2V0dGluZylcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhAdG9nZ2xlTWVzc2FnZShcIkF1dG8gUnVuXCIsICFzZXR0aW5nKSlcblxuICB0b2dnbGVOb3RpZmljYXRpb246IC0+XG4gICAgc2V0dGluZyA9IGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3Qubm90aWZpY2F0aW9uJylcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0Lm5vdGlmaWNhdGlvbicsICFzZXR0aW5nKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKEB0b2dnbGVNZXNzYWdlKFwiTm90aWZpY2F0aW9uc1wiLCAhc2V0dGluZykpXG5cbiAgdG9nZ2xlT25seUZpeGVzTm90aWZpY2F0aW9uOiAtPlxuICAgIHNldHRpbmcgPSBhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0Lm9ubHlGaXhlc05vdGlmaWNhdGlvbicpXG4gICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5vbmx5Rml4ZXNOb3RpZmljYXRpb24nLCAhc2V0dGluZylcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcbiAgICAgIEB0b2dnbGVNZXNzYWdlKFwiT25seSBmaXhlcyBub3RpZmljYXRpb25cIiwgIXNldHRpbmcpXG4gICAgKVxuXG4gIHRvZ2dsZUNvcnJlY3RGaWxlOiAtPlxuICAgIHNldHRpbmcgPSBhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmNvcnJlY3RGaWxlJylcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmNvcnJlY3RGaWxlJywgIXNldHRpbmcpXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoQHRvZ2dsZU1lc3NhZ2UoXCJDb3JyZWN0IEZpbGVcIiwgIXNldHRpbmcpKVxuXG4gIHRvZ2dsZURlYnVnTW9kZTogLT5cbiAgICBzZXR0aW5nID0gYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5kZWJ1Z01vZGUnKVxuICAgIGF0b20uY29uZmlnLnNldCgncnVib2NvcC1hdXRvLWNvcnJlY3QuZGVidWdNb2RlJywgIXNldHRpbmcpXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoQHRvZ2dsZU1lc3NhZ2UoXCJEZWJ1ZyBNb2RlXCIsICFzZXR0aW5nKSlcblxuICBydW46IChlZGl0b3IpIC0+XG4gICAgcmV0dXJuIGlmICFlZGl0b3JcbiAgICB1bmxlc3MgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUubWF0Y2goXCJydWJ5XCIpXG4gICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiT25seSB1c2Ugc291cmNlLnJ1YnlcIilcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmNvcnJlY3RGaWxlJylcbiAgICAgIGVkaXRvci5zYXZlKCkgaWYgZWRpdG9yLmlzTW9kaWZpZWQoKVxuICAgICAgQGF1dG9Db3JyZWN0RmlsZShlZGl0b3IpXG4gICAgZWxzZVxuICAgICAgQGF1dG9Db3JyZWN0QnVmZmVyKGVkaXRvcilcblxuICBydWJvY29wQ29uZmlnUGF0aDogKGZpbGVQYXRoKSAtPlxuICAgIGNvbmZpZ0ZpbGUgPSAnLy5ydWJvY29wLnltbCdcbiAgICBbcHJvamVjdFBhdGgsIHJlbGF0aXZlUGF0aF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpXG4gICAgcHJvamVjdENvbmZpZ1BhdGggPSBwcm9qZWN0UGF0aCArIGNvbmZpZ0ZpbGVcbiAgICBob21lQ29uZmlnUGF0aCA9IGZzLmdldEhvbWVEaXJlY3RvcnkoKSArIGNvbmZpZ0ZpbGVcbiAgICByZXR1cm4gWyctLWNvbmZpZycsIHByb2plY3RDb25maWdQYXRoXSBpZiAoZnMuZXhpc3RzU3luYyhwcm9qZWN0Q29uZmlnUGF0aCkpXG4gICAgcmV0dXJuIFsnLS1jb25maWcnLCBob21lQ29uZmlnUGF0aF0gaWYgKGZzLmV4aXN0c1N5bmMoaG9tZUNvbmZpZ1BhdGgpKVxuICAgIFtdXG5cbiAgcnVib2NvcENvbW1hbmQ6IC0+XG4gICAgY29tbWFuZFdpdGhBcmdzID0gYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5ydWJvY29wQ29tbWFuZFBhdGgnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KFwiIC0tZm9ybWF0IGpzb25cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLy0tZm9ybWF0XFxzW14oXFxzaildKy8sIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzKy8pLmZpbHRlcigoaSkgLT4gaSlcbiAgICBbY29tbWFuZFdpdGhBcmdzWzBdLCBjb21tYW5kV2l0aEFyZ3NbMS4uXV1cblxuICBhdXRvQ29ycmVjdEJ1ZmZlcjogKGVkaXRvcikgIC0+XG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICB0ZW1wRmlsZVBhdGggPSBAbWFrZVRlbXBGaWxlKFwicnVib2NvcC5yYlwiKVxuICAgIGZzLndyaXRlRmlsZVN5bmModGVtcEZpbGVQYXRoLCBidWZmZXIuZ2V0VGV4dCgpKVxuXG4gICAgcnVib2NvcENvbW1hbmQgPSBAcnVib2NvcENvbW1hbmQoKVxuICAgIGNvbW1hbmQgPSBydWJvY29wQ29tbWFuZFswXVxuICAgIGFyZ3MgPSBydWJvY29wQ29tbWFuZFsxXVxuICAgICAgLmNvbmNhdChbJy1hJywgdGVtcEZpbGVQYXRoXSlcbiAgICAgIC5jb25jYXQoQHJ1Ym9jb3BDb25maWdQYXRoKGJ1ZmZlci5nZXRQYXRoKCkpKVxuXG4gICAgd2hpY2ggY29tbWFuZCwgKGVycikgPT5cbiAgICAgIHJldHVybiBAcnVib2NvcE5vdEZvdW5kRXJyb3IoKSBpZiAoZXJyKVxuICAgICAgcnVib2NvcCA9IHNwYXduU3luYyhjb21tYW5kLCBhcmdzLCB7IGVuY29kaW5nOiAndXRmLTgnLCB0aW1lb3V0OiA1MDAwIH0pXG4gICAgICByZXR1cm4gQHJ1Ym9jb3BPdXRwdXQoe1wic3RkZXJyXCI6IFwiI3tydWJvY29wLnN0ZGVycn1cIn0pIGlmIChydWJvY29wLnN0ZGVycilcbiAgICAgIGJ1ZmZlci5zZXRUZXh0VmlhRGlmZihmcy5yZWFkRmlsZVN5bmModGVtcEZpbGVQYXRoLCAndXRmLTgnKSlcbiAgICAgIEBydWJvY29wT3V0cHV0KEpTT04ucGFyc2UocnVib2NvcC5zdGRvdXQpKVxuXG4gIGF1dG9Db3JyZWN0RmlsZTogKGVkaXRvcikgIC0+XG4gICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICBydWJvY29wQ29tbWFuZCA9IEBydWJvY29wQ29tbWFuZCgpXG4gICAgY29tbWFuZCA9IHJ1Ym9jb3BDb21tYW5kWzBdXG4gICAgYXJncyA9IHJ1Ym9jb3BDb21tYW5kWzFdXG4gICAgICAuY29uY2F0KFsnLWEnLCBmaWxlUGF0aF0pXG4gICAgICAuY29uY2F0KEBydWJvY29wQ29uZmlnUGF0aChmaWxlUGF0aCkpXG5cbiAgICBzdGRvdXQgPSAob3V0cHV0KSA9PlxuICAgICAgQHJ1Ym9jb3BPdXRwdXQoSlNPTi5wYXJzZShvdXRwdXQpKVxuICAgICAgYnVmZmVyLnJlbG9hZCgpXG4gICAgc3RkZXJyID0gKG91dHB1dCkgPT5cbiAgICAgIEBydWJvY29wT3V0cHV0KHtcInN0ZGVyclwiOiBcIiN7b3V0cHV0fVwifSlcblxuICAgIHdoaWNoIGNvbW1hbmQsIChlcnIpID0+XG4gICAgICByZXR1cm4gQHJ1Ym9jb3BOb3RGb3VuZEVycm9yKCkgaWYgKGVycilcbiAgICAgIG5ldyBCdWZmZXJlZFByb2Nlc3Moe2NvbW1hbmQsIGFyZ3MsIHN0ZG91dCwgc3RkZXJyfSlcblxuICBydWJvY29wTm90Rm91bmRFcnJvcjogLT5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICBcIlJ1Ym9jb3AgY29tbWFuZCBpcyBub3QgZm91bmQuXCIsXG4gICAgICB7IGRldGFpbDogJycnXG4gICAgICBXaGVuIHlvdSBkb24ndCBpbnN0YWxsIHJ1Ym9jb3AgeWV0LCBSdW4gYGdlbSBpbnN0YWxsIHJ1Ym9jb3BgIGZpcnN0LlxcblxuICAgICAgSWYgeW91IGFscmVhZHkgaW5zdGFsbGVkIHJ1Ym9jb3AsXG4gICAgICBQbGVhc2UgY2hlY2sgcGFja2FnZSBzZXR0aW5nIGF0IGBSdWJvY29wIENvbW1hbmQgUGF0aGAuXG4gICAgICAnJycgfVxuICAgIClcblxuICBydWJvY29wT3V0cHV0OiAoZGF0YSkgLT5cbiAgICBkZWJ1ZyA9IGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QuZGVidWdNb2RlJylcbiAgICBub3RpZmljYXRpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0Lm5vdGlmaWNhdGlvbicpXG4gICAgb25seUZpeGVzTm90aWZpY2F0aW9uID1cbiAgICAgIGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3Qub25seUZpeGVzTm90aWZpY2F0aW9uJylcblxuICAgIGNvbnNvbGUubG9nKGRhdGEpIGlmIGRlYnVnXG5cbiAgICBpZiAoZGF0YS5zdGRlcnIpXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoZGF0YS5zdGRlcnIpIGlmIG5vdGlmaWNhdGlvblxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAoZGF0YS5zdW1tYXJ5Lm9mZmVuc2VfY291bnQgPT0gMClcbiAgICAgIGlmICFvbmx5Rml4ZXNOb3RpZmljYXRpb25cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJObyBvZmZlbnNlcyBmb3VuZFwiKSBpZiBub3RpZmljYXRpb25cbiAgICAgIHJldHVyblxuXG4gICAgaWYgIW9ubHlGaXhlc05vdGlmaWNhdGlvblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgIFwiI3tkYXRhLnN1bW1hcnkub2ZmZW5zZV9jb3VudH0gb2ZmZW5zZXMgZm91bmQhXCJcbiAgICAgICkgaWYgbm90aWZpY2F0aW9uXG5cbiAgICBmb3IgZmlsZSBpbiBkYXRhLmZpbGVzXG4gICAgICBmb3Igb2ZmZW5zZSBpbiBmaWxlLm9mZmVuc2VzXG4gICAgICAgIGlmIG9mZmVuc2UuY29ycmVjdGVkXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXG4gICAgICAgICAgICBcIkxpbmU6ICN7b2ZmZW5zZS5sb2NhdGlvbi5saW5lfSxcbiAgICAgICAgICAgIENvbDoje29mZmVuc2UubG9jYXRpb24uY29sdW1ufSAoRklYRUQpXCIsXG4gICAgICAgICAgICB7IGRldGFpbDogXCIje29mZmVuc2UubWVzc2FnZX1cIiB9XG4gICAgICAgICAgKSBpZiBub3RpZmljYXRpb25cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICFvbmx5Rml4ZXNOb3RpZmljYXRpb25cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICAgICAgICBcIkxpbmU6ICN7b2ZmZW5zZS5sb2NhdGlvbi5saW5lfSxcbiAgICAgICAgICAgICAgQ29sOiN7b2ZmZW5zZS5sb2NhdGlvbi5jb2x1bW59XCIsXG4gICAgICAgICAgICAgIHsgZGV0YWlsOiBcIiN7b2ZmZW5zZS5tZXNzYWdlfVwiIH1cbiAgICAgICAgICAgICkgaWYgbm90aWZpY2F0aW9uXG5cbiAgbWFrZVRlbXBGaWxlOiAoZmlsZW5hbWUpIC0+XG4gICAgZGlyZWN0b3J5ID0gdGVtcC5ta2RpclN5bmMoKVxuICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgZmlsZW5hbWUpXG4gICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgJycpXG4gICAgZmlsZVBhdGhcbiJdfQ==
