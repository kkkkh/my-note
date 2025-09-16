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
