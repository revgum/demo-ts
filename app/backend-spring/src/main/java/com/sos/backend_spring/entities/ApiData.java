package com.sos.backend_spring.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiData<T> {
  private String id;
  private String kind;
  private String fields;
  private String etag;
  private String lang;
  private String updated;
  private Boolean deleted;
  private List<T> items;

  @JsonUnwrapped
  private T additionalProperties;

}
