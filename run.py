import os
from app import app, socketio


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', debug=True, port=int(os.environ.get('PORT', 8080)))
