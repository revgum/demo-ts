package com.sos.backend_spring.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
  private int code;
  private String message;
  private List<ErrorDetail> errors;

  @Data
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public static class ErrorDetail {
    private String domain;
    private String reason;
    private String message;
    private String location;
    private String locationType;
    private String extendedHelp;
    private String sendReport;
  }
}
