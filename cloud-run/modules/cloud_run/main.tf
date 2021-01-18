terraform {
  required_version = ">= 0.13.1" # see https://releases.hashicorp.com/terraform/
}

locals {
  service_name = format("%s-%s", var.service_name, var.suffix)
}

resource "google_project_service" "gcr_api" {
  service            = "containerregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_run_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "compute_api" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_cloud_run_service" "stock_app" {
  name     = local.service_name
  location = var.region
  project  = var.gcp_project_id

  template {
    spec {
      containers {
        image = var.container_image_path
        ports {
          container_port = var.container_port
        }
        dynamic "env" {
          for_each = var.env_var

          content {
            name  = env_var.key
            value = env_var.value
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = var.latest_revision
  }

  timeouts {
    create = var.cloud_run_timeout
    update = var.cloud_run_timeout
    delete = var.cloud_run_timeout
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.stock_app.location
  service     = google_cloud_run_service.stock_app.name
  project     = google_cloud_run_service.stock_app.project
  policy_data = data.google_iam_policy.noauth.policy_data
}