
variable "managed_environment_id" {
  description = "(Required) Specifies the id of the managed environment."
  type        = string
}

variable "location" {
  description = "(Required) Specifies the location."
  type        = string
}

variable "container_registry_id" {
  description = "(Required) Specifies the id of the container registry."
  type        = string
}

variable "resource_group_name" {
  description = "(Required) Specifies the resource group name"
  type        = string
}

variable "tags" {
  description = "(Optional) Specifies the tags of the log analytics workspace"
  type        = map(any)
  default     = {}
}

variable "container_app" {
  description = "Specifies the container apps in the managed environment."
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
