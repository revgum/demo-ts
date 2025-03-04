package com.sos.backend_spring.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sos.backend_spring.entities.Todo;
import com.sos.backend_spring.repositories.TodoRepository;

@Service
public class TodoServiceImpl implements TodoService {

  @Autowired
  private TodoRepository todoRepository; // Injects the TodoRepository dependency.

  @Override
  public Todo saveTodo(Todo todo) {
    return todoRepository.save(todo);
  }

  @Override
  public List<Todo> fetchTodoList() {
    return (List<Todo>) todoRepository.findByDeletedAtIsNull();
  }

  @Override
  public Todo fetchTodoById(UUID todoId) {
    return (Todo) todoRepository.findById(todoId).get();
  }

  @Override
  public Todo updateTodo(Todo todo, UUID todoId) {
    Todo existingTodo = todoRepository.findById(todoId).get();

    if (Objects.nonNull(todo.getTitle()) && !"".equalsIgnoreCase(todo.getTitle())) {
      existingTodo.setTitle(todo.getTitle());
    }
    if (Objects.nonNull(todo.getDueAt())) {
      existingTodo.setDueAt(todo.getDueAt());
    }
    return todoRepository.save(existingTodo);
  }

  @Override
  public Todo deleteTodoById(UUID todoId) {
    Todo existingTodo = todoRepository.findById(todoId).get();
    existingTodo.setDeletedAt(LocalDateTime.now());
    return todoRepository.save(existingTodo);
  }
}
