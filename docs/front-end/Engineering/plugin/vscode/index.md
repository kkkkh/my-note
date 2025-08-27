---
outline: deep
---
# Vscode
## 设置
### settings.json
打开：ctrl + shift + p ，输入 Preferences: Open User Settings (JSON)
```json
{
	"editor.minimap.enabled": true, // 右侧代码缩略图
	"editor.scrollbar.vertical": "visible", // 右侧滚动条
 	"editor.scrollbar.verticalScrollbarSize": 12, // 右侧滚动条宽度
	"terminal.integrated.env.windows": { // vscode 终端设置环境变量
		"Path": "${env:Path};D:\\Program Files\\mingw64\\bin"
	},
	"terminal.integrated.defaultProfile.windows": "Git Bash", // 设置vscode 终端默认
	"editor.tabCompletion": "on" // or onlySnippets 输入代码片段，按tab
}
```
### 快捷操作
- 快捷键
  - 所有折叠：Ctrl + k & Ctrl + 0
  - 所有展开：Ctrl + k & Ctrl + j
  - 单行注释：Ctrl + /
  - 多行注释：Shift + Alt + A
- code 打开 VSCode
  ```bash
  # 配置
  # View -> Command Palette / 查看 -> 命令面板 / ctrl + shift + p
  # 输入install code -> 选择提示的Shell Command: Install 'code' command in PATH 回车
  code /path/to/my/project # 打开 VSCode
  ```
- 重构
  ```js
  const handleBoard = async () => {
    ...
  }
  ```
  - 选中下边的代码
  - ⌃⇧R/ctrl+shift+R 或右键打开重构菜单，选择“移动到新文件”/“转换为命名函数”/“将命名导出项转换为默认导出项”
- 代码冲突（接受所有当前更改）
  - 打开命令面板：按下 Ctrl + Shift + P
  - 输入 "Merge"
  - 选择 "接受所有当前更改"（Accept All Current Changes）。
### 调试
- launch.json(启动配置文件)：配置调试器，用于启动和控制调试会话
- tasks.json(任务配置文件)： 定义可以由 VS Code 运行的自动化任务：编译代码、运行测试、部署应用程序等
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
      {
          "name": "调试主进程",//name是配置名称，此名称将会显示在调试界面的启动调试按钮旁边。
          "type": "node",// type是调试环境，此处调试环境是Node.js环境。
          "request": "launch",
          "cwd": "${workspaceRoot}",// ${workspaceRoot}是正在进行调试的程序的工作目录的绝对路径
          "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron", //runtimeExecutable指向的是批处理文件，该批处理文件用于启动Electron。
          "windows": {
            "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron.cmd"
          },
          "args": ["."],//args是启动参数 （此处的值是主进程程序路径的简写形式，填写“./index.js”亦可） 。
          "outputCapture": "std"
      }
  ]
}
```
参考：
- [Debug code with Visual Studio Code](https://code.visualstudio.com/docs/debugtest/debugging)
### 片段 snippets
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
- html -> markdown.json
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
		"description": "markdown code"
	}
}
```
## 插件
#### 开发插件
1、markdown：text => markdown table
2、markdown：绝对路径 => 可配置
https://code.visualstudio.com/api/get-started/your-first-extension
#### 通用
- [Reload](https://marketplace.visualstudio.com/items?itemName=natqe.reload) 重新加载
- [Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- [Five Server](https://marketplace.visualstudio.com/items?itemName=yandeu.five-server) 可以对当前目录启动服务
- [Tabnine](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)
- [package-json-inspector](https://marketplace.visualstudio.com/items?itemName=kricsleo.vscode-package-json-inspector) 查看 package.json 文件
- 主题
  - [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
  - [Atom One Dark Theme](https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark) 主题
  - [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
#### 规范
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) .eslintrc
- [ESLint Chinese Rules](https://marketplace.visualstudio.com/items?itemName=maggie.eslint-rules-zh-plugin) ESLint规则中文辅助提示插件，帮助更便捷的查询引用的规则，理解规则。
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) .editorconfig
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) .prettierrc
- [JSDoc Generator](https://marketplace.visualstudio.com/items?itemName=crystal-spider.jsdoc-generator)
- [Comment Translate](https://github.com/intellism/vscode-comment-translate/blob/HEAD/doc/README_ZH.md) 代码翻译
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) 拼写错误
- [A-super-translate](https://marketplace.visualstudio.com/items?itemName=xuedao.super-translate)
#### html
- [auto-close-tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
- [template string converter](https://marketplace.visualstudio.com/items?itemName=meganrogge.template-string-converter) `${}`
- [parameter-hints](https://marketplace.visualstudio.com/items?itemName=DominicVonk.parameter-hints) 参数提示
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense) 路径提示
- [path-autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete) 路径处理
  ```json
  {
  	// 重置markdown 链接路径
  	"path-autocomplete.triggerOutsideStrings":true,
    "path-autocomplete.pathMappings": {
        "/": "${folder}/docs/",
    },
  }
  ```
#### css
- [easy Less](https://developers.weixin.qq.com/community/develop/article/doc/000e427c49c218e6b9781bfdf5b013)
- [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)
- [svg-preview](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.svg-preview)
- tailwind
  - [Tailwind CSS Extension Pack](https://marketplace.visualstudio.com/items?itemName=andrewmcodes.tailwindcss-extension-pack)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) tailwind.config.{js,cjs,mjs,ts,cts,mts} in your workspace
#### react
- [react hooks snippets](https://marketplace.visualstudio.com/items?itemName=AlDuncanson.react-hooks-snippets)
  - ush	-> useState
- [appworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.appworks&ssr=false#overview)
#### vue
  - [vetur](https://vuejs.github.io/vetur/)
  - vue.volar ~~原 TypeScript Vue Plugin(Volar) 废弃~~ -> Vue-Official
  - [Vue-Official](https://marketplace.visualstudio.com/items?itemName=vue.volar) https://github.com/vuejs/language-tools
  - [vue-component](https://marketplace.visualstudio.com/items?itemName=zhubincong.vue-component)
  - [Vue 3 Snippets](https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets)
#### snippet
- [snippet-generator](https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode)
- [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=jmsv.JavaScriptSnippetsStandard)
  - nfn→	creates a named function const add = (params) => {}
- [vue3-snippets-for-vscode](https://marketplace.visualstudio.com/items?itemName=wejectchan.vue3-snippets-for-vscode)
  - vinit -> `<template></template><script setup lang="ts"></script><style></style>`
- [Markdown Snippets](https://marketplace.visualstudio.com/items?itemName=robole.markdown-snippets)
- [Snippets Ranger](https://marketplace.visualstudio.com/items?itemName=robole.snippets-ranger)
- [jest-snippets](https://marketplace.visualstudio.com/items?itemName=andys8.jest-snippets)
#### markdown
- [markdown-all-in-one](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
  - "markdown.extension.completion.root":"${workspaceFolder}/docs" 没有生效
  - 参考：[issues](https://github.com/yzhang-gh/vscode-markdown/issues/548) [代码](https://github.com/yzhang-gh/vscode-markdown/blob/master/src/completion.ts#L387)
- [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)
- [Markdown table prettifier](https://marketplace.visualstudio.com/items?itemName=darkriszty.markdown-table-prettify) 格式化md table
- [excel-to-markdown-table](https://marketplace.visualstudio.com/items?itemName=csholmq.excel-to-markdown-table&ssr=false#review-details) 自动生成md table（Shift+Alt+V）
#### runner
- [code-runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)
- [jest-runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)
- [vitest-runner](https://marketplace.visualstudio.com/items?itemName=kingwl.vscode-vitest-runner)
#### c/c++
- [C/C++ for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)
#### git
- [Git Extension Pack](https://marketplace.visualstudio.com/items?itemName=donjayamanne.git-extension-pack)
#### python
- [用 VS Code 写 Python，这几个插件是必装的](https://cloud.tencent.com/developer/article/1786086)
- [VSCode最新格式化Python文件的方法](https://blog.csdn.net/StephanieXYM/article/details/133767499)
#### 参考
- [分享 VSCode 必备精品插件](https://blog.csdn.net/Mirs_Zhu/article/details/141431948)
