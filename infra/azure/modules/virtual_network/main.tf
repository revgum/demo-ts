terraform {
  required_version = ">= 1.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.28.0"
    }
  }
}

resource "azurerm_virtual_network" "vnet" {
  name                = var.vnet_name
  address_space       = var.address_space
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags

  lifecycle {
    ignore_changes = [
        tags
    ]
  }
}

resource "azurerm_subnet" "subnet" {
  for_each = { for subnet in var.subnets : subnet.name => subnet }

  name                                           = each.key
  resource_group_name                            = var.resource_group_name
  virtual_network_name                           = azurerm_virtual_network.vnet.name
  address_prefixes                               = each.value.address_prefixes
  private_endpoint_network_policies = each.value.private_endpoint_network_policies
  private_link_service_network_policies_enabled  = each.value.private_link_service_network_policies_enabled
}

# TODO: figure this out
#resource "azurerm_monitor_diagnostic_setting" "settings" {
#  name                       = "DiagnosticsSettings"
#  target_resource_id         = azurerm_virtual_network.vnet.id
#  log_analytics_workspace_id = var.log_analytics_workspace_id
#
#  enabled_log {
#    category = "VMProtectionAlerts"
#  }
#
#  metric {
#    category = "AllMetrics"
#  }
#}
