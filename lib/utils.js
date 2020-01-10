"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = flatten;
exports.addFileHeader = exports.replaceLessImport = exports.replaceContentsHasLowerCase = exports.replaceContents = exports.getComponentFiles = exports.getFiles = exports.isSingleFile = exports.getComponentFolder = exports.getComponentName = exports.removeExt = void 0;

var _path = require("path");

var _lodash = require("lodash");

var _chalk = require("chalk");

var _glob = _interopRequireDefault(require("glob"));

var _gitUserName = _interopRequireDefault(require("git-user-name"));

var _listReactFiles = _interopRequireDefault(require("list-react-files"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeExt = path => path.replace(/\.[^.]+$/, "");

exports.removeExt = removeExt;

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
}; // 获取组建路径信息


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

var replaceLessImport = (contents, newContent) => contents.replace(new RegExp(/@import\s+"[./\-\w]+";/), "@import \"".concat(newContent, "\";")); // 数组扁平化


exports.replaceLessImport = replaceLessImport;

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
} // 时间格式化


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
  // 如果没有文件头就添加文件头
  // 有文件头就替换文件头
  var reg = new RegExp(/\/\*\n\s\*\s+@Author([\w\W]*)\* @Last Modified time([\w\W]*)\n\*\//);
  var userName = (0, _gitUserName.default)();
  var fileHeader = "/*\n* @Author: ".concat(userName, "\n* @ModuleName: undefined\n* @Date: ").concat(new Date().Format("yyyy-MM-dd HH:mm:s"), "\n* @Last Modified by: ").concat(userName, "\n* @Last Modified time: ").concat(new Date().Format("yyyy-MM-dd HH:mm:s"), "\n*/\n\n");

  if (reg.test(content)) {
    return contents.replace(reg, "".concat(fileHeader));
  }

  return fileHeader + content;
};

exports.addFileHeader = addFileHeader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJyZW1vdmVFeHQiLCJwYXRoIiwicmVwbGFjZSIsImdldENvbXBvbmVudE5hbWUiLCJzcGxpdCIsInJlZHVjZSIsIm5hbWUiLCJwYXJ0IiwidGVzdCIsImdldENvbXBvbmVudEZvbGRlciIsImZvbGRlciIsImlzU2luZ2xlRmlsZSIsImRpciIsInJldmVyc2UiLCJnZXRGaWxlcyIsImN3ZCIsImNvbXBvbmVudE5hbWUiLCJleHRlbnNpb25zIiwicGF0dGVybiIsImdsb2IiLCJzeW5jIiwiYWJzb2x1dGUiLCJub2RpciIsImdldENvbXBvbmVudEZpbGVzIiwicm9vdCIsIndvcmtpbmdEaXIiLCJwcm9jZXNzIiwidGhlbiIsImZpbGVzIiwibWFwIiwiYWJzb2x1dGVQYXRoIiwicmVsYXRpdmVQYXRoIiwic2hvcnQiLCJ2YWx1ZSIsInJlcGxhY2VDb250ZW50cyIsImNvbnRlbnRzIiwib2xkTmFtZSIsIm5ld05hbWUiLCJSZWdFeHAiLCJyZXBsYWNlQ29udGVudHNIYXNMb3dlckNhc2UiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2VMZXNzSW1wb3J0IiwibmV3Q29udGVudCIsImZsYXR0ZW4iLCJhcnIiLCJyZXMiLCJpdGVtIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0IiwicHVzaCIsIkRhdGUiLCJwcm90b3R5cGUiLCJGb3JtYXQiLCJmbXQiLCJvIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsIk1hdGgiLCJmbG9vciIsIlMiLCJnZXRNaWxsaXNlY29uZHMiLCIkMSIsImdldEZ1bGxZZWFyIiwic3Vic3RyIiwibGVuZ3RoIiwiayIsImFkZEZpbGVIZWFkZXIiLCJjb250ZW50IiwicmVnIiwidXNlck5hbWUiLCJmaWxlSGVhZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFB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QUNBLElBQU1nQixhQUFhLEdBQUdDLE9BQU8sSUFBSTtBQUMvQjtBQUNBO0FBQ0EsTUFBTUMsR0FBRyxHQUFHLElBQUlsQyxNQUFKLENBQVcsb0VBQVgsQ0FBWjtBQUNBLE1BQU1tQyxRQUFRLEdBQUcsMkJBQWpCO0FBQ0EsTUFBTUMsVUFBVSw0QkFDTEQsUUFESyxrREFHUCxJQUFJdEIsSUFBSixHQUFXRSxNQUFYLENBQWtCLG9CQUFsQixDQUhPLG9DQUlLb0IsUUFKTCxzQ0FLTyxJQUFJdEIsSUFBSixHQUFXRSxNQUFYLENBQWtCLG9CQUFsQixDQUxQLGFBQWhCOztBQVNBLE1BQUltQixHQUFHLENBQUNoRSxJQUFKLENBQVMrRCxPQUFULENBQUosRUFBdUI7QUFDckIsV0FBT3BDLFFBQVEsQ0FBQ2pDLE9BQVQsQ0FBaUJzRSxHQUFqQixZQUF5QkUsVUFBekIsRUFBUDtBQUNEOztBQUNELFNBQU9BLFVBQVUsR0FBR0gsT0FBcEI7QUFDRCxDQWxCRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRpcm5hbWUsIGpvaW4sIHJlbGF0aXZlIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgY2FtZWxDYXNlLCB1cHBlckZpcnN0IH0gZnJvbSBcImxvZGFzaFwiXG5pbXBvcnQgeyBncmF5IH0gZnJvbSBcImNoYWxrXCJcbmltcG9ydCBnbG9iIGZyb20gXCJnbG9iXCJcbmltcG9ydCBnaXRVc2VyTmFtZSBmcm9tIFwiZ2l0LXVzZXItbmFtZVwiXG5pbXBvcnQgbGlzdFJlYWN0RmlsZXMgZnJvbSBcImxpc3QtcmVhY3QtZmlsZXNcIlxuXG5jb25zdCByZW1vdmVFeHQgPSBwYXRoID0+IHBhdGgucmVwbGFjZSgvXFwuW14uXSskLywgXCJcIilcblxuY29uc3QgZ2V0Q29tcG9uZW50TmFtZSA9IHBhdGggPT5cbiAgcGF0aC5zcGxpdChcIi9cIikucmVkdWNlKChuYW1lLCBwYXJ0KSA9PiB7XG4gICAgaWYgKC9eW0EtWl0vLnRlc3QocGFydCkpIHtcbiAgICAgIHJldHVybiByZW1vdmVFeHQocGFydClcbiAgICB9IGVsc2UgaWYgKC9eKCg/IWluZGV4KS4rKVxcLlteLl0rJC8udGVzdChwYXJ0KSkge1xuICAgICAgcmV0dXJuIHVwcGVyRmlyc3QoY2FtZWxDYXNlKHJlbW92ZUV4dChwYXJ0KSkpXG4gICAgfVxuICAgIHJldHVybiBuYW1lXG4gIH0sIFwiXCIpXG5cbmNvbnN0IGdldENvbXBvbmVudEZvbGRlciA9IHBhdGggPT4ge1xuICBjb25zdCBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShwYXRoKVxuICByZXR1cm4gZGlybmFtZShwYXRoKS5zcGxpdChcIi9cIikucmVkdWNlKChmb2xkZXIsIHBhcnQpID0+IHtcbiAgICBpZiAocmVtb3ZlRXh0KHBhcnQpID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gZm9sZGVyXG4gICAgfVxuICAgIHJldHVybiBqb2luKGZvbGRlciwgcGFydClcbiAgfSwgXCIuL1wiKVxufVxuXG5jb25zdCBpc1NpbmdsZUZpbGUgPSBwYXRoID0+IHtcbiAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUocGF0aClcbiAgY29uc3QgWyBkaXIgXSA9IGRpcm5hbWUocGF0aCkuc3BsaXQoXCIvXCIpLnJldmVyc2UoKVxuICByZXR1cm4gZGlyICE9PSBuYW1lXG59XG5cbmNvbnN0IGdldEZpbGVzID0gKGN3ZCwgY29tcG9uZW50TmFtZSkgPT4ge1xuICBjb25zdCBleHRlbnNpb25zID0gXCJ7anMsdHMsanN4LHRzeCxjc3MsbGVzcyxzY3NzLHNhc3Msc3NzLGpzb24sbWQsbWR4fVwiXG4gIGNvbnN0IHBhdHRlcm4gPSBjb21wb25lbnROYW1lID8gYCoqLyR7Y29tcG9uZW50TmFtZX17LiwuKi59JHtleHRlbnNpb25zfWAgOiBgKiovKi4ke2V4dGVuc2lvbnN9YFxuICByZXR1cm4gZ2xvYi5zeW5jKHBhdHRlcm4sIHsgY3dkLCBhYnNvbHV0ZTogdHJ1ZSwgbm9kaXI6IHRydWUgfSlcbn1cblxuLy8g6I635Y+W57uE5bu66Lev5b6E5L+h5oGvXG5jb25zdCBnZXRDb21wb25lbnRGaWxlcyA9IChyb290LCB3b3JraW5nRGlyID0gcHJvY2Vzcy5jd2QoKSkgPT5cbiAgbGlzdFJlYWN0RmlsZXMocm9vdCkudGhlbihmaWxlcyA9PlxuICAgIGZpbGVzLm1hcChwYXRoID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHBhdGgpXG5cbiAgICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IGpvaW4ocm9vdCwgcGF0aClcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHdvcmtpbmdEaXIsIGFic29sdXRlUGF0aClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGAke25hbWV9ICR7Z3JheShyZWxhdGl2ZVBhdGgpfWAsXG4gICAgICAgIHNob3J0OiBuYW1lLFxuICAgICAgICB2YWx1ZTogYWJzb2x1dGVQYXRoLFxuICAgICAgfVxuICAgIH0pXG4gIClcblxuLy8g5pu/5o2i5oyH5a6a5YaF5a65XG5jb25zdCByZXBsYWNlQ29udGVudHMgPSAoY29udGVudHMsIG9sZE5hbWUsIG5ld05hbWUpID0+XG4gIGNvbnRlbnRzLnJlcGxhY2UoXG4gICAgbmV3IFJlZ0V4cChcbiAgICAgIGAoW15hLXpBLVowLTlfJF0pJHtvbGROYW1lfShbXmEtekEtWjAtOV8kXXxDb250YWluZXIpfChbJ3xcIl0uL1thLXpBLVowLTlfJF0qPykke29sZE5hbWV9KFthLXpBLVowLTlfJF0qPylgLFxuICAgICAgXCJnXCJcbiAgICApLFxuICAgIGAkMSQzJHtuZXdOYW1lfSQyJDRgXG4gIClcblxuLy8g5aSn5bCP5YaZ5ZCN5a2X6YO95pu/5o2iXG5jb25zdCByZXBsYWNlQ29udGVudHNIYXNMb3dlckNhc2UgPSAoY29udGVudHMsIG9sZE5hbWUsIG5ld05hbWUpID0+XG4gIGNvbnRlbnRzLnJlcGxhY2UoXG4gICAgbmV3IFJlZ0V4cChcbiAgICAgIGAoW15hLXpBLVowLTlfJF0pKCR7b2xkTmFtZX18JHtvbGROYW1lLnRvTG93ZXJDYXNlKCl9KShbXmEtekEtWjAtOV8kXXxDb250YWluZXIpfChbJ3xcIl0uL1thLXpBLVowLTlfJF0qPykoJHtvbGROYW1lfXwke29sZE5hbWUudG9Mb3dlckNhc2UoKX0pKFthLXpBLVowLTlfJF0qPylgLFxuICAgICAgXCJnXCJcbiAgICApLFxuICAgIGAkMSQ0JHtuZXdOYW1lfSQzJDZgXG4gIClcblxuLy8g5pu/5o2iIGNzcyDlvJXlhaXot6/lvoRcbmNvbnN0IHJlcGxhY2VMZXNzSW1wb3J0ID0gKGNvbnRlbnRzLCBuZXdDb250ZW50KSA9PlxuICBjb250ZW50cy5yZXBsYWNlKG5ldyBSZWdFeHAoL0BpbXBvcnRcXHMrXCJbLi9cXC1cXHddK1wiOy8pLCBgQGltcG9ydCBcIiR7bmV3Q29udGVudH1cIjtgKVxuXG5cbiAgLy8g5pWw57uE5omB5bmz5YyWXG5mdW5jdGlvbiBmbGF0dGVuKGFycikge1xuICB2YXIgcmVzID0gW11cbiAgYXJyLm1hcChpdGVtID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgcmVzID0gcmVzLmNvbmNhdChmbGF0dGVuKGl0ZW0pKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMucHVzaChpdGVtKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHJlc1xufVxuXG4vLyDml7bpl7TmoLzlvI/ljJZcbkRhdGUucHJvdG90eXBlLkZvcm1hdCA9IGZ1bmN0aW9uKGZtdCkge1xuICB2YXIgbyA9IHtcbiAgICBcIk0rXCI6IHRoaXMuZ2V0TW9udGgoKSArIDEsIC8v5pyI5Lu9XG4gICAgXCJkK1wiOiB0aGlzLmdldERhdGUoKSwgLy/ml6VcbiAgICBcImgrXCI6IHRoaXMuZ2V0SG91cnMoKSwgLy/lsI/ml7ZcbiAgICBcIm0rXCI6IHRoaXMuZ2V0TWludXRlcygpLCAvL+WIhlxuICAgIFwicytcIjogdGhpcy5nZXRTZWNvbmRzKCksIC8v56eSXG4gICAgXCJxK1wiOiBNYXRoLmZsb29yKCh0aGlzLmdldE1vbnRoKCkgKyAzKSAvIDMpLCAvL+Wto+W6plxuICAgIFM6IHRoaXMuZ2V0TWlsbGlzZWNvbmRzKCksIC8v5q+r56eSXG4gIH1cbiAgaWYgKC8oeSspLy50ZXN0KGZtdCkpXG4gICAgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAodGhpcy5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSlcbiAgZm9yICh2YXIgayBpbiBvKVxuICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZtdCkpXG4gICAgICBmbXQgPSBmbXQucmVwbGFjZShcbiAgICAgICAgUmVnRXhwLiQxLFxuICAgICAgICBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aClcbiAgICAgIClcbiAgcmV0dXJuIGZtdFxufVxuXG4vLyDmt7vliqDmlofku7blpLRcbmNvbnN0IGFkZEZpbGVIZWFkZXIgPSBjb250ZW50ID0+IHtcbiAgLy8g5aaC5p6c5rKh5pyJ5paH5Lu25aS05bCx5re75Yqg5paH5Lu25aS0XG4gIC8vIOacieaWh+S7tuWktOWwseabv+aNouaWh+S7tuWktFxuICBjb25zdCByZWcgPSBuZXcgUmVnRXhwKC9cXC9cXCpcXG5cXHNcXCpcXHMrQEF1dGhvcihbXFx3XFxXXSopXFwqIEBMYXN0IE1vZGlmaWVkIHRpbWUoW1xcd1xcV10qKVxcblxcKlxcLy8pXG4gIGNvbnN0IHVzZXJOYW1lID0gZ2l0VXNlck5hbWUoKVxuICBjb25zdCBmaWxlSGVhZGVyID0gYC8qXG4qIEBBdXRob3I6ICR7dXNlck5hbWV9XG4qIEBNb2R1bGVOYW1lOiB1bmRlZmluZWRcbiogQERhdGU6ICR7bmV3IERhdGUoKS5Gb3JtYXQoXCJ5eXl5LU1NLWRkIEhIOm1tOnNcIil9XG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAke3VzZXJOYW1lfVxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAke25ldyBEYXRlKCkuRm9ybWF0KFwieXl5eS1NTS1kZCBISDptbTpzXCIpfVxuKi9cblxuYFxuICBpZiAocmVnLnRlc3QoY29udGVudCkpIHtcbiAgICByZXR1cm4gY29udGVudHMucmVwbGFjZShyZWcsIGAke2ZpbGVIZWFkZXJ9YClcbiAgfVxuICByZXR1cm4gZmlsZUhlYWRlciArIGNvbnRlbnRcbn1cblxuXG5cbmV4cG9ydCB7XG4gIHJlbW92ZUV4dCxcbiAgZ2V0Q29tcG9uZW50TmFtZSxcbiAgZ2V0Q29tcG9uZW50Rm9sZGVyLFxuICBpc1NpbmdsZUZpbGUsXG4gIGdldEZpbGVzLFxuICBnZXRDb21wb25lbnRGaWxlcyxcbiAgcmVwbGFjZUNvbnRlbnRzLFxuICByZXBsYWNlQ29udGVudHNIYXNMb3dlckNhc2UsXG4gIHJlcGxhY2VMZXNzSW1wb3J0LFxuICBmbGF0dGVuLFxuICBhZGRGaWxlSGVhZGVyLFxufVxuIl19