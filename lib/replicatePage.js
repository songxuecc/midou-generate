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
    } catch (e) {
      _chalk.red.bold("[generate] error: ".concat(e.message));
    }
  });

  return function replicateComponent(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.replicateComponent = replicateComponent;
var _default = replicateComponent;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXBsaWNhdGVQYWdlLmpzIl0sIm5hbWVzIjpbInJlcGxpY2F0ZUNvbXBvbmVudCIsIm9yaWdpbmFsUGF0aCIsImFuc3dlcnMiLCJ3b3JraW5nRGlyIiwicHJvY2VzcyIsImN3ZCIsIm9yaWdpbmFsTmFtZSIsImFic29sdXRlUGF0aCIsInByb21pc2VzIiwiZmlsZXMiLCJmb3JFYWNoIiwiZmlsZSIsImZpbGVuYW1lIiwicmVwbGFjZSIsIm5hbWUiLCJkZXN0aW5hdGlvblBhdGgiLCJmb2xkZXIiLCJwcm9taXNlIiwidGhlbiIsImNvbnRlbnRzIiwidG9TdHJpbmciLCJwdXNoIiwicmVwbGFjZUNvbnRlbnRzRnVuYyIsInVuZGVmaW5lZCIsImluZGV4T2YiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2VDb250ZW50c0hhc0xvd2VyQ2FzZSIsImZpbmQiLCJGaW5kRmlsZSIsImZpbmRQYXRoIiwic3BsaXQiLCJkZWZMZXNzUGF0aCIsInJlbGF0aXZlUGF0aCIsImUiLCJyZWQiLCJib2xkIiwicmVwbGFjZUNvbnRlbnRzIiwicmVuYW1lZFBhdGgiLCJuZXh0Q29udGVudCIsIlByb21pc2UiLCJhbGwiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQWFPLElBQU1BLGtCQUFrQjtBQUFBO0FBQUE7QUFBQSwrQkFBRyxXQUFPQyxZQUFQLEVBQXFCQyxPQUFyQixFQUE2RDtBQUFBLFFBQS9CQyxVQUErQix1RUFBbEJDLE9BQU8sQ0FBQ0MsR0FBUixFQUFrQjs7QUFDN0YsUUFBSTtBQUNGLFVBQU1DLFlBQVksR0FBRyw2QkFBaUJMLFlBQWpCLENBQXJCO0FBQ0EsVUFBTU0sWUFBWSxHQUFHLHNCQUFXTixZQUFYLElBQTJCQSxZQUEzQixHQUEwQyxnQkFBS0UsVUFBTCxFQUFpQkYsWUFBakIsQ0FBL0Q7QUFDQSxVQUFNTyxRQUFRLEdBQUcsRUFBakI7O0FBQ0EsVUFBSSx5QkFBYVAsWUFB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WCxFQUF5QlEsSUFBekIsQ0FBdkM7QUFDQSx3Q0FBY0gsSUFBZCxFQUFvQiwwQkFBYzJCLFdBQWQsQ0FBcEI7O0FBQ0EsZ0JBQUkzQixJQUFJLEtBQUswQixXQUFiLEVBQTBCO0FBQ3hCLGtCQUFNcEIsT0FBTyxHQUFHLG1CQUFLTixJQUFMLEVBQVcwQixXQUFYLENBQWhCO0FBQ0E3QixjQUFBQSxRQUFRLENBQUNhLElBQVQsQ0FBY0osT0FBZDtBQUNEO0FBQ0YsV0EvQkQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFnQ0Q7O0FBQ0QsWUFBTXNCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZaEMsUUFBWixDQUFOO0FBQ0QsS0FyREQsQ0FxREUsT0FBT3lCLENBQVAsRUFBVTtBQUNWQyxpQkFBSUMsSUFBSiw2QkFBOEJGLENBQUMsQ0FBQ1EsT0FBaEM7QUFDRDtBQUNGLEdBekQ4Qjs7QUFBQSxrQkFBbEJ6QyxrQkFBa0I7QUFBQTtBQUFBO0FBQUEsR0FBeEI7OztlQTJEUUEsa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBiYXNlbmFtZSwgZGlybmFtZSwgaXNBYnNvbHV0ZSwgam9pbiwgcmVsYXRpdmUsIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgeyBjb3B5LCBtb3ZlLCByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tIFwiZnMtZXh0cmFcIlxuaW1wb3J0IHsgcmVkIH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCB7IEZpbmRGaWxlIH0gZnJvbSBcIi4vZmlsZVwiXG5pbXBvcnQge1xuICBnZXRDb21wb25lbnROYW1lLFxuICBpc1NpbmdsZUZpbGUsXG4gIGdldEZpbGVzLFxuICByZXBsYWNlQ29udGVudHMsXG4gIHJlcGxhY2VDb250ZW50c0hhc0xvd2VyQ2FzZSxcbiAgcmVwbGFjZUxlc3NJbXBvcnQsXG4gIGFkZEZpbGVIZWFkZXIsXG59IGZyb20gJy4vdXRpbHMnXG5cbi8vIOabtOaNoue7hOW7uuWQjeensFxuLy8g5pu05o2iIGNzcyDot6/lvoQg5YWI5om+5YiwIHNyY1xuLy8g5pu05o2iIEF1dGhvciBOYW1lXG5leHBvcnQgY29uc3QgcmVwbGljYXRlQ29tcG9uZW50ID0gYXN5bmMgKG9yaWdpbmFsUGF0aCwgYW5zd2Vycywgd29ya2luZ0RpciA9IHByb2Nlc3MuY3dkKCkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvcmlnaW5hbE5hbWUgPSBnZXRDb21wb25lbnROYW1lKG9yaWdpbmFsUGF0aClcbiAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBpc0Fic29sdXRlKG9yaWdpbmFsUGF0aCkgPyBvcmlnaW5hbFBhdGggOiBqb2luKHdvcmtpbmdEaXIsIG9yaWdpbmFsUGF0aClcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdXG4gICAgaWYgKGlzU2luZ2xlRmlsZShvcmlnaW5hbFBhdGgpKSB7XG4gICAgICBjb25zdCBmaWxlcyA9IGdldEZpbGVzKGRpcm5hbWUoYWJzb2x1dGVQYXRoKSwgb3JpZ2luYWxOYW1lKVxuICAgICAgZmlsZXMuZm9yRWFjaChhc3luYyBmaWxlID0+IHtcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBiYXNlbmFtZShmaWxlKS5yZXBsYWNlKG9yaWdpbmFsTmFtZSwgYW5zd2Vycy5uYW1lKVxuICAgICAgICBjb25zdCBkZXN0aW5hdGlvblBhdGggPSBqb2luKHdvcmtpbmdEaXIsIGFuc3dlcnMuZm9sZGVyLCBmaWxlbmFtZSlcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IGNvcHkoZmlsZSwgZGVzdGluYXRpb25QYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBjb250ZW50cyA9IHJlYWRGaWxlU3luYyhkZXN0aW5hdGlvblBhdGgpLnRvU3RyaW5nKClcbiAgICAgICAgICB3cml0ZUZpbGVTeW5jKGRlc3RpbmF0aW9uUGF0aCwgcmVwbGFjZUNvbnRlbnRzKGNvbnRlbnRzLCBvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSkpXG4gICAgICAgIH0pXG4gICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRlc3RpbmF0aW9uUGF0aCA9IGpvaW4od29ya2luZ0RpciwgYW5zd2Vycy5mb2xkZXIsIGFuc3dlcnMubmFtZSlcbiAgICAgIGF3YWl0IGNvcHkoZGlybmFtZShhYnNvbHV0ZVBhdGgpLCBkZXN0aW5hdGlvblBhdGgpXG4gICAgICBjb25zdCBmaWxlcyA9IGdldEZpbGVzKGRlc3RpbmF0aW9uUGF0aClcbiAgICAgIGZpbGVzLmZvckVhY2goYXN5bmMgZmlsZSA9PiB7XG4gICAgICAgIGxldCBjb250ZW50cyA9IHJlYWRGaWxlU3luYyhmaWxlKS50b1N0cmluZygpXG4gICAgICAgIGxldCBuYW1lID0gYW5zd2Vycy5uYW1lXG4gICAgICAgIC8vIOabv+aNouaWh+S7tuWGheWuueato+WImVxuICAgICAgICBsZXQgcmVwbGFjZUNvbnRlbnRzRnVuYyA9IHVuZGVmaW5lZFxuICAgICAgICAvLyDlpoLmnpzmmK9jc3Pmlofku7Yg5YiZ5pu05o2iIGxlc3Mg5byV5YWlIOWmguaenOaYr2xlc3Pmlofku7Yg5YiZ5paw5ZG95ZCN5Li65bCP5YaZIOWwhumHjOmdoueahOWkp+Wwj+WGmeWGheWuueWFqOabv+aNouWwj+WGmVxuICAgICAgICBpZiAoZmlsZS5pbmRleE9mKFwiLmxlc3NcIikgPiAtMSkge1xuICAgICAgICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICByZXBsYWNlQ29udGVudHNGdW5jID0gcmVwbGFjZUNvbnRlbnRzSGFzTG93ZXJDYXNlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZmluZCB9ID0gbmV3IEZpbmRGaWxlKClcbiAgICAgICAgICAgIGNvbnN0IGZpbmRQYXRoID0gcHJvY2Vzcy5jd2QoKS5zcGxpdChcIi9zcmNcIilbMF1cbiAgICAgICAgICAgIC8vIOafpeaJvmNvbW1vbuaWh+S7tuWkuei3r+W+hFxuICAgICAgICAgICAgY29uc3QgZGVmTGVzc1BhdGggPSBhd2FpdCBmaW5kKGZpbmRQYXRoLCBcImRlZi5sZXNzXCIpXG4gICAgICAgICAgICBpZiAoZGVmTGVzc1BhdGgpIHtcbiAgICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUocmVzb2x2ZShmaWxlLCBcIi4uL1wiKSwgZGVmTGVzc1BhdGgpXG4gICAgICAgICAgICAgIGNvbnRlbnRzID0gcmVwbGFjZUxlc3NJbXBvcnQoY29udGVudHMsIHJlbGF0aXZlUGF0aClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWQuYm9sZChgW2dlbmVyYXRlXSBmaW5kIGRlZi5sZXNzIGVycm9yIDogJHtlfWApXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcGxhY2VDb250ZW50c0Z1bmMgPSByZXBsYWNlQ29udGVudHNcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZW5hbWVkUGF0aCA9IGpvaW4oZGlybmFtZShmaWxlKSwgYmFzZW5hbWUoZmlsZSkucmVwbGFjZShvcmlnaW5hbE5hbWUsIG5hbWUpKVxuICAgICAgICBjb25zdCBuZXh0Q29udGVudCA9IHJlcGxhY2VDb250ZW50c0Z1bmMoY29udGVudHMsIG9yaWdpbmFsTmFtZSwgbmFtZSlcbiAgICAgICAgd3JpdGVGaWxlU3luYyhmaWxlLCBhZGRGaWxlSGVhZGVyKG5leHRDb250ZW50KSlcbiAgICAgICAgaWYgKGZpbGUgIT09IHJlbmFtZWRQYXRoKSB7XG4gICAgICAgICAgY29uc3QgcHJvbWlzZSA9IG1vdmUoZmlsZSwgcmVuYW1lZFBhdGgpXG4gICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlZC5ib2xkKGBbZ2VuZXJhdGVdIGVycm9yOiAke2UubWVzc2FnZX1gKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlcGxpY2F0ZUNvbXBvbmVudCJdfQ==