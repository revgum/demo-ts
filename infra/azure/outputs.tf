output "log_analytics_name" {
   value = module.log_analytics_workspace.name
}

output "log_analytics_workspace_id" {
   value = module.log_analytics_workspace.workspace_id
}

output "container_registry_name" {
   value = module.container_registry.name
}

output "resource_group_name" {
   value = azurerm_resource_group.rg.name
}
