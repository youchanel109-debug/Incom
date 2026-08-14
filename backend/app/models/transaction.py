from datetime import date
from decimal import Decimal
from sqlalchemy import Date, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class BudgetLineItem(Base):
    __tablename__ = "budget_line_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    budget_month: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    # Keep this annotation non-union for SQLAlchemy 2.0.36 compatibility with
    # Python 3.14; nullable=True still permits NULL in MySQL.
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=True)
    category_name: Mapped[str] = mapped_column(String(100), nullable=False)
    kind: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    description: Mapped[str] = mapped_column(String(255), default="")
    budgeted: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    actual: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    notes: Mapped[str] = mapped_column(Text, default="")
    category = relationship("Category", back_populates="line_items")
