import os
import time
from datetime import datetime, timezone
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from .routes.menu import menu_bp
from .routes.coupon import coupon_bp
from .routes.order import order_bp
from .routes.auth import auth_bp
from .routes.ai import ai_bp
from .middleware.security import sanitize_inputs, request_logger

load_dotenv()

# Determine paths
SERVER_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SERVER_DIR)

app = Flask(__name__, static_folder=None)
PORT = int(os.getenv("PORT", 5000))
START_TIME = time.time()

# CORS configuration
CORS(app, resources={r"/api/*": {"origins": "*"}}, methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

# Middlewares
app.before_request(request_logger)
app.before_request(sanitize_inputs)

# Mount Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(menu_bp, url_prefix="/api/menu")
app.register_blueprint(coupon_bp, url_prefix="/api/coupons")
app.register_blueprint(order_bp, url_prefix="/api/orders")
app.register_blueprint(ai_bp, url_prefix="/api/ai")

# Health Check
@app.route("/api/health", methods=["GET"])
def health():
    uptime = int(time.time() - START_TIME)
    return jsonify({
        "success": True,
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "uptimeSeconds": uptime,
        "service": "Bistro & Stack / Bistro & Slice Python Delivery Engine"
    }), 200

# Serve static frontend files
@app.route("/", methods=["GET"])
def root():
    return send_from_directory(ROOT_DIR, "burger_delivery_hub.html")

@app.route("/<path:filename>", methods=["GET"])
def static_files(filename):
    if os.path.exists(os.path.join(ROOT_DIR, filename)):
        return send_from_directory(ROOT_DIR, filename)
    return jsonify({
        "success": False,
        "error": f"File '{filename}' not found."
    }), 404

# 404 API Handler
@app.errorhandler(404)
def not_found(e):
    if request.path.startswith("/api"):
        return jsonify({
            "success": False,
            "error": f'API Endpoint "{request.method} {request.path}" does not exist.'
        }), 404
    # Fallback to root for client-side navigation
    return send_from_directory(ROOT_DIR, "burger_delivery_hub.html")

# Global Error Handler
@app.errorhandler(500)
@app.errorhandler(Exception)
def internal_error(e):
    return jsonify({
        "success": False,
        "error": str(e)
    }), 500

if __name__ == "__main__":
    print("\n=================================================")
    print("BISTRO & STACK PYTHON FLASK SERVER RUNNING!")
    print(f"URL: http://localhost:{PORT}")
    print("Security: CORS, Sanitizers, Fallback AI Active")
    print("Endpoints:")
    print("   - GET  /api/health")
    print("   - GET  /api/menu?mode=burger|pizza")
    print("   - POST /api/coupons/validate")
    print("   - POST /api/orders")
    print("   - GET  /api/orders/:orderId/track")
    print("=================================================\n")
    app.run(host="0.0.0.0", port=PORT, debug=True)
