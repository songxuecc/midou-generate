#!/usr/bin/env node

/*
 * @Author: 祢豆
 * @Date: 2020-01-07 17:33:30
 * @Last Modified by: 祢豆
 * @Last Modified time: 2020-01-09 21:30:27
 */
const program = require("commander")
const generate = require("../lib/index").default

program
  .version("1.0.19", "-v, --vers", "output the current version")
  .option("create [page] [name] [path]", "生成页面")
  .option("create [component] [name] [originalDirectory] [path] ", "生成component")
  .parse(process.argv)

generate(program, {
  cwd: process.cwd(),
})
