# yarn
## 命令行
### install
```bash
#安装
npm install -g yarn
npm install -g yarn@latest
yarn install --verbose # 安装时显示详细信息
yarn install --network-timeout 600000 --verbose # 设置网络超时时间
```
### config
```bash
# 获取当前的镜像源
yarn config get registry
# 设置镜像源
yarn config set registry https://registry.npmmirror.com
```
```bash
# 获取所有配置
yarn config list
# info yarn config
# {
#   'version-tag-prefix': 'v',
#   'version-git-tag': true,
#   'version-commit-hooks': true,
#   'version-git-sign': false,
#   'version-git-message': 'v%s',
#   'init-version': '1.0.0',
#   'init-license': 'MIT',
#   'save-prefix': '^',
#   'bin-links': true,
#   'ignore-scripts': false,
#   'ignore-optional': false,
#   registry: 'https://registry.npmmirror.com',
#   'strict-ssl': true,
#   'user-agent': 'yarn/1.22.22 npm/? node/v20.15.1 win32 x64',
#   lastUpdateCheck: 1747297696799
# }
# info npm config
# {
#   ...
# }
```
```bash
# 关闭代理设置
yarn config delete proxy
yarn config delete https-proxy
```
## 配置
### .yarnrc（Yarn v1）/ .yarnrc.yml（Yarn v2/v3）
```ini
registry "https://registry.npmjs.org/"
```
```yml
npmRegistryServer: "https://registry.npmjs.org"
```
