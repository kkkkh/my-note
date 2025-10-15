## dict
### PyGlossary
- 常规使用：
  - 网络上有大量免费的 英汉 StarDict/MDict 词典（体积几十 MB，几万个词条）。
  - 用 Python 的 PyGlossary读取，就能直接查词。
```python
from pyglossary import Glossary
glos = Glossary()
glos.open("stardict-en-zh.dict")  # 英汉词典文件
print(glos["apple"])              # 输出：苹果，苹果公司
```
- 报错：OSError: failed to detect dataDir
  - PyGlossary 在 Windows 上的常见问题 —— 它找不到自带的 data 目录
  - pyglossary 的 Python API 还不太稳定
- 命令行方式
```bash
# 来把词典先转换为 JSON/SQLite，再在项目里读取。
pyglossary stardict-langdao-ce.ifo output.json
pyglossary stardict-langdao-ce.ifo output.db --write-format=Sqlite

```
```python
import json
with open("output.json", "r", encoding="utf-8") as f:
    dictionary = json.load(f)
print(dictionary.get("apple"))
```
- 显式指定 dataDir
```python
import pyglossary.core as core
import os
# 手动设置 dataDir
core.dataDir = os.path.join(os.path.dirname(core.__file__), "data")
from pyglossary import Glossary
glos = Glossary()
glos.open("stardict-langdao-ce.ifo")
print(glos["apple"])
```
