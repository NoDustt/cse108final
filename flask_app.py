# A very simple Flask Hello World app for you to get started with...

import os
from flask import Flask, render_template, send_from_directory, request, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, init_db, User

app = Flask(__name__, template_folder='.')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_db(app)

secret_key = os.urandom(24)
app.secret_key = secret_key

def is_logged_in():
    return 'username' in session

@app.route('/')
def hello_world():
    return render_template("CSE108Final_Game.html")

@app.route("/game")
def game():
    return("game")

@app.route('/Cse108Final_Game.js')
def serve_js():
    return send_from_directory('.', 'Cse108Final_Game.js')  # Adjust the directory as needed

@app.route('/CSE108Final_Game.css')
def serve_css():
    return send_from_directory('.', 'CSE108Final_Game.css')

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
            return 'Passwords do not match! Please try again.'

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return 'Username already exists! Please choose a different username.'   

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return 'User created successfully!'

@app.route('/styles.css')
def serve_signup_css():
    return send_from_directory('.', 'styles.css')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if is_logged_in():
        return redirect(url_for('home')) 

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
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

if __name__ == '__main__':
    app.run(debug=True)





