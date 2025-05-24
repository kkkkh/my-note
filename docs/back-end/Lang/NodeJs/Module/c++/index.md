---
outline: deep
---
# c++ addon
## node gyp
1、安装node-gyp
```bash
npm install -g node-gyp
```
2、安装 python  C/C++ compiler
windows 安装
- Chocolatey 安装
```bash
choco install python visualstudio2022-workload-vctools -y
```
- 手动安装
  - Microsoft Store 安装python
  -  Visual Studio  + Visual C++ build tools
  -  Powershell module: VSSetup
3、addon.cc c++文件
```c++
// node_api.h 通常位于 Node.js 的开发文件目录中。
  // Node.js 的开发文件
  // 当你运行 node-gyp configure 命令时，node-gyp 会根据你的 Node.js 版本下载相应的开发文件，并将它们存储在特定的目录中
// 这个目录的具体位置取决于你的操作系统、Node.js 版本以及安装方式。
// 常见位置：
// Windows: C:\Users\<YourUsername>\AppData\Local\node-gyp\Cache\<NodeVersion>\include\node
// macOS: ~/.node-gyp/<NodeVersion>/include/node
// Linux: ~/.node-gyp/<NodeVersion>/include/node
#include <node_api.h> // 找不到，提示请更新 includePath
...
```
- c/c++ 插件 配置文件
```json
{
    "configurations": [
        {
            "name": "Win32",
            "includePath": [
                "C:\\Users\\****\\AppData\\Local\\node-gyp\\Cache\\20.15.1\\include\\node" // node_api.h在这个目录下
            ],
            "defines": [
                "_DEBUG",
                "UNICODE",
                "_UNICODE"
            ],
            "windowsSdkVersion": "10.0.22621.0",
            "compilerPath": "cl.exe",
            "cStandard": "c17",
            "cppStandard": "c++17",
            "intelliSenseMode": "windows-msvc-x64"
        }
    ],
    "version": 4
}
```
3、binding.gyp配置文件 & 打包
- binding.gyp
```json
{
  "targets": [
    {
      "target_name": "binding",
      "sources": [ "src/binding.cc" ]
    }
  ]
}
```
- addonm.cc
- 打包
```bash
node-gyp configure
node-gyp build
```
4、js 引入 c++ 扩展 .node文件

<<< ./index.js#addon

- 参考
  - [node-gyp](https://github.com/nodejs/node-gyp?tab=readme-ov-file) 将 C/C++ 库编译为二进制文件，直接在 Node.js 中运行
  - [vssetup.powershell](https://github.com/microsoft/vssetup.powershell) PowerShell 中调用 Visual Studio 的编译工具
  - [c++ addons](https://nodejs.org/api/addons.html) c++ addons 示例
  - [c++ addons with node-api](https://nodejs.org/api/n-api.html) 暴露api为主
