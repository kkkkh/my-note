from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# -------------------- 数据库配置 --------------------
# SQLite数据库地址
DATABASE_URL = "sqlite:///./test.db"
# 创建数据库引擎
# connect_args={"check_same_thread": False} 是 SQLite 特有配置，允许多线程访问
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# 创建Session类，用于操作数据库
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# 数据库依赖
def get_db():
    """
    获取数据库session
    使用yield保证使用完毕后关闭
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# -------------------- 数据库模型 --------------------
# 创建基类，用于定义ORM模型（作用于数据库）
Base = declarative_base()
class Item(Base):
    """
    数据库表Item
    """
    __tablename__ = "items"  # 表名
    id = Column(Integer, primary_key=True, index=True)  # 主键id
    name = Column(String, index=True)  # 名称
    description = Column(String, nullable=True)  # 描述，可为空

# 创建表，如果表不存在则创建
Base.metadata.create_all(bind=engine)
# -------------------- Pydantic模型 --------------------
# 作用于请求参数
class ItemRequest(BaseModel):
    """
    请求体模型，用于创建或更新Item
    """
    name: str
    description: Optional[str] = None
# 作用于响应参数
class ItemResponse(ItemRequest):
    """
    响应模型，用于返回Item，包括id
    """
    id: int
# -------------------- FastAPI实例 --------------------
app = FastAPI(title="FastAPI + SQLite CRUD Demo")

