Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getNodePrefixPath = getNodePrefixPath;
exports.findESLintDirectory = findESLintDirectory;
exports.getESLintFromDirectory = getESLintFromDirectory;
exports.refreshModulesPath = refreshModulesPath;
exports.getESLintInstance = getESLintInstance;
exports.getConfigPath = getConfigPath;
exports.getRelativePath = getRelativePath;
exports.getCLIEngineOptions = getCLIEngineOptions;
exports.getRules = getRules;
exports.didRulesChange = didRulesChange;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _resolveEnv = require('resolve-env');

var _resolveEnv2 = _interopRequireDefault(_resolveEnv);

var _atomLinter = require('atom-linter');

var _consistentPath = require('consistent-path');

var _consistentPath2 = _interopRequireDefault(_consistentPath);

'use babel';

var Cache = {
  ESLINT_LOCAL_PATH: _path2['default'].normalize(_path2['default'].join(__dirname, '..', 'node_modules', 'eslint')),
  NODE_PREFIX_PATH: null,
  LAST_MODULES_PATH: null
};

/**
 * Takes a path and translates `~` to the user's home directory, and replaces
 * all environment variables with their value.
 * @param  {string} path The path to remove "strangeness" from
 * @return {string}      The cleaned path
 */
var cleanPath = function cleanPath(path) {
  return path ? (0, _resolveEnv2['default'])(_fsPlus2['default'].normalize(path)) : '';
};

function getNodePrefixPath() {
  if (Cache.NODE_PREFIX_PATH === null) {
    var npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    try {
      Cache.NODE_PREFIX_PATH = _child_process2['default'].spawnSync(npmCommand, ['get', 'prefix'], {
        env: Object.assign(Object.assign({}, process.env), { PATH: (0, _consistentPath2['default'])() })
      }).output[1].toString().trim();
    } catch (e) {
      var errMsg = 'Unable to execute `npm get prefix`. Please make sure ' + 'Atom is getting $PATH correctly.';
      throw new Error(errMsg);
    }
  }
  return Cache.NODE_PREFIX_PATH;
}

function isDirectory(dirPath) {
  var isDir = undefined;
  try {
    isDir = _fsPlus2['default'].statSync(dirPath).isDirectory();
  } catch (e) {
    isDir = false;
  }
  return isDir;
}

function findESLintDirectory(modulesDir, config, projectPath) {
  var eslintDir = null;
  var locationType = null;
  if (config.useGlobalEslint) {
    locationType = 'global';
    var configGlobal = cleanPath(config.globalNodePath);
    var prefixPath = configGlobal || getNodePrefixPath();
    // NPM on Windows and Yarn on all platforms
    eslintDir = _path2['default'].join(prefixPath, 'node_modules', 'eslint');
    if (!isDirectory(eslintDir)) {
      // NPM on platforms other than Windows
      eslintDir = _path2['default'].join(prefixPath, 'lib', 'node_modules', 'eslint');
    }
  } else if (!config.advancedLocalNodeModules) {
    locationType = 'local project';
    eslintDir = _path2['default'].join(modulesDir || '', 'eslint');
  } else if (_path2['default'].isAbsolute(cleanPath(config.advancedLocalNodeModules))) {
    locationType = 'advanced specified';
    eslintDir = _path2['default'].join(cleanPath(config.advancedLocalNodeModules), 'eslint');
  } else {
    locationType = 'advanced specified';
    eslintDir = _path2['default'].join(projectPath || '', cleanPath(config.advancedLocalNodeModules), 'eslint');
  }
  if (isDirectory(eslintDir)) {
    return {
      path: eslintDir,
      type: locationType
    };
  } else if (config.useGlobalEslint) {
    throw new Error('ESLint not found, please ensure the global Node path is set correctly.');
  }
  return {
    path: Cache.ESLINT_LOCAL_PATH,
    type: 'bundled fallback'
  };
}

function getESLintFromDirectory(modulesDir, config, projectPath) {
  var _findESLintDirectory = findESLintDirectory(modulesDir, config, projectPath);

  var ESLintDirectory = _findESLintDirectory.path;

  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(ESLintDirectory);
  } catch (e) {
    if (config.useGlobalEslint && e.code === 'MODULE_NOT_FOUND') {
      throw new Error('ESLint not found, try restarting Atom to clear caches.');
    }
    // eslint-disable-next-line import/no-dynamic-require
    return require(Cache.ESLINT_LOCAL_PATH);
  }
}

function refreshModulesPath(modulesDir) {
  if (Cache.LAST_MODULES_PATH !== modulesDir) {
    Cache.LAST_MODULES_PATH = modulesDir;
    process.env.NODE_PATH = modulesDir || '';
    // eslint-disable-next-line no-underscore-dangle
    require('module').Module._initPaths();
  }
}

function getESLintInstance(fileDir, config, projectPath) {
  var modulesDir = _path2['default'].dirname((0, _atomLinter.findCached)(fileDir, 'node_modules/eslint') || '');
  refreshModulesPath(modulesDir);
  return getESLintFromDirectory(modulesDir, config, projectPath);
}

function getConfigPath(_x) {
  var _again = true;

  _function: while (_again) {
    var fileDir = _x;
    _again = false;

    var configFile = (0, _atomLinter.findCached)(fileDir, ['.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json', '.eslintrc', 'package.json']);
    if (configFile) {
      if (_path2['default'].basename(configFile) === 'package.json') {
        // eslint-disable-next-line import/no-dynamic-require
        if (require(configFile).eslintConfig) {
          return configFile;
        }
        // If we are here, we found a package.json without an eslint config
        // in a dir without any other eslint config files
        // (because 'package.json' is last in the call to findCached)
        // So, keep looking from the parent directory
        _x = _path2['default'].resolve(_path2['default'].dirname(configFile), '..');
        _again = true;
        configFile = undefined;
        continue _function;
      }
      return configFile;
    }
    return null;
  }
}

function getRelativePath(fileDir, filePath, config, projectPath) {
  var ignoreFile = config.disableEslintIgnore ? null : (0, _atomLinter.findCached)(fileDir, '.eslintignore');

  // If we can find an .eslintignore file, we can set cwd there
  // (because they are expected to be at the project root)
  if (ignoreFile) {
    var ignoreDir = _path2['default'].dirname(ignoreFile);
    process.chdir(ignoreDir);
    return _path2['default'].relative(ignoreDir, filePath);
  }
  // Otherwise, we'll set the cwd to the atom project root as long as that exists
  if (projectPath) {
    process.chdir(projectPath);
    return _path2['default'].relative(projectPath, filePath);
  }
  // If all else fails, use the file location itself
  process.chdir(fileDir);
  return _path2['default'].basename(filePath);
}

function getCLIEngineOptions(type, config, rules, filePath, fileDir, givenConfigPath) {
  var cliEngineConfig = {
    rules: rules,
    ignore: !config.disableEslintIgnore,
    fix: type === 'fix'
  };

  var ignoreFile = config.disableEslintIgnore ? null : (0, _atomLinter.findCached)(fileDir, '.eslintignore');
  if (ignoreFile) {
    cliEngineConfig.ignorePath = ignoreFile;
  }

  cliEngineConfig.rulePaths = config.eslintRulesDirs.map(function (path) {
    var rulesDir = cleanPath(path);
    if (!_path2['default'].isAbsolute(rulesDir)) {
      return (0, _atomLinter.findCached)(fileDir, rulesDir);
    }
    return rulesDir;
  }).filter(function (path) {
    return path;
  });

  if (givenConfigPath === null && config.eslintrcPath) {
    // If we didn't find a configuration use the fallback from the settings
    cliEngineConfig.configFile = cleanPath(config.eslintrcPath);
  }

  return cliEngineConfig;
}

/**
 * Gets the list of rules used for a lint job
 * @param  {Object} cliEngine The CLIEngine instance used for the lint job
 * @return {Map}              A Map of the rules used, rule names as keys, rule
 *                            properties as the contents.
 */

function getRules(cliEngine) {
  // Pull the list of rules used directly from the CLIEngine
  // Added in https://github.com/eslint/eslint/pull/9782
  if (Object.prototype.hasOwnProperty.call(cliEngine, 'getRules')) {
    return cliEngine.getRules();
  }

  // Attempt to use the internal (undocumented) `linter` instance attached to
  // the CLIEngine to get the loaded rules (including plugin rules).
  // Added in ESLint v4
  if (Object.prototype.hasOwnProperty.call(cliEngine, 'linter')) {
    return cliEngine.linter.getRules();
  }

  // Older versions of ESLint don't (easily) support getting a list of rules
  return new Map();
}

/**
 * Given an exiting rule list and a new rule list, determines whether there
 * have been changes.
 * NOTE: This only accounts for presence of the rules, changes to their metadata
 * are not taken into account.
 * @param  {Map} newRules     A Map of the new rules
 * @param  {Map} currentRules A Map of the current rules
 * @return {boolean}             Whether or not there were changes
 */

function didRulesChange(currentRules, newRules) {
  return !(currentRules.size === newRules.size && Array.from(currentRules.keys()).every(function (ruleId) {
    return newRules.has(ruleId);
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL3dvcmtlci1oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7c0JBQ1IsU0FBUzs7Ozs2QkFDQyxlQUFlOzs7OzBCQUNqQixhQUFhOzs7OzBCQUNULGFBQWE7OzhCQUNwQixpQkFBaUI7Ozs7QUFQckMsV0FBVyxDQUFBOztBQVNYLElBQU0sS0FBSyxHQUFHO0FBQ1osbUJBQWlCLEVBQUUsa0JBQUssU0FBUyxDQUFDLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN2RixrQkFBZ0IsRUFBRSxJQUFJO0FBQ3RCLG1CQUFpQixFQUFFLElBQUk7Q0FDeEIsQ0FBQTs7Ozs7Ozs7QUFRRCxJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBRyxJQUFJO1NBQUssSUFBSSxHQUFHLDZCQUFXLG9CQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7Q0FBQyxDQUFBOztBQUUvRCxTQUFTLGlCQUFpQixHQUFHO0FBQ2xDLE1BQUksS0FBSyxDQUFDLGdCQUFnQixLQUFLLElBQUksRUFBRTtBQUNuQyxRQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFBO0FBQ25FLFFBQUk7QUFDRixXQUFLLENBQUMsZ0JBQWdCLEdBQ3BCLDJCQUFhLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDcEQsV0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGtDQUFTLEVBQUUsQ0FBQztPQUN4RSxDQUFDLENB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QUFDLFFBQVEsRUFBRSxDQUFBO0dBQ25DOzs7QUFHRCxTQUFPLElBQUksR0FBRyxFQUFFLENBQUE7Q0FDakI7Ozs7Ozs7Ozs7OztBQVdNLFNBQVMsY0FBYyxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUU7QUFDckQsU0FBTyxFQUFFLFlBQVksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLElBQUksSUFDMUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxNQUFNO1dBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7R0FBQSxDQUFDLENBQUEsQUFBQyxDQUFBO0NBQ3pFIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL3dvcmtlci1oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IENoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHJlc29sdmVFbnYgZnJvbSAncmVzb2x2ZS1lbnYnXG5pbXBvcnQgeyBmaW5kQ2FjaGVkIH0gZnJvbSAnYXRvbS1saW50ZXInXG5pbXBvcnQgZ2V0UGF0aCBmcm9tICdjb25zaXN0ZW50LXBhdGgnXG5cbmNvbnN0IENhY2hlID0ge1xuICBFU0xJTlRfTE9DQUxfUEFUSDogUGF0aC5ub3JtYWxpemUoUGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ25vZGVfbW9kdWxlcycsICdlc2xpbnQnKSksXG4gIE5PREVfUFJFRklYX1BBVEg6IG51bGwsXG4gIExBU1RfTU9EVUxFU19QQVRIOiBudWxsXG59XG5cbi8qKlxuICogVGFrZXMgYSBwYXRoIGFuZCB0cmFuc2xhdGVzIGB+YCB0byB0aGUgdXNlcidzIGhvbWUgZGlyZWN0b3J5LCBhbmQgcmVwbGFjZXNcbiAqIGFsbCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgd2l0aCB0aGVpciB2YWx1ZS5cbiAqIEBwYXJhbSAge3N0cmluZ30gcGF0aCBUaGUgcGF0aCB0byByZW1vdmUgXCJzdHJhbmdlbmVzc1wiIGZyb21cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICBUaGUgY2xlYW5lZCBwYXRoXG4gKi9cbmNvbnN0IGNsZWFuUGF0aCA9IHBhdGggPT4gKHBhdGggPyByZXNvbHZlRW52KGZzLm5vcm1hbGl6ZShwYXRoKSkgOiAnJylcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVQcmVmaXhQYXRoKCkge1xuICBpZiAoQ2FjaGUuTk9ERV9QUkVGSVhfUEFUSCA9PT0gbnVsbCkge1xuICAgIGNvbnN0IG5wbUNvbW1hbmQgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gJ25wbS5jbWQnIDogJ25wbSdcbiAgICB0cnkge1xuICAgICAgQ2FjaGUuTk9ERV9QUkVGSVhfUEFUSCA9XG4gICAgICAgIENoaWxkUHJvY2Vzcy5zcGF3blN5bmMobnBtQ29tbWFuZCwgWydnZXQnLCAncHJlZml4J10sIHtcbiAgICAgICAgICBlbnY6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcHJvY2Vzcy5lbnYpLCB7IFBBVEg6IGdldFBhdGgoKSB9KVxuICAgICAgICB9KS5vdXRwdXRbMV0udG9TdHJpbmcoKS50cmltKClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCBlcnJNc2cgPSAnVW5hYmxlIHRvIGV4ZWN1dGUgYG5wbSBnZXQgcHJlZml4YC4gUGxlYXNlIG1ha2Ugc3VyZSAnICtcbiAgICAgICAgJ0F0b20gaXMgZ2V0dGluZyAkUEFUSCBjb3JyZWN0bHkuJ1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIENhY2hlLk5PREVfUFJFRklYX1BBVEhcbn1cblxuZnVuY3Rpb24gaXNEaXJlY3RvcnkoZGlyUGF0aCkge1xuICBsZXQgaXNEaXJcbiAgdHJ5IHtcbiAgICBpc0RpciA9IGZzLnN0YXRTeW5jKGRpclBhdGgpLmlzRGlyZWN0b3J5KClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlzRGlyID0gZmFsc2VcbiAgfVxuICByZXR1cm4gaXNEaXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aCkge1xuICBsZXQgZXNsaW50RGlyID0gbnVsbFxuICBsZXQgbG9jYXRpb25UeXBlID0gbnVsbFxuICBpZiAoY29uZmlnLnVzZUdsb2JhbEVzbGludCkge1xuICAgIGxvY2F0aW9uVHlwZSA9ICdnbG9iYWwnXG4gICAgY29uc3QgY29uZmlnR2xvYmFsID0gY2xlYW5QYXRoKGNvbmZpZy5nbG9iYWxOb2RlUGF0aClcbiAgICBjb25zdCBwcmVmaXhQYXRoID0gY29uZmlnR2xvYmFsIHx8IGdldE5vZGVQcmVmaXhQYXRoKClcbiAgICAvLyBOUE0gb24gV2luZG93cyBhbmQgWWFybiBvbiBhbGwgcGxhdGZvcm1zXG4gICAgZXNsaW50RGlyID0gUGF0aC5qb2luKHByZWZpeFBhdGgsICdub2RlX21vZHVsZXMnLCAnZXNsaW50JylcbiAgICBpZiAoIWlzRGlyZWN0b3J5KGVzbGludERpcikpIHtcbiAgICAgIC8vIE5QTSBvbiBwbGF0Zm9ybXMgb3RoZXIgdGhhbiBXaW5kb3dzXG4gICAgICBlc2xpbnREaXIgPSBQYXRoLmpvaW4ocHJlZml4UGF0aCwgJ2xpYicsICdub2RlX21vZHVsZXMnLCAnZXNsaW50JylcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWNvbmZpZy5hZHZhbmNlZExvY2FsTm9kZU1vZHVsZXMpIHtcbiAgICBsb2NhdGlvblR5cGUgPSAnbG9jYWwgcHJvamVjdCdcbiAgICBlc2xpbnREaXIgPSBQYXRoLmpvaW4obW9kdWxlc0RpciB8fCAnJywgJ2VzbGludCcpXG4gIH0gZWxzZSBpZiAoUGF0aC5pc0Fic29sdXRlKGNsZWFuUGF0aChjb25maWcuYWR2YW5jZWRMb2NhbE5vZGVNb2R1bGVzKSkpIHtcbiAgICBsb2NhdGlvblR5cGUgPSAnYWR2YW5jZWQgc3BlY2lmaWVkJ1xuICAgIGVzbGludERpciA9IFBhdGguam9pbihjbGVhblBhdGgoY29uZmlnLmFkdmFuY2VkTG9jYWxOb2RlTW9kdWxlcyksICdlc2xpbnQnKVxuICB9IGVsc2Uge1xuICAgIGxvY2F0aW9uVHlwZSA9ICdhZHZhbmNlZCBzcGVjaWZpZWQnXG4gICAgZXNsaW50RGlyID0gUGF0aC5qb2luKHByb2plY3RQYXRoIHx8ICcnLCBjbGVhblBhdGgoY29uZmlnLmFkdmFuY2VkTG9jYWxOb2RlTW9kdWxlcyksICdlc2xpbnQnKVxuICB9XG4gIGlmIChpc0RpcmVjdG9yeShlc2xpbnREaXIpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGg6IGVzbGludERpcixcbiAgICAgIHR5cGU6IGxvY2F0aW9uVHlwZSxcbiAgICB9XG4gIH0gZWxzZSBpZiAoY29uZmlnLnVzZUdsb2JhbEVzbGludCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRVNMaW50IG5vdCBmb3VuZCwgcGxlYXNlIGVuc3VyZSB0aGUgZ2xvYmFsIE5vZGUgcGF0aCBpcyBzZXQgY29ycmVjdGx5LicpXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBwYXRoOiBDYWNoZS5FU0xJTlRfTE9DQUxfUEFUSCxcbiAgICB0eXBlOiAnYnVuZGxlZCBmYWxsYmFjaycsXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVTTGludEZyb21EaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aCkge1xuICBjb25zdCB7IHBhdGg6IEVTTGludERpcmVjdG9yeSB9ID0gZmluZEVTTGludERpcmVjdG9yeShtb2R1bGVzRGlyLCBjb25maWcsIHByb2plY3RQYXRoKVxuICB0cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZHluYW1pYy1yZXF1aXJlXG4gICAgcmV0dXJuIHJlcXVpcmUoRVNMaW50RGlyZWN0b3J5KVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGNvbmZpZy51c2VHbG9iYWxFc2xpbnQgJiYgZS5jb2RlID09PSAnTU9EVUxFX05PVF9GT1VORCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRVNMaW50IG5vdCBmb3VuZCwgdHJ5IHJlc3RhcnRpbmcgQXRvbSB0byBjbGVhciBjYWNoZXMuJylcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1keW5hbWljLXJlcXVpcmVcbiAgICByZXR1cm4gcmVxdWlyZShDYWNoZS5FU0xJTlRfTE9DQUxfUEFUSClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaE1vZHVsZXNQYXRoKG1vZHVsZXNEaXIpIHtcbiAgaWYgKENhY2hlLkxBU1RfTU9EVUxFU19QQVRIICE9PSBtb2R1bGVzRGlyKSB7XG4gICAgQ2FjaGUuTEFTVF9NT0RVTEVTX1BBVEggPSBtb2R1bGVzRGlyXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9QQVRIID0gbW9kdWxlc0RpciB8fCAnJ1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgIHJlcXVpcmUoJ21vZHVsZScpLk1vZHVsZS5faW5pdFBhdGhzKClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RVNMaW50SW5zdGFuY2UoZmlsZURpciwgY29uZmlnLCBwcm9qZWN0UGF0aCkge1xuICBjb25zdCBtb2R1bGVzRGlyID0gUGF0aC5kaXJuYW1lKGZpbmRDYWNoZWQoZmlsZURpciwgJ25vZGVfbW9kdWxlcy9lc2xpbnQnKSB8fCAnJylcbiAgcmVmcmVzaE1vZHVsZXNQYXRoKG1vZHVsZXNEaXIpXG4gIHJldHVybiBnZXRFU0xpbnRGcm9tRGlyZWN0b3J5KG1vZHVsZXNEaXIsIGNvbmZpZywgcHJvamVjdFBhdGgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWdQYXRoKGZpbGVEaXIpIHtcbiAgY29uc3QgY29uZmlnRmlsZSA9XG4gICAgZmluZENhY2hlZChmaWxlRGlyLCBbXG4gICAgICAnLmVzbGludHJjLmpzJywgJy5lc2xpbnRyYy55YW1sJywgJy5lc2xpbnRyYy55bWwnLCAnLmVzbGludHJjLmpzb24nLCAnLmVzbGludHJjJywgJ3BhY2thZ2UuanNvbidcbiAgICBdKVxuICBpZiAoY29uZmlnRmlsZSkge1xuICAgIGlmIChQYXRoLmJhc2VuYW1lKGNvbmZpZ0ZpbGUpID09PSAncGFja2FnZS5qc29uJykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1keW5hbWljLXJlcXVpcmVcbiAgICAgIGlmIChyZXF1aXJlKGNvbmZpZ0ZpbGUpLmVzbGludENvbmZpZykge1xuICAgICAgICByZXR1cm4gY29uZmlnRmlsZVxuICAgICAgfVxuICAgICAgLy8gSWYgd2UgYXJlIGhlcmUsIHdlIGZvdW5kIGEgcGFja2FnZS5qc29uIHdpdGhvdXQgYW4gZXNsaW50IGNvbmZpZ1xuICAgICAgLy8gaW4gYSBkaXIgd2l0aG91dCBhbnkgb3RoZXIgZXNsaW50IGNvbmZpZyBmaWxlc1xuICAgICAgLy8gKGJlY2F1c2UgJ3BhY2thZ2UuanNvbicgaXMgbGFzdCBpbiB0aGUgY2FsbCB0byBmaW5kQ2FjaGVkKVxuICAgICAgLy8gU28sIGtlZXAgbG9va2luZyBmcm9tIHRoZSBwYXJlbnQgZGlyZWN0b3J5XG4gICAgICByZXR1cm4gZ2V0Q29uZmlnUGF0aChQYXRoLnJlc29sdmUoUGF0aC5kaXJuYW1lKGNvbmZpZ0ZpbGUpLCAnLi4nKSlcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZ0ZpbGVcbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQYXRoKGZpbGVEaXIsIGZpbGVQYXRoLCBjb25maWcsIHByb2plY3RQYXRoKSB7XG4gIGNvbnN0IGlnbm9yZUZpbGUgPSBjb25maWcuZGlzYWJsZUVzbGludElnbm9yZSA/IG51bGwgOiBmaW5kQ2FjaGVkKGZpbGVEaXIsICcuZXNsaW50aWdub3JlJylcblxuICAvLyBJZiB3ZSBjYW4gZmluZCBhbiAuZXNsaW50aWdub3JlIGZpbGUsIHdlIGNhbiBzZXQgY3dkIHRoZXJlXG4gIC8vIChiZWNhdXNlIHRoZXkgYXJlIGV4cGVjdGVkIHRvIGJlIGF0IHRoZSBwcm9qZWN0IHJvb3QpXG4gIGlmIChpZ25vcmVGaWxlKSB7XG4gICAgY29uc3QgaWdub3JlRGlyID0gUGF0aC5kaXJuYW1lKGlnbm9yZUZpbGUpXG4gICAgcHJvY2Vzcy5jaGRpcihpZ25vcmVEaXIpXG4gICAgcmV0dXJuIFBhdGgucmVsYXRpdmUoaWdub3JlRGlyLCBmaWxlUGF0aClcbiAgfVxuICAvLyBPdGhlcndpc2UsIHdlJ2xsIHNldCB0aGUgY3dkIHRvIHRoZSBhdG9tIHByb2plY3Qgcm9vdCBhcyBsb25nIGFzIHRoYXQgZXhpc3RzXG4gIGlmIChwcm9qZWN0UGF0aCkge1xuICAgIHByb2Nlc3MuY2hkaXIocHJvamVjdFBhdGgpXG4gICAgcmV0dXJuIFBhdGgucmVsYXRpdmUocHJvamVjdFBhdGgsIGZpbGVQYXRoKVxuICB9XG4gIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgdGhlIGZpbGUgbG9jYXRpb24gaXRzZWxmXG4gIHByb2Nlc3MuY2hkaXIoZmlsZURpcilcbiAgcmV0dXJuIFBhdGguYmFzZW5hbWUoZmlsZVBhdGgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDTElFbmdpbmVPcHRpb25zKHR5cGUsIGNvbmZpZywgcnVsZXMsIGZpbGVQYXRoLCBmaWxlRGlyLCBnaXZlbkNvbmZpZ1BhdGgpIHtcbiAgY29uc3QgY2xpRW5naW5lQ29uZmlnID0ge1xuICAgIHJ1bGVzLFxuICAgIGlnbm9yZTogIWNvbmZpZy5kaXNhYmxlRXNsaW50SWdub3JlLFxuICAgIGZpeDogdHlwZSA9PT0gJ2ZpeCdcbiAgfVxuXG4gIGNvbnN0IGlnbm9yZUZpbGUgPSBjb25maWcuZGlzYWJsZUVzbGludElnbm9yZSA/IG51bGwgOiBmaW5kQ2FjaGVkKGZpbGVEaXIsICcuZXNsaW50aWdub3JlJylcbiAgaWYgKGlnbm9yZUZpbGUpIHtcbiAgICBjbGlFbmdpbmVDb25maWcuaWdub3JlUGF0aCA9IGlnbm9yZUZpbGVcbiAgfVxuXG4gIGNsaUVuZ2luZUNvbmZpZy5ydWxlUGF0aHMgPSBjb25maWcuZXNsaW50UnVsZXNEaXJzLm1hcCgocGF0aCkgPT4ge1xuICAgIGNvbnN0IHJ1bGVzRGlyID0gY2xlYW5QYXRoKHBhdGgpXG4gICAgaWYgKCFQYXRoLmlzQWJzb2x1dGUocnVsZXNEaXIpKSB7XG4gICAgICByZXR1cm4gZmluZENhY2hlZChmaWxlRGlyLCBydWxlc0RpcilcbiAgICB9XG4gICAgcmV0dXJuIHJ1bGVzRGlyXG4gIH0pLmZpbHRlcihwYXRoID0+IHBhdGgpXG5cbiAgaWYgKGdpdmVuQ29uZmlnUGF0aCA9PT0gbnVsbCAmJiBjb25maWcuZXNsaW50cmNQYXRoKSB7XG4gICAgLy8gSWYgd2UgZGlkbid0IGZpbmQgYSBjb25maWd1cmF0aW9uIHVzZSB0aGUgZmFsbGJhY2sgZnJvbSB0aGUgc2V0dGluZ3NcbiAgICBjbGlFbmdpbmVDb25maWcuY29uZmlnRmlsZSA9IGNsZWFuUGF0aChjb25maWcuZXNsaW50cmNQYXRoKVxuICB9XG5cbiAgcmV0dXJuIGNsaUVuZ2luZUNvbmZpZ1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3Qgb2YgcnVsZXMgdXNlZCBmb3IgYSBsaW50IGpvYlxuICogQHBhcmFtICB7T2JqZWN0fSBjbGlFbmdpbmUgVGhlIENMSUVuZ2luZSBpbnN0YW5jZSB1c2VkIGZvciB0aGUgbGludCBqb2JcbiAqIEByZXR1cm4ge01hcH0gICAgICAgICAgICAgIEEgTWFwIG9mIHRoZSBydWxlcyB1c2VkLCBydWxlIG5hbWVzIGFzIGtleXMsIHJ1bGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgYXMgdGhlIGNvbnRlbnRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UnVsZXMoY2xpRW5naW5lKSB7XG4gIC8vIFB1bGwgdGhlIGxpc3Qgb2YgcnVsZXMgdXNlZCBkaXJlY3RseSBmcm9tIHRoZSBDTElFbmdpbmVcbiAgLy8gQWRkZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL2VzbGludC9lc2xpbnQvcHVsbC85NzgyXG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2xpRW5naW5lLCAnZ2V0UnVsZXMnKSkge1xuICAgIHJldHVybiBjbGlFbmdpbmUuZ2V0UnVsZXMoKVxuICB9XG5cbiAgLy8gQXR0ZW1wdCB0byB1c2UgdGhlIGludGVybmFsICh1bmRvY3VtZW50ZWQpIGBsaW50ZXJgIGluc3RhbmNlIGF0dGFjaGVkIHRvXG4gIC8vIHRoZSBDTElFbmdpbmUgdG8gZ2V0IHRoZSBsb2FkZWQgcnVsZXMgKGluY2x1ZGluZyBwbHVnaW4gcnVsZXMpLlxuICAvLyBBZGRlZCBpbiBFU0xpbnQgdjRcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjbGlFbmdpbmUsICdsaW50ZXInKSkge1xuICAgIHJldHVybiBjbGlFbmdpbmUubGludGVyLmdldFJ1bGVzKClcbiAgfVxuXG4gIC8vIE9sZGVyIHZlcnNpb25zIG9mIEVTTGludCBkb24ndCAoZWFzaWx5KSBzdXBwb3J0IGdldHRpbmcgYSBsaXN0IG9mIHJ1bGVzXG4gIHJldHVybiBuZXcgTWFwKClcbn1cblxuLyoqXG4gKiBHaXZlbiBhbiBleGl0aW5nIHJ1bGUgbGlzdCBhbmQgYSBuZXcgcnVsZSBsaXN0LCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlcmVcbiAqIGhhdmUgYmVlbiBjaGFuZ2VzLlxuICogTk9URTogVGhpcyBvbmx5IGFjY291bnRzIGZvciBwcmVzZW5jZSBvZiB0aGUgcnVsZXMsIGNoYW5nZXMgdG8gdGhlaXIgbWV0YWRhdGFcbiAqIGFyZSBub3QgdGFrZW4gaW50byBhY2NvdW50LlxuICogQHBhcmFtICB7TWFwfSBuZXdSdWxlcyAgICAgQSBNYXAgb2YgdGhlIG5ldyBydWxlc1xuICogQHBhcmFtICB7TWFwfSBjdXJyZW50UnVsZXMgQSBNYXAgb2YgdGhlIGN1cnJlbnQgcnVsZXNcbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZXJlIHdlcmUgY2hhbmdlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGlkUnVsZXNDaGFuZ2UoY3VycmVudFJ1bGVzLCBuZXdSdWxlcykge1xuICByZXR1cm4gIShjdXJyZW50UnVsZXMuc2l6ZSA9PT0gbmV3UnVsZXMuc2l6ZSAmJlxuICAgIEFycmF5LmZyb20oY3VycmVudFJ1bGVzLmtleXMoKSkuZXZlcnkocnVsZUlkID0+IG5ld1J1bGVzLmhhcyhydWxlSWQpKSlcbn1cbiJdfQ==