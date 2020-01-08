"use strict";

const _require = require("path"),
      isAbsolute = _require.isAbsolute,
      relative = _require.relative;

const component = files => ({
  type: "autocomplete",
  name: "component",
  message: "Which component do you want to replicate?",
  source: (_, input) => Promise.resolve(files.filter(file => !input || file.value.toLowerCase().indexOf(input.toLowerCase()) >= 0))
});

const name = originalName => ({
  type: "input",
  name: "name",
  message: `How do you want to name ${originalName} component?`,
  default: originalName === "This" ? undefined : originalName
});

const folder = (originalFolder, name) => ({
  type: "input",
  name: "folder",
  message: `In which folder do you want to put ${name} component?`,
  default: originalFolder,
  filter: input => isAbsolute(input) ? relative(process.cwd(), input) : input
});

module.exports = {
  component,
  name,
  folder
};