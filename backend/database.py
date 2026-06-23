import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv()

# Retrieve the raw DATABASE_URL and swap the driver to psycopg2
DATABASE_URL: str = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

# SQLAlchemy requires the psycopg2 dialect explicitly
SQLALCHEMY_DATABASE_URL = DATABASE_URL.replace(
    "postgresql://", "postgresql+psycopg2://", 1
)

# Create the SQLAlchemy engine.
# pool_pre_ping=True: before each connection checkout, SQLAlchemy issues a
# lightweight "ping" so stale connections from Supabase's pooler are recycled
# automatically instead of raising an OperationalError mid-request.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
)

# Session factory — each request gets its own short-lived session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy session and guarantees
    the session is closed after the request finishes (even on errors).

    Usage:
        @app.get("/example")
        def example(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
