

import os, re
import string, random
from flask import Flask, render_template, send_from_directory, request, session, redirect, url_for, json, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, init_db, Users, room

app = Flask(__name__, template_folder='/home/maraza/mysite/templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://maraza:CSE108Database@maraza.mysql.pythonanywhere-services.com:3306/maraza$default'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_db(app)

secret_key = os.urandom(24)
app.secret_key = secret_key

user_queue = []

defaultGameJSON = {
    "game1":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "game2":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "game3":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "game4":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "game5":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "game6":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "game7":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "game8":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "game9":{"game":[0,0,0,0,0,0,0,0,0],"status":"", "active": 0},
    "turn":1,
    "activeBoard":"",
    "active":0,
    "playerType":""
}

defaultGameJSONString = json.dumps(defaultGameJSON)

def generateSeed():
    return ''.join(random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ") for _ in range(4))


def is_logged_in():
    return 'username' in session

@app.route('/')
def home0():
    return render_template("CSE108Final_Home.html")

@app.route("/queue")
def renderQueue():
    return render_template("CSE108Final_Queue.html")

## Game routing

@app.route("/game")
def gameRender():
    seed = request.args.get('seed')
    return render_template("CSE108Final_Game.html", seed = seed)


@app.route("/game/<seed>", methods = ["POST", "GET", "DELETE"])
def gameLogic(seed):
    if request.method == "GET":
        game_room = db.session.query(room).filter(room.roomName == seed).first()
        if game_room:
            roomJSONFILE = {
                "roomName": game_room.roomName,
                "player1_id": game_room.player1_id,
                "player2_id": game_room.player2_id,
                "roomState": game_room.roomState,
                "roomJSONFILE": game_room.roomJSONFILE
            }
            return jsonify(roomJSONFILE)
        else:
            return "{\"not found\":404}"
    elif request.method == "POST":
        data = request.json
        game_room = db.session.query(room).filter(room.roomName == seed).first()
        if game_room:
            game_room.roomJSONFILE = data.get("roomJSONFILE")
            game_room.state = data.get("state")
            db.session.commit()
            roomJSONFILE = {
                "roomName": game_room.roomName,
                "player1_id": game_room.player1_id,
                "player2_id": game_room.player2_id,
                "roomState": game_room.roomState,
                "roomJSONFILE": game_room.roomJSONFILE
            }
            return jsonify(roomJSONFILE)
    elif request.method == "DELETE":
        game_room = db.session.query(room).filter(room.roomName == seed).first()
        if game_room:
            db.session.delete(game_room)
            db.session.commit()
            return "/lobby"
        else:
            return "Game not found"

    return "{\"not found\":404}"


@app.route("/game/queue/<username>", methods = ["POST", "GET"])
def joinQueue(username):
    if request.method == "GET":
        game_room = db.session.query(room).filter((room.player1_id == username) | (room.player2_id == username)).first()
        if game_room:
            return game_room.roomName
        else:
            return "waiting"


    elif request.method == "POST":

        global user_queue
        ###
        # db.session.query(room).delete()
        # db.session.commit()
        if username not in user_queue:
            user_queue.append(username)
        if len(user_queue) >=2:
            seed = generateSeed()
            newGame = room()
            newGame.roomName = seed
            newGame.player1_id = user_queue[0]
            newGame.player2_id = user_queue[1]
            newGame.roomState = "started"
            newGame.roomJSONFILE = json.dumps(defaultGameJSON)
            db.session.add(newGame)
            db.session.commit()
            user_queue = user_queue[2:]
            return "game has been made!"
        return "queue stuff"



@app.route("/um")
def um():
    return render_template("CSE108Final_Game.html")


@app.route('/Cse108Final_Game.js')
def serve_js():
    return send_from_directory('/home/maraza/mysite/assets/js/Cse108Final_Game.js', 'Cse108Final_Game.js')  # Adjust the directory as needed

@app.route('/CSE108Final_Game.css')
def serve_css():
    return send_from_directory('/home/maraza/mysite/assets/css/CSE108Final_Game.css', 'CSE108Final_Game.css')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if is_logged_in():
        return redirect(url_for('home'))

    if request.method == 'GET':
        return render_template('CSE108Final_SignUp.html')
    elif request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            return 'Passwords do not match!'

        existing_user = Users.query.filter_by(username=username).first()
        if existing_user:
            return 'Username already exists!'

        if not re.match(r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,24}', password):
            return 'Password must be 8-24 characters long, include at least one uppercase letter, one lowercase letter, and one number.'
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = Users(username=username, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return 'User created successfully!'

@app.route('/styles.css')
def serve_signup_css():
    return send_from_directory('/home/maraza/mysite/assets/css/styles.css', 'styles.css')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if is_logged_in():
        return redirect(url_for('home'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = Users.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['username'] = username
            return 'Logged in successfully!'
        else:
            return 'Invalid username or password!'
    return render_template('CSE108Final_Login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/home')
def home():
    return render_template('CSE108Final_Home.html')

@app.route("/leaderboard", methods=["GET", "POST"])
def renderLeaderboard():


    if request.method == "GET":
        users = Users.query.order_by(Users.wins.desc()).all()

        users_stats = [
            {"username": user.username, "wins": user.wins, "losses": user.losses}
            for user in users
        ]

        return render_template("CSE108Final_Leaderboard.html", leaderboard=users_stats)
    elif request.method == "POST":
        data = request.json
        username = data.get("username")
        result = data.get("result")

        if not username or not result:
            return "Username and result are required"

        user = Users.query.filter_by(username=username).first()

        if not user:
            return "User not found"
        if result == "win":
            user.wins += 1
        elif result == "loss":
            user.losses += 1

        db.session.commit()
        return "Stats updated"
    else:
        users = Users.query.order_by(Users.wins.desc()).all()
        leaderboard_data = [{'username': user.username, 'wins': user.wins, 'losses': user.losses} for user in users]
        return render_template('CSE108Final_Leaderboard.html', leaderboard=leaderboard_data)


if __name__ == '__main__':
    app.run(debug=True)





