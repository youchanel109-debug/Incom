from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from sqlalchemy.orm import Session

from app.services.budget_service import get_items, summary
from app.utils.file_storage import report_path

FONTS_DIR = Path.home() / "Library/Fonts"
KHMER_REGULAR = str(FONTS_DIR / "NotoSansKhmer-Regular.ttf")
KHMER_BOLD = str(FONTS_DIR / "NotoSansKhmer-Bold.ttf")

pdfmetrics.registerFont(TTFont("Khmer", KHMER_REGULAR))
pdfmetrics.registerFont(TTFont("Khmer-Bold", KHMER_BOLD))

KHMER_STYLE = ParagraphStyle("KhmerCell", fontName="Khmer", fontSize=7, leading=10)
KHMER_HEADING = ParagraphStyle("KhmerHeading", fontName="Khmer-Bold", fontSize=10, leading=14)
KHMER_TITLE = ParagraphStyle("KhmerTitle", fontName="Khmer-Bold", fontSize=18, leading=24)
KHMER_SUMMARY = ParagraphStyle("KhmerSummary", fontName="Khmer", fontSize=10, leading=14)


def p(text, style=KHMER_STYLE):
    return Paragraph(str(text) if text else "", style)


def generate_report(db: Session, budget_month: date):
    path = report_path(budget_month)
    data = summary(db, budget_month)
    story = [Paragraph(f"My Custom Budget — {budget_month:%B %Y}", KHMER_TITLE), Spacer(1, 0.2 * inch)]
    totals = [[p("Total income"), p(f"${data['total_income']:,.2f}")],
              [p("Total expenses"), p(f"${data['total_expenses']:,.2f}")],
              [p("Savings / debt"), p(f"${data['total_savings']:,.2f}")],
              [p("Custom categories"), p(f"${data['total_custom']:,.2f}")],
              [p("NET"), p(f"${data['net']:,.2f}")]]
    summary_table = Table(totals, colWidths=[2.8 * inch, 2 * inch])
    summary_table.setStyle(TableStyle([("BACKGROUND", (0, 4), (-1, 4), colors.HexColor("#172554")), ("TEXTCOLOR", (0, 4), (-1, 4), colors.white), ("GRID", (0, 0), (-1, -1), .4, colors.lightgrey), ("PADDING", (0, 0), (-1, -1), 7)]))
    story += [summary_table, Spacer(1, 0.25 * inch)]
    for kind, title in [("income", "Income"), ("expenses", "Expenses"), ("savings", "Savings / Debt Payments"), ("custom", "Custom Categories")]:
        header = [p("Category", KHMER_HEADING), p("Description", KHMER_HEADING), p("Budgeted", KHMER_HEADING), p("Actual", KHMER_HEADING), p("Difference", KHMER_HEADING), p("Notes", KHMER_HEADING)]
        rows = [header]
        for item in get_items(db, budget_month, kind):
            rows.append([p(item.category_name), p(item.description), p(f"${item.budgeted:,.2f}"), p(f"${item.actual:,.2f}"), p(f"${item.budgeted-item.actual:,.2f}"), p(item.notes)])
        if len(rows) == 1:
            rows.append([p("No entries"), p(""), p(""), p(""), p(""), p("")])
        story += [Paragraph(title, KHMER_HEADING), Table(rows, repeatRows=1, colWidths=[.95*inch, 1.2*inch, .75*inch, .75*inch, .75*inch, 1.1*inch]), Spacer(1, .18*inch)]
        story[-2].setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a8a")), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("GRID", (0, 0), (-1, -1), .3, colors.lightgrey), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("FONTSIZE", (0, 0), (-1, -1), 7), ("PADDING", (0, 0), (-1, -1), 4)]))
    SimpleDocTemplate(str(path), pagesize=letter, rightMargin=30, leftMargin=30, topMargin=35, bottomMargin=35).build(story)
    return path
