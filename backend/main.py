from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import get_db

app = FastAPI(
    title="VERITAS API",
    description="FastAPI backend for the VERITAS Web Vulnerability Scanner",
    version="0.1.0",
)


@app.get("/")
def root():
    """Health-check root endpoint."""
    return {"status": "ok", "message": "VERITAS API is running."}


@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    """
    Connectivity test endpoint.

    Executes a lightweight raw SQL query against the Supabase database
    and returns the server's current timestamp, confirming the connection
    is alive and authenticated.
    """
    try:
        result = db.execute(text("SELECT NOW();"))
        server_time = result.scalar()  # returns a datetime object
        return {
            "status": "success",
            "message": "Database connection is alive.",
            "server_time": str(server_time),
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {exc}",
        )
