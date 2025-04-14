package com.sos.backend_spring.todo.v1;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table(name = "todo")
public class Todo {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  @Column(name = "title")
  private String title;

  @Column(name = "completed")
  private Boolean completed;

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", locale = "UTC")
  @Column(name = "due_at")
  private LocalDateTime dueAt;

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", locale = "UTC")
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", locale = "UTC")
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", locale = "UTC")
  @Column(name = "deleted_at")
  private LocalDateTime deletedAt;

  @PrePersist
  public void prePersist() {
    if (Objects.isNull(this.createdAt)) {
      this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
    }
    if (Objects.isNull(this.completed)) {
      this.completed = false;
    }
  }
}
