package com.sos.backend_spring.services;

import java.util.List;
import java.util.UUID;

import com.sos.backend_spring.entities.Todo;

public interface TodoService {
  /**
   * Saves a todo entity.
   * 
   * @param todo the todo to save
   * @return the saved todo
   */
  Todo saveTodo(Todo todo);

  /**
   * Fetches the list of all todo entities.
   * 
   * @return a list of todos
   */
  List<Todo> fetchTodoList();

  /**
   * Fetches a todo by its ID
   * 
   * @return a todo
   */
  Todo fetchTodoById(UUID TodoId);

  /**
   * Updates an existing todo entity.
   * 
   * @param todo   the todo with updated information
   * @param todoId the ID of the todo to update
   * @return the updated todo
   */
  Todo updateTodo(Todo todo, UUID todoId);

  /**
   * Soft-deletes a Todo by its ID
   * 
   * @param todoId the ID of the todo to delete
   */
  Todo deleteTodoById(UUID TodoId);
}
