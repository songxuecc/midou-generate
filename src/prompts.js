import { isAbsolute, relative } from "path"

export const component = files => ({
  type: "autocomplete",
  name: "component",
  message: "Which component do you want to replicate?",
  source: (_, input) =>
    Promise.resolve(
      files.filter(file => !input || file.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    ),
})

export const name = (originalName,targetName) => ({
  type: "input",
  name: "name",
  message: `How do you want to name ${originalName} component?`,
  default: targetName,
})

export const folder = (targetFolder) => ({
  type: "input",
  name: "folder",
  message: answers => `In which folder do you want to put ${answers.name} component?`,
  default: targetFolder,
  filter: input => (isAbsolute(input) ? relative(process.cwd(), input) : input),
})
