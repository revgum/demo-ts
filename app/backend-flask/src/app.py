from flask import Flask
from os import environ


def get_db():
    from models import db

    return db


def create_app():
    from api.todo import router as todoRouter

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DB_URI")
    get_db().init_app(app)
    app.register_blueprint(todoRouter)
    return app
