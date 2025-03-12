import time
from uuid import uuid4
from flask import Flask, request
from os import environ

import structlog
from debug import initialize_debugger_if_set

initialize_debugger_if_set()


def get_db():
    from models import db

    return db


def create_app():
    from api.todo import router as todoRouter
    from opentelemetry.instrumentation.flask import FlaskInstrumentor
    from log import logger

    app = Flask(__name__)

    FlaskInstrumentor().instrument_app(app, enable_commenter=True, commenter_options={})

    app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DB_URI")
    get_db().init_app(app)

    @app.before_request
    def log_before_request():
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            method=request.method,
            path=request.path,
            start_time=int(time.time_ns() / 1000000),
            request_id=str(uuid4()),
            request_ip=request.access_route[0],
        )

    @app.after_request
    def log_after_request(response):
        vars = structlog.contextvars.get_contextvars()
        logger().info(
            "Response returned",
            status=response.status,
            elapsed_ms=int(time.time_ns() / 1000000) - vars["start_time"],
        )
        structlog.contextvars.clear_contextvars()
        return response

    app.register_blueprint(todoRouter)
    logger().info("%s service is running", app.name)
    return app
