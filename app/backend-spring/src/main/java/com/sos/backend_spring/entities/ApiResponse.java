package com.sos.backend_spring.entities;

import java.util.Map;
import java.util.UUID;

public sealed interface ApiResponse permits ApiDataResponse, ApiErrorResponse {
  String getApiVersion();

  String getContext();

  UUID getId();

  String getMethod();

  Map<String, String> getParams();
}
