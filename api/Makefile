# Makefile for NestJS project
# Define the NestJS CLI command without npx
NEST_CMD = nest g
# Default target
.PHONY: help
help:
	@echo "Makefile for NestJS project"
	@echo "Available commands:"
	@echo "  make controller name=<name>  Generate a new controller"
	@echo "  make service name=<name>     Generate a new service"
	@echo "  make module name=<name>      Generate a new module"
	@echo "  make resource name=<name>    Generate a new resource"
	@echo "  make all name=<name>         Generate controller, service, and module"
# Generate a new controller
.PHONY: controller
controller:
	$(NEST_CMD) controller $(name) --no-spec
# Generate a new service
.PHONY: service
service:
	$(NEST_CMD) service $(name) --no-spec
# Generate a new module
.PHONY: module
module:
	$(NEST_CMD) module $(name)
# Generate a new resource (controller + service + module)
.PHONY: resource
resource:
	$(NEST_CMD) resource $(name) --no-spec
