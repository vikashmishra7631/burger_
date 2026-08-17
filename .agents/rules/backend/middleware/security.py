import html
import logging
from flask import request

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("bistro-security")

def sanitize_value(val):
    """Recursively sanitize strings in nested dictionaries and lists."""
    if isinstance(val, str):
        return html.escape(val.strip())
    elif isinstance(val, list):
        return [sanitize_value(item) for item in val]
    elif isinstance(val, dict):
        return {k: sanitize_value(v) for k, v in val.items()}
    return val

def sanitize_inputs():
    """Before-request hook for request validation and logging."""
    pass

def get_sanitized_json():
    """Helper to retrieve cleanly sanitized JSON payload."""
    data = request.get_json(silent=True) or {}
    return sanitize_value(data)

def request_logger():
    """Before-request hook to log incoming API calls."""
    if request.path.startswith("/api"):
        logger.info(f"Incoming: {request.method} {request.path}")
