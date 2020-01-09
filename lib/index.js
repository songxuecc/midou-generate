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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Q29tcG5lbnREaXIiLCJfX2Rpcm5hbWUiLCJnZW5lcmF0ZSIsInByb2dyYW0iLCJjd2QiLCJvcHRzIiwiY29uc29sZSIsImxvZyIsImNyZWF0ZSIsInRhcmdldE5hbWUiLCJvcmlnaW5hbERpcmVjdG9yeSIsInRhcmdldEZvbGRlciIsImFyZ3MiLCJzY2FuQ29tcG9uZW50RGlyZWN0b3J5cyIsInB1c2giLCJvcmlnaW5hbENvbXBuZW50UGF0aCIsIm9yaWdpbmFsTmFtZSIsImFic29sdXRlUGF0aCIsInByb2Nlc3MiLCJyZWxhdGl2ZVBhdGgiLCJvcmlnaW5hbEZvbGRlciIsImFuc3dlcnMiLCJlIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLGtCQUFrQixHQUFHLG1CQUFRQyxTQUFSLEVBQW1CLGNBQW5CLENBQTNCOztBQUVBLElBQU1DLFFBQVE7QUFBQTtBQUFBO0FBQUEsZ0NBQUcsV0FBT0MsT0FBUCxRQUE0QjtBQUFBLFFBQVo7QUFBRUMsTUFBQUE7QUFBRixLQUFZOztBQUUzQyxRQUFJO0FBQ0YsVUFBTUMsSUFBSSxHQUFHRixPQUFPLENBQUNFLElBQVIsRUFBYjtBQUNBQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsSUFBSSxDQUFDRyxNQUFqQjtBQUNBLFVBQU0sQ0FBRUMsVUFBRixFQUFlQyxpQkFBZixFQUFpQ0MsWUFBakMsSUFBbURSLE9BQU8sQ0FBQ1MsSUFBakU7QUFDQU4sTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlKLE9BQU8sQ0FBQ1MsSUFBcEIsRUFKRSxDQU1GO0FBQ0E7O0FBQ0EsVUFBTUMsdUJBQXVCLEdBQUcsQ0FBRWIsa0JBQUYsQ0FBaEM7QUFDQSxVQUFJVSxpQkFBSixFQUF1QkcsdUJBQXVCLENBQUNDLElBQXhCLENBQTZCSixpQkFBN0I7QUFDdkIsVUFBTUssb0JBQW9CLFNBQVMsbUJBQUtGLHVCQUFMLENBQW5DLENBVkUsQ0FZRjs7QUFDQSxVQUFNRyxZQUFZLEdBQUcsNkJBQWlCRCxvQkFBakIsQ0FBckI7QUFDQSxVQUFNRSxZQUFZLEdBQUcsc0JBQVdGLG9CQUFYLElBQ2pCQSxvQkFEaUIsR0FFakIsZ0JBQUtHLE9BQU8sQ0FBQ2QsR0FBUixFQUFMLEVBQW9CVyxvQkFBcEIsQ0FGSjtBQUdBLFVBQU1JLFlBQVksR0FBRyxvQkFBU0QsT0FBTyxDQUFDZCxHQUFSLEVBQVQsRUFBd0JhLFlBQXhCLENBQXJCO0FBQ0EsVUFBTUcsY0FBYyxHQUFHLCtCQUFtQkQsWUFBbkIsQ0FBdkI7QUFDQSxVQUFNRSxPQUFPLFNBQVMsK0JBQWlCO0FBQ3JDWixRQUFBQSxVQURxQztBQUVyQ08sUUFBQUEsWUFGcUM7QUFHckNMLFFBQUFBLFlBSHFDO0FBSXJDUyxRQUFBQTtBQUpxQyxPQUFqQixDQUF0QjtBQU1BLDRCQUFVTCxvQkFBVixFQUErQk0sT0FBL0I7QUFDRCxLQTFCRCxDQTBCRSxPQUFPQyxDQUFQLEVBQVU7QUFDVixrREFBeUJBLENBQUMsQ0FBQ0MsT0FBM0I7QUFDRDtBQUNGLEdBL0JhOztBQUFBLGtCQUFSckIsUUFBUTtBQUFBO0FBQUE7QUFBQSxHQUFkOztlQWlDZUEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlbGF0aXZlLCBpc0Fic29sdXRlLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgcmVkIH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCB7IGdldENvbXBvbmVudE5hbWUsIGdldENvbXBvbmVudEZvbGRlciAsIHJlcGxpY2F0ZSB9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCBzY2FuIGZyb20gXCIuL3NjYW5cIlxuaW1wb3J0IHsgY29tcG9uZW50QW5zd2VycyB9IGZyb20gXCIuL2Fuc3dlcnNcIlxuXG5jb25zdCBkZWZhdWx0Q29tcG5lbnREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLi90ZW1wbGF0ZXNcIilcblxuY29uc3QgZ2VuZXJhdGUgPSBhc3luYyAocHJvZ3JhbSwgeyBjd2QgfSkgPT4ge1xuXG4gIHRyeSB7XG4gICAgY29uc3Qgb3B0cyA9IHByb2dyYW0ub3B0cygpXG4gICAgY29uc29sZS5sb2cob3B0cy5jcmVhdGUpXG4gICAgY29uc3QgWyB0YXJnZXROYW1lLCAgb3JpZ2luYWxEaXJlY3RvcnksdGFyZ2V0Rm9sZGVyLCBdID0gcHJvZ3JhbS5hcmdzXG4gICAgY29uc29sZS5sb2cocHJvZ3JhbS5hcmdzKVxuXG4gICAgLy8g5aaC5p6c57uZ6KaB5aSN5Yi255qE5rqQ6Lev5b6E5bCx5re75Yqg5rqQ6Lev5b6EXG4gICAgLy8gY29uc3Qgb3JpZ2luYWxEaXJlY3RvcnkgPSBmYWxzZVxuICAgIGNvbnN0IHNjYW5Db21wb25lbnREaXJlY3RvcnlzID0gWyBkZWZhdWx0Q29tcG5lbnREaXIgXVxuICAgIGlmIChvcmlnaW5hbERpcmVjdG9yeSkgc2NhbkNvbXBvbmVudERpcmVjdG9yeXMucHVzaChvcmlnaW5hbERpcmVjdG9yeSlcbiAgICBjb25zdCBvcmlnaW5hbENvbXBuZW50UGF0aCA9IGF3YWl0IHNjYW4oc2NhbkNvbXBvbmVudERpcmVjdG9yeXMpXG5cbiAgICAvLyDojrflj5Yg6KaB5pu05pS555qE57uE5bu65ZCN56ewIOWSjCDot6/lvoTlnLDlnYBcbiAgICBjb25zdCBvcmlnaW5hbE5hbWUgPSBnZXRDb21wb25lbnROYW1lKG9yaWdpbmFsQ29tcG5lbnRQYXRoKVxuICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IGlzQWJzb2x1dGUob3JpZ2luYWxDb21wbmVudFBhdGgpXG4gICAgICA/IG9yaWdpbmFsQ29tcG5lbnRQYXRoXG4gICAgICA6IGpvaW4ocHJvY2Vzcy5jd2QoKSwgb3JpZ2luYWxDb21wbmVudFBhdGgpXG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUocHJvY2Vzcy5jd2QoKSwgYWJzb2x1dGVQYXRoKVxuICAgIGNvbnN0IG9yaWdpbmFsRm9sZGVyID0gZ2V0Q29tcG9uZW50Rm9sZGVyKHJlbGF0aXZlUGF0aClcbiAgICBjb25zdCBhbnN3ZXJzID0gYXdhaXQgY29tcG9uZW50QW5zd2Vycyh7XG4gICAgICB0YXJnZXROYW1lLFxuICAgICAgb3JpZ2luYWxOYW1lLFxuICAgICAgdGFyZ2V0Rm9sZGVyLFxuICAgICAgb3JpZ2luYWxGb2xkZXIsXG4gICAgfSlcbiAgICByZXBsaWNhdGUob3JpZ2luYWxDb21wbmVudFBhdGgsYW5zd2VycylcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlZChgW2dlbmVyYXRlXSBlcnJvcjogJHtlLm1lc3NhZ2V9YClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZVxuICJdfQ==