"""
Entrypoint to run the Bistro & Stack Python Server
Usage:
    python main.py
"""
import sys
import os

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server.app import app, PORT

if __name__ == "__main__":
    print("\n=================================================")
    print("BISTRO & STACK PYTHON FLASK SERVER RUNNING!")
    print(f"URL: http://localhost:{PORT}")
    print("Security: CORS, Sanitizers, Fallback AI Active")
    print("Serving static frontend files from project root")
    print("=================================================\n")
    app.run(host="0.0.0.0", port=PORT, debug=True)
