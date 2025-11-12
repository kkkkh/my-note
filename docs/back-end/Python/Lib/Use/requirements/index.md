## requirements 相关
### pip freeze 生成 requirements.txt
```bash
pip freeze > requirements.txt
```
### pipreqs 配合 pip-tools 生成 requirements.txt
1、pipreqs 生成 requirements.in
- 扫描项目代码的 import 语句
- 自动生成依赖列表，不锁定版本
- 生成的文件类似 requirements.in 的顶级依赖列表 ❌（每次生成都会将之前内容覆盖，且都是最新版本）
```bash
# 生成 requirements.in
# --ignore 排除虚拟环境或测试目录；
# --force 覆盖已有文件；
# --savepath 指定保存路径。
pipreqs . --force --savepath requirements.in
pipreqs . --force --ignore venv,test,__pycache__ --savepath requirements.in
```
2、pip-tools 的特点：
- 接收顶级依赖列表（requirements.in）
- 自动解析所有子依赖
- 生成锁定版本的 requirements.txt
```bash
# 生成一个完整的、锁定版本号的 requirements.txt
pip-compile requirements.in
pip-sync requirements.txt
pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --timeout 100
```
### pmd
- .pdm-python
  - .pdm-python 通常在你运行 pdm init 或 `pdm use -f <python_path>` 时生成，用来固定项目的 Python 解释器
  - 不提交
```bash
pdm init
# 向 pyproject.toml 添加依赖
# 更新 pdm.lock 锁文件
# 默认 会自动安装依赖到虚拟环境
pdm add fastapi uvicorn
pdm add pytest -d
# 用于第一次安装项目依赖或者更新虚拟环境
# 安装 pyproject.toml + pdm.lock 里列出的所有依赖
pdm install
pdm run uvicorn main:app --reload
pdm export -o requirements.txt --without-hashes
```
#### pip-compile 迁移 pdm
```bash
rm -rf venv/
# 备份 requirements_old.txt
rm requirements.txt requirements.in

#全局 pip 安装
pip install pdm

pdm init
pdm init -n  # 不交互，使用默认值
# 生成
# pyproject.toml  # 项目配置和依赖信息
# pdm.lock        # 锁文件，锁定依赖版本

# 导入旧依赖
pdm import -f requirements requirements.old.txt

# 安装依赖到虚拟环境
pdm install

# 检查虚拟环境
pdm info
# PDM version:
#   2.26.1
# Python Interpreter: 这里要使用pdm虚拟环境的py
#   D:\WorkSpace\xxxxx\.venv\Scripts\python.exe (3.11)
# Project Root:
#   D:/WorkSpace/xxxxx
# Local Packages:
#   D:\WorkSpace\xxxxx\.venv\Lib\site-packages

# 查看安装的包
pdm list
# ╭───────────────────┬─────────┬──────────╮
# │ name              │ version │ location │
# ├───────────────────┼─────────┼──────────┤
# │ alembic           │ 1.17.1  │          │
# ...
```

- pyproject.toml 里配置脚本
```bash
[tool.pdm.scripts]
start = "uvicorn app.main:app --reload"
```

- pdm init 相关

| 提示                    | 说明                  | 示例                           |
| --------------------- | ------------------- | ---------------------------- |
| Project name          | 项目名称                | `my_fastapi_project`         |
| Version               | 项目版本号               | `0.1.0`                      |
| Description           | 项目描述                | `A FastAPI project with PDM` |
| Author                | 作者                  | `123 <your@email.com>`        |
| License               | 开源协议                | `MIT`                        |
| Python requirement    | Python 版本要求         | `>=3.11`                     |
| Add dependencies now? | 是否现在添加依赖            | `y/n`                        |
| Add dev dependencies? | 是否添加开发依赖（测试、lint 等） | `y/n`                        |

### Poetry

