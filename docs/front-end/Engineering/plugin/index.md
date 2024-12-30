---
outline: deep
---
## Vscode
### 快捷键
- 所有折叠：Ctrl + k & Ctrl + 0
- 所有展开：Ctrl + k & Ctrl + j
- code /path/to/my/project 的方式打开 VSCode
  ```bash
  View -> Command Palette / 查看 -> 命令面板 / ctrl + shift + p 
  输入install code -> 选择提示的Shell Command: Install 'code' command in PATH 回车
  命令行 code /path/to/my/project 的方式打开 VSCode
  ```
- 重构
  ```js
  const handleBoard = async () => {
    ...
  }
  ```
  - 选中下边的代码
  - ⌃⇧R/ctrl+shift+R 或右键打开重构菜单，选择“移动到新文件”/“转换为命名函数”/“将命名导出项转换为默认导出项”

### 插件
#### 通用
- [Reload](https://marketplace.visualstudio.com/items?itemName=natqe.reload) 重新加载
- [ESLint Chinese Rules](https://marketplace.visualstudio.com/items?itemName=maggie.eslint-rules-zh-plugin) ESLint规则中文辅助提示插件，帮助更便捷的查询引用的规则，理解规则。
- [Comment Translate](https://github.com/intellism/vscode-comment-translate/blob/HEAD/doc/README_ZH.md) 代码翻译
#### css
- [easy Less](https://developers.weixin.qq.com/community/develop/article/doc/000e427c49c218e6b9781bfdf5b013) 
#### react
- [react hooks snippets](https://marketplace.visualstudio.com/items?itemName=AlDuncanson.react-hooks-snippets)
  - ush	-> useState
#### vue
  - [vetur](https://vuejs.github.io/vetur/)
  - vue.volar ~~原 TypeScript Vue Plugin(Volar) 废弃~~ -> Vue-Official
  - [Vue-Official](https://marketplace.visualstudio.com/items?itemName=vue.volar) 
  - https://github.com/vuejs/language-tools
#### snippet
- [snippet-generator](https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode)
- [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=jmsv.JavaScriptSnippetsStandard)
  - nfn→	creates a named function const add = (params) => {}
- [vue3-snippets-for-vscode](https://marketplace.visualstudio.com/items?itemName=wejectchan.vue3-snippets-for-vscode)
  - vinit -> `<template></template><script setup lang="ts"></script><style></style>`
- [Markdown Snippets](https://marketplace.visualstudio.com/items?itemName=robole.markdown-snippets)
- [Snippets Ranger](https://marketplace.visualstudio.com/items?itemName=robole.snippets-ranger)

### snippets
#### html
- 1、ctrl + shift + p
- 2、snippets 配置用户代码片段
- 3、html -> html.json
- 4、增加模板
  ```json
  {
  	// Place your snippets for html here. Each snippet is defined under a snippet name and has a prefix, body and
  	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
  	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the
  	// same ids are connected.
  	// Example:
  	"html-base": {
  		"prefix": "htmlb",
  		"body": [
  			"<!DOCTYPE html>",
  			"<html lang='en'>",
  				"<head>",
  					"<meta charset='UTF-8'>",
  						"<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
  					"<title>Document</title>",
  					"<style>",
  					"</style>",
  				"</head>",
  				"<body>",
  					"<div>",
  					"</div>",
  					"<script>",
  					"$1"
  					"</script>",
  				"</body>",
  			"</html>",
  		],
  		"description": "html-module"
  	},
  	"html-module": {
  		"prefix": "htmlm",
  		"body": [
  			"<!DOCTYPE html>",
  			"<html lang='en'>",
  				"<head>",
  					"<meta charset='UTF-8'>",
  						"<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
  					"<title>Document</title>",
  					"<style>",
  					"</style>",
  				"</head>",
  				"<body>",
  					"<div>",
  					"</div>",
  					"<script type='module' src='./index.js'>",
  					"$1"
  					"</script>",
  				"</body>",
  			"</html>",
  		],
  		"description": "html-module"
  	}
  }
  ```
- 5、新建 Hhtml 文件，输入 htmlb 即可,$1 光标插入位置
#### markdown
- 3、html -> markdown.json
```json
{
	// Place your snippets for markdown here. Each snippet is defined under a snippet name and has a prefix, body and 
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the 
	// same ids are connected.
	// Example:
	"markdown": {
		"prefix": "mkbb",
		"body": [
			"```$1",
			"```"
		],
		"description": "Log output to console"
	}
}
```

