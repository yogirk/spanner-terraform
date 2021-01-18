output "service_name" {
  description = "Name of Google Cloud Run Service"
  value       = local.service_name
}

output "region" {
  description = "Region in which Cloud Run being deployed"
  value       = var.region
}

output "container_image_path" {
  description = "Application container image path"
  value       = var.container_image_path
}

output "latest_revision" {
  description = "Current version of deployed Cloud Run service"
  value       = var.latest_revision
}
