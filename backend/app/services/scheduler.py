from datetime import date
from apscheduler.schedulers.background import BackgroundScheduler
from app.core.config import settings
from app.core.database import SessionLocal
from app.services.pdf_generator import generate_report

scheduler = BackgroundScheduler(timezone=settings.scheduler_timezone)


def export_previous_month():
    # The job runs on the final calendar day, so export the month that is closing.
    previous = date.today().replace(day=1)
    db = SessionLocal()
    try: generate_report(db, previous)
    finally: db.close()


def start_scheduler():
    if not scheduler.running:
        # Run at 23:59 on the last day of each month; the day predicate is evaluated by APScheduler.
        scheduler.add_job(export_previous_month, "cron", day="last", hour=23, minute=59, id="monthly_budget_export", replace_existing=True)
        scheduler.start()


def stop_scheduler():
    if scheduler.running: scheduler.shutdown()
