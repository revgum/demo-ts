package com.sos.backend_spring;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sos.backend_spring.entities.Todo;
import com.sos.backend_spring.services.TodoService;

@SpringBootApplication
@RestController
public class TodoApplication {
  @Autowired
  private TodoService todoService;

  public static void main(String[] args) {
    SpringApplication.run(TodoApplication.class, args);
  }

  @GetMapping("/api/todos")
  public List<Todo> GetAllTodo() {
    System.out.println("here ehrelkrjlkerjklerj");
    return todoService.fetchTodoList();
  }

  @GetMapping("/api/todos/{id}")
  public Todo GetTodoById(@PathVariable("id") UUID id) {
    return todoService.fetchTodoById(id);
  }

  @PostMapping("/api/todos")
  public Todo CreateTodo(@Validated @RequestBody Todo todo) {
    return todoService.saveTodo(todo);
  }

  @PutMapping("/api/todos/{id}")
  public Todo UpdateTodo(@Validated @RequestBody Todo todo, @PathVariable("id") UUID id) {
    return todoService.updateTodo(todo, id);
  }

  @DeleteMapping("/api/todos/{id}")
  public Todo DeleteTodoById(@PathVariable(value = "id") UUID id) {
    return todoService.deleteTodoById(id);
  }
}
