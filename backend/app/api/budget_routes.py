from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.transaction import BudgetLineItem
from app.schemas.budget_schema import LineItemCreate, LineItemOut, LineItemUpdate, SummaryOut, VALID_KINDS
from app.services.budget_service import get_items, line_item_payload, month_start, summary

router = APIRouter(prefix="/api", tags=["budget"])


@router.get("/budget/summary", response_model=SummaryOut)
def get_summary(month: date = Query(...), db: Session = Depends(get_db)):
    return summary(db, month)


@router.get("/budget/items", response_model=list[LineItemOut])
def list_items(month: date = Query(...), kind: str | None = Query(None), db: Session = Depends(get_db)):
    if kind and kind not in VALID_KINDS:
        raise HTTPException(400, "Invalid category type")
    return [line_item_payload(item) for item in get_items(db, month, kind)]


@router.post("/budget/items", response_model=LineItemOut, status_code=status.HTTP_201_CREATED)
def create_item(payload: LineItemCreate, db: Session = Depends(get_db)):
    if payload.kind not in VALID_KINDS:
        raise HTTPException(400, "Invalid category type")
    values = payload.model_dump()
    values["budget_month"] = month_start(payload.budget_month)
    item = BudgetLineItem(**values)
    db.add(item); db.commit(); db.refresh(item)
    return line_item_payload(item)


@router.put("/budget/items/{item_id}", response_model=LineItemOut)
def update_item(item_id: int, payload: LineItemUpdate, db: Session = Depends(get_db)):
    item = db.get(BudgetLineItem, item_id)
    if not item: raise HTTPException(404, "Line item not found")
    for field, value in payload.model_dump(exclude_unset=True).items(): setattr(item, field, value)
    db.commit(); db.refresh(item)
    return line_item_payload(item)


@router.delete("/budget/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(BudgetLineItem, item_id)
    if not item: raise HTTPException(404, "Line item not found")
    db.delete(item); db.commit()
