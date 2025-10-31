import pytest
import jsonschema
from decimal import Decimal
from aep_types.decimal import to_proto, from_proto, to_json, from_json
from aep_types.aep.type import decimal_pb2

def test_to_proto():
    d = Decimal("12.3")
    p = to_proto(d)
    assert isinstance(p, decimal_pb2.Decimal)
    assert p.significand == 123
    assert p.exponent == -1

def test_from_proto():
    p = decimal_pb2.Decimal(significand=-456, exponent=2)
    d = from_proto(p)
    assert d == Decimal("-45600")

def test_to_json():
    d = Decimal("0.789")
    j = to_json(d)
    assert j == {"significand": 789, "exponent": -3}

def test_from_json():
    j = {"significand": -101, "exponent": 4}
    d = from_json(j)
    assert d == Decimal("-1010000")

def test_round_trip_proto():
    d_original = Decimal("-123.456e7")
    p = to_proto(d_original)
    d_new = from_proto(p)
    assert d_original == d_new

def test_round_trip_json():
    d_original = Decimal("789.012e-3")
    j = to_json(d_original)
    d_new = from_json(j)
    assert d_original == d_new

def test_spec_example():
    # 33.5 million === {significand: 335, exponent: 5}
    d = from_json({"significand": 335, "exponent": 5})
    assert d == Decimal("33500000")

def test_from_json_invalid():
    with pytest.raises(jsonschema.ValidationError):
        from_json({"significand": 123})  # Missing exponent
    with pytest.raises(jsonschema.ValidationError):
        from_json({"exponent": -1})  # Missing significand
    with pytest.raises(jsonschema.ValidationError):
        from_json({"significand": "123", "exponent": -1})  # Wrong type