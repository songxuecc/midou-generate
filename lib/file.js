"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeFolder = removeFolder;
exports.FindFile = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FindFile {
  constructor() {
    _defineProperty(this, "clear", () => {
      this.counnt = 0;
    });

    _defineProperty(this, "find", (filePath, key) => {
      return new Promise((res, rej) => {
        this.counnt = this.counnt + 1;

        if (this.counnt === 1) {
          this.res = res;
          this.rej = rej;
        }

        _fs.default.readdir(filePath, (err, files) => {
          if (err) {
            this.rej({
              readdirError: err
            });
          } else {
            //遍历读取到的文件列表
            files.forEach(filename => {
              //获取当前文件的绝对路径
              var filedir = _path.default.join(filePath, filename); //根据文件路径获取文件信息，返回一个fs.Stats对象


              _fs.default.stat(filedir, (eror, stats) => {
                if (eror) {
                  this.rej({
                    statError: eror
                  });
                } else {
                  var isFile = stats.isFile(); //是文件

                  var isDir = stats.isDirectory(); //是文件夹

                  if (isFile) {
                    if (filedir.indexOf(key) > -1) {
                      this.clear();
                      this.res(filedir);
                    }
                  }

                  if (isDir) {
                    this.find(filedir, key); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                  }
                }
              });
            });
          }
        });
      });
    });

    this.counnt = 0;
    this.res = undefined;
    this.rej = undefined;
  }

} // 删除文件夹


exports.FindFile = FindFile;

function removeFolder(path) {
  if (_fs.default.existsSync(path)) {
    var files = _fs.default.readdirSync(path);

    files.forEach(file => {
      var curPath = (0, _path.join)(path, file);

      if (_fs.default.statSync(curPath).isDirectory()) {
        removeFolder(curPath);
      } else {
        _fs.default.unlinkSync(curPath);
      }
    });

    _fs.default.rmdirSync(path);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maWxlLmpzIl0sIm5hbWVzIjpbIkZpbmRGaWxlIiwiY29uc3RydWN0b3IiLCJjb3VubnQiLCJmaWxlUGF0aCIsImtleSIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJmcyIsInJlYWRkaXIiLCJlcnIiLCJmaWxlcyIsInJlYWRkaXJFcnJvciIsImZvckVhY2giLCJmaWxlbmFtZSIsImZpbGVkaXIiLCJwYXRoIiwiam9pbiIsInN0YXQiLCJlcm9yIiwic3RhdHMiLCJzdGF0RXJyb3IiLCJpc0ZpbGUiLCJpc0RpciIsImlzRGlyZWN0b3J5IiwiaW5kZXhPZiIsImNsZWFyIiwiZmluZCIsInVuZGVmaW5lZCIsInJlbW92ZUZvbGRlciIsImV4aXN0c1N5bmMiLCJyZWFkZGlyU3luYyIsImZpbGUiLCJjdXJQYXRoIiwic3RhdFN5bmMiLCJ1bmxpbmtTeW5jIiwicm1kaXJTeW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBSUEsTUFBTUEsUUFBTixDQUFlO0FBQ1hDLEVBQUFBLFdBQVcsR0FBRztBQUFBLG1DQU1OLE1BQU07QUFDVixXQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNILEtBUmE7O0FBQUEsa0NBU1AsQ0FBQ0MsUUFBRCxFQUFXQyxHQUFYLEtBQW1CO0FBQ3RCLGFBQU8sSUFBSUMsT0FBSixDQUFZLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQzdCLGFBQUtMLE1BQUwsR0FBYyxLQUFLQSxNQUFMLEdBQWMsQ0FBNUI7O0FBQ0EsWUFBSSxLQUFLQSxNQUFMLEtBQWdCLENBQXBCLEVBQXVCO0FBQ25CLGVBQUtJLEdBQUwsR0FBV0EsR0FBWDtBQUNBLGVBQUtDLEdBQUwsR0FBV0EsR0FBWDtBQUNIOztBQUNEQyxvQkFBR0MsT0FBSCxDQUFXTixRQUFYLEVBQXFCLENBQUNPLEdBQUQsRUFBTUMsS0FBTixLQUFnQjtBQUNqQyxjQUFJRCxHQUFKLEVBQVM7QUFDTCxpQkFBS0gsR0FBTCxDQUFTO0FBQUVLLGNBQUFBLFlBQVksRUFBRUY7QUFBaEIsYUFBVDtBQUNILFdBRkQsTUFFTztBQUNIO0FBQ0FDLFlBQUFBLEtBQUssQ0FBQ0UsT0FBTixDQUFjQyxRQUFRLElBQUk7QUFDdEI7QUFDQSxrQkFBSUMsT0FBTyxHQUFHQyxjQUFLQyxJQUFMLENBQVVkLFFBQVYsRUFBb0JXLFFBQXBCLENBQWQsQ0FGc0IsQ0FHdEI7OztBQUNBTiwwQkFBR1UsSUFBSCxDQUFRSCxPQUFSLEVBQWlCLENBQUNJLElBQUQsRUFBT0MsS0FBUCxLQUFpQjtBQUM5QixvQkFBSUQsSUFBSixFQUFVO0FBQ04sdUJBQUtaLEdBQUwsQ0FBUztBQUFFYyxvQkFBQUEsU0FBUyxFQUFFRjtBQUFiLG1CQUFUO0FBQ0gsaUJBRkQsTUFFTztBQUNILHNCQUFJRyxNQUFNLEdBQUdGLEtBQUssQ0FBQ0UsTUFBTixFQUFiLENBREcsQ0FDMEI7O0FBQzdCLHNCQUFJQyxLQUFLLEdBQUdILEtBQUssQ0FBQ0ksV0FBTixFQUFaLENBRkcsQ0FFOEI7O0FBQ2pDLHNCQUFJRixNQUFKLEVBQVk7QUFDUix3QkFBSVAsT0FBTyxDQUFDVSxPQUFSLENBQWdCckIsR0FBaEIsSUFBdUIsQ0FBQyxDQUE1QixFQUErQjtBQUMzQiwyQkFBS3NCLEtBQUw7QUFDQSwyQkFBS3BCLEdBQUwsQ0FBU1MsT0FBVDtBQUNIO0FBQ0o7O0FBQ0Qsc0JBQUlRLEtBQUosRUFBVztBQUNQLHlCQUFLSSxJQUFMLENBQVVaLE9BQVYsRUFBbUJYLEdBQW5CLEVBRE8sQ0FDa0I7QUFDNUI7QUFDSjtBQUNKLGVBaEJEO0FBaUJILGFBckJEO0FBc0JIO0FBQ0osU0E1QkQ7QUE2QkgsT0FuQ00sQ0FBUDtBQW9DSCxLQTlDYTs7QUFDVixTQUFLRixNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtJLEdBQUwsR0FBV3NCLFNBQVg7QUFDQSxTQUFLckIsR0FBTCxHQUFXcUIsU0FBWDtBQUNIOztBQUxVLEMsQ0FrRGY7Ozs7O0FBQ0EsU0FBU0MsWUFBVCxDQUFzQmIsSUFBdEIsRUFBNEI7QUFDeEIsTUFBSVIsWUFBR3NCLFVBQUgsQ0FBY2QsSUFBZCxDQUFKLEVBQXlCO0FBQ3JCLFFBQU1MLEtBQUssR0FBR0gsWUFBR3VCLFdBQUgsQ0FBZWYsSUFBZixDQUFkOztBQUNBTCxJQUFBQSxLQUFLLENBQUNFLE9BQU4sQ0FBY21CLElBQUksSUFBSTtBQUNsQixVQUFNQyxPQUFPLEdBQUcsZ0JBQUtqQixJQUFMLEVBQVdnQixJQUFYLENBQWhCOztBQUNBLFVBQUl4QixZQUFHMEIsUUFBSCxDQUFZRCxPQUFaLEVBQXFCVCxXQUFyQixFQUFKLEVBQXdDO0FBQ3BDSyxRQUFBQSxZQUFZLENBQUNJLE9BQUQsQ0FBWjtBQUNILE9BRkQsTUFFTztBQUNIekIsb0JBQUcyQixVQUFILENBQWNGLE9BQWQ7QUFDSDtBQUNKLEtBUEQ7O0FBUUF6QixnQkFBRzRCLFNBQUgsQ0FBYXBCLElBQWI7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiIFxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggLHtqb2lufSBmcm9tICdwYXRoJ1xuXG5cblxuY2xhc3MgRmluZEZpbGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvdW5udCA9IDA7XG4gICAgICAgIHRoaXMucmVzID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnJlaiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjbGVhciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jb3VubnQgPSAwO1xuICAgIH1cbiAgICBmaW5kID0gKGZpbGVQYXRoLCBrZXkpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb3VubnQgPSB0aGlzLmNvdW5udCArIDE7XG4gICAgICAgICAgICBpZiAodGhpcy5jb3VubnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcyA9IHJlcztcbiAgICAgICAgICAgICAgICB0aGlzLnJlaiA9IHJlajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZzLnJlYWRkaXIoZmlsZVBhdGgsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlaih7IHJlYWRkaXJFcnJvcjogZXJyIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8v6YGN5Y6G6K+75Y+W5Yiw55qE5paH5Lu25YiX6KGoXG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLmZvckVhY2goZmlsZW5hbWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/ojrflj5blvZPliY3mlofku7bnmoTnu53lr7not6/lvoRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlZGlyID0gcGF0aC5qb2luKGZpbGVQYXRoLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+agueaNruaWh+S7tui3r+W+hOiOt+WPluaWh+S7tuS/oeaBr++8jOi/lOWbnuS4gOS4qmZzLlN0YXRz5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBmcy5zdGF0KGZpbGVkaXIsIChlcm9yLCBzdGF0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVqKHsgc3RhdEVycm9yOiBlcm9yIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0ZpbGUgPSBzdGF0cy5pc0ZpbGUoKTsgLy/mmK/mlofku7ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzRGlyID0gc3RhdHMuaXNEaXJlY3RvcnkoKTsgLy/mmK/mlofku7blpLlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVkaXIuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcyhmaWxlZGlyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNEaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluZChmaWxlZGlyLCBrZXkpOyAvL+mAkuW9ku+8jOWmguaenOaYr+aWh+S7tuWkue+8jOWwsee7p+e7remBjeWOhuivpeaWh+S7tuWkueS4i+mdoueahOaWh+S7tlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG4vLyDliKDpmaTmlofku7blpLlcbmZ1bmN0aW9uIHJlbW92ZUZvbGRlcihwYXRoKSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aCkpIHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhwYXRoKTtcbiAgICAgICAgZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBqb2luKHBhdGgsIGZpbGUpO1xuICAgICAgICAgICAgaWYgKGZzLnN0YXRTeW5jKGN1clBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVGb2xkZXIoY3VyUGF0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLnVubGlua1N5bmMoY3VyUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcy5ybWRpclN5bmMocGF0aCk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7XG4gICAgRmluZEZpbGUsXG4gICAgcmVtb3ZlRm9sZGVyXG59Il19