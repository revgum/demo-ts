terraform {
  required_version = ">= 1.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.28.0"
    }
  }
  # See create-tfstate-storage.sh for variable values
  backend "azurerm" {
    resource_group_name  = "terraformstate"
    storage_account_name = "tfstore008675309"
    container_name       = "tfstate"
    key                  = "staging.<%= name %>.terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.AZURE_SUBSCRIPTION_ID
}

data "azurerm_client_config" "current" {
}

module "container_app" {
  source                 = "../../../../infra/azure/modules/container_app"
  managed_environment_id = var.managed_environment_id
  container_registry_id  = var.container_registry_id
  resource_group_name    = var.resource_group_name
  tags                   = var.tags
  container_app          = var.container_app
  location               = var.location
}
