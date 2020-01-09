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
}; // 获取组建信息


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
}; // 替换指定内容


exports.getComponentFiles = getComponentFiles;

var replaceContents = (contents, oldName, newName) => contents.replace(new RegExp("([^a-zA-Z0-9_$])".concat(oldName, "([^a-zA-Z0-9_$]|Container)|(['|\"]./[a-zA-Z0-9_$]*?)").concat(oldName, "([a-zA-Z0-9_$]*?)"), "g"), "$1$3".concat(newName, "$2$4")); // 大小写名字都替换


exports.replaceContents = replaceContents;

var replaceContentsHasLowerCase = (contents, oldName, newName) => contents.replace(new RegExp("([^a-zA-Z0-9_$])(".concat(oldName, "|").concat(oldName.toLowerCase(), ")([^a-zA-Z0-9_$]|Container)|(['|\"]./[a-zA-Z0-9_$]*?)(").concat(oldName, "|").concat(oldName.toLowerCase(), ")([a-zA-Z0-9_$]*?)"), "g"), "$1$4".concat(newName, "$3$6")); // 替换 css 引入路径


exports.replaceContentsHasLowerCase = replaceContentsHasLowerCase;

var replaceLessImport = (contents, newContent) => contents.replace(new RegExp(/@import\s+"[./\-\w]+";/), "@import \"".concat(newContent, "\";")); // 时间格式化


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
    S: this.getMilliseconds() //毫秒

  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }

  return fmt;
}; // 添加文件头


var addFileHeader = content => {
  console.log(content, 'content'); // 如果没有文件头就添加文件头
  // 有文件头就替换文件头

  var reg = new RegExp(/\/\*\n\s\*\s+@Author([\w\W]*)\* @Last Modified time([\w\W]*)\n\*\//);
  var userName = (0, _gitUserName.default)();
  var fileHeader = "/*\n* @Author: ".concat(userName, "\n* @ModuleName: undefined\n* @Date: ").concat(new Date().Format("yyyy-MM-dd HH:mm:s"), "\n* @Last Modified by: ").concat(userName, "\n* @Last Modified time: ").concat(new Date().Format("yyyy-MM-dd HH:mm:s"), "\n*/\n\n");

  if (reg.test(content)) {
    return contents.replace(reg, "".concat(fileHeader));
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJyZW1vdmVFeHQiLCJwYXRoIiwicmVwbGFjZSIsImdldENvbXBvbmVudE5hbWUiLCJzcGxpdCIsInJlZHVjZSIsIm5hbWUiLCJwYXJ0IiwidGVzdCIsImdldENvbXBvbmVudEZvbGRlciIsImZvbGRlciIsImlzU2luZ2xlRmlsZSIsImRpciIsInJldmVyc2UiLCJnZXRGaWxlcyIsImN3ZCIsImNvbXBvbmVudE5hbWUiLCJleHRlbnNpb25zIiwicGF0dGVybiIsImdsb2IiLCJzeW5jIiwiYWJzb2x1dGUiLCJub2RpciIsImdldENvbXBvbmVudEZpbGVzIiwicm9vdCIsIndvcmtpbmdEaXIiLCJwcm9jZXNzIiwidGhlbiIsImZpbGVzIiwibWFwIiwiYWJzb2x1dGVQYXRoIiwicmVsYXRpdmVQYXRoIiwic2hvcnQiLCJ2YWx1ZSIsInJlcGxhY2VDb250ZW50cyIsImNvbnRlbnRzIiwib2xkTmFtZSIsIm5ld05hbWUiLCJSZWdFeHAiLCJyZXBsYWNlQ29udGVudHNIYXNMb3dlckNhc2UiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2VMZXNzSW1wb3J0IiwibmV3Q29udGVudCIsIkRhdGUiLCJwcm90b3R5cGUiLCJGb3JtYXQiLCJmbXQiLCJvIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsIk1hdGgiLCJmbG9vciIsIlMiLCJnZXRNaWxsaXNlY29uZHMiLCIkMSIsImdldEZ1bGxZZWFyIiwic3Vic3RyIiwibGVuZ3RoIiwiayIsImFkZEZpbGVIZWFkZXIiLCJjb250ZW50IiwiY29uc29sZSIsImxvZyIsInJlZyIsInVzZXJOYW1lIiwiZmlsZUhlYWRlciIsInJlcGxpY2F0ZSIsIm9yaWdpbmFsUGF0aCIsImFuc3dlcnMiLCJvcmlnaW5hbE5hbWUiLCJwcm9taXNlcyIsImZvckVhY2giLCJmaWxlIiwiZmlsZW5hbWUiLCJkZXN0aW5hdGlvblBhdGgiLCJwcm9taXNlIiwidG9TdHJpbmciLCJwdXNoIiwicmVwbGFjZUNvbnRlbnRzRnVuYyIsInVuZGVmaW5lZCIsImluZGV4T2YiLCJmaW5kIiwiRmluZEZpbGUiLCJmaW5kUGF0aCIsImRlZkxlc3NQYXRoIiwiZSIsInJlbmFtZWRQYXRoIiwibmV4dENvbnRlbnQiLCJQcm9taXNlIiwiYWxsIiwibWVzc2FnZSIsImZsYXR0ZW4iLCJhcnIiLCJyZXMiLCJpdGVtIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLFNBQVMsR0FBR0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQXpCLENBQTFCOztBQUVPLElBQU1DLGdCQUFnQixHQUFHRixJQUFJLElBQ2xDQSxJQUFJLENBQUNHLEtBQUwsQ0FBVyxHQUFYLEVBQWdCQyxNQUFoQixDQUF1QixDQUFDQyxJQUFELEVBQU9DLElBQVAsS0FBZ0I7QUFDckMsTUFBSSxTQUFTQyxJQUFULENBQWNELElBQWQsQ0FBSixFQUF5QjtBQUN2QixXQUFPUCxTQUFTLENBQUNPLElBQUQsQ0FBaEI7QUFDRCxHQUZELE1BRU8sSUFBSSx5QkFBeUJDLElBQXpCLENBQThCRCxJQUE5QixDQUFKLEVBQXlDO0FBQzlDLFdBQU8sd0JBQVcsdUJBQVVQLFNBQVMsQ0FBQ08sSUFBRCxDQUFuQixDQUFYLENBQVA7QUFDRDs7QUFDRCxTQUFPRCxJQUFQO0FBQ0QsQ0FQRCxFQU9HLEVBUEgsQ0FESzs7OztBQVVBLElBQU1HLGtCQUFrQixHQUFHUixJQUFJLElBQUk7QUFDeEMsTUFBTUssSUFBSSxHQUFHSCxnQkFBZ0IsQ0FBQ0YsSUFBRCxDQUE3QjtBQUNBLFNBQU8sbUJBQVFBLElBQVIsRUFBY0csS0FBZCxDQUFvQixHQUFwQixFQUF5QkMsTUFBekIsQ0FBZ0MsQ0FBQ0ssTUFBRCxFQUFTSCxJQUFULEtBQWtC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LFlBQVgsRUFBeUJsRSxJQUF6QixDQUF2QztBQUNBLHdDQUFjcUUsSUFBZCxFQUFvQmIsYUFBYSxDQUFDNEIsV0FBRCxDQUFqQzs7QUFDQSxnQkFBSWYsSUFBSSxLQUFLYyxXQUFiLEVBQTBCO0FBQ3hCLGtCQUFNWCxPQUFPLEdBQUcsbUJBQUtILElBQUwsRUFBV2MsV0FBWCxDQUFoQjtBQUNBaEIsY0FBQUEsUUFBUSxDQUFDTyxJQUFULENBQWNGLE9BQWQ7QUFDRDtBQUNGLFdBaENEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBaUNEOztBQUNELFlBQU1hLE9BQU8sQ0FBQ0MsR0FBUixDQUFZbkIsUUFBWixDQUFOO0FBQ0QsS0F0REQsQ0FzREUsT0FBT2UsQ0FBUCxFQUFVO0FBQ1YsbURBQTBCQSxDQUFDLENBQUNLLE9BQTVCO0FBQ0Q7QUFDRixHQTFEcUI7O0FBQUEsa0JBQVR4QixTQUFTO0FBQUE7QUFBQTtBQUFBLEdBQWY7Ozs7QUE0RFAsU0FBU3lCLE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXNCO0FBQ3BCLE1BQUlDLEdBQUcsR0FBRyxFQUFWO0FBQ0FELEVBQUFBLEdBQUcsQ0FBQ2xFLEdBQUosQ0FBUW9FLElBQUksSUFBSTtBQUNkLFFBQUlDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixJQUFkLENBQUosRUFBeUI7QUFDdkJELE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDSSxNQUFKLENBQVdOLE9BQU8sQ0FBQ0csSUFBRCxDQUFsQixDQUFOO0FBQ0QsS0FGRCxNQUVPO0FBQ0xELE1BQUFBLEdBQUcsQ0FBQ2hCLElBQUosQ0FBU2lCLElBQVQ7QUFDRDtBQUNGLEdBTkQ7QUFPQSxTQUFPRCxHQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBiYXNlbmFtZSwgZGlybmFtZSwgaXNBYnNvbHV0ZSwgam9pbiwgcmVsYXRpdmUsIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgeyBjYW1lbENhc2UsIHVwcGVyRmlyc3QgfSBmcm9tIFwibG9kYXNoXCJcbmltcG9ydCB7IGdyYXksIHJlZCB9IGZyb20gXCJjaGFsa1wiXG5pbXBvcnQgZ2xvYiBmcm9tIFwiZ2xvYlwiXG5pbXBvcnQgZ2l0VXNlck5hbWUgZnJvbSBcImdpdC11c2VyLW5hbWVcIlxuaW1wb3J0IGxpc3RSZWFjdEZpbGVzIGZyb20gXCJsaXN0LXJlYWN0LWZpbGVzXCJcbmltcG9ydCB7IGNvcHksIG1vdmUsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gXCJmcy1leHRyYVwiXG5pbXBvcnQgeyBGaW5kRmlsZSB9IGZyb20gXCIuL2ZpbGVcIlxuXG5jb25zdCByZW1vdmVFeHQgPSBwYXRoID0+IHBhdGgucmVwbGFjZSgvXFwuW14uXSskLywgXCJcIilcblxuZXhwb3J0IGNvbnN0IGdldENvbXBvbmVudE5hbWUgPSBwYXRoID0+XG4gIHBhdGguc3BsaXQoXCIvXCIpLnJlZHVjZSgobmFtZSwgcGFydCkgPT4ge1xuICAgIGlmICgvXltBLVpdLy50ZXN0KHBhcnQpKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlRXh0KHBhcnQpXG4gICAgfSBlbHNlIGlmICgvXigoPyFpbmRleCkuKylcXC5bXi5dKyQvLnRlc3QocGFydCkpIHtcbiAgICAgIHJldHVybiB1cHBlckZpcnN0KGNhbWVsQ2FzZShyZW1vdmVFeHQocGFydCkpKVxuICAgIH1cbiAgICByZXR1cm4gbmFtZVxuICB9LCBcIlwiKVxuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9uZW50Rm9sZGVyID0gcGF0aCA9PiB7XG4gIGNvbnN0IG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHBhdGgpXG4gIHJldHVybiBkaXJuYW1lKHBhdGgpLnNwbGl0KFwiL1wiKS5yZWR1Y2UoKGZvbGRlciwgcGFydCkgPT4ge1xuICAgIGlmIChyZW1vdmVFeHQocGFydCkgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiBmb2xkZXJcbiAgICB9XG4gICAgcmV0dXJuIGpvaW4oZm9sZGVyLCBwYXJ0KVxuICB9LCBcIi4vXCIpXG59XG5cbmV4cG9ydCBjb25zdCBpc1NpbmdsZUZpbGUgPSBwYXRoID0+IHtcbiAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUocGF0aClcbiAgY29uc3QgWyBkaXIgXSA9IGRpcm5hbWUocGF0aCkuc3BsaXQoXCIvXCIpLnJldmVyc2UoKVxuICByZXR1cm4gZGlyICE9PSBuYW1lXG59XG5cbmV4cG9ydCBjb25zdCBnZXRGaWxlcyA9IChjd2QsIGNvbXBvbmVudE5hbWUpID0+IHtcbiAgY29uc3QgZXh0ZW5zaW9ucyA9IFwie2pzLHRzLGpzeCx0c3gsY3NzLGxlc3Msc2NzcyxzYXNzLHNzcyxqc29uLG1kLG1keH1cIlxuICBjb25zdCBwYXR0ZXJuID0gY29tcG9uZW50TmFtZSA/IGAqKi8ke2NvbXBvbmVudE5hbWV9ey4sLioufSR7ZXh0ZW5zaW9uc31gIDogYCoqLyouJHtleHRlbnNpb25zfWBcbiAgcmV0dXJuIGdsb2Iuc3luYyhwYXR0ZXJuLCB7IGN3ZCwgYWJzb2x1dGU6IHRydWUsIG5vZGlyOiB0cnVlIH0pXG59XG4vLyDojrflj5bnu4Tlu7rkv6Hmga9cbmV4cG9ydCBjb25zdCBnZXRDb21wb25lbnRGaWxlcyA9IChyb290LCB3b3JraW5nRGlyID0gcHJvY2Vzcy5jd2QoKSkgPT5cbiAgbGlzdFJlYWN0RmlsZXMocm9vdCkudGhlbihmaWxlcyA9PlxuICAgIGZpbGVzLm1hcChwYXRoID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHBhdGgpXG5cbiAgICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IGpvaW4ocm9vdCwgcGF0aClcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHdvcmtpbmdEaXIsIGFic29sdXRlUGF0aClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGAke25hbWV9ICR7Z3JheShyZWxhdGl2ZVBhdGgpfWAsXG4gICAgICAgIHNob3J0OiBuYW1lLFxuICAgICAgICB2YWx1ZTogYWJzb2x1dGVQYXRoLFxuICAgICAgfVxuICAgIH0pXG4gIClcbi8vIOabv+aNouaMh+WumuWGheWuuVxuZXhwb3J0IGNvbnN0IHJlcGxhY2VDb250ZW50cyA9IChjb250ZW50cywgb2xkTmFtZSwgbmV3TmFtZSkgPT5cbiAgY29udGVudHMucmVwbGFjZShcbiAgICBuZXcgUmVnRXhwKFxuICAgICAgYChbXmEtekEtWjAtOV8kXSkke29sZE5hbWV9KFteYS16QS1aMC05XyRdfENvbnRhaW5lcil8KFsnfFwiXS4vW2EtekEtWjAtOV8kXSo/KSR7b2xkTmFtZX0oW2EtekEtWjAtOV8kXSo/KWAsXG4gICAgICBcImdcIlxuICAgICksXG4gICAgYCQxJDMke25ld05hbWV9JDIkNGBcbiAgKVxuLy8g5aSn5bCP5YaZ5ZCN5a2X6YO95pu/5o2iXG5leHBvcnQgY29uc3QgcmVwbGFjZUNvbnRlbnRzSGFzTG93ZXJDYXNlID0gKGNvbnRlbnRzLCBvbGROYW1lLCBuZXdOYW1lKSA9PlxuICBjb250ZW50cy5yZXBsYWNlKFxuICAgIG5ldyBSZWdFeHAoXG4gICAgICBgKFteYS16QS1aMC05XyRdKSgke29sZE5hbWV9fCR7b2xkTmFtZS50b0xvd2VyQ2FzZSgpfSkoW15hLXpBLVowLTlfJF18Q29udGFpbmVyKXwoWyd8XCJdLi9bYS16QS1aMC05XyRdKj8pKCR7b2xkTmFtZX18JHtvbGROYW1lLnRvTG93ZXJDYXNlKCl9KShbYS16QS1aMC05XyRdKj8pYCxcbiAgICAgIFwiZ1wiXG4gICAgKSxcbiAgICBgJDEkNCR7bmV3TmFtZX0kMyQ2YFxuICApXG4vLyDmm7/mjaIgY3NzIOW8leWFpei3r+W+hFxuZXhwb3J0IGNvbnN0IHJlcGxhY2VMZXNzSW1wb3J0ID0gKGNvbnRlbnRzLCBuZXdDb250ZW50KSA9PlxuICBjb250ZW50cy5yZXBsYWNlKG5ldyBSZWdFeHAoL0BpbXBvcnRcXHMrXCJbLi9cXC1cXHddK1wiOy8pLCBgQGltcG9ydCBcIiR7bmV3Q29udGVudH1cIjtgKVxuXG4vLyDml7bpl7TmoLzlvI/ljJZcbkRhdGUucHJvdG90eXBlLkZvcm1hdCA9IGZ1bmN0aW9uKGZtdCkge1xuICB2YXIgbyA9IHtcbiAgICBcIk0rXCI6IHRoaXMuZ2V0TW9udGgoKSArIDEsIC8v5pyI5Lu9XG4gICAgXCJkK1wiOiB0aGlzLmdldERhdGUoKSwgLy/ml6VcbiAgICBcImgrXCI6IHRoaXMuZ2V0SG91cnMoKSwgLy/lsI/ml7ZcbiAgICBcIm0rXCI6IHRoaXMuZ2V0TWludXRlcygpLCAvL+WIhlxuICAgIFwicytcIjogdGhpcy5nZXRTZWNvbmRzKCksIC8v56eSXG4gICAgXCJxK1wiOiBNYXRoLmZsb29yKCh0aGlzLmdldE1vbnRoKCkgKyAzKSAvIDMpLCAvL+Wto+W6plxuICAgIFM6IHRoaXMuZ2V0TWlsbGlzZWNvbmRzKCksIC8v5q+r56eSXG4gIH1cbiAgaWYgKC8oeSspLy50ZXN0KGZtdCkpXG4gICAgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAodGhpcy5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSlcbiAgZm9yICh2YXIgayBpbiBvKVxuICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZtdCkpXG4gICAgICBmbXQgPSBmbXQucmVwbGFjZShcbiAgICAgICAgUmVnRXhwLiQxLFxuICAgICAgICBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aClcbiAgICAgIClcbiAgcmV0dXJuIGZtdFxufVxuXG4vLyDmt7vliqDmlofku7blpLRcbmNvbnN0IGFkZEZpbGVIZWFkZXIgPSBjb250ZW50ID0+IHtcbiAgY29uc29sZS5sb2coY29udGVudCwnY29udGVudCcpXG5cbiAgLy8g5aaC5p6c5rKh5pyJ5paH5Lu25aS05bCx5re75Yqg5paH5Lu25aS0XG4gIC8vIOacieaWh+S7tuWktOWwseabv+aNouaWh+S7tuWktFxuICBjb25zdCByZWcgPSBuZXcgUmVnRXhwKC9cXC9cXCpcXG5cXHNcXCpcXHMrQEF1dGhvcihbXFx3XFxXXSopXFwqIEBMYXN0IE1vZGlmaWVkIHRpbWUoW1xcd1xcV10qKVxcblxcKlxcLy8pXG5cbiAgY29uc3QgdXNlck5hbWUgPSBnaXRVc2VyTmFtZSgpXG4gIGNvbnN0IGZpbGVIZWFkZXIgPSBgLypcbiogQEF1dGhvcjogJHt1c2VyTmFtZX1cbiogQE1vZHVsZU5hbWU6IHVuZGVmaW5lZFxuKiBARGF0ZTogJHtuZXcgRGF0ZSgpLkZvcm1hdChcInl5eXktTU0tZGQgSEg6bW06c1wiKX1cbiogQExhc3QgTW9kaWZpZWQgYnk6ICR7dXNlck5hbWV9XG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6ICR7bmV3IERhdGUoKS5Gb3JtYXQoXCJ5eXl5LU1NLWRkIEhIOm1tOnNcIil9XG4qL1xuXG5gXG4gIGlmIChyZWcudGVzdChjb250ZW50KSkge1xuICAgIHJldHVybiBjb250ZW50cy5yZXBsYWNlKHJlZywgYCR7ZmlsZUhlYWRlcn1gKVxuICB9XG4gIHJldHVybiBmaWxlSGVhZGVyICsgY29udGVudFxufVxuXG4vLyDmm7TmjaLnu4Tlu7rlkI3np7Bcbi8vIOabtOaNoiBjc3Mg6Lev5b6EIOWFiOaJvuWIsCBzcmNcbi8vIOabtOaNoiBBdXRob3IgTmFtZVxuZXhwb3J0IGNvbnN0IHJlcGxpY2F0ZSA9IGFzeW5jIChvcmlnaW5hbFBhdGgsIGFuc3dlcnMsIHdvcmtpbmdEaXIgPSBwcm9jZXNzLmN3ZCgpKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3JpZ2luYWxOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShvcmlnaW5hbFBhdGgpXG4gICAgY29uc3QgYWJzb2x1dGVQYXRoID0gaXNBYnNvbHV0ZShvcmlnaW5hbFBhdGgpID8gb3JpZ2luYWxQYXRoIDogam9pbih3b3JraW5nRGlyLCBvcmlnaW5hbFBhdGgpXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIGlmIChpc1NpbmdsZUZpbGUob3JpZ2luYWxQYXRoKSkge1xuICAgICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkaXJuYW1lKGFic29sdXRlUGF0aCksIG9yaWdpbmFsTmFtZSlcbiAgICAgIGZpbGVzLmZvckVhY2goYXN5bmMgZmlsZSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYmFzZW5hbWUoZmlsZSkucmVwbGFjZShvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSlcbiAgICAgICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gam9pbih3b3JraW5nRGlyLCBhbnN3ZXJzLmZvbGRlciwgZmlsZW5hbWUpXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBjb3B5KGZpbGUsIGRlc3RpbmF0aW9uUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZGVzdGluYXRpb25QYXRoKS50b1N0cmluZygpXG4gICAgICAgICAgd3JpdGVGaWxlU3luYyhkZXN0aW5hdGlvblBhdGgsIHJlcGxhY2VDb250ZW50cyhjb250ZW50cywgb3JpZ2luYWxOYW1lLCBhbnN3ZXJzLm5hbWUpKVxuICAgICAgICB9KVxuICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZXN0aW5hdGlvblBhdGggPSBqb2luKHdvcmtpbmdEaXIsIGFuc3dlcnMuZm9sZGVyLCBhbnN3ZXJzLm5hbWUpXG4gICAgICBhd2FpdCBjb3B5KGRpcm5hbWUoYWJzb2x1dGVQYXRoKSwgZGVzdGluYXRpb25QYXRoKVxuICAgICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkZXN0aW5hdGlvblBhdGgpXG4gICAgICBmaWxlcy5mb3JFYWNoKGFzeW5jIGZpbGUgPT4ge1xuICAgICAgICBsZXQgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZmlsZSkudG9TdHJpbmcoKVxuICAgICAgICBsZXQgbmFtZSA9IGFuc3dlcnMubmFtZVxuICAgICAgICAvLyDmm7/mjaLmlofku7blhoXlrrnmraPliJlcbiAgICAgICAgbGV0IHJlcGxhY2VDb250ZW50c0Z1bmMgPSB1bmRlZmluZWRcbiAgICAgICAgLy8g5aaC5p6c5pivY3Nz5paH5Lu2IOWImeabtOaNoiBsZXNzIOW8leWFpSDlpoLmnpzmmK9sZXNz5paH5Lu2IOWImeaWsOWRveWQjeS4uuWwj+WGmSDlsIbph4zpnaLnmoTlpKflsI/lhpnlhoXlrrnlhajmm7/mjaLlsI/lhplcbiAgICAgICAgaWYgKGZpbGUuaW5kZXhPZihcIi5sZXNzXCIpID4gLTEpIHtcbiAgICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgcmVwbGFjZUNvbnRlbnRzRnVuYyA9IHJlcGxhY2VDb250ZW50c0hhc0xvd2VyQ2FzZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGZpbmQgfSA9IG5ldyBGaW5kRmlsZSgpXG4gICAgICAgICAgICBjb25zdCBmaW5kUGF0aCA9IHByb2Nlc3MuY3dkKCkuc3BsaXQoXCIvc3JjXCIpWzBdXG4gICAgICAgICAgICAvLyDmn6Xmib5jb21tb27mlofku7blpLnot6/lvoRcbiAgICAgICAgICAgIGNvbnN0IGRlZkxlc3NQYXRoID0gYXdhaXQgZmluZChmaW5kUGF0aCwgXCJkZWYubGVzc1wiKVxuICAgICAgICAgICAgaWYgKGRlZkxlc3NQYXRoKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlZkxlc3NQYXRoLCBcImRlZkxlc3NQYXRoXCIpXG4gICAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHJlc29sdmUoZmlsZSwgXCIuLi9cIiksIGRlZkxlc3NQYXRoKVxuICAgICAgICAgICAgICBjb250ZW50cyA9IHJlcGxhY2VMZXNzSW1wb3J0KGNvbnRlbnRzLCByZWxhdGl2ZVBhdGgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVkKGBbRmluZEZpbGVdIGZpbmQgZGVmLmxlc3MgZXJyb3IgOiAke2V9YClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVwbGFjZUNvbnRlbnRzRnVuYyA9IHJlcGxhY2VDb250ZW50c1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlbmFtZWRQYXRoID0gam9pbihkaXJuYW1lKGZpbGUpLCBiYXNlbmFtZShmaWxlKS5yZXBsYWNlKG9yaWdpbmFsTmFtZSwgbmFtZSkpXG4gICAgICAgIGNvbnN0IG5leHRDb250ZW50ID0gcmVwbGFjZUNvbnRlbnRzRnVuYyhjb250ZW50cywgb3JpZ2luYWxOYW1lLCBuYW1lKVxuICAgICAgICB3cml0ZUZpbGVTeW5jKGZpbGUsIGFkZEZpbGVIZWFkZXIobmV4dENvbnRlbnQpKVxuICAgICAgICBpZiAoZmlsZSAhPT0gcmVuYW1lZFBhdGgpIHtcbiAgICAgICAgICBjb25zdCBwcm9taXNlID0gbW92ZShmaWxlLCByZW5hbWVkUGF0aClcbiAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmVkKGBbcmVwbGljYXRlXSBlcnJvcjogJHtlLm1lc3NhZ2V9YClcbiAgfVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuKGFycikge1xuICB2YXIgcmVzID0gW11cbiAgYXJyLm1hcChpdGVtID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgcmVzID0gcmVzLmNvbmNhdChmbGF0dGVuKGl0ZW0pKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMucHVzaChpdGVtKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgeyBmbGF0dGVuIH1cbiJdfQ==