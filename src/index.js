import { join, relative, isAbsolute, resolve } from "path"
import { camelCase, upperFirst } from "lodash"
import { red, white } from "chalk"
import { getComponentName, getComponentFolder } from "./utils"
import replicateComponent from "./replicateComponent"
import replicatePage from "./replicatePage"

import scan from "./scan"
import { componentAnswers } from "./answers"
const log = console.log
const defaultCompnentDir = resolve(__dirname, "../templates")

const generate = async (program, { cwd }) => {
  try {
    const opts = program.opts()
    const [ targetName, originalDirectory, targetFolder ] = program.args
    
    // 如果给要复制的源路径就添加源路径
    const scanComponentDirectorys = [ defaultCompnentDir ]
    if (originalDirectory) scanComponentDirectorys.push(originalDirectory)
    const originalCompnentPath = await scan(scanComponentDirectorys)

    // 获取 要更改的组建名称 和 路径地址
    const originalName = getComponentName(originalCompnentPath)
    const absolutePath = isAbsolute(originalCompnentPath)
      ? originalCompnentPath
      : join(process.cwd(), originalCompnentPath)
    const relativePath = relative(process.cwd(), absolutePath)
    const originalFolder = getComponentFolder(relativePath)
    const answers = await componentAnswers({
      targetName,
      originalName,
      targetFolder,
      originalFolder,
    })
    if(opts.create.toLowerCase() === 'component'){
      replicateComponent(originalCompnentPath, answers)
    }else{
      replicatePage(originalCompnentPath, answers)
    }
  } catch (e) {
    log(red.bold(`[generate] `) + white(`${e}`))
  }
}

export default generate
