# AEP Components Makefile

.PHONY: lint install

# Install dependencies
install:
	npm install

# Run linting with prettier
lint: install
	npx prettier --check **/*.md

# Fix all files automatically, best effort.
fix: install
	npx prettier --write **/*.md