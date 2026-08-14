from datetime import date
from decimal import Decimal
from app.core.database import SessionLocal, engine, Base
from app.models.category import Category
from app.models.transaction import BudgetLineItem


def reset_and_seed():
    print('Dropping and recreating tables...')
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    print('Inserting seed categories...')
    categories = [
        Category(name='Salary', kind='income'),
        Category(name='Freelance', kind='income'),
        Category(name='Rent', kind='expenses'),
        Category(name='Groceries', kind='expenses'),
        Category(name='Utilities', kind='expenses'),
        Category(name='Savings', kind='savings'),
    ]

    with SessionLocal() as db:
        db.add_all(categories)
        db.commit()

        print('Inserting seed budget items...')
        items = [
            BudgetLineItem(
                budget_month=date.today().replace(day=1),
                category_id=categories[0].id,
                category_name=categories[0].name,
                kind='income',
                description='Base salary',
                budgeted=Decimal('6500.00'),
                actual=Decimal('6500.00'),
                notes='Monthly income from full-time role.',
            ),
            BudgetLineItem(
                budget_month=date.today().replace(day=1),
                category_id=categories[2].id,
                category_name=categories[2].name,
                kind='expenses',
                description='Monthly rent payment',
                budgeted=Decimal('1600.00'),
                actual=Decimal('1600.00'),
                notes='Paid to landlord at the start of month.',
            ),
            BudgetLineItem(
                budget_month=date.today().replace(day=1),
                category_id=categories[3].id,
                category_name=categories[3].name,
                kind='expenses',
                description='Weekly groceries',
                budgeted=Decimal('520.00'),
                actual=Decimal('485.35'),
                notes='Healthy groceries, occasional dining out.',
            ),
            BudgetLineItem(
                budget_month=date.today().replace(day=1),
                category_id=categories[5].id,
                category_name=categories[5].name,
                kind='savings',
                description='Emergency fund contribution',
                budgeted=Decimal('800.00'),
                actual=Decimal('800.00'),
                notes='Automatically transferred on payday.',
            ),
        ]
        db.add_all(items)
        db.commit()

    print('Seed complete. Database is ready.')


if __name__ == '__main__':
    reset_and_seed()
