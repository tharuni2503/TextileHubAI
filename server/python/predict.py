import sys

fabric = sys.argv[1]
material = sys.argv[2]
gsm = int(sys.argv[3])
quality = sys.argv[4]
demand = sys.argv[5]
season = sys.argv[6]

price = 100

if material.lower() == "cotton":
    price += 150

elif material.lower() == "linen":
    price += 250

elif material.lower() == "silk":
    price += 400

price += gsm * 0.4

if quality.lower() == "premium":
    price += 200

if demand.lower() == "high":
    price += 150

if season.lower() == "winter":
    price += 50

print(round(price))