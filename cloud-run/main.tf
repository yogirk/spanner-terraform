terraform {
  backend "gcs" {
    bucket = "terraform-states-searce-academy"
    prefix = "main"
  }
}

module infra {
  source         = "./blueprint/"
  gcp_project_id = "searce-academy"
  region         = "us-central1"
}