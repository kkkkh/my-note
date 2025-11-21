# FastApi
## 框架应用

- 初始配置

<<< ./Base.py

- @app
  - @app.post("/items/") 就是一个装饰器，它告诉 FastAPI，
  - create_item 这个函数应该处理 /items/ 这个 POST 请求。
  - 装饰器的作用是将 create_item 函数和路由进行关联，类似于一种函数的注册机制
```py
# -------------------- CRUD接口 @app --------------------
# 创建Item
@app.post("/items/", response_model=ItemResponse)
def create_item(item: ItemRequest):
    """
    创建一个新的Item
    """
    db = next(get_db())
    db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)  # 刷新对象，获取数据库生成的id
    return db_item
# 获取所有Item
@app.get("/items/", response_model=List[ItemResponse])
def read_items():
    """
    获取所有Item
    """
    db = next(get_db())
    return db.query(Item).all()
# 根据ID获取Item
@app.get("/items/{item_id}", response_model=ItemResponse)
def read_item(item_id: int):
    """
    根据ID获取Item，如果不存在返回404
    """
    db = next(get_db())
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
# 更新Item
@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: ItemRequest):
    """
    更新指定ID的Item
    """
    db = next(get_db())
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.name = item.name
    db_item.description = item.description
    db.commit()
    db.refresh(db_item)
    return db_item
# 删除Item
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    """
    删除指定ID的Item
    """
    db = next(get_db())
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "Item deleted successfully"}
```
- @router
  - 在 FastAPI 中，APIRouter 是用来创建路由组的工具。
  - 它允许你将多个路由放在一起进行管理，而不需要每次都通过 app 来绑定路由。
```py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.schemas.item import ItemResponse, ItemRequest
import src.crud.item as crud_item

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemResponse)
def create_item(item: ItemRequest, db: Session = Depends(get_db)):
    return crud_item.create_item(db, item)
@router.get("/", response_model=List[ItemResponse])
def read_items(db: Session = Depends(get_db)):
    return crud_item.get_items(db)
```
## 结构调整
- 现在的整个代码耦合在一起
- 根据不同的分工，将代码拆分成不同的模块
  - 架构模块（FastAPI 架构）/app
  - 数据库模块 /database
  - 路由模块（Router）/router
  - SQLAlchemy 模型/schemas 数据验证规则
  - 数据库 CRUD/crud
  - 数据块模型 orm  /models
### App
- FastAPI实例；跨域处理；注册路由
- 自动创建数据库表

<<< ./App.py

### database
- 创建数据库引擎，连接数据库；session操作数据库
- 创建基类 => 定义ORM模型；自动创建数据库表

<<< ./src/database.py

### router
- 路由实例
- @router.post("/") 收到/items/的POST 请求时
- 检验请求和返回数据 -> 基于 数据交换模型（Pydantic层）
- 调用对应crud操作数据库

<<< ./src/routers/item.py

### schemas  数据交换模型（Pydantic层）
- 定义 输入输出的数据格式，用于 请求校验 和 响应返回

<<< ./src/schemas/item.py

### crud
- 数据库操作；基于数据库模型（ORM层）

<<< ./src/crud/item.py

### models 数据库模型（ORM层）
- 定义数据库表的结构，描述表和列的对应关系。

<<< ./src/models/item.py
