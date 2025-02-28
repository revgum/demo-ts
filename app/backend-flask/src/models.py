from os import environ
from flask import Flask
from sqlalchemy import Null
from sqlalchemy.dialects.postgresql import UUID
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
import uuid
import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DB_URI")
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class TodoModel(db.Model):
    __tablename__ = "todo"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(), nullable=False)
    completed = db.Column(db.Boolean(), nullable=False, default=False)
    due_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(
        db.DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc)
    )
    updated_at = db.Column(db.DateTime(timezone=True))
    deleted_at = db.Column(db.DateTime(timezone=True))

    def __init__(self, title, completed, due_at):
        self.title = title
        self.completed = completed or False
        self.created_at = datetime.datetime.now(datetime.timezone.utc)
        self.due_at = due_at or Null

    def __repr__(self):
        return f"<Todo {self.id}:{self.title}>"

    def to_json(self):
        data = {}
        columns = list(self.__table__.columns)
        for col in columns:
            if col.name == "due_at" and self.due_at is not None:
                data[col.name] = self.due_at.isoformat()
            elif col.name == "created_at" and self.created_at is not None:
                data[col.name] = self.created_at.isoformat()
            elif col.name == "updated_at" and self.updated_at is not None:
                data[col.name] = self.updated_at.isoformat()
            elif col.name == "deleted_at" and self.deleted_at is not None:
                data[col.name] = self.deleted_at.isoformat()
            else:
                data[col.name] = self.__dict__[col.name]
        return data
