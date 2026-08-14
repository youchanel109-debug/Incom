from datetime import date
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.transaction import BudgetLineItem


def month_start(value: date) -> date:
    return value.replace(day=1)


def next_month_start(value: date) -> date:
    month = month_start(value)
    if month.month == 12:
        return month.replace(year=month.year + 1, month=1)
    return month.replace(month=month.month + 1)


def get_items(db: Session, budget_month: date, kind: str | None = None) -> list[BudgetLineItem]:
    start = month_start(budget_month)
    end = next_month_start(budget_month)
    statement = select(BudgetLineItem).where(BudgetLineItem.budget_month >= start, BudgetLineItem.budget_month < end)
    if kind:
        statement = statement.where(BudgetLineItem.kind == kind)
    return list(db.scalars(statement.order_by(BudgetLineItem.id)))


def line_item_payload(item: BudgetLineItem) -> dict:
    return {"id": item.id, "budget_month": item.budget_month, "category_name": item.category_name,
            "kind": item.kind, "description": item.description, "budgeted": item.budgeted,
            "actual": item.actual, "difference": item.budgeted - item.actual, "notes": item.notes}


def summary(db: Session, budget_month: date) -> dict:
    items = get_items(db, budget_month)
    actual = {kind: sum((i.actual for i in items if i.kind == kind), Decimal("0")) for kind in ("income", "expenses", "savings", "custom")}
    budgeted = {kind: sum((i.budgeted for i in items if i.kind == kind), Decimal("0")) for kind in actual}
    return {"budget_month": month_start(budget_month), "total_income": actual["income"], "total_expenses": actual["expenses"], "total_savings": actual["savings"], "total_custom": actual["custom"], "net": actual["income"] - actual["expenses"] - actual["savings"] - actual["custom"], "income_budgeted": budgeted["income"], "expenses_budgeted": budgeted["expenses"], "savings_budgeted": budgeted["savings"], "custom_budgeted": budgeted["custom"]}
