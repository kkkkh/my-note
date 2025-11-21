from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

# 定义泛型占位符
T = TypeVar("T")

# 声明泛型模型
class CommonResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
