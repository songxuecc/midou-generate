# midou-generate

## install
```javascript
npm install midou-generate -g
```

## scripts
```javascript

 midou-generate create component [name] [originalDirectory] [path] // 快速生成组建

 midou-generate create page [name] [originalDirectory] [path]  // 快速生成页面

```

| 字段      | 类型	     | 必填	     | 描述	     | 
| ---------- | :-----------:  | :-----------:  | :-----------:  | 
| type     | 'component' / 'page'      |  是     |  要复制的类型     | 
| name     | string      |  是     | 要命名的名称     | 
| originalDirectory | string      |  非     |   要复制的源文件路径     | 
| path     |  string      |  非     |  要复制的目标地址     | 


## 
此包会 列出 指定路径 originalDirectory 下的组建 询问复制哪个组建
然后更改命名输出到 指定路径 path 下   

另外 在templates内 加入默认组建 可以直接不用输入 originalDirectory


## todo 
添加 eslint
添加 test
添加 ts
添加 page 的复制粘贴模版