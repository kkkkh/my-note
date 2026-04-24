# App
## python基本
### 三目
```python
# 简单判断
a = 10
b = 20
max_val = a if a > b else b
print(max_val)  # 输出 20

# 可以嵌套
score = 85
grade = "A" if score >= 90 else "B" if score >= 80 else "C"
print(grade)  # 输出 B
```
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
### 动态文件
```py
spec = importlib.util.spec_from_file_location(...)
spec.loader.exec_module(module)
```
- 这是 Python 最底层的“裸加载”方式，绕过包、绕过 import 系统，直接执行指定文件。
- 特点
  - 不需要包结构（不要求有 __init__.py）
  - 不放入 sys.modules
  - 同一个文件多次调用会多次执行（无缓存）
  - 加载后的模块不可通过 import xxx 再次引用
- 场景
  - 你需要按文件名顺序加载某些插件/路由
  - 这些文件不一定是包
  - 你希望每个文件都独立执行，互不影响
  - 需要动态控制优先级（例如你的 LOAD_PRIORITY）
```python
importlib.import_module(f"{package}.{module_name}")
```
- 正常的 import 机制
- 特点
  - 必须处于 Python 包结构（需要 __init__.py）
  - 放入 sys.modules，自动缓存
  - 再次导入不会重复执行模块（除非 reload）
  - 支持相对导入
  - 模块之间可正常互相引用
- 场景
  - 你要导入 models 让 SQLAlchemy 自动加载表结构
  - 文件是项目代码的一部分
  - 模块之间相互 import
  - 希望走正常的 Python 包机制
#### 完整示例
- 动态加载*.py文件并执行 、增加排序
```py
import glob
import os
import sys
import importlib

def importlib_handle(file_path):
  module_name = os.path.splitext(os.path.basename(file_path))[0]
  # 动态加载模块
  spec = importlib.util.spec_from_file_location(module_name, file_path) # 生成模块的“加载规格”
  module = importlib.util.module_from_spec(spec) # 创建一个模块对象
  spec.loader.exec_module(module) # 执行模块文件，把模块内容加载到 module 对象中
  return module
def get_import_modules(file_path:str):
  router_files = glob.glob(file_path)
  router_files = [
    f for f in router_files
    if not f.endswith("__init__.py")
    and not os.path.basename(f).startswith("_")
  ]
  modules = list(map(lambda file_path: importlib_handle(file_path), router_files))
  return sorted(modules, key=lambda m: getattr(m, "LOAD_PRIORITY", 9999))
def import_module(dir_path: str, package: str = None):
  """
  动态导入指定目录下的所有 Python 文件（排除 __init__.py），注册到 Base.metadata。
  Args:
      dir_path: 模块所在目录绝对路径
      package: 对应的 Python 包路径（如 'src.models'）
  """
  if package is None:
      # 自动根据目录计算包名
      package = os.path.basename(dir_path)
  # 确保目录在 sys.path 中
  if dir_path not in sys.path:
      sys.path.insert(0, dir_path)

  for filename in os.listdir(dir_path):
      if filename.endswith(".py") and filename != "__init__.py":
          module_name = filename[:-3]  # 去掉 .py
          importlib.import_module(f"{package}.{module_name}")
```
| 方法                   | 类比                                    |
| -------------------- | ------------------------------------- |
| `get_import_modules` | 像直接用 `exec(open("file.py"))` — 独立执行脚本 |
| `import_module`      | 像 `import xxx` — 项目内官方引用              |
### from xxx import *
在 Python 里，from xxx import * 是一个语法糖，用来 一次性把模块（或包）里定义的所有“可导出”内容导入到当前命名空间。
- 1️⃣ 基本用法
  ```python
  # src/models/__init__.py
  from .user import User
  from .group import Group
  # 现在在别的文件里
  from src.models import *
  # 相当于执行了：
  # from src.models.user import User
  # from src.models.group import Group
  ```
- 2️⃣ * 导入的规则
  - 只会导入模块里定义的“公开对象”。
  - 公开对象由模块中的 __all__ 决定：
  ```python
  # src/models/user.py
  __all__ = ["User", "Profile"]

  class User: ...
  class Profile: ...
  class _Secret: ...
  ```
  - 如果有 __all__，* 只会导入 User 和 Profile。
  - 如果没有 __all__，* 会导入所有不以下划线 _ 开头的对象。
- 3️⃣ 在包里的 * 导入
  ```python
  from src.models import *
  ```
  - Python 会去执行 src/models/__init__.py。
  - \* 导入的内容由 __init__.py 决定。
  - 所以如果你新建了模块，必须在 __init__.py 中显式导入或者更新 __all__，否则 * 不会生效。
### class 属性增加类型注解
Pydantic v2 不允许在模型类中出现没有类型注解的属性。
```python
from typing import ClassVar
from pathlib import Path
from pydantic_settings import BaseSettings

class BaseConfig(BaseSettings):
    backend_dir: ClassVar[Path] = Path("D:/WorkSpace/4NOTE/hometown/data")
```
## fastapi sqlalchemy Pydantic
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
### 接受请求参数
- 多个query
```py
@router.get("/getByPodId", response_model=CommonResponse)
def read_translations(
    podId: int,
    lang: str = None,
    status: str = "active",
    db: Session = Depends(get_db)
):
    ...
```
- 还可以用 Query 更精细控制
```py
from fastapi import Query

@router.get("/getByPodId", response_model=CommonResponse)
def read_translations(
    podId: int = Query(..., description="Pod 的 ID", gt=0),
    lang: str = Query(None, description="语言类型，如 en、zh"),
    status: str = Query("active", description="状态"),
    db: Session = Depends(get_db)
):
    ...
```
- 如果你想接收很多参数，可以用 Pydantic 模型来包一层
```py
from pydantic import BaseModel

class QueryParams(BaseModel):
    podId: int
    lang: str | None = None
    status: str = "active"

@router.get("/getByPodId", response_model=CommonResponse)
def read_translations(params: QueryParams = Depends(), db: Session = Depends(get_db)):
    print(params.podId, params.lang, params.status)
    ...
```
- post请求 Query + Body 参数
```py
from fastapi import APIRouter, Query, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

router = APIRouter()

class Item(BaseModel):
    name: str
    price: float

@router.post("/items/create")
def create_item(
    lang: str = Query("en", description="语言类型"),  # query 参数
    item: Item = None,                               # body 参数
    db: Session = Depends(get_db)
):
    print(f"lang={lang}, item={item}")
    return {"lang": lang, "item": item.dict()}

```
- post请求 混合 Query + Path + Body
```py
@router.post("/users/{user_id}")
def update_user(
    user_id: int,                          # Path 参数：/users/123
    notify: bool = Query(False),           # Query 参数：?notify=true
    user_data: dict = Body(...),           # Body 参数：JSON
):
    return {
        "user_id": user_id,
        "notify": notify,
        "user_data": user_data
    }

```
- 接受 Form File
```python
@router.post("/add")
async def add_group(
    name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    ...
```
- as_form 校验

```py
class GroupAddReq(BaseModel):
    name: str
    file: UploadFile

    @classmethod
    def as_form(
        cls,
        name: str = Form(...),
        file: UploadFile = File(...),
    ):
        return cls(name=name, file=file)

@router.post("/add", response_model=CommonResponse[GroupRes])
async def add_group(
    # - ❗为什么必须用 Depends？
    # - Pydantic 默认只支持 JSON body
    # - UploadFile + Form = multipart/form-data
    # - 只有通过 Depends，FastAPI 才会用你的自定义依赖（as_form）解析非 JSON 请求
    # - 否则 FastAPI 会尝试把整个 body 当成 JSON → 解析失败 → 422 Unprocessable Entity
    req: GroupAddReq = Depends(GroupAddReq.as_form),
    db: Session = Depends(get_db),
):
    ...
```
- 封装更优雅
```py
def as_form(cls):
    new_params = []
    for field in cls.__fields__.values():
        if isinstance(field.type_, UploadFile.__class__):
            new_params.append(
                inspect.Parameter(
                    field.name,
                    inspect.Parameter.POSITIONAL_ONLY,
                    default=File(...)
                )
            )
        else:
            new_params.append(
                inspect.Parameter(
                    field.name,
                    inspect.Parameter.POSITIONAL_ONLY,
                    default=Form(...)
                )
            )

    async def _as_form(**kwargs):
        return cls(**kwargs)

    sig = inspect.signature(_as_form)
    _as_form.__signature__ = sig.replace(parameters=new_params)

    return _as_form
class GroupAddReq(BaseModel):
    name: str
    file: UploadFile

    as_form = as_form(__qualname__)
```

| 参数类型     | 定义位置                      | 来源       | 示例                   |
| -------- | ------------------------- | -------- | -------------------- |
| Path 参数  | 函数签名 `{param}`            | URL 路径   | `/users/123`         |
| Query 参数 | 函数参数或 `Query()`           | URL 查询串  | `?lang=zh`           |
| Body 参数  | `Body(...)` 或 Pydantic 模型 | JSON 请求体 | `{ "name": "Book" }` |
| Form 参数  | `Form(...)`               | 表单提交     | HTML form            |
| File 参数  | `File(...)`               | 文件上传     | multipart/form-data  |
### pydantic 验证
- 👉 把正则校验逻辑放在 Pydantic 模型层（也就是 FastAPI 的请求体模型），而不是放在 SQLAlchemy 的 ORM 模型里。
- 字段 pattern 中设置
```python
from pydantic import BaseModel, Field
import re
class UserCreate(BaseModel):
    username: str = Field(..., pattern=r'^[a-zA-Z0-9_]{4,20}$', description="用户名只允许字母数字下划线，长度4-20")
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="邮箱格式")
    password: str = Field(..., min_length=6, max_length=20)
```
- Pydantic 的 validator
```python
from pydantic import BaseModel, validator
class UserCreate(BaseModel):
    username: str
    password: str
    @validator('username')
    def check_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]{4,20}$', v):
            raise ValueError('用户名必须是字母数字下划线，长度4-20')
        return v
```
### 复杂 pattern 会报错
- JSON Schema 校验中部分复杂正则会报错
- `password: str = Field(..., pattern=r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$',description="密码必须包含字母和数字，长度8-20位")`
- Pydantic（尤其是 v2.x 版本）在生成 JSON Schema 时，会尝试将 pattern 编译为 JSON Schema 兼容的正则。
- 而 (?=...) 这种前瞻（lookahead）语法不被 JSON Schema 原生支持，
- 导致它在生成 OpenAPI 文档时报错或无效。
- ✅ 使用 validator，完全兼容任何正则
### Pydantic v2 @field_validator
```python
from pydantic import BaseModel, Field, field_validator
import re

class UserCreate(BaseModel):
    password: str = Field(..., description="密码必须包含字母和数字，长度8-20位")

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        pattern = r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$'
        if not re.match(pattern, v):
            raise ValueError('密码必须包含字母和数字，长度8-20位')
        return v
```
### 中间件加载
- class-based middleware (继承自 Starlette 的 BaseHTTPMiddleware)
  - 先加载
  - `app.add_middleware(...,...)` 加载方法
  - Class-based middleware 的 dispatch 内抛出的异常可以被外层捕获
  - 核心中间件使用 class-based：
    - 认证、鉴权、异常捕获等核心中间件通常都是 class-based
    - CORS、GZip、Session、AuthMiddleware
- Function-based middleware
  - 后加载
  - `app.middleware("http")(...)`
  - @app.middleware("http")
  - Function-based middleware 只能捕获 call_next 内抛出的异常
  - 场景
    -  用于轻量级、业务层、可排序的中间件
    - 可以通过 LOAD_PRIORITY 灵活排序
    - 性能稍优于 class-based（少一层 dispatch 包装）
    - 日志记录 middleware、请求计数、限流 middleware
    - 异常处理在 class-based auth 或全局 exception_handler 处理
- auth middleware
  - 为什么不使用 Function-based middleware
  - 因为在Function-based middleware中，如果raise 的异常，不能被外层 function-based middleware 捕获，
  - 会被 AnyIO 包装成 ExceptionGroup → 500
  - 所以两种方案：
    - 一种是外层 function-based 包装ExceptionGroup 处理报错（❌ 尝试无效）
    ```py
    # auth_middleware 里在 call_next 之前 raise 的异常：此异常发生在 auth_middleware 自身逻辑中，而不是 call_next 内部
    from fastapi import Request, HTTPException
    from fastapi.responses import JSONResponse
    """
    # 注意：使用 Python 3.11 的 ExceptionGroup
    # 用来接_auth的raise HTTPException 报错
    """
    async def _exception_adapter(request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as exc:
            # 如果是 ExceptionGroup（Python 3.11）
            if isinstance(exc, ExceptionGroup):
                # 解包，优先处理其中的 HTTPException
                for sub in exc.exceptions:
                    if isinstance(sub, HTTPException):
                        return await http_exception_handler(request, sub)
                        # return JSONResponse(status_code=sub.status_code, content={"message": sub.detail})
                # 没有 HTTPException，返回 500
                return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
            # 直接是 HTTPException
            if isinstance(exc, HTTPException):
                return JSONResponse(status_code=exc.status_code, content={"message": exc.detail})
            # 其它异常
            return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
    ```
    - 另外一种将auth middleware 转为 class-based middleware（更通用、更主流）
- class-based middleware 异常捕获
  - class-based middleware 的 dispatch 里调用 call_next，它会把请求交给下一个 ASGI app，这个下一个 app 包括 function-based middleware。
  - 这就是 “异常可以沿着 await 链冒泡到 function-based middleware” 的原因
  - call_next 实际上是触发 它后面注册的整个 ASGI stack，包括 function-based middleware（如 exception_adapter）和最终的 endpoint。
  - 只要异常发生在 await call_next(request) 内或其下层就会沿 coroutine 链冒泡。
- 核心分析：
  - 代码顺序 ≠ 调用栈顺序
    - 你可能习惯认为“代码先写的在内层，后写的在外层”，其实 FastAPI/Starlette 先注册的 class-based middleware 在调用栈外层。
    - 这和 Flask/Django 等框架有所不同，容易让人误解。
  - class-based middleware 的 call_next 特性
    - class-based middleware 的 await call_next(request) 并不只调用下一个中间件函数，而是触发 整个下层 ASGI stack。
    - 这就打破了直觉：后注册的 function-based middleware（看起来“在外层”）实际上在 class-based call_next 的下层，所以可以捕获异常。
### add_exception_handler
- 注册异常处理函数 app.add_exception_handler(HTTPException, http_exception_handler)
- 对于路由中 raise HTTPException，FastAPI 默认会生成一个 JSONResponse（状态码 + detail）。
- 而这个异常不会穿透到中间件外层，因为 FastAPI 内部在路由调度时对 HTTPException 做了捕获处理（也就是“短路”机制）。
### datetime
- datetime py函数
- ~~datetime.utcnow()~~ 被标记为 弃用，
- 因为它生成的 datetime 对象 没有时区信息，不推荐直接使用。
- 现代写法推荐使用 带时区的 UTC 时间：
```python
from datetime import datetime, timezone
now = datetime.now(timezone.utc)
```
### 上传
1、增加静态文件服务器
```bash
upload_dir = Path("/uploads")
upload_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")
```
2、保存
```bash
from pathlib import Path
import uuid
from datetime import datetime
from pathlib import Path
from fastapi import HTTPException
from src.core.uploads import upload_dir

async def saveFile (file, path, is_date_dir = False):
  try:
    file_content = await file.read()
    file_ext = Path(file.filename).suffix if file.filename else ""
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    save_dir = None
    if is_date_dir:
      date_dir = datetime.now().strftime("%Y/%m/%d")
      save_dir = upload_dir / path / date_dir
    else:
      save_dir = upload_dir / path
    save_dir.mkdir(parents=True, exist_ok=True)
    file_path = save_dir / unique_filename
    with open(file_path, "wb") as f:
        f.write(file_content)
    # print(str(save_dir)) # 各个操作系统生成不同的路径格式 windows:\\
    # 使用.as_posix()会把路径转换为 POSIX（即 / 分隔符）格式。
    relative_path = f"{save_dir.as_posix()}/{unique_filename}"
    return relative_path
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"文件保存失败: {str(e)}")
```
### 报错统一捕获处理
```py
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

# - 对于路由中 raise HTTPException，FastAPI 默认会生成一个 JSONResponse（状态码 + detail）。
# - 而这个异常不会穿透到中间件外层，因为 FastAPI 内部在路由调度时对 HTTPException 做了捕获处理（也就是"短路"机制）。
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}
    )

# 数据库层面的唯一约束错误 (IntegrityError)，FastAPI 默认不会把这种 DB 异常自动转换成可读的前端错误，所以前端只看到 500，而不是“名称已存在”。
async def db_exception_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content={"message": "唯一字段重复，提交失败"},
    )

def init_exception_handlers(app):
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(IntegrityError, db_exception_handler)

```
### 枚举使用
```py
from enum import Enum
class AnimalType(str, Enum):
    a = "a"
    b = "b"
```
- crud/routers/schemas/ 使用AnimalType.a
- models/ 使用AnimalType.a.value
- 原因：
  - 业务层（FastAPI 入参/内部逻辑）：统一用 AnimalType 枚举（更不容易写错）
  - 持久化层（DB column 是 String）：统一存 "a" / "b"（所以 models 默认值用 .value 很合理）
### 状态码
- 422
  - 服务器理解了请求，但请求格式正确，却因为语义错误无法处理。
  - 前端传的formdata，而后端没有按照formdata格式接受，就报错422
## db
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

<<< ../code/src/crud/work.py

<<< ../code/src/routers/work.py
### 数据库 api对比
| 方法                | 作用                        | 是否触发 SQL 执行 | 是否影响事务    | 常见用途     |
| ----------------- | ------------------------- | -------| --------- | ------------------------------ |
| `db.begin()`      | 显式开启一个事务（上下文管理器）      | 否           | ✅ 开启新事务   | 用于需要手动控制事务范围的情况 |
| `db.add(obj)`     | 把对象加入会话（pending 状态）       | 否           | 否         | 准备插入或更新 |
| `db.flush()`      | 把会话中的变更发送到数据库（执行 SQL）但不提交 | ✅ 是  | ❌ 不提交，只同步 | 检查是否会出错（唯一约束、外键等），或需要获得新生成的 ID |
| `db.commit()`     | 提交事务（真正写入数据库）             | ✅ 是   | ✅ 提交并结束事务 | 操作成功后确认永久保存                    |
| `db.refresh(obj)` | 从数据库重新加载该对象的最新值          | ✅ 是   | ❌ 不影响事务   | 获取数据库端生成的字段（如自增 ID、触发器字段、时间戳）|
| `db.rollback()`   | 回滚事务（撤销未提交操作）             | ❌ 否   | ✅ 回滚并结束事务 | 出现异常后恢复一致状态                    |


| 操作          | 本质                    | 什么时候用             | 常见误用        |
| ----------- | --------------------- | ----------------- | ----------- |
| `flush()`   | 把内存变更 **发送到 DB**（不提交） | **极少数**：需要 DB 生成值 | 当成 commit 用 |
| `commit()`  | 提交事务（隐式 flush）        | **事务边界**          | 写在业务函数里     |
| `refresh()` | 从 DB **重新加载对象**       | DB 改了你不知道         | 当成“更新对象”    |

- 不使用
  - 👉 90% 的 CRUD 都不需要显式 flush / refresh
  - 用了 with db.begin(): 之后，还用不用它们？
  - 在 with db.begin(): 中：
  - ❌ 不要再手动 commit()
  - ❌ 99% 不要 flush()
  - ❌ 99.9% 不要 refresh()
- 何时 ✅ 必须用 flush()
  - 子表要用父表 id
  - 同一事务里依赖自增主键
  ```python
  db.add(obj)
  db.flush()
  use(obj.id)
  ```
- 结论
  - 🔑 flush / refresh 是“底层工具”，commit 是“事务边界”
  - 🔑 业务函数只改对象，不碰事务
### 使用泛型

<<< ../code/src/schemas/common.py

<<< ../code/src/routers/all.py
### .all 的返回
 ```python
# .all() 没有数据 一定返回 []（空列表）
return db.query(Group).all() or []
```
### sqlite 改变一个表中的属性的类型
SQLite 对 ALTER TABLE 的支持很有限,不支持直接修改列的类型。
- 开发阶段（表没啥数据 / 数据可丢）
  - 最简单的办法就是：
  - 直接 删除数据库文件（通常是 test.db 或 sqlite.db 之类的 .db 文件）。
  - 重新运行你的模型定义（Base.metadata.create_all(engine)），就会用最新的字段类型重新建表。
- 标准做法（SQLite 官方推荐）
  - 如果你要改一个字段的类型，要走 “重建表” 这套流程：
  - 创建一个新表（定义你想要的字段类型）。
  - 把旧表的数据拷贝过去。
  - 删除旧表。
  - 把新表改名为旧表的名字。
  ```sql
  -- 1. 创建一个新表
  CREATE TABLE new_table (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age INTEGER
  );
  -- 2. 把旧表的数据迁移到新表
  INSERT INTO new_table (id, name, age)
  SELECT id, name, CAST(age AS INTEGER) -- 在这里可以转换类型
  FROM old_table;
  -- 3. 删除旧表
  DROP TABLE old_table;
  -- 4. 改名
  ALTER TABLE new_table RENAME TO old_table;
  ```
- Alembic（SQLAlchemy 的迁移工具）
## Uvicorn Gunicorn
### 启动服务
```bash
python -m uvicorn main:app --reload
```
### Uvicorn
```bash
# --workers 启动多个进程（worker）
# --proxy-headers 从反向代理（如 Nginx、Traefik、Caddy）读取真实客户端 IP 和协议
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 --proxy-headers
# or
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--proxy-headers"]
```
### sqlite 更新数据操作 & 多条件查询
```py
def update_data(item):
  existing = (
    db.query(Users)
    .filter(
        and_( 
          # 另外一种推荐，不使用and_，待验证
          ## ✅ 与 or_ 组合时（很重要）
            Users.id == ite.id,
            Users.name == ite.name,
            Users.age == ite.age,
          # or_(
          #   Users.name == ite.name,
          #   Users.age == ite.age,
          # )
        )
    )
    .first()
  )
  existing.timePoint = [*existing.timePoint, item.timePoint]
  db.flush() // [!code --]
  db.refresh(existing) // [!code --]
```
### Gunicorn
- Uvicorn 自带 server，但进程管理能力弱，特别是生产环境：
  - 没有进程崩溃自动重启机制 🟥
  - 多 worker 管理不够可靠 🟥
- Gunicorn：
  - 多 worker 进程管理 ✅
  - worker 崩溃自动重启 ✅
  - 负载均衡 ✅
  - 生产稳定 ✅
  - Gunicorn 本身不支持 ASGI，所以要搭配 uvicorn 的 worker 才能跑。
```bash
gunicorn main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \ 
  -w 4 \
  --threads 2 \
  -b 0.0.0.0:8000 \
  --log-level info \
  --timeout 60
# or
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```
| 参数                 | 解释            |
| ------------------ | ------------- |
| `-w 4`             | worker 数量     |
| `--threads 2`      | 每 worker 的线程数 |
| `--timeout 60`     | 超时            |
| `--log-level info` | 日志等级          |
| `--daemon`         | 后台运行（容器不用）    |
- Worker 数量怎么选？
  - workers = CPU核心数 * 2 + 1
  - CPU核心数 = Core(s) per socket × Socket(s) （每颗 CPU 的核心数 * 物理 CPU 颗数）
### WSGI ASGI
- WSGI（Web Server Gateway Interface）
  - 工作模式：同步阻塞
- ASGI（Asynchronous Server Gateway Interface）
  - async/await ✅
  - WebSocket ✅
  - 长连接 ✅
  - 事件驱动 ✅
  - 后台任务 ✅

| 协议       | 代表框架                        | 能力                          |
| -------- | --------------------------- | --------------------------- |
| **WSGI** | Django、Flask                | 只支持**同步**、单请求、阻塞方式          |
| **ASGI** | FastAPI、Starlette、Django 3+ | 支持**异步**、WebSocket、长连接、背景任务 |

| 类型      | 工具                                          | 说明                           |
| ------- | ------------------------------------------- | ---------------------------- |
| WSGI 服务 | `gunicorn`、`uwsgi`                          | 用来跑 Flask/Django             |
| ASGI 服务 | `uvicorn`、`hypercorn`                       | 用来跑 FastAPI/Django(ASGI)     |
| 混合      | `gunicorn -k uvicorn.workers.UvicornWorker` | **Gunicorn托管进程 + Uvicorn执行** |
## 配置
### vscode 无法解析导入 “fastapi”
vscode 提示：无法解析导入“fastapi”（PylancereportMissingImports）
- 1、按下 Ctrl + Shift + P（mac 是 Cmd + Shift + P）；
- 2、搜索并选择 “Python: 选择解释器 (Select Interpreter)”；
- 3、找到并选择你的虚拟环境，比如：venv\Scripts\python.exe
- 4、重新打开文件，Pylance 就能识别 fastapi 了。
### dotenv / .env
```bash
.env.development
.env.production
.env.test
```
```python
import os
from dotenv import load_dotenv

env = os.getenv("APP_ENV", "development")  # 默认开发环境
load_dotenv(f".env.{env}")

print(f"当前环境：{env}")
```
```bash
export APP_ENV=production
python main.py
```
### BaseSettings
- 使用 pydantic v2 的 BaseSettings（更专业）
- 自动从环境变量和 .env 加载配置：
```python
from pydantic import BaseSettings
``
class Settings(BaseSettings):
    db_host: str = "localhost"
    db_port: int = 3306
    db_user: str
    db_pass: str

    class Config:
        env_file = ".env"  # 自动加载

settings = Settings()
print(settings.db_user)
```

