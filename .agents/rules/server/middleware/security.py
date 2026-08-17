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
    """Before-request hook to sanitize JSON and form payloads."""
    if request.is_json and request.json:
        try:
            cleaned = sanitize_value(request.get_json())
            # Replace request._cached_json or store on g
            request._cached_json = cleaned
        except Exception as e:
            logger.warning(f"Failed to sanitize JSON payload: {e}")

def request_logger():
    """Before-request hook to log incoming API calls."""
    if request.path.startswith("/api"):
        logger.info(f"Incoming: {request.method} {request.path}")
