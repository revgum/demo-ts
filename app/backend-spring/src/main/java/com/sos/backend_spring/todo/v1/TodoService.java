package com.sos.backend_spring.todo.v1;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sos.backend_spring.entities.EntityService;

@Service
public class TodoService implements EntityService<Todo> {

  @Autowired
  private TodoRepository todoRepository; // Injects the TodoRepository dependency.

  @Override
  public Todo save(Todo todo) {
    return todoRepository.save(todo);
  }

  @Override
  public List<Todo> fetchList() {
    return (List<Todo>) todoRepository.findByDeletedAtIsNull();
  }

  @Override
  public Todo fetchById(UUID todoId) {
    return (Todo) todoRepository.findById(todoId).get();
  }

  @Override
  public Todo update(Todo todo, UUID todoId) {
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
  public Todo deleteById(UUID todoId) {
    Todo existingTodo = todoRepository.findById(todoId).get();
    existingTodo.setDeletedAt(LocalDateTime.now());
    return todoRepository.save(existingTodo);
  }
}
