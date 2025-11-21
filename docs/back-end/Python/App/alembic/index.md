# App
## Alembic
### Alembic 使用
- SQLAlchemy 官方提供的数据库迁移工具
```bash
# 安装
pip install alembic
# 初始化
alembic init alembic
```
- 修改 alembic.ini
  - 统一改成 UTF-8 编码
  - 确保文件中没有奇怪的字符
::: details 查看代码
<<< ./alembic.ini
:::
- 修改 alembic/env.py
```py
# 可以正确加载模型路径（项目中模型）
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# 导入模型（必改）
from app.database import Base
target_metadata = Base.metadata
# 修改 run_migrations_online（与 alembic.ini 配置sqlalchemy.url 二选一）
from app.database import DATABASE_URL
from sqlalchemy import create_engine
connectable = create_engine(DATABASE_URL)
```
- 创建迁移
```bash
# alembic/versions 里生成一个新文件，例如： alembic/versions/20251020_XXXX_init.py
alembic revision --autogenerate -m "init"

```
```bash
# 如果创建迁移，但是没有执行迁移（此次不生效），想再次创建迁移
# 将数据库标记为最新版本，但不执行迁移,可以再次创建迁移
alembic stamp head
# 执行迁移
alembic upgrade head
# 针对不同 env.py 执行迁移
alembic -c alembic/user_service/env.py upgrade head
```
### Alembic + 多服务架构
- Alembic 在容器化环境中落地的核心机制：
  - 一是 迁移脚本的可访问性（迁移逻辑来源）；
  - 二是 迁移操作的落脚点（修改对象目标）。
- 实现
  - 迁移脚本的可访问性：Volume 挂载方案（迁移脚本不属于运行时状态，而属于数据库版本历史的一部分）
  - 迁移操作：
    - 文件系统 `/data/mydb.db`
    - 数据库服务 `postgres://user:pwd@host:5432/db`
```yml
version: '3.9'
services:
  alembic:
    image: my-alembic-runner:latest
    container_name: alembic_runner
    volumes:
      - ./project_a/alembic:/migrations/project_a/alembic
      - ./project_a/alembic.ini:/migrations/project_a/alembic.ini
      - ./project_b/alembic:/migrations/project_b/alembic
      - ./project_b/alembic.ini:/migrations/project_b/alembic.ini
    environment:
      - DB_A_URL=sqlite:///data/db_a.db
      - DB_B_URL=postgresql://user:pwd@postgres:5432/db_b
    command: python /migrations/run_migrations.py
```
```py
import subprocess
services = [
    ("service_a", "mysql+pymysql://user:pwd@db-service-a:3306/db_a"),
    ("service_b", "postgresql://user:pwd@db-service-b:5432/db_b"),
]
for name, db_url in services:
    print(f"Running migrations for {name}...")
    subprocess.run([
        "alembic", "-c", f"migrations/{name}/alembic.ini",
        "upgrade", "head"
    ], check=True)
```
### Alembic 不同模式下迁移
- run_migrations_offline 离线生成 SQL
  - 不连接真实数据库
  - 只会 生成 SQL 脚本，输出到屏幕或者文件
  - 生成迁移 SQL 给 DBA 审核
  - 无法直接连接数据库的环境
  - 运行效果 `alembic upgrade head --sql`
- run_migrations_online 在线直接修改数据库
  - 在 在线模式下运行迁移，直接连接数据库
  - Alembic 会执行生成的 SQL 去修改真实数据库
  - 开发环境直接升级数据库
  - 部署时自动迁移数据库
  - 运行效果 `alembic upgrade head`

| 模式      | 是否连接数据库 | 输出     | 典型用途       |
| ------- | ------- | ------ | ---------- |
| offline | ❌       | SQL 脚本 | 审核、生成 SQL  |
| online  | ✅       | 修改数据库  | 开发、部署、自动迁移 |
### dockerfile中的执行
- 问题：
  - 使用pdm 安装Alembic
  - 部署的是时候，pdm 生成 requirements.txt，安装依赖 pip install
    - `RUN pdm export -o requirements.txt --without-hashes`
    - ` pip install --no-cache-dir -r requirements.txt`
  - 如果在api-runner阶段 RUN alembic upgrade head
  - 会找不到 alembic
- 解决：
  - 在api-builder阶段 RUN alembic upgrade head
  - `COPY --from=api-builder /usr/local/bin /usr/local/bin` 将二进制文件拷贝到api-runner阶段
  - 或者在api-runner阶段，安装pip 安装 Alembic
### sqllite 迁移
- 增加 非null 两个字段
  - sqllite 一个表的增加了两个字段，且两个字段 不允许 null，代码如下
    ```bash
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, nullable=False)
    ```
  - 使用 alembic 迁移会报错，原因是：SQLite 不允许给已有表添加一个 “NOT NULL 且无默认值” 的列 ❌
  - default=datetime.now 这里是无效的，default=在 Python/ORM 层面 生成默认值，这里是数据库层
- 数据库层 增加 默认值
  - 改为 使用数据库层默认值，代码如下
    ```bash
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), nullable=False)
    ```
  - 又有新的问题：SQLite 不允许在 ALTER TABLE ADD COLUMN 时使用非常量的默认值。❌
- 真正解决思路：✅
  -（1）先添加列，允许 NULL，无默认值
  -（2）手动更新已有数据
  -（3）再 ALTER 改成 NOT NULL
  ```py
  from alembic import op
  import sqlalchemy as sa
  from datetime import datetime, timezone
  # revision identifiers, used by Alembic.
  revision = 'xxxxxx_add_created_updated'
  down_revision = 'yyyyyy_previous_revision'
  branch_labels = None
  depends_on = None

  def upgrade():
      # 1. 添加列，允许 NULL
      op.add_column(
          'groups',
          sa.Column('created_at', sa.DateTime(timezone=True), nullable=True)
      )
      op.add_column(
          'groups',
          sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True)
      )
      # 2. 填充已有数据
      now = datetime.now(timezone.utc).isoformat()
      op.execute(f"UPDATE groups SET created_at = '{now}' WHERE created_at IS NULL")
      op.execute(f"UPDATE groups SET updated_at = '{now}' WHERE updated_at IS NULL")
      # 3. 修改为 NOT NULL
      with op.batch_alter_table('groups') as batch:
          batch.alter_column('created_at', nullable=False)
          batch.alter_column('updated_at', nullable=False)
  def downgrade():
      # 1. 删除列
      with op.batch_alter_table('groups') as batch:
          batch.drop_column('updated_at')
          batch.drop_column('created_at')

  ```
- 如果在开发环境
  - 直接删除表，重新执行
- 总结
  - 因为 SQLite 的 ALTER TABLE 功能极其有限：
  - 不能添加 NOT NULL 列除非你指定 default
  - 不能直接修改列（Alembic 会自动吞吐表）
  - SQLite 的设计就是轻量级，不适合复杂 schema migration，这是正常的。
### Alembic 更新 数据被清除
- 因为在 env.py 中 缺少 关键的 models 导入
- Alembic 没看到任何模型，所以 autogenerate 误以为你删除了所有表 → 自动 drop → 数据没了。
- `alembic revision --autogenerate -m "init"`生成的迁移文件 都是 全部drop_table掉的
- 因为你没有导入 models.py，Base.metadata 里没有任何 Table
  -（SQLAlchemy 只有在导入 model 时才会把表注册进 Base.metadata）
  - 通过 `from src.models import *`，保证所有的models引入到env.py，即解决这个问题
- 同时要保证： models 继承同一个 Base
```py
from src.database import Base
from src.models import *

target_metadata = Base.metadata
print(Base.metadata.tables.keys()) # 打印查看
```
### 删除 versions
- 删除了 alembic versions中的某条记录，/versions 已不存在
- 每次 `alembic stamp head alembic upgrade head` 都会提示 `Can't locate revision identified by '33ab60******'`
- 主要原因是数据库中，留存了 alembic_version 表中 `33ab60******`，在数据库删除即可 `sqlite3 your.db "DELETE FROM alembic_version;"`
```bash
# 产看历史
alembic history
alembic history --verbose

# 查看 当前
alembic heads
# 6bef89c8524b (head)

# 设置 当前 或 其他
alembic stamp head
alembic stamp 6bef89c8524b

# 更新当前
alembic upgrade head
```
- 迁移冲突
```bash
# 有时你的迁移链是这样的：
# A → B → C
# 你切换到另一个分支：
# A → D
# 多人协作或分支切换导致 revision 指向丢失
alembic merge -m "merge branches" C D
```
