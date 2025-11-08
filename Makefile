# AEP Components Makefile

.PHONY: lint install

# Install dependencies
install:
	npm install

# Run linting with prettier
lint: install
	npx prettier --check **/*.md

# Format files with prettier
format: install
	npx prettier --write **/*.md