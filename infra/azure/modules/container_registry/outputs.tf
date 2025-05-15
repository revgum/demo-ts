output "name" {
  value       = azurerm_container_registry.container_registry.name
  description = "Specifies the name of the container registry."
}

output "login_server" {
  value       = azurerm_container_registry.container_registry.login_server
  description = "Specifies the login server FQDN of the container registry."
}
