package com.sos.backend_spring.todo.v1;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sos.backend_spring.entities.ApiData;
import com.sos.backend_spring.entities.ApiResponse;
import com.sos.backend_spring.entities.ApiDataResponse;
import com.sos.backend_spring.entities.RequestContextHolder;

@RestController
public class TodoController {
  @Autowired
  private TodoService todoService;

  public static void main(String[] args) {
    SpringApplication.run(TodoController.class, args);
  }

  @GetMapping("/api/v1/todos")
  public ApiResponse GetAllTodo() {
    List<Todo> todos = todoService.fetchList();
    ApiData<Todo> data = ApiData.<Todo>builder()
        .kind("todos")
        .items(todos)
        .build();

    ApiDataResponse<Todo> response = ApiDataResponse.<Todo>builder()
        .apiVersion("1.0")
        .method("GET")
        .id(RequestContextHolder.getRequestId())
        .data(data)
        .build();
    return response;
  }

  @GetMapping("/api/v1/todos/{id}")
  public ApiResponse GetTodoById(@PathVariable("id") UUID id) {
    Todo todo = todoService.fetchById(id);
    ApiData<Todo> data = ApiData.<Todo>builder()
        .kind("todo")
        .additionalProperties(todo)
        .build();

    ApiDataResponse<Todo> response = ApiDataResponse.<Todo>builder()
        .apiVersion("1.0")
        .id(RequestContextHolder.getRequestId())
        .data(data)
        .build();
    return response;
  }

  @PostMapping("/api/v1/todos")
  public ApiResponse CreateTodo(@Validated @RequestBody Todo todo) {
    Todo newTodo = todoService.save(todo);
    ApiData<Todo> data = ApiData.<Todo>builder()
        .kind("todo")
        .additionalProperties(newTodo)
        .build();

    ApiDataResponse<Todo> response = ApiDataResponse.<Todo>builder()
        .apiVersion("1.0")
        .id(RequestContextHolder.getRequestId())
        .data(data)
        .build();
    return response;
  }

  @PutMapping("/api/v1/todos/{id}")
  public ApiResponse UpdateTodo(@Validated @RequestBody Todo todo, @PathVariable("id") UUID id) {
    Todo updatedTodo = todoService.update(todo, id);
    ApiData<Todo> data = ApiData.<Todo>builder()
        .kind("todo")
        .additionalProperties(updatedTodo)
        .build();

    ApiDataResponse<Todo> response = ApiDataResponse.<Todo>builder()
        .apiVersion("1.0")
        .id(RequestContextHolder.getRequestId())
        .data(data)
        .build();
    return response;
  }

  @DeleteMapping("/api/v1/todos/{id}")
  public ApiResponse DeleteTodoById(@PathVariable(value = "id") UUID id) {
    Todo deletedTodo = todoService.deleteById(id);
    ApiData<Todo> data = ApiData.<Todo>builder()
        .kind("todo")
        .additionalProperties(deletedTodo)
        .build();

    ApiDataResponse<Todo> response = ApiDataResponse.<Todo>builder()
        .apiVersion("1.0")
        .id(RequestContextHolder.getRequestId())
        .data(data)
        .build();
    return response;
  }
}
