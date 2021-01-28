resource "random_string" "launch_id" {
  length  = 4
  special = false
  upper   = false
}

locals {
  suffix = format("%s-%s", "tf", random_string.launch_id.result)
}

module stockapp {
  source                = "../modules/cloudspanner"
  suffix                = local.suffix
  gcp_project_id        = var.gcp_project_id
  instance_id           = "stockapp"
  dbname                = "stockapp-db"
  labels_var            = { env = "test" }
}
