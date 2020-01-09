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
      var type = program.opts();
      var [targetName, originalDirectory, targetFolder] = program.args; // 如果给要复制的源路径就添加源路径
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
      console.log("kjhkhkjhkjh");
      console.log(answers, 'answers');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Q29tcG5lbnREaXIiLCJfX2Rpcm5hbWUiLCJnZW5lcmF0ZSIsInByb2dyYW0iLCJjd2QiLCJ0eXBlIiwib3B0cyIsInRhcmdldE5hbWUiLCJvcmlnaW5hbERpcmVjdG9yeSIsInRhcmdldEZvbGRlciIsImFyZ3MiLCJzY2FuQ29tcG9uZW50RGlyZWN0b3J5cyIsInB1c2giLCJvcmlnaW5hbENvbXBuZW50UGF0aCIsIm9yaWdpbmFsTmFtZSIsImFic29sdXRlUGF0aCIsInByb2Nlc3MiLCJyZWxhdGl2ZVBhdGgiLCJvcmlnaW5hbEZvbGRlciIsImFuc3dlcnMiLCJjb25zb2xlIiwibG9nIiwiZSIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxtQkFBUUMsU0FBUixFQUFtQixjQUFuQixDQUEzQjs7QUFFQSxJQUFNQyxRQUFRO0FBQUE7QUFBQTtBQUFBLGdDQUFHLFdBQU9DLE9BQVAsUUFBNEI7QUFBQSxRQUFaO0FBQUVDLE1BQUFBO0FBQUYsS0FBWTs7QUFDM0MsUUFBSTtBQUNGLFVBQU1DLElBQUksR0FBR0YsT0FBTyxDQUFDRyxJQUFSLEVBQWI7QUFDQSxVQUFNLENBQUVDLFVBQUYsRUFBZUMsaUJBQWYsRUFBaUNDLFlBQWpDLElBQW1ETixPQUFPLENBQUNPLElBQWpFLENBRkUsQ0FJRjtBQUNBOztBQUNBLFVBQU1DLHVCQUF1QixHQUFHLENBQUVYLGtCQUFGLENBQWhDO0FBQ0EsVUFBSVEsaUJBQUosRUFBdUJHLHVCQUF1QixDQUFDQyxJQUF4QixDQUE2QkosaUJBQTdCO0FBQ3ZCLFVBQU1LLG9CQUFvQixTQUFTLG1CQUFLRix1QkFBTCxDQUFuQyxDQVJFLENBVUY7O0FBQ0EsVUFBTUcsWUFBWSxHQUFHLDZCQUFpQkQsb0JBQWpCLENBQXJCO0FBQ0EsVUFBTUUsWUFBWSxHQUFHLHNCQUFXRixvQkFBWCxJQUNqQkEsb0JBRGlCLEdBRWpCLGdCQUFLRyxPQUFPLENBQUNaLEdBQVIsRUFBTCxFQUFvQlMsb0JBQXBCLENBRko7QUFHQSxVQUFNSSxZQUFZLEdBQUcsb0JBQVNELE9BQU8sQ0FBQ1osR0FBUixFQUFULEVBQXdCVyxZQUF4QixDQUFyQjtBQUNBLFVBQU1HLGNBQWMsR0FBRywrQkFBbUJELFlBQW5CLENBQXZCO0FBQ0EsVUFBTUUsT0FBTyxTQUFTLCtCQUFpQjtBQUNyQ1osUUFBQUEsVUFEcUM7QUFFckNPLFFBQUFBLFlBRnFDO0FBR3JDTCxRQUFBQSxZQUhxQztBQUlyQ1MsUUFBQUE7QUFKcUMsT0FBakIsQ0FBdEI7QUFNSkUsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksYUFBWjtBQUNBRCxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsT0FBWixFQUFvQixTQUFwQjtBQUNJLDRCQUFVTixvQkFBVixFQUErQk0sT0FBL0I7QUFDRCxLQTFCRCxDQTBCRSxPQUFPRyxDQUFQLEVBQVU7QUFDVixrREFBeUJBLENBQUMsQ0FBQ0MsT0FBM0I7QUFDRDtBQUNGLEdBOUJhOztBQUFBLGtCQUFSckIsUUFBUTtBQUFBO0FBQUE7QUFBQSxHQUFkOztlQWdDZUEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4sIHJlbGF0aXZlLCBpc0Fic29sdXRlLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgcmVkIH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCB7IGdldENvbXBvbmVudE5hbWUsIGdldENvbXBvbmVudEZvbGRlciAsIHJlcGxpY2F0ZSB9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCBzY2FuIGZyb20gXCIuL3NjYW5cIlxuaW1wb3J0IHsgY29tcG9uZW50QW5zd2VycyB9IGZyb20gXCIuL2Fuc3dlcnNcIlxuXG5jb25zdCBkZWZhdWx0Q29tcG5lbnREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLi90ZW1wbGF0ZXNcIilcblxuY29uc3QgZ2VuZXJhdGUgPSBhc3luYyAocHJvZ3JhbSwgeyBjd2QgfSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHR5cGUgPSBwcm9ncmFtLm9wdHMoKVxuICAgIGNvbnN0IFsgdGFyZ2V0TmFtZSwgIG9yaWdpbmFsRGlyZWN0b3J5LHRhcmdldEZvbGRlciwgXSA9IHByb2dyYW0uYXJnc1xuXG4gICAgLy8g5aaC5p6c57uZ6KaB5aSN5Yi255qE5rqQ6Lev5b6E5bCx5re75Yqg5rqQ6Lev5b6EXG4gICAgLy8gY29uc3Qgb3JpZ2luYWxEaXJlY3RvcnkgPSBmYWxzZVxuICAgIGNvbnN0IHNjYW5Db21wb25lbnREaXJlY3RvcnlzID0gWyBkZWZhdWx0Q29tcG5lbnREaXIgXVxuICAgIGlmIChvcmlnaW5hbERpcmVjdG9yeSkgc2NhbkNvbXBvbmVudERpcmVjdG9yeXMucHVzaChvcmlnaW5hbERpcmVjdG9yeSlcbiAgICBjb25zdCBvcmlnaW5hbENvbXBuZW50UGF0aCA9IGF3YWl0IHNjYW4oc2NhbkNvbXBvbmVudERpcmVjdG9yeXMpXG5cbiAgICAvLyDojrflj5Yg6KaB5pu05pS555qE57uE5bu65ZCN56ewIOWSjCDot6/lvoTlnLDlnYBcbiAgICBjb25zdCBvcmlnaW5hbE5hbWUgPSBnZXRDb21wb25lbnROYW1lKG9yaWdpbmFsQ29tcG5lbnRQYXRoKVxuICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IGlzQWJzb2x1dGUob3JpZ2luYWxDb21wbmVudFBhdGgpXG4gICAgICA/IG9yaWdpbmFsQ29tcG5lbnRQYXRoXG4gICAgICA6IGpvaW4ocHJvY2Vzcy5jd2QoKSwgb3JpZ2luYWxDb21wbmVudFBhdGgpXG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUocHJvY2Vzcy5jd2QoKSwgYWJzb2x1dGVQYXRoKVxuICAgIGNvbnN0IG9yaWdpbmFsRm9sZGVyID0gZ2V0Q29tcG9uZW50Rm9sZGVyKHJlbGF0aXZlUGF0aClcbiAgICBjb25zdCBhbnN3ZXJzID0gYXdhaXQgY29tcG9uZW50QW5zd2Vycyh7XG4gICAgICB0YXJnZXROYW1lLFxuICAgICAgb3JpZ2luYWxOYW1lLFxuICAgICAgdGFyZ2V0Rm9sZGVyLFxuICAgICAgb3JpZ2luYWxGb2xkZXIsXG4gICAgfSlcbmNvbnNvbGUubG9nKFwia2poa2hramhramhcIilcbmNvbnNvbGUubG9nKGFuc3dlcnMsJ2Fuc3dlcnMnKVxuICAgIHJlcGxpY2F0ZShvcmlnaW5hbENvbXBuZW50UGF0aCxhbnN3ZXJzKVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVkKGBbZ2VuZXJhdGVdIGVycm9yOiAke2UubWVzc2FnZX1gKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlXG4gIl19