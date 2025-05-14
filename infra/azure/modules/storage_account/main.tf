terraform {
  required_version = ">= 1.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.28.0"
    }
  }
}

resource "azurerm_storage_account" "storage_account" {
  name                = var.name
  resource_group_name = var.resource_group_name

  location                 = var.location
  account_kind             = var.account_kind
  account_tier             = var.account_tier
  account_replication_type = var.replication_type
  is_hns_enabled           = var.is_hns_enabled
  tags                     = var.tags

  network_rules {
    default_action             = (length(var.ip_rules) + length(var.virtual_network_subnet_ids)) > 0 ? "Deny" : var.default_action
    ip_rules                   = var.ip_rules
    virtual_network_subnet_ids = var.virtual_network_subnet_ids
  }

  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [
        tags
    ]
  }
}

resource "azurerm_storage_management_policy" "storage_policy" {
  storage_account_id = azurerm_storage_account.storage_account.id

  rule {
    name    = "log analytics retention"
    enabled = true
    filters {
      prefix_match = ["logs/VMProtectionAlerts", "logs/AllMetrics"]
      blob_types   = ["blockBlob"]
    }
    actions {
      base_blob {
        delete_after_days_since_modification_greater_than          = var.log_analytics_retention_days
      }
    }
  }
}
