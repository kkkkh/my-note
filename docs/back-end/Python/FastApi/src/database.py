from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# -------------------- 数据库配置 --------------------
# SQLite数据库地址
DATABASE_URL = "sqlite:///./test.db"
# 创建数据库引擎
# connect_args={"check_same_thread": False} 是 SQLite 特有配置，允许多线程访问
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
    },
    # echo=True,
)
# 创建Session类，用于操作数据库
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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
# -------------------- 创建基类，用于定义ORM模型 --------------------
Base = declarative_base()
# -------------------- 自动创建数据库表 --------------------
def create_tables():
    """
    自动创建数据库表
    这个函数可以在应用启动时调用
    """
    Base.metadata.create_all(bind=engine)
# -------------------- 数据库依赖 --------------------
