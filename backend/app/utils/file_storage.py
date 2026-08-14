from datetime import date
from pathlib import Path
from app.core.config import settings


def report_path(budget_month: date) -> Path:
    directory = settings.reports_directory / f"{budget_month.year:04d}" / f"{budget_month.month:02d}"
    directory.mkdir(parents=True, exist_ok=True)
    return directory / f"budget-report-{budget_month:%Y-%m}.pdf"
