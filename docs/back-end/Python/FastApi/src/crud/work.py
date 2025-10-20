from sqlalchemy.orm import Session
from src.models.item import Item
from src.schemas.item import ItemRequest

def create_work(db: Session, item: ItemRequest):
    db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    db.flush()
    db.refresh(db_item)
    return db_item
