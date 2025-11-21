"""
models —— 数据库模型（ORM层）
作用：定义数据库表的结构，描述表和列的对应关系。
来源：用 SQLAlchemy ORM 定义。
内容：表名、字段、类型、索引、主键、外键等。
对应层次：数据库层。
"""
from sqlalchemy import Column, Integer, String, DateTime, func, UniqueConstraint
from sqlalchemy.dialects.sqlite import JSON
from src.database import Base
from datetime import datetime
class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True) # 自增主键
    # index = True 数据库在这一列上创建一个 索引
    name = Column(String, index=True, unique=True) # 唯一约束，约束名不能自定义，但是可配合naming_convention自定义
    # nullable = True 允许为空
    description = Column(String, nullable=True)
    # nullable=False 不允许为空
    age = Column(Integer, nullable=False)
    # 但 SQLite 有个坑：如果索引列都是 ''，在某些场景下仍然会触发唯一性错误（取决于建表时有没有隐式约束，比如组合索引或主键）。
    # 去掉 default = ""
    alias = Column(String, nullable=True, default = "")
    # 用 JSON 存储数组
    tags = Column(JSON, nullable=True)
    # 创建时间，默认当前时间
    created_at = Column(DateTime, default=datetime.now, nullable=False) # default
    created_at = Column(DateTime, server_default=func.now(), nullable=False) # server_default
    # 更新时间，每次更新时自动修改
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    # 数据库层面约束（推荐）
    # 在 SQLAlchemy 定义模型时，加 唯一约束：
    __table_args__ = (
        UniqueConstraint('name', name='uix_name'),  # name 字段唯一 约束名uix_name自定义
        UniqueConstraint('first_name', 'last_name', name='uix_fullname'), # first_name + last_name 组合唯一
    )
