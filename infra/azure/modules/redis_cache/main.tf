terraform {
  required_version = ">= 1.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.28.0"
    }
  }
}

resource "azurerm_redis_cache" "redis_cache" {
  name                          = var.cache_name
  resource_group_name           = var.resource_group_name
  location                      = var.location
  capacity                      = 0 // 0 = 250mb, 1 = 1gb, 2 = 2.5gb
  family                        = "C"
  sku_name                      = "Basic"
  non_ssl_port_enabled          = true
  public_network_access_enabled = false
  minimum_tls_version           = "1.2"

  redis_configuration {}

  lifecycle {
    ignore_changes  = [tags]
    prevent_destroy = true
  }
}
