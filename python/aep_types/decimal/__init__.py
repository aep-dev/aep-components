import yaml
from importlib import resources
from decimal import Decimal
from typing import Dict, Any
import jsonschema

from aep_types.aep_type.aep.type import decimal_pb2

# Load the schema
schema_file = resources.files('aep_types').joinpath('schemas', 'type', 'decimal.yaml')
with schema_file.open('r') as f:
    DECIMAL_SCHEMA = yaml.safe_load(f)

def to_proto(d: Decimal) -> decimal_pb2.Decimal:
    """Converts a Python `decimal.Decimal` to a protobuf `Decimal` message."""
    sign, digits, exponent = d.as_tuple()

    significand = int("".join(map(str, digits)))
    if sign:
        significand = -significand

    return decimal_pb2.Decimal(significand=significand, exponent=exponent)

def from_proto(p: decimal_pb2.Decimal) -> Decimal:
    """Converts a protobuf `Decimal` message to a Python `decimal.Decimal`."""
    sign = 1 if p.significand < 0 else 0
    digits = tuple(map(int, str(abs(p.significand))))
    return Decimal((sign, digits, p.exponent))

def to_json(d: Decimal) -> Dict[str, Any]:
    """Converts a Python `decimal.Decimal` to a JSON-serializable dictionary."""
    sign, digits, exponent = d.as_tuple()

    significand = int("".join(map(str, digits)))
    if sign:
        significand = -significand

    return {"significand": significand, "exponent": exponent}

def from_json(j: Dict[str, Any]) -> Decimal:
    """Converts a JSON-serializable dictionary to a Python `decimal.Decimal`."""
    jsonschema.validate(j, DECIMAL_SCHEMA)

    significand = j["significand"]
    exponent = j["exponent"]

    sign = 1 if significand < 0 else 0
    digits = tuple(map(int, str(abs(significand))))
    return Decimal((sign, digits, exponent))