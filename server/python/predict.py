"""Indicative textile price estimator.

This is a transparent rule-based baseline, not a trained ML model or live market feed.
Use real, dated supplier quotes and evaluate a model before presenting estimates as ML.
"""
import sys

if len(sys.argv) != 7:
    print("Expected fabricType, material, gsm, quality, demand, season", file=sys.stderr)
    raise SystemExit(2)

fabric_type, material, gsm_raw, quality, demand, season = sys.argv[1:]
try:
    gsm = int(gsm_raw)
except ValueError:
    print("GSM must be an integer", file=sys.stderr)
    raise SystemExit(2)

if not 50 <= gsm <= 1000:
    print("GSM must be between 50 and 1000", file=sys.stderr)
    raise SystemExit(2)

material_base = {
    "cotton": 180,
    "linen": 260,
    "silk": 480,
    "denim": 230,
    "polyester": 130,
    "wool": 340,
    "viscose": 170,
    "nylon": 210,
}
base = material_base.get(material.lower(), 180)
price = base + (gsm * 0.65)

quality_multiplier = {"standard": 1.0, "premium": 1.3, "luxury": 1.7}
demand_multiplier = {"low": 0.92, "medium": 1.0, "high": 1.12}
season_multiplier = {"summer": 1.0, "winter": 1.05, "rainy": 1.02, "all season": 1.0}

price *= quality_multiplier.get(quality.lower(), 1.0)
price *= demand_multiplier.get(demand.lower(), 1.0)
price *= season_multiplier.get(season.lower(), 1.0)

fabric_name = fabric_type.lower()
if any(term in fabric_name for term in ("organic", "handloom", "hand-woven")):
    price *= 1.12
if any(term in fabric_name for term in ("blend", "mixed")):
    price *= 0.96

print(round(price))
