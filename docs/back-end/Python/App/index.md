# App
## fastapi
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
## SQLAlchemy Core 返回结果
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
