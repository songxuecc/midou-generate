import { basename, dirname, isAbsolute, join, relative, resolve } from "path"
import { copy, move, readFileSync, writeFileSync } from "fs-extra"
import { red } from "chalk"
import { FindFile } from "./file"
import {
  getComponentName,
  isSingleFile,
  getFiles,
  replaceContents,
  replaceContentsHasLowerCase,
  replaceLessImport,
  addFileHeader,
} from './utils'

// 更换组建名称
// 更换 css 路径 先找到 src
// 更换 Author Name
export const replicateComponent = async (originalPath, answers, workingDir = process.cwd()) => {
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
              const relativePath = relative(resolve(file, "../"), defLessPath)
              contents = replaceLessImport(contents, relativePath)
            }
          } catch (e) {
            red.bold(`[generate] find def.less error : ${e}`)
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
    red.bold(`[generate] error: ${e.message}`)
  }
}

export default replicateComponent