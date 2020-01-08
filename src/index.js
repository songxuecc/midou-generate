import { join, relative, isAbsolute, resolve } from "path"
import { red } from "chalk"
import { getComponentName, getComponentFolder , replicate } from "./utils"
import scan from "./scan"
import { componentAnswers } from "./answers"

const defaultCompnentDir = resolve(__dirname, "../templates")

const generate = async (program, { cwd }) => {
  try {
    const type = program.opts()
    const [ targetName, targetFolder, originalDirectory ] = program.args

    // 如果给要复制的源路径就添加源路径
    // const originalDirectory = false
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
    replicate(originalCompnentPath,answers)
  } catch (e) {
    red(`[generate] error: ${e.message}`)
  }
}

export default generate
 