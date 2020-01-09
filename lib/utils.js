"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = flatten;
exports.replicate = exports.replaceLessImport = exports.replaceContentsHasLowerCase = exports.replaceContents = exports.getComponentFiles = exports.getFiles = exports.isSingleFile = exports.getComponentFolder = exports.getComponentName = void 0;

var _path = require("path");

var _lodash = require("lodash");

var _chalk = require("chalk");

var _glob = _interopRequireDefault(require("glob"));

var _gitUserName = _interopRequireDefault(require("git-user-name"));

var _listReactFiles = _interopRequireDefault(require("list-react-files"));

var _fsExtra = require("fs-extra");

var _file = require("./file");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var removeExt = path => path.replace(/\.[^.]+$/, "");

var getComponentName = path => path.split("/").reduce((name, part) => {
  if (/^[A-Z]/.test(part)) {
    return removeExt(part);
  } else if (/^((?!index).+)\.[^.]+$/.test(part)) {
    return (0, _lodash.upperFirst)((0, _lodash.camelCase)(removeExt(part)));
  }

  return name;
}, "");

exports.getComponentName = getComponentName;

var getComponentFolder = path => {
  var name = getComponentName(path);
  return (0, _path.dirname)(path).split("/").reduce((folder, part) => {
    if (removeExt(part) === name) {
      return folder;
    }

    return (0, _path.join)(folder, part);
  }, "./");
};

exports.getComponentFolder = getComponentFolder;

var isSingleFile = path => {
  var name = getComponentName(path);
  var [dir] = (0, _path.dirname)(path).split("/").reverse();
  return dir !== name;
};

exports.isSingleFile = isSingleFile;

var getFiles = (cwd, componentName) => {
  var extensions = "{js,ts,jsx,tsx,css,less,scss,sass,sss,json,md,mdx}";
  var pattern = componentName ? "**/".concat(componentName, "{.,.*.}").concat(extensions) : "**/*.".concat(extensions);
  return _glob.default.sync(pattern, {
    cwd,
    absolute: true,
    nodir: true
  });
};

exports.getFiles = getFiles;

var getComponentFiles = function getComponentFiles(root) {
  var workingDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.cwd();
  return (0, _listReactFiles.default)(root).then(files => files.map(path => {
    var name = getComponentName(path);
    var absolutePath = (0, _path.join)(root, path);
    var relativePath = (0, _path.relative)(workingDir, absolutePath);
    return {
      name: "".concat(name, " ").concat((0, _chalk.gray)(relativePath)),
      short: name,
      value: absolutePath
    };
  }));
};

exports.getComponentFiles = getComponentFiles;

var replaceContents = (contents, oldName, newName) => contents.replace(new RegExp("([^a-zA-Z0-9_$])".concat(oldName, "([^a-zA-Z0-9_$]|Container)|(['|\"]./[a-zA-Z0-9_$]*?)").concat(oldName, "([a-zA-Z0-9_$]*?)"), "g"), "$1$3".concat(newName, "$2$4"));

exports.replaceContents = replaceContents;

var replaceContentsHasLowerCase = (contents, oldName, newName) => contents.replace(new RegExp("([^a-zA-Z0-9_$])(".concat(oldName, "|").concat(oldName.toLowerCase(), ")([^a-zA-Z0-9_$]|Container)|(['|\"]./[a-zA-Z0-9_$]*?)(").concat(oldName, "|").concat(oldName.toLowerCase(), ")([a-zA-Z0-9_$]*?)"), "g"), "$1$4".concat(newName, "$3$6"));

exports.replaceContentsHasLowerCase = replaceContentsHasLowerCase;

var replaceLessImport = (contents, newContent) => contents.replace(new RegExp(/@import\s+"[./\-\w]+";/), "@import \"".concat(newContent, "\";"));

exports.replaceLessImport = replaceLessImport;

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    //月份
    "d+": this.getDate(),
    //日
    "h+": this.getHours(),
    //小时
    "m+": this.getMinutes(),
    //分
    "s+": this.getSeconds(),
    //秒
    "q+": Math.floor((this.getMonth() + 3) / 3),
    //季度
    "S": this.getMilliseconds() //毫秒

  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }

  return fmt;
}; // 添加文件头


var addFileHeader = content => {
  var userName = (0, _gitUserName.default)();
  var fileHeader = "\n/*\n* @Author: ".concat(userName, "\n* @ModuleName: undefined\n* @Date: ").concat(new Date().Format("yyyy-MM-dd"), "\n* @Last Modified by: ").concat(userName, "\n* @Last Modified time: ").concat(new Date().Format("yyyy-MM-dd"), "\n*/\n\n");
  return fileHeader + content;
}; // 更换组建名称
// 更换 css 路径 先找到 src
// 更换 Author Name


var replicate =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (originalPath, answers) {
    var workingDir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process.cwd();

    try {
      var originalName = getComponentName(originalPath);
      var absolutePath = (0, _path.isAbsolute)(originalPath) ? originalPath : (0, _path.join)(workingDir, originalPath);
      var promises = [];

      if (isSingleFile(originalPath)) {
        var files = getFiles((0, _path.dirname)(absolutePath), originalName);
        files.forEach(
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(function* (file) {
            var filename = (0, _path.basename)(file).replace(originalName, answers.name);
            var destinationPath = (0, _path.join)(workingDir, answers.folder, filename);
            var promise = (0, _fsExtra.copy)(file, destinationPath).then(() => {
              var contents = (0, _fsExtra.readFileSync)(destinationPath).toString();
              (0, _fsExtra.writeFileSync)(destinationPath, replaceContents(contents, originalName, answers.name));
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

        var _files = getFiles(destinationPath);

        _files.forEach(
        /*#__PURE__*/
        function () {
          var _ref3 = _asyncToGenerator(function* (file) {
            var contents = (0, _fsExtra.readFileSync)(file).toString();
            var name = answers.name; // 替换文件内容正则

            var replaceContentsFunc = undefined; // 如果是css文件 则更换 less 引入 如果是less文件 则新命名为小写 将里面的大小写内容全替换小写

            if (file.indexOf(".less") > -1) {
              name = name.toLowerCase();
              replaceContentsFunc = replaceContentsHasLowerCase;

              try {
                var {
                  find
                } = new _file.FindFile();
                var findPath = process.cwd().split("/src")[0]; // 查找common文件夹路径

                var defLessPath = yield find(findPath, "def.less");

                if (defLessPath) {
                  console.log(defLessPath, "defLessPath");
                  var relativePath = (0, _path.relative)((0, _path.resolve)(file, "../"), defLessPath);
                  contents = replaceLessImport(contents, relativePath);
                }
              } catch (e) {
                (0, _chalk.red)("[FindFile] find def.less error : ".concat(e));
              }
            } else {
              replaceContentsFunc = replaceContents;
            }

            var renamedPath = (0, _path.join)((0, _path.dirname)(file), (0, _path.basename)(file).replace(originalName, name));
            var nextContent = replaceContentsFunc(contents, originalName, name);
            (0, _fsExtra.writeFileSync)(file, addFileHeader(nextContent));

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
      (0, _chalk.red)("[replicate] error: ".concat(e.message));
    }
  });

  return function replicate(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.replicate = replicate;

function flatten(arr) {
  var res = [];
  arr.map(item => {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item));
    } else {
      res.push(item);
    }
  });
  return res;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJyZW1vdmVFeHQiLCJwYXRoIiwicmVwbGFjZSIsImdldENvbXBvbmVudE5hbWUiLCJzcGxpdCIsInJlZHVjZSIsIm5hbWUiLCJwYXJ0IiwidGVzdCIsImdldENvbXBvbmVudEZvbGRlciIsImZvbGRlciIsImlzU2luZ2xlRmlsZSIsImRpciIsInJldmVyc2UiLCJnZXRGaWxlcyIsImN3ZCIsImNvbXBvbmVudE5hbWUiLCJleHRlbnNpb25zIiwicGF0dGVybiIsImdsb2IiLCJzeW5jIiwiYWJzb2x1dGUiLCJub2RpciIsImdldENvbXBvbmVudEZpbGVzIiwicm9vdCIsIndvcmtpbmdEaXIiLCJwcm9jZXNzIiwidGhlbiIsImZpbGVzIiwibWFwIiwiYWJzb2x1dGVQYXRoIiwicmVsYXRpdmVQYXRoIiwic2hvcnQiLCJ2YWx1ZSIsInJlcGxhY2VDb250ZW50cyIsImNvbnRlbnRzIiwib2xkTmFtZSIsIm5ld05hbWUiLCJSZWdFeHAiLCJyZXBsYWNlQ29udGVudHNIYXNMb3dlckNhc2UiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2VMZXNzSW1wb3J0IiwibmV3Q29udGVudCIsIkRhdGUiLCJwcm90b3R5cGUiLCJGb3JtYXQiLCJmbXQiLCJvIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsIk1hdGgiLCJmbG9vciIsImdldE1pbGxpc2Vjb25kcyIsIiQxIiwiZ2V0RnVsbFllYXIiLCJzdWJzdHIiLCJsZW5ndGgiLCJrIiwiYWRkRmlsZUhlYWRlciIsImNvbnRlbnQiLCJ1c2VyTmFtZSIsImZpbGVIZWFkZXIiLCJyZXBsaWNhdGUiLCJvcmlnaW5hbFBhdGgiLCJhbnN3ZXJzIiwib3JpZ2luYWxOYW1lIiwicHJvbWlzZXMiLCJmb3JFYWNoIiwiZmlsZSIsImZpbGVuYW1lIiwiZGVzdGluYXRpb25QYXRoIiwicHJvbWlzZSIsInRvU3RyaW5nIiwicHVzaCIsInJlcGxhY2VDb250ZW50c0Z1bmMiLCJ1bmRlZmluZWQiLCJpbmRleE9mIiwiZmluZCIsIkZpbmRGaWxlIiwiZmluZFBhdGgiLCJkZWZMZXNzUGF0aCIsImNvbnNvbGUiLCJsb2ciLCJlIiwicmVuYW1lZFBhdGgiLCJuZXh0Q29udGVudCIsIlByb21pc2UiLCJhbGwiLCJtZXNzYWdlIiwiZmxhdHRlbiIsImFyciIsInJlcyIsIml0ZW0iLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHQyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsT0FBTCxDQUFhLFVBQWIsRUFBeUIsRUFBekIsQ0FBMUI7O0FBRU8sSUFBTUMsZ0JBQWdCLEdBQUdGLElBQUksSUFDbENBLElBQUksQ0FBQ0csS0FBTCxDQUFXLEdBQVgsRUFBZ0JDLE1BQWhCLENBQXVCLENBQUNDLElBQUQsRUFBT0MsSUFBUCxLQUFnQjtBQUNyQyxNQUFJLFNBQVNDLElBQVQsQ0FBY0QsSUFBZCxDQUFKLEVBQXlCO0FBQ3ZCLFdBQU9QLFNBQVMsQ0FBQ08sSUFBRCxDQUFoQjtBQUNELEdBRkQsTUFFTyxJQUFJLHlCQUF5QkMsSUFBekIsQ0FBOEJELElBQTlCLENBQUosRUFBeUM7QUFDOUMsV0FBTyx3QkFBVyx1QkFBVVAsU0FBUyxDQUFDTyxJQUFELENBQW5CLENBQVgsQ0FBUDtBQUNEOztBQUNELFNBQU9ELElBQVA7QUFDRCxDQVBELEVBT0csRUFQSCxDQURLOzs7O0FBVUEsSUFBTUcsa0JBQWtCLEdBQUdSLElBQUksSUFBSTtBQUN4QyxNQUFNSyxJQUFJLEdBQUdILGdCQUFnQixDQUFDRixJQUFELENBQTdCO0FBQ0EsU0FBTyxtQkFBUUEsSUFBUixFQUFjRyxLQUFkLENBQW9CLEdBQXBCLEVBQXlCQyxNQUF6QixDQUFnQyxDQUFDSyxNQUFELEVBQVNILElBQVQsS0FBa0I7QUFDdkQsUUFB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c0RFLE9BQU9pQixDQUFQLEVBQVU7QUFDVixtREFBMEJBLENBQUMsQ0FBQ0ssT0FBNUI7QUFDRDtBQUNGLEdBMURxQjs7QUFBQSxrQkFBVDFCLFNBQVM7QUFBQTtBQUFBO0FBQUEsR0FBZjs7OztBQTREUCxTQUFTMkIsT0FBVCxDQUFpQkMsR0FBakIsRUFBc0I7QUFDcEIsTUFBSUMsR0FBRyxHQUFHLEVBQVY7QUFDQUQsRUFBQUEsR0FBRyxDQUFDaEUsR0FBSixDQUFRa0UsSUFBSSxJQUFJO0FBQ2QsUUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLElBQWQsQ0FBSixFQUF5QjtBQUN2QkQsTUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNJLE1BQUosQ0FBV04sT0FBTyxDQUFDRyxJQUFELENBQWxCLENBQU47QUFDRCxLQUZELE1BRU87QUFDTEQsTUFBQUEsR0FBRyxDQUFDbEIsSUFBSixDQUFTbUIsSUFBVDtBQUNEO0FBQ0YsR0FORDtBQU9BLFNBQU9ELEdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBpc0Fic29sdXRlLCBqb2luLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCB7IGNhbWVsQ2FzZSwgdXBwZXJGaXJzdCB9IGZyb20gXCJsb2Rhc2hcIlxuaW1wb3J0IHsgZ3JheSwgcmVkIH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCBnbG9iIGZyb20gXCJnbG9iXCJcbmltcG9ydCBnaXRVc2VyTmFtZSBmcm9tIFwiZ2l0LXVzZXItbmFtZVwiXG5pbXBvcnQgbGlzdFJlYWN0RmlsZXMgZnJvbSBcImxpc3QtcmVhY3QtZmlsZXNcIlxuaW1wb3J0IHsgY29weSwgbW92ZSwgcmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSBcImZzLWV4dHJhXCJcbmltcG9ydCB7IEZpbmRGaWxlIH0gZnJvbSBcIi4vZmlsZVwiXG5cbmNvbnN0IHJlbW92ZUV4dCA9IHBhdGggPT4gcGF0aC5yZXBsYWNlKC9cXC5bXi5dKyQvLCBcIlwiKVxuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9uZW50TmFtZSA9IHBhdGggPT5cbiAgcGF0aC5zcGxpdChcIi9cIikucmVkdWNlKChuYW1lLCBwYXJ0KSA9PiB7XG4gICAgaWYgKC9eW0EtWl0vLnRlc3QocGFydCkpIHtcbiAgICAgIHJldHVybiByZW1vdmVFeHQocGFydClcbiAgICB9IGVsc2UgaWYgKC9eKCg/IWluZGV4KS4rKVxcLlteLl0rJC8udGVzdChwYXJ0KSkge1xuICAgICAgcmV0dXJuIHVwcGVyRmlyc3QoY2FtZWxDYXNlKHJlbW92ZUV4dChwYXJ0KSkpXG4gICAgfVxuICAgIHJldHVybiBuYW1lXG4gIH0sIFwiXCIpXG5cbmV4cG9ydCBjb25zdCBnZXRDb21wb25lbnRGb2xkZXIgPSBwYXRoID0+IHtcbiAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUocGF0aClcbiAgcmV0dXJuIGRpcm5hbWUocGF0aCkuc3BsaXQoXCIvXCIpLnJlZHVjZSgoZm9sZGVyLCBwYXJ0KSA9PiB7XG4gICAgaWYgKHJlbW92ZUV4dChwYXJ0KSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIGZvbGRlclxuICAgIH1cbiAgICByZXR1cm4gam9pbihmb2xkZXIsIHBhcnQpXG4gIH0sIFwiLi9cIilcbn1cblxuZXhwb3J0IGNvbnN0IGlzU2luZ2xlRmlsZSA9IHBhdGggPT4ge1xuICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuICBjb25zdCBbIGRpciBdID0gZGlybmFtZShwYXRoKS5zcGxpdChcIi9cIikucmV2ZXJzZSgpXG4gIHJldHVybiBkaXIgIT09IG5hbWVcbn1cblxuZXhwb3J0IGNvbnN0IGdldEZpbGVzID0gKGN3ZCwgY29tcG9uZW50TmFtZSkgPT4ge1xuICBjb25zdCBleHRlbnNpb25zID0gXCJ7anMsdHMsanN4LHRzeCxjc3MsbGVzcyxzY3NzLHNhc3Msc3NzLGpzb24sbWQsbWR4fVwiXG4gIGNvbnN0IHBhdHRlcm4gPSBjb21wb25lbnROYW1lID8gYCoqLyR7Y29tcG9uZW50TmFtZX17LiwuKi59JHtleHRlbnNpb25zfWAgOiBgKiovKi4ke2V4dGVuc2lvbnN9YFxuICByZXR1cm4gZ2xvYi5zeW5jKHBhdHRlcm4sIHsgY3dkLCBhYnNvbHV0ZTogdHJ1ZSwgbm9kaXI6IHRydWUgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGdldENvbXBvbmVudEZpbGVzID0gKHJvb3QsIHdvcmtpbmdEaXIgPSBwcm9jZXNzLmN3ZCgpKSA9PlxuICBsaXN0UmVhY3RGaWxlcyhyb290KS50aGVuKGZpbGVzID0+XG4gICAgZmlsZXMubWFwKHBhdGggPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUocGF0aClcblxuICAgICAgY29uc3QgYWJzb2x1dGVQYXRoID0gam9pbihyb290LCBwYXRoKVxuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUod29ya2luZ0RpciwgYWJzb2x1dGVQYXRoKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYCR7bmFtZX0gJHtncmF5KHJlbGF0aXZlUGF0aCl9YCxcbiAgICAgICAgc2hvcnQ6IG5hbWUsXG4gICAgICAgIHZhbHVlOiBhYnNvbHV0ZVBhdGgsXG4gICAgICB9XG4gICAgfSlcbiAgKVxuXG5leHBvcnQgY29uc3QgcmVwbGFjZUNvbnRlbnRzID0gKGNvbnRlbnRzLCBvbGROYW1lLCBuZXdOYW1lKSA9PlxuICBjb250ZW50cy5yZXBsYWNlKFxuICAgIG5ldyBSZWdFeHAoXG4gICAgICBgKFteYS16QS1aMC05XyRdKSR7b2xkTmFtZX0oW15hLXpBLVowLTlfJF18Q29udGFpbmVyKXwoWyd8XCJdLi9bYS16QS1aMC05XyRdKj8pJHtvbGROYW1lfShbYS16QS1aMC05XyRdKj8pYCxcbiAgICAgIFwiZ1wiXG4gICAgKSxcbiAgICBgJDEkMyR7bmV3TmFtZX0kMiQ0YFxuICApXG5cbmV4cG9ydCBjb25zdCByZXBsYWNlQ29udGVudHNIYXNMb3dlckNhc2UgPSAoY29udGVudHMsIG9sZE5hbWUsIG5ld05hbWUpID0+XG4gIGNvbnRlbnRzLnJlcGxhY2UoXG4gICAgbmV3IFJlZ0V4cChcbiAgICAgIGAoW15hLXpBLVowLTlfJF0pKCR7b2xkTmFtZX18JHtvbGROYW1lLnRvTG93ZXJDYXNlKCl9KShbXmEtekEtWjAtOV8kXXxDb250YWluZXIpfChbJ3xcIl0uL1thLXpBLVowLTlfJF0qPykoJHtvbGROYW1lfXwke29sZE5hbWUudG9Mb3dlckNhc2UoKX0pKFthLXpBLVowLTlfJF0qPylgLFxuICAgICAgXCJnXCJcbiAgICApLFxuICAgIGAkMSQ0JHtuZXdOYW1lfSQzJDZgXG4gIClcblxuZXhwb3J0IGNvbnN0IHJlcGxhY2VMZXNzSW1wb3J0ID0gKGNvbnRlbnRzLCBuZXdDb250ZW50KSA9PlxuICBjb250ZW50cy5yZXBsYWNlKG5ldyBSZWdFeHAoL0BpbXBvcnRcXHMrXCJbLi9cXC1cXHddK1wiOy8pLCBgQGltcG9ydCBcIiR7bmV3Q29udGVudH1cIjtgKVxuXG5cbiAgRGF0ZS5wcm90b3R5cGUuRm9ybWF0ID0gZnVuY3Rpb24gKGZtdCkgeyBcbiAgICB2YXIgbyA9IHtcbiAgICBcIk0rXCI6IHRoaXMuZ2V0TW9udGgoKSArIDEsIC8v5pyI5Lu9XG4gICAgXCJkK1wiOiB0aGlzLmdldERhdGUoKSwgLy/ml6VcbiAgICBcImgrXCI6IHRoaXMuZ2V0SG91cnMoKSwgLy/lsI/ml7ZcbiAgICBcIm0rXCI6IHRoaXMuZ2V0TWludXRlcygpLCAvL+WIhlxuICAgIFwicytcIjogdGhpcy5nZXRTZWNvbmRzKCksIC8v56eSXG4gICAgXCJxK1wiOiBNYXRoLmZsb29yKCh0aGlzLmdldE1vbnRoKCkgKyAzKSAvIDMpLCAvL+Wto+W6plxuICAgIFwiU1wiOiB0aGlzLmdldE1pbGxpc2Vjb25kcygpIC8v5q+r56eSXG4gICAgfTtcbiAgICBpZiAoLyh5KykvLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAodGhpcy5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7XG4gICAgZm9yICh2YXIgayBpbiBvKVxuICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZtdCkpIGZtdCA9IGZtdC5yZXBsYWNlKFJlZ0V4cC4kMSwgKFJlZ0V4cC4kMS5sZW5ndGggPT0gMSkgPyAob1trXSkgOiAoKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpKTtcbiAgICByZXR1cm4gZm10O1xuICAgIH1cbi8vIOa3u+WKoOaWh+S7tuWktFxuY29uc3QgYWRkRmlsZUhlYWRlciA9IChjb250ZW50KSA9PiB7XG4gIGNvbnN0IHVzZXJOYW1lID0gZ2l0VXNlck5hbWUoKVxuICBjb25zdCBmaWxlSGVhZGVyID0gXG5gXG4vKlxuKiBAQXV0aG9yOiAke3VzZXJOYW1lfVxuKiBATW9kdWxlTmFtZTogdW5kZWZpbmVkXG4qIEBEYXRlOiAke25ldyBEYXRlKCkuRm9ybWF0KFwieXl5eS1NTS1kZFwiKX1cbiogQExhc3QgTW9kaWZpZWQgYnk6ICR7dXNlck5hbWV9XG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6ICR7bmV3IERhdGUoKS5Gb3JtYXQoXCJ5eXl5LU1NLWRkXCIpfVxuKi9cblxuYFxuICByZXR1cm4gZmlsZUhlYWRlcitjb250ZW50XG59XG4vLyDmm7TmjaLnu4Tlu7rlkI3np7Bcbi8vIOabtOaNoiBjc3Mg6Lev5b6EIOWFiOaJvuWIsCBzcmNcbi8vIOabtOaNoiBBdXRob3IgTmFtZVxuZXhwb3J0IGNvbnN0IHJlcGxpY2F0ZSA9IGFzeW5jIChvcmlnaW5hbFBhdGgsIGFuc3dlcnMsIHdvcmtpbmdEaXIgPSBwcm9jZXNzLmN3ZCgpKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3JpZ2luYWxOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShvcmlnaW5hbFBhdGgpXG4gICAgY29uc3QgYWJzb2x1dGVQYXRoID0gaXNBYnNvbHV0ZShvcmlnaW5hbFBhdGgpID8gb3JpZ2luYWxQYXRoIDogam9pbih3b3JraW5nRGlyLCBvcmlnaW5hbFBhdGgpXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIGlmIChpc1NpbmdsZUZpbGUob3JpZ2luYWxQYXRoKSkge1xuICAgICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkaXJuYW1lKGFic29sdXRlUGF0aCksIG9yaWdpbmFsTmFtZSlcbiAgICAgIGZpbGVzLmZvckVhY2goYXN5bmMgZmlsZSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYmFzZW5hbWUoZmlsZSkucmVwbGFjZShvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSlcbiAgICAgICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gam9pbih3b3JraW5nRGlyLCBhbnN3ZXJzLmZvbGRlciwgZmlsZW5hbWUpXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBjb3B5KGZpbGUsIGRlc3RpbmF0aW9uUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZGVzdGluYXRpb25QYXRoKS50b1N0cmluZygpXG4gICAgICAgICAgd3JpdGVGaWxlU3luYyhkZXN0aW5hdGlvblBhdGgsIHJlcGxhY2VDb250ZW50cyhjb250ZW50cywgb3JpZ2luYWxOYW1lLCBhbnN3ZXJzLm5hbWUpKVxuICAgICAgICB9KVxuICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZXN0aW5hdGlvblBhdGggPSBqb2luKHdvcmtpbmdEaXIsIGFuc3dlcnMuZm9sZGVyLCBhbnN3ZXJzLm5hbWUpXG4gICAgICBhd2FpdCBjb3B5KGRpcm5hbWUoYWJzb2x1dGVQYXRoKSwgZGVzdGluYXRpb25QYXRoKVxuICAgICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkZXN0aW5hdGlvblBhdGgpXG4gICAgICBmaWxlcy5mb3JFYWNoKGFzeW5jIGZpbGUgPT4ge1xuICAgICAgICBsZXQgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZmlsZSkudG9TdHJpbmcoKVxuICAgICAgICBsZXQgbmFtZSA9IGFuc3dlcnMubmFtZVxuICAgICAgICAvLyDmm7/mjaLmlofku7blhoXlrrnmraPliJlcbiAgICAgICAgbGV0IHJlcGxhY2VDb250ZW50c0Z1bmMgPSB1bmRlZmluZWRcbiAgICAgICAgLy8g5aaC5p6c5pivY3Nz5paH5Lu2IOWImeabtOaNoiBsZXNzIOW8leWFpSDlpoLmnpzmmK9sZXNz5paH5Lu2IOWImeaWsOWRveWQjeS4uuWwj+WGmSDlsIbph4zpnaLnmoTlpKflsI/lhpnlhoXlrrnlhajmm7/mjaLlsI/lhplcbiAgICAgICAgaWYgKGZpbGUuaW5kZXhPZihcIi5sZXNzXCIpID4gLTEpIHtcbiAgICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgcmVwbGFjZUNvbnRlbnRzRnVuYyA9IHJlcGxhY2VDb250ZW50c0hhc0xvd2VyQ2FzZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGZpbmQgfSA9IG5ldyBGaW5kRmlsZSgpXG4gICAgICAgICAgICBjb25zdCBmaW5kUGF0aCA9IHByb2Nlc3MuY3dkKCkuc3BsaXQoXCIvc3JjXCIpWzBdXG4gICAgICAgICAgICAvLyDmn6Xmib5jb21tb27mlofku7blpLnot6/lvoRcbiAgICAgICAgICAgIGNvbnN0IGRlZkxlc3NQYXRoID0gYXdhaXQgZmluZChmaW5kUGF0aCwgXCJkZWYubGVzc1wiKVxuICAgICAgICAgICAgaWYgKGRlZkxlc3NQYXRoKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlZkxlc3NQYXRoLCBcImRlZkxlc3NQYXRoXCIpXG4gICAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHJlc29sdmUoZmlsZSwgXCIuLi9cIiksIGRlZkxlc3NQYXRoKVxuICAgICAgICAgICAgICBjb250ZW50cyA9IHJlcGxhY2VMZXNzSW1wb3J0KGNvbnRlbnRzLCByZWxhdGl2ZVBhdGgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVkKGBbRmluZEZpbGVdIGZpbmQgZGVmLmxlc3MgZXJyb3IgOiAke2V9YClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVwbGFjZUNvbnRlbnRzRnVuYyA9IHJlcGxhY2VDb250ZW50c1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlbmFtZWRQYXRoID0gam9pbihkaXJuYW1lKGZpbGUpLCBiYXNlbmFtZShmaWxlKS5yZXBsYWNlKG9yaWdpbmFsTmFtZSwgbmFtZSkpXG4gICAgICAgIGNvbnN0IG5leHRDb250ZW50ID0gcmVwbGFjZUNvbnRlbnRzRnVuYyhjb250ZW50cywgb3JpZ2luYWxOYW1lLCBuYW1lKVxuICAgICAgICB3cml0ZUZpbGVTeW5jKGZpbGUsIGFkZEZpbGVIZWFkZXIobmV4dENvbnRlbnQpKVxuICAgICAgICBpZiAoZmlsZSAhPT0gcmVuYW1lZFBhdGgpIHtcbiAgICAgICAgICBjb25zdCBwcm9taXNlID0gbW92ZShmaWxlLCByZW5hbWVkUGF0aClcbiAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVkKGBbcmVwbGljYXRlXSBlcnJvcjogJHtlLm1lc3NhZ2V9YClcbiAgfVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuKGFycikge1xuICB2YXIgcmVzID0gW11cbiAgYXJyLm1hcChpdGVtID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgcmVzID0gcmVzLmNvbmNhdChmbGF0dGVuKGl0ZW0pKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMucHVzaChpdGVtKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgeyBmbGF0dGVuIH1cbiJdfQ==