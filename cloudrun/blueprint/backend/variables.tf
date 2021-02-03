## --- REQUIRED PARAMETERS ------------------------------------------------------------------------------------------------

variable "gcp_project_id" {
  description = "Id of the GCP project"
  type        = string
  default     = "searce-academy" 
}

variable "region" {
  description = "Region for GCP resources. See https://cloud.google.com/compute/docs/regions-zones"
  type        = string
  default     = "us-central1"
}
