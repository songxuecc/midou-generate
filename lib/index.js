"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _chalk = require("chalk");

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
      var opts = program.opts();
      console.log(opts.create);
      var [targetName, originalDirectory, targetFolder] = program.args;
      console.log(program.args); // 如果给要复制的源路径就添加源路径
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Q29tcG5lbnREaXIiLCJfX2Rpcm5hbWUiLCJnZW5lcmF0ZSIsInByb2dyYW0iLCJjd2QiLCJvcHRzIiwiY29uc29sZSIsImxvZyIsImNyZWF0ZSIsInRhcmdldE5hbWUiLCJvcmlnaW5hbERpcmVjdG9yeSIsInRhcmdldEZvbGRlciIsImFyZ3MiLCJzY2FuQ29tcG9uZW50RGlyZWN0b3J5cyIsInB1c2giLCJvcmlnaW5hbENvbXBuZW50UGF0aCIsIm9yaWdpbmFsTmFtZSIsImFic29sdXRlUGF0aCIsInByb2Nlc3MiLCJyZWxhdGl2ZVBhdGgiLCJvcmlnaW5hbEZvbGRlciIsImFuc3dlcnMiLCJlIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLGtCQUFrQixHQUFHLG1CQUFRQyxTQUFSLEVBQW1CLGNBQW5CLENBQTNCOztBQUVBLElBQU1DLFFBQVE7QUFBQTtBQUFBO0FBQUEsZ0NBQUcsV0FBT0MsT0FBUCxRQUE0QjtBQUFBLFFBQVo7QUFBRUMsTUFBQUE7QUFBRixLQUFZOztBQUMzQyxRQUFJO0FBQ0YsVUFBTUMsSUFBSSxHQUFHRixPQUFPLENBQUNFLElBQVIsRUFBYjtBQUNBQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsSUFBSSxDQUFDRyxNQUFqQjtBQUNBLFVBQU0sQ0FBRUMsVUFBRixFQUFlQyxpQkFBZixFQUFpQ0MsWUFBakMsSUFBbURSLE9BQU8sQ0FBQ1MsSUFBakU7QUFDQU4sTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlKLE9BQU8sQ0FBQ1MsSUFBcEIsRUFKRSxDQU1GO0FBQ0E7O0FBQ0EsVUFBTUMsdUJBQXVCLEdBQUcsQ0FBRWIsa0JBQUYsQ0FBaEM7QUFDQSxVQUFJVSxpQkFBSixFQUF1QkcsdUJBQXVCLENBQUNDLElBQXhCLENBQTZCSixpQkFBN0I7QUFDdkIsVUFBTUssb0JBQW9CLFNBQVMsbUJBQUtGLHVCQUFMLENBQW5DLENBVkUsQ0FZRjs7QUFDQSxVQUFNRyxZQUFZLEdBQUcsNkJBQWlCRCxvQkFBakIsQ0FBckI7QUFDQSxVQUFNRSxZQUFZLEdBQUcsc0JBQVdGLG9CQUFYLElBQ2pCQSxvQkFEaUIsR0FFakIsZ0JBQUtHLE9BQU8sQ0FBQ2QsR0FBUixFQUFMLEVBQW9CVyxvQkFBcEIsQ0FGSjtBQUdBLFVBQU1JLFlBQVksR0FBRyxvQkFBU0QsT0FBTyxDQUFDZCxHQUFSLEVBQVQsRUFBd0JhLFlBQXhCLENBQXJCO0FBQ0EsVUFBTUcsY0FBYyxHQUFHLCtCQUFtQkQsWUFBbkIsQ0FBdkI7QUFDQSxVQUFNRSxPQUFPLFNBQVMsK0JBQWlCO0FBQ3JDWixRQUFBQSxVQURxQztBQUVyQ08sUUFBQUEsWUFGcUM7QUFHckNMLFFBQUFBLFlBSHFDO0FBSXJDUyxRQUFBQTtBQUpxQyxPQUFqQixDQUF0QjtBQU1BLDRCQUFVTCxvQkFBVixFQUErQk0sT0FBL0I7QUFDRCxLQTFCRCxDQTBCRSxPQUFPQyxDQUFQLEVBQVU7QUFDVixrREFBeUJBLENBQUMsQ0FBQ0MsT0FBM0I7QUFDRDtBQUNGLEdBOUJhOztBQUFBLGtCQUFSckIsUUFBUTtBQUFBO0FBQUE7QUFBQSxHQUFkOztlQWdDZUEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlbGF0aXZlLCBpc0Fic29sdXRlLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgcmVkIH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCB7IGdldENvbXBvbmVudE5hbWUsIGdldENvbXBvbmVudEZvbGRlciAsIHJlcGxpY2F0ZSB9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCBzY2FuIGZyb20gXCIuL3NjYW5cIlxuaW1wb3J0IHsgY29tcG9uZW50QW5zd2VycyB9IGZyb20gXCIuL2Fuc3dlcnNcIlxuXG5jb25zdCBkZWZhdWx0Q29tcG5lbnREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLi90ZW1wbGF0ZXNcIilcblxuY29uc3QgZ2VuZXJhdGUgPSBhc3luYyAocHJvZ3JhbSwgeyBjd2QgfSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG9wdHMgPSBwcm9ncmFtLm9wdHMoKVxuICAgIGNvbnNvbGUubG9nKG9wdHMuY3JlYXRlKVxuICAgIGNvbnN0IFsgdGFyZ2V0TmFtZSwgIG9yaWdpbmFsRGlyZWN0b3J5LHRhcmdldEZvbGRlciwgXSA9IHByb2dyYW0uYXJnc1xuICAgIGNvbnNvbGUubG9nKHByb2dyYW0uYXJncylcblxuICAgIC8vIOWmguaenOe7meimgeWkjeWItueahOa6kOi3r+W+hOWwsea3u+WKoOa6kOi3r+W+hFxuICAgIC8vIGNvbnN0IG9yaWdpbmFsRGlyZWN0b3J5ID0gZmFsc2VcbiAgICBjb25zdCBzY2FuQ29tcG9uZW50RGlyZWN0b3J5cyA9IFsgZGVmYXVsdENvbXBuZW50RGlyIF1cbiAgICBpZiAob3JpZ2luYWxEaXJlY3RvcnkpIHNjYW5Db21wb25lbnREaXJlY3RvcnlzLnB1c2gob3JpZ2luYWxEaXJlY3RvcnkpXG4gICAgY29uc3Qgb3JpZ2luYWxDb21wbmVudFBhdGggPSBhd2FpdCBzY2FuKHNjYW5Db21wb25lbnREaXJlY3RvcnlzKVxuXG4gICAgLy8g6I635Y+WIOimgeabtOaUueeahOe7hOW7uuWQjeensCDlkowg6Lev5b6E5Zyw5Z2AXG4gICAgY29uc3Qgb3JpZ2luYWxOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShvcmlnaW5hbENvbXBuZW50UGF0aClcbiAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBpc0Fic29sdXRlKG9yaWdpbmFsQ29tcG5lbnRQYXRoKVxuICAgICAgPyBvcmlnaW5hbENvbXBuZW50UGF0aFxuICAgICAgOiBqb2luKHByb2Nlc3MuY3dkKCksIG9yaWdpbmFsQ29tcG5lbnRQYXRoKVxuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIGFic29sdXRlUGF0aClcbiAgICBjb25zdCBvcmlnaW5hbEZvbGRlciA9IGdldENvbXBvbmVudEZvbGRlcihyZWxhdGl2ZVBhdGgpXG4gICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IGNvbXBvbmVudEFuc3dlcnMoe1xuICAgICAgdGFyZ2V0TmFtZSxcbiAgICAgIG9yaWdpbmFsTmFtZSxcbiAgICAgIHRhcmdldEZvbGRlcixcbiAgICAgIG9yaWdpbmFsRm9sZGVyLFxuICAgIH0pXG4gICAgcmVwbGljYXRlKG9yaWdpbmFsQ29tcG5lbnRQYXRoLGFuc3dlcnMpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWQoYFtnZW5lcmF0ZV0gZXJyb3I6ICR7ZS5tZXNzYWdlfWApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVcbiAiXX0=