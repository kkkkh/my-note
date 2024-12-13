# pnpm
## pnpm command [官方连接](https://pnpm.io/cli/add)
### pnpm remove
Aliases: rm, uninstall, un
```bash
pnpm remove
```
### pnpm link / unlink
- pnpm link <dir> 和 pnpm link --dir <dir> 之间的区别​
```bash
# The current directory is foo
# 在一个项目下，link到外部的包
pnpm link ../bar
- foo
  - node_modules
    - bar -> ../../bar
- bar
# The current directory is bar
# 在包目录下，将包连接到外部
pnpm link --dir ../foo
- foo
  - node_modules
    - bar -> ../../bar
- bar
```
- global
```bash
cd ~/projects/foo
pnpm install # install dependencies of foo
pnpm link --global # link foo globally
cd ~/projects/my-project
pnpm link --global foo # link foo to my-project
```
- unlink
```bash
# 项目内的所有链接依赖项都将取消链接
pnpm unlink
# pnpm在删除外部链接后重新安装依赖项
# 如果pckageName在package.json 中会重新安装
pnpm unlink <package>
# 彻底删除
pnpm uninstall --global <package>
```
### [pnpm update](https://pnpm.io/cli/update)
```bash
# 更新所有依赖项，遵守 package.json 中指定的范围
pnpm up
# 将所有依赖项更新到最新版本
pnpm up --latest 
# v2 的最新版本
pnpm up foo@2
```
### pnpm --filter
```bash
pnpm --filter "@babel/core" test
pnpm --filter "@babel/*" test
pnpm --filter "*core" test
```
