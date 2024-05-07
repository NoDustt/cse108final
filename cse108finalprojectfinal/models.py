

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)


class PlayerQueue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    users = db.Column(db.String(80), unique=False, nullable=True)

class room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    roomName = db.Column(db.String(10), unique=True, nullable=False)
    player1_id = db.Column(db.String(80), unique=False, nullable=False)
    player2_id = db.Column(db.String(80), unique=False, nullable=False)
    roomState = db.Column(db.String(10), nullable=False)
    roomJSONFILE = db.Column(db.String(1500), nullable=False)




def init_db(app):
    with app.app_context():
        db.init_app(app)
        db.create_all()

