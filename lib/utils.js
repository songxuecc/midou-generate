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

    if (isSingleFile(originalPath)) {//   const files = getFiles(dirname(absolutePath), originalName)
      //   files.forEach(async file => {
      //     const filename = basename(file).replace(originalName, answers.name)
      //     const destinationPath = join(workingDir, answers.folder, filename)
      //     const promise = copy(file, destinationPath).then(() => {
      //       const contents = readFileSync(destinationPath).toString()
      //       writeFileSync(destinationPath, replaceContents(contents, originalName, answers.name))
      //     })
      //     promises.push(promise)
      //   })
    } else {
      var destinationPath = (0, _path.join)(workingDir, answers.folder, answers.name);
      yield (0, _fsExtra.copy)((0, _path.dirname)(absolutePath), destinationPath);
      var files = getFiles(destinationPath);
      files.forEach(
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(function* (file) {
          var contents = (0, _fsExtra.readFileSync)(file).toString(); // 如果是css文件 则更换 less 引入

          if (contents.indexOf("@import") > -1) {
            var {
              find
            } = new _file.FindFile();
            var defLessPath = yield find(process.cwd(), "def.less");
            var relativePath = (0, _path.relative)((0, _path.resolve)(file, '../'), defLessPath);
            contents = replaceLessImport(contents, relativePath);
          } // const renamedPath = join(dirname(file), basename(file).replace(originalName, 'answers.name'))


          var renamedPath = (0, _path.join)((0, _path.dirname)(file), (0, _path.basename)(file).replace(originalName, answers.name));
          (0, _fsExtra.writeFileSync)(file, replaceContents(contents, originalName, answers.name));

          if (file !== renamedPath) {
            console.log(file, 'file');
            console.log(renamedPath, 'renamedPath');
            var promise = (0, _fsExtra.move)(file, renamedPath);
            promises.push(promise);
          }
        });

        return function (_x3) {
          return _ref2.apply(this, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJyZW1vdmVFeHQiLCJwYXRoIiwicmVwbGFjZSIsImdldENvbXBvbmVudE5hbWUiLCJzcGxpdCIsInJlZHVjZSIsIm5hbWUiLCJwYXJ0IiwidGVzdCIsImdldENvbXBvbmVudEZvbGRlciIsImZvbGRlciIsImlzU2luZ2xlRmlsZSIsImRpciIsInJldmVyc2UiLCJnZXRGaWxlcyIsImN3ZCIsImNvbXBvbmVudE5hbWUiLCJleHRlbnNpb25zIiwicGF0dGVybiIsImdsb2IiLCJzeW5jIiwiYWJzb2x1dGUiLCJub2RpciIsImdldENvbXBvbmVudEZpbGVzIiwicm9vdCIsIndvcmtpbmdEaXIiLCJwcm9jZXNzIiwidGhlbiIsImZpbGVzIiwibWFwIiwiYWJzb2x1dGVQYXRoIiwicmVsYXRpdmVQYXRoIiwic2hvcnQiLCJ2YWx1ZSIsInJlcGxhY2VDb250ZW50cyIsImNvbnRlbnRzIiwib2xkTmFtZSIsIm5ld05hbWUiLCJSZWdFeHAiLCJyZXBsYWNlTGVzc0ltcG9ydCIsIm5ld0NvbnRlbnQiLCJyZXBsaWNhdGUiLCJvcmlnaW5hbFBhdGgiLCJhbnN3ZXJzIiwib3JpZ2luYWxOYW1lIiwicHJvbWlzZXMiLCJkZXN0aW5hdGlvblBhdGgiLCJmb3JFYWNoIiwiZmlsZSIsInRvU3RyaW5nIiwiaW5kZXhPZiIsImZpbmQiLCJGaW5kRmlsZSIsImRlZkxlc3NQYXRoIiwicmVuYW1lZFBhdGgiLCJjb25zb2xlIiwibG9nIiwicHJvbWlzZSIsInB1c2giLCJQcm9taXNlIiwiYWxsIiwiZmxhdHRlbiIsImFyciIsInJlcyIsIml0ZW0iLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHQyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsT0FBTCxDQUFhLFVBQWIsRUFBeUIs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Ozs7QUEyQ1AsU0FBU29CLE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXNCO0FBQ3BCLE1BQUlDLEdBQUcsR0FBRyxFQUFWO0FBQ0FELEVBQUFBLEdBQUcsQ0FBQ2pDLEdBQUosQ0FBUW1DLElBQUksSUFBSTtBQUNkLFFBQUlDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixJQUFkLENBQUosRUFBeUI7QUFDdkJELE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDSSxNQUFKLENBQVdOLE9BQU8sQ0FBQ0csSUFBRCxDQUFsQixDQUFOO0FBQ0QsS0FGRCxNQUVPO0FBQ0xELE1BQUFBLEdBQUcsQ0FBQ0wsSUFBSixDQUFTTSxJQUFUO0FBQ0Q7QUFDRixHQU5EO0FBT0EsU0FBT0QsR0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYmFzZW5hbWUsIGRpcm5hbWUsIGlzQWJzb2x1dGUsIGpvaW4sIHJlbGF0aXZlLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgY2FtZWxDYXNlLCB1cHBlckZpcnN0IH0gZnJvbSBcImxvZGFzaFwiXG5pbXBvcnQgeyBncmF5IH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCBnbG9iIGZyb20gXCJnbG9iXCJcbmltcG9ydCBsaXN0UmVhY3RGaWxlcyBmcm9tIFwibGlzdC1yZWFjdC1maWxlc1wiXG5pbXBvcnQgeyBjb3B5LCBtb3ZlLCByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tIFwiZnMtZXh0cmFcIlxuaW1wb3J0IHsgRmluZEZpbGUgfSBmcm9tIFwiLi9maWxlXCJcblxuY29uc3QgcmVtb3ZlRXh0ID0gcGF0aCA9PiBwYXRoLnJlcGxhY2UoL1xcLlteLl0rJC8sIFwiXCIpXG5cbmV4cG9ydCBjb25zdCBnZXRDb21wb25lbnROYW1lID0gcGF0aCA9PlxuICBwYXRoLnNwbGl0KFwiL1wiKS5yZWR1Y2UoKG5hbWUsIHBhcnQpID0+IHtcbiAgICBpZiAoL15bQS1aXS8udGVzdChwYXJ0KSkge1xuICAgICAgcmV0dXJuIHJlbW92ZUV4dChwYXJ0KVxuICAgIH0gZWxzZSBpZiAoL14oKD8haW5kZXgpLispXFwuW14uXSskLy50ZXN0KHBhcnQpKSB7XG4gICAgICByZXR1cm4gdXBwZXJGaXJzdChjYW1lbENhc2UocmVtb3ZlRXh0KHBhcnQpKSlcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVcbiAgfSwgXCJcIilcblxuZXhwb3J0IGNvbnN0IGdldENvbXBvbmVudEZvbGRlciA9IHBhdGggPT4ge1xuICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuICByZXR1cm4gZGlybmFtZShwYXRoKS5zcGxpdChcIi9cIikucmVkdWNlKChmb2xkZXIsIHBhcnQpID0+IHtcbiAgICBpZiAocmVtb3ZlRXh0KHBhcnQpID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gZm9sZGVyXG4gICAgfVxuICAgIHJldHVybiBqb2luKGZvbGRlciwgcGFydClcbiAgfSwgXCIuL1wiKVxufVxuXG5leHBvcnQgY29uc3QgaXNTaW5nbGVGaWxlID0gcGF0aCA9PiB7XG4gIGNvbnN0IG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHBhdGgpXG4gIGNvbnN0IFsgZGlyIF0gPSBkaXJuYW1lKHBhdGgpLnNwbGl0KFwiL1wiKS5yZXZlcnNlKClcbiAgcmV0dXJuIGRpciAhPT0gbmFtZVxufVxuXG5leHBvcnQgY29uc3QgZ2V0RmlsZXMgPSAoY3dkLCBjb21wb25lbnROYW1lKSA9PiB7XG4gIGNvbnN0IGV4dGVuc2lvbnMgPSBcIntqcyx0cyxqc3gsdHN4LGNzcyxsZXNzLHNjc3Msc2Fzcyxzc3MsanNvbixtZCxtZHh9XCJcbiAgY29uc3QgcGF0dGVybiA9IGNvbXBvbmVudE5hbWUgPyBgKiovJHtjb21wb25lbnROYW1lfXsuLC4qLn0ke2V4dGVuc2lvbnN9YCA6IGAqKi8qLiR7ZXh0ZW5zaW9uc31gXG4gIHJldHVybiBnbG9iLnN5bmMocGF0dGVybiwgeyBjd2QsIGFic29sdXRlOiB0cnVlLCBub2RpcjogdHJ1ZSB9KVxufVxuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9uZW50RmlsZXMgPSAocm9vdCwgd29ya2luZ0RpciA9IHByb2Nlc3MuY3dkKCkpID0+XG4gIGxpc3RSZWFjdEZpbGVzKHJvb3QpLnRoZW4oZmlsZXMgPT5cbiAgICBmaWxlcy5tYXAocGF0aCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuXG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBqb2luKHJvb3QsIHBhdGgpXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZSh3b3JraW5nRGlyLCBhYnNvbHV0ZVBhdGgpXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBgJHtuYW1lfSAke2dyYXkocmVsYXRpdmVQYXRoKX1gLFxuICAgICAgICBzaG9ydDogbmFtZSxcbiAgICAgICAgdmFsdWU6IGFic29sdXRlUGF0aCxcbiAgICAgIH1cbiAgICB9KVxuICApXG5cbmV4cG9ydCBjb25zdCByZXBsYWNlQ29udGVudHMgPSAoY29udGVudHMsIG9sZE5hbWUsIG5ld05hbWUpID0+XG4gIGNvbnRlbnRzLnJlcGxhY2UoXG4gICAgbmV3IFJlZ0V4cChcbiAgICAgIGAoW15hLXpBLVowLTlfJF0pJHtvbGROYW1lfShbXmEtekEtWjAtOV8kXXxDb250YWluZXIpfChbJ3xcIl0uL1thLXpBLVowLTlfJF0qPykke29sZE5hbWV9KFthLXpBLVowLTlfJF0qPylgLFxuICAgICAgXCJnXCJcbiAgICApLFxuICAgIGAkMSQzJHtuZXdOYW1lfSQyJDRgXG4gIClcblxuXG5leHBvcnQgY29uc3QgcmVwbGFjZUxlc3NJbXBvcnQgPSAoY29udGVudHMsbmV3Q29udGVudCkgPT5cbiAgY29udGVudHMucmVwbGFjZShcbiAgICBuZXcgUmVnRXhwKC9AaW1wb3J0XFxzK1wiWy4vXFwtXFx3XStcIjsvKSxcbiAgICBgQGltcG9ydCBcIiR7bmV3Q29udGVudH1cIjtgXG4gIClcblxuLy8g5pu05o2i57uE5bu65ZCN56ewXG4vLyDmm7TmjaIgY3NzIOi3r+W+hCDlhYjmib7liLAgc3JjXG4vLyDmm7TmjaIgQXV0aG9yIE5hbWVcbmV4cG9ydCBjb25zdCByZXBsaWNhdGUgPSBhc3luYyAob3JpZ2luYWxQYXRoLCBhbnN3ZXJzLCB3b3JraW5nRGlyID0gcHJvY2Vzcy5jd2QoKSkgPT4ge1xuICBjb25zdCBvcmlnaW5hbE5hbWUgPSBnZXRDb21wb25lbnROYW1lKG9yaWdpbmFsUGF0aClcbiAgY29uc3QgYWJzb2x1dGVQYXRoID0gaXNBYnNvbHV0ZShvcmlnaW5hbFBhdGgpID8gb3JpZ2luYWxQYXRoIDogam9pbih3b3JraW5nRGlyLCBvcmlnaW5hbFBhdGgpXG4gIGNvbnN0IHByb21pc2VzID0gW11cbiAgaWYgKGlzU2luZ2xlRmlsZShvcmlnaW5hbFBhdGgpKSB7XG4gICAgLy8gICBjb25zdCBmaWxlcyA9IGdldEZpbGVzKGRpcm5hbWUoYWJzb2x1dGVQYXRoKSwgb3JpZ2luYWxOYW1lKVxuICAgIC8vICAgZmlsZXMuZm9yRWFjaChhc3luYyBmaWxlID0+IHtcbiAgICAvLyAgICAgY29uc3QgZmlsZW5hbWUgPSBiYXNlbmFtZShmaWxlKS5yZXBsYWNlKG9yaWdpbmFsTmFtZSwgYW5zd2Vycy5uYW1lKVxuICAgIC8vICAgICBjb25zdCBkZXN0aW5hdGlvblBhdGggPSBqb2luKHdvcmtpbmdEaXIsIGFuc3dlcnMuZm9sZGVyLCBmaWxlbmFtZSlcbiAgICAvLyAgICAgY29uc3QgcHJvbWlzZSA9IGNvcHkoZmlsZSwgZGVzdGluYXRpb25QYXRoKS50aGVuKCgpID0+IHtcbiAgICAvLyAgICAgICBjb25zdCBjb250ZW50cyA9IHJlYWRGaWxlU3luYyhkZXN0aW5hdGlvblBhdGgpLnRvU3RyaW5nKClcbiAgICAvLyAgICAgICB3cml0ZUZpbGVTeW5jKGRlc3RpbmF0aW9uUGF0aCwgcmVwbGFjZUNvbnRlbnRzKGNvbnRlbnRzLCBvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSkpXG4gICAgLy8gICAgIH0pXG4gICAgLy8gICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSlcbiAgICAvLyAgIH0pXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gam9pbih3b3JraW5nRGlyLCBhbnN3ZXJzLmZvbGRlciwgYW5zd2Vycy5uYW1lKVxuICAgIGF3YWl0IGNvcHkoZGlybmFtZShhYnNvbHV0ZVBhdGgpLCBkZXN0aW5hdGlvblBhdGgpXG4gICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkZXN0aW5hdGlvblBhdGgpXG4gICAgZmlsZXMuZm9yRWFjaChhc3luYyBmaWxlID0+IHtcbiAgICAgIGxldCBjb250ZW50cyA9IHJlYWRGaWxlU3luYyhmaWxlKS50b1N0cmluZygpXG4gICAgICAvLyDlpoLmnpzmmK9jc3Pmlofku7Yg5YiZ5pu05o2iIGxlc3Mg5byV5YWlXG4gICAgICBpZiAoY29udGVudHMuaW5kZXhPZihcIkBpbXBvcnRcIikgPiAtMSkge1xuICAgICAgICBjb25zdCB7IGZpbmQgfSA9IG5ldyBGaW5kRmlsZSgpXG4gICAgICAgIGNvbnN0IGRlZkxlc3NQYXRoID0gYXdhaXQgZmluZChwcm9jZXNzLmN3ZCgpLCBcImRlZi5sZXNzXCIpXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHJlc29sdmUoZmlsZSwnLi4vJyksIGRlZkxlc3NQYXRoKVxuICAgICAgICBjb250ZW50cyA9IHJlcGxhY2VMZXNzSW1wb3J0KGNvbnRlbnRzLHJlbGF0aXZlUGF0aClcbiAgICAgIH1cbiAgICAgICAgICAvLyBjb25zdCByZW5hbWVkUGF0aCA9IGpvaW4oZGlybmFtZShmaWxlKSwgYmFzZW5hbWUoZmlsZSkucmVwbGFjZShvcmlnaW5hbE5hbWUsICdhbnN3ZXJzLm5hbWUnKSlcbiAgICAgIGNvbnN0IHJlbmFtZWRQYXRoID0gam9pbihkaXJuYW1lKGZpbGUpLCBiYXNlbmFtZShmaWxlKS5yZXBsYWNlKG9yaWdpbmFsTmFtZSwgYW5zd2Vycy5uYW1lKSlcbiAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZSwgcmVwbGFjZUNvbnRlbnRzKGNvbnRlbnRzLCBvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSkpXG4gICAgICBpZihmaWxlICE9PSByZW5hbWVkUGF0aCl7XG4gICAgICAgIGNvbnNvbGUubG9nKGZpbGUsJ2ZpbGUnKVxuICAgICAgICBjb25zb2xlLmxvZyhyZW5hbWVkUGF0aCwncmVuYW1lZFBhdGgnKVxuXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBtb3ZlKGZpbGUsIHJlbmFtZWRQYXRoKVxuICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbn1cblxuZnVuY3Rpb24gZmxhdHRlbihhcnIpIHtcbiAgdmFyIHJlcyA9IFtdXG4gIGFyci5tYXAoaXRlbSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJlcyA9IHJlcy5jb25jYXQoZmxhdHRlbihpdGVtKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnB1c2goaXRlbSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiByZXNcbn1cblxuZXhwb3J0IHsgZmxhdHRlbiB9XG4iXX0=