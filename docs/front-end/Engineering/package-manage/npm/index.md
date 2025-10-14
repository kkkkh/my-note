---
outline: deep
---
# npm
## npm command
### npm config
```bash
npm config set registry https://registry.npmmirror.com
```
### npm tag
```bash
npm dist-tag ls vue
# alpha: 3.5.0-alpha.5
# beta: 3.5.0-beta.3
# csp: 1.0.28-csp
# latest: 3.5.12
# legacy: 2.7.16
# rc: 3.5.0-rc.1
# v2-latest: 2.7.16
npm install typescript@beta
npm install typescript@latest
npm publish # 自动打上latest的tag
npm publish --tags beta # 打的就是 beta 的 tag
```
### npm link
```bash
# 包的目录
npm link
#  引入包的目录
npm link backageName
```
### npm uninstall
```bash
npm uninstall <packageName>
```
