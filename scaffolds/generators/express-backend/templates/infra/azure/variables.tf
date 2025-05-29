variable "AZURE_SUBSCRIPTION_ID" {} # from ENV TF_VAR_AZURE_SUBSCRIPTION_ID

variable "resource_group_name" {
  description = "Name of the resource group in which the resources will be created"
}

variable "managed_environment_id" {
  description = "Id of the managed environment"
}

variable "location" {
  description = "Specifies the location"
}

variable "container_registry_host" {
  description = "Those hostname of the container registry"
}

variable "container_registry_id" {
  description = "Those id of the container registry"
}

variable "tags" {
  description = "(Optional) Specifies tags for all the resources"
  default = {
    createdBy = "infrastructure"
  }
}

variable "container_app" {
  description = "Specifies the container app in the managed environment."
  type = object({
    name          = string
    revision_mode = optional(string)
    ingress = optional(object({
      allow_insecure_connections = optional(bool)
      external_enabled           = optional(bool)
      target_port                = optional(number)
      transport                  = optional(string)
      traffic_weight = optional(list(object({
        label           = optional(string)
        latest_revision = optional(bool)
        revision_suffix = optional(string)
        percentage      = optional(number)
      })))
    }))
    dapr = optional(object({
      app_id       = optional(string)
      app_port     = optional(number)
      app_protocol = optional(string)
    }))
    registry = optional(object({
      server = string
    }))
    secrets = optional(list(object({
      name  = string
      value = string
    })))
    template = object({
      containers = list(object({
        name    = string
        image   = string
        args    = optional(list(string))
        command = optional(list(string))
        cpu     = optional(number)
        memory  = optional(string)
        env = optional(list(object({
          name        = string
          secret_name = optional(string)
          value       = optional(string)
        })))
      }))
      min_replicas    = optional(number)
      max_replicas    = optional(number)
      revision_suffix = optional(string)
      volume = optional(list(object({
        name         = string
        storage_name = optional(string)
        storage_type = optional(string)
      })))
    })
  })
}
