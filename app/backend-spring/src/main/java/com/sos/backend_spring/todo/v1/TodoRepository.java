package com.sos.backend_spring.todo.v1;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends JpaRepository<Todo, UUID> {
  List<Todo> findByDeletedAtIsNull();
}
