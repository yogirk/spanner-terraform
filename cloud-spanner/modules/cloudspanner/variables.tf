## --- REQUIRED PARAMETERS ------------------------------------------------------------------------------------------------

variable "suffix" {
  description = "An arbitrary suffix that will be added to the end of the resource name(s). For example: an environment name, a business-case name, a numeric id, etc."
  type        = string
  validation {
    condition     = length(var.suffix) <= 14
    error_message = "A max of 14 character(s) are allowed."
  }
}

variable "instance_id" {
  type        = string
  description = "A unique identifier for the instance, which cannot be changed after the instance is created."
}

variable "instance_display_name" {
  type        = string
  default     = ""
  description = "The descriptive name for this instance as it appears in UIs. Must be unique per project and between 4 and 30 characters in length."
}

variable "dbname" {
  type        = string
  description = "A unique identifier for the database, which cannot be changed after the instance is created."
}


## --- OPTIONAL PARAMETERS ------------------------------------------------------------------------------------------------

variable "config" {
  type        = string
  default     = "regional-us-west1"
  description = "Cloud Spanner Instance config - Regional / multi-region. For allowed configurations, check: https://cloud.google.com/spanner/docs/instances#available-configurations-regional"
}

variable "num_nodes" {
  type        = number
  default     = 2
  description = "The number of nodes allocated to this instance."
}

variable labels_var {
  type        = map(string)
  default     = {}
  description = "Labels to inject into the spanner instance."
}


variable "deletion_protection" {
  type        = bool
  default     = false
  description = "Whether or not to allow Terraform to destroy the instance."
}

variable "gcp_project_id" {
  description = "Id of the GCP project"
  type        = string
}
