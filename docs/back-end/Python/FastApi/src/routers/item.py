from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.schemas.item import ItemResponse, ItemRequest
import src.crud.item as crud_item

router = APIRouter(prefix="/items", tags=["items"])
# prefix="/items" 表示该路由组下所有路由的 URL 都会以 /items 为前缀。
# tags=["items"] 是给该路由组打上标签，便于 API 文档中分类。

@router.post("/", response_model=ItemResponse)
def create_item(item: ItemRequest, db: Session = Depends(get_db)):
    return crud_item.create_item(db, item)
@router.get("/", response_model=List[ItemResponse])
def read_items(db: Session = Depends(get_db)):
    return crud_item.get_items(db)
