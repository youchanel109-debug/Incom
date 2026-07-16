# My Custom Budget

A React/Vite budgeting dashboard backed by FastAPI, SQLAlchemy, MySQL, ReportLab, and APScheduler.

## Run locally

1. Create the database and least-privilege user: `mysql -u root -p < backend/sql/init.sql`.
2. Copy `backend/.env.example` to `backend/.env`, then set your MySQL password. For local PDF output, set `REPORTS_DIRECTORY=./budget_reports`.
3. Start the API:

   ```bash
   cd backend
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. Start the dashboard in another terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The API is available at `http://localhost:8000/docs`; the dashboard is at `http://localhost:5175`.

## API

- `GET /api/budget/summary?month=2026-07-01`
- `GET /api/budget/items?month=2026-07-01&kind=expenses`
- `POST /api/budget/items`, `PUT /api/budget/items/{id}`, `DELETE /api/budget/items/{id}`
- `POST /api/reports/export?month=2026-07-01` returns a PDF download.

All monetary differences are computed on the server as `budgeted - actual`; NET is income minus expenses, savings/debt, and custom-category actuals. The scheduler runs at 23:59 in `SCHEDULER_TIMEZONE` on the last day of the month and writes `budget-report-YYYY-MM.pdf` to `REPORTS_DIRECTORY/YYYY/MM/`.

## Ubuntu deployment

Build the frontend with `npm run build`, deploy the repository to `/opt/my-custom-budget`, configure `backend/.env`, and create `/var/budget_reports` owned by `www-data`. Copy the included Nginx and systemd configurations, then run `sudo systemctl daemon-reload && sudo systemctl enable --now fastapi` and reload Nginx. Set `VITE_API_URL=/api` when building the production frontend.
# Incom
