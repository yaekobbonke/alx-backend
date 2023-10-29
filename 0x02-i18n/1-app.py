#!/usr/bin/env python3
""" Basic Babel setup"""

from 0-app import app
from flask_babel import Babel


class Config:
    """configure available languages"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = "UTC"
babel = Babel(app)
app.config.from_object(Config)
