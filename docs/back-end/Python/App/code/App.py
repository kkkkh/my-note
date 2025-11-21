from fastapi import FastAPI
from src.database import create_tables
from src.routers import item as item_router
from src.routers import translations as translations_router
from fastapi.middleware.cors import CORSMiddleware
import os

create_tables()

app = FastAPI()

env = os.getenv("ENV", "dev")  # 第二个参数是默认值
if env == "dev":
    # 允许跨域的域名列表
    origins = [
        "http://localhost:3000",  # 前端地址
        # "*"  # 如果要允许所有域
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,  # 允许哪些源发起请求
        allow_credentials=True,  # 是否允许携带cookie
        allow_methods=["*"],  # 允许的HTTP方法
        allow_headers=["*"],  # 允许的HTTP请求头
    )
# 注册路由
app.include_router(item_router.router)
app.include_router(translations_router.router)
