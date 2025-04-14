package com.sos.backend_spring.filters;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sos.backend_spring.entities.RequestContextHolder;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.UUID;

@Component
public class RequestIdFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request, HttpServletResponse response,
      jakarta.servlet.FilterChain filterChain) throws jakarta.servlet.ServletException, IOException {
    String requestId = request.getHeader("X-Request-ID");
    if (requestId == null) {
      RequestContextHolder.setRequestId(UUID.randomUUID());
    } else {
      RequestContextHolder.setRequestId(UUID.fromString(requestId));
    }

    // Continue with the filter chain
    filterChain.doFilter(request, response);
  }
}
