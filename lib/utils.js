"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = flatten;
exports.replicate = exports.replaceLessImport = exports.replaceContents = exports.getComponentFiles = exports.getFiles = exports.isSingleFile = exports.getComponentFolder = exports.getComponentName = void 0;

var _path = require("path");

var _lodash = require("lodash");

var _chalk = require("chalk");

var _glob = _interopRequireDefault(require("glob"));

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

var replaceLessImport = (contents, newContent) => contents.replace(new RegExp(/@import\s+"[./\-\w]+";/), "@import \"".concat(newContent, "\";")); // 更换组建名称
// 更换 css 路径 先找到 src
// 更换 Author Name


exports.replaceLessImport = replaceLessImport;

var replicate =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (originalPath, answers) {
    var workingDir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process.cwd();
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
          var contents = (0, _fsExtra.readFileSync)(file).toString(); // 如果是css文件 则更换 less 引入

          if (contents.indexOf("@import") > -1) {
            try {
              var {
                find
              } = new _file.FindFile();
              var findPath = process.cwd().split('/src')[0];
              var defLessPath = yield find(findPath, "def.less");

              if (defLessPath) {
                var relativePath = (0, _path.relative)((0, _path.resolve)(file, '../'), defLessPath);
                contents = replaceLessImport(contents, relativePath);
              }
            } catch (e) {
              (0, _chalk.red)("[FindFile] find def.less error : ".concat(e));
            }
          }

          var renamedPath = (0, _path.join)((0, _path.dirname)(file), (0, _path.basename)(file).replace(originalName, answers.name));
          (0, _fsExtra.writeFileSync)(file, replaceContents(contents, originalName, answers.name));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJyZW1vdmVFeHQiLCJwYXRoIiwicmVwbGFjZSIsImdldENvbXBvbmVudE5hbWUiLCJzcGxpdCIsInJlZHVjZSIsIm5hbWUiLCJwYXJ0IiwidGVzdCIsImdldENvbXBvbmVudEZvbGRlciIsImZvbGRlciIsImlzU2luZ2xlRmlsZSIsImRpciIsInJldmVyc2UiLCJnZXRGaWxlcyIsImN3ZCIsImNvbXBvbmVudE5hbWUiLCJleHRlbnNpb25zIiwicGF0dGVybiIsImdsb2IiLCJzeW5jIiwiYWJzb2x1dGUiLCJub2RpciIsImdldENvbXBvbmVudEZpbGVzIiwicm9vdCIsIndvcmtpbmdEaXIiLCJwcm9jZXNzIiwidGhlbiIsImZpbGVzIiwibWFwIiwiYWJzb2x1dGVQYXRoIiwicmVsYXRpdmVQYXRoIiwic2hvcnQiLCJ2YWx1ZSIsInJlcGxhY2VDb250ZW50cyIsImNvbnRlbnRzIiwib2xkTmFtZSIsIm5ld05hbWUiLCJSZWdFeHAiLCJyZXBsYWNlTGVzc0ltcG9ydCIsIm5ld0NvbnRlbnQiLCJyZXBsaWNhdGUiLCJvcmlnaW5hbFBhdGgiLCJhbnN3ZXJzIiwib3JpZ2luYWxOYW1lIiwicHJvbWlzZXMiLCJmb3JFYWNoIiwiZmlsZSIsImZpbGVuYW1lIiwiZGVzdGluYXRpb25QYXRoIiwicHJvbWlzZSIsInRvU3RyaW5nIiwicHVzaCIsImluZGV4T2YiLCJmaW5kIiwiRmluZEZpbGUiLCJmaW5kUGF0aCIsImRlZkxlc3NQYXRoIiwiZSIsInJlbmFtZWRQYXRoIiwiUHJvbWlzZSIsImFsbCIsImZsYXR0ZW4iLCJhcnIiLCJyZXMiLCJpdGVtIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLFNBQVMsR0FBR0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLE9BQUwsQ0FBYSxV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VDtBQUNEO0FBQ0YsR0FORDtBQU9BLFNBQU9ELEdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBpc0Fic29sdXRlLCBqb2luLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCB7IGNhbWVsQ2FzZSwgdXBwZXJGaXJzdCB9IGZyb20gXCJsb2Rhc2hcIlxuaW1wb3J0IHsgZ3JheSwgcmVkIH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCBnbG9iIGZyb20gXCJnbG9iXCJcbmltcG9ydCBsaXN0UmVhY3RGaWxlcyBmcm9tIFwibGlzdC1yZWFjdC1maWxlc1wiXG5pbXBvcnQgeyBjb3B5LCBtb3ZlLCByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tIFwiZnMtZXh0cmFcIlxuaW1wb3J0IHsgRmluZEZpbGUgfSBmcm9tIFwiLi9maWxlXCJcblxuY29uc3QgcmVtb3ZlRXh0ID0gcGF0aCA9PiBwYXRoLnJlcGxhY2UoL1xcLlteLl0rJC8sIFwiXCIpXG5cbmV4cG9ydCBjb25zdCBnZXRDb21wb25lbnROYW1lID0gcGF0aCA9PlxuICBwYXRoLnNwbGl0KFwiL1wiKS5yZWR1Y2UoKG5hbWUsIHBhcnQpID0+IHtcbiAgICBpZiAoL15bQS1aXS8udGVzdChwYXJ0KSkge1xuICAgICAgcmV0dXJuIHJlbW92ZUV4dChwYXJ0KVxuICAgIH0gZWxzZSBpZiAoL14oKD8haW5kZXgpLispXFwuW14uXSskLy50ZXN0KHBhcnQpKSB7XG4gICAgICByZXR1cm4gdXBwZXJGaXJzdChjYW1lbENhc2UocmVtb3ZlRXh0KHBhcnQpKSlcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVcbiAgfSwgXCJcIilcblxuZXhwb3J0IGNvbnN0IGdldENvbXBvbmVudEZvbGRlciA9IHBhdGggPT4ge1xuICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuICByZXR1cm4gZGlybmFtZShwYXRoKS5zcGxpdChcIi9cIikucmVkdWNlKChmb2xkZXIsIHBhcnQpID0+IHtcbiAgICBpZiAocmVtb3ZlRXh0KHBhcnQpID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gZm9sZGVyXG4gICAgfVxuICAgIHJldHVybiBqb2luKGZvbGRlciwgcGFydClcbiAgfSwgXCIuL1wiKVxufVxuXG5leHBvcnQgY29uc3QgaXNTaW5nbGVGaWxlID0gcGF0aCA9PiB7XG4gIGNvbnN0IG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHBhdGgpXG4gIGNvbnN0IFsgZGlyIF0gPSBkaXJuYW1lKHBhdGgpLnNwbGl0KFwiL1wiKS5yZXZlcnNlKClcbiAgcmV0dXJuIGRpciAhPT0gbmFtZVxufVxuXG5leHBvcnQgY29uc3QgZ2V0RmlsZXMgPSAoY3dkLCBjb21wb25lbnROYW1lKSA9PiB7XG4gIGNvbnN0IGV4dGVuc2lvbnMgPSBcIntqcyx0cyxqc3gsdHN4LGNzcyxsZXNzLHNjc3Msc2Fzcyxzc3MsanNvbixtZCxtZHh9XCJcbiAgY29uc3QgcGF0dGVybiA9IGNvbXBvbmVudE5hbWUgPyBgKiovJHtjb21wb25lbnROYW1lfXsuLC4qLn0ke2V4dGVuc2lvbnN9YCA6IGAqKi8qLiR7ZXh0ZW5zaW9uc31gXG4gIHJldHVybiBnbG9iLnN5bmMocGF0dGVybiwgeyBjd2QsIGFic29sdXRlOiB0cnVlLCBub2RpcjogdHJ1ZSB9KVxufVxuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9uZW50RmlsZXMgPSAocm9vdCwgd29ya2luZ0RpciA9IHByb2Nlc3MuY3dkKCkpID0+XG4gIGxpc3RSZWFjdEZpbGVzKHJvb3QpLnRoZW4oZmlsZXMgPT5cbiAgICBmaWxlcy5tYXAocGF0aCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuXG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBqb2luKHJvb3QsIHBhdGgpXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZSh3b3JraW5nRGlyLCBhYnNvbHV0ZVBhdGgpXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBgJHtuYW1lfSAke2dyYXkocmVsYXRpdmVQYXRoKX1gLFxuICAgICAgICBzaG9ydDogbmFtZSxcbiAgICAgICAgdmFsdWU6IGFic29sdXRlUGF0aCxcbiAgICAgIH1cbiAgICB9KVxuICApXG5cbmV4cG9ydCBjb25zdCByZXBsYWNlQ29udGVudHMgPSAoY29udGVudHMsIG9sZE5hbWUsIG5ld05hbWUpID0+XG4gIGNvbnRlbnRzLnJlcGxhY2UoXG4gICAgbmV3IFJlZ0V4cChcbiAgICAgIGAoW15hLXpBLVowLTlfJF0pJHtvbGROYW1lfShbXmEtekEtWjAtOV8kXXxDb250YWluZXIpfChbJ3xcIl0uL1thLXpBLVowLTlfJF0qPykke29sZE5hbWV9KFthLXpBLVowLTlfJF0qPylgLFxuICAgICAgXCJnXCJcbiAgICApLFxuICAgIGAkMSQzJHtuZXdOYW1lfSQyJDRgXG4gIClcblxuZXhwb3J0IGNvbnN0IHJlcGxhY2VMZXNzSW1wb3J0ID0gKGNvbnRlbnRzLCBuZXdDb250ZW50KSA9PlxuICBjb250ZW50cy5yZXBsYWNlKG5ldyBSZWdFeHAoL0BpbXBvcnRcXHMrXCJbLi9cXC1cXHddK1wiOy8pLCBgQGltcG9ydCBcIiR7bmV3Q29udGVudH1cIjtgKVxuXG4vLyDmm7TmjaLnu4Tlu7rlkI3np7Bcbi8vIOabtOaNoiBjc3Mg6Lev5b6EIOWFiOaJvuWIsCBzcmNcbi8vIOabtOaNoiBBdXRob3IgTmFtZVxuZXhwb3J0IGNvbnN0IHJlcGxpY2F0ZSA9IGFzeW5jIChvcmlnaW5hbFBhdGgsIGFuc3dlcnMsIHdvcmtpbmdEaXIgPSBwcm9jZXNzLmN3ZCgpKSA9PiB7XG4gIGNvbnN0IG9yaWdpbmFsTmFtZSA9IGdldENvbXBvbmVudE5hbWUob3JpZ2luYWxQYXRoKVxuICBjb25zdCBhYnNvbHV0ZVBhdGggPSBpc0Fic29sdXRlKG9yaWdpbmFsUGF0aCkgPyBvcmlnaW5hbFBhdGggOiBqb2luKHdvcmtpbmdEaXIsIG9yaWdpbmFsUGF0aClcbiAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICBpZiAoaXNTaW5nbGVGaWxlKG9yaWdpbmFsUGF0aCkpIHtcbiAgICBjb25zdCBmaWxlcyA9IGdldEZpbGVzKGRpcm5hbWUoYWJzb2x1dGVQYXRoKSwgb3JpZ2luYWxOYW1lKVxuICAgIGZpbGVzLmZvckVhY2goYXN5bmMgZmlsZSA9PiB7XG4gICAgICBjb25zdCBmaWxlbmFtZSA9IGJhc2VuYW1lKGZpbGUpLnJlcGxhY2Uob3JpZ2luYWxOYW1lLCBhbnN3ZXJzLm5hbWUpXG4gICAgICBjb25zdCBkZXN0aW5hdGlvblBhdGggPSBqb2luKHdvcmtpbmdEaXIsIGFuc3dlcnMuZm9sZGVyLCBmaWxlbmFtZSlcbiAgICAgIGNvbnN0IHByb21pc2UgPSBjb3B5KGZpbGUsIGRlc3RpbmF0aW9uUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gcmVhZEZpbGVTeW5jKGRlc3RpbmF0aW9uUGF0aCkudG9TdHJpbmcoKVxuICAgICAgICB3cml0ZUZpbGVTeW5jKGRlc3RpbmF0aW9uUGF0aCwgcmVwbGFjZUNvbnRlbnRzKGNvbnRlbnRzLCBvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSkpXG4gICAgICB9KVxuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gam9pbih3b3JraW5nRGlyLCBhbnN3ZXJzLmZvbGRlciwgYW5zd2Vycy5uYW1lKVxuICAgIGF3YWl0IGNvcHkoZGlybmFtZShhYnNvbHV0ZVBhdGgpLCBkZXN0aW5hdGlvblBhdGgpXG4gICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkZXN0aW5hdGlvblBhdGgpXG4gICAgZmlsZXMuZm9yRWFjaChhc3luYyBmaWxlID0+IHtcbiAgICAgIGxldCBjb250ZW50cyA9IHJlYWRGaWxlU3luYyhmaWxlKS50b1N0cmluZygpXG4gICAgICAvLyDlpoLmnpzmmK9jc3Pmlofku7Yg5YiZ5pu05o2iIGxlc3Mg5byV5YWlXG4gICAgICBpZiAoY29udGVudHMuaW5kZXhPZihcIkBpbXBvcnRcIikgPiAtMSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHsgZmluZCB9ID0gbmV3IEZpbmRGaWxlKClcbiAgICAgICAgICBjb25zdCBmaW5kUGF0aCA9IHByb2Nlc3MuY3dkKCkuc3BsaXQoJy9zcmMnKVswXVxuICAgICAgICAgIGNvbnN0IGRlZkxlc3NQYXRoID0gYXdhaXQgZmluZChmaW5kUGF0aCwgXCJkZWYubGVzc1wiKVxuICAgICAgICAgIGlmKGRlZkxlc3NQYXRoKXtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHJlc29sdmUoZmlsZSwnLi4vJyksIGRlZkxlc3NQYXRoKVxuICAgICAgICAgICAgY29udGVudHMgPSByZXBsYWNlTGVzc0ltcG9ydChjb250ZW50cyxyZWxhdGl2ZVBhdGgpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmVkKGBbRmluZEZpbGVdIGZpbmQgZGVmLmxlc3MgZXJyb3IgOiAke2V9YClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgcmVuYW1lZFBhdGggPSBqb2luKGRpcm5hbWUoZmlsZSksIGJhc2VuYW1lKGZpbGUpLnJlcGxhY2Uob3JpZ2luYWxOYW1lLCBhbnN3ZXJzLm5hbWUpKVxuICAgICAgd3JpdGVGaWxlU3luYyhmaWxlLCByZXBsYWNlQ29udGVudHMoY29udGVudHMsIG9yaWdpbmFsTmFtZSwgYW5zd2Vycy5uYW1lKSlcbiAgICAgIGlmIChmaWxlICE9PSByZW5hbWVkUGF0aCkge1xuICAgICAgICBjb25zdCBwcm9taXNlID0gbW92ZShmaWxlLCByZW5hbWVkUGF0aClcbiAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyKSB7XG4gIHZhciByZXMgPSBbXVxuICBhcnIubWFwKGl0ZW0gPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICByZXMgPSByZXMuY29uY2F0KGZsYXR0ZW4oaXRlbSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5wdXNoKGl0ZW0pXG4gICAgfVxuICB9KVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCB7IGZsYXR0ZW4gfVxuIl19