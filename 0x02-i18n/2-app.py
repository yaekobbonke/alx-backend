#!/usr/bin/env python3

"""Get locale from request"""

from flask import Flask, request, render_template
from flask_babel import Babel

app = Flask(__name__)
babel = Babel(app)


@app.route("/")
def hello_index():
    """returns hello world"""
    return render_template("2-index.html")


class Config:
    """sets supported languages"""
    LANGUAGES = ['en', 'fr']


app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """returns locale from request"""
    return request.accept_languages.best_match(app.config['LANGUAGES'])


if __name__ == "__main__":
    app.run()
