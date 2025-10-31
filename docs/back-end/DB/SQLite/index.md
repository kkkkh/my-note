# SQLite
## 基本操作
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
.tables                             # 查看所有表
.schema table_name                  # 查看表结构
SELECT * FROM table_name LIMIT 10;  # 查看前10条数据
.quit                               # 退出
```
