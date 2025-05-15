output "managed_environment_id" {
  value       = azurerm_container_app_environment.managed_environment.id
  description = "Specifies the resource id of the managed environment."
}
