---
outline: deep
---
## git
### git 常用命令
#### git branch
```bash
# 拉去远程分支 <基于一个commit>
git checkout -b dev origin/dev <commit id>
# 查看全部分支
git branch -a
# 查看本地分支 log
git branch -v
# 删除远程分支
git push origin --delete <branch name>
# 删除本地
git branch -d <branch name>
# 强制删除没有合并的分支
git branch -D <branch name>
# 通过commit id 查找分支
git branch -a --contains <commit id>
# 建立本地分支和远程分支的关联
git branch --set-upstream-to=origin/dev dev
```
#### git stash
- 当前工作现场“储藏”起来
```bash
git stash
# 新增的文件也一起储藏
git stash -u
# 查看 stash 了哪些存储
git stash list
# 显示做了哪些改动，默认 show 第一个存储
git stash show
# 恢复的同时把stash内容也删了
git stash pop
# 恢复stash内容并不删除
git stash apply stash@{0}
# 删除 stash
git stash drop 
```
#### git commit
```bash
# 修改提交 commit message
git commit --amend
```
#### git submodule
- 初始化子模块
```bash
# 安装 (安装包以后，yarn 重新安装)
git submodule add https://github.com/chaconinc/DbConnector
git submodule add <url> externals/ej-business-modules
# 初始化并更新
git submodule update --progress --init
(git submodule init + git submodule update)
# git clone + 初始化并更新
git clone //// --recurse-submodules
(git clone //// + git submodule update --init)
# 嵌套子模块更新
git submodule update --init --recursive
# 更新所有子模块
git submodule update --remote
# 更新DbConnector子模块
git submodule update --remote DbConnector
# 取消初始化 deinitialize子模块
git submodule deinit lib/openzeppelin-contracts
# git pull
git pull --recurse-submodules
(git pull + git submodule update --init --recursiver)
# mistake, remove it from the index withchec
git rm --cached externals/ej-business-modules
# help submodule
git help submodule
```
- 修改子模块
```bash
cd DbConnector/ #进入子模块
git checkout stable #切换到对应分支
cd .. # “merge” 选项来更新子模块
git submodule update --remote --merge # 更新子模块
cd DbConnector/ #如果冲突 进入子模块 进行修改
git push #内部推送
cd .. #从外部推送
git push --recurse-submodules=check
git push --recurse-submodules=on-demand
```
#### git rebase
```bash
## 目前在dev分支
git rebase -i #合并本地commit
# master
git checkout master
git pull
# dev
git checkout dev
git rebase master  #master 最新合并到 dev,只用解决一次冲突
# master
git checkout master
git merge dev
git push #提交 冲突，解决冲突
# dev
git checkout dev
git rebase master # 变基
git push
```
#### git remote
```bash
# 查看远程仓库
git remote -v
# 添加远程仓库 （orgin 远程库名称）
git remote add origin git@22:monitoring.git
# 删除远程库（解除了本地和远程的绑定关系）
git remote rm origin dev
```
#### git config
```bash
#全局（用户主目录下的一个隐藏文件.gitconfig）
git config --global user.name "kkkkh"
git config --global user.email "13693256971@163.com"
# 项目（每个仓库的Git配置文件都放在.git/config）
git config user.name 'kkkkh'
git config user.email '13693256971@163.com'
#设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.ci commit
git config --global alias.br branch
git config --global alias.unstage 'reset HEAD'
git unstage test.py #实际执行的是 git reset HEAD test.py
git config --global alias.last 'log -1'
# 设置属性
git config --global core.autocrlf false
git config --global color.ui true
git config --global credential.helper store
# 设置代理
git config http.proxy http://127.0.0.1:7897
git config --global --unset http.proxy
```
#### git log/reflog
```bash
git log
git log --pretty=oneline  #简洁 log
git log --graph --pretty=oneline --abbrev-commit # graph - 分支合并图
git reflog #记录你的每一次命令，用来返回未来版本
```
#### git reset 回退版本
```bash
git reset --hard HEAD^ #回退到上一个版本
git reset --hard HEAD^^ #回退到上上个版本
git reset --hard HEAD~100 #回退到上100个版本
git reset --hard 1094a #达到某一版本
```
- --hard 为是否撤销工作区的修改
```bash
git reset HEAD <file> #把暂存区的修改撤销掉，不撤销工作区的修改
git reset 1094a #达到某一版本，不撤销工作区的修改
git reset 1094a ./file.txt #单个文件回退
```
#### git clean
```bash
# 删除新建的文件
git clean -fd 
```
#### git checkout
```bash
# 弃工作区的修改，工作区和版本库统一
git checkout -- file
# 切换新的分支，并且清空之前commit记录
git checkout --orphan <branch>
```
#### git rm
```bash
# 删除
git rm test.txt
#恢复删除文件，工作区和版本库统一
git checkout -- test.txt
# 版本库和工作区统一
git commit -m "remove test.txt"
# 其中，`<file/folder>`是被提交的文件或目录的名称。
# 该命令会将文件或目录从Git仓库中删除，但不会删除本地文件。
git rm --cached <file/folder>
```
#### git switch
```bash
git switch master #最新版本的Git提供了新的git switch命令来切换分支
git switch -c <name> #创建+切换分支
```
#### git cherry-pick
```bash
# 只需要把4c805e2这个提交所做的修改“复制”到current分支
git cherry-pick 4c805e2
git cherry-pick 4c805e2 -n #不带commit
# 多个
git cherry-pick 4c805e2 4c805e3 4c805e4 4c805e5
# 有冲突就解决冲突
git cherry-pick --continue
# 没有冲突
git cherry-pick --skip
git cherry-pick --abort
```
#### git pull
```bash
git pull = git fetch + git merge
git pull --reabse = git fetch + git rebase
```
#### git tag
```bash
git tag # 查看所有标签
git tag v1.0 # 当前commit 打标签
git tag v0.9 f52c633 # 给f52c633打标签
git show <tagname> # 查看标签信息
git tag -a v0.1 -m "version 0.1 released" 1094adb

git tag -d v1.0 #删除标签
git push origin <tagname> #推送某个标签到远程
git push origin --tags # 推送全部
git push origin :refs/tags/v0.9 # 删除远程标签
```
#### git check-ignore
```bash
git check-ignore
git check-ignore -v App.class #找出来到底哪个规则写错
```
#### .ignore
```bash
# 排除所有.开头的隐藏文件:
.*
# 排除所有.class文件:
*.class
# 不排除.gitignore和App.class:
!.gitignore
!App.class
```
#### .git/config
```bash
[remote "origin"] url = http://用户名:密码@git.gitlab.cn/kkkkh/note-s.git
```
### git 特点
#### 概念
- 工作区：你在电脑里能看到的目录；
- 版本库：工作区有一个隐藏目录.git，这个不算工作区，而是 Git 的版本库；
- 暂存区：存在于版本库中，stage（或者叫 index）的暂存区
#### 操作
- 第一步是用 git add 把文件添加进去，实际上就是把文件修改添加到暂存区；
- 第二步是用 git commit 提交更改，实际上就是把暂存区的所有内容提交到当前分支；
#### 优点
- Git 比其他版本控制系统设计得优秀，因为 Git 跟踪并管理的是修改，而非文件。
