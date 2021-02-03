resource "random_string" "launch_id" {
  length  = 4
  special = false
  upper   = false
}

locals {
  suffix = format("%s-%s", "tf", random_string.launch_id.result)
}

module "cloud_run_frontend" {
  source               = "../../modules/cloud_run"
  suffix               = local.suffix
  service_name         = "omegatrade-frontend"
  container_image_path = "gcr.io/[project-id]/frontend/path:tag"
  region               = var.region
  gcp_project_id       = var.gcp_project_id
}
