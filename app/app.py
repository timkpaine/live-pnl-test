from flask import Flask, render_template
from flask_socketio import SocketIO


app = Flask(__name__, static_url_path='/static')
socketio = SocketIO(app)


@app.route('/')
def index():
    render = {}
    return render_template("index.html", **render)
