"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _lodash = require("lodash");

var _chalk = require("chalk");

var _utils = require("./utils");

var _replicateComponent = _interopRequireDefault(require("./replicateComponent"));

var _replicatePage = _interopRequireDefault(require("./replicatePage"));

var _scan = _interopRequireDefault(require("./scan"));

var _answers = require("./answers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var log = console.log;
var defaultCompnentDir = (0, _path.resolve)(__dirname, "../templates");

var generate =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (program, _ref) {
    var {
      cwd
    } = _ref;

    try {
      var opts = program.opts();
      var [targetName, originalDirectory, targetFolder] = program.args; // 如果给要复制的源路径就添加源路径

      var scanComponentDirectorys = [defaultCompnentDir];
      if (originalDirectory) scanComponentDirectorys.push(originalDirectory);
      var originalCompnentPath = yield (0, _scan.default)(scanComponentDirectorys); // 获取 要更改的组建名称 和 路径地址

      var originalName = (0, _utils.getComponentName)(originalCompnentPath);
      var absolutePath = (0, _path.isAbsolute)(originalCompnentPath) ? originalCompnentPath : (0, _path.join)(process.cwd(), originalCompnentPath);
      var relativePath = (0, _path.relative)(process.cwd(), absolutePath);
      var originalFolder = (0, _utils.getComponentFolder)(relativePath);
      var answers = yield (0, _answers.componentAnswers)({
        targetName,
        originalName,
        targetFolder,
        originalFolder
      });

      if (opts.create.toLowerCase() === 'component') {
        (0, _replicateComponent.default)(originalCompnentPath, answers);
      } else {
        (0, _replicatePage.default)(originalCompnentPath, answers);
      }
    } catch (e) {
      log(_chalk.red.bold("[generate] ") + (0, _chalk.white)("".concat(e)));
    }
  });

  return function generate(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = generate;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJjb25zb2xlIiwiZGVmYXVsdENvbXBuZW50RGlyIiwiX19kaXJuYW1lIiwiZ2VuZXJhdGUiLCJwcm9ncmFtIiwiY3dkIiwib3B0cyIsInRhcmdldE5hbWUiLCJvcmlnaW5hbERpcmVjdG9yeSIsInRhcmdldEZvbGRlciIsImFyZ3MiLCJzY2FuQ29tcG9uZW50RGlyZWN0b3J5cyIsInB1c2giLCJvcmlnaW5hbENvbXBuZW50UGF0aCIsIm9yaWdpbmFsTmFtZSIsImFic29sdXRlUGF0aCIsInByb2Nlc3MiLCJyZWxhdGl2ZVBhdGgiLCJvcmlnaW5hbEZvbGRlciIsImFuc3dlcnMiLCJjcmVhdGUiLCJ0b0xvd2VyQ2FzZSIsImUiLCJyZWQiLCJib2xkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7O0FBQ0EsSUFBTUEsR0FBRyxHQUFHQyxPQUFPLENBQUNELEdBQXBCO0FBQ0EsSUFBTUUsa0JBQWtCLEdBQUcsbUJBQVFDLFNBQVIsRUFBbUIsY0FBbkIsQ0FBM0I7O0FBRUEsSUFBTUMsUUFBUTtBQUFBO0FBQUE7QUFBQSxnQ0FBRyxXQUFPQyxPQUFQLFFBQTRCO0FBQUEsUUFBWjtBQUFFQyxNQUFBQTtBQUFGLEtBQVk7O0FBQzNDLFFBQUk7QUFDRixVQUFNQyxJQUFJLEdBQUdGLE9BQU8sQ0FBQ0UsSUFBUixFQUFiO0FBQ0EsVUFBTSxDQUFFQyxVQUFGLEVBQWNDLGlCQUFkLEVBQWlDQyxZQUFqQyxJQUFrREwsT0FBTyxDQUFDTSxJQUFoRSxDQUZFLENBSUY7O0FBQ0EsVUFBTUMsdUJBQXVCLEdBQUcsQ0FBRVYsa0JBQUYsQ0FBaEM7QUFDQSxVQUFJTyxpQkFBSixFQUF1QkcsdUJBQXVCLENBQUNDLElBQXhCLENBQTZCSixpQkFBN0I7QUFDdkIsVUFBTUssb0JBQW9CLFNBQVMsbUJBQUtGLHVCQUFMLENBQW5DLENBUEUsQ0FTRjs7QUFDQSxVQUFNRyxZQUFZLEdBQUcsNkJBQWlCRCxvQkFBakIsQ0FBckI7QUFDQSxVQUFNRSxZQUFZLEdBQUcsc0JBQVdGLG9CQUFYLElBQ2pCQSxvQkFEaUIsR0FFakIsZ0JBQUtHLE9BQU8sQ0FBQ1gsR0FBUixFQUFMLEVBQW9CUSxvQkFBcEIsQ0FGSjtBQUdBLFVBQU1JLFlBQVksR0FBRyxvQkFBU0QsT0FBTyxDQUFDWCxHQUFSLEVBQVQsRUFBd0JVLFlBQXhCLENBQXJCO0FBQ0EsVUFBTUcsY0FBYyxHQUFHLCtCQUFtQkQsWUFBbkIsQ0FBdkI7QUFDQSxVQUFNRSxPQUFPLFNBQVMsK0JBQWlCO0FBQ3JDWixRQUFBQSxVQURxQztBQUVyQ08sUUFBQUEsWUFGcUM7QUFHckNMLFFBQUFBLFlBSHFDO0FBSXJDUyxRQUFBQTtBQUpxQyxPQUFqQixDQUF0Qjs7QUFNQSxVQUFHWixJQUFJLENBQUNjLE1BQUwsQ0FBWUMsV0FBWixPQUE4QixXQUFqQyxFQUE2QztBQUMzQyx5Q0FBbUJSLG9CQUFuQixFQUF5Q00sT0FBekM7QUFDRCxPQUZELE1BRUs7QUFDSCxvQ0FBY04sb0JBQWQsRUFBb0NNLE9BQXBDO0FBQ0Q7QUFDRixLQTNCRCxDQTJCRSxPQUFPRyxDQUFQLEVBQVU7QUFDVnZCLE1BQUFBLEdBQUcsQ0FBQ3dCLFdBQUlDLElBQUosa0JBQTBCLDRCQUFTRixDQUFULEVBQTNCLENBQUg7QUFDRDtBQUNGLEdBL0JhOztBQUFBLGtCQUFSbkIsUUFBUTtBQUFBO0FBQUE7QUFBQSxHQUFkOztlQWlDZUEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlbGF0aXZlLCBpc0Fic29sdXRlLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgY2FtZWxDYXNlLCB1cHBlckZpcnN0IH0gZnJvbSBcImxvZGFzaFwiXG5pbXBvcnQgeyByZWQsIHdoaXRlIH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCB7IGdldENvbXBvbmVudE5hbWUsIGdldENvbXBvbmVudEZvbGRlciB9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCByZXBsaWNhdGVDb21wb25lbnQgZnJvbSBcIi4vcmVwbGljYXRlQ29tcG9uZW50XCJcbmltcG9ydCByZXBsaWNhdGVQYWdlIGZyb20gXCIuL3JlcGxpY2F0ZVBhZ2VcIlxuXG5pbXBvcnQgc2NhbiBmcm9tIFwiLi9zY2FuXCJcbmltcG9ydCB7IGNvbXBvbmVudEFuc3dlcnMgfSBmcm9tIFwiLi9hbnN3ZXJzXCJcbmNvbnN0IGxvZyA9IGNvbnNvbGUubG9nXG5jb25zdCBkZWZhdWx0Q29tcG5lbnREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLi90ZW1wbGF0ZXNcIilcblxuY29uc3QgZ2VuZXJhdGUgPSBhc3luYyAocHJvZ3JhbSwgeyBjd2QgfSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG9wdHMgPSBwcm9ncmFtLm9wdHMoKVxuICAgIGNvbnN0IFsgdGFyZ2V0TmFtZSwgb3JpZ2luYWxEaXJlY3RvcnksIHRhcmdldEZvbGRlciBdID0gcHJvZ3JhbS5hcmdzXG4gICAgXG4gICAgLy8g5aaC5p6c57uZ6KaB5aSN5Yi255qE5rqQ6Lev5b6E5bCx5re75Yqg5rqQ6Lev5b6EXG4gICAgY29uc3Qgc2NhbkNvbXBvbmVudERpcmVjdG9yeXMgPSBbIGRlZmF1bHRDb21wbmVudERpciBdXG4gICAgaWYgKG9yaWdpbmFsRGlyZWN0b3J5KSBzY2FuQ29tcG9uZW50RGlyZWN0b3J5cy5wdXNoKG9yaWdpbmFsRGlyZWN0b3J5KVxuICAgIGNvbnN0IG9yaWdpbmFsQ29tcG5lbnRQYXRoID0gYXdhaXQgc2NhbihzY2FuQ29tcG9uZW50RGlyZWN0b3J5cylcblxuICAgIC8vIOiOt+WPliDopoHmm7TmlLnnmoTnu4Tlu7rlkI3np7Ag5ZKMIOi3r+W+hOWcsOWdgFxuICAgIGNvbnN0IG9yaWdpbmFsTmFtZSA9IGdldENvbXBvbmVudE5hbWUob3JpZ2luYWxDb21wbmVudFBhdGgpXG4gICAgY29uc3QgYWJzb2x1dGVQYXRoID0gaXNBYnNvbHV0ZShvcmlnaW5hbENvbXBuZW50UGF0aClcbiAgICAgID8gb3JpZ2luYWxDb21wbmVudFBhdGhcbiAgICAgIDogam9pbihwcm9jZXNzLmN3ZCgpLCBvcmlnaW5hbENvbXBuZW50UGF0aClcbiAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZShwcm9jZXNzLmN3ZCgpLCBhYnNvbHV0ZVBhdGgpXG4gICAgY29uc3Qgb3JpZ2luYWxGb2xkZXIgPSBnZXRDb21wb25lbnRGb2xkZXIocmVsYXRpdmVQYXRoKVxuICAgIGNvbnN0IGFuc3dlcnMgPSBhd2FpdCBjb21wb25lbnRBbnN3ZXJzKHtcbiAgICAgIHRhcmdldE5hbWUsXG4gICAgICBvcmlnaW5hbE5hbWUsXG4gICAgICB0YXJnZXRGb2xkZXIsXG4gICAgICBvcmlnaW5hbEZvbGRlcixcbiAgICB9KVxuICAgIGlmKG9wdHMuY3JlYXRlLnRvTG93ZXJDYXNlKCkgPT09ICdjb21wb25lbnQnKXtcbiAgICAgIHJlcGxpY2F0ZUNvbXBvbmVudChvcmlnaW5hbENvbXBuZW50UGF0aCwgYW5zd2VycylcbiAgICB9ZWxzZXtcbiAgICAgIHJlcGxpY2F0ZVBhZ2Uob3JpZ2luYWxDb21wbmVudFBhdGgsIGFuc3dlcnMpXG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nKHJlZC5ib2xkKGBbZ2VuZXJhdGVdIGApICsgd2hpdGUoYCR7ZX1gKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZVxuIl19