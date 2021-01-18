terraform {
  backend "gcs" {
    bucket = "rohan-terraform"
    prefix = "main"
  }
}

module infra {
  source         = "./blueprint/"
  gcp_project_id = "searce-academy"
  region         = "us-central1"
}