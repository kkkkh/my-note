---
outline: deep
---
# git
## git hooks
### husky
- [husky](https://typicode.github.io/husky/) 触发git hooks
```bash
pnpm add --save-dev husky
npx husky init
```
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npm run lint-staged
```
### lint-staged
- [lint-staged](https://www.npmjs.com/package/lint-staged#configuration) 针对暂存的 git 文件运行 linter
```json
{
  "scripts": {
    "lint-staged": "lint-staged",
  },
  "lint-staged":{
    "*": "prettier --write",
    "*.ts": "eslint --fix",
    "*.{js,jsx}":"eslint"
  }
}
```
### release-it
- [release-it](https://github.com/release-it/release-it)
- [release-it/conventional-changelog](https://github.com/release-it/conventional-changelog) 版本提交日志
```bash
npx release-it
# 执行之后，相当于
# package.json  "version": "" + 1
# 提交了一条记录 chore: release v1（commitMessage）
# 并且打tag（tagName）
# CHANGELOG.md 中增加一条记录
```
```json
// .release-it.json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}"
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "infile": "CHANGELOG.md",
      "preset": {
        "name": "conventionalcommits",
        "types": [
          {"type": "feat", "section": "Features"},
          {"type": "fix", "section": "Bug Fixes"},
          {"type": "chore", "hidden": true},
          {"type": "docs", "hidden": true},
          {"type": "style", "hidden": true},
          {"type": "refactor", "hidden": true},
          {"type": "perf", "hidden": true},
          {"type": "test", "hidden": true}
        ]
      },
      "ignoreRecommendedBump": true,
      "strictSemVer": true
    }
  }
}
```
