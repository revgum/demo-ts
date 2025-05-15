terraform {
  required_version = ">= 1.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.28.0"
    }
  }
}

resource "azurerm_container_app_environment_dapr_component" "dapr_component" {
  for_each = { for component in var.dapr_components : component.name => component }

  name                         = each.key
  container_app_environment_id = var.managed_environment_id
  component_type               = each.value.component_type
  version                      = each.value.version
  ignore_errors                = each.value.ignore_errors
  init_timeout                 = each.value.init_timeout
  scopes                       = each.value.scopes

  dynamic "metadata" {
    for_each = each.value.metadata != null ? each.value.metadata : []
    content {
      name        = metadata.value.name
      secret_name = try(metadata.value.secret_name, null)
      value       = try(metadata.value.value, null)
    }
  }

  dynamic "secret" {
    for_each = each.value.secret != null ? each.value.secret : []
    content {
      name  = secret.value.name
      value = secret.value.value
    }
  }
}
