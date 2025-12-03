# SQLite
## 基本语句
- 创建表
```sql
CREATE TABLE mytable IF NOT EXISTS (id VARCHAR(32) NOT NULL PRIMARY KEY, status INTEGER DEFAULT NULL);
```
- 插入数据
```sql
INSERT INTO mytable (id, status) VALUES ('1', 1);
```
- 查询数据
```sql
SELECT * FROM mytable WHERE id = ?;
```
- 更新数据
```sql
UPDATE mytable SET status = ? WHERE id = ?;
```
- 删除数据
```sql
DELETE FROM mytable WHERE id = ?;
```
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
# 查看前10条数据
SELECT * FROM table_name LIMIT 10;
# 删除表
DELETE FROM table_name;
# 修改数据-更新字段
UPDATE users SET name = '***' WHERE id = 1; #修改数据
# 增加字段
ALTER TABLE pod_english_records ADD COLUMN user_id INTEGER;
# 修改数据-填充历史数据
UPDATE pod_english_records SET user_id = 1 WHERE user_id IS NULL;
# 增加索引
CREATE INDEX ix_pod_english_records_user_id ON pod_english_records(user_id);
```
## 批量操作
```bash
# 批量插入
INSERT INTO table_name (group_id, seq, name, 'desc',  created_at, updated_at ) VALUES
(1, 1, '1', '', '2025-11-27 17:41:07.51734','2025-11-27 17:41:07.51734'),
...

# 批量依赖其他字段生成
UPDATE table_name
SET lrcUrl = '/resource/' || CAST(group_id AS TEXT) || '_' || CAST(id AS TEXT) || '.lrc';
# SET lrcUrl = '/resource/' || CAST(group_id + id AS TEXT) || '.lrc'; # 加法运算


UPDATE table_name
SET audioUrl = '/resource/audio/' || CAST(group_id AS TEXT) || '_' || CAST(id AS TEXT) || '/playlist.m3u8';
```
