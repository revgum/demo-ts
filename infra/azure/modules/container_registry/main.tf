terraform {
  required_version = ">= 1.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.28.0"
    }
  }
}

resource "random_string" "resource_prefix" {
  length  = 6
  special = false
  upper   = false
  numeric = false
}

resource "azurerm_container_registry" "container_registry" {
  name                = "registry${random_string.resource_prefix.result}"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Standard" # Options: Basic, Standard, Premium
  admin_enabled       = true       # Enables username/password auth (for dev/test only)
  tags                = var.tags
  lifecycle {
    prevent_destroy = true
  }
}

# TODO: Can we make this dynamic per container app? If so, remove this from update-containerapp.sh
#resource "azurerm_role_assignment" "acr_pull" {
#  principal_id   = azurerm_container_app.example.identity[0].principal_id
#  role_definition_name = "AcrPull"
#  scope          = azurerm_container_registry.example.id
#}
