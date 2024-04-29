from flask import Flask, jsonify, flash, render_template, request, url_for, session, redirect, g, send_from_directory
from flask_session import Session
from database import get_db, close_db
from forms import ScoreForm
from datetime import date, datetime
# from werkzeug.security import generate_password_hash, check_password_hash
# from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config["SECRET_KEY"] = "auntie-betty"

UPLOAD_FOLDER = 'static/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config["SESSION_PERMANENT"] = False #Config Chooses In-Memory Cookies
app.config["SESSION_TYPE"] = "filesystem"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
Session(app)

app.teardown_appcontext(close_db)

@app.route("/")
def index():
    db = get_db()

    leaderboard = db.execute("SELECT * FROM scores ORDER BY score DESC").fetchall()

    return render_template("welcome.html", leaderboard = leaderboard)

@app.route("/game", methods=["POST", "GET"])
def game():
    form = ScoreForm()

    db = get_db()
    data =  db.execute("SELECT * FROM scores").fetchall()
    players = [entry['player_id'] for entry in data]

    if form.validate_on_submit():
        player = form.player_id.data
        defeated = int(request.form["defeatedField"])
        if player in players:
            highScore = db.execute("SELECT score FROM scores WHERE player_id = ? ", (player,)).fetchone()
            print(highScore)
            if defeated > highScore['score']:
                db.execute("UPDATE scores SET score = ? WHERE player_id = ?", (defeated, player))
                db.commit()
        else:
            db.execute("""INSERT INTO scores (player_id, score, date) VALUES (?,?,?)""", (player, defeated, date.today()))
            db.commit()
        return redirect(url_for('index'))

    return render_template("main.html", form=form)

# @app.route('/process', methods=['POST']) 
# def process(): 
#     data = request.get_json()
#     # process the data using Python code 
#     result = data.upper()
#     return result

# if __name__ == '__main__': 
#     app.run(debug=True) 