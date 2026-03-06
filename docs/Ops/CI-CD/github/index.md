---
outline: deep
---
# github
## github 操作
### github docs
- vitepress中github配置
  - .github/workflows 目录中创建一个名为 deploy.yml 的文件
  - 项目vite base 选项配置正确
  - github 库设置中的“Pages”菜单项下，需要选择“Build and deployment > Source > GitHub Actions”
    - 一开始设置了 Build and deployment > Source > deploy from 分支，导致更新失败，页面一直404，可能因为 docs/ 目录是空的
    - 之前vitepress 项目分支选择的是 Build and deployment > Source > deploy from 分支,却可以每次更新成功，可能因为 docs/ 目录不是空的
  - `GitHub Actions` 和 `deploy from 分支` 区别
    - GitHub Actions 走 workflows中的deploy.yml部署脚本 -> 打包、发布
    - deploy from 分支，其实就是走 代码中，比如mian分支 下 docs/ 目录
- 参考
  - [github doc](https://docs.github.com/zh/get-started)
  - [web端操作移动文件位置 ](https://docs.github.com/zh/repositories/working-with-files/managing-files/moving-a-file-to-a-new-location)
  - [github Codespaces](https://docs.github.com/en/codespaces/quickstart)

#### github 个人主页
- [Managing your profile README](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme) 文档
- [emoji-cheat-sheet](https://www.webfx.com/tools/emoji-cheat-sheet/) emoji 表情
- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats/blob/master/docs/readme_cn.md) github status/Lang
- [github-profile-views-counter](https://github.com/antonkomarev/github-profile-views-counter?tab=readme-ov-file) 访问量
#### 获取数据
fetch 请求获取github公开markdown数据
- 格式
  - https://raw.githubusercontent.com/作者/项目/分支/路径/文件名.md
- 示例
  - https://raw.githubusercontent.com/nzakas/understandinges6/master/manuscript/00-Introduction.md

### github gists
- [github gists](https://gist.github.com/discover) 管理小段代码片段或文本文件

### GitHub双重验证（2FA）
- [GitHub双重验证（2FA）免手机号验证方案](https://juejin.cn/post/7293786856063434761)

## 开源
- [Contributor Covenant](https://www.contributor-covenant.org/) 开源行为准则
