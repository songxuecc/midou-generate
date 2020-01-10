import { dirname, join, relative } from "path"
import { camelCase, upperFirst } from "lodash"
import { gray } from "chalk"
import glob from "glob"
import gitUserName from "git-user-name"
import listReactFiles from "list-react-files"

const removeExt = path => path.replace(/\.[^.]+$/, "")

const getComponentName = path =>
  path.split("/").reduce((name, part) => {
    if (/^[A-Z]/.test(part)) {
      return removeExt(part)
    } else if (/^((?!index).+)\.[^.]+$/.test(part)) {
      return upperFirst(camelCase(removeExt(part)))
    }
    return name
  }, "")

const getComponentFolder = path => {
  const name = getComponentName(path)
  return dirname(path).split("/").reduce((folder, part) => {
    if (removeExt(part) === name) {
      return folder
    }
    return join(folder, part)
  }, "./")
}

const isSingleFile = path => {
  const name = getComponentName(path)
  const [ dir ] = dirname(path).split("/").reverse()
  return dir !== name
}

const getFiles = (cwd, componentName) => {
  const extensions = "{js,ts,jsx,tsx,css,less,scss,sass,sss,json,md,mdx}"
  const pattern = componentName ? `**/${componentName}{.,.*.}${extensions}` : `**/*.${extensions}`
  return glob.sync(pattern, { cwd, absolute: true, nodir: true })
}

// 获取组建路径信息
const getComponentFiles = (root, workingDir = process.cwd()) =>
  listReactFiles(root).then(files =>
    files.map(path => {
      const name = getComponentName(path)

      const absolutePath = join(root, path)
      const relativePath = relative(workingDir, absolutePath)
      return {
        name: `${name} ${gray(relativePath)}`,
        short: name,
        value: absolutePath,
      }
    })
  )

// 替换指定内容
const replaceContents = (contents, oldName, newName) =>
  contents.replace(
    new RegExp(
      `([^a-zA-Z0-9_$])${oldName}([^a-zA-Z0-9_$]|Container)|(['|"]./[a-zA-Z0-9_$]*?)${oldName}([a-zA-Z0-9_$]*?)`,
      "g"
    ),
    `$1$3${newName}$2$4`
  )

// 大小写名字都替换
const replaceContentsHasLowerCase = (contents, oldName, newName) =>
  contents.replace(
    new RegExp(
      `([^a-zA-Z0-9_$])(${oldName}|${oldName.toLowerCase()})([^a-zA-Z0-9_$]|Container)|(['|"]./[a-zA-Z0-9_$]*?)(${oldName}|${oldName.toLowerCase()})([a-zA-Z0-9_$]*?)`,
      "g"
    ),
    `$1$4${newName}$3$6`
  )

// 替换 css 引入路径
const replaceLessImport = (contents, newContent) =>
  contents.replace(new RegExp(/@import\s+"[./\-\w]+";/), `@import "${newContent}";`)


  // 数组扁平化
function flatten(arr) {
  var res = []
  arr.map(item => {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item))
    } else {
      res.push(item)
    }
  })
  return res
}

// 时间格式化
Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      )
  return fmt
}

// 添加文件头
const addFileHeader = content => {
  // 如果没有文件头就添加文件头
  // 有文件头就替换文件头
  const reg = new RegExp(/\/\*\n\s\*\s+@Author([\w\W]*)\* @Last Modified time([\w\W]*)\n\*\//)
  const userName = gitUserName()
  const fileHeader = `/*
* @Author: ${userName}
* @ModuleName: undefined
* @Date: ${new Date().Format("yyyy-MM-dd HH:mm:s")}
* @Last Modified by: ${userName}
* @Last Modified time: ${new Date().Format("yyyy-MM-dd HH:mm:s")}
*/

`
  if (reg.test(content)) {
    return contents.replace(reg, `${fileHeader}`)
  }
  return fileHeader + content
}



export {
  removeExt,
  getComponentName,
  getComponentFolder,
  isSingleFile,
  getFiles,
  getComponentFiles,
  replaceContents,
  replaceContentsHasLowerCase,
  replaceLessImport,
  flatten,
  addFileHeader,
}
