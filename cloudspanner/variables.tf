
// Required

variable "project_id" {
  description = "The project ID to to which Spanner will be deployed"
  type        = string
}

// Required

variable "instanceid" {
    description = "A Unique identifier for the instance (appears on GCP Console)"
    type = string
}

// Required 
variable "config" {
    description = "Cloud Spanner Instance config - Regional / multi-region. For allowed configurations, check: https://bit.ly/3niKT3r"
    type = string
    #default = "regional-us-west1"
}

// Required
variable "display_name" {
    description = "Display name for Cloud Spanner instance (appears of GCP console)"
    type = string
}

// Required

variable "num_nodes" {
    description = "Cloud Spanner instance configuration: Select number of nodes"
    type = number
    #default = 1
}

// Required

variable "dbname" {
    description = "Name of the database in Cloud Spanner"
    type = string
    default = "omegatradedb"
}

