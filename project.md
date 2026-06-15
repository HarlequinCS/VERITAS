# Project Context: VERITAS (Web Vulnerability Evaluation and Real-time Intelligence Through Automated Simulation)

## 1. System Prompt & Agent Directives
* **Role:** You are an expert autonomous coding agent assisting with the architecture, development, and debugging of the **VERITAS** framework.
* **Objective:** Build an enterprise-grade, state-driven web application vulnerability scanner combining asynchronous headless browser simulation (Hybrid DAST) with a Multi-Agent AI remediation pipeline.
* **Coding Standards & Constraints:**
  * **Asynchronous First:** Absolutely no long-running operations on the main FastAPI thread. All scans and LLM API calls must be offloaded to Celery workers.
  * **State-Driven Architecture:** Follow strict operational state transitions (`Pending` -> `Processing` -> `Completed`/`Failed`) for all background tasks. 
  * **Idempotency & Isolation:** Ensure Playwright browser contexts are ephemeral. Tear down contexts safely even if exceptions occur.
  * **Strict Typing & Schemas:** Enforce Pydantic validation on all FastAPI routes and enforce strict JSON schemas for OpenAI API outputs.

## 2. Tech Stack & Infrastructure
* **Core Backend:** Python 3.12+, FastAPI (Asynchronous REST gateway).
* **Task Orchestration:** Celery (Distributed workers), Redis (Message broker & task queue).
* **Simulation Engine:** Playwright for Python (Headless Chromium, out-of-process DOM manipulation).
* **AI Engine:** OpenAI API (GPT-4o) using a multi-agent prompt chaining architecture.
* **Database:** SQLite (Local Dev) / PostgreSQL (Production) using SQLAlchemy ORM.
* **Deployment:** Docker (Containerized isolation for FastAPI, Redis, and Celery).

## 3. Database Architecture (Data Dictionary Specs)
Use `VARCHAR(36)` for all primary/foreign keys to store globally unique UUIDs. All timestamps must be UTC.

* **Users:** `user_id` (PK), `username`, `email`, `role` (ENUM: Analyst, Lead, Developer), `password_hash`, `created_at`.
* **Target_Applications:** `target_id` (PK), `user_id` (FK), `target_url`, `environment` (ENUM), `auth_token_config` (TEXT), `registered_at`.
* **Scan_Sessions:** `session_id` (PK), `target_id` (FK), `scan_status` (ENUM: Pending, Processing, Completed, Failed), `total_vulnerabilities_found`, `scan_type` (Initial Run, Re-Scan).
* **Detected_Vulnerabilities:** `vuln_id` (PK), `session_id` (FK), `cwe_id`, `owasp_category`, `severity_level` (ENUM), `endpoint_url`, `is_false_positive` (BOOLEAN).
* **Execution_Traces:** `trace_id` (PK), `payload_id` (FK), `http_status_code`, `dom_state_change` (BOOLEAN), `response_body_snippet`, `visual_poc_path` (Stored screenshot), `exploit_successful`.
* **AI_Analysis_Logs:** `analysis_id` (PK), `trace_id` (FK), `root_cause_description`, `confidence_score` (DECIMAL).
* **Remediation_Patches:** `patch_id` (PK), `analysis_id` (FK), `framework_language`, `vulnerable_code_snippet`, `patched_code_snippet`, `implementation_instructions`.
* **Remediation_Tickets:** `ticket_id` (PK), `vuln_id` (FK), `assigned_by` (FK: Lead), `assigned_to` (FK: Developer), `ticket_status` (ENUM: Open, Pending Verification, Closed, Re-Opened), `sla_due_date`.

## 4. Execution Workflows & System Logic

### A. Asynchronous Scan Orchestration (The Triage Phase)
1. **Producer:** FastAPI receives `POST /api/scan` with target details.
2. **Gateway Logic:** Validates payload, creates `Scan_Sessions` record (`status: Pending`), pushes task to Redis broker, and immediately returns `session_id` to client (HTTP 202 Accepted).
3. **Consumer:** Celery worker claims task from Redis, updates status to `Processing`, and triggers the Simulation Engine.

### B. Headless Simulation Engine (Playwright)
1. **Initialize:** Launch ephemeral headless Chromium context.
2. **State Injection:** Inject JWTs or session cookies from `Target_Applications.auth_token_config` into the context.
3. **Execution:** Navigate to target URL. Inject predefined payloads (e.g., XSS, SQLi).
4. **Telemetry Capture:** Monitor DOM mutations. If exploit succeeds, capture `response_body_snippet` and save a full-page screenshot to `/storage/poc/trace_{uuid}.png`.
5. **Teardown:** Safely close browser context and log `Execution_Traces`.

### C. Multi-Agent AI Pipeline (The 3-Agent Loop)
Executed by Celery after successful exploit trace capture:
* **Agent 1 (Classifier):** Analyzes `Execution_Traces`. Maps finding to CWE/OWASP, assigns CVSS score. (Outputs: Threat Context Payload).
* **Agent 2 (Synthesizer):** Analyzes target framework context. Generates the `patched_code_snippet` and `implementation_instructions`.
* **Agent 3 (Validator - Self-Reflection):** Evaluates Agent 2's output for logic/syntax flaws. 
  * *Condition:* If flaw detected -> Loop back to Agent 2 for recalculation (RETRY).
  * *Condition:* If secure -> Enforce strict JSON schema and save to `Remediation_Patches`.

## 5. Directory Structure Blueprint
```text
/veritas_core
├── /api
│   ├── /routers          # FastAPI endpoints (auth, scans, tickets, dashboard)
│   ├── /dependencies     # RBAC verification, DB session injection
│   └── /schemas          # Pydantic models for request/response validation
├── /core                 # Config, environment vars (.env parser), logging
├── /database
│   ├── /models           # SQLAlchemy ORM models (per Data Dictionary)
│   └── /migrations       # Alembic version control
├── /simulation_engine
│   ├── browser_mgr.py    # Playwright context initialization & teardown
│   ├── payload_injector.py # Execution logic for dynamic testing
│   └── telemetry.py      # DOM mutation and PoC screenshot capture
├── /ai_agents
│   ├── prompts.py        # OpenAI system prompts for Agents 1, 2, and 3
│   ├── orchestrator.py   # Multi-agent chain logic and Agent 3 Retry loop
│   └── patch_schema.py   # Strict JSON output definition for OpenAI
├── /workers
│   ├── celery_app.py     # Celery initialization and Redis broker connection
│   └── tasks.py          # Background task definitions (DAST scan, AI analysis)
└── project.md            # This context file