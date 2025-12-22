# SQLite
## 命令行操作
```bash
# 连接
sqlite3 ./path/sqlite.db
----
# 查看所有表
.tables
# 查看表结构
.schema table_name

# 退出
.quit
```
## 基本查询
```bash
# 创建表
CREATE TABLE mytable IF NOT EXISTS (id VARCHAR(32) NOT NULL PRIMARY KEY, status INTEGER DEFAULT NULL);
# 插入一条数据
INSERT INTO mytable (id, status) VALUES ('1', 1);
# 查看前10条数据
SELECT * FROM table_name LIMIT 10 WHERE id = 1;
# 删除一条数据
DELETE FROM mytable WHERE id = ?;
# 修改数据-更新字段的值
UPDATE users SET name = '***' WHERE id = 1; #修改数据
# 增加字段
ALTER TABLE users ADD COLUMN user_id INTEGER;
# 修改数据-填充历史数据
UPDATE users SET user_id = 1 WHERE user_id IS NULL;
# 增加索引
CREATE INDEX ix_pod_english_records_user_id ON pod_english_records(user_id);
# 删除表
DELETE FROM table_name;
```

## 批量操作
```bash
# 机械批量插入
INSERT INTO table_name (group_id, seq, name, 'desc',  created_at, updated_at ) VALUES
(1, 1, '1', '', '2025-11-27 17:41:07.51734','2025-11-27 17:41:07.51734'),
...

# 使用递归 CTE
# 批量插入 - 多条数据 11 - 100
WITH cnt(id) AS (
    SELECT 10  # 起始值
    UNION ALL
    SELECT id + 1 FROM cnt WHERE id < 100
)
INSERT INTO resources (group_id, seq, name, created_at, updated_at, lrcUrl, audioUrl, desc )
SELECT
    1 AS group_id,
    id AS seq,
    '1_' || id AS name,
    '2025-11-27 17:41:07.51734',
    '2025-11-27 17:41:07.51734',
    './resource/' || '1' || '_' || CAST(id AS TEXT) || '.lrc',
    '/resource/audio/' || '1' || '_' || CAST(id AS TEXT) || '/playlist.m3u8',
    ''
FROM cnt;

# 批量更新-依赖其他字段生成
UPDATE table_name
SET
  lrcUrl = '/resource/' || CAST(group_id AS TEXT) || '_' || CAST(id AS TEXT) || '.lrc',
  audioUrl = '/resource/audio/' || CAST(group_id AS TEXT) || '_' || CAST(id AS TEXT) || '/playlist.m3u8',
  desc = '1_' || id
WHERE group_id = 1 AND lrcUrl IS NULL;

# SET lrcUrl = '/resource/' || CAST(group_id + id AS TEXT) || '.lrc'; # 加法运算
```
## 注意事项
### 增加字段
- 在表尾部增加字段
- 不能删除字段
- 不能修改字段类型
- 不能同时增加多个字段（但可多次执行 ADD COLUMN）
```bash
# 带默认值：
ALTER TABLE resources ADD COLUMN lrcUrl TEXT DEFAULT '';
# 允许 NULL：
ALTER TABLE resources ADD COLUMN lrcUrl TEXT;
# 不允许 NULL 但需要默认值：
ALTER TABLE resources ADD COLUMN lrcUrl TEXT NOT NULL DEFAULT '';
```
