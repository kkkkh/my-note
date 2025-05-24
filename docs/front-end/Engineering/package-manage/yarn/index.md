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
### yarn link / unlink
```bash
# 在一个第三方包中
yarn link
yarn unlink
```
```bash
# 在项目中
# link 一个包
yarn link <package-name>
# 删除一个包
yarn unlink <package-name>
```
## 配置
### .yarnrc（Yarn v1）/ .yarnrc.yml（Yarn v2/v3）
```ini
registry "https://registry.npmjs.org/"
```
```yml
npmRegistryServer: "https://registry.npmjs.org"
```
## 对比
### yarn1 vs npm

优点：
- 1、引入了离线缓存机制，包安装速度明显快于当时的 npm（尤其是 npm 5 之前的版本），因为 Yarn 会缓存已下载的包，下一次直接复用，不用每次访问网络； npm 5+ 版本开始，内置了缓存机制，所有下载的包都会缓存到本地。
- 2、多线程并行网络请求，同时下载多个包；npm 6 和 7 之后明显增强了并行能力，npm 8 和 9继续优化并行处理，基本与 Yarn 持平。
- 3、扁平化依赖：相同版本的依赖集中安装在项目根的 node_modules 中；从 npm 3 开始，也引入了扁平化安装逻辑，努力减少依赖嵌套，优化文件结构。

缺点：
- 幻觉依赖：
  - 项目代码或某个包“依赖”了某个模块，但实际上没有在自己的 package.json 显式声明该依赖，而是“侥幸”通过扁平结构中其他依赖的存在而可以访问到这个模块。
  - 代码隐式依赖未声明，影响依赖管理的透明度和一致性。依赖间的隔离弱了
- 解决：
  - 从 Yarn 2 开始引入的 PnP 模式，彻底放弃 node_modules 目录，而是通过虚拟文件系统和依赖映射，明确记录每个包依赖的确切依赖关系和访问链。
  - PnP 能有效避免幻觉依赖，因为只有声明依赖的模块才能访问对应包，完全消除隐式访问。
  - PnP 大幅减少了隐式依赖带来的风险，提高了依赖管理准确度和安全性。

| 维度 | Yarn 1 | npm |
| --- | --- | --- |
| 速度 | 快（离线缓存+并行下载） | 缓慢到较快，npm 5 后改进明显 |
| 安装结构 | 扁平化依赖，node_modules | 扁平化依赖，但老版本实现差异较大 |
| 锁文件 | yarn.lock，更易读易合并 | package-lock.json |
| 离线模式 | 原生支持 | 较弱 |
| 依赖冲突解决 | 效果更好 | 较弱 |
| 校验安全 | 默认校验 | 5+ 版本开始支持 |

### yarn 1 / yarn 2 / yarn 3 / yarn 4 / pnpm
- yarn2 Plug'n'Play 更新
  - 优点：
    - PnP 不再生成 node_modules 文件夹，而是由 Yarn 生成一个特殊的 .pnp.cjs 文件（Nodeloader 文件）。
    - .pnp.cjs 文件内保存了项目完整的依赖关系映射树，记录了每个模块的确切位置和依赖信息。
    - Node.js 运行时通过这个 .pnp.cjs 文件进行定制的模块解析，告诉 Node 具体去哪里加载依赖包，而不是按照默认文件系统结构查找。
    - 这样，依赖解析变成了基于依赖映射的“直接引用”，无须访问 node_modules 文件夹。

  - 不足：
    - React Native 支持有限
    - 有学习曲线
- yarn 3 / yarn 4 是 yarn2 的优化
- yarn2 与 pnpm 性能基本持平

