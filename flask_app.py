
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("CSE108Final_Game.html")

@app.route("/game")
def game():
    return("game")





