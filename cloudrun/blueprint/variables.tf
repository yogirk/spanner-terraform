## --- REQUIRED PARAMETERS ------------------------------------------------------------------------------------------------

variable "gcp_project_id" {
  description = "Id of the GCP project"
  type        = string
  validation {
    condition     = can(regex("^[a-z]{2,7}-[a-z0-9]{3,18}$", var.gcp_project_id))
    error_message = "Must be of this format: `org-project` and a max of 30 characters."
  }
}

variable "region" {
  description = "Region for GCP resources. See https://cloud.google.com/compute/docs/regions-zones"
  type        = string
}
