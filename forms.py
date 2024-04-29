from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import InputRequired

class ScoreForm(FlaskForm):
    player_id = StringField("Username:", validators=[InputRequired()])
    submit = SubmitField("Submit")