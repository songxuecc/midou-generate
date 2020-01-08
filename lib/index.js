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
      var [targetName, originalDirectory, targetFolder] = program.args;
      console.log(targetFolder); // 如果给要复制的源路径就添加源路径
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Q29tcG5lbnREaXIiLCJfX2Rpcm5hbWUiLCJnZW5lcmF0ZSIsInByb2dyYW0iLCJjd2QiLCJ0eXBlIiwib3B0cyIsInRhcmdldE5hbWUiLCJvcmlnaW5hbERpcmVjdG9yeSIsInRhcmdldEZvbGRlciIsImFyZ3MiLCJjb25zb2xlIiwibG9nIiwic2NhbkNvbXBvbmVudERpcmVjdG9yeXMiLCJwdXNoIiwib3JpZ2luYWxDb21wbmVudFBhdGgiLCJvcmlnaW5hbE5hbWUiLCJhYnNvbHV0ZVBhdGgiLCJwcm9jZXNzIiwicmVsYXRpdmVQYXRoIiwib3JpZ2luYWxGb2xkZXIiLCJhbnN3ZXJzIiwiZSIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxtQkFBUUMsU0FBUixFQUFtQixjQUFuQixDQUEzQjs7QUFFQSxJQUFNQyxRQUFRO0FBQUE7QUFBQTtBQUFBLGdDQUFHLFdBQU9DLE9BQVAsUUFBNEI7QUFBQSxRQUFaO0FBQUVDLE1BQUFBO0FBQUYsS0FBWTs7QUFDM0MsUUFBSTtBQUNGLFVBQU1DLElBQUksR0FBR0YsT0FBTyxDQUFDRyxJQUFSLEVBQWI7QUFDQSxVQUFNLENBQUVDLFVBQUYsRUFBZUMsaUJBQWYsRUFBaUNDLFlBQWpDLElBQW1ETixPQUFPLENBQUNPLElBQWpFO0FBR0FDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSCxZQUFaLEVBTEUsQ0FNRjtBQUNBOztBQUNBLFVBQU1JLHVCQUF1QixHQUFHLENBQUViLGtCQUFGLENBQWhDO0FBQ0EsVUFBSVEsaUJBQUosRUFBdUJLLHVCQUF1QixDQUFDQyxJQUF4QixDQUE2Qk4saUJBQTdCO0FBQ3ZCLFVBQU1PLG9CQUFvQixTQUFTLG1CQUFLRix1QkFBTCxDQUFuQyxDQVZFLENBWUY7O0FBQ0EsVUFBTUcsWUFBWSxHQUFHLDZCQUFpQkQsb0JBQWpCLENBQXJCO0FBQ0EsVUFBTUUsWUFBWSxHQUFHLHNCQUFXRixvQkFBWCxJQUNqQkEsb0JBRGlCLEdBRWpCLGdCQUFLRyxPQUFPLENBQUNkLEdBQVIsRUFBTCxFQUFvQlcsb0JBQXBCLENBRko7QUFHQSxVQUFNSSxZQUFZLEdBQUcsb0JBQVNELE9BQU8sQ0FBQ2QsR0FBUixFQUFULEVBQXdCYSxZQUF4QixDQUFyQjtBQUNBLFVBQU1HLGNBQWMsR0FBRywrQkFBbUJELFlBQW5CLENBQXZCO0FBQ0EsVUFBTUUsT0FBTyxTQUFTLCtCQUFpQjtBQUNyQ2QsUUFBQUEsVUFEcUM7QUFFckNTLFFBQUFBLFlBRnFDO0FBR3JDUCxRQUFBQSxZQUhxQztBQUlyQ1csUUFBQUE7QUFKcUMsT0FBakIsQ0FBdEI7QUFNQSw0QkFBVUwsb0JBQVYsRUFBK0JNLE9BQS9CO0FBQ0QsS0ExQkQsQ0EwQkUsT0FBT0MsQ0FBUCxFQUFVO0FBQ1Ysa0RBQXlCQSxDQUFDLENBQUNDLE9BQTNCO0FBQ0Q7QUFDRixHQTlCYTs7QUFBQSxrQkFBUnJCLFFBQVE7QUFBQTtBQUFBO0FBQUEsR0FBZDs7ZUFnQ2VBLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luLCByZWxhdGl2ZSwgaXNBYnNvbHV0ZSwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCB7IHJlZCB9IGZyb20gXCJjaGFsa1wiXG5pbXBvcnQgeyBnZXRDb21wb25lbnROYW1lLCBnZXRDb21wb25lbnRGb2xkZXIgLCByZXBsaWNhdGUgfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQgc2NhbiBmcm9tIFwiLi9zY2FuXCJcbmltcG9ydCB7IGNvbXBvbmVudEFuc3dlcnMgfSBmcm9tIFwiLi9hbnN3ZXJzXCJcblxuY29uc3QgZGVmYXVsdENvbXBuZW50RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vdGVtcGxhdGVzXCIpXG5cbmNvbnN0IGdlbmVyYXRlID0gYXN5bmMgKHByb2dyYW0sIHsgY3dkIH0pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0eXBlID0gcHJvZ3JhbS5vcHRzKClcbiAgICBjb25zdCBbIHRhcmdldE5hbWUsICBvcmlnaW5hbERpcmVjdG9yeSx0YXJnZXRGb2xkZXIsIF0gPSBwcm9ncmFtLmFyZ3NcblxuXG4gICAgY29uc29sZS5sb2codGFyZ2V0Rm9sZGVyKVxuICAgIC8vIOWmguaenOe7meimgeWkjeWItueahOa6kOi3r+W+hOWwsea3u+WKoOa6kOi3r+W+hFxuICAgIC8vIGNvbnN0IG9yaWdpbmFsRGlyZWN0b3J5ID0gZmFsc2VcbiAgICBjb25zdCBzY2FuQ29tcG9uZW50RGlyZWN0b3J5cyA9IFsgZGVmYXVsdENvbXBuZW50RGlyIF1cbiAgICBpZiAob3JpZ2luYWxEaXJlY3RvcnkpIHNjYW5Db21wb25lbnREaXJlY3RvcnlzLnB1c2gob3JpZ2luYWxEaXJlY3RvcnkpXG4gICAgY29uc3Qgb3JpZ2luYWxDb21wbmVudFBhdGggPSBhd2FpdCBzY2FuKHNjYW5Db21wb25lbnREaXJlY3RvcnlzKVxuXG4gICAgLy8g6I635Y+WIOimgeabtOaUueeahOe7hOW7uuWQjeensCDlkowg6Lev5b6E5Zyw5Z2AXG4gICAgY29uc3Qgb3JpZ2luYWxOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShvcmlnaW5hbENvbXBuZW50UGF0aClcbiAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBpc0Fic29sdXRlKG9yaWdpbmFsQ29tcG5lbnRQYXRoKVxuICAgICAgPyBvcmlnaW5hbENvbXBuZW50UGF0aFxuICAgICAgOiBqb2luKHByb2Nlc3MuY3dkKCksIG9yaWdpbmFsQ29tcG5lbnRQYXRoKVxuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIGFic29sdXRlUGF0aClcbiAgICBjb25zdCBvcmlnaW5hbEZvbGRlciA9IGdldENvbXBvbmVudEZvbGRlcihyZWxhdGl2ZVBhdGgpXG4gICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IGNvbXBvbmVudEFuc3dlcnMoe1xuICAgICAgdGFyZ2V0TmFtZSxcbiAgICAgIG9yaWdpbmFsTmFtZSxcbiAgICAgIHRhcmdldEZvbGRlcixcbiAgICAgIG9yaWdpbmFsRm9sZGVyLFxuICAgIH0pXG4gICAgcmVwbGljYXRlKG9yaWdpbmFsQ29tcG5lbnRQYXRoLGFuc3dlcnMpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWQoYFtnZW5lcmF0ZV0gZXJyb3I6ICR7ZS5tZXNzYWdlfWApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVcbiAiXX0=