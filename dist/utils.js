"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const prompts = require("./prompts");

const inquirer = require("inquirer");

const listReactFiles = require("list-react-files");

const _require = require("path"),
      basename = _require.basename,
      dirname = _require.dirname,
      isAbsolute = _require.isAbsolute,
      join = _require.join,
      relative = _require.relative;

const _require2 = require("lodash"),
      camelCase = _require2.camelCase,
      upperFirst = _require2.upperFirst;

const _require3 = require("chalk"),
      gray = _require3.gray;

console.log(listReactFiles, 'listReactFiles');

function errorName(name) {
  if (!name) throw new Error("name can not be undefined!");
}

function errorPath(name) {
  if (!name) throw new Error("name can not be undefined!");
}

function replaceFirstLetter(str) {
  return str.replace(/^\S/, s => s.toUpperCase());
}

function getType(program) {
  const type = program.opts().create;
  return type;
}

function getName(_x) {
  return _getName.apply(this, arguments);
}

function _getName() {
  _getName = _asyncToGenerator(function* (name) {
    try {
      if (!name) {
        name = name ? replaceFirstLetter(name) : "This";
        const answers = yield inquirer.prompt([prompts.name(name)]);
        name = replaceFirstLetter(answers.name);
        errorName(name);
      }

      return name;
    } catch (e) {
      console.log(`[getName error] ${e.message}`);
    }
  });
  return _getName.apply(this, arguments);
}

function getPath(_x2, _x3, _x4) {
  return _getPath.apply(this, arguments);
}

function _getPath() {
  _getPath = _asyncToGenerator(function* (path, cwd, name) {
    try {
      if (!path) {
        const answers = yield inquirer.prompt([prompts.folder(path || cwd, name)]);
        errorPath(name);
        path = answers.folder || cwd;
      }

      return isAbsolute(path) ? relative(process.cwd(), path) : path;
    } catch (e) {
      console.log(`[getPath error] ${e.message}`);
    }
  });
  return _getPath.apply(this, arguments);
}

function copy(type, path) {}

function ReplaceContent() {}

function logInfo() {}

const removeExt = path => path.replace(/\.[^.]+$/, '');

const getComponentName = path => path.split('/').reduce((name, part) => {
  if (/^[A-Z]/.test(part)) {
    return removeExt(part);
  } else if (/^((?!index).+)\.[^.]+$/.test(part)) {
    return upperFirst(camelCase(removeExt(part)));
  }

  return name;
}, '');

const getComponentFiles = (root, workingDir) => listReactFiles.default(root).then(files => files.map(path => {
  const name = getComponentName(path);
  const absolutePath = join(root, path);
  const relativePath = relative(workingDir, absolutePath);
  return {
    name: `${name} ${gray(relativePath)}`,
    short: name,
    value: absolutePath
  };
}));

module.exports = {
  getType,
  getName,
  getPath,
  copy,
  ReplaceContent,
  logInfo,
  getComponentFiles
};