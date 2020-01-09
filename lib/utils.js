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

            if (defLessPath) {
              var relativePath = (0, _path.relative)((0, _path.resolve)(file, '../'), defLessPath);
              contents = replaceLessImport(contents, relativePath);
            }
          }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJyZW1vdmVFeHQiLCJwYXRoIiwicmVwbGFjZSIsImdldENvbXBvbmVudE5hbWUiLCJzcGxpdCIsInJlZHVjZSIsIm5hbWUiLCJwYXJ0IiwidGVzdCIsImdldENvbXBvbmVudEZvbGRlciIsImZvbGRlciIsImlzU2luZ2xlRmlsZSIsImRpciIsInJldmVyc2UiLCJnZXRGaWxlcyIsImN3ZCIsImNvbXBvbmVudE5hbWUiLCJleHRlbnNpb25zIiwicGF0dGVybiIsImdsb2IiLCJzeW5jIiwiYWJzb2x1dGUiLCJub2RpciIsImdldENvbXBvbmVudEZpbGVzIiwicm9vdCIsIndvcmtpbmdEaXIiLCJwcm9jZXNzIiwidGhlbiIsImZpbGVzIiwibWFwIiwiYWJzb2x1dGVQYXRoIiwicmVsYXRpdmVQYXRoIiwic2hvcnQiLCJ2YWx1ZSIsInJlcGxhY2VDb250ZW50cyIsImNvbnRlbnRzIiwib2xkTmFtZSIsIm5ld05hbWUiLCJSZWdFeHAiLCJyZXBsYWNlTGVzc0ltcG9ydCIsIm5ld0NvbnRlbnQiLCJyZXBsaWNhdGUiLCJvcmlnaW5hbFBhdGgiLCJhbnN3ZXJzIiwib3JpZ2luYWxOYW1lIiwicHJvbWlzZXMiLCJkZXN0aW5hdGlvblBhdGgiLCJmb3JFYWNoIiwiZmlsZSIsInRvU3RyaW5nIiwiaW5kZXhPZiIsImZpbmQiLCJGaW5kRmlsZSIsImRlZkxlc3NQYXRoIiwicmVuYW1lZFBhdGgiLCJjb25zb2xlIiwibG9nIiwicHJvbWlzZSIsInB1c2giLCJQcm9taXNlIiwiYWxsIiwiZmxhdHRlbiIsImFyciIsInJlcyIsIml0ZW0iLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHQyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsT0FBTCxDQUFhLFVBQWIsRUFBeUIsRUFBekIsQ0FBMUI7O0FBRU8sSUFBTUMsZ0JBQWdCLEdBQUdGLElBQUksSUFDbENBLElBQUksQ0FBQ0csS0FBTCxDQUFXLEdBQVgsRUFBZ0JDLE1BQWhCLENBQXVCLENBQUNDLElBQUQsRUFBT0MsSUFBUCxLQUFnQjtBQUNyQyxNQUFJLFNBQVNDLElBQVQsQ0FBY0QsSUFBZCxDQUFKLEVBQXlCO0FBQ3ZCLFdBQU9QLFNBQVMsQ0FBQ08sSUFBRCxDQUFoQjtBQUNELEdBRkQsTUFFTyxJQUFJLHlCQUF5QkMsSUFBekIsQ0FBOEJELElBQTlCLENBQUosRUFBeUM7QUFDOUMsV0FBTyx3QkFBVyx1QkFBVVAsU0FBUyxDQUFDTyxJQUFELENBQW5CLENBQVgsQ0FBUDtBQUNEOztBQUNELFNBQU9ELElBQVA7QUFDRCxDQVBELEVBT0csRUFQSCxDQURLOzs7O0FBVUEsSUFBTUcsa0JBQWtCLEdBQUdSLElBQUksSUFBSTtBQUN4QyxNQUFNSyxJQUFJLEdBQUdILGdCQUFnQixDQUFDRixJQUFELENBQTdCO0FBQ0EsU0FBTyxtQkFBUUEsSUFBUixFQUFjRyxLQUFkLENBQW9CLEdBQXBCLEVBQXlCQyxNQUF6QixDQUFnQyxDQUFDSyxNQUFELEVBQVNILElBQVQsS0FBa0I7QUFDdkQsUUFBSVAsU0FBUyxDQUFDTyxJQUFELENBQVQsS0FBb0JELElBQXhCLEVBQThCO0FBQzVCLGFBQU9JLE1BQVA7QUFDRDs7QUFDRCxXQUFPLGdCQUFLQSxNQUFMLEVBQWFILElBQWIsQ0FBUDtBQUNELEdBTE0sRUFLSixJQUxJLENBQVA7QUFNRCxDQVJNOzs7O0FBVUEsSUFBTUksWUFBWSxHQUFHVixJQUFJLElBQUk7QUFDbEMsTUFBTUssSUFBSSxHQUFHSCxnQkFBZ0IsQ0FBQ0YsSUFBRCxDQUE3QjtBQUNBLE1BQU0sQ0FBRVcsR0FBRixJQUFVLG1CQUFRWCxJQUFSLEVBQWNHLEtBQWQsQ0FBb0IsR0FBcEIsRUFBeUJTLE9BQXpCLEVBQWhCO0FBQ0EsU0FBT0QsR0FBRyxLQUFLTixJQUFmO0FBQ0QsQ0FKTTs7OztBQU1BLElBQU1RLFFBQVEsR0FBRyxDQUFDQyxHQUFELEVBQU1DLGFBQU4sS0FBd0I7QUFDOUMsTUFBTUMsVUFBVSxHQUFHLG9EQUFuQjtBQUNBLE1BQU1DLE9BQU8sR0FBR0YsYUFBYSxnQkFBU0EsYUFBVCxvQkFBZ0NDLFVBQWhDLG1CQUF1REEsVUFBdkQsQ0FBN0I7QUFDQSxTQUFPRSxjQUFLQyxJQUFMLENBQVVGLE9BQVYsRUFBbUI7QUFBRUgsSUFBQUEsR0FBRjtBQUFPTSxJQUFBQSxRQUFRLEVBQUUsSUFBakI7QUFBdUJDLElBQUFBLEtBQUssRUFBRTtBQUE5QixHQUFuQixDQUFQO0FBQ0QsQ0FKTTs7OztBQU1BLElBQU1DLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBb0IsQ0FBQ0MsSUFBRDtBQUFBLE1BQU9DLFVBQVAsdUVBQW9CQyxPQUFPLENBQUNYLEdBQVIsRUFBcEI7QUFBQSxTQUMvQiw2QkFBZVMsSUFBZixFQUFxQkcsSUFBckIsQ0FBMEJDLEtBQUssSUFDN0JBLEtBQUssQ0FBQ0MsR0FBTixDQUFVNUIsSUFBSSxJQUFJO0FBQ2hCLFFBQU1LLElBQUksR0FBR0gsZ0JBQWdCLENBQUNGLElBQUQsQ0FBN0I7QUFFQSxRQUFNNkIsWUFBWSxHQUFHLGdCQUFLTixJQUFMLEVBQVd2QixJQUFYLENBQXJCO0FBQ0EsUUFBTThCLFlBQVksR0FBRyxvQkFBU04sVUFBVCxFQUFxQkssWUFBckIsQ0FBckI7QUFDQSxXQUFPO0FBQ0x4QixNQUFBQSxJQUFJLFlBQUtBLElBQUwsY0FBYSxpQkFBS3lCLFlBQUwsQ0FBYixDQURDO0FBRUxDLE1BQUFBLEtBQUssRUFBRTFCLElBRkY7QUFHTDJCLE1BQUFBLEtBQUssRUFBRUg7QUFIRixLQUFQO0FBS0QsR0FWRCxDQURGLENBRCtCO0FBQUEsQ0FBMUI7Ozs7QUFlQSxJQUFNSSxlQUFlLEdBQUcsQ0FBQ0MsUUFBRCxFQUFXQyxPQUFYLEVBQW9CQyxPQUFwQixLQUM3QkYsUUFBUSxDQUFDakMsT0FBVCxDQUNFLElBQUlvQyxNQUFKLDJCQUNxQkYsT0FEckIsaUVBQ2tGQSxPQURsRix3QkFFRSxHQUZGLENBREYsZ0JBS1NDLE9BTFQsVUFESzs7OztBQVVBLElBQU1FLGlCQUFpQixHQUFHLENBQUNKLFFBQUQsRUFBVUssVUFBVixLQUMvQkwsUUFBUSxDQUFDakMsT0FBVCxDQUNFLElBQUlvQyxNQUFKLENBQVcsd0JBQVgsQ0FERixzQkFFY0UsVUFGZCxTQURLLEMsQ0FNUDtBQUNBO0FBQ0E7Ozs7O0FBQ08sSUFBTUMsU0FBUztBQUFBO0FBQUE7QUFBQSwrQkFBRyxXQUFPQyxZQUFQLEVBQXFCQyxPQUFyQixFQUE2RDtBQUFBLFFBQS9CbEIsVUFBK0IsdUVBQWxCQyxPQUFPLENBQUNYLEdBQVIsRUFBa0I7QUFDcEYsUUFBTTZCLFlBQVksR0FBR3pDLGdCQUFnQixDQUFDdUMsWUFBRCxDQUFyQztBQUNBLFFBQU1aLFlBQVksR0FBRyxzQkFBV1ksWUFBWCxJQUEyQkEsWUFBM0IsR0FBMEMsZ0JBQUtqQixVQUFMLEVBQWlCaUIsWUFBakIsQ0FBL0Q7QUFDQSxRQUFNRyxRQUFRLEdBQUcsRUFBakI7O0FBQ0EsUUFBSWxDLFlBQVksQ0FBQytCLFlBQUQsQ0FBaEIsRUFBZ0MsQ0FDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxLQVhELE1BV087QUFDTCxVQUFNSSxlQUFlLEdBQUcsZ0JBQUtyQixVQUFMLEVBQWlCa0IsT0FBTyxDQUFDakMsTUFBekIsRUFBaUNpQyxPQUFPLENBQUNyQyxJQUF6QyxDQUF4QjtBQUNBLFlBQU0sbUJBQUssbUJBQVF3QixZQUFSLENBQUwsRUFBNEJnQixlQUE1QixDQUFOO0FBQ0EsVUFBTWxCLEtBQUssR0FBR2QsUUFBUSxDQUFDZ0MsZUFBRCxDQUF0QjtBQUNBbEIsTUFBQUEsS0FBSyxDQUFDbUIsT0FBTjtBQUFBO0FBQUE7QUFBQSxzQ0FBYyxXQUFNQyxJQUFOLEVBQWM7QUFDMUIsY0FBSWIsUUFBUSxHQUFHLDJCQUFhYSxJQUFiLEVBQW1CQyxRQUFuQixFQUFmLENBRDBCLENBRTFCOztBQUNBLGNBQUlkLFFBQVEsQ0FBQ2UsT0FBVCxDQUFpQixTQUFqQixJQUE4QixDQUFDLENBQW5DLEVBQXNDO0FBQ3BDLGdCQUFNO0FBQUVDLGNBQUFBO0FBQUYsZ0JBQVcsSUFBSUMsY0FBSixFQUFqQjtBQUNBLGdCQUFNQyxXQUFXLFNBQVNGLElBQUksQ0FBQ3pCLE9BQU8sQ0FBQ1gsR0FBUixFQUFELEVBQWdCLFVBQWhCLENBQTlCOztBQUNBLGdCQUFHc0MsV0FBSCxFQUFlO0FBQ2Isa0JBQU10QixZQUFZLEdBQUcsb0JBQVMsbUJBQVFpQixJQUFSLEVBQWEsS0FBYixDQUFULEVBQThCSyxXQUE5QixDQUFyQjtBQUNBbEIsY0FBQUEsUUFBUSxHQUFHSSxpQkFBaUIsQ0FBQ0osUUFBRCxFQUFVSixZQUFWLENBQTVCO0FBQ0Q7QUFDRjs7QUFDRCxjQUFNdUIsV0FBVyxHQUFHLGdCQUFLLG1CQUFRTixJQUFSLENBQUwsRUFBb0Isb0JBQVNBLElBQVQsRUFBZTlDLE9BQWYsQ0FBdUIwQyxZQUF2QixFQUFxQ0QsT0FBTyxDQUFDckMsSUFBN0MsQ0FBcEIsQ0FBcEI7QUFDQSxzQ0FBYzBDLElBQWQsRUFBb0JkLGVBQWUsQ0FBQ0MsUUFBRCxFQUFXUyxZQUFYLEVBQXlCRCxPQUFPLENBQUNyQyxJQUFqQyxDQUFuQzs7QUFDQSxjQUFHMEMsSUFBSSxLQUFLTSxXQUFaLEVBQXdCO0FBQ3RCQyxZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWVIsSUFBWixFQUFpQixNQUFqQjtBQUNBTyxZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsV0FBWixFQUF3QixhQUF4QjtBQUVBLGdCQUFNRyxPQUFPLEdBQUcsbUJBQUtULElBQUwsRUFBV00sV0FBWCxDQUFoQjtBQUNBVCxZQUFBQSxRQUFRLENBQUNhLElBQVQsQ0FBY0QsT0FBZDtBQUNEO0FBQ0YsU0FwQkQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFxQkQ7O0FBQ0QsVUFBTUUsT0FBTyxDQUFDQyxHQUFSLENBQVlmLFFBQVosQ0FBTjtBQUNELEdBMUNxQjs7QUFBQSxrQkFBVEosU0FBUztBQUFBO0FBQUE7QUFBQSxHQUFmOzs7O0FBNENQLFNBQVNvQixPQUFULENBQWlCQyxHQUFqQixFQUFzQjtBQUNwQixNQUFJQyxHQUFHLEdBQUcsRUFBVjtBQUNBRCxFQUFBQSxHQUFHLENBQUNqQyxHQUFKLENBQVFtQyxJQUFJLElBQUk7QUFDZCxRQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsSUFBZCxDQUFKLEVBQXlCO0FBQ3ZCRCxNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ0ksTUFBSixDQUFXTixPQUFPLENBQUNHLElBQUQsQ0FBbEIsQ0FBTjtBQUNELEtBRkQsTUFFTztBQUNMRCxNQUFBQSxHQUFHLENBQUNMLElBQUosQ0FBU00sSUFBVDtBQUNEO0FBQ0YsR0FORDtBQU9BLFNBQU9ELEdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBpc0Fic29sdXRlLCBqb2luLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCB7IGNhbWVsQ2FzZSwgdXBwZXJGaXJzdCB9IGZyb20gXCJsb2Rhc2hcIlxuaW1wb3J0IHsgZ3JheSB9IGZyb20gXCJjaGFsa1wiXG5pbXBvcnQgZ2xvYiBmcm9tIFwiZ2xvYlwiXG5pbXBvcnQgbGlzdFJlYWN0RmlsZXMgZnJvbSBcImxpc3QtcmVhY3QtZmlsZXNcIlxuaW1wb3J0IHsgY29weSwgbW92ZSwgcmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSBcImZzLWV4dHJhXCJcbmltcG9ydCB7IEZpbmRGaWxlIH0gZnJvbSBcIi4vZmlsZVwiXG5cbmNvbnN0IHJlbW92ZUV4dCA9IHBhdGggPT4gcGF0aC5yZXBsYWNlKC9cXC5bXi5dKyQvLCBcIlwiKVxuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9uZW50TmFtZSA9IHBhdGggPT5cbiAgcGF0aC5zcGxpdChcIi9cIikucmVkdWNlKChuYW1lLCBwYXJ0KSA9PiB7XG4gICAgaWYgKC9eW0EtWl0vLnRlc3QocGFydCkpIHtcbiAgICAgIHJldHVybiByZW1vdmVFeHQocGFydClcbiAgICB9IGVsc2UgaWYgKC9eKCg/IWluZGV4KS4rKVxcLlteLl0rJC8udGVzdChwYXJ0KSkge1xuICAgICAgcmV0dXJuIHVwcGVyRmlyc3QoY2FtZWxDYXNlKHJlbW92ZUV4dChwYXJ0KSkpXG4gICAgfVxuICAgIHJldHVybiBuYW1lXG4gIH0sIFwiXCIpXG5cbmV4cG9ydCBjb25zdCBnZXRDb21wb25lbnRGb2xkZXIgPSBwYXRoID0+IHtcbiAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUocGF0aClcbiAgcmV0dXJuIGRpcm5hbWUocGF0aCkuc3BsaXQoXCIvXCIpLnJlZHVjZSgoZm9sZGVyLCBwYXJ0KSA9PiB7XG4gICAgaWYgKHJlbW92ZUV4dChwYXJ0KSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIGZvbGRlclxuICAgIH1cbiAgICByZXR1cm4gam9pbihmb2xkZXIsIHBhcnQpXG4gIH0sIFwiLi9cIilcbn1cblxuZXhwb3J0IGNvbnN0IGlzU2luZ2xlRmlsZSA9IHBhdGggPT4ge1xuICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuICBjb25zdCBbIGRpciBdID0gZGlybmFtZShwYXRoKS5zcGxpdChcIi9cIikucmV2ZXJzZSgpXG4gIHJldHVybiBkaXIgIT09IG5hbWVcbn1cblxuZXhwb3J0IGNvbnN0IGdldEZpbGVzID0gKGN3ZCwgY29tcG9uZW50TmFtZSkgPT4ge1xuICBjb25zdCBleHRlbnNpb25zID0gXCJ7anMsdHMsanN4LHRzeCxjc3MsbGVzcyxzY3NzLHNhc3Msc3NzLGpzb24sbWQsbWR4fVwiXG4gIGNvbnN0IHBhdHRlcm4gPSBjb21wb25lbnROYW1lID8gYCoqLyR7Y29tcG9uZW50TmFtZX17LiwuKi59JHtleHRlbnNpb25zfWAgOiBgKiovKi4ke2V4dGVuc2lvbnN9YFxuICByZXR1cm4gZ2xvYi5zeW5jKHBhdHRlcm4sIHsgY3dkLCBhYnNvbHV0ZTogdHJ1ZSwgbm9kaXI6IHRydWUgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGdldENvbXBvbmVudEZpbGVzID0gKHJvb3QsIHdvcmtpbmdEaXIgPSBwcm9jZXNzLmN3ZCgpKSA9PlxuICBsaXN0UmVhY3RGaWxlcyhyb290KS50aGVuKGZpbGVzID0+XG4gICAgZmlsZXMubWFwKHBhdGggPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUocGF0aClcblxuICAgICAgY29uc3QgYWJzb2x1dGVQYXRoID0gam9pbihyb290LCBwYXRoKVxuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUod29ya2luZ0RpciwgYWJzb2x1dGVQYXRoKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYCR7bmFtZX0gJHtncmF5KHJlbGF0aXZlUGF0aCl9YCxcbiAgICAgICAgc2hvcnQ6IG5hbWUsXG4gICAgICAgIHZhbHVlOiBhYnNvbHV0ZVBhdGgsXG4gICAgICB9XG4gICAgfSlcbiAgKVxuXG5leHBvcnQgY29uc3QgcmVwbGFjZUNvbnRlbnRzID0gKGNvbnRlbnRzLCBvbGROYW1lLCBuZXdOYW1lKSA9PlxuICBjb250ZW50cy5yZXBsYWNlKFxuICAgIG5ldyBSZWdFeHAoXG4gICAgICBgKFteYS16QS1aMC05XyRdKSR7b2xkTmFtZX0oW15hLXpBLVowLTlfJF18Q29udGFpbmVyKXwoWyd8XCJdLi9bYS16QS1aMC05XyRdKj8pJHtvbGROYW1lfShbYS16QS1aMC05XyRdKj8pYCxcbiAgICAgIFwiZ1wiXG4gICAgKSxcbiAgICBgJDEkMyR7bmV3TmFtZX0kMiQ0YFxuICApXG5cblxuZXhwb3J0IGNvbnN0IHJlcGxhY2VMZXNzSW1wb3J0ID0gKGNvbnRlbnRzLG5ld0NvbnRlbnQpID0+XG4gIGNvbnRlbnRzLnJlcGxhY2UoXG4gICAgbmV3IFJlZ0V4cCgvQGltcG9ydFxccytcIlsuL1xcLVxcd10rXCI7LyksXG4gICAgYEBpbXBvcnQgXCIke25ld0NvbnRlbnR9XCI7YFxuICApXG5cbi8vIOabtOaNoue7hOW7uuWQjeensFxuLy8g5pu05o2iIGNzcyDot6/lvoQg5YWI5om+5YiwIHNyY1xuLy8g5pu05o2iIEF1dGhvciBOYW1lXG5leHBvcnQgY29uc3QgcmVwbGljYXRlID0gYXN5bmMgKG9yaWdpbmFsUGF0aCwgYW5zd2Vycywgd29ya2luZ0RpciA9IHByb2Nlc3MuY3dkKCkpID0+IHtcbiAgY29uc3Qgb3JpZ2luYWxOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShvcmlnaW5hbFBhdGgpXG4gIGNvbnN0IGFic29sdXRlUGF0aCA9IGlzQWJzb2x1dGUob3JpZ2luYWxQYXRoKSA/IG9yaWdpbmFsUGF0aCA6IGpvaW4od29ya2luZ0Rpciwgb3JpZ2luYWxQYXRoKVxuICBjb25zdCBwcm9taXNlcyA9IFtdXG4gIGlmIChpc1NpbmdsZUZpbGUob3JpZ2luYWxQYXRoKSkge1xuICAgIC8vICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkaXJuYW1lKGFic29sdXRlUGF0aCksIG9yaWdpbmFsTmFtZSlcbiAgICAvLyAgIGZpbGVzLmZvckVhY2goYXN5bmMgZmlsZSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IGZpbGVuYW1lID0gYmFzZW5hbWUoZmlsZSkucmVwbGFjZShvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSlcbiAgICAvLyAgICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gam9pbih3b3JraW5nRGlyLCBhbnN3ZXJzLmZvbGRlciwgZmlsZW5hbWUpXG4gICAgLy8gICAgIGNvbnN0IHByb21pc2UgPSBjb3B5KGZpbGUsIGRlc3RpbmF0aW9uUGF0aCkudGhlbigoKSA9PiB7XG4gICAgLy8gICAgICAgY29uc3QgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZGVzdGluYXRpb25QYXRoKS50b1N0cmluZygpXG4gICAgLy8gICAgICAgd3JpdGVGaWxlU3luYyhkZXN0aW5hdGlvblBhdGgsIHJlcGxhY2VDb250ZW50cyhjb250ZW50cywgb3JpZ2luYWxOYW1lLCBhbnN3ZXJzLm5hbWUpKVxuICAgIC8vICAgICB9KVxuICAgIC8vICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXG4gICAgLy8gICB9KVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uUGF0aCA9IGpvaW4od29ya2luZ0RpciwgYW5zd2Vycy5mb2xkZXIsIGFuc3dlcnMubmFtZSlcbiAgICBhd2FpdCBjb3B5KGRpcm5hbWUoYWJzb2x1dGVQYXRoKSwgZGVzdGluYXRpb25QYXRoKVxuICAgIGNvbnN0IGZpbGVzID0gZ2V0RmlsZXMoZGVzdGluYXRpb25QYXRoKVxuICAgIGZpbGVzLmZvckVhY2goYXN5bmMgZmlsZSA9PiB7XG4gICAgICBsZXQgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZmlsZSkudG9TdHJpbmcoKVxuICAgICAgLy8g5aaC5p6c5pivY3Nz5paH5Lu2IOWImeabtOaNoiBsZXNzIOW8leWFpVxuICAgICAgaWYgKGNvbnRlbnRzLmluZGV4T2YoXCJAaW1wb3J0XCIpID4gLTEpIHtcbiAgICAgICAgY29uc3QgeyBmaW5kIH0gPSBuZXcgRmluZEZpbGUoKVxuICAgICAgICBjb25zdCBkZWZMZXNzUGF0aCA9IGF3YWl0IGZpbmQocHJvY2Vzcy5jd2QoKSwgXCJkZWYubGVzc1wiKVxuICAgICAgICBpZihkZWZMZXNzUGF0aCl7XG4gICAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUocmVzb2x2ZShmaWxlLCcuLi8nKSwgZGVmTGVzc1BhdGgpXG4gICAgICAgICAgY29udGVudHMgPSByZXBsYWNlTGVzc0ltcG9ydChjb250ZW50cyxyZWxhdGl2ZVBhdGgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlbmFtZWRQYXRoID0gam9pbihkaXJuYW1lKGZpbGUpLCBiYXNlbmFtZShmaWxlKS5yZXBsYWNlKG9yaWdpbmFsTmFtZSwgYW5zd2Vycy5uYW1lKSlcbiAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZSwgcmVwbGFjZUNvbnRlbnRzKGNvbnRlbnRzLCBvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSkpXG4gICAgICBpZihmaWxlICE9PSByZW5hbWVkUGF0aCl7XG4gICAgICAgIGNvbnNvbGUubG9nKGZpbGUsJ2ZpbGUnKVxuICAgICAgICBjb25zb2xlLmxvZyhyZW5hbWVkUGF0aCwncmVuYW1lZFBhdGgnKVxuXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBtb3ZlKGZpbGUsIHJlbmFtZWRQYXRoKVxuICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbn1cblxuZnVuY3Rpb24gZmxhdHRlbihhcnIpIHtcbiAgdmFyIHJlcyA9IFtdXG4gIGFyci5tYXAoaXRlbSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJlcyA9IHJlcy5jb25jYXQoZmxhdHRlbihpdGVtKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnB1c2goaXRlbSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiByZXNcbn1cblxuZXhwb3J0IHsgZmxhdHRlbiB9XG4iXX0=