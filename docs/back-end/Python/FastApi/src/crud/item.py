from sqlalchemy.orm import Session
from src.models.item import Item
from src.schemas.item import ItemRequest
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

def create_item(db: Session, item: ItemRequest):
    existing = db.query(Item).filter(Item.name == item.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="This name already exists.")
    db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def create_item_uniq(db: Session, item: ItemRequest):
    db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    try:
        db.commit()
        db.refresh(db_item)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="This translation already exists.")
    return db_item

def get_items(db: Session):
    return db.query(Item).all()
