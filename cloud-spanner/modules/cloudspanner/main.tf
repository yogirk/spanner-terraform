terraform {
  required_version = ">= 0.13.1" # see https://releases.hashicorp.com/terraform/
}

locals {
  instance_id           = format("%s-%s", var.instance_id, var.suffix)
  instance_display_name = format("%s-%s", var.instance_display_name, var.suffix)
  display_name          = var.instance_display_name == "" ? local.instance_id : local.instance_display_name
  dbname                = format("%s-%s", var.dbname, var.suffix)
}

resource "google_project_service" "compute_api" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "spanner_api" {
  service            = "spanner.googleapis.com"
  disable_on_destroy = false
}

resource "google_spanner_instance" "stockapp" {
  name         = local.instance_id
  config       = var.config
  display_name = local.display_name
  num_nodes    = var.num_nodes
  project      = var.gcp_project_id
  labels       = var.labels_var
}

resource "google_spanner_database" "stockapp_database" {
  instance            = google_spanner_instance.stockapp.name
  name                = local.dbname
  deletion_protection = var.deletion_protection
}
