# Python Libraries

This directory contains Python libraries for the AEP types.

## Development

To install dependencies and run tests, use the following commands:

```bash
pip install -e .[dev]
pytest
```

## Regenerating Protobuf Files

When the source `.proto` files in the repository are updated, the generated Python files must be regenerated. To do this, run the following script from the root of the repository:

```bash
./python/regenerate.sh
```
