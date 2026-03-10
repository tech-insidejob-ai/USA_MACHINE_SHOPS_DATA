#!/usr/bin/env python3
"""Preprocess USA machine shops CSV into JSON files for the dashboard."""

import csv
import json
import os
from collections import Counter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
CSV_PATH = os.path.join(PROJECT_DIR, "data", "usa_machine_shops.csv")
OUTPUT_DIR = os.path.join(PROJECT_DIR, "public", "data")

BUCKET_ORDER = ["0", "1-5", "6-10", "11-25", "26-50", "51-100", "101-250", "251-500"]


def get_bucket(emp):
    if emp == 0:
        return "0"
    elif emp <= 5:
        return "1-5"
    elif emp <= 10:
        return "6-10"
    elif emp <= 25:
        return "11-25"
    elif emp <= 50:
        return "26-50"
    elif emp <= 100:
        return "51-100"
    elif emp <= 250:
        return "101-250"
    else:
        return "251-500"


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Loaded {len(rows)} records")

    states = Counter()
    cities = Counter()
    emp_buckets = Counter()
    state_emp = {}
    website_count = 0
    desc_count = 0
    total_emp = 0
    emp_list = []

    shops = []
    geo = []

    for r in rows:
        state = r.get("state", "").strip()
        city = r.get("city", "").strip()
        emp_str = r.get("employees", "").strip()
        emp = int(emp_str) if emp_str else 0
        website = r.get("website", "").strip()
        desc = r.get("description", "").strip()
        lat = r.get("latitude", "").strip()
        lng = r.get("longitude", "").strip()
        name = r.get("company_name", "").strip()

        if state:
            states[state] += 1
        if city:
            cities[(city, state)] += 1

        bucket = get_bucket(emp)
        emp_buckets[bucket] += 1

        if state not in state_emp:
            state_emp[state] = Counter()
        state_emp[state][bucket] += 1

        if website:
            website_count += 1
        if desc:
            desc_count += 1

        total_emp += emp
        emp_list.append(emp)

        if lat and lng:
            geo.append(
                {
                    "id": r.get("id", ""),
                    "n": name[:60],
                    "la": round(float(lat), 4),
                    "lo": round(float(lng), 4),
                    "c": city,
                    "s": state,
                    "e": emp,
                }
            )

        shops.append(
            {
                "id": r.get("id", ""),
                "name": name,
                "city": city,
                "state": state,
                "employees": emp,
                "website": website,
                "address": r.get("address", "").strip(),
            }
        )

    emp_list.sort()
    median_emp = emp_list[len(emp_list) // 2] if emp_list else 0

    shops_by_state = [{"state": s, "count": c} for s, c in states.most_common(50)]
    shops_by_city = [
        {"city": city, "state": state, "count": c}
        for (city, state), c in cities.most_common(30)
    ]
    emp_dist = [{"range": b, "count": emp_buckets.get(b, 0)} for b in BUCKET_ORDER]

    top_states = [s for s, _ in states.most_common(10)]
    state_composition = []
    for s in top_states:
        entry = {"state": s}
        for b in BUCKET_ORDER:
            entry[b] = state_emp.get(s, {}).get(b, 0)
        state_composition.append(entry)

    all_states = sorted(states.keys())

    stats = {
        "totalShops": len(rows),
        "totalStates": len(states),
        "totalCities": len(cities),
        "avgEmployees": round(total_emp / len(rows), 1) if rows else 0,
        "medianEmployees": median_emp,
        "websiteCount": website_count,
        "descriptionCount": desc_count,
        "shopsByState": shops_by_state,
        "shopsByCity": shops_by_city,
        "employeeDistribution": emp_dist,
        "stateComposition": state_composition,
        "allStates": all_states,
    }

    with open(os.path.join(OUTPUT_DIR, "stats.json"), "w") as f:
        json.dump(stats, f, separators=(",", ":"))
    print("Wrote stats.json")

    with open(os.path.join(OUTPUT_DIR, "geo.json"), "w") as f:
        json.dump(geo, f, separators=(",", ":"))
    print(f"Wrote geo.json ({len(geo)} records)")

    with open(os.path.join(OUTPUT_DIR, "shops.json"), "w") as f:
        json.dump(shops, f, separators=(",", ":"))
    print(f"Wrote shops.json ({len(shops)} records)")


if __name__ == "__main__":
    main()
