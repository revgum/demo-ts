from flask import Flask
from os import environ
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_db():
    from models import db

    return db


def create_app():
    from api.todo import router as todoRouter
    from opentelemetry.instrumentation.flask import FlaskInstrumentor

    app = Flask(__name__)
    FlaskInstrumentor().instrument_app(app, enable_commenter=True, commenter_options={})

    app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DB_URI")
    get_db().init_app(app)

    app.register_blueprint(todoRouter)
    logger.info("%s service is running", app.name)
    return app
