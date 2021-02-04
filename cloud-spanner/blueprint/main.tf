resource "random_string" "launch_id" {
  length  = 4
  special = false
  upper   = false
}

locals {
  suffix = format("%s-%s", "tf", random_string.launch_id.result)
}

module zian {
  source                = "../modules/cloudspanner"
  suffix                = local.suffix
  gcp_project_id        = var.gcp_project_id
  instance_id           = "zian"
  dbname                = "zian-db"
  labels_var            = { env = "test" }
}
