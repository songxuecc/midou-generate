"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = flatten;
exports.replicate = exports.replaceContents = exports.getComponentFiles = exports.getFiles = exports.isSingleFile = exports.getComponentFolder = exports.getComponentName = void 0;

var _path = require("path");

var _lodash = require("lodash");

var _chalk = require("chalk");

var _glob = _interopRequireDefault(require("glob"));

var _listReactFiles = _interopRequireDefault(require("list-react-files"));

var _fsExtra = require("fs-extra");

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

      _files.forEach(file => {
        var contents = (0, _fsExtra.readFileSync)(file).toString(); // const renamedPath = join(dirname(file), basename(file).replace(originalName, 'answers.name'))

        var renamedPath = (0, _path.join)((0, _path.dirname)(file), (0, _path.basename)(file).replace(originalName, 'index'));
        (0, _fsExtra.writeFileSync)(file, replaceContents(contents, originalName, answers.name));
        var promise = (0, _fsExtra.move)(file, renamedPath);
        promises.push(promise);
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJyZW1vdmVFeHQiLCJwYXRoIiwicmVwbGFjZSIsImdldENvbXBvbmVudE5hbWUiLCJzcGxpdCIsInJlZHVjZSIsIm5hbWUiLCJwYXJ0IiwidGVzdCIsImdldENvbXBvbmVudEZvbGRlciIsImZvbGRlciIsImlzU2luZ2xlRmlsZSIsImRpciIsInJldmVyc2UiLCJnZXRGaWxlcyIsImN3ZCIsImNvbXBvbmVudE5hbWUiLCJleHRlbnNpb25zIiwicGF0dGVybiIsImdsb2IiLCJzeW5jIiwiYWJzb2x1dGUiLCJub2RpciIsImdldENvbXBvbmVudEZpbGVzIiwicm9vdCIsIndvcmtpbmdEaXIiLCJwcm9jZXNzIiwidGhlbiIsImZpbGVzIiwibWFwIiwiYWJzb2x1dGVQYXRoIiwicmVsYXRpdmVQYXRoIiwic2hvcnQiLCJ2YWx1ZSIsInJlcGxhY2VDb250ZW50cyIsImNvbnRlbnRzIiwib2xkTmFtZSIsIm5ld05hbWUiLCJSZWdFeHAiLCJyZXBsaWNhdGUiLCJvcmlnaW5hbFBhdGgiLCJhbnN3ZXJzIiwib3JpZ2luYWxOYW1lIiwicHJvbWlzZXMiLCJmb3JFYWNoIiwiZmlsZSIsImZpbGVuYW1lIiwiZGVzdGluYXRpb25QYXRoIiwicHJvbWlzZSIsInRvU3RyaW5nIiwicHVzaCIsInJlbmFtZWRQYXRoIiwiUHJvbWlzZSIsImFsbCIsImZsYXR0ZW4iLCJhcnIiLCJyZXMiLCJpdGVtIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLFNBQVMsR0FBR0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQXpCLENBQTFCOztBQUVPLElBQU1DLGdCQUFnQixHQUFHRixJQUFJLElBQ2xDQSxJQUFJLENBQUNHLEtBQUwsQ0FBVyxHQUFYLEVBQWdCQyxNQUFoQixDQUF1QixDQUFDQyxJQUFELEVBQU9DLElBQVAsS0FBZ0I7QUFDckMsTUFBSSxTQUFTQyxJQUFULENBQWNELElBQWQsQ0FBSixFQUF5QjtBQUN2QixXQUFPUCxTQUFTLENBQUNPLElBQUQsQ0FBaEI7QUFDRCxHQUZELE1BRU8sSUFBSSx5QkFBeUJDLElBQXpCLENBQThCRCxJQUE5QixDQUFKLEVBQXlDO0FBQzlDLFdBQU8sd0JBQVcsdUJBQVVQLFNBQVMsQ0FBQ08sSUFBRCxDQUFuQixDQUFYLENBQVA7QUFDRDs7QUFDRCxTQUFPRCxJQUFQO0FBQ0QsQ0FQRCxFQU9HLEVBUEgsQ0FESzs7OztBQVVBLElBQU1HLGtCQUFrQixHQUFHUixJQUFJLElBQUk7QUFDeEMsTUFBTUssSUFBSSxHQUFHSCxnQkFBZ0IsQ0FBQ0YsSUFBRCxDQUE3QjtBQUNBLFNBQU8sbUJBQVFBLElBQVIsRUFBY0csS0FBZCxDQUFvQixHQUFwQixFQUF5QkMsTUFBekIsQ0FBZ0MsQ0FBQ0ssTUFBRCxFQUFTSCxJQUFULEtBQWtCO0FBQ3ZELFFBQUlQLFNBQVMsQ0FBQ08sSUFBRCxDQUFULEtBQW9CRCxJQUF4QixFQUE4QjtBQUM1QixhQUFPSSxNQUFQO0FBQ0Q7O0FBQ0QsV0FBTyxnQkFBS0EsTUFBTCxFQUFhSCxJQUFiLENBQVA7QUFDRCxHQUxNLEVBS0osSUFMSSxDQUFQO0FBTUQsQ0FSTTs7OztBQVVBLElBQU1JLFlBQVksR0FBR1YsSUFBSSxJQUFJO0FBQ2xDLE1BQU1LLElBQUksR0FBR0gsZ0JBQWdCLENBQUNGLElBQUQsQ0FBN0I7QUFDQSxNQUFNLENBQUVXLEdBQUYsSUFBVSxtQkFBUVgsSUFBUixFQUFjRyxLQUFkLENBQW9CLEdBQXBCLEVBQXlCUyxPQUF6QixFQUFoQjtBQUVBLFNBQU9ELEdBQUcsS0FBS04sSUFBZjtBQUNELENBTE07Ozs7QUFPQSxJQUFNUSxRQUFRLEdBQUcsQ0FBQ0MsR0FBRCxFQUFNQyxhQUFOLEtBQXdCO0FBQzlDLE1BQU1DLFVBQVUsR0FBRyxvREFBbkI7QUFDQSxNQUFNQyxPQUFPLEdBQUdGLGFBQWEsZ0JBQVNBLGFBQVQsb0JBQWdDQyxVQUFoQyxtQkFBdURBLFVBQXZELENBQTdCO0FBQ0EsU0FBT0UsY0FBS0MsSUFBTCxDQUFVRixPQUFWLEVBQW1CO0FBQUVILElBQUFBLEdBQUY7QUFBT00sSUFBQUEsUUFBUSxFQUFFLElBQWpCO0FBQXVCQyxJQUFBQSxLQUFLLEVBQUU7QUFBOUIsR0FBbkIsQ0FBUDtBQUNELENBSk07Ozs7QUFNQSxJQUFNQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLENBQUNDLElBQUQ7QUFBQSxNQUFPQyxVQUFQLHVFQUFvQkMsT0FBTyxDQUFDWCxHQUFSLEVBQXBCO0FBQUEsU0FDL0IsNkJBQWVTLElBQWYsRUFBcUJHLElBQXJCLENBQTBCQyxLQUFLLElBQzdCQSxLQUFLLENBQUNDLEdBQU4sQ0FBVTVCLElBQUksSUFBSTtBQUNoQixRQUFNSyxJQUFJLEdBQUdILGdCQUFnQixDQUFDRixJQUFELENBQTdCO0FBRUEsUUFBTTZCLFlBQVksR0FBRyxnQkFBS04sSUFBTCxFQUFXdkIsSUFBWCxDQUFyQjtBQUNBLFFBQU04QixZQUFZLEdBQUcsb0JBQVNOLFVBQVQsRUFBcUJLLFlBQXJCLENBQXJCO0FBRUEsV0FBTztBQUNMeEIsTUFBQUEsSUFBSSxZQUFLQSxJQUFMLGNBQWEsaUJBQUt5QixZQUFMLENBQWIsQ0FEQztBQUVMQyxNQUFBQSxLQUFLLEVBQUUxQixJQUZGO0FBR0wyQixNQUFBQSxLQUFLLEVBQUVIO0FBSEYsS0FBUDtBQUtELEdBWEQsQ0FERixDQUQrQjtBQUFBLENBQTFCOzs7O0FBZ0JBLElBQU1JLGVBQWUsR0FBRyxDQUFDQyxRQUFELEVBQVdDLE9BQVgsRUFBb0JDLE9BQXBCLEtBQzdCRixRQUFRLENBQUNqQyxPQUFULENBQ0UsSUFBSW9DLE1BQUosMkJBQ3FCRixPQURyQixpRUFDa0ZBLE9BRGxGLHdCQUVFLEdBRkYsQ0FERixnQkFLU0MsT0FMVCxVQURLOzs7O0FBU0EsSUFBTUUsU0FBUztBQUFBO0FBQUE7QUFBQSwrQkFBRyxXQUFPQyxZQUFQLEVBQXFCQyxPQUFyQixFQUE2RDtBQUFBLFFBQS9CaEIsVUFBK0IsdUVBQWxCQyxPQUFPLENBQUNYLEdBQVIsRUFBa0I7QUFDcEYsUUFBTTJCLFlBQVksR0FBR3ZDLGdCQUFnQixDQUFDcUMsWUFBRCxDQUFyQztBQUNBLFFBQU1WLFlBQVksR0FBRyxzQkFBV1UsWUFBWCxJQUEyQkEsWUFBM0IsR0FBMEMsZ0JBQUtmLFVBQUwsRUFBaUJlLFlBQWpCLENBQS9EO0FBQ0EsUUFBTUcsUUFBUSxHQUFHLEVBQWpCOztBQUVBLFFBQUloQyxZQUFZLENBQUM2QixZQUFELENBQWhCLEVBQWdDO0FBQzlCLFVBQU1aLEtBQUssR0FBR2QsUUFBUSxDQUFDLG1CQUFRZ0IsWUFBUixDQUFELEVBQXdCWSxZQUF4QixDQUF0QjtBQUNBZCxNQUFBQSxLQUFLLENBQUNnQixPQUFOO0FBQUE7QUFBQTtBQUFBLHNDQUFjLFdBQU1DLElBQU4sRUFBYztBQUMxQixjQUFNQyxRQUFRLEdBQUcsb0JBQVNELElBQVQsRUFBZTNDLE9BQWYsQ0FBdUJ3QyxZQUF2QixFQUFxQ0QsT0FBTyxDQUFDbkMsSUFBN0MsQ0FBakI7QUFFQSxjQUFNeUMsZUFBZSxHQUFHLGdCQUFLdEIsVUFBTCxFQUFpQmdCLE9BQU8sQ0FBQy9CLE1BQXpCLEVBQWlDb0MsUUFBakMsQ0FBeEI7QUFDQSxjQUFNRSxPQUFPLEdBQUcsbUJBQUtILElBQUwsRUFBV0UsZUFBWCxFQUE0QnBCLElBQTVCLENBQWlDLE1BQU07QUFDckQsZ0JBQU1RLFFBQVEsR0FBRywyQkFBYVksZUFBYixFQUE4QkUsUUFBOUIsRUFBakI7QUFDQSx3Q0FBY0YsZUFBZCxFQUErQmIsZUFBZSxDQUFDQyxRQUFELEVBQVdPLFlBQVgsRUFBeUJELE9BQU8sQ0FBQ25DLElBQWpDLENBQTlDO0FBQ0QsV0FIZSxDQUFoQjtBQUlBcUMsVUFBQUEsUUFBUSxDQUFDTyxJQUFULENBQWNGLE9BQWQ7QUFDRCxTQVREOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUQsS0FaRCxNQVlPO0FBQ0wsVUFBTUQsZUFBZSxHQUFHLGdCQUFLdEIsVUFBTCxFQUFpQmdCLE9BQU8sQ0FBQy9CLE1BQXpCLEVBQWlDK0IsT0FBTyxDQUFDbkMsSUFBekMsQ0FBeEI7QUFDQSxZQUFNLG1CQUFLLG1CQUFRd0IsWUFBUixDQUFMLEVBQTRCaUIsZUFBNUIsQ0FBTjs7QUFDQSxVQUFNbkIsTUFBSyxHQUFHZCxRQUFRLENBQUNpQyxlQUFELENBQXRCOztBQUNBbkIsTUFBQUEsTUFBSyxDQUFDZ0IsT0FBTixDQUFjQyxJQUFJLElBQUk7QUFDcEIsWUFBTVYsUUFBUSxHQUFHLDJCQUFhVSxJQUFiLEVBQW1CSSxRQUFuQixFQUFqQixDQURvQixDQUVwQjs7QUFDQSxZQUFNRSxXQUFXLEdBQUcsZ0JBQUssbUJBQVFOLElBQVIsQ0FBTCxFQUFvQixvQkFBU0EsSUFBVCxFQUFlM0MsT0FBZixDQUF1QndDLFlBQXZCLEVBQXFDLE9BQXJDLENBQXBCLENBQXBCO0FBQ0Esb0NBQWNHLElBQWQsRUFBb0JYLGVBQWUsQ0FBQ0MsUUFBRCxFQUFXTyxZQUFYLEVBQXlCRCxPQUFPLENBQUNuQyxJQUFqQyxDQUFuQztBQUNBLFlBQU0wQyxPQUFPLEdBQUcsbUJBQUtILElBQUwsRUFBV00sV0FBWCxDQUFoQjtBQUNBUixRQUFBQSxRQUFRLENBQUNPLElBQVQsQ0FBY0YsT0FBZDtBQUNELE9BUEQ7QUFRRDs7QUFDRCxVQUFNSSxPQUFPLENBQUNDLEdBQVIsQ0FBWVYsUUFBWixDQUFOO0FBQ0QsR0EvQnFCOztBQUFBLGtCQUFUSixTQUFTO0FBQUE7QUFBQTtBQUFBLEdBQWY7Ozs7QUFpQ1AsU0FBU2UsT0FBVCxDQUFpQkMsR0FBakIsRUFBc0I7QUFDcEIsTUFBSUMsR0FBRyxHQUFHLEVBQVY7QUFDQUQsRUFBQUEsR0FBRyxDQUFDMUIsR0FBSixDQUFRNEIsSUFBSSxJQUFJO0FBQ2QsUUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLElBQWQsQ0FBSixFQUF5QjtBQUN2QkQsTUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNJLE1BQUosQ0FBV04sT0FBTyxDQUFDRyxJQUFELENBQWxCLENBQU47QUFDRCxLQUZELE1BRU87QUFDTEQsTUFBQUEsR0FBRyxDQUFDTixJQUFKLENBQVNPLElBQVQ7QUFDRDtBQUNGLEdBTkQ7QUFPQSxTQUFPRCxHQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBiYXNlbmFtZSwgZGlybmFtZSwgaXNBYnNvbHV0ZSwgam9pbiwgcmVsYXRpdmUgfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgeyBjYW1lbENhc2UsIHVwcGVyRmlyc3QgfSBmcm9tIFwibG9kYXNoXCJcbmltcG9ydCB7IGdyYXkgfSBmcm9tIFwiY2hhbGtcIlxuaW1wb3J0IGdsb2IgZnJvbSBcImdsb2JcIlxuaW1wb3J0IGxpc3RSZWFjdEZpbGVzIGZyb20gXCJsaXN0LXJlYWN0LWZpbGVzXCJcbmltcG9ydCB7IGNvcHksIG1vdmUsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gXCJmcy1leHRyYVwiXG5cbmNvbnN0IHJlbW92ZUV4dCA9IHBhdGggPT4gcGF0aC5yZXBsYWNlKC9cXC5bXi5dKyQvLCBcIlwiKVxuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9uZW50TmFtZSA9IHBhdGggPT5cbiAgcGF0aC5zcGxpdChcIi9cIikucmVkdWNlKChuYW1lLCBwYXJ0KSA9PiB7XG4gICAgaWYgKC9eW0EtWl0vLnRlc3QocGFydCkpIHtcbiAgICAgIHJldHVybiByZW1vdmVFeHQocGFydClcbiAgICB9IGVsc2UgaWYgKC9eKCg/IWluZGV4KS4rKVxcLlteLl0rJC8udGVzdChwYXJ0KSkge1xuICAgICAgcmV0dXJuIHVwcGVyRmlyc3QoY2FtZWxDYXNlKHJlbW92ZUV4dChwYXJ0KSkpXG4gICAgfVxuICAgIHJldHVybiBuYW1lXG4gIH0sIFwiXCIpXG5cbmV4cG9ydCBjb25zdCBnZXRDb21wb25lbnRGb2xkZXIgPSBwYXRoID0+IHtcbiAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUocGF0aClcbiAgcmV0dXJuIGRpcm5hbWUocGF0aCkuc3BsaXQoXCIvXCIpLnJlZHVjZSgoZm9sZGVyLCBwYXJ0KSA9PiB7XG4gICAgaWYgKHJlbW92ZUV4dChwYXJ0KSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIGZvbGRlclxuICAgIH1cbiAgICByZXR1cm4gam9pbihmb2xkZXIsIHBhcnQpXG4gIH0sIFwiLi9cIilcbn1cblxuZXhwb3J0IGNvbnN0IGlzU2luZ2xlRmlsZSA9IHBhdGggPT4ge1xuICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuICBjb25zdCBbIGRpciBdID0gZGlybmFtZShwYXRoKS5zcGxpdChcIi9cIikucmV2ZXJzZSgpXG5cbiAgcmV0dXJuIGRpciAhPT0gbmFtZVxufVxuXG5leHBvcnQgY29uc3QgZ2V0RmlsZXMgPSAoY3dkLCBjb21wb25lbnROYW1lKSA9PiB7XG4gIGNvbnN0IGV4dGVuc2lvbnMgPSBcIntqcyx0cyxqc3gsdHN4LGNzcyxsZXNzLHNjc3Msc2Fzcyxzc3MsanNvbixtZCxtZHh9XCJcbiAgY29uc3QgcGF0dGVybiA9IGNvbXBvbmVudE5hbWUgPyBgKiovJHtjb21wb25lbnROYW1lfXsuLC4qLn0ke2V4dGVuc2lvbnN9YCA6IGAqKi8qLiR7ZXh0ZW5zaW9uc31gXG4gIHJldHVybiBnbG9iLnN5bmMocGF0dGVybiwgeyBjd2QsIGFic29sdXRlOiB0cnVlLCBub2RpcjogdHJ1ZSB9KVxufVxuXG5leHBvcnQgY29uc3QgZ2V0Q29tcG9uZW50RmlsZXMgPSAocm9vdCwgd29ya2luZ0RpciA9IHByb2Nlc3MuY3dkKCkpID0+XG4gIGxpc3RSZWFjdEZpbGVzKHJvb3QpLnRoZW4oZmlsZXMgPT5cbiAgICBmaWxlcy5tYXAocGF0aCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuXG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBqb2luKHJvb3QsIHBhdGgpXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZSh3b3JraW5nRGlyLCBhYnNvbHV0ZVBhdGgpXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGAke25hbWV9ICR7Z3JheShyZWxhdGl2ZVBhdGgpfWAsXG4gICAgICAgIHNob3J0OiBuYW1lLFxuICAgICAgICB2YWx1ZTogYWJzb2x1dGVQYXRoLFxuICAgICAgfVxuICAgIH0pXG4gIClcblxuZXhwb3J0IGNvbnN0IHJlcGxhY2VDb250ZW50cyA9IChjb250ZW50cywgb2xkTmFtZSwgbmV3TmFtZSkgPT5cbiAgY29udGVudHMucmVwbGFjZShcbiAgICBuZXcgUmVnRXhwKFxuICAgICAgYChbXmEtekEtWjAtOV8kXSkke29sZE5hbWV9KFteYS16QS1aMC05XyRdfENvbnRhaW5lcil8KFsnfFwiXS4vW2EtekEtWjAtOV8kXSo/KSR7b2xkTmFtZX0oW2EtekEtWjAtOV8kXSo/KWAsXG4gICAgICBcImdcIlxuICAgICksXG4gICAgYCQxJDMke25ld05hbWV9JDIkNGBcbiAgKVxuXG5leHBvcnQgY29uc3QgcmVwbGljYXRlID0gYXN5bmMgKG9yaWdpbmFsUGF0aCwgYW5zd2Vycywgd29ya2luZ0RpciA9IHByb2Nlc3MuY3dkKCkpID0+IHtcbiAgY29uc3Qgb3JpZ2luYWxOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShvcmlnaW5hbFBhdGgpXG4gIGNvbnN0IGFic29sdXRlUGF0aCA9IGlzQWJzb2x1dGUob3JpZ2luYWxQYXRoKSA/IG9yaWdpbmFsUGF0aCA6IGpvaW4od29ya2luZ0Rpciwgb3JpZ2luYWxQYXRoKVxuICBjb25zdCBwcm9taXNlcyA9IFtdXG5cbiAgaWYgKGlzU2luZ2xlRmlsZShvcmlnaW5hbFBhdGgpKSB7XG4gICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkaXJuYW1lKGFic29sdXRlUGF0aCksIG9yaWdpbmFsTmFtZSlcbiAgICBmaWxlcy5mb3JFYWNoKGFzeW5jIGZpbGUgPT4ge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBiYXNlbmFtZShmaWxlKS5yZXBsYWNlKG9yaWdpbmFsTmFtZSwgYW5zd2Vycy5uYW1lKVxuXG4gICAgICBjb25zdCBkZXN0aW5hdGlvblBhdGggPSBqb2luKHdvcmtpbmdEaXIsIGFuc3dlcnMuZm9sZGVyLCBmaWxlbmFtZSlcbiAgICAgIGNvbnN0IHByb21pc2UgPSBjb3B5KGZpbGUsIGRlc3RpbmF0aW9uUGF0aCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gcmVhZEZpbGVTeW5jKGRlc3RpbmF0aW9uUGF0aCkudG9TdHJpbmcoKVxuICAgICAgICB3cml0ZUZpbGVTeW5jKGRlc3RpbmF0aW9uUGF0aCwgcmVwbGFjZUNvbnRlbnRzKGNvbnRlbnRzLCBvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSkpXG4gICAgICB9KVxuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gam9pbih3b3JraW5nRGlyLCBhbnN3ZXJzLmZvbGRlciwgYW5zd2Vycy5uYW1lKVxuICAgIGF3YWl0IGNvcHkoZGlybmFtZShhYnNvbHV0ZVBhdGgpLCBkZXN0aW5hdGlvblBhdGgpXG4gICAgY29uc3QgZmlsZXMgPSBnZXRGaWxlcyhkZXN0aW5hdGlvblBhdGgpXG4gICAgZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gcmVhZEZpbGVTeW5jKGZpbGUpLnRvU3RyaW5nKClcbiAgICAgIC8vIGNvbnN0IHJlbmFtZWRQYXRoID0gam9pbihkaXJuYW1lKGZpbGUpLCBiYXNlbmFtZShmaWxlKS5yZXBsYWNlKG9yaWdpbmFsTmFtZSwgJ2Fuc3dlcnMubmFtZScpKVxuICAgICAgY29uc3QgcmVuYW1lZFBhdGggPSBqb2luKGRpcm5hbWUoZmlsZSksIGJhc2VuYW1lKGZpbGUpLnJlcGxhY2Uob3JpZ2luYWxOYW1lLCAnaW5kZXgnKSlcbiAgICAgIHdyaXRlRmlsZVN5bmMoZmlsZSwgcmVwbGFjZUNvbnRlbnRzKGNvbnRlbnRzLCBvcmlnaW5hbE5hbWUsIGFuc3dlcnMubmFtZSkpXG4gICAgICBjb25zdCBwcm9taXNlID0gbW92ZShmaWxlLCByZW5hbWVkUGF0aClcbiAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSlcbiAgICB9KVxuICB9XG4gIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuKGFycikge1xuICB2YXIgcmVzID0gW11cbiAgYXJyLm1hcChpdGVtID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgcmVzID0gcmVzLmNvbmNhdChmbGF0dGVuKGl0ZW0pKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMucHVzaChpdGVtKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgeyBmbGF0dGVuIH1cbiJdfQ==