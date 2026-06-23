from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Celery app instance — broker and result backend both point to Redis
celery_app = Celery(
    "veritas_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)


@celery_app.task(name="tasks.run_scan")
def run_scan(target_url: str, scan_id: str):
    """
    Placeholder Celery task for running a vulnerability scan.
    Will orchestrate Playwright browser sessions and payload injection.
    """
    # TODO: Implement scan logic using Playwright + payload files
    return {"scan_id": scan_id, "target": target_url, "status": "queued"}
