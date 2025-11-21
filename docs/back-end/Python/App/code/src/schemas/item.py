"""
schemas —— 数据交换模型（Pydantic层）
作用：定义 输入输出的数据格式，用于 请求校验 和 响应返回。
来源：用 Pydantic 定义。
内容：哪些字段可以接收、哪些字段会返回，字段类型校验。
对应层次：API 层。
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    # Optional[str] 等价于 Union[str, None]，意思是：
    # 这个字段可以是字符串，也可以是 None（空值）。

class ItemRequest(ItemBase):
    pass
# class ItemRead(ItemBase):
#     id: int
#     class Config:
#         orm_mode = True
class ItemResponse(ItemBase):
    id: int
    # v2 用法：用 model_config 并把 from_attributes=True
    # from_attributes=True 表示：
    # 当你用 ORM 对象（比如 SQLAlchemy 模型实例）创建 Pydantic 模型时，会从对象的属性读取值，而不仅仅是字典键。
    # 这个模型不仅能接收 dict，还能接收 SQLAlchemy ORM 对象（甚至其他有属性的对象），自动把 ORM 对象转成 Pydantic 模型
    model_config = ConfigDict(from_attributes=True)
