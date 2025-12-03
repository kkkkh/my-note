# Python Lib

## 库列表
- [requirements 相关](../Use/index#requirements)
  - pip freeze
  - pipreqs
  - pip-tools
  - poetry
  - pdm
- 字典
  - [ECDICT](https://github.com/skywind3000/ECDICT/) 英文->中文字典的双解词典数据库
  - [pystardict](https://github.com/lig/pystardict/)
  - Glossary
- FastApi
  - SQLAlchemy 核心模块 (SQLAlchemy Core)
    - 底层的 SQL 表达式语言 和 数据库连接管理
  - sqlalchemy.orm ORM模块 (Object Relational Mapper)
    - 在 Core 的基础上提供了 面向对象的方式 来操作数据库。
    - 把数据库的表映射成 Python 类，把行映射成对象。
  - Pydantic
    - 是一个数据验证和解析库，它关注如何验证和处理数据的合法性、格式等问题
  - pydantic-settings
- bcrypt
  - bcrypt 官方 Python 包，C 扩展实现
  - ~~python-bcrypt~~ 比较旧
  - `passlib[bcrypt]` 会依赖底层 bcrypt，它会自动调用 bcrypt 库的 hashpw 和 checkpw。
- 虚拟环境
  - venv
- models 相关
  - tqdm 进度条库
  - requests HTTP 客户端库，发送各种网络请求
  - faster_whisper 音频转文字

