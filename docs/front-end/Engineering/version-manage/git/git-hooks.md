---
outline: deep
---
## git hooks
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
