output "id" {
  description = "Specifies the resource id of the private dns zone"
  value       = azurerm_private_dns_zone.private_dns_zone.id
}

output "name" {
  description = "Specifies the resource name of the private dns zone"
  value       = azurerm_private_dns_zone.private_dns_zone.name
}
