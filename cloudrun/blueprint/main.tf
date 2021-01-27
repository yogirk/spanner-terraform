resource "random_string" "launch_id" {
  length  = 4
  special = false
  upper   = false
}

locals {
  suffix = format("%s-%s", "tf", random_string.launch_id.result)
}

module "cloud_run_backend" {
  source               = "../modules/cloud_run"
  suffix               = local.suffix
  service_name         = "rohan-backend"
  container_image_path = "gcr.io/searce-academy/backend:v1"
  region               = var.region
  gcp_project_id       = var.gcp_project_id
  env_var = {
    "INSTANCE"   = "<enter-spanner-instance-id>",
    "DATABASE"   = "<enter-spanner-database-name>",
    "EXPIRE_IN"  = "2d",
    "JWT_SECRET" = "w54p3Y?4dj%8Xqa2jjVC84narhe5Pk",
    "PROJECTID"  = "<enter-GCP-project-id>"
  }
}

module "cloud_run_frontend" {
  source               = "../modules/cloud_run"
  suffix               = local.suffix
  service_name         = "rohan-frontend"
  container_image_path = "gcr.io/searce-academy/backend:v1"
  region               = var.region
  gcp_project_id       = var.gcp_project_id
}
