#!/usr/bin/env python3

# Simple Flask server test
from app import create_app

app = create_app()

if __name__ == '__main__':
    print("Starting Flask server for profile testing...")
    print("Server will be available at: http://127.0.0.1:5000")
    print("Profile endpoint: http://127.0.0.1:5000/api/profile/")
    print("Swagger UI: http://127.0.0.1:5000/")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        app.run(debug=True, host='127.0.0.1', port=5000)
    except KeyboardInterrupt:
        print("\nServer stopped")
