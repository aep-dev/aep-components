#!/bin/bash
set -euo pipefail

# This script regenerates the Python protobuf-generated files using buf.
# It is designed to be run from the root of the repository.

# --- Main Logic ---
echo "Regenerating Python protobuf files using 'buf generate'..."

# The `buf generate` command reads the `buf.gen.yaml` file for configuration,
# which specifies the plugins to use and the output directory.
# We target the `proto/aep-type` module to ensure we only generate code
# for the types, not the APIs or other modules.
buf generate proto/aep-type

echo "Successfully regenerated Python files."