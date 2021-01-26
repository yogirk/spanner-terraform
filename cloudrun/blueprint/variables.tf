## --- REQUIRED PARAMETERS ------------------------------------------------------------------------------------------------

variable "gcp_project_id" {
  description = "Id of the GCP project"
  type        = string
}

variable "region" {
  description = "Region for GCP resources. See https://cloud.google.com/compute/docs/regions-zones"
  type        = string
}
