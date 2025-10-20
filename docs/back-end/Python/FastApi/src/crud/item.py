from sqlalchemy.orm import Session
from src.models.item import Item
from src.schemas.item import ItemRequest
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_

def create_item_existing(db: Session, item: ItemRequest):
    # 不能在传参时，直接给 Pydantic ItemRequest 对象加新字段
    existing = db.query(Item).filter(Item.name == item.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="This name already exists.")
    db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_item_uniq(db: Session, item: ItemRequest):

    db_item = Item(**item) # 字典解包相关字段
    # db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    try:
        db.commit()
        db.refresh(db_item)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="This translation already exists.")
    return db_item

def get_item_byId(db: Session,item: ItemRequest):
    return db.query(Item).filter(
        # and_ 复合条件
        and_(
            Item.name == item["name"],
            Item.description == item["description"],
        )
    ).first()

def get_items(db: Session):
    return db.query(Item).all()


