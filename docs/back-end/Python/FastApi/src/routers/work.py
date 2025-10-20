from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from src.database import get_db
from src.schemas.item import ItemResponse, ItemRequest
import src.crud.work as crud_work


router = APIRouter(prefix="/work", tags=["items"])
# 创建事务
@router.post("/add", response_model=ItemResponse)
def create_item_work(item: ItemRequest, db: Session = Depends(get_db)):
    try:
        with db.begin():  # 🔑 使用事务
            item = crud_work.create_work(db, item)
            return item
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Duplicate entry.")
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error.")
