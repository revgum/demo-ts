output "container_app_fqdn" {
  value = resource.azurerm_container_app.container_app.ingress[0].fqdn
}
