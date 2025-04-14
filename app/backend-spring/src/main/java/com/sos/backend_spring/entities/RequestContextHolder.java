package com.sos.backend_spring.entities;

import java.util.UUID;

public class RequestContextHolder {
  private static final ThreadLocal<UUID> requestIdHolder = new ThreadLocal<>();

  public static void setRequestId(UUID requestId) {
    requestIdHolder.set(requestId);
  }

  public static UUID getRequestId() {
    return requestIdHolder.get();
  }

  public static void clear() {
    requestIdHolder.remove();
  }
}
