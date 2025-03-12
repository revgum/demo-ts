import datetime
from flask import Blueprint, request
from app import get_db
from log import logger
from models import TodoModel

router = Blueprint("todo", __name__, url_prefix="/api/v1/todos")
db = get_db()


@router.route("/", methods=["GET"])
def get_all_todos():
    todos = TodoModel.query.where(TodoModel.deleted_at == None).all()
    logger().info("Found {} todos".format(len(todos)))
    results = [todo.to_json() for todo in todos]
    return {"payload": results}


@router.route("/", methods=["POST"])
def create_todo():
    if request.is_json:
        data = request.get_json()
        todo = TodoModel(
            title=data.get("title"),
            completed=data.get("completed", None),
            due_at=data.get("due_at", None),
        )
        db.session.add(todo)
        db.session.commit()
        db.session.refresh(todo)  # Refresh object to include its newly minted ID
        return {"payload": todo.to_json()}
    else:
        return {"error": "The request payload is not in JSON format"}


@router.route("/<uuid:id>", methods=["GET"])
def get_todo(id):
    todo = (
        TodoModel.query.where(TodoModel.deleted_at == None)
        .where(TodoModel.id == id)
        .first()
    )
    if todo is None:
        return {"error": "Todo not found"}
    return {"payload": todo.to_json()}


@router.route("/<uuid:id>", methods=["PUT", "PATCH"])
def update_todo(id):
    if request.is_json:
        todo = (
            TodoModel.query.where(TodoModel.deleted_at == None)
            .where(TodoModel.id == id)
            .first()
        )
        if todo is None:
            return {"error": "Todo not found"}

        data = request.get_json()
        if data.get("title") is not None:
            todo.title = data.get("title")
        if data.get("due_at") is not None:
            todo.due_at = data.get("due_at")
        if data.get("completed") is not None:
            todo.completed = data.get("completed")

        todo.updated_at = datetime.datetime.now(datetime.timezone.utc)

        db.session.add(todo)
        db.session.commit()
        db.session.refresh(todo)  # Refresh object to include its newly minted ID
        return {"payload": todo.to_json()}
    else:
        return {"error": "The request payload is not in JSON format"}


@router.route("/<uuid:id>", methods=["DELETE"])
def delete_todo(id):
    todo = (
        TodoModel.query.where(TodoModel.deleted_at == None)
        .where(TodoModel.id == id)
        .first()
    )
    if todo is None:
        return {"error": "Todo not found"}

    todo.updated_at = datetime.datetime.now(datetime.timezone.utc)
    todo.deleted_at = datetime.datetime.now(datetime.timezone.utc)

    db.session.add(todo)
    db.session.commit()
    db.session.refresh(todo)  # Refresh object to include its newly minted ID
    return {"payload": todo.to_json()}
