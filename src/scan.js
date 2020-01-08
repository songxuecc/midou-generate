import { join, isAbsolute } from "path"
import { cyan, green, red } from "chalk"
import inquirer from "inquirer"
import autocomplete from "inquirer-autocomplete-prompt"
import ora from "ora"
import { getComponentFiles,flatten } from "./utils"
import { component, name, folder } from "./prompts"

const scan = async (roots = [ process.cwd() ]) => {
  const promiseFile = []
  roots.forEach(root => {
    const absoluteRoot = isAbsolute(root) ? root : join(process.cwd(), root)
    promiseFile.push(getComponentFiles(absoluteRoot))
  })
  const shouldFlattenfiles = await Promise.all(promiseFile)
  const files = flatten(shouldFlattenfiles)

  if (!files.length) {
    console.log(red.bold("No components found! :(\n"))
    console.log(
      `Make sure you are running ${cyan(
        "generact"
      )} inside a React-like project directory or using ${green("root")} option:\n`
    )
    console.log(
      `    ${cyan("$ generact")} ${green(
        "--root relative/or/absolute/path/to/any/react/project"
      )}\n`
    )
    console.log(
      `If you are already doing that, it means that ${cyan(
        "generact"
      )} could not find your React component files automagically.`
    )
    console.log("In this case, you can explicitly pass the component path to replicate:\n")
    console.log(
      `    ${cyan("$ generact")} ${green("relative/or/absolute/path/to/my/react/component.js")}\n`
    )
    return process.exit(1)
  }

  inquirer.registerPrompt("autocomplete", autocomplete)
  const answers = await inquirer.prompt([ component(files) ])
  return answers.component
}

export default scan
