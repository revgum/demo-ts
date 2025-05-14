output "hostname" {
  value       = azurerm_redis_cache.redis_cache.hostname
  description = "Specifies the hostname of the redis cache."
}

output "name" {
  value       = azurerm_redis_cache.redis_cache.name
  description = "Specifies the name of the redis cache."
}

output "id" {
  value       = azurerm_redis_cache.redis_cache.id
  description = "Specifies the id of the redis cache."
}

output "primary_access_key" {
  value       = azurerm_redis_cache.redis_cache.primary_access_key
  description = "Specifies the primary access key of the redis cache."
}
