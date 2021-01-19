terraform {
  backend "gcs" {
    bucket = "[gcp-terraform-bucket-name]"
    prefix = "main"
  }
}

module infra {
  source         = "./blueprint/"
  gcp_project_id = "[gcp-project-id]"
  region         = "us-central1"
}
