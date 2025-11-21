from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
router = APIRouter(prefix="/items", tags=["items"])
from src.schemas.common import CommonResponse
from typing import List
from src.schemas.item import ItemResponse
import src.crud.item as crud_item
from src.database import get_db

router = APIRouter(prefix="/all", tags=["items"])
@router.get("/", response_model=CommonResponse[List[ItemResponse]])
def get_all( db: Session = Depends(get_db)):
    records = crud_item.get_items(db)
    return CommonResponse(
        success=True,
        message="ok",
        data=records
    )
