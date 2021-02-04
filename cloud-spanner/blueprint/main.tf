resource "random_string" "launch_id" {
  length  = 4
  special = false
  upper   = false
}

locals {
  suffix = format("%s-%s", "tf", random_string.launch_id.result)
}

module omegatrade {
  source                = "../modules/cloudspanner"
  suffix                = local.suffix
  gcp_project_id        = var.gcp_project_id
  instance_id           = "omega-trade"
  dbname                = "omega-trade"
  labels_var            = { env = "test" }
}
