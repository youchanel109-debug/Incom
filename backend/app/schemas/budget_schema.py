from datetime import date
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field

VALID_KINDS = {"income", "expenses", "savings", "custom"}


class LineItemBase(BaseModel):
    category_name: str = Field(min_length=1, max_length=100)
    kind: str
    description: str = ""
    budgeted: Decimal = Field(default=0, ge=0)
    actual: Decimal = Field(default=0, ge=0)
    notes: str = ""


class LineItemCreate(LineItemBase):
    budget_month: date


class LineItemUpdate(BaseModel):
    category_name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    budgeted: Decimal | None = Field(default=None, ge=0)
    actual: Decimal | None = Field(default=None, ge=0)
    notes: str | None = None
    budget_month: date | None = None


class LineItemOut(LineItemBase):
    id: int
    budget_month: date
    difference: Decimal
    model_config = ConfigDict(from_attributes=True)


class SummaryOut(BaseModel):
    budget_month: date
    total_income: Decimal
    total_expenses: Decimal
    total_savings: Decimal
    total_custom: Decimal
    net: Decimal
    income_budgeted: Decimal
    expenses_budgeted: Decimal
    savings_budgeted: Decimal
    custom_budgeted: Decimal
