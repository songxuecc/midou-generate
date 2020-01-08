import inquirer from "inquirer"
import { name, folder } from "./prompts"

const componentAnswers = async ({ targetName, originalName, targetFolder, originalFolder }) => {
  const answers = await inquirer.prompt([
    name(originalName, targetName),
    folder(targetFolder || originalFolder),
  ])
  return answers
}

export { componentAnswers }
