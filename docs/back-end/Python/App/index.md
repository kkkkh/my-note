# App
## 项目开发
### 安装依赖
```bash
python -m venv venv # 创建虚拟环境
source venv/Scripts/activate # windows 激活虚拟环境
# source .venv/bin/activate # mac
pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --timeout 100 # 安装依赖
```
```bash
pip install uv
uv venv
source venv/Scripts/activate # 激活虚拟环境
# source .venv/bin/activate # mac
uv pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --timeout 100
```
### 启动服务
```bash
python -m uvicorn main:app --reload
```
### requirements.txt 维护
```bash
# 维护依赖
pipreqs . --force --savepath requirements.in
pip-compile requirements.in
# 安装依赖
pip install -r requirements.txt
pip-sync requirements.txt
pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --timeout 100
```
## fastapi sqlalchemy
### vscode 无法解析导入 “fastapi”
vscode 提示：无法解析导入“fastapi”（PylancereportMissingImports）
- 1、按下 Ctrl + Shift + P（mac 是 Cmd + Shift + P）；
- 2、搜索并选择 “Python: 选择解释器 (Select Interpreter)”；
- 3、找到并选择你的虚拟环境，比如：venv\Scripts\python.exe
- 4、重新打开文件，Pylance 就能识别 fastapi 了。
### 线程管理
- 报错
```bash
SQLite objects created in a thread can only be used in that same thread.
The object was created in thread id 25824 and this is thread id 31456.
```
- 问题：
  - 你在一个线程中创建了数据库连接（sqlite3.connect()）
  - 但在另一个线程中（比如 FastAPI 的请求线程、后台任务线程）使用这个连接对象
  - SQLite 在 Python 的线程安全机制，SQLite 默认 禁止跨线程使用连接
- 解决：
  - 方案1：sqlite3.connect连接放在函数内部
  ```python
  from fastapi import FastAPI

  app = FastAPI()

  @app.get("/translate")
  def translate_api(word: str):
      # 请求开始时创建、结束时关闭
      conn = sqlite3.connect("ecdict.sqlite")
      cur = conn.cursor()
      cur.execute("SELECT translation FROM stardict WHERE word = ? COLLATE NOCASE LIMIT 1", (word,))
      row = cur.fetchone()
      conn.close()
      return {"word": word, "translation": row[0] if row else None}
  ```
  - 方案2： check_same_thread=False 不建议
  ```python
  conn = sqlite3.connect("ecdict.sqlite", check_same_thread=False)
  ```
  - 方案3：使用连接池管理（FastAPI + SQLite 常用方案）
  ```py
  from sqlalchemy import create_engine, text

  engine = create_engine("sqlite:///ecdict.sqlite", connect_args={"check_same_thread": False})
  # ❌ 不是 sqlite3.Connection
  # 这种 conn 是 sqlalchemy.engine.Connection 对象，没有 .cursor() 方法。
  # conn = engine.connect()
  def translate(word: str):
      # 频繁创建连接开销略高，但 SQLite 属于轻量级数据库，这个代价非常小，可忽略。
      with engine.connect() as conn:
          result = conn.execute(text("SELECT translation FROM stardict WHERE word = :word COLLATE NOCASE LIMIT 1"), {"word": word})
          row = result.fetchone()
          return row[0] if row else None
  ```
  - 方案3优化
  ```py
  from sqlalchemy import create_engine, text
  from sqlalchemy.orm import sessionmaker

  engine = create_engine(f"sqlite:///./ecdict.db", connect_args={"check_same_thread": False})
  SessionLocal = sessionmaker(bind=engine)

  def query_word(word: str):
      with SessionLocal() as session:
          result = session.execute(text("SELECT word, phonetic, definition FROM stardict WHERE word = :word"), {"word": word}).fetchone()
          if result:
              return {"word": result.word, "phonetic": result.phonetic, "definition": result.definition}
          return None
  ```

### 对比 `conn.execute()` 和 `cursor.execute()`
| 对比点        | `conn.execute()`                     | `cursor.execute()`                     |
| ---------- | ------------------------------------ | -------------------------------------- |
| **调用者**    | 数据库连接对象（`Connection`）                | 游标对象（`Cursor`）               |
| **返回值**    | 返回一个新的 `Cursor` 对象                   | 返回自身（同一个 Cursor）           |
| **是否创建游标** | ✅ 自动创建一个临时 `Cursor`                  | ❌ 使用已有的游标              |
| **适合场景**   | 快速执行简单语句（不需多次查询）                     | 更灵活，可多次查询、遍历结果  |
| **性能**     | 多次执行时开销更大（反复创建临时 Cursor）             | 重用同一个 Cursor 更高效     |
| **推荐用途**   | 小脚本、一次性查询                            | 后端服务、复杂查询或批处理        |
| **示例**     | `conn.execute("SELECT * FROM user")` | `cursor.execute("SELECT * FROM user")` |

- `conn.execute()`
  - ⚙️ 优点：一行搞定，无需手动创建 cursor。
  - ⚠️ 缺点：每次都会新建一个游标，无法重用，不适合高频调用。
  - conn.execute() 内部其实会：
    - 自动创建一个新的 cursor = conn.cursor()
    - 调用 cursor.execute(sql, params)
    - 返回该 cursor
    - 你无法重用 conn.execute() 的游标，下一次执行时会再新建一个。
- `cursor.execute()`
  - ⚙️ 优点：你可以重复使用 cursor 来执行多条 SQL，控制更灵活；
  - ⚠️ 缺点：代码略长，但更符合数据库操作习惯。
### SQLAlchemy Core 返回结果
- result 返回的结果是 Row 对象，表现形式像元组，但它实际上是一个可映射的结构。
- 但这个 result 不是简单的 tuple，它其实是 sqlalchemy.engine.Row
```py
# 转换成字典（最常用）：
result = session.execute(text("SELECT * FROM stardict WHERE word = :word"), {"word": word}).fetchone()
row_dict = dict(result._mapping)
print(row_dict)
# 多行 转字典
rows = session.execute(text("SELECT * FROM stardict LIMIT 3")).fetchall()
data = [dict(r._mapping) for r in rows]
print(data)
```
### sqlalchemy 与 sqlalchemy.orm 区别
- 同一个库的不同模块
- sqlalchemy
  - 核心模块 (SQLAlchemy Core)
  - 提供了 底层的 SQL 表达式语言 和 数据库连接管理。
  - 偏向于操作 SQL 层，类似写 SQL 语句，但用 Python 方式构建。
  - 这种方式和写 SQL 很接近，适合对 SQL 比较熟悉的人。
```py
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, select

engine = create_engine("sqlite:///./test.db", echo=True)
metadata = MetaData()
# 定义表
user_table = Table(
    "users", metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String),
)
metadata.create_all(engine)
# 插入数据
with engine.connect() as conn:
    conn.execute(user_table.insert().values(name="Alice"))
    conn.commit()
# 查询数据
with engine.connect() as conn:
    result = conn.execute(select(user_table))
    for row in result:
        print(row)
```
- sqlalchemy.orm
  - ORM模块 (Object Relational Mapper)
  - 在 Core 的基础上提供了 面向对象的方式 来操作数据库。
  - 把数据库的表映射成 Python 类，把行映射成对象。
```py
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
engine = create_engine("sqlite:///./test.db", echo=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
# 定义ORM模型
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
Base.metadata.create_all(engine)
db = SessionLocal()
# 插入数据
new_user = User(name="Bob")
db.add(new_user)
db.commit()
# 查询数据
user = db.query(User).first()
print(user.id, user.name)
```
### default 与 server_default区别
- default
  - 作用：在 Python/ORM 层面 生成默认值。
  - 当你创建一个 ORM 对象时，如果没有给字段赋值，SQLAlchemy 会在 Python 层自动设置这个值。
  - 不会直接影响数据库本身的默认值。
  - 如果直接用数据库执行 INSERT，而不是通过 ORM，不会自动填充
- server_default
  - 默认值在 数据库层生成
  - 直接执行 SQL INSERT 时，也会生效
  - ORM 插入时，如果使用 refresh() 可以读取数据库生成的值

```py
class Item(Base):
  __tablename__ = "items"
  created_at = Column(DateTime, default=datetime.now, nullable=False) # default
  created_at = Column(DateTime, server_default=func.now(), nullable=False) # server_default
```
### 唯一字段约束
- `unique=True`
  - 适用于简单唯一字段
  - 只能作用在单个列。
  - 自动生成的约束名（不同数据库可能随机命名），你无法自定义。()
  - 不方便在迁移（Alembic）或多字段唯一时精确控制。
- `UniqueConstraint('name', name='uix_name')`
  - 在 表级别 显式定义唯一约束。
  - 可以控制约束的名称（name='uix_name'）。
  - 适用于单字段或多字段组合唯一的场景。
- 同时写会重复定义唯一约束，不要一起用。
```py
class Item(Base):
  __tablename__ = "items"
  # 唯一约束，约束名不能自定义，但是可配合naming_convention自定义
  name = Column(String, index=True, unique=True) 
  # 在 SQLAlchemy 定义模型时，加 唯一约束：
  __table_args__ = (
    UniqueConstraint('name', name='uix_name'),  # name 字段唯一 约束名uix_name自定义
    UniqueConstraint('first_name', 'last_name', name='uix_fullname'), # first_name + last_name 组合唯一
  )
```
### sqllite 如何存储数组
SQLite 从 3.9.0 版本开始支持 JSON 函数，可以把数组存成 JSON 格式的字符串。
```py
from sqlalchemy.dialects.sqlite import JSON
class Item(Base):
  __tablename__ = "items"
  tags = Column(JSON, nullable=True)  # 用 JSON 存储数组
```
### 数据库提交 事务控制

<<< ../FastApi/src/crud/work.py

<<< ../FastApi/src/routers/work.py

### 数据库 api对比
| 方法                | 作用                        | 是否触发 SQL 执行 | 是否影响事务    | 常见用途     |
| ----------------- | ------------------------- | -------| --------- | ------------------------------ |
| `db.begin()`      | 显式开启一个事务（上下文管理器）      | 否           | ✅ 开启新事务   | 用于需要手动控制事务范围的情况 |
| `db.add(obj)`     | 把对象加入会话（pending 状态）       | 否           | 否         | 准备插入或更新 |
| `db.flush()`      | 把会话中的变更发送到数据库（执行 SQL）但不提交 | ✅ 是  | ❌ 不提交，只同步 | 检查是否会出错（唯一约束、外键等），或需要获得新生成的 ID |
| `db.commit()`     | 提交事务（真正写入数据库）             | ✅ 是   | ✅ 提交并结束事务 | 操作成功后确认永久保存                    |
| `db.refresh(obj)` | 从数据库重新加载该对象的最新值          | ✅ 是   | ❌ 不影响事务   | 获取数据库端生成的字段（如自增 ID、触发器字段、时间戳）|
| `db.rollback()`   | 回滚事务（撤销未提交操作）             | ❌ 否   | ✅ 回滚并结束事务 | 出现异常后恢复一致状态                    |

### 字典转为一个对象（实例），可以使用a.b调用
- types.SimpleNamespace
```py
from types import SimpleNamespace
data = {"english": "apple", "chinese": "苹果"}
obj = SimpleNamespace(**data)
print(obj.english)  # apple
print(obj.chinese)  # 苹果
```
- pydantic.BaseModel
```py
from pydantic import BaseModel
class Translation(BaseModel):
    english: str
    chinese: str
data = {"english": "apple", "chinese": "苹果"}
obj = Translation(**data)
print(obj.english)   # apple
print(obj.chinese)   # 苹果
```
- namedtuple 是不可变对象，不能修改字段。
```py
from collections import namedtuple
Translation = namedtuple("Translation", ["english", "chinese"])
data = {"english": "apple", "chinese": "苹果"}
obj = Translation(**data)
print(obj.english)  # apple
print(obj.chinese)  # 苹果

```
- 自定义
```py
class Dict2Obj:
    def __init__(self, **entries):
        self.__dict__.update(entries)
data = {"english": "apple", "chinese": "苹果"}
obj = Dict2Obj(**data)
print(obj.english)  # apple
print(obj.chinese)  # 苹果
```

### 使用泛型

<<< ../FastApi/src/schemas/common.py

<<< ../FastApi/src/routers/all.py

### sqlit 改变一个表中的属性的类型
SQLite 对 ALTER TABLE 的支持很有限,不支持直接修改列的类型。
