#### git rebase 后代码不见了, 找回消失的commit
- 使用git log看不到
- 使用`git reflog`
```bash
cd191e4 HEAD@{3}: rebase -i (finish): returning to refs/heads/feature-live1
cd191e4 HEAD@{4}: rebase -i (pick): Merge made by the 'recursive' strategy.
8322d99 HEAD@{5}: commit (amend): add live model
```
```bash
git checkout -b branch-bak [commit-sha]
git checkout -b branch-bak 8322d99
```

#### github 提交了git应该忽略的文件，怎么删除掉
- 文件名添加到 .gitignore
- git rm --cached <文件或目录名称>
- git commit -m ""
- git push

#### git submodule 子项目报错
WARNING in ../../node_modules/prettier/index.js 
Critical dependency: the request of a dependency is an expression
- 原因：
  - 1、子项目的webpack配置externals:[nodeExternals()]，不做子模块不报错；
  - 2、父模块跟子模块使用了相同的依赖，prettier，很明显在去除包的时候，去父级目录找，系统认定是一个表达式
  - 3、externals:[nodeExternals(),/^prettier/]可以解决报错；

#### 引用子模块vue
- 场景：主项目引用了submodule的vue文件
- 错误：TypeError: Failed to fetch dynamically imported module
- 原因：
  - 以为是vite无法引入submodule的vue文件，因为之前引用js/ts文件的方法
  - 使用了一个非常简单的vue文件，这个文件没有任何引用，就不报错了，其他引用路径不对造成的
- 解决：
  - submodule中的文件的引用，要对于自身和主项目是一样的
  - 是用主项目名称（package.json的name）解决
  - 在子项目的tsconfig.json和vite.config.js中设置，目的就是兼顾到主项目的引入
  ```js
    // vite
    {
      alias: {
       "generator-gql": path.resolve(__dirname, './'),
      }
    }
    // tsconfig
    {
        "paths": {
          "name/*": ["./*"]
        }
    }
  ```
  - 在submodule中的引用，要使用这个别名`import {get} from 'name/src/main'`
  - 因为这样对于主项目来说，也可以通过这个路径找到的，
  - 如果只按照submodule自己的路径设置，按照自己的tsconfig.json和vite.config.js理解，就不一致会报错
