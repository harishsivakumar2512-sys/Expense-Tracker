import os
import django
from decimal import Decimal
from datetime import datetime, timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_tracker.settings')
django.setup()

from django.contrib.auth import get_user_model
from tracker.models import Category, Transaction

User = get_user_model()

def seed():
    print("Seeding database...")

    # 1. Create or get user
    user, created = User.objects.get_or_create(
        email='harish@example.com',
        defaults={
            'name': 'Harish S',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    user.set_password('password123')
    user.name = 'Harish S'
    user.save()
    print(f"User: {user.email} (password: password123)")

    # 2. Categories
    categories_data = [
        {"name": "Food & Dining", "icon": "utensils", "color": "#FFA033"},
        {"name": "Shopping", "icon": "shopping-bag", "color": "#3B82F6"},
        {"name": "Transport", "icon": "bus", "color": "#22C97A"},
        {"name": "Entertainment", "icon": "film", "color": "#A855F7"},
        {"name": "Others", "icon": "more-horizontal", "color": "#94A3B8"},
    ]

    cat_objs = {}
    for cat in categories_data:
        c, _ = Category.objects.get_or_create(
            name=cat["name"],
            defaults={"icon": cat["icon"], "color": cat["color"]}
        )
        c.icon = cat["icon"]
        c.color = cat["color"]
        c.save()
        cat_objs[cat["name"]] = c
    print(f"Categories seeded: {list(cat_objs.keys())}")

    # 3. Clean existing transactions for this user
    Transaction.objects.filter(user=user).delete()

    # 4. Transactions matching the screenshot
    # Category totals:
    # Food & Dining: 5360 (Domino's: 420 + Dining out / Groceries: 4940)
    # Shopping: 4690 (Amazon: 1299 + Clothing: 3391)
    # Transport: 3015 (Bus: 40 + Metro & Fuel: 2975)
    # Entertainment: 2010 (Movies & Streaming: 2010)
    # Others: 1675 (Utilities & Misc: 1675)
    # Total Expenses = 16,750
    # Total Income = 25,000 (Salary: 23000 + Freelance Work: 2000)
    # Savings = 8,250

    transactions = [
        # Recent 4 visible in screenshot:
        {
            "category": cat_objs["Food & Dining"],
            "type": "expense",
            "amount": Decimal("420.00"),
            "note": "Food - Domino's",
            "created_at": datetime(2026, 11, 15, 20, 45, tzinfo=timezone.utc),
        },
        {
            "category": cat_objs["Transport"],
            "type": "expense",
            "amount": Decimal("40.00"),
            "note": "Transport - Bus",
            "created_at": datetime(2026, 11, 15, 19, 20, tzinfo=timezone.utc),
        },
        {
            "category": cat_objs["Others"],
            "type": "income",
            "amount": Decimal("2000.00"),
            "note": "Freelance Work",
            "created_at": datetime(2026, 11, 14, 18, 10, tzinfo=timezone.utc),
        },
        {
            "category": cat_objs["Shopping"],
            "type": "expense",
            "amount": Decimal("1299.00"),
            "note": "Shopping - Amazon",
            "created_at": datetime(2026, 11, 13, 17, 30, tzinfo=timezone.utc),
        },
        # Background transactions to balance totals:
        {
            "category": cat_objs["Others"],
            "type": "income",
            "amount": Decimal("23000.00"),
            "note": "Monthly Salary",
            "created_at": datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc),
        },
        {
            "category": cat_objs["Food & Dining"],
            "type": "expense",
            "amount": Decimal("4940.00"),
            "note": "Supermarket & Groceries",
            "created_at": datetime(2026, 11, 5, 14, 30, tzinfo=timezone.utc),
        },
        {
            "category": cat_objs["Shopping"],
            "type": "expense",
            "amount": Decimal("3391.00"),
            "note": "Electronics & Apparel",
            "created_at": datetime(2026, 11, 8, 16, 20, tzinfo=timezone.utc),
        },
        {
            "category": cat_objs["Transport"],
            "type": "expense",
            "amount": Decimal("2975.00"),
            "note": "Fuel & Monthly Pass",
            "created_at": datetime(2026, 11, 4, 11, 0, tzinfo=timezone.utc),
        },
        {
            "category": cat_objs["Entertainment"],
            "type": "expense",
            "amount": Decimal("2010.00"),
            "note": "Concert & Subscriptions",
            "created_at": datetime(2026, 11, 9, 21, 15, tzinfo=timezone.utc),
        },
        {
            "category": cat_objs["Others"],
            "type": "expense",
            "amount": Decimal("1675.00"),
            "note": "Utility Bills & Mobile Recharge",
            "created_at": datetime(2026, 11, 6, 10, 0, tzinfo=timezone.utc),
        },
    ]

    for tx in transactions:
        t = Transaction.objects.create(
            user=user,
            category=tx["category"],
            type=tx["type"],
            amount=tx["amount"],
            note=tx["note"],
            created_at=tx["created_at"],
        )

    print(f"Created {len(transactions)} transactions.")
    print("Seeding complete.")

if __name__ == '__main__':
    seed()
