terraform {
  required_version = ">= 1.9"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.28.0"
    }
  }
}

resource "azurerm_container_app" "container_app" {
  name                         = var.container_app.name
  resource_group_name          = var.resource_group_name
  container_app_environment_id = var.managed_environment_id
  tags                         = var.tags
  revision_mode                = var.container_app.revision_mode

  template {
    dynamic "container" {
      for_each = coalesce(var.container_app.template.containers, [])
      content {
        name    = container.value.name
        image   = container.value.image
        args    = try(container.value.args, null)
        command = try(container.value.command, null)
        cpu     = container.value.cpu
        memory  = container.value.memory

        dynamic "env" {
          for_each = coalesce(container.value.env, [])
          content {
            name        = env.value.name
            secret_name = try(env.value.secret_name, null)
            value       = try(env.value.value, null)
          }
        }
      }
    }
    min_replicas    = try(var.container_app.template.min_replicas, null)
    max_replicas    = try(var.container_app.template.max_replicas, null)
    revision_suffix = try(var.container_app.template.revision_suffix, null)

    dynamic "volume" {
      for_each = var.container_app.template.volume != null ? [var.container_app.template.volume] : []
      content {
        name         = volume.value.name
        storage_name = try(volume.value.storage_name, null)
        storage_type = try(volume.value.storage_type, null)
      }
    }
  }

  dynamic "ingress" {
    for_each = var.container_app.ingress != null ? [var.container_app.ingress] : []
    content {
      allow_insecure_connections = try(ingress.value.allow_insecure_connections, null)
      external_enabled           = try(ingress.value.external_enabled, null)
      target_port                = ingress.value.target_port
      transport                  = ingress.value.transport

      dynamic "traffic_weight" {
        for_each = coalesce(ingress.value.traffic_weight, [])
        content {
          label           = traffic_weight.value.label
          latest_revision = traffic_weight.value.latest_revision
          revision_suffix = traffic_weight.value.revision_suffix
          percentage      = traffic_weight.value.percentage
        }
      }
    }
  }

  dynamic "dapr" {
    for_each = var.container_app.dapr != null ? [var.container_app.dapr] : []
    content {
      app_id       = dapr.value.app_id
      app_port     = dapr.value.app_port
      app_protocol = dapr.value.app_protocol
    }
  }

  dynamic "secret" {
    for_each = var.container_app.secrets != null ? var.container_app.secrets : []
    content {
      name  = secret.value.name
      value = secret.value.value
    }
  }

  lifecycle {
    create_before_destroy = false # default behavior, but good to be explicit
  }
}
