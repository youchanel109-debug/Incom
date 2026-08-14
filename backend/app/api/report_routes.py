from datetime import date
from fastapi import APIRouter, Depends, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.pdf_generator import generate_report

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/export")
def export_report(month: date = Query(...), db: Session = Depends(get_db)):
    path = generate_report(db, month.replace(day=1))
    return FileResponse(path, media_type="application/pdf", filename=path.name)
