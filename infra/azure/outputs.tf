# These output values are used in *.tfvars files for individual microservices infra, see app/*/infra/azure/*.tfvars files

output "container_registry_host" {
  value = module.container_registry.login_server
}

output "container_registry_id" {
  value = module.container_registry.id
}

output "resource_group_name" {
  value = resource.azurerm_resource_group.rg.name
}

output "managed_environment_id" {
  value = module.container_app_environment.managed_environment_id
}

output "location" {
  value = var.location
}

output "tags" {
  value = var.tags
}
