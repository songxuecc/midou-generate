"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _chalk = require("chalk");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _inquirerAutocompletePrompt = _interopRequireDefault(require("inquirer-autocomplete-prompt"));

var _ora = _interopRequireDefault(require("ora"));

var _utils = require("./utils");

var _prompts = require("./prompts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var scan =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* () {
    var roots = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [process.cwd()];
    var promiseFile = [];
    roots.forEach(root => {
      var absoluteRoot = (0, _path.isAbsolute)(root) ? root : (0, _path.join)(process.cwd(), root);
      promiseFile.push((0, _utils.getComponentFiles)(absoluteRoot));
    });
    var shouldFlattenfiles = yield Promise.all(promiseFile);
    var files = (0, _utils.flatten)(shouldFlattenfiles);

    if (!files.length) {
      console.log(_chalk.red.bold("No components found! :(\n"));
      console.log("Make sure you are running ".concat((0, _chalk.cyan)("generact"), " inside a React-like project directory or using ").concat((0, _chalk.green)("root"), " option:\n"));
      console.log("    ".concat((0, _chalk.cyan)("$ generact"), " ").concat((0, _chalk.green)("--root relative/or/absolute/path/to/any/react/project"), "\n"));
      console.log("If you are already doing that, it means that ".concat((0, _chalk.cyan)("generact"), " could not find your React component files automagically."));
      console.log("In this case, you can explicitly pass the component path to replicate:\n");
      console.log("    ".concat((0, _chalk.cyan)("$ generact"), " ").concat((0, _chalk.green)("relative/or/absolute/path/to/my/react/component.js"), "\n"));
      return process.exit(1);
    }

    _inquirer.default.registerPrompt("autocomplete", _inquirerAutocompletePrompt.default);

    var answers = yield _inquirer.default.prompt([(0, _prompts.component)(files)]);
    return answers.component;
  });

  return function scan() {
    return _ref.apply(this, arguments);
  };
}();

var _default = scan;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY2FuLmpzIl0sIm5hbWVzIjpbInNjYW4iLCJyb290cyIsInByb2Nlc3MiLCJjd2QiLCJwcm9taXNlRmlsZSIsImZvckVhY2giLCJyb290IiwiYWJzb2x1dGVSb290IiwicHVzaCIsInNob3VsZEZsYXR0ZW5maWxlcyIsIlByb21pc2UiLCJhbGwiLCJmaWxlcyIsImxlbmd0aCIsImNvbnNvbGUiLCJsb2ciLCJyZWQiLCJib2xkIiwiZXhpdCIsImlucXVpcmVyIiwicmVnaXN0ZXJQcm9tcHQiLCJhdXRvY29tcGxldGUiLCJhbnN3ZXJzIiwicHJvbXB0IiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsSUFBSTtBQUFBO0FBQUE7QUFBQSwrQkFBRyxhQUFxQztBQUFBLFFBQTlCQyxLQUE4Qix1RUFBdEIsQ0FBRUMsT0FBTyxDQUFDQyxHQUFSLEVBQUYsQ0FBc0I7QUFDaEQsUUFBTUMsV0FBVyxHQUFHLEVBQXBCO0FBQ0FILElBQUFBLEtBQUssQ0FBQ0ksT0FBTixDQUFjQyxJQUFJLElBQUk7QUFDcEIsVUFBTUMsWUFBWSxHQUFHLHNCQUFXRCxJQUFYLElBQW1CQSxJQUFuQixHQUEwQixnQkFBS0osT0FBTyxDQUFDQyxHQUFSLEVBQUwsRUFBb0JHLElBQXBCLENBQS9DO0FBQ0FGLE1BQUFBLFdBQVcsQ0FBQ0ksSUFBWixDQUFpQiw4QkFBa0JELFlBQWxCLENBQWpCO0FBQ0QsS0FIRDtBQUlBLFFBQU1FLGtCQUFrQixTQUFTQyxPQUFPLENBQUNDLEdBQVIsQ0FBWVAsV0FBWixDQUFqQztBQUNBLFFBQU1RLEtBQUssR0FBRyxvQkFBUUgsa0JBQVIsQ0FBZDs7QUFFQSxRQUFJLENBQUNHLEtBQUssQ0FBQ0MsTUFBWCxFQUFtQjtBQUNqQkMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFdBQUlDLElBQUosQ0FBUywyQkFBVCxDQUFaO0FBQ0FILE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixxQ0FDK0IsaUJBQzNCLFVBRDJCLENBRC9CLDZEQUdzRCxrQkFBTSxNQUFOLENBSHREO0FBS0FELE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixlQUNTLGlCQUFLLFlBQUwsQ0FEVCxjQUMrQixrQkFDM0IsdURBRDJCLENBRC9CO0FBS0FELE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUix3REFDa0QsaUJBQzlDLFVBRDhDLENBRGxEO0FBS0FELE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDBFQUFaO0FBQ0FELE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixlQUNTLGlCQUFLLFlBQUwsQ0FEVCxjQUMrQixrQkFBTSxvREFBTixDQUQvQjtBQUdBLGFBQU9iLE9BQU8sQ0FBQ2dCLElBQVIsQ0FBYSxDQUFiLENBQVA7QUFDRDs7QUFFREMsc0JBQVNDLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0NDLG1DQUF4Qzs7QUFDQSxRQUFNQyxPQUFPLFNBQVNILGtCQUFTSSxNQUFULENBQWdCLENBQUUsd0JBQVVYLEtBQVYsQ0FBRixDQUFoQixDQUF0QjtBQUNBLFdBQU9VLE9BQU8sQ0FBQ0UsU0FBZjtBQUNELEdBcENTOztBQUFBLGtCQUFKeEIsSUFBSTtBQUFBO0FBQUE7QUFBQSxHQUFWOztlQXNDZUEsSSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIGlzQWJzb2x1dGUgfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgeyBjeWFuLCBncmVlbiwgcmVkIH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIlxuaW1wb3J0IGF1dG9jb21wbGV0ZSBmcm9tIFwiaW5xdWlyZXItYXV0b2NvbXBsZXRlLXByb21wdFwiXG5pbXBvcnQgb3JhIGZyb20gXCJvcmFcIlxuaW1wb3J0IHsgZ2V0Q29tcG9uZW50RmlsZXMsZmxhdHRlbiB9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7IGNvbXBvbmVudCwgbmFtZSwgZm9sZGVyIH0gZnJvbSBcIi4vcHJvbXB0c1wiXG5cbmNvbnN0IHNjYW4gPSBhc3luYyAocm9vdHMgPSBbIHByb2Nlc3MuY3dkKCkgXSkgPT4ge1xuICBjb25zdCBwcm9taXNlRmlsZSA9IFtdXG4gIHJvb3RzLmZvckVhY2gocm9vdCA9PiB7XG4gICAgY29uc3QgYWJzb2x1dGVSb290ID0gaXNBYnNvbHV0ZShyb290KSA/IHJvb3QgOiBqb2luKHByb2Nlc3MuY3dkKCksIHJvb3QpXG4gICAgcHJvbWlzZUZpbGUucHVzaChnZXRDb21wb25lbnRGaWxlcyhhYnNvbHV0ZVJvb3QpKVxuICB9KVxuICBjb25zdCBzaG91bGRGbGF0dGVuZmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlRmlsZSlcbiAgY29uc3QgZmlsZXMgPSBmbGF0dGVuKHNob3VsZEZsYXR0ZW5maWxlcylcblxuICBpZiAoIWZpbGVzLmxlbmd0aCkge1xuICAgIGNvbnNvbGUubG9nKHJlZC5ib2xkKFwiTm8gY29tcG9uZW50cyBmb3VuZCEgOihcXG5cIikpXG4gICAgY29uc29sZS5sb2coXG4gICAgICBgTWFrZSBzdXJlIHlvdSBhcmUgcnVubmluZyAke2N5YW4oXG4gICAgICAgIFwiZ2VuZXJhY3RcIlxuICAgICAgKX0gaW5zaWRlIGEgUmVhY3QtbGlrZSBwcm9qZWN0IGRpcmVjdG9yeSBvciB1c2luZyAke2dyZWVuKFwicm9vdFwiKX0gb3B0aW9uOlxcbmBcbiAgICApXG4gICAgY29uc29sZS5sb2coXG4gICAgICBgICAgICR7Y3lhbihcIiQgZ2VuZXJhY3RcIil9ICR7Z3JlZW4oXG4gICAgICAgIFwiLS1yb290IHJlbGF0aXZlL29yL2Fic29sdXRlL3BhdGgvdG8vYW55L3JlYWN0L3Byb2plY3RcIlxuICAgICAgKX1cXG5gXG4gICAgKVxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYElmIHlvdSBhcmUgYWxyZWFkeSBkb2luZyB0aGF0LCBpdCBtZWFucyB0aGF0ICR7Y3lhbihcbiAgICAgICAgXCJnZW5lcmFjdFwiXG4gICAgICApfSBjb3VsZCBub3QgZmluZCB5b3VyIFJlYWN0IGNvbXBvbmVudCBmaWxlcyBhdXRvbWFnaWNhbGx5LmBcbiAgICApXG4gICAgY29uc29sZS5sb2coXCJJbiB0aGlzIGNhc2UsIHlvdSBjYW4gZXhwbGljaXRseSBwYXNzIHRoZSBjb21wb25lbnQgcGF0aCB0byByZXBsaWNhdGU6XFxuXCIpXG4gICAgY29uc29sZS5sb2coXG4gICAgICBgICAgICR7Y3lhbihcIiQgZ2VuZXJhY3RcIil9ICR7Z3JlZW4oXCJyZWxhdGl2ZS9vci9hYnNvbHV0ZS9wYXRoL3RvL215L3JlYWN0L2NvbXBvbmVudC5qc1wiKX1cXG5gXG4gICAgKVxuICAgIHJldHVybiBwcm9jZXNzLmV4aXQoMSlcbiAgfVxuXG4gIGlucXVpcmVyLnJlZ2lzdGVyUHJvbXB0KFwiYXV0b2NvbXBsZXRlXCIsIGF1dG9jb21wbGV0ZSlcbiAgY29uc3QgYW5zd2VycyA9IGF3YWl0IGlucXVpcmVyLnByb21wdChbIGNvbXBvbmVudChmaWxlcykgXSlcbiAgcmV0dXJuIGFuc3dlcnMuY29tcG9uZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNjYW5cbiJdfQ==