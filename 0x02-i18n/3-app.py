#!/usr/bin/env python3
''' Flask app '''

from flask import Flask, request, render_template
from flask_babel import Babel, gettext

app = Flask(__name__)
babel = Babel(app)


class Config:
    ''' App config '''
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)


@babel.localeselector
def get_locale():
    ''' return best languages '''
    return request.accept_languages.best_match(Config.LANGUAGES)


@app.route("/")
def hello_index():
    ''' return the template '''
    return render_template('3-index.html')


if __name__ == "__main__":
    app.run()
