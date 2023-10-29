#!/usr/bin/env python3

""" Basic Babel setup"""

from flask import Flask, render_template
from flask_babel import Babel

app = Flask(__name__)
babel = Babel(app)
@app.route("/")


def hello_index():
    """returns hello world from templates"""
    return render_template("1-index.html")

class Config:
    """configure available languages"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = "UTC"

app.config.from_object(Config)


if __name__ == "__main__":
    app.run()
