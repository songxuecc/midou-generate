import { basename, dirname, isAbsolute, join, relative, resolve } from "path"
import { camelCase, upperFirst } from "lodash"
import { gray, red } from "chalk"
import glob from "glob"
import gitUserName from "git-user-name"
import listReactFiles from "list-react-files"
import { copy, move, readFileSync, writeFileSync } from "fs-extra"
import { FindFile } from "./file"

const removeExt = path => path.replace(/\.[^.]+$/, "")

export const getComponentName = path =>
  path.split("/").reduce((name, part) => {
    if (/^[A-Z]/.test(part)) {
      return removeExt(part)
    } else if (/^((?!index).+)\.[^.]+$/.test(part)) {
      return upperFirst(camelCase(removeExt(part)))
    }
    return name
  }, "")

export const getComponentFolder = path => {
  const name = getComponentName(path)
  return dirname(path).split("/").reduce((folder, part) => {
    if (removeExt(part) === name) {
      return folder
    }
    return join(folder, part)
  }, "./")
}

export const isSingleFile = path => {
  const name = getComponentName(path)
  const [ dir ] = dirname(path).split("/").reverse()
  return dir !== name
}

export const getFiles = (cwd, componentName) => {
  const extensions = "{js,ts,jsx,tsx,css,less,scss,sass,sss,json,md,mdx}"
  const pattern = componentName ? `**/${componentName}{.,.*.}${extensions}` : `**/*.${extensions}`
  return glob.sync(pattern, { cwd, absolute: true, nodir: true })
}
// 获取组建信息
export const getComponentFiles = (root, workingDir = process.cwd()) =>
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
export const replaceContents = (contents, oldName, newName) =>
  contents.replace(
    new RegExp(
      `([^a-zA-Z0-9_$])${oldName}([^a-zA-Z0-9_$]|Container)|(['|"]./[a-zA-Z0-9_$]*?)${oldName}([a-zA-Z0-9_$]*?)`,
      "g"
    ),
    `$1$3${newName}$2$4`
  )
// 大小写名字都替换
export const replaceContentsHasLowerCase = (contents, oldName, newName) =>
  contents.replace(
    new RegExp(
      `([^a-zA-Z0-9_$])(${oldName}|${oldName.toLowerCase()})([^a-zA-Z0-9_$]|Container)|(['|"]./[a-zA-Z0-9_$]*?)(${oldName}|${oldName.toLowerCase()})([a-zA-Z0-9_$]*?)`,
      "g"
    ),
    `$1$4${newName}$3$6`
  )
// 替换 css 引入路径
export const replaceLessImport = (contents, newContent) =>
  contents.replace(new RegExp(/@import\s+"[./\-\w]+";/), `@import "${newContent}";`)

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
  console.log(content,'content')

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

// 更换组建名称
// 更换 css 路径 先找到 src
// 更换 Author Name
export const replicate = async (originalPath, answers, workingDir = process.cwd()) => {
  try {
    const originalName = getComponentName(originalPath)
    const absolutePath = isAbsolute(originalPath) ? originalPath : join(workingDir, originalPath)
    const promises = []
    if (isSingleFile(originalPath)) {
      const files = getFiles(dirname(absolutePath), originalName)
      files.forEach(async file => {
        const filename = basename(file).replace(originalName, answers.name)
        const destinationPath = join(workingDir, answers.folder, filename)
        const promise = copy(file, destinationPath).then(() => {
          const contents = readFileSync(destinationPath).toString()
          writeFileSync(destinationPath, replaceContents(contents, originalName, answers.name))
        })
        promises.push(promise)
      })
    } else {
      const destinationPath = join(workingDir, answers.folder, answers.name)
      await copy(dirname(absolutePath), destinationPath)
      const files = getFiles(destinationPath)
      files.forEach(async file => {
        let contents = readFileSync(file).toString()
        let name = answers.name
        // 替换文件内容正则
        let replaceContentsFunc = undefined
        // 如果是css文件 则更换 less 引入 如果是less文件 则新命名为小写 将里面的大小写内容全替换小写
        if (file.indexOf(".less") > -1) {
          name = name.toLowerCase()
          replaceContentsFunc = replaceContentsHasLowerCase
          try {
            const { find } = new FindFile()
            const findPath = process.cwd().split("/src")[0]
            // 查找common文件夹路径
            const defLessPath = await find(findPath, "def.less")
            if (defLessPath) {
              console.log(defLessPath, "defLessPath")
              const relativePath = relative(resolve(file, "../"), defLessPath)
              contents = replaceLessImport(contents, relativePath)
            }
          } catch (e) {
            red(`[FindFile] find def.less error : ${e}`)
          }
        } else {
          replaceContentsFunc = replaceContents
        }
        const renamedPath = join(dirname(file), basename(file).replace(originalName, name))
        const nextContent = replaceContentsFunc(contents, originalName, name)
        writeFileSync(file, addFileHeader(nextContent))
        if (file !== renamedPath) {
          const promise = move(file, renamedPath)
          promises.push(promise)
        }
      })
    }
    await Promise.all(promises)
  } catch (e) {
    red(`[replicate] error: ${e.message}`)
  }
}

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

export { flatten }
