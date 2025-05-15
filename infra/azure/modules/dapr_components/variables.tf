
variable "managed_environment_id" {
  description = "(Required) Specifies the id of the managed environment."
  type        = string
}

variable "dapr_components" {
  description = "(Optional) Specifies the dapr components."
  type = list(object({
    name           = string
    component_type = string
    ignore_errors  = optional(bool)
    version        = optional(string)
    init_timeout   = optional(string)
    scopes         = optional(list(string))
    metadata = optional(list(object({
      name        = string
      secret_name = optional(string)
      value       = optional(string)
    })))
    secret = optional(list(object({
      name  = string
      value = string
    })))
  }))
}
