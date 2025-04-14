package com.sos.backend_spring.entities;

import java.util.List;
import java.util.UUID;

public interface EntityService<T> {
  /**
   * Saves an entity.
   *
   * @param obj the entity to save
   * @return the saved entity
   */
  T save(T obj);

  /**
   * Fetches the list of all entities
   *
   * @return a list of entities
   */
  List<T> fetchList();

  /**
   * Fetches an entity by its ID
   *
   * @return an entity
   */
  T fetchById(UUID id);

  /**
   * Updates an existing entity.
   *
   * @param obj the entity with updated information
   * @param id  the ID of the entity to update
   * @return the updated entity
   */
  T update(T obj, UUID id);

  /**
   * Soft-deletes an entity by its ID
   *
   * @param id the ID of the entity to delete
   */
  T deleteById(UUID id);
}
