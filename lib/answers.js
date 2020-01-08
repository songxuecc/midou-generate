"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.componentAnswers = void 0;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _prompts = require("./prompts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var componentAnswers =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (_ref) {
    var {
      targetName,
      originalName,
      targetFolder,
      originalFolder
    } = _ref;
    var answers = yield _inquirer.default.prompt([(0, _prompts.name)(originalName, targetName), (0, _prompts.folder)(targetFolder || originalFolder)]);
    return answers;
  });

  return function componentAnswers(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.componentAnswers = componentAnswers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbnN3ZXJzLmpzIl0sIm5hbWVzIjpbImNvbXBvbmVudEFuc3dlcnMiLCJ0YXJnZXROYW1lIiwib3JpZ2luYWxOYW1lIiwidGFyZ2V0Rm9sZGVyIiwib3JpZ2luYWxGb2xkZXIiLCJhbnN3ZXJzIiwiaW5xdWlyZXIiLCJwcm9tcHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxnQkFBZ0I7QUFBQTtBQUFBO0FBQUEsZ0NBQUcsaUJBQXNFO0FBQUEsUUFBL0Q7QUFBRUMsTUFBQUEsVUFBRjtBQUFjQyxNQUFBQSxZQUFkO0FBQTRCQyxNQUFBQSxZQUE1QjtBQUEwQ0MsTUFBQUE7QUFBMUMsS0FBK0Q7QUFDN0YsUUFBTUMsT0FBTyxTQUFTQyxrQkFBU0MsTUFBVCxDQUFnQixDQUNwQyxtQkFBS0wsWUFBTCxFQUFtQkQsVUFBbkIsQ0FEb0MsRUFFcEMscUJBQU9FLFlBQVksSUFBSUMsY0FBdkIsQ0FGb0MsQ0FBaEIsQ0FBdEI7QUFJQSxXQUFPQyxPQUFQO0FBQ0QsR0FOcUI7O0FBQUEsa0JBQWhCTCxnQkFBZ0I7QUFBQTtBQUFBO0FBQUEsR0FBdEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCJcbmltcG9ydCB7IG5hbWUsIGZvbGRlciB9IGZyb20gXCIuL3Byb21wdHNcIlxuXG5jb25zdCBjb21wb25lbnRBbnN3ZXJzID0gYXN5bmMgKHsgdGFyZ2V0TmFtZSwgb3JpZ2luYWxOYW1lLCB0YXJnZXRGb2xkZXIsIG9yaWdpbmFsRm9sZGVyIH0pID0+IHtcbiAgY29uc3QgYW5zd2VycyA9IGF3YWl0IGlucXVpcmVyLnByb21wdChbXG4gICAgbmFtZShvcmlnaW5hbE5hbWUsIHRhcmdldE5hbWUpLFxuICAgIGZvbGRlcih0YXJnZXRGb2xkZXIgfHwgb3JpZ2luYWxGb2xkZXIpLFxuICBdKVxuICByZXR1cm4gYW5zd2Vyc1xufVxuXG5leHBvcnQgeyBjb21wb25lbnRBbnN3ZXJzIH1cbiJdfQ==