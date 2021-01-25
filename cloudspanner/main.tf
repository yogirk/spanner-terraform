provider "google" {
  project = var.project_id
}

resource "google_spanner_instance" "main" {
  name = var.instanceid
  config       = var.config
  display_name = var.display_name
  num_nodes    = var.num_nodes
  labels = {
    "env" = "test"
  }
}

resource "google_spanner_database" "database" {
  instance = google_spanner_instance.main.name
  name     = var.dbname
  deletion_protection = false
}



