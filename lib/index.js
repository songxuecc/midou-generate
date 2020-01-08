"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _chalk = require("chalk");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _utils = require("./utils");

var _scan = _interopRequireDefault(require("./scan"));

var _answers = require("./answers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var defaultCompnentDir = (0, _path.resolve)(__dirname, "../templates");

var generate =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (program, _ref) {
    var {
      cwd
    } = _ref;

    try {
      var type = program.opts();
      var [targetName, targetFolder, originalDirectory] = program.args; // 如果给要复制的源路径就添加源路径
      // const originalDirectory = false

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
      (0, _utils.replicate)(originalCompnentPath, answers);
    } catch (e) {
      (0, _chalk.red)("[generate] error: ".concat(e.message));
    }
  });

  return function generate(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = generate;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Q29tcG5lbnREaXIiLCJfX2Rpcm5hbWUiLCJnZW5lcmF0ZSIsInByb2dyYW0iLCJjd2QiLCJ0eXBlIiwib3B0cyIsInRhcmdldE5hbWUiLCJ0YXJnZXRGb2xkZXIiLCJvcmlnaW5hbERpcmVjdG9yeSIsImFyZ3MiLCJzY2FuQ29tcG9uZW50RGlyZWN0b3J5cyIsInB1c2giLCJvcmlnaW5hbENvbXBuZW50UGF0aCIsIm9yaWdpbmFsTmFtZSIsImFic29sdXRlUGF0aCIsInByb2Nlc3MiLCJyZWxhdGl2ZVBhdGgiLCJvcmlnaW5hbEZvbGRlciIsImFuc3dlcnMiLCJlIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLGtCQUFrQixHQUFHLG1CQUFRQyxTQUFSLEVBQW1CLGNBQW5CLENBQTNCOztBQUVBLElBQU1DLFFBQVE7QUFBQTtBQUFBO0FBQUEsZ0NBQUcsV0FBT0MsT0FBUCxRQUE0QjtBQUFBLFFBQVo7QUFBRUMsTUFBQUE7QUFBRixLQUFZOztBQUMzQyxRQUFJO0FBQ0YsVUFBTUMsSUFBSSxHQUFHRixPQUFPLENBQUNHLElBQVIsRUFBYjtBQUNBLFVBQU0sQ0FBRUMsVUFBRixFQUFjQyxZQUFkLEVBQTRCQyxpQkFBNUIsSUFBa0ROLE9BQU8sQ0FBQ08sSUFBaEUsQ0FGRSxDQUlGO0FBQ0E7O0FBQ0EsVUFBTUMsdUJBQXVCLEdBQUcsQ0FBRVgsa0JBQUYsQ0FBaEM7QUFDQSxVQUFJUyxpQkFBSixFQUF1QkUsdUJBQXVCLENBQUNDLElBQXhCLENBQTZCSCxpQkFBN0I7QUFDdkIsVUFBTUksb0JBQW9CLFNBQVMsbUJBQUtGLHVCQUFMLENBQW5DLENBUkUsQ0FVRjs7QUFDQSxVQUFNRyxZQUFZLEdBQUcsNkJBQWlCRCxvQkFBakIsQ0FBckI7QUFDQSxVQUFNRSxZQUFZLEdBQUcsc0JBQVdGLG9CQUFYLElBQ2pCQSxvQkFEaUIsR0FFakIsZ0JBQUtHLE9BQU8sQ0FBQ1osR0FBUixFQUFMLEVBQW9CUyxvQkFBcEIsQ0FGSjtBQUdBLFVBQU1JLFlBQVksR0FBRyxvQkFBU0QsT0FBTyxDQUFDWixHQUFSLEVBQVQsRUFBd0JXLFlBQXhCLENBQXJCO0FBQ0EsVUFBTUcsY0FBYyxHQUFHLCtCQUFtQkQsWUFBbkIsQ0FBdkI7QUFDQSxVQUFNRSxPQUFPLFNBQVMsK0JBQWlCO0FBQ3JDWixRQUFBQSxVQURxQztBQUVyQ08sUUFBQUEsWUFGcUM7QUFHckNOLFFBQUFBLFlBSHFDO0FBSXJDVSxRQUFBQTtBQUpxQyxPQUFqQixDQUF0QjtBQU9BLDRCQUFVTCxvQkFBVixFQUErQk0sT0FBL0I7QUFFRCxLQTFCRCxDQTBCRSxPQUFPQyxDQUFQLEVBQVU7QUFDVixrREFBeUJBLENBQUMsQ0FBQ0MsT0FBM0I7QUFDRDtBQUNGLEdBOUJhOztBQUFBLGtCQUFSbkIsUUFBUTtBQUFBO0FBQUE7QUFBQSxHQUFkOztlQWdDZUEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlbGF0aXZlLCBpc0Fic29sdXRlLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgY3lhbiwgZ3JlZW4sIHJlZCB9IGZyb20gXCJjaGFsa1wiXG5pbXBvcnQgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCJcbmltcG9ydCB7IGdldENvbXBvbmVudE5hbWUsIGdldENvbXBvbmVudEZvbGRlciAsIHJlcGxpY2F0ZSB9IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IHNjYW4gZnJvbSBcIi4vc2NhblwiXG5pbXBvcnQgeyBjb21wb25lbnRBbnN3ZXJzIH0gZnJvbSBcIi4vYW5zd2Vyc1wiXG5cbmNvbnN0IGRlZmF1bHRDb21wbmVudERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcIi4uL3RlbXBsYXRlc1wiKVxuXG5jb25zdCBnZW5lcmF0ZSA9IGFzeW5jIChwcm9ncmFtLCB7IGN3ZCB9KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdHlwZSA9IHByb2dyYW0ub3B0cygpXG4gICAgY29uc3QgWyB0YXJnZXROYW1lLCB0YXJnZXRGb2xkZXIsIG9yaWdpbmFsRGlyZWN0b3J5IF0gPSBwcm9ncmFtLmFyZ3NcblxuICAgIC8vIOWmguaenOe7meimgeWkjeWItueahOa6kOi3r+W+hOWwsea3u+WKoOa6kOi3r+W+hFxuICAgIC8vIGNvbnN0IG9yaWdpbmFsRGlyZWN0b3J5ID0gZmFsc2VcbiAgICBjb25zdCBzY2FuQ29tcG9uZW50RGlyZWN0b3J5cyA9IFsgZGVmYXVsdENvbXBuZW50RGlyIF1cbiAgICBpZiAob3JpZ2luYWxEaXJlY3RvcnkpIHNjYW5Db21wb25lbnREaXJlY3RvcnlzLnB1c2gob3JpZ2luYWxEaXJlY3RvcnkpXG4gICAgY29uc3Qgb3JpZ2luYWxDb21wbmVudFBhdGggPSBhd2FpdCBzY2FuKHNjYW5Db21wb25lbnREaXJlY3RvcnlzKVxuXG4gICAgLy8g6I635Y+WIOimgeabtOaUueeahOe7hOW7uuWQjeensCDlkowg6Lev5b6E5Zyw5Z2AXG4gICAgY29uc3Qgb3JpZ2luYWxOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShvcmlnaW5hbENvbXBuZW50UGF0aClcbiAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBpc0Fic29sdXRlKG9yaWdpbmFsQ29tcG5lbnRQYXRoKVxuICAgICAgPyBvcmlnaW5hbENvbXBuZW50UGF0aFxuICAgICAgOiBqb2luKHByb2Nlc3MuY3dkKCksIG9yaWdpbmFsQ29tcG5lbnRQYXRoKVxuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIGFic29sdXRlUGF0aClcbiAgICBjb25zdCBvcmlnaW5hbEZvbGRlciA9IGdldENvbXBvbmVudEZvbGRlcihyZWxhdGl2ZVBhdGgpXG4gICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IGNvbXBvbmVudEFuc3dlcnMoe1xuICAgICAgdGFyZ2V0TmFtZSxcbiAgICAgIG9yaWdpbmFsTmFtZSxcbiAgICAgIHRhcmdldEZvbGRlcixcbiAgICAgIG9yaWdpbmFsRm9sZGVyLFxuICAgIH0pXG5cbiAgICByZXBsaWNhdGUob3JpZ2luYWxDb21wbmVudFBhdGgsYW5zd2VycylcblxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVkKGBbZ2VuZXJhdGVdIGVycm9yOiAke2UubWVzc2FnZX1gKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlXG4gIl19