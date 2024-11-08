# npm
## npm command
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
## package.json
- 版本
1.0.0 主版本号.次版本号.补丁版本号
~1.0.4 更新 1.0.x
^1.0.4 更新 1.x.x
```json
{
  "devDependencies":{
    "vue": "^3.5.12",
  }
}
```
- 同时安装不同版本
```bash
npm install vue2@npm:vue@^2.6.14
npm install vue3@npm:vue@^3.2.37
```
```bash
pnpm add @antv/x6-v2@npm:@antv/x6@^2.18.1 -D
# 别名 @antv/x6-v2
# 连接 @npm
# 找对应包 @antv/x6@^2.18.1
```
```json
{
  "devDependencies":{
    "@antv/x6-v2": "npm:@antv/x6@^2.18.1",
  }
}
```
