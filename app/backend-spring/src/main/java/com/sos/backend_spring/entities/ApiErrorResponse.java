package com.sos.backend_spring.entities;

import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public non-sealed class ApiErrorResponse<T> implements ApiResponse {
  private String apiVersion;
  private String context;
  private String method;
  private Map<String, String> params;
  private UUID id;
  private ApiError error;
}
