"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import { join, isAbsolute } from 'path'
// import { cyan, green, red } from 'chalk'
// import inquirer from 'inquirer'
// import autocomplete from 'inquirer-autocomplete-prompt'
// import ora from 'ora'
// import {getComponentFiles} from './utils'
const scan =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (root = process.cwd()) {
    console.log("scan"); // const absoluteRoot = isAbsolute(root) ? root : join(process.cwd(), root)
    // const spinner = ora(`Scanning ${green(absoluteRoot)} for React component files...`).start()
    // const files = await getComponentFiles(absoluteRoot)
    // spinner.stop()
    // if (!files.length) {
    //   console.log(red.bold('No components found! :(\n'))
    //   console.log(`Make sure you are running ${cyan('generact')} inside a React-like project directory or using ${green('root')} option:\n`)
    //   console.log(`    ${cyan('$ generact')} ${green('--root relative/or/absolute/path/to/any/react/project')}\n`)
    //   console.log(`If you are already doing that, it means that ${cyan('generact')} could not find your React component files automagically.`)
    //   console.log('In this case, you can explicitly pass the component path to replicate:\n')
    //   console.log(`    ${cyan('$ generact')} ${green('relative/or/absolute/path/to/my/react/component.js')}\n`)
    //   return process.exit(1)
    // }
    // inquirer.registerPrompt('autocomplete', autocomplete)
    // const answers = await inquirer.prompt([component(files)])
    // return answers.component
  });

  return function scan() {
    return _ref.apply(this, arguments);
  };
}();

var _default = scan;
exports.default = _default;