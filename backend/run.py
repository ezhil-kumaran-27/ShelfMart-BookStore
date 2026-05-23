from app import create_app
import sys

try:
    print("Starting application...")
    app = create_app()
    print("Application created successfully.")
except Exception as e:
    print(f"CRITICAL ERROR DURING STARTUP: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
