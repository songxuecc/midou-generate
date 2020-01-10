"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.replicateComponent = void 0;

var _path = require("path");

var _fsExtra = require("fs-extra");

var _chalk = require("chalk");

var _file = require("./file");

var _utils = require("./utils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var log = console.log; // 更换组建名称
// 更换 css 路径 先找到 src
// 更换 Author Name

var replicateComponent =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (originalPath, answers) {
    var workingDir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process.cwd();

    try {
      var originalName = (0, _utils.getComponentName)(originalPath);
      var absolutePath = (0, _path.isAbsolute)(originalPath) ? originalPath : (0, _path.join)(workingDir, originalPath);
      var promises = [];

      if ((0, _utils.isSingleFile)(originalPath)) {
        var files = (0, _utils.getFiles)((0, _path.dirname)(absolutePath), originalName);
        files.forEach(
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(function* (file) {
            var filename = (0, _path.basename)(file).replace(originalName, answers.name);
            var destinationPath = (0, _path.join)(workingDir, answers.folder, filename);
            var promise = (0, _fsExtra.copy)(file, destinationPath).then(() => {
              var contents = (0, _fsExtra.readFileSync)(destinationPath).toString();
              (0, _fsExtra.writeFileSync)(destinationPath, (0, _utils.replaceContents)(contents, originalName, answers.name));
            });
            promises.push(promise);
          });

          return function (_x3) {
            return _ref2.apply(this, arguments);
          };
        }());
      } else {
        var destinationPath = (0, _path.join)(workingDir, answers.folder, answers.name);
        yield (0, _fsExtra.copy)((0, _path.dirname)(absolutePath), destinationPath);

        var _files = (0, _utils.getFiles)(destinationPath);

        _files.forEach(
        /*#__PURE__*/
        function () {
          var _ref3 = _asyncToGenerator(function* (file) {
            var contents = (0, _fsExtra.readFileSync)(file).toString();
            var name = answers.name; // 替换文件内容正则

            var replaceContentsFunc = undefined; // 如果是css文件 则更换 less 引入 如果是less文件 则新命名为小写 将里面的大小写内容全替换小写

            if (file.indexOf(".less") > -1) {
              name = name.toLowerCase();
              replaceContentsFunc = _utils.replaceContentsHasLowerCase;

              try {
                var {
                  find
                } = new _file.FindFile();
                var findPath = process.cwd().split("/src")[0]; // 查找common文件夹路径

                var defLessPath = yield find(findPath, "def.less");

                if (defLessPath) {
                  var relativePath = (0, _path.relative)((0, _path.resolve)(file, "../"), defLessPath);
                  contents = (0, _utils.replaceLessImport)(contents, relativePath);
                }
              } catch (e) {
                _chalk.red.bold("[generate] find def.less error : ".concat(e));
              }
            } else {
              replaceContentsFunc = _utils.replaceContents;
            }

            var renamedPath = (0, _path.join)((0, _path.dirname)(file), (0, _path.basename)(file).replace(originalName, name));
            var nextContent = replaceContentsFunc(contents, originalName, name);
            (0, _fsExtra.writeFileSync)(file, (0, _utils.addFileHeader)(nextContent));

            if (file !== renamedPath) {
              var promise = (0, _fsExtra.move)(file, renamedPath);
              promises.push(promise);
            }
          });

          return function (_x4) {
            return _ref3.apply(this, arguments);
          };
        }());
      }

      yield Promise.all(promises);
      log("\n[ ".concat(_chalk.green.bold("generate"), " ] ").concat(_chalk.white.bold(answers.name), " has been created successfully!\n    "));
    } catch (e) {
      log(_chalk.red.bold("[generate] error: ".concat(e)));
    }
  });

  return function replicateComponent(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.replicateComponent = replicateComponent;
var _default = replicateComponent;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXBsaWNhdGVDb21wb25lbnQuanMiXSwibmFtZXMiOlsibG9nIiwiY29uc29sZSIsInJlcGxpY2F0ZUNvbXBvbmVudCIsIm9yaWdpbmFsUGF0aCIsImFuc3dlcnMiLCJ3b3JraW5nRGlyIiwicHJvY2VzcyIsImN3ZCIsIm9yaWdpbmFsTmFtZSIsImFic29sdXRlUGF0aCIsInByb21pc2VzIiwiZmlsZXMiLCJmb3JFYWNoIiwiZmlsZSIsImZpbGVuYW1lIiwicmVwbGFjZSIsIm5hbWUiLCJkZXN0aW5hdGlvblBhdGgiLCJmb2xkZXIiLCJwcm9taXNlIiwidGhlbiIsImNvbnRlbnRzIiwidG9TdHJpbmciLCJwdXNoIiwicmVwbGFjZUNvbnRlbnRzRnVuYyIsInVuZGVmaW5lZCIsImluZGV4T2YiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2VDb250ZW50c0hhc0xvd2VyQ2FzZSIsImZpbmQiLCJGaW5kRmlsZSIsImZpbmRQYXRoIiwic3BsaXQiLCJkZWZMZXNzUGF0aCIsInJlbGF0aXZlUGF0aCIsImUiLCJyZWQiLCJib2xkIiwicmVwbGFjZUNvbnRlbnRzIiwicmVuYW1lZFBhdGgiLCJuZXh0Q29udGVudCIsIlByb21pc2UiLCJhbGwiLCJncmVlbiIsIndoaXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQVNBLElBQU1BLEdBQUcsR0FBR0MsT0FBTyxDQUFDRCxHQUFwQixDLENBRUE7QUFDQTtBQUNBOztBQUNPLElBQU1FLGtCQUFrQjtBQUFBO0FBQUE7QUFBQSwrQkFBRyxXQUFPQyxZQUFQLEVBQXFCQyxPQUFyQixFQUE2RDtBQUFBLFFBQS9CQyxVQUErQix1RUFBbEJDLE9BQU8sQ0FBQ0MsR0FBUixFQUFrQjs7QUFDN0YsUUFBSTtBQUNGLFVBQU1DLFlBQVksR0FBRyw2QkFBaUJMLFlBQWpCLENBQXJCO0FBQ0EsVUFBTU0sWUFBWSxHQUFHLHNCQUFXTixZQUFYLElBQTJCQSxZQUEzQixHQUEwQyxnQkFBS0UsVUFBTCxFQUFpQkYsWUFBakIsQ0FBL0Q7QUFDQSxVQUFNTyxRQUFRLEdBQUcsRUFBakI7O0FBQ0EsVUFBSSx5QkFBYVAsWUFBYixDQUFKLEVBQWdDO0FBQzlCLFlBQU1RLEtBQUssR0FBRyxxQkFBUyxtQkFBUUYsWUFBUixDQUFULEVBQWdDRCxZQUFoQyxDQUFkO0FBQ0FHLFFBQUFBLEtBQUssQ0FBQ0MsT0FBTjtBQUFBO0FBQUE7QUFBQSx3Q0FBYyxXQUFNQyxJQUFOLEVBQWM7QUFDMUIsZ0JBQU1DLFFBQVEsR0FBRyxvQkFBU0QsSUFBVCxFQUFlRSxPQUFmLENBQXVCUCxZQUF2QixFQUFxQ0osT0FBTyxDQUFDWSxJQUE3QyxDQUFqQjtBQUNBLGdCQUFNQyxlQUFlLEdBQUcsZ0JBQUtaLFVBQUwsRUFBaUJELE9BQU8sQ0FBQ2MsTUFBekIsRUFBaUNKLFFBQWpDLENBQXhCO0FBQ0EsZ0JBQU1LLE9BQU8sR0FBRyxtQkFBS04sSUFBTCxFQUFXSSxlQUFYLEVBQTRCRyxJQUE1QixDQUFpQyxNQUFNO0FBQ3JELGtCQUFNQyxRQUFRLEdBQUcsMkJBQWFKLGVBQWIsRUFBOEJLLFFBQTlCLEVBQWpCO0FBQ0EsMENBQWNMLGVBQWQsRUFBK0IsNEJBQWdCSSxRQUFoQixFQUEwQmIsWUFBMUIsRUFBd0NKLE9BQU8sQ0FBQ1ksSUFBaEQsQ0FBL0I7QUFDRCxhQUhlLENBQWhCO0FBSUFOLFlBQUFBLFFBQVEsQ0FBQ2EsSUFBVCxDQUFjSixPQUFkO0FBQ0QsV0FSRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNELE9BWEQsTUFXTztBQUNMLFlBQU1GLGVBQWUsR0FBRyxnQkFBS1osVUFBTCxFQUFpQkQsT0FBTyxDQUFDYyxNQUF6QixFQUFpQ2QsT0FBTyxDQUFDWSxJQUF6QyxDQUF4QjtBQUNBLGNBQU0sbUJBQUssbUJBQVFQLFlBQVIsQ0FBTCxFQUE0QlEsZUFBNUIsQ0FBTjs7QUFDQSxZQUFNTixNQUFLLEdBQUcscUJBQVNNLGVBQVQsQ0FBZDs7QUFDQU4sUUFBQUEsTUFBSyxDQUFDQyxPQUFOO0FBQUE7QUFBQTtBQUFBLHdDQUFjLFdBQU1DLElBQU4sRUFBYztBQUMxQixnQkFBSVEsUUFBUSxHQUFHLDJCQUFhUixJQUFiLEVBQW1CUyxRQUFuQixFQUFmO0FBQ0EsZ0JBQUlOLElBQUksR0FBR1osT0FBTyxDQUFDWSxJQUFuQixDQUYwQixDQUcxQjs7QUFDQSxnQkFBSVEsbUJBQW1CLEdBQUdDLFNBQTFCLENBSjBCLENBSzFCOztBQUNBLGdCQUFJWixJQUFJLENBQUNhLE9BQUwsQ0FBYSxPQUFiLElBQXdCLENBQUMsQ0FBN0IsRUFBZ0M7QUFDOUJWLGNBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDVyxXQUFMLEVBQVA7QUFDQUgsY0FBQUEsbUJBQW1CLEdBQUdJLGtDQUF0Qjs7QUFDQSxrQkFBSTtBQUNGLG9CQUFNO0FBQUVDLGtCQUFBQTtBQUFGLG9CQUFXLElBQUlDLGNBQUosRUFBakI7QUFDQSxvQkFBTUMsUUFBUSxHQUFHekIsT0FBTyxDQUFDQyxHQUFSLEdBQWN5QixLQUFkLENBQW9CLE1BQXBCLEVBQTRCLENBQTVCLENBQWpCLENBRkUsQ0FHRjs7QUFDQSxvQkFBTUMsV0FBVyxTQUFTSixJQUFJLENBQUNFLFFBQUQsRUFBVyxVQUFYLENBQTlCOztBQUNBLG9CQUFJRSxXQUFKLEVBQWlCO0FBQ2Ysc0JBQU1DLFlBQVksR0FBRyxvQkFBUyxtQkFBUXJCLElBQVIsRUFBYyxLQUFkLENBQVQsRUFBK0JvQixXQUEvQixDQUFyQjtBQUNBWixrQkFBQUEsUUFBUSxHQUFHLDhCQUFrQkEsUUFBbEIsRUFBNEJhLFlBQTVCLENBQVg7QUFDRDtBQUNGLGVBVEQsQ0FTRSxPQUFPQyxDQUFQLEVBQVU7QUFDVkMsMkJBQUlDLElBQUosNENBQTZDRixDQUE3QztBQUNEO0FBQ0YsYUFmRCxNQWVPO0FBQ0xYLGNBQUFBLG1CQUFtQixHQUFHYyxzQkFBdEI7QUFDRDs7QUFDRCxnQkFBTUMsV0FBVyxHQUFHLGdCQUFLLG1CQUFRMUIsSUFBUixDQUFMLEVBQW9CLG9CQUFTQSxJQUFULEVBQWVFLE9BQWYsQ0FBdUJQLFlBQXZCLEVBQXFDUSxJQUFyQyxDQUFwQixDQUFwQjtBQUNBLGdCQUFNd0IsV0FBVyxHQUFHaEIsbUJBQW1CLENBQUNILFFBQUQsRUFBV2IsWUFBWCxFQUF5QlEsSUFBekIsQ0FBdkM7QUFDQSx3Q0FBY0gsSUFBZCxFQUFvQiwwQkFBYzJCLFdBQWQsQ0FBcEI7O0FBQ0EsZ0JBQUkzQixJQUFJLEtBQUswQixXQUFiLEVBQTBCO0FBQ3hCLGtCQUFNcEIsT0FBTyxHQUFHLG1CQUFLTixJQUFMLEVBQVcwQixXQUFYLENBQWhCO0FBQ0E3QixjQUFBQSxRQUFRLENBQUNhLElBQVQsQ0FBY0osT0FBZDtBQUNEO0FBQ0YsV0EvQkQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFnQ0Q7O0FBQ0QsWUFBTXNCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZaEMsUUFBWixDQUFOO0FBQ0FWLE1BQUFBLEdBQUcsZUFDSDJDLGFBQU1OLElBQU4sQ0FBWSxVQUFaLENBREcsZ0JBQzJCTyxhQUFNUCxJQUFOLENBQVdqQyxPQUFPLENBQUNZLElBQW5CLENBRDNCLDJDQUFIO0FBR0QsS0F4REQsQ0F3REUsT0FBT21CLENBQVAsRUFBVTtBQUNWbkMsTUFBQUEsR0FBRyxDQUFDb0MsV0FBSUMsSUFBSiw2QkFBOEJGLENBQTlCLEVBQUQsQ0FBSDtBQUNEO0FBQ0YsR0E1RDhCOztBQUFBLGtCQUFsQmpDLGtCQUFrQjtBQUFBO0FBQUE7QUFBQSxHQUF4Qjs7O2VBOERRQSxrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBpc0Fic29sdXRlLCBqb2luLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCB7IGNvcHksIG1vdmUsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gXCJmcy1leHRyYVwiXG5pbXBvcnQgeyByZWQsIGdyZWVuLCB3aGl0ZSwgYm9sZCB9IGZyb20gXCJjaGFsa1wiXG5pbXBvcnQgeyBGaW5kRmlsZSB9IGZyb20gXCIuL2ZpbGVcIlxuaW1wb3J0IHtcbiAgZ2V0Q29tcG9uZW50TmFtZSxcbiAgaXNTaW5nbGVGaWxlLFxuICBnZXRGaWxlcyxcbiAgcmVwbGFjZUNvbnRlbnRzLFxuICByZXBsYWNlQ29udGVudHNIYXNMb3dlckNhc2UsXG4gIHJlcGxhY2VMZXNzSW1wb3J0LFxuICBhZGRGaWxlSGVhZGVyLFxufSBmcm9tIFwiLi91dGlsc1wiXG5jb25zdCBsb2cgPSBjb25zb2xlLmxvZ1xuXG4vLyDmm7TmjaLnu4Tlu7rlkI3np7Bcbi8vIOabtOaNoiBjc3Mg6Lev5b6EIOWFiOaJvuWIsCBzcmNcbi8vIOabtOaNoiBBdXRob3IgTmFtZVxuZXhwb3J0IGNvbnN0IHJlcGxpY2F0ZUNvbXBvbmVudCA9IGFzeW5jIChvcmlnaW5hbFBhdGgsIGFuc3dlcnMsIHdvcmtpbmdEaXIgPSBwcm9jZXNzLmN3ZCgpKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3JpZ2luYWxOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShvcmlnaW5hbFBhdGgpXG4gICAgY29uc3QgYWJzb2x1dGVQYXRoID0gaXNBYnNvbHV0ZShvcmlnaW5hbFBhdGgpID8gb3JpZ2luYWxQYXRoIDogam9pbih3b3JraW5nRGlyLCBvcmlnaW5hbFBhdGgpXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIGlmIChpc1NpbmdsZUZpbGUob3JpZ2luYWxQYXRoKSkge1xuICAgICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkaXJuYW1lKGFic29sdXRlUGF0aCksIG9yaWdpbmFsTmFtZSlcbiAgICAgIGZpbGVzLmZvckVhY2goYXN5bmMgZmlsZSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYmFzZW5hbWUoZmlsZSkucmVwbGFjZShvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSlcbiAgICAgICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gam9pbih3b3JraW5nRGlyLCBhbnN3ZXJzLmZvbGRlciwgZmlsZW5hbWUpXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBjb3B5KGZpbGUsIGRlc3RpbmF0aW9uUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZGVzdGluYXRpb25QYXRoKS50b1N0cmluZygpXG4gICAgICAgICAgd3JpdGVGaWxlU3luYyhkZXN0aW5hdGlvblBhdGgsIHJlcGxhY2VDb250ZW50cyhjb250ZW50cywgb3JpZ2luYWxOYW1lLCBhbnN3ZXJzLm5hbWUpKVxuICAgICAgICB9KVxuICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZXN0aW5hdGlvblBhdGggPSBqb2luKHdvcmtpbmdEaXIsIGFuc3dlcnMuZm9sZGVyLCBhbnN3ZXJzLm5hbWUpXG4gICAgICBhd2FpdCBjb3B5KGRpcm5hbWUoYWJzb2x1dGVQYXRoKSwgZGVzdGluYXRpb25QYXRoKVxuICAgICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkZXN0aW5hdGlvblBhdGgpXG4gICAgICBmaWxlcy5mb3JFYWNoKGFzeW5jIGZpbGUgPT4ge1xuICAgICAgICBsZXQgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZmlsZSkudG9TdHJpbmcoKVxuICAgICAgICBsZXQgbmFtZSA9IGFuc3dlcnMubmFtZVxuICAgICAgICAvLyDmm7/mjaLmlofku7blhoXlrrnmraPliJlcbiAgICAgICAgbGV0IHJlcGxhY2VDb250ZW50c0Z1bmMgPSB1bmRlZmluZWRcbiAgICAgICAgLy8g5aaC5p6c5pivY3Nz5paH5Lu2IOWImeabtOaNoiBsZXNzIOW8leWFpSDlpoLmnpzmmK9sZXNz5paH5Lu2IOWImeaWsOWRveWQjeS4uuWwj+WGmSDlsIbph4zpnaLnmoTlpKflsI/lhpnlhoXlrrnlhajmm7/mjaLlsI/lhplcbiAgICAgICAgaWYgKGZpbGUuaW5kZXhPZihcIi5sZXNzXCIpID4gLTEpIHtcbiAgICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgcmVwbGFjZUNvbnRlbnRzRnVuYyA9IHJlcGxhY2VDb250ZW50c0hhc0xvd2VyQ2FzZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGZpbmQgfSA9IG5ldyBGaW5kRmlsZSgpXG4gICAgICAgICAgICBjb25zdCBmaW5kUGF0aCA9IHByb2Nlc3MuY3dkKCkuc3BsaXQoXCIvc3JjXCIpWzBdXG4gICAgICAgICAgICAvLyDmn6Xmib5jb21tb27mlofku7blpLnot6/lvoRcbiAgICAgICAgICAgIGNvbnN0IGRlZkxlc3NQYXRoID0gYXdhaXQgZmluZChmaW5kUGF0aCwgXCJkZWYubGVzc1wiKVxuICAgICAgICAgICAgaWYgKGRlZkxlc3NQYXRoKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHJlc29sdmUoZmlsZSwgXCIuLi9cIiksIGRlZkxlc3NQYXRoKVxuICAgICAgICAgICAgICBjb250ZW50cyA9IHJlcGxhY2VMZXNzSW1wb3J0KGNvbnRlbnRzLCByZWxhdGl2ZVBhdGgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVkLmJvbGQoYFtnZW5lcmF0ZV0gZmluZCBkZWYubGVzcyBlcnJvciA6ICR7ZX1gKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXBsYWNlQ29udGVudHNGdW5jID0gcmVwbGFjZUNvbnRlbnRzXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVuYW1lZFBhdGggPSBqb2luKGRpcm5hbWUoZmlsZSksIGJhc2VuYW1lKGZpbGUpLnJlcGxhY2Uob3JpZ2luYWxOYW1lLCBuYW1lKSlcbiAgICAgICAgY29uc3QgbmV4dENvbnRlbnQgPSByZXBsYWNlQ29udGVudHNGdW5jKGNvbnRlbnRzLCBvcmlnaW5hbE5hbWUsIG5hbWUpXG4gICAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZSwgYWRkRmlsZUhlYWRlcihuZXh0Q29udGVudCkpXG4gICAgICAgIGlmIChmaWxlICE9PSByZW5hbWVkUGF0aCkge1xuICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBtb3ZlKGZpbGUsIHJlbmFtZWRQYXRoKVxuICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgbG9nKGBcblsgJHtncmVlbi5ib2xkKCBcImdlbmVyYXRlXCIgKX0gXSAke3doaXRlLmJvbGQoYW5zd2Vycy5uYW1lKX0gaGFzIGJlZW4gY3JlYXRlZCBzdWNjZXNzZnVsbHkhXG4gICAgYClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZyhyZWQuYm9sZChgW2dlbmVyYXRlXSBlcnJvcjogJHtlfWApKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlcGxpY2F0ZUNvbXBvbmVudFxuIl19